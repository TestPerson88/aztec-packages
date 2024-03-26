import {
  BaseOrMergeRollupPublicInputs,
  BaseParityInputs,
  BaseRollupInputs,
  MergeRollupInputs,
  ParityPublicInputs,
  PrivateKernelInitCircuitPrivateInputs,
  PrivateKernelInnerCircuitPrivateInputs,
  PrivateKernelInnerCircuitPublicInputs,
  PrivateKernelTailCircuitPrivateInputs,
  PrivateKernelTailCircuitPublicInputs,
  PublicKernelCircuitPrivateInputs,
  PublicKernelCircuitPublicInputs,
  PublicKernelTailCircuitPrivateInputs,
  RootParityInputs,
  RootRollupInputs,
  RootRollupPublicInputs,
} from '@aztec/circuits.js';
import { NoirCompiledCircuit } from '@aztec/types/noir';

import { WasmBlackBoxFunctionSolver, createBlackBoxSolver, executeCircuitWithBlackBoxSolver } from '@noir-lang/acvm_js';
import { Abi, abiDecode, abiEncode } from '@noir-lang/noirc_abi';
import { WitnessMap } from '@noir-lang/types';

import BaseParityJson from './target/parity_base.json' assert { type: 'json' };
import RootParityJson from './target/parity_root.json' assert { type: 'json' };
import PrivateKernelInitJson from './target/private_kernel_init.json' assert { type: 'json' };
import PrivateKernelInitSimulatedJson from './target/private_kernel_init_simulated.json' assert { type: 'json' };
import PrivateKernelInnerJson from './target/private_kernel_inner.json' assert { type: 'json' };
import PrivateKernelInnerSimulatedJson from './target/private_kernel_inner_simulated.json' assert { type: 'json' };
import PrivateKernelTailJson from './target/private_kernel_tail.json' assert { type: 'json' };
import PrivateKernelTailSimulatedJson from './target/private_kernel_tail_simulated.json' assert { type: 'json' };
import PublicKernelAppLogicSimulatedJson from './target/public_kernel_app_logic_simulated.json' assert { type: 'json' };
import PublicKernelSetupSimulatedJson from './target/public_kernel_setup_simulated.json' assert { type: 'json' };
import PublicKernelTailSimulatedJson from './target/public_kernel_tail_simulated.json' assert { type: 'json' };
import PublicKernelTeardownSimulatedJson from './target/public_kernel_teardown_simulated.json' assert { type: 'json' };
import BaseRollupJson from './target/rollup_base.json' assert { type: 'json' };
import BaseRollupSimulatedJson from './target/rollup_base_simulated.json' assert { type: 'json' };
import MergeRollupJson from './target/rollup_merge.json' assert { type: 'json' };
import RootRollupJson from './target/rollup_root.json' assert { type: 'json' };
import {
  mapBaseOrMergeRollupPublicInputsFromNoir,
  mapBaseParityInputsToNoir,
  mapBaseRollupInputsToNoir,
  mapMergeRollupInputsToNoir,
  mapParityPublicInputsFromNoir,
  mapPrivateKernelInitCircuitPrivateInputsToNoir,
  mapPrivateKernelInnerCircuitPrivateInputsToNoir,
  mapPrivateKernelInnerCircuitPublicInputsFromNoir,
  mapPrivateKernelTailCircuitPrivateInputsToNoir,
  mapPrivateKernelTailCircuitPublicInputsFromNoir,
  mapPublicKernelCircuitPrivateInputsToNoir,
  mapPublicKernelCircuitPublicInputsFromNoir,
  mapPublicKernelTailCircuitPrivateInputsToNoir,
  mapRootParityInputsToNoir,
  mapRootRollupInputsToNoir,
  mapRootRollupPublicInputsFromNoir,
} from './type_conversion.js';
import { ReturnType as BaseParityReturnType } from './types/parity_base_types.js';
import { ReturnType as RootParityReturnType } from './types/parity_root_types.js';
import { InputType as InitInputType, ReturnType as InitReturnType } from './types/private_kernel_init_types.js';
import { InputType as InnerInputType, ReturnType as InnerReturnType } from './types/private_kernel_inner_types.js';
import { InputType as TailInputType, ReturnType as TailReturnType } from './types/private_kernel_tail_types.js';
import { ReturnType as PublicPublicPreviousReturnType } from './types/public_kernel_app_logic_types.js';
import { ReturnType as PublicSetupReturnType } from './types/public_kernel_setup_types.js';
import { ReturnType as BaseRollupReturnType } from './types/rollup_base_types.js';
import { ReturnType as MergeRollupReturnType } from './types/rollup_merge_types.js';
import { ReturnType as RootRollupReturnType } from './types/rollup_root_types.js';

