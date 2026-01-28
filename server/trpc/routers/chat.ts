/**
 * Chat Router
 * 
 * Handles all AI chat-related tRPC procedures.
 */

import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { chatWithFallback, streamWithFallback, checkProviderHealth } from '../../../lib/ai/providers/fallback';
import { HALALCHAIN_SYSTEM_PROMPT, buildSystemPrompt, getPromptForTask } from '../../../lib/ai/prompts';
import { AVAILABLE_MODELS } from '../../../lib/ai/providers/types';
import type { ChatMessage, ProviderType } from '../../../lib/ai/providers/types';

// Input validation schemas
const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

const chatInputSchema = z.object({
  conversationId: z.string().optional(),
  messages: z.array(messageSchema),
  provider: z.enum(['openai', 'ollama']).optional(),
  model: z.string().optional(),
  systemPrompt: z.string().optional(),
  taskType: z.enum(['chat', 'fastapi', 'prisma', 'sdk', 'deployment', 'architecture']).optional(),
});

const createConversationSchema = z.object({
  title: z.string().optional(),
  sessionId: z.string().optional(),
  model: z.string().optional(),
  provider: z.enum(['openai', 'ollama']).optional(),
});

export const chatRouter = router({
  /**
   * Send a message and get an AI response
   */
  send: protectedProcedure
    .input(chatInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { messages, provider, model, systemPrompt, taskType } = input;

      // Build the system prompt based on task type and context
      const basePrompt = taskType 
        ? getPromptForTask(taskType) 
        : HALALCHAIN_SYSTEM_PROMPT;
      
      const finalSystemPrompt = systemPrompt || basePrompt;

      // Get response from AI with fallback
      const response = await chatWithFallback(
        messages as ChatMessage[],
        {
          preferredProvider: provider as ProviderType,
          model,
          systemPrompt: finalSystemPrompt,
        }
      );

      // Store messages in database if conversation ID provided
      if (input.conversationId) {
        // Store user message
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();
        if (lastUserMessage) {
          await ctx.prisma.message.create({
            data: {
              conversationId: input.conversationId,
              role: 'user',
              content: lastUserMessage.content,
            },
          });
        }

        // Store assistant response
        await ctx.prisma.message.create({
          data: {
            conversationId: input.conversationId,
            role: 'assistant',
            content: response.content,
            metadata: {
              provider: response.provider,
              model: response.model,
              tokenUsage: response.tokenUsage,
            },
          },
        });

        // Update conversation timestamp
        await ctx.prisma.conversation.update({
          where: { id: input.conversationId },
          data: { updatedAt: new Date() },
        });
      }

      return {
        content: response.content,
        provider: response.provider,
        model: response.model,
        tokenUsage: response.tokenUsage,
      };
    }),

  /**
   * Create a new conversation
   */
  createConversation: protectedProcedure
    .input(createConversationSchema)
    .mutation(async ({ input, ctx }) => {
      const conversation = await ctx.prisma.conversation.create({
        data: {
          userId: ctx.userId,
          title: input.title,
          sessionId: input.sessionId,
          model: input.model,
          provider: input.provider,
        },
      });

      return conversation;
    }),

  /**
   * Get a conversation with messages
   */
  getConversation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const conversation = await ctx.prisma.conversation.findFirst({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      return conversation;
    }),

  /**
   * List user's conversations
   */
  listConversations: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().optional(),
        includeArchived: z.boolean().optional().default(false),
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const conversations = await ctx.prisma.conversation.findMany({
        where: {
          userId: ctx.userId,
          ...(input.sessionId && { sessionId: input.sessionId }),
          ...(!input.includeArchived && { isArchived: false }),
        },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: { messages: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: input.limit,
        skip: input.offset,
      });

      return conversations;
    }),

  /**
   * Update a conversation
   */
  updateConversation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        isArchived: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const conversation = await ctx.prisma.conversation.updateMany({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
        data: {
          ...(input.title !== undefined && { title: input.title }),
          ...(input.isArchived !== undefined && { isArchived: input.isArchived }),
        },
      });

      return conversation;
    }),

  /**
   * Delete a conversation
   */
  deleteConversation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.conversation.deleteMany({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });

      return { success: true };
    }),

  /**
   * Get available models
   */
  getModels: protectedProcedure.query(async () => {
    return AVAILABLE_MODELS;
  }),

  /**
   * Check provider health status
   */
  getProviderHealth: protectedProcedure.query(async () => {
    return checkProviderHealth();
  }),

  /**
   * Generate title for conversation based on first message
   */
  generateTitle: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const conversation = await ctx.prisma.conversation.findFirst({
        where: {
          id: input.conversationId,
          userId: ctx.userId,
        },
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
      
      // Generate title using AI
      const response = await chatWithFallback(
        [
          {
            role: 'user',
            content: `Generate a short, descriptive title (max 50 characters) for a conversation that starts with this message. Return only the title, nothing else:\n\n"${firstMessage}"`,
          },
        ],
        {
          model: 'gpt-3.5-turbo', // Use fast model for title generation
          preferredProvider: 'openai',
        }
      );

      const title = response.content.trim().replace(/^["']|["']$/g, '');

      await ctx.prisma.conversation.update({
        where: { id: input.conversationId },
        data: { title },
      });

      return { title };
    }),
});
