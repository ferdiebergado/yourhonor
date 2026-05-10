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

export function maskAccountNo(accountNo: string): string {
  const digits = accountNo.match(/\d/g)?.length ?? 0;

  if (digits <= 4) return accountNo;

  let digitsToMask = digits - 4;

  return accountNo.replaceAll(/\d/g, digit => {
    if (digitsToMask > 0) {
      digitsToMask--;
      return '*';
    }

    return digit;
  });
}
