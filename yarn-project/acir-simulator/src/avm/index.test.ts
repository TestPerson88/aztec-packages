import { Fr } from '@aztec/foundation/fields';

import { mock } from 'jest-mock-extended';

import { AvmMachineState } from './avm_machine_state.js';
import { TypeTag } from './avm_memory_types.js';
import { initExecutionEnvironment } from './fixtures/index.js';
import { executeAvm } from './interpreter/interpreter.js';
import { AvmJournal } from './journal/journal.js';
import { Add, CalldataCopy, Return } from './opcodes/index.js';
import { decodeFromBytecode, encodeToBytecode } from './serialization/bytecode_serialization.js';

describe('avm', () => {
  it('Should execute bytecode', async () => {
    const calldata: Fr[] = [new Fr(1), new Fr(2)];
    const journal = mock<AvmJournal>();

    // Construct bytecode
    const bytecode = encodeToBytecode([
      new CalldataCopy(/*indirect=*/ 0, /*cdOffset=*/ 0, /*copySize=*/ 2, /*dstOffset=*/ 0),
      new Add(/*indirect=*/ 0, TypeTag.FIELD, /*aOffset=*/ 0, /*bOffset=*/ 1, /*dstOffset=*/ 2),
      new Return(/*indirect=*/ 0, /*returnOffset=*/ 2, /*copySize=*/ 1),
    ]);

    // Decode bytecode into instructions
    const instructions = decodeFromBytecode(bytecode);

    // Execute instructions
    const context = new AvmMachineState(initExecutionEnvironment({ calldata }));
    const avmReturnData = await executeAvm(context, journal, instructions);

    expect(avmReturnData.reverted).toBe(false);

    const returnData = avmReturnData.output;
    expect(returnData.length).toBe(1);
    expect(returnData).toEqual([new Fr(3)]);
  });
});
