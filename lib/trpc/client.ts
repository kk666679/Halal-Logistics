/**
 * tRPC Client Configuration
 * 
 * Sets up the tRPC client for use in React components.
 */

import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '../../server/trpc/routers';

/**
 * Create the tRPC React hooks
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Get the base URL for tRPC requests
 */
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser - use relative URL
    return '';
  }
  // Server - use absolute URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Create tRPC client configuration
 */
export function getTRPCClientConfig() {
  return {
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        transformer: superjson,
      }),
    ],
  };
}

/**
 * Create a standalone tRPC client for server-side usage
 */
export function createTRPCClient() {
  return trpc.createClient(getTRPCClientConfig());
}
