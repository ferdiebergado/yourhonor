import { getDb } from '@backend/db';
import { createVenue } from '@backend/features/venue/repo';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { VenueFormSchema, type NewVenue } from '@shared/schemas/venue';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const { userId } = await getSession(req);

    const data = await parseJson(req, VenueFormSchema);

    const venue: NewVenue = {
      ...data,
      createdBy: userId,
      updatedBy: userId,
    };

    const db = await getDb();
    const id = await createVenue(db, venue);

    const payload: ApiResponse<number> = {
      success: true,
      data: id,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
