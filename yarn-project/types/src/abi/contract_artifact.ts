import {
  type ABIParameter,
  ABIParameterVisibility,
  type ABIType,
  type ContractArtifact,
  type FunctionArtifact,
  FunctionType,
} from '@aztec/foundation/abi';

import {
  AZTEC_INITIALIZER_ATTRIBUTE,
  AZTEC_INTERNAL_ATTRIBUTE,
  AZTEC_PRIVATE_ATTRIBUTE,
  AZTEC_PUBLIC_ATTRIBUTE,
  AZTEC_PUBLIC_VM_ATTRIBUTE,
  type NoirCompiledContract,
} from '../noir/index.js';
import { mockVerificationKey } from './mocked_keys.js';

/**
 * Serializes a contract artifact to a buffer for storage.
 * @param artifact - Artifact to serialize.
 * @returns A buffer.
 */
export function contractArtifactToBuffer(artifact: ContractArtifact): Buffer {
  return Buffer.from(
    JSON.stringify(artifact, (key, value) => {
      if (
        key === 'bytecode' &&
        value !== null &&
        typeof value === 'object' &&
        value.type === 'Buffer' &&
        Array.isArray(value.data)
      ) {
        return Buffer.from(value.data).toString('base64');
      }
      return value;
    }),
    'utf-8',
  );
}

/**
 * Deserializes a contract artifact from storage.
 * @param buffer - Buffer to deserialize.
 * @returns Deserialized artifact.
 */
export function contractArtifactFromBuffer(buffer: Buffer): ContractArtifact {
  return JSON.parse(buffer.toString('utf-8'), (key, value) => {
    if (key === 'bytecode' && typeof value === 'string') {
      return Buffer.from(value, 'base64');
    }
    return value;
  });
}

/**
 * Gets nargo build output and returns a valid contract artifact instance.
 * @param input - Input object as generated by nargo compile.
 * @returns A valid contract artifact instance.
 */
export function loadContractArtifact(input: NoirCompiledContract): ContractArtifact {
  if (isContractArtifact(input)) {
    return input;
  }
  return generateContractArtifact(input);
}

/**
 * Checks if the given input looks like a valid ContractArtifact. The check is not exhaustive,
 * and it's just meant to differentiate between nargo raw build artifacts and the ones
 * produced by this compiler.
 * @param input - Input object.
 * @returns True if it looks like a ContractArtifact.
 */
function isContractArtifact(input: any): input is ContractArtifact {
  if (typeof input !== 'object') {
    return false;
  }
  const maybeContractArtifact = input as ContractArtifact;
  if (typeof maybeContractArtifact.name !== 'string') {
    return false;
  }
  if (!Array.isArray(maybeContractArtifact.functions)) {
    return false;
  }
  for (const fn of maybeContractArtifact.functions) {
    if (typeof fn.name !== 'string') {
      return false;
    }
    if (typeof fn.functionType !== 'string') {
      return false;
    }
  }
  return true;
}

/** Parameter in a function from a noir contract compilation artifact */
type NoirCompiledContractFunctionParameter = NoirCompiledContractFunction['abi']['parameters'][number];

/**
 * Generates a function parameter out of one generated by a nargo build.
 * @param param - Noir parameter.
 * @returns A function parameter.
 */
function generateFunctionParameter(param: NoirCompiledContractFunctionParameter): ABIParameter {
  const { visibility } = param;
  if ((visibility as string) === 'databus') {
    throw new Error(`Unsupported visibility ${param.visibility} for noir contract function parameter ${param.name}.`);
  }
  return { ...param, visibility: visibility as ABIParameterVisibility };
}

/** Function from a noir contract compilation artifact */
type NoirCompiledContractFunction = NoirCompiledContract['functions'][number];

/**
 * Generates a function build artifact. Replaces verification key with a mock value.
 * @param fn - Noir function entry.
 * @returns Function artifact.
 */
function generateFunctionArtifact(fn: NoirCompiledContractFunction): FunctionArtifact {
  if (fn.custom_attributes === undefined) {
    throw new Error(
      `No custom attributes found for contract function ${fn.name}. Try rebuilding the contract with the latest nargo version.`,
    );
  }
  const functionType = getFunctionType(fn);
  const isInternal = fn.custom_attributes.includes(AZTEC_INTERNAL_ATTRIBUTE);

  // If the function is not unconstrained, the first item is inputs or CallContext which we should omit
  let parameters = fn.abi.parameters.map(generateFunctionParameter);
  if (hasKernelFunctionInputs(parameters)) {
    parameters = parameters.slice(1);
  }

  // If the function is secret, the return is the public inputs, which should be omitted
  let returnTypes: ABIType[] = [];
  if (functionType !== 'secret' && fn.abi.return_type) {
    returnTypes = [fn.abi.return_type.abi_type];
  }

  return {
    name: fn.name,
    functionType,
    isInternal,
    isInitializer: fn.custom_attributes.includes(AZTEC_INITIALIZER_ATTRIBUTE),
    isTranspiled: fn.custom_attributes.includes(AZTEC_PUBLIC_VM_ATTRIBUTE),
    parameters,
    returnTypes,
    bytecode: Buffer.from(fn.bytecode, 'base64'),
    verificationKey: mockVerificationKey,
    debugSymbols: fn.debug_symbols,
  };
}

function getFunctionType(fn: NoirCompiledContractFunction): FunctionType {
  if (fn.custom_attributes.includes(AZTEC_PRIVATE_ATTRIBUTE)) {
    return FunctionType.SECRET;
  } else if (
    fn.custom_attributes.includes(AZTEC_PUBLIC_ATTRIBUTE) ||
    fn.custom_attributes.includes(AZTEC_PUBLIC_VM_ATTRIBUTE)
  ) {
    return FunctionType.OPEN;
  } else if (fn.is_unconstrained) {
    return FunctionType.UNCONSTRAINED;
  } else {
    // Default to a private function (see simple_macro_example_expanded for an example of this behavior)
    return FunctionType.SECRET;
  }
}

/**
 * Returns true if the first parameter is kernel function inputs.
 *
 * Noir macros #[aztec(private|public)] inject the following code
 * fn <name>(inputs: <Public|Private>ContextInputs, ...otherparams) {}
 *
 * Return true if this injected parameter is found
 */
function hasKernelFunctionInputs(params: ABIParameter[]): boolean {
  const firstParam = params[0];
  return firstParam?.type.kind === 'struct' && firstParam.type.path.includes('ContextInputs');
}

/**
 * Given a Nargo output generates an Aztec-compatible contract artifact.
 * @param compiled - Noir build output.
 * @returns Aztec contract build artifact.
 */
function generateContractArtifact(contract: NoirCompiledContract, aztecNrVersion?: string): ContractArtifact {
  return {
    name: contract.name,
    functions: contract.functions.map(generateFunctionArtifact),
    events: contract.events,
    fileMap: contract.file_map,
    aztecNrVersion,
  };
}