// TODO(Tom): This should be exported from noirc_abi
/**
 * The decoded inputs from the circuit.
 */
export type DecodedInputs = {
  /**
   * The inputs to the circuit
   */
  inputs: Record<string, any>;
  /**
   * The return value of the circuit
   */
  return_value: any;
};

export const PrivateKernelInitArtifact = PrivateKernelInitJson as NoirCompiledCircuit;

export const PrivateKernelInnerArtifact = PrivateKernelInnerJson as NoirCompiledCircuit;

export const PrivateKernelTailArtifact = PrivateKernelTailJson as NoirCompiledCircuit;

export const PublicKernelSetupArtifact = PublicKernelSetupSimulatedJson as NoirCompiledCircuit;

export const PublicKernelAppLogicArtifact = PublicKernelAppLogicSimulatedJson as NoirCompiledCircuit;

export const PublicKernelTeardownArtifact = PublicKernelTeardownSimulatedJson as NoirCompiledCircuit;

export const PublicKernelTailArtifact = PublicKernelTailSimulatedJson as NoirCompiledCircuit;

export const BaseParityArtifact = BaseParityJson as NoirCompiledCircuit;

export const RootParityArtifact = RootParityJson as NoirCompiledCircuit;

export const SimulatedBaseRollupArtifact = BaseRollupSimulatedJson as NoirCompiledCircuit;

export const BaseRollupArtifact = BaseRollupJson as NoirCompiledCircuit;

export const MergeRollupArtifact = MergeRollupJson as NoirCompiledCircuit;

export const RootRollupArtifact = RootRollupJson as NoirCompiledCircuit;

export type ProtocolArtifacts =
  | 'PrivateKernelInitArtifact'
  | 'PrivateKernelInnerArtifact'
  | 'PrivateKernelTailArtifact'
  | 'PublicKernelSetupArtifact'
  | 'PublicKernelAppLogicArtifact'
  | 'PublicKernelTeardownArtifact'
  | 'PublicKernelTailArtifact'
  | 'BaseParityArtifact'
  | 'RootParityArtifact'
  | 'BaseRollupArtifact'
  | 'MergeRollupArtifact'
  | 'RootRollupArtifact';

export const ProtocolCircuitArtifacts: Record<ProtocolArtifacts, NoirCompiledCircuit> = {
  PrivateKernelInitArtifact: PrivateKernelInitArtifact,
  PrivateKernelInnerArtifact: PrivateKernelInnerArtifact,
  PrivateKernelTailArtifact: PrivateKernelTailArtifact,
  PublicKernelSetupArtifact: PublicKernelSetupArtifact,
  PublicKernelAppLogicArtifact: PublicKernelAppLogicArtifact,
  PublicKernelTeardownArtifact: PublicKernelTeardownArtifact,
  PublicKernelTailArtifact: PublicKernelTailArtifact,
  BaseParityArtifact: BaseParityArtifact,
  RootParityArtifact: RootParityArtifact,
  BaseRollupArtifact: BaseRollupArtifact,
  MergeRollupArtifact: MergeRollupArtifact,
  RootRollupArtifact: RootRollupArtifact,
};

let solver: Promise<WasmBlackBoxFunctionSolver>;

const getSolver = (): Promise<WasmBlackBoxFunctionSolver> => {
  if (!solver) {
    solver = createBlackBoxSolver();
  }
  return solver;
};

/**
 * Executes the init private kernel.
 * @param privateKernelInitCircuitPrivateInputs - The private inputs to the initial private kernel.
 * @returns The public inputs.
 */
