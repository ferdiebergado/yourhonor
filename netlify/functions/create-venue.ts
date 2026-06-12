import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { createVenue } from '@backend/features/venue/repo';
import { checkMethod, parseJson } from '@backend/http';
import { getSession } from '@backend/session';
import { VenueFormSchema, type NewVenue } from '@shared/schemas/venue';
import type { ApiResponse } from '@shared/types';

async function handler(req: Request) {
  checkMethod(req, ['POST']);
  const { userId } = await getSession(req);

  const data = await parseJson(req, VenueFormSchema);

  const venue: NewVenue = {
    ...data,
    createdBy: userId,
  };

  const id = await createVenue(db, venue);

  const payload: ApiResponse<number> = {
    success: true,
    data: id,
  };

  return Response.json(payload, { status: 201 });
}

export default withErrorHandling(handler);
