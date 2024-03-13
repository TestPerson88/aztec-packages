import { EthAddress } from '@aztec/foundation/eth-address';
import { createDebugLogger } from '@aztec/foundation/log';
import { fileURLToPath } from '@aztec/foundation/url';
import { RollupAbi } from '@aztec/l1-artifacts';

import { createPublicClient, getAddress, getContract, http } from 'viem';
import { localhost } from 'viem/chains';

import { Archiver, getConfigEnvVars } from './archiver/index.js';
import { MemoryArchiverStore } from './archiver/memory_archiver_store/memory_archiver_store.js';

export * from './archiver/index.js';
export * from './rpc/index.js';

const log = createDebugLogger('aztec:archiver');

/**
 * A function which instantiates and starts Archiver.
 */
// eslint-disable-next-line require-await
async function main() {
  const config = getConfigEnvVars();
  const { rpcUrl, l1Contracts } = config;

  const publicClient = createPublicClient({
    chain: localhost,
    transport: http(rpcUrl),
  });

  const archiverStore = new MemoryArchiverStore(1000);

  // TODO(#4492): Nuke this once the old inbox is purged
  let newInboxAddress!: EthAddress;
  {
    const rollup = getContract({
      address: getAddress(l1Contracts.rollupAddress.toString()),
      abi: RollupAbi,
      client: publicClient,
    });
    newInboxAddress = EthAddress.fromString(await rollup.read.NEW_INBOX());
  }

  const archiver = new Archiver(
    publicClient,
    l1Contracts.rollupAddress,
    l1Contracts.availabilityOracleAddress,
    l1Contracts.inboxAddress,
    newInboxAddress,
    l1Contracts.registryAddress,
    archiverStore,
  );

  const shutdown = async () => {
    await archiver.stop();
    process.exit(0);
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

// See https://twitter.com/Rich_Harris/status/1355289863130673153
if (process.argv[1] === fileURLToPath(import.meta.url).replace(/\/index\.js$/, '')) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  main().catch(err => {
    log.error(err);
    process.exit(1);
  });
}
