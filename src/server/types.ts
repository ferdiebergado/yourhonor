import type { Context as EdgeContext } from '@netlify/edge-functions';

export type NetlifyEdgeFunction = (request: Request, context: EdgeContext) => Promise<Response>;