export async function executeInit(
  privateKernelInitCircuitPrivateInputs: PrivateKernelInitCircuitPrivateInputs,
): Promise<PrivateKernelInnerCircuitPublicInputs> {
  const params: InitInputType = {
    input: mapPrivateKernelInitCircuitPrivateInputsToNoir(privateKernelInitCircuitPrivateInputs),
  };

  const returnType = await executePrivateKernelInitWithACVM(params);

  return mapPrivateKernelInnerCircuitPublicInputsFromNoir(returnType);
}

/**
 * Executes the inner private kernel.
 * @param privateKernelInnerCircuitPrivateInputs - The private inputs to the inner private kernel.
 * @returns The public inputs.
 */
export async function executeInner(
  privateKernelInnerCircuitPrivateInputs: PrivateKernelInnerCircuitPrivateInputs,
): Promise<PrivateKernelInnerCircuitPublicInputs> {
  const params: InnerInputType = {
    input: mapPrivateKernelInnerCircuitPrivateInputsToNoir(privateKernelInnerCircuitPrivateInputs),
  };
  const returnType = await executePrivateKernelInnerWithACVM(params);

  return mapPrivateKernelInnerCircuitPublicInputsFromNoir(returnType);
}

/**
 * Executes the tail private kernel.
 * @param privateKernelInnerCircuitPrivateInputs - The private inputs to the tail private kernel.
 * @returns The public inputs.
 */
export async function executeTail(
  privateKernelInnerCircuitPrivateInputs: PrivateKernelTailCircuitPrivateInputs,
): Promise<PrivateKernelTailCircuitPublicInputs> {
  const params: TailInputType = {
    input: mapPrivateKernelTailCircuitPrivateInputsToNoir(privateKernelInnerCircuitPrivateInputs),
  };

  const returnType = await executePrivateKernelTailWithACVM(params);

  return mapPrivateKernelTailCircuitPublicInputsFromNoir(returnType);
}

/**
 * Converts the inputs of the base parity circuit into a witness map.
 * @param inputs - The base parity inputs.
 * @returns The witness map
 */
export function convertBaseParityInputsToWitnessMap(inputs: BaseParityInputs): WitnessMap {
  const mapped = mapBaseParityInputsToNoir(inputs);
  const initialWitnessMap = abiEncode(BaseParityJson.abi as Abi, { inputs: mapped as any });
  return initialWitnessMap;
}

/**
 * Converts the inputs of the root parity circuit into a witness map.
 * @param inputs - The root parity inputs.
 * @returns The witness map
 */
export function convertRootParityInputsToWitnessMap(inputs: RootParityInputs): WitnessMap {
  const mapped = mapRootParityInputsToNoir(inputs);
  const initialWitnessMap = abiEncode(RootParityJson.abi as Abi, { inputs: mapped as any });
  return initialWitnessMap;
}

/**
 * Converts the inputs of the base rollup circuit into a witness map.
 * @param inputs - The base rollup inputs.
 * @returns The witness map
 */
export function convertBaseRollupInputsToWitnessMap(inputs: BaseRollupInputs): WitnessMap {
  const mapped = mapBaseRollupInputsToNoir(inputs);
  const initialWitnessMap = abiEncode(BaseRollupJson.abi as Abi, { inputs: mapped as any });
  return initialWitnessMap;
}

/**
 * Converts the inputs of the simulated base rollup circuit into a witness map.
 * @param inputs - The base rollup inputs.
 * @returns The witness map
 */
export function convertSimulatedBaseRollupInputsToWitnessMap(inputs: BaseRollupInputs): WitnessMap {
  const mapped = mapBaseRollupInputsToNoir(inputs);
  const initialWitnessMap = abiEncode(BaseRollupSimulatedJson.abi as Abi, { inputs: mapped as any });
  return initialWitnessMap;
}

/**
 * Converts the inputs of the merge rollup circuit into a witness map.
 * @param inputs - The merge rollup inputs.
 * @returns The witness map
 */
export function convertMergeRollupInputsToWitnessMap(inputs: MergeRollupInputs): WitnessMap {
  const mapped = mapMergeRollupInputsToNoir(inputs);
  const initialWitnessMap = abiEncode(MergeRollupJson.abi as Abi, { inputs: mapped as any });
  return initialWitnessMap;
}

