import {
  FunctionCall,
  FunctionL2Logs,
  PublicDataWrite,
  SiblingPath,
  SimulationError,
  Tx,
  TxL2Logs,
  mockTx,
} from '@aztec/circuit-types';
import {
  ARGS_LENGTH,
  AztecAddress,
  CallContext,
  CallRequest,
  ContractStorageUpdateRequest,
  EthAddress,
  Fr,
  FunctionData,
  GlobalVariables,
  Header,
  MAX_NON_REVERTIBLE_PUBLIC_CALL_STACK_LENGTH_PER_TX,
  MAX_PRIVATE_CALL_STACK_LENGTH_PER_TX,
  MAX_REVERTIBLE_PUBLIC_CALL_STACK_LENGTH_PER_TX,
  PUBLIC_DATA_TREE_HEIGHT,
  PrivateKernelTailCircuitPublicInputs,
  Proof,
  PublicAccumulatedNonRevertibleData,
  PublicAccumulatedRevertibleData,
  PublicCallRequest,
  PublicKernelCircuitPublicInputs,
  makeEmptyProof,
} from '@aztec/circuits.js';
import { computePublicDataTreeLeafSlot } from '@aztec/circuits.js/hash';
import {
  fr,
  makeAztecAddress,
  makePrivateKernelTailCircuitPublicInputs,
  makePublicCallRequest,
  makeSelector,
} from '@aztec/circuits.js/testing';
import { makeTuple } from '@aztec/foundation/array';
import { arrayNonEmptyLength, padArrayEnd, times } from '@aztec/foundation/collection';
import { PublicExecution, PublicExecutionResult, PublicExecutor } from '@aztec/simulator';
import { MerkleTreeOperations, TreeInfo } from '@aztec/world-state';

import { jest } from '@jest/globals';
import { MockProxy, mock } from 'jest-mock-extended';

import { PublicProver } from '../prover/index.js';
import { WASMSimulator } from '../simulator/acvm_wasm.js';
import { PublicKernelCircuitSimulator } from '../simulator/index.js';
import { ContractsDataSourcePublicDB, WorldStatePublicDB } from '../simulator/public_executor.js';
import { RealPublicKernelCircuitSimulator } from '../simulator/public_kernel.js';
import { ProcessedTx, toTxEffect } from './processed_tx.js';
import { PublicProcessor } from './public_processor.js';

