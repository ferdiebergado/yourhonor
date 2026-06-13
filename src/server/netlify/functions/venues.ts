import { db } from '@server/db';
import { createVenue, findActiveVenues } from '@server/features/venue/repo';
import { parseJson, type HttpMethod } from '@server/http';
import { withMiddlewares, type AuthenticatedRequest } from '@server/http/middlewares';
import type { User } from '@shared/schemas/user';
import {
  VenueFormSchema,
  type NewVenue,
  type VenueFormValues,
  type VenueItem,
} from '@shared/schemas/venue';
import type { ApiResponse } from '@shared/types';

async function handleCreate(data: VenueFormValues, userId: User['id']) {
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

async function listVenues() {
  const venues = await findActiveVenues(db);

  const payload: ApiResponse<VenueItem[]> = {
    success: true,
    data: venues,
  };

  return Response.json(payload);
}

async function handler(request: AuthenticatedRequest) {
  switch (request.method as HttpMethod) {
    case 'GET': {
      return listVenues();
    }

    case 'POST': {
      const venue = await parseJson(request, VenueFormSchema);

      return handleCreate(venue, request.session.userId);
    }

    default: {
      return new Response(undefined, { status: 405, headers: { Allowed: 'GET, POST' } });
    }
  }
}

export default withMiddlewares(handler);