/**
 * Converts the inputs of the root rollup circuit into a witness map.
 * @param inputs - The root rollup inputs.
 * @returns The witness map
 */
export function convertRootRollupInputsToWitnessMap(inputs: RootRollupInputs): WitnessMap {
  const mapped = mapRootRollupInputsToNoir(inputs);
  const initialWitnessMap = abiEncode(RootRollupJson.abi as Abi, { inputs: mapped as any });
  return initialWitnessMap;
}
/**
 * Converts the inputs of the public setup circuit into a witness map
 * @param inputs - The public kernel inputs.
 * @returns The witness map
 */
export function convertPublicSetupRollupInputsToWitnessMap(inputs: PublicKernelCircuitPrivateInputs): WitnessMap {
  const mapped = mapPublicKernelCircuitPrivateInputsToNoir(inputs);
  const initialWitnessMap = abiEncode(PublicKernelSetupSimulatedJson.abi as Abi, { input: mapped as any });
  return initialWitnessMap;
}

/**
 * Converts the inputs of the public setup circuit into a witness map
 * @param inputs - The public kernel inputs.
 * @returns The witness map
 */
export function convertPublicInnerRollupInputsToWitnessMap(inputs: PublicKernelCircuitPrivateInputs): WitnessMap {
  const mapped = mapPublicKernelCircuitPrivateInputsToNoir(inputs);
  const initialWitnessMap = abiEncode(PublicKernelAppLogicSimulatedJson.abi as Abi, { input: mapped as any });
  return initialWitnessMap;
}

/**
 * Converts the inputs of the public teardown circuit into a witness map
 * @param inputs - The public kernel inputs.
 * @returns The witness map
 */
export function convertPublicTeardownRollupInputsToWitnessMap(inputs: PublicKernelCircuitPrivateInputs): WitnessMap {
  const mapped = mapPublicKernelCircuitPrivateInputsToNoir(inputs);
  const initialWitnessMap = abiEncode(PublicKernelTeardownSimulatedJson.abi as Abi, { input: mapped as any });
  return initialWitnessMap;
}

/**
 * Converts the inputs of the public tail circuit into a witness map
 * @param inputs - The public kernel inputs.
 * @returns The witness map
 */
export function convertPublicTailInputsToWitnessMap(inputs: PublicKernelTailCircuitPrivateInputs): WitnessMap {
  const mapped = mapPublicKernelTailCircuitPrivateInputsToNoir(inputs);
  const initialWitnessMap = abiEncode(PublicKernelTailSimulatedJson.abi as Abi, { input: mapped as any });
  return initialWitnessMap;
}

/**
 * Converts the outputs of the simulated base rollup circuit from a witness map.
 * @param outputs - The base rollup outputs as a witness map.
 * @returns The public inputs.
 */
export function convertSimulatedBaseRollupOutputsFromWitnessMap(outputs: WitnessMap): BaseOrMergeRollupPublicInputs {
  // Decode the witness map into two fields, the return values and the inputs
  const decodedInputs: DecodedInputs = abiDecode(BaseRollupSimulatedJson.abi as Abi, outputs);

  // Cast the inputs as the return type
  const returnType = decodedInputs.return_value as BaseRollupReturnType;

  return mapBaseOrMergeRollupPublicInputsFromNoir(returnType);
}

/**
 * Converts the outputs of the base rollup circuit from a witness map.
 * @param outputs - The base rollup outputs as a witness map.
 * @returns The public inputs.
 */
export function convertBaseRollupOutputsFromWitnessMap(outputs: WitnessMap): BaseOrMergeRollupPublicInputs {
  // Decode the witness map into two fields, the return values and the inputs
  const decodedInputs: DecodedInputs = abiDecode(BaseRollupJson.abi as Abi, outputs);

  // Cast the inputs as the return type
  const returnType = decodedInputs.return_value as BaseRollupReturnType;

  return mapBaseOrMergeRollupPublicInputsFromNoir(returnType);
}

/**
 * Converts the outputs of the merge rollup circuit from a witness map.
 * @param outputs - The merge rollup outputs as a witness map.
 * @returns The public inputs.
 */
