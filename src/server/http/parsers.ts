import * as z from 'zod';

import { BadRequestError, fromZodError } from '@server/errors';

export async function parseJson<TSchema extends z.ZodType>(
  request: Request,
  schema: TSchema
): Promise<z.output<TSchema>> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    throw new BadRequestError('Invalid json body');
  }

  return validate(schema, payload);
}

export function parseSearchParams<TSchema extends z.ZodType>(
  request: Request,
  schema: TSchema
): z.output<TSchema> {
  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());
  return validate(schema, searchParams);
}

export const parseRouteParams = <TSchema extends z.ZodType>(
  params: Record<string, string>,
  schema: TSchema
): z.output<TSchema> => validate(schema, params);

function validate<TSchema extends z.ZodType>(schema: TSchema, payload: unknown): z.output<TSchema> {
  const { success, error, data } = schema.safeParse(payload);
  if (!success) throw fromZodError(error);

  return data;
}
