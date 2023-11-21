import { BarretenbergSync } from '@aztec/bb.js';
import { Fr, Point } from '@aztec/foundation/fields';

import { GrumpkinScalar } from '../../../index.js';

const api = await BarretenbergSync.getSingleton();
const wasm = api.getWasm();

/**
 * Grumpkin elliptic curve operations.
 */
export class Grumpkin {
  // prettier-ignore
  static generator = Point.fromBuffer(Buffer.from([
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xcf, 0x13, 0x5e, 0x75, 0x06, 0xa4, 0x5d, 0x63,
    0x2d, 0x27, 0x0d, 0x45, 0xf1, 0x18, 0x12, 0x94, 0x83, 0x3f, 0xc4, 0x8d, 0x82, 0x3f, 0x27, 0x2c,
  ]));

  /**
   * Point generator
   * @returns The generator for the curve.
   */
  public generator(): Point {
    return Grumpkin.generator;
  }

  /**
   * Multiplies a point by a scalar (adds the point `scalar` amount of times).
   * @param point - Point to multiply.
   * @param scalar - Scalar to multiply by.
   * @returns Result of the multiplication.
   */
  public mul(point: Point, scalar: GrumpkinScalar): Point {
    wasm.writeMemory(0, point.toBuffer());
    wasm.writeMemory(64, scalar.toBuffer());
    wasm.call('ecc_grumpkin__mul', 0, 64, 96);
    return Point.fromBuffer(Buffer.from(wasm.getMemorySlice(96, 160)));
  }

  /**
   * Multiplies a set of points by a scalar.
   * @param points - Points to multiply.
   * @param scalar - Scalar to multiply by.
   * @returns Points multiplied by the scalar.
   */
  public batchMul(points: Point[], scalar: GrumpkinScalar) {
    const concatenatedPoints: Buffer = Buffer.concat(points.map(point => point.toBuffer()));
    const pointsByteLength = points.length * Point.SIZE_IN_BYTES;

    const mem = wasm.call('bbmalloc', pointsByteLength * 2);

    wasm.writeMemory(mem, concatenatedPoints);
    wasm.writeMemory(0, scalar.toBuffer());
    wasm.call('ecc_grumpkin__batch_mul', mem, 0, points.length, mem + pointsByteLength);

    const result: Buffer = Buffer.from(
      wasm.getMemorySlice(mem + pointsByteLength, mem + pointsByteLength + pointsByteLength),
    );
    wasm.call('bbfree', mem);

    const parsedResult: Point[] = [];
    for (let i = 0; i < pointsByteLength; i += 64) {
      parsedResult.push(Point.fromBuffer(result.slice(i, i + 64)));
    }
    return parsedResult;
  }

  /**
   * Gets a random field element.
   * @returns Random field element.
   */
  public getRandomFr(): Fr {
    wasm.call('ecc_grumpkin__get_random_scalar_mod_circuit_modulus', 0);
    return Fr.fromBuffer(Buffer.from(wasm.getMemorySlice(0, 32)));
  }

  /**
   * Converts a 512 bits long buffer to a field.
   * @param uint512Buf - The buffer to convert.
   * @returns Buffer representation of the field element.
   */
  public reduce512BufferToFr(uint512Buf: Buffer): Fr {
    wasm.writeMemory(0, uint512Buf);
    wasm.call('ecc_grumpkin__reduce512_buffer_mod_circuit_modulus', 0, 64);
    return Fr.fromBuffer(Buffer.from(wasm.getMemorySlice(64, 96)));
  }
}
