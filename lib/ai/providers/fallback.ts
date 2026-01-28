/**
 * AI Provider Fallback Mechanism
 * 
 * Implements automatic failover between providers for resilience.
 */

import { openaiChat, openaiStreamChat } from './openai-client';
import { ollamaChat, ollamaStreamChat, isOllamaAvailable } from './ollama-client';
import type { ChatMessage, ChatOptions, ChatResponse, StreamCallbacks, ProviderType } from './types';

export interface FallbackOptions extends ChatOptions {
  preferredProvider?: ProviderType;
  fallbackOrder?: ProviderType[];
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Get default provider from environment
 */
export function getDefaultProvider(): ProviderType {
  const envProvider = process.env.DEFAULT_LLM_PROVIDER;
  if (envProvider === 'ollama' || envProvider === 'openai') {
    return envProvider;
  }
  return 'openai';
}

/**
 * Chat with automatic fallback between providers
 */
export async function chatWithFallback(
  messages: ChatMessage[],
  options: FallbackOptions = {}
): Promise<ChatResponse> {
  const {
    preferredProvider = getDefaultProvider(),
    fallbackOrder = preferredProvider === 'openai' 
      ? ['openai', 'ollama'] 
      : ['ollama', 'openai'],
    maxRetries = 2,
    retryDelay = 1000,
    ...chatOptions
  } = options;

  let lastError: Error | null = null;

  for (const provider of fallbackOrder) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`[Fallback] Trying ${provider} (attempt ${attempt + 1}/${maxRetries})`);
        
        if (provider === 'openai') {
          return await openaiChat(messages, {
            ...chatOptions,
            provider: 'openai',
            model: chatOptions.model || 'gpt-4o',
          });
        } else {
          // Check if Ollama is available before attempting
          const available = await isOllamaAvailable();
          if (!available) {
            console.log('[Fallback] Ollama not available, skipping...');
            break; // Skip to next provider
          }
          
          return await ollamaChat(messages, {
            ...chatOptions,
            provider: 'ollama',
            model: chatOptions.model || 'gpt-oss:120b',
          });
        }
      } catch (error) {
        lastError = error as Error;
        console.error(`[Fallback] ${provider} attempt ${attempt + 1} failed:`, error);
        
        if (attempt < maxRetries - 1) {
          await delay(retryDelay);
        }
      }
    }
  }

  throw new Error(
    `All providers failed. Last error: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * Stream chat with automatic fallback between providers
 */
export async function streamWithFallback(
  messages: ChatMessage[],
  callbacks: StreamCallbacks,
  options: FallbackOptions = {}
): Promise<void> {
  const {
    preferredProvider = getDefaultProvider(),
    fallbackOrder = preferredProvider === 'openai' 
      ? ['openai', 'ollama'] 
      : ['ollama', 'openai'],
    maxRetries = 2,
    retryDelay = 1000,
    ...chatOptions
  } = options;

  let lastError: Error | null = null;

  for (const provider of fallbackOrder) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`[Fallback Stream] Trying ${provider} (attempt ${attempt + 1}/${maxRetries})`);
        
        if (provider === 'openai') {
          await openaiStreamChat(messages, callbacks, {
            ...chatOptions,
            provider: 'openai',
            model: chatOptions.model || 'gpt-4o',
          });
          return; // Success - exit
        } else {
          // Check if Ollama is available before attempting
          const available = await isOllamaAvailable();
          if (!available) {
            console.log('[Fallback Stream] Ollama not available, skipping...');
            break; // Skip to next provider
          }
          
          await ollamaStreamChat(messages, callbacks, {
            ...chatOptions,
            provider: 'ollama',
            model: chatOptions.model || 'gpt-oss:120b',
          });
          return; // Success - exit
        }
      } catch (error) {
        lastError = error as Error;
        console.error(`[Fallback Stream] ${provider} attempt ${attempt + 1} failed:`, error);
        
        if (attempt < maxRetries - 1) {
          await delay(retryDelay);
        }
      }
    }
  }

  const finalError = new Error(
    `All providers failed. Last error: ${lastError?.message || 'Unknown error'}`
  );
  callbacks.onError?.(finalError);
  throw finalError;
}

/**
 * Check which providers are currently available
 */
export async function checkProviderHealth(): Promise<Record<ProviderType, boolean>> {
  const results: Record<ProviderType, boolean> = {
    openai: false,
    ollama: false,
  };

  // Check OpenAI (assume available if API key is set)
  results.openai = !!process.env.OPENAI_API_KEY;

  // Check Ollama availability
  results.ollama = await isOllamaAvailable();

  return results;
}

/**
 * Get the best available provider
 */
export async function getBestAvailableProvider(
  preferred: ProviderType = getDefaultProvider()
): Promise<ProviderType | null> {
  const health = await checkProviderHealth();
  
  // Try preferred first
  if (health[preferred]) {
    return preferred;
  }
  
  // Fall back to any available
  if (health.openai) return 'openai';
  if (health.ollama) return 'ollama';
  
  return null;
}

/**
 * Utility function to delay execution
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Select the best model based on provider and task type
 */
export function selectModel(
  provider: ProviderType,
  taskType: 'code' | 'chat' | 'fast' = 'code'
): string {
  const modelMap: Record<ProviderType, Record<string, string>> = {
    openai: {
      code: 'gpt-4o',
      chat: 'gpt-4o',
      fast: 'gpt-3.5-turbo',
    },
    ollama: {
      code: 'codellama:34b',
      chat: 'gpt-oss:120b',
      fast: 'llama3.1:8b',
    },
  };

  return modelMap[provider][taskType];
}
