import { randomBytes } from 'node:crypto';

export const randBase64 = (length: number) => randomBytes(length).toString('base64');

export function toBuffer(value: ArrayBuffer | Uint8Array | Buffer): Buffer {
  if (Buffer.isBuffer(value)) return value;

  if (value instanceof ArrayBuffer) return Buffer.from(value);

  // Uint8Array (and other views)
  return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
}