describe('public_processor', () => {
  let db: MockProxy<MerkleTreeOperations>;
  let publicExecutor: MockProxy<PublicExecutor>;
  let publicProver: MockProxy<PublicProver>;
  let publicContractsDB: MockProxy<ContractsDataSourcePublicDB>;
  let publicWorldStateDB: MockProxy<WorldStatePublicDB>;

  let proof: Proof;
  let root: Buffer;

  let processor: PublicProcessor;

  beforeEach(() => {
    db = mock<MerkleTreeOperations>();
    publicExecutor = mock<PublicExecutor>();
    publicProver = mock<PublicProver>();
    publicContractsDB = mock<ContractsDataSourcePublicDB>();
    publicWorldStateDB = mock<WorldStatePublicDB>();

    proof = makeEmptyProof();
    root = Buffer.alloc(32, 5);

    publicProver.getPublicCircuitProof.mockResolvedValue(proof);
    publicProver.getPublicKernelCircuitProof.mockResolvedValue(proof);
    db.getTreeInfo.mockResolvedValue({ root } as TreeInfo);
  });

  describe('with mock circuits', () => {
    let publicKernel: MockProxy<PublicKernelCircuitSimulator>;

    beforeEach(() => {
      publicKernel = mock<PublicKernelCircuitSimulator>();
      processor = new PublicProcessor(
        db,
        publicExecutor,
        publicKernel,
        publicProver,
        GlobalVariables.empty(),
        Header.empty(),
        publicContractsDB,
        publicWorldStateDB,
      );
    });

    it('skips txs without public execution requests', async function () {
      const seed = 1;
      const includeLogs = false;
      const tx = mockTx(seed, includeLogs);
      tx.data.end.publicCallStack = makeTuple(MAX_REVERTIBLE_PUBLIC_CALL_STACK_LENGTH_PER_TX, CallRequest.empty);
      tx.data.end.unencryptedLogsHash = [Fr.ZERO, Fr.ZERO];
      tx.data.endNonRevertibleData.publicCallStack = makeTuple(
        MAX_NON_REVERTIBLE_PUBLIC_CALL_STACK_LENGTH_PER_TX,
        CallRequest.empty,
      );
      tx.data.needsSetup = false;
      tx.data.needsAppLogic = false;
      tx.data.needsTeardown = false;

      const hash = tx.getTxHash();
      const [processed, failed] = await processor.process([tx]);

      expect(processed.length).toBe(1);

      const p = processed[0];
      const e: ProcessedTx = {
        hash,
        data: new PublicKernelCircuitPublicInputs(
          tx.data.aggregationObject,
          PublicAccumulatedNonRevertibleData.fromPrivateAccumulatedNonRevertibleData(tx.data.endNonRevertibleData),
          PublicAccumulatedRevertibleData.fromPrivateAccumulatedRevertibleData(tx.data.end),
          tx.data.constants,
          tx.data.needsSetup,
          tx.data.needsAppLogic,
          tx.data.needsTeardown,
          false, // reverted
        ),
        proof: tx.proof,
        encryptedLogs: tx.encryptedLogs,
        unencryptedLogs: tx.unencryptedLogs,
        isEmpty: false,
        revertReason: undefined,
      };

      // Jest is complaining that the two objects are not equal, but they are.
      // It expects something and says "Received: serializes to the same string"
      // TODO why can't we just expect(p).toEqual(e) here anymore?
      expect(Object.keys(p)).toEqual(Object.keys(e));
      for (const key in e) {
        if (key === 'data') {
          expect(p.data.toBuffer()).toEqual(e.data.toBuffer());
        } else {
          expect(p[key as keyof ProcessedTx]).toEqual(e[key as keyof ProcessedTx]);
        }
      }

      expect(failed).toEqual([]);
    });

    it('returns failed txs without aborting entire operation', async function () {
      publicExecutor.simulate.mockRejectedValue(new SimulationError(`Failed`, []));

      const tx = mockTx(1, false);
      tx.data.needsSetup = false;
      const [processed, failed] = await processor.process([tx]);

      expect(processed).toEqual([]);
      expect(failed[0].tx).toEqual(tx);
      expect(failed[0].error).toEqual(new SimulationError(`Failed`, []));
      expect(publicWorldStateDB.commit).toHaveBeenCalledTimes(0);
      expect(publicWorldStateDB.rollback).toHaveBeenCalledTimes(0);
    });
  });

  describe('with actual circuits', () => {
    let publicKernel: PublicKernelCircuitSimulator;

    beforeEach(() => {
      const path = times(PUBLIC_DATA_TREE_HEIGHT, i => Buffer.alloc(32, i));
      db.getSiblingPath.mockResolvedValue(new SiblingPath<number>(PUBLIC_DATA_TREE_HEIGHT, path));
      publicKernel = new RealPublicKernelCircuitSimulator(new WASMSimulator());
      processor = new PublicProcessor(
        db,
        publicExecutor,
        publicKernel,
        publicProver,
        GlobalVariables.empty(),
        Header.empty(),
        publicContractsDB,
        publicWorldStateDB,
      );
    });

    const expectedTxByHash = (tx: Tx) =>
      expect.objectContaining({
        hash: tx.getTxHash(),
        proof,
      });

    it('runs a tx with enqueued public calls', async function () {
      const publicCallRequests: PublicCallRequest[] = [makePublicCallRequest(0x100), makePublicCallRequest(0x100)];
      const callRequests = publicCallRequests.map(call => call.toCallRequest());

      const kernelOutput = makePrivateKernelTailCircuitPublicInputs(0x10);
      kernelOutput.end.publicCallStack = padArrayEnd(
        callRequests,
        CallRequest.empty(),
        MAX_REVERTIBLE_PUBLIC_CALL_STACK_LENGTH_PER_TX,
      );
      kernelOutput.end.privateCallStack = padArrayEnd([], CallRequest.empty(), MAX_PRIVATE_CALL_STACK_LENGTH_PER_TX);

      kernelOutput.endNonRevertibleData.publicCallStack = makeTuple(
        MAX_NON_REVERTIBLE_PUBLIC_CALL_STACK_LENGTH_PER_TX,
        CallRequest.empty,
      );
      kernelOutput.end.unencryptedLogsHash = [Fr.ZERO, Fr.ZERO];

      const tx = new Tx(kernelOutput, proof, TxL2Logs.empty(), TxL2Logs.empty(), publicCallRequests);

      tx.data.needsSetup = false;
      tx.data.needsTeardown = false;

      publicExecutor.simulate.mockImplementation(execution => {
        for (const request of publicCallRequests) {
          if (execution.contractAddress.equals(request.contractAddress)) {
            const result = PublicExecutionResultBuilder.fromPublicCallRequest({ request }).build();
            // result.unencryptedLogs = tx.unencryptedLogs.functionLogs[0];
            return Promise.resolve(result);
          }
        }
        throw new Error(`Unexpected execution request: ${execution}`);
      });

      const [processed, failed] = await processor.process([tx]);

      expect(processed).toHaveLength(1);
      expect(processed).toEqual([expectedTxByHash(tx)]);
      expect(failed).toHaveLength(0);
      expect(publicExecutor.simulate).toHaveBeenCalledTimes(2);
      expect(publicWorldStateDB.commit).toHaveBeenCalledTimes(2);
      expect(publicWorldStateDB.rollback).toHaveBeenCalledTimes(0);
    });

    it('runs a tx with an enqueued public call with nested execution', async function () {
      const callRequest: PublicCallRequest = makePublicCallRequest(0x100);
      const callStackItem = callRequest.toCallRequest();

      const kernelOutput = makePrivateKernelTailCircuitPublicInputs(0x10);
      kernelOutput.end.publicCallStack = padArrayEnd(
        [callStackItem],
        CallRequest.empty(),
        MAX_REVERTIBLE_PUBLIC_CALL_STACK_LENGTH_PER_TX,
      );
      kernelOutput.end.privateCallStack = padArrayEnd([], CallRequest.empty(), MAX_PRIVATE_CALL_STACK_LENGTH_PER_TX);
      kernelOutput.endNonRevertibleData.publicCallStack = makeTuple(
        MAX_NON_REVERTIBLE_PUBLIC_CALL_STACK_LENGTH_PER_TX,
        CallRequest.empty,
      );
      kernelOutput.end.unencryptedLogsHash = [Fr.ZERO, Fr.ZERO];

      kernelOutput.needsSetup = false;
      kernelOutput.needsTeardown = false;

      const tx = new Tx(kernelOutput, proof, TxL2Logs.empty(), TxL2Logs.empty(), [callRequest]);

      const publicExecutionResult = PublicExecutionResultBuilder.fromPublicCallRequest({
        request: callRequest,
        nestedExecutions: [
          PublicExecutionResultBuilder.fromFunctionCall({
            from: callRequest.contractAddress,
            tx: makeFunctionCall(),
          }).build(),
        ],
      }).build();

      publicExecutor.simulate.mockResolvedValue(publicExecutionResult);

      const [processed, failed] = await processor.process([tx]);

      expect(processed).toHaveLength(1);
      expect(processed).toEqual([expectedTxByHash(tx)]);
      expect(failed).toHaveLength(0);
      expect(publicExecutor.simulate).toHaveBeenCalledTimes(1);
      expect(publicWorldStateDB.commit).toHaveBeenCalledTimes(2);
      expect(publicWorldStateDB.rollback).toHaveBeenCalledTimes(0);
    });

    it('rolls back app logic db updates on failed public execution, but persists setup/teardown', async function () {
      const baseContractAddressSeed = 0x200;
      const baseContractAddress = makeAztecAddress(baseContractAddressSeed);
      const callRequests: PublicCallRequest[] = [
        baseContractAddressSeed,
        baseContractAddressSeed,
        baseContractAddressSeed,
      ].map(makePublicCallRequest);
      callRequests[0].callContext.sideEffectCounter = 2;
      callRequests[1].callContext.sideEffectCounter = 3;
      callRequests[2].callContext.sideEffectCounter = 4;

      const kernelOutput = makePrivateKernelTailCircuitPublicInputs(0x10);
      kernelOutput.end.unencryptedLogsHash = [Fr.ZERO, Fr.ZERO];

      addKernelPublicCallStack(kernelOutput, {
        setupCalls: [callRequests[0]],
        appLogicCalls: [callRequests[2]],
        teardownCall: callRequests[1],
      });

      const tx = new Tx(
        kernelOutput,
        proof,
        TxL2Logs.empty(),
        TxL2Logs.empty(),
        // reverse because `enqueuedPublicFunctions` expects the last element to be the front of the queue
        callRequests.slice().reverse(),
      );

      const contractSlotA = fr(0x100);
      const contractSlotB = fr(0x150);
      const contractSlotC = fr(0x200);

      let simulatorCallCount = 0;
      const simulatorResults: PublicExecutionResult[] = [
        // Setup
        PublicExecutionResultBuilder.fromPublicCallRequest({
          request: callRequests[0],
          contractStorageUpdateRequests: [new ContractStorageUpdateRequest(contractSlotA, fr(0x101))],
        }).build(),

        // App Logic
        PublicExecutionResultBuilder.fromPublicCallRequest({
          request: callRequests[2],
          nestedExecutions: [
            PublicExecutionResultBuilder.fromFunctionCall({
              from: callRequests[1].contractAddress,
              tx: makeFunctionCall(baseContractAddress, makeSelector(5)),
              contractStorageUpdateRequests: [
                new ContractStorageUpdateRequest(contractSlotA, fr(0x102)),
                new ContractStorageUpdateRequest(contractSlotB, fr(0x151)),
              ],
            }).build(),
            PublicExecutionResultBuilder.fromFunctionCall({
              from: callRequests[1].contractAddress,
              tx: makeFunctionCall(baseContractAddress, makeSelector(5)),
              revertReason: new SimulationError('Simulation Failed', []),
            }).build(),
          ],
        }).build(),

        // Teardown
        PublicExecutionResultBuilder.fromPublicCallRequest({
          request: callRequests[1],
          nestedExecutions: [
            PublicExecutionResultBuilder.fromFunctionCall({
              from: callRequests[1].contractAddress,
              tx: makeFunctionCall(baseContractAddress, makeSelector(5)),
              contractStorageUpdateRequests: [new ContractStorageUpdateRequest(contractSlotC, fr(0x201))],
            }).build(),
          ],
        }).build(),
      ];

      publicExecutor.simulate.mockImplementation(execution => {
        if (simulatorCallCount < simulatorResults.length) {
          return Promise.resolve(simulatorResults[simulatorCallCount++]);
        } else {
          throw new Error(`Unexpected execution request: ${execution}, call count: ${simulatorCallCount}`);
        }
      });

      const setupSpy = jest.spyOn(publicKernel, 'publicKernelCircuitSetup');
      const appLogicSpy = jest.spyOn(publicKernel, 'publicKernelCircuitAppLogic');
      const teardownSpy = jest.spyOn(publicKernel, 'publicKernelCircuitTeardown');

      const [processed, failed] = await processor.process([tx]);

      expect(processed).toHaveLength(1);
      expect(processed).toEqual([expectedTxByHash(tx)]);
      expect(failed).toHaveLength(0);

      expect(setupSpy).toHaveBeenCalledTimes(1);
      expect(appLogicSpy).toHaveBeenCalledTimes(2);
      expect(teardownSpy).toHaveBeenCalledTimes(2);
      expect(publicExecutor.simulate).toHaveBeenCalledTimes(3);
      expect(publicWorldStateDB.commit).toHaveBeenCalledTimes(3);
      expect(publicWorldStateDB.rollback).toHaveBeenCalledTimes(1);

      expect(arrayNonEmptyLength(processed[0].data.combinedData.publicCallStack, i => i.isEmpty())).toEqual(0);

      const txEffect = toTxEffect(processed[0]);
      expect(arrayNonEmptyLength(txEffect.publicDataWrites, PublicDataWrite.isEmpty)).toEqual(2);
      expect(txEffect.publicDataWrites[0]).toEqual(
        new PublicDataWrite(computePublicDataTreeLeafSlot(baseContractAddress, contractSlotA), fr(0x101)),
      );
      expect(txEffect.publicDataWrites[1]).toEqual(
        new PublicDataWrite(computePublicDataTreeLeafSlot(baseContractAddress, contractSlotC), fr(0x201)),
      );
      expect(txEffect.encryptedLogs.getTotalLogCount()).toBe(0);
      expect(txEffect.unencryptedLogs.getTotalLogCount()).toBe(0);
    });

    it('runs a tx with setup and teardown phases', async function () {
      const baseContractAddressSeed = 0x200;
      const baseContractAddress = makeAztecAddress(baseContractAddressSeed);
      const callRequests: PublicCallRequest[] = [
        baseContractAddressSeed,
        baseContractAddressSeed,
        baseContractAddressSeed,
      ].map(makePublicCallRequest);
      callRequests[0].callContext.sideEffectCounter = 2;
      callRequests[1].callContext.sideEffectCounter = 3;
      callRequests[2].callContext.sideEffectCounter = 4;

      const kernelOutput = makePrivateKernelTailCircuitPublicInputs(0x10);

      kernelOutput.end.unencryptedLogsHash = [Fr.ZERO, Fr.ZERO];
      addKernelPublicCallStack(kernelOutput, {
        setupCalls: [callRequests[0]],
        appLogicCalls: [callRequests[2]],
        teardownCall: callRequests[1],
      });

      const tx = new Tx(
        kernelOutput,
        proof,
        TxL2Logs.empty(),
        TxL2Logs.empty(),
        // reverse because `enqueuedPublicFunctions` expects the last element to be the front of the queue
        callRequests.slice().reverse(),
      );

      // const baseContractAddress = makeAztecAddress(30);
      const contractSlotA = fr(0x100);
      const contractSlotB = fr(0x150);
      const contractSlotC = fr(0x200);

      let simulatorCallCount = 0;
      const simulatorResults: PublicExecutionResult[] = [
        // Setup
        PublicExecutionResultBuilder.fromPublicCallRequest({ request: callRequests[0] }).build(),

        // App Logic
        PublicExecutionResultBuilder.fromPublicCallRequest({
          request: callRequests[2],
          contractStorageUpdateRequests: [
            new ContractStorageUpdateRequest(contractSlotA, fr(0x101)),
            new ContractStorageUpdateRequest(contractSlotB, fr(0x151)),
          ],
        }).build(),

        // Teardown
        PublicExecutionResultBuilder.fromPublicCallRequest({
          request: callRequests[1],
          nestedExecutions: [
            PublicExecutionResultBuilder.fromFunctionCall({
              from: callRequests[1].contractAddress,
              tx: makeFunctionCall(baseContractAddress, makeSelector(5)),
              contractStorageUpdateRequests: [
                new ContractStorageUpdateRequest(contractSlotA, fr(0x101)),
                new ContractStorageUpdateRequest(contractSlotC, fr(0x201)),
              ],
            }).build(),
            PublicExecutionResultBuilder.fromFunctionCall({
              from: callRequests[1].contractAddress,
              tx: makeFunctionCall(baseContractAddress, makeSelector(5)),
              contractStorageUpdateRequests: [new ContractStorageUpdateRequest(contractSlotA, fr(0x102))],
            }).build(),
          ],
        }).build(),
      ];

      publicExecutor.simulate.mockImplementation(execution => {
        if (simulatorCallCount < simulatorResults.length) {
          return Promise.resolve(simulatorResults[simulatorCallCount++]);
        } else {
          throw new Error(`Unexpected execution request: ${execution}, call count: ${simulatorCallCount}`);
        }
      });

      const setupSpy = jest.spyOn(publicKernel, 'publicKernelCircuitSetup');
      const appLogicSpy = jest.spyOn(publicKernel, 'publicKernelCircuitAppLogic');
      const teardownSpy = jest.spyOn(publicKernel, 'publicKernelCircuitTeardown');

      const [processed, failed] = await processor.process([tx]);

      expect(processed).toHaveLength(1);
      expect(processed).toEqual([expectedTxByHash(tx)]);
      expect(failed).toHaveLength(0);

      expect(setupSpy).toHaveBeenCalledTimes(1);
      expect(appLogicSpy).toHaveBeenCalledTimes(1);
      expect(teardownSpy).toHaveBeenCalledTimes(3);
      expect(publicExecutor.simulate).toHaveBeenCalledTimes(3);
      expect(publicWorldStateDB.commit).toHaveBeenCalledTimes(4);
      expect(publicWorldStateDB.rollback).toHaveBeenCalledTimes(0);

      const txEffect = toTxEffect(processed[0]);
      expect(arrayNonEmptyLength(txEffect.publicDataWrites, PublicDataWrite.isEmpty)).toEqual(3);
      expect(txEffect.publicDataWrites[0]).toEqual(
        new PublicDataWrite(computePublicDataTreeLeafSlot(baseContractAddress, contractSlotA), fr(0x102)),
      );
      expect(txEffect.publicDataWrites[1]).toEqual(
        new PublicDataWrite(computePublicDataTreeLeafSlot(baseContractAddress, contractSlotB), fr(0x151)),
      );
      expect(txEffect.publicDataWrites[2]).toEqual(
        new PublicDataWrite(computePublicDataTreeLeafSlot(baseContractAddress, contractSlotC), fr(0x201)),
      );
      expect(txEffect.encryptedLogs.getTotalLogCount()).toBe(0);
      expect(txEffect.unencryptedLogs.getTotalLogCount()).toBe(0);
    });
  });
});

