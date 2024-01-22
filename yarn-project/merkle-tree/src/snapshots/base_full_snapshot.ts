import { SiblingPath } from '@aztec/types/membership';

import { LevelUp, LevelUpChain } from 'levelup';

import { TreeBase } from '../tree_base.js';
import { TreeSnapshot, TreeSnapshotBuilder } from './snapshot_builder.js';

// key for a node's children
const snapshotChildKey = (node: Buffer, child: 0 | 1) =>
  Buffer.concat([Buffer.from('snapshot:node:'), node, Buffer.from(':' + child)]);

// metadata for a snapshot
const snapshotRootKey = (treeName: string, block: number) => `snapshot:root:${treeName}:${block}`;
const snapshotNumLeavesKey = (treeName: string, block: number) => `snapshot:numLeaves:${treeName}:${block}`;

/**
 * Builds a full snapshot of a tree. This implementation works for any Merkle tree and stores
 * it in a database in a similar way to how a tree is stored in memory, using pointers.
 *
 * Sharing the same database between versions and trees is recommended as the trees would share
 * structure.
 *
 * Implement the protected method `handleLeaf` to store any additional data you need for each leaf.
 *
 * Complexity:
 * N - count of non-zero nodes in tree
 * M - count of snapshots
 * H - tree height
 * Worst case space complexity: O(N * M)
 * Sibling path access: O(H) database reads
 */
export abstract class BaseFullTreeSnapshotBuilder<T extends TreeBase, S extends TreeSnapshot>
  implements TreeSnapshotBuilder<S>
{
  constructor(protected db: LevelUp, protected tree: T) {}

  async snapshot(block: number): Promise<S> {
    const snapshotMetadata = await this.#getSnapshotMeta(block);

    if (snapshotMetadata) {
      return this.openSnapshot(snapshotMetadata.root, snapshotMetadata.numLeaves);
    }

    const batch = this.db.batch();
    const root = this.tree.getRoot(false);
    const numLeaves = this.tree.getNumLeaves(false);
    const depth = this.tree.getDepth();
    const queue: [Buffer, number, bigint][] = [[root, 0, 0n]];

    // walk the tree breadth-first and store each of its nodes in the database
    // for each node we save two keys
    //   <node hash>:0 -> <left child's hash>
    //   <node hash>:1 -> <right child's hash>
    while (queue.length > 0) {
      const [node, level, i] = queue.shift()!;
      // check if the database already has a child for this tree
      // if it does, then we know we've seen the whole subtree below it before
      // and we don't have to traverse it anymore
      // we use the left child here, but it could be anything that shows we've stored the node before
      const exists: Buffer | undefined = await this.db.get(snapshotChildKey(node, 0)).catch(() => undefined);
      if (exists) {
        continue;
      }

      if (level + 1 > depth) {
        // short circuit if we've reached the leaf level
        // otherwise getNode might throw if we ask for the children of a leaf
        await this.handleLeaf(i, node, batch);
        continue;
      }

      const [lhs, rhs] = await Promise.all([
        this.tree.getNode(level + 1, 2n * i),
        this.tree.getNode(level + 1, 2n * i + 1n),
      ]);

      // we want the zero hash at the children's level, not the node's level
      const zeroHash = this.tree.getZeroHash(level + 1);

      batch.put(snapshotChildKey(node, 0), lhs ?? zeroHash);
      batch.put(snapshotChildKey(node, 1), rhs ?? zeroHash);

      // enqueue the children only if they're not zero hashes
      if (lhs) {
        queue.push([lhs, level + 1, 2n * i]);
      }

      if (rhs) {
        queue.push([rhs, level + 1, 2n * i + 1n]);
      }
    }

    batch.put(snapshotRootKey(this.tree.getName(), block), root);
    batch.put(snapshotNumLeavesKey(this.tree.getName(), block), String(numLeaves));
    await batch.write();

    return this.openSnapshot(root, numLeaves);
  }

  // This restore will invalidate BUT NOT THROW all the rest of the 
  async restore(blockToRestore: number, currentBlock: number) {
    const snapshotMetadata = await this.#getSnapshotMeta(blockToRestore);

    if (snapshotMetadata === undefined) {
      throw new Error('fucked')
    }

    const batch = this.db.batch();
    const pruneBatch = this.db.batch();

    const treeName = this.tree.getName();

    const { root: snapshotRoot, numLeaves } = snapshotMetadata;
    const depth = this.tree.getDepth();
    const queue: [Buffer | undefined, number, bigint][] = [[snapshotRoot, 0, 0n]];

    while (queue.length > 0) {
      const [snapshotNode, level, i] = queue.shift()!;

      const node = (await this.tree.getNode(level, i))!;

      // assumes zero hash should be deleted, as it didn't exist before snapshot
      // was created, as currently undefined children get saved as zero hash
      if ((snapshotNode === undefined && node !== undefined) || 
        (level !== 0 && snapshotNode === this.tree.getZeroHash(level))) {
        batch.del(`${treeName}:${level}:${i}`);
      } else if (snapshotNode === undefined && node === undefined) {
        continue;
      } else if (snapshotNode !== undefined) {
        if (node !== undefined && snapshotNode.equals(node)) {
          continue;
        }
        batch.put(`${treeName}:${level}:${i}`, snapshotNode);
      }

      if (level + 1 > depth) {
        await this.handleLeafRestore(i, node, snapshotNode, batch);
        continue;
      }

      let lhs: Buffer | undefined;
      let rhs: Buffer | undefined;

      if (snapshotNode === undefined) {
        [lhs, rhs] = [undefined, undefined];
      } else {
        [{value: lhs}, {value: rhs}] = await Promise.allSettled([
          this.db.get(snapshotChildKey(snapshotNode, 0)),
          this.db.get(snapshotChildKey(snapshotNode, 1)),
        ]) as { status: 'fulfilled' | 'rejected', value: Buffer}[];;
      }

      queue.push([lhs, level + 1, 2n * i]);
      queue.push([rhs, level + 1, 2n * i + 1n]);
    }

    await this.tree.snapshotRestoreUtil(numLeaves, snapshotRoot);

    new Array(currentBlock - blockToRestore).fill(1).map((v, i) => v + i + blockToRestore).forEach((blockToDelete) => {
      pruneBatch.del(snapshotNumLeavesKey(treeName, blockToDelete));
      pruneBatch.del(snapshotRootKey(treeName, blockToDelete));
    });

    await batch.write();
    await pruneBatch.write();

    return;
  }

  protected handleLeaf(_index: bigint, _node: Buffer, _batch: LevelUpChain) {
    return Promise.resolve();
  }

  protected handleLeafRestore(_index: bigint, _node: Buffer, _snapshotNode: Buffer | undefined, _batch: LevelUpChain): Promise<void> {
    return Promise.resolve();
  }

  async getSnapshot(version: number): Promise<S> {
    const snapshotMetadata = await this.#getSnapshotMeta(version);

    if (!snapshotMetadata) {
      throw new Error(`Version ${version} does not exist for tree ${this.tree.getName()}`);
    }

    return this.openSnapshot(snapshotMetadata.root, snapshotMetadata.numLeaves);
  }

  protected abstract openSnapshot(root: Buffer, numLeaves: bigint): S;

  async #getSnapshotMeta(block: number): Promise<
    | {
        /** The root of the tree snapshot */
        root: Buffer;
        /** The number of leaves in the tree snapshot */
        numLeaves: bigint;
      }
    | undefined
  > {
    try {
      const treeName = this.tree.getName();
      const root = await this.db.get(snapshotRootKey(treeName, block));
      const numLeaves = BigInt(await this.db.get(snapshotNumLeavesKey(treeName, block)));
      return { root, numLeaves };
    } catch (err) {
      return undefined;
    }
  }
}

