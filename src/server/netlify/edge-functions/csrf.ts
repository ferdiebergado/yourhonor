import type { Config, Context, EdgeFunction } from '@netlify/edge-functions';

import { getRequestContext } from '../../../server/http/index.ts';
import { ERROR_CODES, type ApiResponse } from '../../../shared/types/index.ts';

export const config: Config = {
  method: ['POST', 'PUT', 'PATCH', 'DELETE'],
};

const csrf: EdgeFunction = async (request: Request, context: Context) => {
  const status = 403;
  const meta = { ...getRequestContext(request, context), status };

  const fetchSite = request.headers.get('sec-fetch-site');

  if (!fetchSite) {
    const payload: ApiResponse = {
      success: false,
      error: { code: ERROR_CODES.FORBIDDEN, message: 'missing fetch metadata' },
    };

    console.warn(payload.error.message, { meta });

    return Response.json(payload, { status });
  }

  if (fetchSite !== 'same-origin') {
    const payload: ApiResponse = {
      success: false,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: 'cross-origin requests disallowed' },
    };

    console.warn(payload.error.message, { meta });

    return Response.json(payload, { status });
  }

  return await context.next();
};

export default csrf;
