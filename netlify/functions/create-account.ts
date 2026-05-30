import { db } from '@backend/db';
import { createAccount } from '@backend/features/account/repo';
import { maskAccountNo } from '@backend/features/account/utils';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { encrypt } from '@backend/security';
import { getSession } from '@backend/session';
import { AccountFormSchema, type NewAccount } from '@shared/schemas/account';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);
    const { userId } = await getSession(req);

    const data = await parseJson(req, AccountFormSchema);

    const accountNoLast4 = data.accountNo.slice(-4);
    const accountNoMasked = maskAccountNo(data.accountNo);
    const accountNoBuffer = encrypt(data.accountNo);
    const accountNo = new Uint8Array(accountNoBuffer).buffer;

    const account: NewAccount = {
      ...data,
      accountNo,
      accountNoLast4,
      accountNoMasked,
      createdBy: userId,
    };

    const id = await createAccount(db, account);

    const payload: ApiResponse<number> = {
      success: true,
      data: id,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
