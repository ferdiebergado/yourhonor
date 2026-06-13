import { fromZodError } from '@server/errors';
import * as z from 'zod';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export function checkMethod(req: Request, allowedMethods: HttpMethod[]) {
  const allowed = new Set<HttpMethod>(allowedMethods);

  if (!allowed.has(req.method as HttpMethod))
    return new Response(undefined, { status: 405, headers: { Allow: [...allowed].join(',') } });
}

export async function parseJson<T extends z.ZodType>(req: Request, schema: T): Promise<z.infer<T>> {
  const jsonData = await req.json();
  const { success, error, data } = schema.safeParse(jsonData);
  if (!success) throw fromZodError(error);

  return data;
}

export function parseSearchParams<T extends z.ZodType>(req: Request, schema: T): z.infer<T> {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const { success, error, data } = schema.safeParse(params);
  if (!success) throw fromZodError(error);

  return data;
}

export function parseRouteParams<T extends z.ZodType>(
  params: Record<string, string>,
  schema: T
): z.infer<T> {
  const { success, error, data } = schema.safeParse(params);
  if (!success) throw fromZodError(error);

  return data;
}
