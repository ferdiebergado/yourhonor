import type { Config, Context, EdgeFunction } from '@netlify/edge-functions';

import { getRequestContext } from '../../../server/http/index.ts';
import { ERROR_CODES, type ApiResponse } from '../../../shared/types/index.ts';

export const config: Config = {
  method: ['POST', 'PUT', 'PATCH'],
};

const json: EdgeFunction = async (request: Request, context: Context) => {
  const contentType = request.headers.get('content-type');

  if (!contentType || !/^application\/json(;.*)?$/i.test(contentType)) {
    const payload: ApiResponse = {
      success: false,
      error: { code: ERROR_CODES.UNSUPPORTED_MEDIA, message: 'Unsupported data type' },
    };

    const status = 415;
    const meta = { ...getRequestContext(request, context), status };

    console.warn(payload.error, { meta });

    return Response.json(payload, { status });
  }

  return await context.next();
};

export default json;
