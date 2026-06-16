import type { Context as EdgeContext } from '@netlify/edge-functions';
import type { Context } from '@netlify/functions';

export type NetlifyFunction = (request: Request, context: Context) => Promise<Response>;
export type NetlifyEdgeFunction = (request: Request, context: EdgeContext) => Promise<Response>;
