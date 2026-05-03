import { getDb } from '@backend/db';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { createVenue } from '@backend/venue/repo';
import { VenueFormSchema, type CreateVenue, type Venue } from '@shared/schemas/venue';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const data = await parseJson(req, VenueFormSchema);

    const { userId } = await getSession(req);

    const venue: CreateVenue = {
      ...data,
      createdBy: userId,
      updatedBy: userId,
    };

    const db = await getDb();
    await createVenue(db, venue);

    const payload: ApiResponse<Venue> = {
      success: true,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
