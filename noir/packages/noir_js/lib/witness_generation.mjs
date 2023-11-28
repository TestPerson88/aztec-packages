import { abiEncode } from '@noir-lang/noirc_abi';
import { base64Decode } from "./base64_decode.mjs";
import { executeCircuit } from '@noir-lang/acvm_js';
const defaultForeignCallHandler = (name, args) => {
    throw Error(`Unexpected oracle during execution: ${name}(${args.join(', ')})`);
};
// Generates the witnesses needed to feed into the chosen proving system
export async function generateWitness(compiledProgram, inputs, foreignCallHandler = defaultForeignCallHandler) {
    // Throws on ABI encoding error
    const witnessMap = abiEncode(compiledProgram.abi, inputs);
    // Execute the circuit to generate the rest of the witnesses and serialize
    // them into a Uint8Array.
    try {
        const solvedWitness = await executeCircuit(base64Decode(compiledProgram.bytecode), witnessMap, foreignCallHandler);
        return solvedWitness;
    }
    catch (err) {
        throw new Error(`Circuit execution failed: ${err}`);
    }
}
