import { db } from '@server/db';
import { getSummary } from '@server/features/summary/repo';
import type { HttpMethod } from '@server/http';
import { withMiddlewares } from '@server/http/middlewares';
import type { AppRequest, NetlifyFunction } from '@server/types';
import type { ApiResponse, Summary } from '@shared/types';

const handler: NetlifyFunction = async (request: AppRequest) => {
  const allowedMethod: HttpMethod = 'GET';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

  const summary = await getSummary(db, request.session.userId);

  const payload: ApiResponse<Summary> = {
    success: true,
    data: summary,
  };

  return Response.json(payload);
};

export default withMiddlewares(handler);
