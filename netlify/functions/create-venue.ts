import { getDb } from '@backend/db';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { createVenue } from '@backend/venue/repo';
import { VenueFormSchema, type CreateVenue } from '@shared/schemas/venue';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const venue = await parseJson(req, VenueFormSchema);

    const { userId } = await getSession(req);

    const data: CreateVenue = {
      ...venue,
      createdBy: userId,
      updatedBy: userId,
    };

    const db = await getDb();
    const venueId = await createVenue(db, data);

    const payload: ApiResponse<typeof data & { id: number }> = {
      success: true,
      data: { id: venueId, ...data },
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