class PublicExecutionResultBuilder {
  private _execution: PublicExecution;
  private _nestedExecutions: PublicExecutionResult[] = [];
  private _contractStorageUpdateRequests: ContractStorageUpdateRequest[] = [];
  private _returnValues: Fr[] = [];
  private _reverted = false;
  private _revertReason: SimulationError | undefined = undefined;

  constructor(execution: PublicExecution) {
    this._execution = execution;
  }

  static fromPublicCallRequest({
    request,
    returnValues = [new Fr(1n)],
    nestedExecutions = [],
    contractStorageUpdateRequests = [],
  }: {
    request: PublicCallRequest;
    returnValues?: Fr[];
    nestedExecutions?: PublicExecutionResult[];
    contractStorageUpdateRequests?: ContractStorageUpdateRequest[];
  }): PublicExecutionResultBuilder {
    const builder = new PublicExecutionResultBuilder(request);

    builder.withNestedExecutions(...nestedExecutions);
    builder.withContractStorageUpdateRequest(...contractStorageUpdateRequests);
    builder.withReturnValues(...returnValues);

    return builder;
  }

  static fromFunctionCall({
    from,
    tx,
    returnValues = [new Fr(1n)],
    nestedExecutions = [],
    contractStorageUpdateRequests = [],
    revertReason,
  }: {
    from: AztecAddress;
    tx: FunctionCall;
    returnValues?: Fr[];
    nestedExecutions?: PublicExecutionResult[];
    contractStorageUpdateRequests?: ContractStorageUpdateRequest[];
    revertReason?: SimulationError;
  }) {
    const builder = new PublicExecutionResultBuilder({
      callContext: new CallContext(from, tx.to, EthAddress.ZERO, tx.functionData.selector, false, false, 0),
      contractAddress: tx.to,
      functionData: tx.functionData,
      args: tx.args,
    });

    builder.withNestedExecutions(...nestedExecutions);
    builder.withContractStorageUpdateRequest(...contractStorageUpdateRequests);
    builder.withReturnValues(...returnValues);
    if (revertReason) {
      builder.withReverted(revertReason);
    }

    return builder;
  }

