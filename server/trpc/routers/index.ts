/**
 * Root tRPC Router
 * 
 * Combines all sub-routers into the main application router.
 */

import { router } from '../trpc';
import { chatRouter } from './chat';

/**
 * Main application router
 * This is the main router that combines all sub-routers.
 */
export const appRouter = router({
  chat: chatRouter,
});

// Export type definition of the API
export type AppRouter = typeof appRouter;
