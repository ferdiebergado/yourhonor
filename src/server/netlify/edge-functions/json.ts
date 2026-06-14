import type { Config, Context } from '@netlify/edge-functions';

import { ERROR_CODES, type ApiResponse } from '../../../shared/types/index.ts';

export const config: Config = {
  method: ['POST', 'PUT', 'PATCH'],
};

export default (req: Request, ctx: Context) => {
  console.log('Validating content-type...');

  const contentType = req.headers.get('content-type');

  if (!contentType || !/^application\/json(;.*)?$/i.test(contentType)) {
    const payload: ApiResponse = {
      success: false,
      error: { code: ERROR_CODES.UNSUPPORTED_MEDIA, message: 'Unsupported data type' },
    };

    const meta = {
      requestId: ctx.requestId,
      contentType,
      ip: ctx.ip,
      geo: ctx.geo,
    };

    console.warn(payload.error, { meta });

    return Response.json(payload, { status: 415 });
  }
};