  withNestedExecutions(...nested: PublicExecutionResult[]): PublicExecutionResultBuilder {
    this._nestedExecutions.push(...nested);
    return this;
  }

  withContractStorageUpdateRequest(...request: ContractStorageUpdateRequest[]): PublicExecutionResultBuilder {
    this._contractStorageUpdateRequests.push(...request);
    return this;
  }

  withReturnValues(...values: Fr[]): PublicExecutionResultBuilder {
    this._returnValues.push(...values);
    return this;
  }

  withReverted(reason: SimulationError): PublicExecutionResultBuilder {
    this._reverted = true;
    this._revertReason = reason;
    return this;
  }

  build(): PublicExecutionResult {
    return {
      execution: this._execution,
      nestedExecutions: this._nestedExecutions,
      nullifierReadRequests: [],
      contractStorageUpdateRequests: this._contractStorageUpdateRequests,
      returnValues: this._returnValues,
      newNoteHashes: [],
      newNullifiers: [],
      newL2ToL1Messages: [],
      contractStorageReads: [],
      unencryptedLogs: new FunctionL2Logs([]),
      startSideEffectCounter: Fr.ZERO,
      endSideEffectCounter: Fr.ZERO,
      reverted: this._reverted,
      revertReason: this._revertReason,
    };
  }
}

