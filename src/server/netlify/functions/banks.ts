import { db } from '@server/db';
import { createBank, findActiveBanks } from '@server/features/bank/repo';
import { type HttpMethod } from '@server/http';
import { withMiddlewares } from '@server/http/middlewares';
import { parseJson } from '@server/http/parsers';
import type { AppRequest, NetlifyFunction } from '@server/types';
import {
  BankFormSchema,
  type Bank,
  type BankFormValues,
  type BankItem,
  type NewBank,
} from '@shared/schemas/bank';
import type { User } from '@shared/schemas/user';
import type { ApiResponse } from '@shared/types';

async function handleCreate(data: BankFormValues, userId: User['id']) {
  const bank: NewBank = {
    ...data,
    createdBy: userId,
  };

  const id = await createBank(db, bank);

  const payload: ApiResponse<Bank['id']> = {
    success: true,
    data: id,
  };

  return Response.json(payload, { status: 201 });
}

async function listBanks() {
  const data = await findActiveBanks(db);

  const payload: ApiResponse<BankItem[]> = {
    success: true,
    data,
  };

  return Response.json(payload);
}

const handler: NetlifyFunction = async (request: AppRequest) => {
  switch (request.method as HttpMethod) {
    case 'GET': {
      return listBanks();
    }

    case 'POST': {
      const bank = await parseJson(request, BankFormSchema);

      return handleCreate(bank, request.session.userId);
    }

    default: {
      return new Response(undefined, { status: 405, headers: { Allowed: 'GET, POST' } });
    }
  }
};

export default withMiddlewares(handler);
