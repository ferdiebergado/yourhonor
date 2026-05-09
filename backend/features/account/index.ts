import { decrypt, encrypt } from '@backend/security';
import { toBuffer } from '@backend/utils';

export type AccountDetails = {
  branch: string;
  accountNumber: string;
  accountName: string;
};

export const serializeDetails = (details: AccountDetails): Buffer =>
  encrypt(Buffer.from(JSON.stringify(details)));

export function deserializeDetails(serialized: ArrayBuffer | Uint8Array | Buffer): AccountDetails {
  const buffer = toBuffer(serialized);
  const decrypted = decrypt(buffer).toString();

  return JSON.parse(decrypted) as AccountDetails;
}
