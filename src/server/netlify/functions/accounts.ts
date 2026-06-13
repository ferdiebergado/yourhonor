import { db } from '@server/db';
import { createAccount, findActiveAccounts } from '@server/features/account/repo';
import { maskAccountNo } from '@server/features/account/utils';
import { parseJson, type HttpMethod } from '@server/http';
import { withMiddlewares, type AuthenticatedRequest } from '@server/http/middlewares';
import { encrypt } from '@server/security';
import {
  AccountFormSchema,
  type AccountDetail,
  type AccountFormValues,
  type NewAccount,
} from '@shared/schemas/account';
import type { User } from '@shared/schemas/user';
import type { ApiResponse } from '@shared/types';

async function handleCreate(data: AccountFormValues, userId: User['id']) {
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
}

async function listAccounts() {
  const accounts = await findActiveAccounts(db);

  const payload: ApiResponse<AccountDetail[]> = {
    success: true,
    data: accounts,
  };

  return Response.json(payload);
}

async function handler(request: AuthenticatedRequest) {
  switch (request.method as HttpMethod) {
    case 'GET': {
      return listAccounts();
    }

    case 'POST': {
      const account = await parseJson(request, AccountFormSchema);

      return handleCreate(account, request.session.userId);
    }

    default: {
      return new Response(undefined, { status: 405, headers: { Allowed: 'GET, POST' } });
    }
  }
}

export default withMiddlewares(handler);
