'use client';

/**
 * Model Selector Component
 * 
 * Allows users to select the AI provider and model for chat.
 */

import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export type ProviderType = 'openai' | 'ollama';

interface ModelOption {
  provider: ProviderType;
  model: string;
  label: string;
  description: string;
  tier: 'premium' | 'standard' | 'fast';
}

const modelOptions: ModelOption[] = [
  {
    provider: 'openai',
    model: 'gpt-4o',
    label: 'GPT-4o',
    description: 'Most capable, best for complex code',
    tier: 'premium',
  },
  {
    provider: 'openai',
    model: 'gpt-4o-mini',
    label: 'GPT-4o Mini',
    description: 'Balanced performance and cost',
    tier: 'standard',
  },
  {
    provider: 'ollama',
    model: 'gpt-oss:120b',
    label: 'GPT-OSS 120B',
    description: 'Large model via Ollama Cloud',
    tier: 'premium',
  },
  {
    provider: 'ollama',
    model: 'llama3.1:8b',
    label: 'Llama 3.1 8B',
    description: 'Fastest, cost-effective',
    tier: 'fast',
  },
];

interface ModelSelectorProps {
  selectedProvider: ProviderType;
  selectedModel: string;
  onSelect: (provider: ProviderType, model: string) => void;
  disabled?: boolean;
}

export function ModelSelector({
  selectedProvider,
  selectedModel,
  onSelect,
  disabled = false,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentModel = modelOptions.find(
    (m) => m.provider === selectedProvider && m.model === selectedModel
  ) || modelOptions[0];

  const tierColors: Record<string, string> = {
    premium: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    standard: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    fast: 'bg-green-500/10 text-green-500 border-green-500/20',
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 min-w-[200px] justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{currentModel.label}</span>
          <Badge variant="outline" className={tierColors[currentModel.tier]}>
            {currentModel.tier}
          </Badge>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[320px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2">
              OpenAI
            </div>
            {modelOptions
              .filter((m) => m.provider === 'openai')
              .map((model) => (
                <ModelOption
                  key={`${model.provider}-${model.model}`}
                  model={model}
                  isSelected={model.provider === selectedProvider && model.model === selectedModel}
                  tierColor={tierColors[model.tier]}
                  onClick={() => {
                    onSelect(model.provider, model.model);
                    setIsOpen(false);
                  }}
                />
              ))}

            <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2">
              Ollama Cloud
            </div>
            {modelOptions
              .filter((m) => m.provider === 'ollama')
              .map((model) => (
                <ModelOption
                  key={`${model.provider}-${model.model}`}
                  model={model}
                  isSelected={model.provider === selectedProvider && model.model === selectedModel}
                  tierColor={tierColors[model.tier]}
                  onClick={() => {
                    onSelect(model.provider, model.model);
                    setIsOpen(false);
                  }}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ModelOptionProps {
  model: ModelOption;
  isSelected: boolean;
  tierColor: string;
  onClick: () => void;
}

function ModelOption({ model, isSelected, tierColor, onClick }: ModelOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors ${
        isSelected
          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{model.label}</span>
          {isSelected && (
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{model.description}</p>
      </div>
      <Badge variant="outline" className={`ml-2 ${tierColor}`}>
        {model.tier}
      </Badge>
    </button>
  );
}

export default ModelSelector;
