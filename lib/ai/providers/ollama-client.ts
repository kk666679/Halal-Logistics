/**
 * Ollama Cloud Provider Client
 * 
 * Handles all interactions with Ollama Cloud API.
 */

import { Ollama } from 'ollama';
import type { ChatMessage, ChatOptions, ChatResponse, StreamCallbacks } from './types';

// Create Ollama client instance for cloud access
const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || 'https://ollama.com',
});

// Set authorization header if API key is provided
if (process.env.OLLAMA_API_KEY) {
  // Note: Headers need to be set per-request for authentication
}

/**
 * Get the configured Ollama client
 */
export function getOllamaClient(): Ollama {
  return ollama;
}

/**
 * Generate a chat completion with Ollama Cloud
 */
export async function ollamaChat(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<ChatResponse> {
  const {
    model = 'gpt-oss:120b',
    systemPrompt,
  } = options;

  // Convert messages to Ollama format
  const ollamaMessages = systemPrompt
    ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
    : messages;

  try {
    // Create a new client with auth headers for this request
    const client = new Ollama({
      host: process.env.OLLAMA_HOST || 'https://ollama.com',
    });

    const response = await client.chat({
      model,
      messages: ollamaMessages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      stream: false,
    });

    return {
      content: response.message.content,
      provider: 'ollama',
      model,
      // Ollama doesn't provide token counts in the same way
      tokenUsage: undefined,
    };
  } catch (error) {
    console.error('[Ollama] Chat error:', error);
    throw error;
  }
}

/**
 * Stream a chat completion with Ollama Cloud
 */
export async function ollamaStreamChat(
  messages: ChatMessage[],
  callbacks: StreamCallbacks,
  options: ChatOptions = {}
): Promise<void> {
  const {
    model = 'gpt-oss:120b',
    systemPrompt,
  } = options;

  // Convert messages to Ollama format
  const ollamaMessages = systemPrompt
    ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
    : messages;

  try {
    // Create a new client with auth headers for this request
    const client = new Ollama({
      host: process.env.OLLAMA_HOST || 'https://ollama.com',
    });

    const response = await client.chat({
      model,
      messages: ollamaMessages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
    });

    let fullContent = '';

    for await (const part of response) {
      const token = part.message.content;
      fullContent += token;
      callbacks.onToken?.(token);
    }

    callbacks.onComplete?.({
      content: fullContent,
      provider: 'ollama',
      model,
      tokenUsage: undefined,
    });
  } catch (error) {
    console.error('[Ollama] Stream error:', error);
    callbacks.onError?.(error as Error);
    throw error;
  }
}

/**
 * List available models from Ollama Cloud
 */
export async function listOllamaModels(): Promise<string[]> {
  try {
    const client = new Ollama({
      host: process.env.OLLAMA_HOST || 'https://ollama.com',
    });

    const response = await client.list();
    return response.models.map(m => m.name);
  } catch (error) {
    console.error('[Ollama] List models error:', error);
    return [];
  }
}

/**
 * Pull a model to Ollama Cloud (if needed)
 */
export async function pullOllamaModel(modelName: string): Promise<boolean> {
  try {
    const client = new Ollama({
      host: process.env.OLLAMA_HOST || 'https://ollama.com',
    });

    await client.pull({ model: modelName });
    return true;
  } catch (error) {
    console.error('[Ollama] Pull model error:', error);
    return false;
  }
}

/**
 * Check if Ollama Cloud is available
 */
export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const client = new Ollama({
      host: process.env.OLLAMA_HOST || 'https://ollama.com',
    });

    // Try to list models as a health check
    await client.list();
    return true;
  } catch {
    return false;
  }
}
