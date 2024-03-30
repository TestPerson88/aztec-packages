import { AztecAddress } from '@aztec/foundation/aztec-address';
import { pedersenHash } from '@aztec/foundation/crypto';
import { Fr } from '@aztec/foundation/fields';
import { BufferReader, serializeToBuffer, serializeToFields } from '@aztec/foundation/serialize';
import { FieldsOf } from '@aztec/foundation/types';

import { GeneratorIndex, TX_REQUEST_LENGTH } from '../constants.gen.js';
import { FunctionData } from './function_data.js';
import { TxContext } from './tx_context.js';

/**
 * Transaction request.
 */
export class TxRequest {
  constructor(
    /**
     * Sender.
     */
    public origin: AztecAddress,
    /**
     * Function data representing the function to call.
     */
    public functionData: FunctionData,
    /**
     * Pedersen hash of function arguments.
     */
    public argsHash: Fr,
    /**
     * Transaction context.
     */
    public txContext: TxContext,
  ) {}

  static getFields(fields: FieldsOf<TxRequest>) {
    return [fields.origin, fields.functionData, fields.argsHash, fields.txContext] as const;
  }

  static from(fields: FieldsOf<TxRequest>): TxRequest {
    return new TxRequest(...TxRequest.getFields(fields));
  }

  /**
   * Serialize as a buffer.
   * @returns The buffer.
   */
  toBuffer() {
    return serializeToBuffer([...TxRequest.getFields(this)]);
  }

  toFields(): Fr[] {
    const fields = serializeToFields(...TxRequest.getFields(this));
    if (fields.length !== TX_REQUEST_LENGTH) {
      throw new Error(`Invalid number of fields for TxRequest. Expected ${TX_REQUEST_LENGTH}, got ${fields.length}`);
    }
    return fields;
  }

  /**
   * Deserializes from a buffer or reader, corresponding to a write in cpp.
   * @param buffer - Buffer to read from.
   * @returns The deserialized TxRequest object.
   */
  static fromBuffer(buffer: Buffer | BufferReader): TxRequest {
    const reader = BufferReader.asReader(buffer);
    return new TxRequest(
      reader.readObject(AztecAddress),
      reader.readObject(FunctionData),
      Fr.fromBuffer(reader),
      reader.readObject(TxContext),
    );
  }

  hash() {
    return pedersenHash(this.toFields(), GeneratorIndex.TX_REQUEST);
  }

  static default() {
    return new TxRequest(AztecAddress.ZERO, FunctionData.default(), Fr.zero(), TxContext.default());
  }

  isDefault() {
    return this.origin.isZero() && this.functionData.isDefault() && this.argsHash.isZero() && this.txContext.isDefault();
  }
}
