/**
 * Database helpers for AI Messages
 */

import { PrismaClient, Message, MessageRole } from '../../generated/prisma';

const prisma = new PrismaClient();

export interface CreateMessageInput {
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface MessageWithConversation extends Message {
  conversation: {
    id: string;
    title: string | null;
    userId: string;
  };
}

/**
 * Create a new message
 */
export async function createMessage(input: CreateMessageInput): Promise<Message> {
  // Update the conversation's updatedAt timestamp
  await prisma.conversation.update({
    where: { id: input.conversationId },
    data: { updatedAt: new Date() },
  });

  return prisma.message.create({
    data: {
      conversationId: input.conversationId,
      role: input.role,
      content: input.content,
      metadata: input.metadata,
    },
  });
}

/**
 * Create multiple messages at once
 */
export async function createMessages(
  inputs: CreateMessageInput[]
): Promise<{ count: number }> {
  if (inputs.length === 0) {
    return { count: 0 };
  }

  // Update the conversation's updatedAt timestamp
  const conversationIds = [...new Set(inputs.map((i) => i.conversationId))];
  await prisma.conversation.updateMany({
    where: { id: { in: conversationIds } },
    data: { updatedAt: new Date() },
  });

  return prisma.message.createMany({
    data: inputs.map((input) => ({
      conversationId: input.conversationId,
      role: input.role,
      content: input.content,
      metadata: input.metadata,
    })),
  });
}

/**
 * Get a message by ID
 */
export async function getMessage(id: string): Promise<MessageWithConversation | null> {
  return prisma.message.findUnique({
    where: { id },
    include: {
      conversation: {
        select: {
          id: true,
          title: true,
          userId: true,
        },
      },
    },
  });
}

/**
 * Get messages for a conversation
 */
export async function getConversationMessages(
  conversationId: string,
  options: {
    limit?: number;
    offset?: number;
    orderBy?: 'asc' | 'desc';
  } = {}
): Promise<Message[]> {
  const { limit = 100, offset = 0, orderBy = 'asc' } = options;

  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: orderBy },
    take: limit,
    skip: offset,
  });
}

/**
 * Get the last N messages for a conversation
 */
export async function getRecentMessages(
  conversationId: string,
  count: number = 10
): Promise<Message[]> {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'desc' },
    take: count,
  });

  // Return in chronological order
  return messages.reverse();
}

/**
 * Delete a message
 */
export async function deleteMessage(id: string): Promise<boolean> {
  try {
    await prisma.message.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete all messages in a conversation
 */
export async function deleteConversationMessages(
  conversationId: string
): Promise<{ count: number }> {
  return prisma.message.deleteMany({
    where: { conversationId },
  });
}

/**
 * Get message count for a conversation
 */
export async function getMessageCount(conversationId: string): Promise<number> {
  return prisma.message.count({
    where: { conversationId },
  });
}

/**
 * Search messages by content
 */
export async function searchMessages(
  userId: string,
  query: string,
  options: {
    conversationId?: string;
    limit?: number;
  } = {}
): Promise<MessageWithConversation[]> {
  const { conversationId, limit = 50 } = options;

  return prisma.message.findMany({
    where: {
      content: {
        contains: query,
        mode: 'insensitive',
      },
      conversation: {
        userId,
        ...(conversationId && { id: conversationId }),
      },
    },
    include: {
      conversation: {
        select: {
          id: true,
          title: true,
          userId: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Get messages formatted for AI context
 */
export async function getMessagesForContext(
  conversationId: string,
  maxMessages: number = 20
): Promise<Array<{ role: string; content: string }>> {
  const messages = await getRecentMessages(conversationId, maxMessages);
  
  return messages.map((msg) => ({
    role: msg.role.toLowerCase(),
    content: msg.content,
  }));
}
