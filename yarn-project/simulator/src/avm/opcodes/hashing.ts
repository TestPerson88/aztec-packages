import { toBigIntBE } from '@aztec/foundation/bigint-buffer';
import { keccak, pedersenHash, poseidonHash, sha256 } from '@aztec/foundation/crypto';

import { AvmContext } from '../avm_context.js';
import { Field, MemoryValue } from '../avm_memory_types.js';
import { Opcode, OperandType } from '../serialization/instruction_serialization.js';
import { Addressing } from './addressing_mode.js';
import { DynamicGasInstruction } from './dynamic_gas_instruction.js';
import { FixedGasInstruction } from './fixed_gas_instruction.js';

export class Poseidon2 extends FixedGasInstruction {
  static type: string = 'POSEIDON2';
  static readonly opcode: Opcode = Opcode.POSEIDON;

  // Informs (de)serialization. See Instruction.deserialize.
  static readonly wireFormat: OperandType[] = [
    OperandType.UINT8,
    OperandType.UINT8,
    OperandType.UINT32,
    OperandType.UINT32,
    OperandType.UINT32,
  ];

  constructor(
    private indirect: number,
    private dstOffset: number,
    private messageOffset: number,
    private messageSize: number,
  ) {
    super();
  }

  protected async internalExecute(context: AvmContext): Promise<void> {
    // We hash a set of field elements
    const [dstOffset, messageOffset] = Addressing.fromWire(this.indirect).resolve(
      [this.dstOffset, this.messageOffset],
      context.machineState.memory,
    );

    // Memory pointer will be indirect
    const hashData = context.machineState.memory.getSlice(messageOffset, this.messageSize).map(word => word.toBuffer());

    const hash = poseidonHash(hashData);
    context.machineState.memory.set(dstOffset, new Field(hash));

    context.machineState.incrementPc();
  }

  protected memoryOperations() {
    return { reads: this.messageSize, writes: 1 };
  }
}

export class Keccak extends FixedGasInstruction {
  static type: string = 'KECCAK';
  static readonly opcode: Opcode = Opcode.KECCAK;

  // Informs (de)serialization. See Instruction.deserialize.
  static readonly wireFormat: OperandType[] = [
    OperandType.UINT8,
    OperandType.UINT8,
    OperandType.UINT32,
    OperandType.UINT32,
    OperandType.UINT32,
  ];

  constructor(
    private indirect: number,
    private dstOffset: number,
    private messageOffset: number,
    private messageSize: number,
  ) {
    super();
  }

  // Note hash output is 32 bytes, so takes up two fields
  protected async internalExecute(context: AvmContext): Promise<void> {
    // We hash a set of field elements
    const [dstOffset, messageOffset] = Addressing.fromWire(this.indirect).resolve(
      [this.dstOffset, this.messageOffset],
      context.machineState.memory,
    );

    const hashData = context.machineState.memory.getSlice(messageOffset, this.messageSize).map(word => word.toBuffer());

    const hash = keccak(Buffer.concat(hashData));

    // Split output into two fields
    const high = new Field(toBigIntBE(hash.subarray(0, 16)));
    const low = new Field(toBigIntBE(hash.subarray(16, 32)));

    context.machineState.memory.set(dstOffset, high);
    context.machineState.memory.set(dstOffset + 1, low);

    context.machineState.incrementPc();
  }

  protected memoryOperations() {
    return { reads: this.messageSize, writes: 2 };
  }
}

export class Sha256 extends FixedGasInstruction {
  static type: string = 'SHA256';
  static readonly opcode: Opcode = Opcode.SHA256;

  // Informs (de)serialization. See Instruction.deserialize.
  static readonly wireFormat: OperandType[] = [
    OperandType.UINT8,
    OperandType.UINT8,
    OperandType.UINT32,
    OperandType.UINT32,
    OperandType.UINT32,
  ];

  constructor(
    private indirect: number,
    private dstOffset: number,
    private messageOffset: number,
    private messageSize: number,
  ) {
    super();
  }

  // Note hash output is 32 bytes, so takes up two fields
  protected async internalExecute(context: AvmContext): Promise<void> {
    const [dstOffset, messageOffset] = Addressing.fromWire(this.indirect).resolve(
      [this.dstOffset, this.messageOffset],
      context.machineState.memory,
    );

    // We hash a set of field elements
    const hashData = context.machineState.memory.getSlice(messageOffset, this.messageSize).map(word => word.toBuffer());

    const hash = sha256(Buffer.concat(hashData));

    // Split output into two fields
    const high = new Field(toBigIntBE(hash.subarray(0, 16)));
    const low = new Field(toBigIntBE(hash.subarray(16, 32)));

    context.machineState.memory.set(dstOffset, high);
    context.machineState.memory.set(dstOffset + 1, low);

    context.machineState.incrementPc();
  }

  protected memoryOperations() {
    return { reads: this.messageSize, writes: 2 };
  }
}

type PedersenInputs = { messageSize: number; hashData: MemoryValue[]; dstOffset: number };
export class Pedersen extends DynamicGasInstruction<PedersenInputs> {
  static type: string = 'PEDERSEN';
  static readonly opcode: Opcode = Opcode.PEDERSEN;

  // Informs (de)serialization. See Instruction.deserialize.
  static readonly wireFormat: OperandType[] = [
    OperandType.UINT8,
    OperandType.UINT8,
    OperandType.UINT32,
    OperandType.UINT32,
    OperandType.UINT32,
  ];

  constructor(
    private indirect: number,
    private dstOffset: number,
    private messageOffset: number,
    private messageSizeOffset: number,
  ) {
    super();
  }

  protected loadInputs(context: AvmContext): PedersenInputs {
    const [dstOffset, messageOffset, messageSizeOffset] = Addressing.fromWire(this.indirect).resolve(
      [this.dstOffset, this.messageOffset, this.messageSizeOffset],
      context.machineState.memory,
    );

    // We hash a set of field elements
    const messageSize = Number(context.machineState.memory.get(messageSizeOffset).toBigInt());
    const hashData = context.machineState.memory.getSlice(messageOffset, messageSize);

    return { messageSize, hashData, dstOffset };
  }

  protected async internalExecute(context: AvmContext, inputs: PedersenInputs): Promise<void> {
    const { hashData, dstOffset } = inputs;

    // No domain sep for now
    const hash = pedersenHash(hashData);
    context.machineState.memory.set(dstOffset, new Field(hash));

    context.machineState.incrementPc();
  }

  protected memoryOperations(inputs: PedersenInputs) {
    const { messageSize } = inputs;
    return { reads: messageSize + 1, writes: 1 };
  }
}
