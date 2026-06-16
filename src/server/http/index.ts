import type { Context as EdgeContext } from '@netlify/edge-functions';
import type { Context } from '@netlify/functions';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export type RequestContext = {
  timestamp: string;
  requestId: string;
  method: HttpMethod;
  path: string;
  ip?: string;
  city?: string;
  country?: string;
  userAgent?: string;
};

export const getBaseRequestContext = (
  req: Request,
  ctx: Context | EdgeContext
): RequestContext => ({
  timestamp: new Date().toISOString(),
  requestId: ctx.requestId,
  method: req.method as HttpMethod,
  path: req.url,
});

export const getRequestContext = (req: Request, ctx: Context | EdgeContext): RequestContext => ({
  ...getBaseRequestContext(req, ctx),
  ip: ctx.ip,
  city: ctx.geo.city ?? 'unknown',
  country: ctx.geo.country?.code ?? 'unknown',
  userAgent: req.headers.get('user-agent') ?? 'unknown',
});