export function convertMergeRollupOutputsFromWitnessMap(outputs: WitnessMap): BaseOrMergeRollupPublicInputs {
  // Decode the witness map into two fields, the return values and the inputs
  const decodedInputs: DecodedInputs = abiDecode(MergeRollupJson.abi as Abi, outputs);

  // Cast the inputs as the return type
  const returnType = decodedInputs.return_value as MergeRollupReturnType;

  return mapBaseOrMergeRollupPublicInputsFromNoir(returnType);
}

/**
 * Converts the outputs of the root rollup circuit from a witness map.
 * @param outputs - The root rollup outputs as a witness map.
 * @returns The public inputs.
 */
export function convertRootRollupOutputsFromWitnessMap(outputs: WitnessMap): RootRollupPublicInputs {
  // Decode the witness map into two fields, the return values and the inputs
  const decodedInputs: DecodedInputs = abiDecode(RootRollupJson.abi as Abi, outputs);

  // Cast the inputs as the return type
  const returnType = decodedInputs.return_value as RootRollupReturnType;

  return mapRootRollupPublicInputsFromNoir(returnType);
}

/**
 * Converts the outputs of the base parity circuit from a witness map.
 * @param outputs - The base parity outputs as a witness map.
 * @returns The public inputs.
 */
export function convertBaseParityOutputsFromWitnessMap(outputs: WitnessMap): ParityPublicInputs {
  // Decode the witness map into two fields, the return values and the inputs
  const decodedInputs: DecodedInputs = abiDecode(BaseParityJson.abi as Abi, outputs);

  // Cast the inputs as the return type
  const returnType = decodedInputs.return_value as BaseParityReturnType;

  return mapParityPublicInputsFromNoir(returnType);
}

/**
 * Converts the outputs of the root parity circuit from a witness map.
 * @param outputs - The root parity outputs as a witness map.
 * @returns The public inputs.
 */
export function convertRootParityOutputsFromWitnessMap(outputs: WitnessMap): ParityPublicInputs {
  // Decode the witness map into two fields, the return values and the inputs
  const decodedInputs: DecodedInputs = abiDecode(RootParityJson.abi as Abi, outputs);

  // Cast the inputs as the return type
  const returnType = decodedInputs.return_value as RootParityReturnType;

  return mapParityPublicInputsFromNoir(returnType);
}

/**
 * Converts the outputs of the public setup circuit from a witness map.
 * @param outputs - The public kernel outputs as a witness map.
 * @returns The public inputs.
 */
export function convertPublicSetupRollupOutputFromWitnessMap(outputs: WitnessMap): PublicKernelCircuitPublicInputs {
  // Decode the witness map into two fields, the return values and the inputs
  const decodedInputs: DecodedInputs = abiDecode(PublicKernelSetupSimulatedJson.abi as Abi, outputs);

  // Cast the inputs as the return type
  const returnType = decodedInputs.return_value as PublicSetupReturnType;

  return mapPublicKernelCircuitPublicInputsFromNoir(returnType);
}

/**
 * Converts the outputs of the public inner circuit from a witness map.
 * @param outputs - The public kernel outputs as a witness map.
 * @returns The public inputs.
 */
export function convertPublicInnerRollupOutputFromWitnessMap(outputs: WitnessMap): PublicKernelCircuitPublicInputs {
  // Decode the witness map into two fields, the return values and the inputs
  const decodedInputs: DecodedInputs = abiDecode(PublicKernelAppLogicSimulatedJson.abi as Abi, outputs);

  // Cast the inputs as the return type
  const returnType = decodedInputs.return_value as PublicPublicPreviousReturnType;

  return mapPublicKernelCircuitPublicInputsFromNoir(returnType);
}

/**
 * Converts the outputs of the public tail circuit from a witness map.
 * @param outputs - The public kernel outputs as a witness map.
 * @returns The public inputs.
 */
export function convertPublicTeardownRollupOutputFromWitnessMap(outputs: WitnessMap): PublicKernelCircuitPublicInputs {
  // Decode the witness map into two fields, the return values and the inputs
  const decodedInputs: DecodedInputs = abiDecode(PublicKernelTeardownSimulatedJson.abi as Abi, outputs);

  // Cast the inputs as the return type
  const returnType = decodedInputs.return_value as PublicPublicPreviousReturnType;

  return mapPublicKernelCircuitPublicInputsFromNoir(returnType);
}

