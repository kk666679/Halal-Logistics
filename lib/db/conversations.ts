/**
 * Database helpers for AI Conversations
 */

import { PrismaClient, Conversation, MessageRole } from '../../generated/prisma';

const prisma = new PrismaClient();

export interface CreateConversationInput {
  userId: string;
  title?: string;
  sessionId?: string;
  model?: string;
  provider?: string;
}

export interface UpdateConversationInput {
  title?: string;
  isArchived?: boolean;
  model?: string;
  provider?: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: {
    id: string;
    role: MessageRole;
    content: string;
    createdAt: Date;
  }[];
  _count: {
    messages: number;
  };
}

/**
 * Create a new conversation
 */
export async function createConversation(
  input: CreateConversationInput
): Promise<Conversation> {
  return prisma.conversation.create({
    data: {
      userId: input.userId,
      title: input.title,
      sessionId: input.sessionId,
      model: input.model,
      provider: input.provider,
    },
  });
}

/**
 * Get a conversation by ID
 */
export async function getConversation(
  id: string,
  userId: string
): Promise<ConversationWithMessages | null> {
  return prisma.conversation.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });
}

/**
 * List conversations for a user
 */
export async function listConversations(
  userId: string,
  options: {
    sessionId?: string;
    includeArchived?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<ConversationWithMessages[]> {
  const { sessionId, includeArchived = false, limit = 50, offset = 0 } = options;

  return prisma.conversation.findMany({
    where: {
      userId,
      ...(sessionId && { sessionId }),
      ...(!includeArchived && { isArchived: false }),
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: limit,
    skip: offset,
  });
}

/**
 * Update a conversation
 */
export async function updateConversation(
  id: string,
  userId: string,
  input: UpdateConversationInput
): Promise<Conversation | null> {
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId },
  });

  if (!conversation) {
    return null;
  }

  return prisma.conversation.update({
    where: { id },
    data: input,
  });
}

/**
 * Delete a conversation
 */
export async function deleteConversation(
  id: string,
  userId: string
): Promise<boolean> {
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId },
  });

  if (!conversation) {
    return false;
  }

  await prisma.conversation.delete({
    where: { id },
  });

  return true;
}

/**
 * Archive a conversation
 */
export async function archiveConversation(
  id: string,
  userId: string
): Promise<Conversation | null> {
  return updateConversation(id, userId, { isArchived: true });
}

/**
 * Get conversation count for a user
 */
export async function getConversationCount(
  userId: string,
  options: { sessionId?: string; includeArchived?: boolean } = {}
): Promise<number> {
  const { sessionId, includeArchived = false } = options;

  return prisma.conversation.count({
    where: {
      userId,
      ...(sessionId && { sessionId }),
      ...(!includeArchived && { isArchived: false }),
    },
  });
}

/**
 * Auto-generate title from first message
 */
export async function generateConversationTitle(
  id: string,
  userId: string
): Promise<Conversation | null> {
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId },
    include: {
      messages: {
        where: { role: 'user' },
        orderBy: { createdAt: 'asc' },
        take: 1,
      },
    },
  });

  if (!conversation || conversation.messages.length === 0) {
    return null;
  }

  const firstMessage = conversation.messages[0].content;
  const title = firstMessage.length > 50 
    ? firstMessage.substring(0, 47) + '...'
    : firstMessage;

  return prisma.conversation.update({
    where: { id },
    data: { title },
  });
}
