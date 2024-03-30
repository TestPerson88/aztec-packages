import { Tx } from '@aztec/circuit-types';
import { GlobalVariables, Header, Proof, PublicKernelCircuitPublicInputs } from '@aztec/circuits.js';
import { PublicExecutor, type PublicStateDB } from '@aztec/simulator';
import { type MerkleTreeOperations } from '@aztec/world-state';

import { type PublicKernelCircuitSimulator } from '../simulator/index.js';
import { ContractsDataSourcePublicDB } from '../simulator/public_executor.js';
import { AbstractPhaseManager, PublicKernelPhase } from './abstract_phase_manager.js';

/**
 * The phase manager responsible for performing the fee preparation phase.
 */
export class SetupPhaseManager extends AbstractPhaseManager {
  constructor(
    protected db: MerkleTreeOperations,
    protected publicExecutor: PublicExecutor,
    protected publicKernel: PublicKernelCircuitSimulator,
    protected globalVariables: GlobalVariables,
    protected historicalHeader: Header,
    protected publicContractsDB: ContractsDataSourcePublicDB,
    protected publicStateDB: PublicStateDB,
    public phase: PublicKernelPhase = PublicKernelPhase.SETUP,
  ) {
    super(db, publicExecutor, publicKernel, globalVariables, historicalHeader, phase);
  }

  override async handle(
    tx: Tx,
    previousPublicKernelOutput: PublicKernelCircuitPublicInputs,
    previousPublicKernelProof: Proof,
  ) {
    this.log(`Processing tx ${tx.getTxHash()}`);
    const [publicKernelOutput, publicKernelProof, newUnencryptedFunctionLogs, revertReason] =
      await this.processEnqueuedPublicCalls(tx, previousPublicKernelOutput, previousPublicKernelProof).catch(
        // the abstract phase manager throws if simulation gives error in a non-revertible phase
        async err => {
          await this.publicStateDB.rollbackToCommit();
          throw err;
        },
      );
    tx.unencryptedLogs.addFunctionLogs(newUnencryptedFunctionLogs);
    await this.publicStateDB.checkpoint();
    return { publicKernelOutput, publicKernelProof, revertReason };
  }
}
