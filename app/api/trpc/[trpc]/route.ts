/**
 * tRPC API Route Handler
 * 
 * This file handles all tRPC requests via Next.js App Router.
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../../../server/trpc/routers';
import { createContext } from '../../../../server/trpc/context';

/**
 * Handle tRPC requests
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