/**
 * A source of sibling paths from a snapshot tree
 */
export class BaseFullTreeSnapshot implements TreeSnapshot {
  constructor(
    protected db: LevelUp,
    protected historicRoot: Buffer,
    protected numLeaves: bigint,
    protected tree: TreeBase,
  ) {}

  async getSiblingPath<N extends number>(index: bigint): Promise<SiblingPath<N>> {
    const siblings: Buffer[] = [];

    for await (const [_node, sibling] of this.pathFromRootToLeaf(index)) {
      siblings.push(sibling);
    }

    // we got the siblings we were looking for, but they are in root-leaf order
    // reverse them here so we have leaf-root (what SiblingPath expects)
    siblings.reverse();

    return new SiblingPath<N>(this.tree.getDepth() as N, siblings);
  }

  async getLeafValue(index: bigint): Promise<Buffer | undefined> {
    let leafNode: Buffer | undefined = undefined;
    for await (const [node, _sibling] of this.pathFromRootToLeaf(index)) {
      leafNode = node;
    }

    return leafNode;
  }

  getDepth(): number {
    return this.tree.getDepth();
  }

  getRoot(): Buffer {
    return this.historicRoot;
  }

  getNumLeaves(): bigint {
    return this.numLeaves;
  }

  protected async *pathFromRootToLeaf(leafIndex: bigint) {
    const root = this.historicRoot;
    const pathFromRoot = this.#getPathFromRoot(leafIndex);

    let node: Buffer = root;
    for (let i = 0; i < pathFromRoot.length; i++) {
      // get both children. We'll need both anyway (one to keep track of, the other to walk down to)
      const children: [Buffer, Buffer] = await Promise.all([
        this.db.get(snapshotChildKey(node, 0)),
        this.db.get(snapshotChildKey(node, 1)),
      ]).catch(() => [this.tree.getZeroHash(i + 1), this.tree.getZeroHash(i + 1)]);
      const next = children[pathFromRoot[i]];
      const sibling = children[(pathFromRoot[i] + 1) % 2];

      yield [next, sibling];

      node = next;
    }
  }

  /**
   * Calculates the path from the root to the target leaf. Returns an array of 0s and 1s,
   * each 0 represents walking down a left child and each 1 walking down to the child on the right.
   *
   * @param leafIndex - The target leaf
   * @returns An array of 0s and 1s
   */
  #getPathFromRoot(leafIndex: bigint): ReadonlyArray<0 | 1> {
    const path: Array<0 | 1> = [];
    let level = this.tree.getDepth();
    while (level > 0) {
      path.push(leafIndex & 0x01n ? 1 : 0);
      leafIndex >>= 1n;
      level--;
    }

    path.reverse();
    return path;
  }

  async findLeafIndex(value: Buffer): Promise<bigint | undefined> {
    const numLeaves = this.getNumLeaves();
    for (let i = 0n; i < numLeaves; i++) {
      const currentValue = await this.getLeafValue(i);
      if (currentValue && currentValue.equals(value)) {
        return i;
      }
    }
    return undefined;
  }
}
