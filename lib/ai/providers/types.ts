/**
 * AI Provider Types
 * 
 * Common types and interfaces for AI providers.
 */

export type ProviderType = 'openai' | 'ollama';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ModelConfig {
  provider: ProviderType;
  model: string;
  label: string;
  description: string;
  tier: 'premium' | 'standard' | 'fast';
  maxTokens?: number;
  temperature?: number;
}

export interface ChatOptions {
  provider?: ProviderType;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  systemPrompt?: string;
}

export interface ChatResponse {
  content: string;
  provider: ProviderType;
  model: string;
  tokenUsage?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface StreamCallbacks {
  onToken?: (token: string) => void;
  onComplete?: (response: ChatResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Available models for each provider
 */
export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    provider: 'openai',
    model: 'gpt-4o',
    label: 'GPT-4o',
    description: 'Most capable, best for complex code generation',
    tier: 'premium',
    maxTokens: 4096,
  },
  {
    provider: 'openai',
    model: 'gpt-4o-mini',
    label: 'GPT-4o Mini',
    description: 'Balanced performance and cost',
    tier: 'standard',
    maxTokens: 4096,
  },
  {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    label: 'GPT-3.5 Turbo',
    description: 'Fast responses, good for simple tasks',
    tier: 'fast',
    maxTokens: 4096,
  },
  {
    provider: 'ollama',
    model: 'gpt-oss:120b',
    label: 'GPT-OSS 120B',
    description: 'Large model via Ollama Cloud',
    tier: 'premium',
    maxTokens: 4096,
  },
  {
    provider: 'ollama',
    model: 'llama3.1:70b',
    label: 'Llama 3.1 70B',
    description: 'Powerful open-source model',
    tier: 'standard',
    maxTokens: 4096,
  },
  {
    provider: 'ollama',
    model: 'llama3.1:8b',
    label: 'Llama 3.1 8B',
    description: 'Fastest, most cost-effective',
    tier: 'fast',
    maxTokens: 4096,
  },
  {
    provider: 'ollama',
    model: 'codellama:34b',
    label: 'Code Llama 34B',
    description: 'Specialized for code generation',
    tier: 'standard',
    maxTokens: 4096,
  },
];

/**
 * Get models by provider
 */
export function getModelsByProvider(provider: ProviderType): ModelConfig[] {
  return AVAILABLE_MODELS.filter((m) => m.provider === provider);
}

/**
 * Get models by tier
 */
export function getModelsByTier(tier: ModelConfig['tier']): ModelConfig[] {
  return AVAILABLE_MODELS.filter((m) => m.tier === tier);
}

/**
 * Get a specific model configuration
 */
export function getModelConfig(
  provider: ProviderType,
  model: string
): ModelConfig | undefined {
  return AVAILABLE_MODELS.find(
    (m) => m.provider === provider && m.model === model
  );
}

/**
 * Get default model for a provider
 */
export function getDefaultModel(provider: ProviderType): ModelConfig {
  const models = getModelsByProvider(provider);
  return models.find((m) => m.tier === 'premium') || models[0];
}