const makeFunctionCall = (
  to = makeAztecAddress(30),
  selector = makeSelector(5),
  args = new Array(ARGS_LENGTH).fill(Fr.ZERO),
) => ({
  to,
  functionData: new FunctionData(selector, false, false, false),
  args,
});

function addKernelPublicCallStack(
  kernelOutput: PrivateKernelTailCircuitPublicInputs,
  calls: {
    setupCalls: PublicCallRequest[];
    appLogicCalls: PublicCallRequest[];
    teardownCall: PublicCallRequest;
  },
) {
  // the first two calls are non-revertible
  // the first is for setup, the second is for teardown
  kernelOutput.endNonRevertibleData.publicCallStack = padArrayEnd(
    // this is a stack, so the first item is the last call
    // and callRequests is in the order of the calls
    [calls.teardownCall.toCallRequest(), ...calls.setupCalls.map(c => c.toCallRequest())],
    CallRequest.empty(),
    MAX_NON_REVERTIBLE_PUBLIC_CALL_STACK_LENGTH_PER_TX,
  );

  kernelOutput.end.publicCallStack = padArrayEnd(
    calls.appLogicCalls.map(c => c.toCallRequest()),
    CallRequest.empty(),
    MAX_REVERTIBLE_PUBLIC_CALL_STACK_LENGTH_PER_TX,
  );
  kernelOutput.end.privateCallStack = padArrayEnd([], CallRequest.empty(), MAX_PRIVATE_CALL_STACK_LENGTH_PER_TX);
}
