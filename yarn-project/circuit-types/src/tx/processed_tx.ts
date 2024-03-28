import {
  EncryptedTxL2Logs,
  PublicDataWrite,
  type SimulationError,
  type Tx,
  TxEffect,
  TxHash,
  UnencryptedTxL2Logs,
} from '@aztec/circuit-types';
import {
  FixedDAGasUsed,
  Fr,
  type Header,
  type Proof,
  PublicAccumulatedNonRevertibleData,
  PublicAccumulatedRevertibleData,
  PublicKernelCircuitPublicInputs,
  type SideEffect,
  type SideEffectLinkedToNoteHash,
  ValidationRequests,
  makeEmptyProof,
} from '@aztec/circuits.js';

/**
 * Represents a tx that has been processed by the sequencer public processor,
 * so its kernel circuit public inputs are filled in.
 */
export type ProcessedTx = Pick<Tx, 'proof' | 'encryptedLogs' | 'unencryptedLogs'> & {
  /**
   * Output of the public kernel circuit for this tx.
   */
  data: PublicKernelCircuitPublicInputs;
  /**
   * Hash of the transaction.
   */
  hash: TxHash;
  /**
   * Flag indicating the tx is 'empty' meaning it's a padding tx to take us to a power of 2.
   */
  isEmpty: boolean;

  /**
   * Reason the tx was reverted.
   */
  revertReason: SimulationError | undefined;
};

export type RevertedTx = ProcessedTx & {
  data: PublicKernelCircuitPublicInputs & {
    reverted: true;
  };

  revertReason: SimulationError;
};

export function isRevertedTx(tx: ProcessedTx): tx is RevertedTx {
  return !tx.data.endNonRevertibleData.revertCode.isOK();
}

export function partitionReverts(txs: ProcessedTx[]): { reverted: RevertedTx[]; nonReverted: ProcessedTx[] } {
  return txs.reduce(
    ({ reverted, nonReverted }, tx) => {
      if (isRevertedTx(tx)) {
        reverted.push(tx);
      } else {
        nonReverted.push(tx);
      }
      return { reverted, nonReverted };
    },
    { reverted: [], nonReverted: [] } as ReturnType<typeof partitionReverts>,
  );
}

/**
 * Represents a tx that failed to be processed by the sequencer public processor.
 */
export type FailedTx = {
  /**
   * The failing transaction.
   */
  tx: Tx;
  /**
   * The error that caused the tx to fail.
   */
  error: Error;
};

/**
 *
 * @param tx - the TX being procesed
 * @param publicKernelPublicInput - the output of the public kernel circuit, unless we just came from private
 * @param publicKernelProof - the proof of the public kernel circuit, unless we just came from private
 * @returns PublicKernelCircuitPublicInputs, either passed through from the input or converted from the output of the TX,
 * and Proof, either passed through from the input or the proof of the TX
 */
export function getPreviousOutputAndProof(
  tx: Tx,
  publicKernelPublicInput?: PublicKernelCircuitPublicInputs,
  publicKernelProof?: Proof,
): {
  /**
   * the output of the public kernel circuit for this phase
   */
  publicKernelPublicInput: PublicKernelCircuitPublicInputs;
  /**
   * the proof of the public kernel circuit for this phase
   */
  previousProof: Proof;
} {
  if (publicKernelPublicInput && publicKernelProof) {
    return {
      publicKernelPublicInput,
      previousProof: publicKernelProof,
    };
  } else {
    const publicKernelPublicInput = new PublicKernelCircuitPublicInputs(
      tx.data.aggregationObject,
      tx.data.rollupValidationRequests,
      ValidationRequests.empty(),
      PublicAccumulatedNonRevertibleData.fromPrivateAccumulatedNonRevertibleData(tx.data.endNonRevertibleData),
      PublicAccumulatedRevertibleData.fromPrivateAccumulatedRevertibleData(tx.data.end),
      tx.data.constants,
      tx.data.needsSetup,
      tx.data.needsAppLogic,
      tx.data.needsTeardown,
    );
    return {
      publicKernelPublicInput,
      previousProof: publicKernelProof || tx.proof,
    };
  }
}

