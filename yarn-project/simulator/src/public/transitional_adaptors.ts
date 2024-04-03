// All code in this file needs to die once the public executor is phased out in favor of the AVM.
import { UnencryptedFunctionL2Logs } from '@aztec/circuit-types';
import {
  CallContext,
  ContractStorageRead,
  ContractStorageUpdateRequest,
  FunctionData,
  type GlobalVariables,
  Header,
  L2ToL1Message,
  type ReadRequest,
  SideEffect,
  type SideEffectLinkedToNoteHash,
} from '@aztec/circuits.js';
import { Fr } from '@aztec/foundation/fields';

import { AvmContext } from '../avm/avm_context.js';
import { AvmContextInputs, AvmExecutionEnvironment } from '../avm/avm_execution_environment.js';
import { AvmContractCallResults } from '../avm/avm_message_call_result.js';
import { AvmPersistableStateManager, type JournalData } from '../avm/journal/journal.js';
import { Mov } from '../avm/opcodes/memory.js';
import { createSimulationError } from '../common/errors.js';
import { PackedArgsCache, SideEffectCounter } from '../index.js';
import { type PublicExecution, type PublicExecutionResult } from './execution.js';
import { PublicExecutionContext } from './public_execution_context.js';

/**
 * Convert a PublicExecution(Environment) object to an AvmExecutionEnvironment
 *
 * @param current
 * @param globalVariables
 * @returns
 */
export function createAvmExecutionEnvironment(
  current: PublicExecution,
  globalVariables: GlobalVariables,
): AvmExecutionEnvironment {
  return new AvmExecutionEnvironment(
    current.contractAddress,
    current.callContext.storageContractAddress,
    current.callContext.msgSender, // TODO: origin is not available
    current.callContext.msgSender,
    current.callContext.portalContractAddress,
    /*feePerL1Gas=*/ Fr.zero(),
    /*feePerL2Gas=*/ Fr.zero(),
    /*feePerDaGas=*/ Fr.zero(),
    /*contractCallDepth=*/ Fr.zero(),
    globalVariables,
    current.callContext.isStaticCall,
    current.callContext.isDelegateCall,
    current.args,
    current.functionData.selector,
  );
}

export async function createPublicExecutionContext(avmContext: AvmContext): Promise<PublicExecutionContext> {
  const callContext = CallContext.from({
    // CHECK sender, address, etc. It might be wrong.
    msgSender: avmContext.environment.isDelegateCall ? avmContext.environment.sender : avmContext.environment.address,
    storageContractAddress: avmContext.environment.isDelegateCall
      ? avmContext.environment.sender
      : avmContext.environment.address,
    portalContractAddress: avmContext.environment.portal,
    functionSelector: avmContext.environment.temporaryFunctionSelector,
    isDelegateCall: avmContext.environment.isDelegateCall,
    isStaticCall: avmContext.environment.isStaticCall,
    sideEffectCounter: 1, //avmContext.environment.sideEffectCounter,
  });
  const functionData = new FunctionData(avmContext.environment.temporaryFunctionSelector, /*isPrivate=*/ false);
  const execution: PublicExecution = {
    contractAddress: avmContext.environment.address,
    callContext,
    // Remove the AvmContextInputs from the calldata. It's ugly that we have to do this here.
    args: avmContext.environment.calldata.slice(AvmContextInputs.SIZE),
    functionData,
  };
  const packedArgs = PackedArgsCache.create([]);

  const header = Header.empty(); // FIXME
  await Promise.resolve();
  // const header = await avmContext.persistableState.hostStorage.commitmentsDb.getHeader(
  //   avmContext.environment.globals.blockNumber.toNumber(),
  // );
  // if (!header) {
  //   throw new Error(`Header not found for block number ${avmContext.environment.globals.blockNumber.toNumber()}`);
  // }

  const context = new PublicExecutionContext(
    execution,
    header, // FIXME
    avmContext.environment.globals,
    packedArgs,
    new SideEffectCounter(0),
    avmContext.persistableState.hostStorage.publicStateDb,
    avmContext.persistableState.hostStorage.contractsDb,
    avmContext.persistableState.hostStorage.commitmentsDb,
  );

  return context;
}

