/**
 * tRPC Context
 * 
 * Creates the context for each tRPC request, including
 * authentication information and database access.
 */

import { PrismaClient } from '../../generated/prisma';
import { auth } from '@clerk/nextjs/server';

// Create a single Prisma client instance
const prisma = new PrismaClient();

export interface Context {
  prisma: typeof prisma;
  userId: string | null;
  sessionId: string | null;
}

/**
 * Create context for incoming requests
 * This is called for each request and provides the context to all procedures
 */
export async function createContext(): Promise<Context> {
  // Get the auth session from Clerk
  const { userId, sessionId } = await auth();

  return {
    prisma,
    userId: userId || null,
    sessionId: sessionId || null,
  };
}

/**
 * Create context for server-side calls (like in server components)
 */
export function createServerContext(userId?: string): Context {
  return {
    prisma,
    userId: userId || null,
    sessionId: null,
  };
}

export type { Context as TRPCContext };