/**
 * Converts the outputs of the public tail circuit from a witness map.
 * @param outputs - The public kernel outputs as a witness map.
 * @returns The public inputs.
 */
export function convertPublicTailOutputFromWitnessMap(outputs: WitnessMap): PublicKernelCircuitPublicInputs {
  // Decode the witness map into two fields, the return values and the inputs
  const decodedInputs: DecodedInputs = abiDecode(PublicKernelTailSimulatedJson.abi as Abi, outputs);

  // Cast the inputs as the return type
  const returnType = decodedInputs.return_value as PublicPublicPreviousReturnType;

  return mapPublicKernelCircuitPublicInputsFromNoir(returnType);
}

/**
 * Executes the private init kernel with the given inputs using the acvm.
 *
 */
async function executePrivateKernelInitWithACVM(input: InitInputType): Promise<InitReturnType> {
  const initialWitnessMap = abiEncode(PrivateKernelInitSimulatedJson.abi as Abi, input as any);

  // Execute the circuit on those initial witness values
  //
  // Decode the bytecode from base64 since the acvm does not know about base64 encoding
  const decodedBytecode = Buffer.from(PrivateKernelInitSimulatedJson.bytecode, 'base64');
  //
  // Execute the circuit
  const _witnessMap = await executeCircuitWithBlackBoxSolver(
    await getSolver(),
    decodedBytecode,
    initialWitnessMap,
    () => {
      throw Error('unexpected oracle during execution');
    },
  );

  // Decode the witness map into two fields, the return values and the inputs
  const decodedInputs: DecodedInputs = abiDecode(PrivateKernelInitSimulatedJson.abi as Abi, _witnessMap);

  // Cast the inputs as the return type
  return decodedInputs.return_value as InitReturnType;
}

/**
 * Executes the private inner kernel with the given inputs using the acvm.
 */
async function executePrivateKernelInnerWithACVM(input: InnerInputType): Promise<InnerReturnType> {
  const initialWitnessMap = abiEncode(PrivateKernelInnerSimulatedJson.abi as Abi, input as any);

  // Execute the circuit on those initial witness values
  //
  // Decode the bytecode from base64 since the acvm does not know about base64 encoding
  const decodedBytecode = Buffer.from(PrivateKernelInnerSimulatedJson.bytecode, 'base64');
  //
  // Execute the circuit
  const _witnessMap = await executeCircuitWithBlackBoxSolver(
    await getSolver(),
    decodedBytecode,
    initialWitnessMap,
    () => {
      throw Error('unexpected oracle during execution');
    },
  );

  // Decode the witness map into two fields, the return values and the inputs
  const decodedInputs: DecodedInputs = abiDecode(PrivateKernelInnerSimulatedJson.abi as Abi, _witnessMap);

  // Cast the inputs as the return type
  return decodedInputs.return_value as InnerReturnType;
}

/**
 * Executes the private tail kernel with the given inputs using the acvm.
 */
async function executePrivateKernelTailWithACVM(input: TailInputType): Promise<TailReturnType> {
  const initialWitnessMap = abiEncode(PrivateKernelTailSimulatedJson.abi as Abi, input as any);

  // Execute the circuit on those initial witness values
  //
  // Decode the bytecode from base64 since the acvm does not know about base64 encoding
  const decodedBytecode = Buffer.from(PrivateKernelTailSimulatedJson.bytecode, 'base64');
  //
  // Execute the circuit
  const _witnessMap = await executeCircuitWithBlackBoxSolver(
    await getSolver(),
    decodedBytecode,
    initialWitnessMap,
    () => {
      throw Error('unexpected oracle during execution');
    },
  );

  // Decode the witness map into two fields, the return values and the inputs
  const decodedInputs: DecodedInputs = abiDecode(PrivateKernelTailSimulatedJson.abi as Abi, _witnessMap);

  // Cast the inputs as the return type
  return decodedInputs.return_value as TailReturnType;
}