/**
 * Convert the result of an AVM contract call to a PublicExecutionResult for the public kernel
 *
 * @param execution
 * @param newWorldState
 * @param result
 * @returns
 */
export function convertAvmResults(
  execution: PublicExecution,
  newWorldState: JournalData,
  result: AvmContractCallResults,
): PublicExecutionResult {
  const newNoteHashes = newWorldState.newNoteHashes.map(noteHash => new SideEffect(noteHash, Fr.zero()));

  const contractStorageReads: ContractStorageRead[] = [];
  const reduceStorageReadRequests = (contractAddress: bigint, storageReads: Map<bigint, Fr[]>) => {
    return storageReads.forEach((innerArray, key) => {
      innerArray.forEach(value => {
        contractStorageReads.push(new ContractStorageRead(new Fr(key), new Fr(value), 0));
      });
    });
  };
  newWorldState.storageReads.forEach((storageMap: Map<bigint, Fr[]>, address: bigint) =>
    reduceStorageReadRequests(address, storageMap),
  );

  const contractStorageUpdateRequests: ContractStorageUpdateRequest[] = [];
  const reduceStorageUpdateRequests = (contractAddress: bigint, storageUpdateRequests: Map<bigint, Fr[]>) => {
    return storageUpdateRequests.forEach((innerArray, key) => {
      innerArray.forEach(value => {
        contractStorageUpdateRequests.push(new ContractStorageUpdateRequest(new Fr(key), new Fr(value), 0));
      });
    });
  };
  newWorldState.storageWrites.forEach((storageMap: Map<bigint, Fr[]>, address: bigint) =>
    reduceStorageUpdateRequests(address, storageMap),
  );

  const returnValues = result.output;

  // TODO(follow up in pr tree): NOT SUPPORTED YET, make sure hashing and log resolution is done correctly
  // Disabled.
  const nestedExecutions: PublicExecutionResult[] = [];
  const nullifierReadRequests: ReadRequest[] = [];
  const nullifierNonExistentReadRequests: ReadRequest[] = [];
  const newNullifiers: SideEffectLinkedToNoteHash[] = [];
  const unencryptedLogs = UnencryptedFunctionL2Logs.empty();
  const newL2ToL1Messages = newWorldState.newL1Messages.map(() => L2ToL1Message.empty());
  // TODO keep track of side effect counters
  const startSideEffectCounter = Fr.ZERO;
  const endSideEffectCounter = Fr.ZERO;

  return {
    execution,
    nullifierReadRequests,
    nullifierNonExistentReadRequests,
    newNoteHashes,
    newL2ToL1Messages,
    startSideEffectCounter,
    endSideEffectCounter,
    newNullifiers,
    contractStorageReads,
    contractStorageUpdateRequests,
    returnValues,
    nestedExecutions,
    unencryptedLogs,
    reverted: result.reverted,
    revertReason: result.revertReason ? createSimulationError(result.revertReason) : undefined,
  };
}

// FIXME: not enough, journal data is missing
export function convertPublicExecutionResult(res: PublicExecutionResult): [AvmContractCallResults, typeof undefined] {
  const results = new AvmContractCallResults(res.reverted, res.returnValues, res.revertReason);
  return [results, undefined];
}

export function isAvmBytecode(bytecode: Buffer): boolean {
  const magicBuf = Buffer.from([
    Mov.opcode, // opcode
    0x00, // indirect
    ...Buffer.from('000018ca', 'hex'), // srcOffset
    ...Buffer.from('000018ca', 'hex'), // dstOffset
  ]);
  const magicSize = magicBuf.length;
  return bytecode.subarray(-magicSize).equals(magicBuf);
}
