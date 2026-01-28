/**
 * tRPC Server Configuration
 * 
 * This is the main tRPC configuration file that sets up the router,
 * context, and procedures for the HalalChain AI Assistant.
 */

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import type { Context } from './context';

/**
 * Initialize tRPC with context and transformer
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

/**
 * Middleware to check if user is authenticated
 */
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure.use(isAuthenticated);

/**
 * Middleware for logging procedure calls
 */
const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;
  
  console.log(`[tRPC] ${type} ${path} - ${duration}ms`);
  
  return result;
});

/**
 * Logged procedure - adds logging to procedure calls
 */
export const loggedProcedure = t.procedure.use(loggerMiddleware);

/**
 * Protected and logged procedure
 */
export const protectedLoggedProcedure = t.procedure
  .use(loggerMiddleware)
  .use(isAuthenticated);
