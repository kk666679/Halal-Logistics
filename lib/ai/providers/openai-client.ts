/**
 * OpenAI Provider Client
 * 
 * Handles all interactions with OpenAI's API using the AI SDK.
 */

import { createOpenAI } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import type { ChatMessage, ChatOptions, ChatResponse, StreamCallbacks } from './types';

// Create OpenAI provider instance
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Get the OpenAI model instance
 */
export function getOpenAIModel(modelName: string = 'gpt-4o') {
  return openai(modelName);
}

/**
 * Generate a chat completion with OpenAI
 */
export async function openaiChat(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<ChatResponse> {
  const {
    model = 'gpt-4o',
    temperature = 0.7,
    systemPrompt,
  } = options;

  const allMessages = systemPrompt
    ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
    : messages;

  try {
    const result = await generateText({
      model: openai(model),
      messages: allMessages,
      temperature,
    });

    // Extract usage info if available
    const usage = result.usage as { promptTokens?: number; completionTokens?: number } | undefined;

    return {
      content: result.text,
      provider: 'openai',
      model,
      tokenUsage: usage
        ? {
            prompt: usage.promptTokens ?? 0,
            completion: usage.completionTokens ?? 0,
            total: (usage.promptTokens ?? 0) + (usage.completionTokens ?? 0),
          }
        : undefined,
    };
  } catch (error) {
    console.error('[OpenAI] Chat error:', error);
    throw error;
  }
}

/**
 * Stream a chat completion with OpenAI
 */
export async function openaiStreamChat(
  messages: ChatMessage[],
  callbacks: StreamCallbacks,
  options: ChatOptions = {}
): Promise<void> {
  const {
    model = 'gpt-4o',
    temperature = 0.7,
    systemPrompt,
  } = options;

  const allMessages = systemPrompt
    ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
    : messages;

  try {
    const result = streamText({
      model: openai(model),
      messages: allMessages,
      temperature,
    });

    let fullContent = '';

    for await (const textPart of result.textStream) {
      fullContent += textPart;
      callbacks.onToken?.(textPart);
    }

    const rawUsage = await result.usage;
    const usage = rawUsage as { promptTokens?: number; completionTokens?: number } | undefined;
    
    callbacks.onComplete?.({
      content: fullContent,
      provider: 'openai',
      model,
      tokenUsage: usage
        ? {
            prompt: usage.promptTokens ?? 0,
            completion: usage.completionTokens ?? 0,
            total: (usage.promptTokens ?? 0) + (usage.completionTokens ?? 0),
          }
        : undefined,
    });
  } catch (error) {
    console.error('[OpenAI] Stream error:', error);
    callbacks.onError?.(error as Error);
    throw error;
  }
}

/**
 * Generate embeddings with OpenAI (placeholder)
 */
export async function openaiEmbedding(text: string): Promise<number[]> {
  // Note: For embeddings, you'd typically use the OpenAI embeddings API directly
  // This is a placeholder - actual implementation would use text-embedding-3-small
  console.log('[OpenAI] Embedding requested for text length:', text.length);
  
  // Return empty array - actual implementation would call the embedding API
  return [];
}
