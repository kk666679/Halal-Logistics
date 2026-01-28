/**
 * Database helpers for AI Sessions
 */

import { PrismaClient, Session, Conversation } from '../../generated/prisma';

const prisma = new PrismaClient();

export interface SessionContext {
  projectType?: 'web' | 'api' | 'mobile' | 'fullstack';
  techStack?: string[];
  developmentPhase?: 'planning' | 'development' | 'testing' | 'deployment';
  customInstructions?: string;
  preferredProvider?: 'openai' | 'ollama';
  preferredModel?: string;
}

export interface CreateSessionInput {
  name: string;
  description?: string;
  userId: string;
  context?: SessionContext;
}

export interface UpdateSessionInput {
  name?: string;
  description?: string;
  context?: SessionContext;
  isActive?: boolean;
}

export interface SessionWithConversations extends Session {
  conversations: Conversation[];
  _count: {
    conversations: number;
  };
}

/**
 * Create a new session
 */
export async function createSession(
  input: CreateSessionInput
): Promise<Session> {
  return prisma.session.create({
    data: {
      name: input.name,
      description: input.description,
      userId: input.userId,
      context: input.context as Record<string, unknown>,
    },
  });
}

/**
 * Get a session by ID
 */
export async function getSession(
  id: string,
  userId: string
): Promise<SessionWithConversations | null> {
  return prisma.session.findFirst({
    where: { id, userId },
    include: {
      conversations: {
        where: { isArchived: false },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      },
      _count: {
        select: { conversations: true },
      },
    },
  });
}

/**
 * List sessions for a user
 */
export async function listSessions(
  userId: string,
  options: {
    activeOnly?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<SessionWithConversations[]> {
  const { activeOnly = true, limit = 20, offset = 0 } = options;

  return prisma.session.findMany({
    where: {
      userId,
      ...(activeOnly && { isActive: true }),
    },
    include: {
      conversations: {
        where: { isArchived: false },
        orderBy: { updatedAt: 'desc' },
        take: 3,
      },
      _count: {
        select: { conversations: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

/**
 * Update a session
 */
export async function updateSession(
  id: string,
  userId: string,
  input: UpdateSessionInput
): Promise<Session | null> {
  const session = await prisma.session.findFirst({
    where: { id, userId },
  });

  if (!session) {
    return null;
  }

  return prisma.session.update({
    where: { id },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.context && { context: input.context as Record<string, unknown> }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
    },
  });
}

/**
 * Update session context
 */
export async function updateSessionContext(
  id: string,
  userId: string,
  context: Partial<SessionContext>
): Promise<Session | null> {
  const session = await prisma.session.findFirst({
    where: { id, userId },
  });

  if (!session) {
    return null;
  }

  const existingContext = (session.context as SessionContext) || {};
  const mergedContext = { ...existingContext, ...context };

  return prisma.session.update({
    where: { id },
    data: {
      context: mergedContext as Record<string, unknown>,
    },
  });
}

/**
 * Delete a session (and optionally its conversations)
 */
export async function deleteSession(
  id: string,
  userId: string,
  deleteConversations: boolean = false
): Promise<boolean> {
  const session = await prisma.session.findFirst({
    where: { id, userId },
  });

  if (!session) {
    return false;
  }

  if (deleteConversations) {
    // Delete all conversations in this session
    await prisma.conversation.deleteMany({
      where: { sessionId: id },
    });
  } else {
    // Just unlink conversations from this session
    await prisma.conversation.updateMany({
      where: { sessionId: id },
      data: { sessionId: null },
    });
  }

  await prisma.session.delete({
    where: { id },
  });

  return true;
}

/**
 * Archive a session (deactivate)
 */
export async function archiveSession(
  id: string,
  userId: string
): Promise<Session | null> {
  return updateSession(id, userId, { isActive: false });
}

/**
 * Get session context for AI prompts
 */
export async function getSessionContext(
  id: string,
  userId: string
): Promise<SessionContext | null> {
  const session = await prisma.session.findFirst({
    where: { id, userId },
    select: { context: true },
  });

  return (session?.context as SessionContext) || null;
}

/**
 * Get active session for a user (most recently updated)
 */
export async function getActiveSession(
  userId: string
): Promise<Session | null> {
  return prisma.session.findFirst({
    where: { userId, isActive: true },
    orderBy: { updatedAt: 'desc' },
  });
}

/**
 * Get or create default session for a user
 */
export async function getOrCreateDefaultSession(
  userId: string
): Promise<Session> {
  const existingSession = await getActiveSession(userId);
  
  if (existingSession) {
    return existingSession;
  }

  return createSession({
    name: 'Default Session',
    description: 'Default HalalChain AI development session',
    userId,
    context: {
      projectType: 'fullstack',
      developmentPhase: 'development',
    },
  });
}

/**
 * Count sessions for a user
 */
export async function getSessionCount(
  userId: string,
  activeOnly: boolean = true
): Promise<number> {
  return prisma.session.count({
    where: {
      userId,
      ...(activeOnly && { isActive: true }),
    },
  });
}

/**
 * Duplicate a session
 */
export async function duplicateSession(
  id: string,
  userId: string,
  newName?: string
): Promise<Session | null> {
  const original = await prisma.session.findFirst({
    where: { id, userId },
  });

  if (!original) {
    return null;
  }

  return prisma.session.create({
    data: {
      name: newName || `${original.name} (Copy)`,
      description: original.description,
      userId: original.userId,
      context: original.context,
    },
  });
}