/**
 * Makes a processed tx out of source tx.
 * @param tx - Source tx.
 * @param kernelOutput - Output of the kernel circuit simulation for this tx.
 * @param proof - Proof of the kernel circuit for this tx.
 */
export function makeProcessedTx(
  tx: Tx,
  kernelOutput?: PublicKernelCircuitPublicInputs,
  proof?: Proof,
  revertReason?: SimulationError,
): ProcessedTx {
  const { publicKernelPublicInput, previousProof } = getPreviousOutputAndProof(tx, kernelOutput, proof);
  return {
    hash: tx.getTxHash(),
    data: publicKernelPublicInput,
    proof: previousProof,
    encryptedLogs: revertReason ? EncryptedTxL2Logs.empty() : tx.encryptedLogs,
    unencryptedLogs: revertReason ? UnencryptedTxL2Logs.empty() : tx.unencryptedLogs,
    isEmpty: false,
    revertReason,
  };
}

/**
 * Makes an empty tx from an empty kernel circuit public inputs.
 * @returns A processed empty tx.
 */
export function makeEmptyProcessedTx(header: Header, chainId: Fr, version: Fr): ProcessedTx {
  const emptyKernelOutput = PublicKernelCircuitPublicInputs.empty();
  emptyKernelOutput.constants.historicalHeader = header;
  emptyKernelOutput.constants.txContext.chainId = chainId;
  emptyKernelOutput.constants.txContext.version = version;
  emptyKernelOutput.endNonRevertibleData.daGasUsed = FixedDAGasUsed;
  const emptyProof = makeEmptyProof();

  const hash = new TxHash(Fr.ZERO.toBuffer());
  return {
    hash,
    encryptedLogs: EncryptedTxL2Logs.empty(),
    unencryptedLogs: UnencryptedTxL2Logs.empty(),
    data: emptyKernelOutput,
    proof: emptyProof,
    isEmpty: true,
    revertReason: undefined,
  };
}

export function toTxEffect(tx: ProcessedTx): TxEffect {
  return new TxEffect(
    tx.data.combinedData.daGasUsed,
    tx.data.combinedData.revertCode,
    tx.data.combinedData.newNoteHashes.map((c: SideEffect) => c.value).filter(h => !h.isZero()),
    tx.data.combinedData.newNullifiers.map((n: SideEffectLinkedToNoteHash) => n.value).filter(h => !h.isZero()),
    tx.data.combinedData.newL2ToL1Msgs.filter(h => !h.isZero()),
    tx.data.combinedData.publicDataUpdateRequests
      .map(t => new PublicDataWrite(t.leafSlot, t.newValue))
      .filter(h => !h.isEmpty()),
    tx.encryptedLogs || EncryptedTxL2Logs.empty(),
    tx.unencryptedLogs || UnencryptedTxL2Logs.empty(),
  );
}

function validateProcessedTxLogs(tx: ProcessedTx): void {
  const unencryptedLogs = tx.unencryptedLogs || UnencryptedTxL2Logs.empty();
  const kernelUnencryptedLogsHash = tx.data.combinedData.unencryptedLogsHash;
  const referenceHash = Fr.fromBuffer(unencryptedLogs.hash());
  if (!referenceHash.equals(kernelUnencryptedLogsHash)) {
    throw new Error(
      `Unencrypted logs hash mismatch. Expected ${referenceHash.toString()}, got ${kernelUnencryptedLogsHash.toString()}.
             Processed: ${JSON.stringify(unencryptedLogs.toJSON())}
             Kernel Length: ${tx.data.combinedData.unencryptedLogPreimagesLength}`,
    );
  }
}

export function validateProcessedTx(tx: ProcessedTx): void {
  validateProcessedTxLogs(tx);
  // TODO: validate other fields
}
