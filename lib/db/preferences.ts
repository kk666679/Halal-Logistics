/**
 * Database helpers for User AI Preferences
 */

import { PrismaClient, UserAIPreference } from '../../generated/prisma';

const prisma = new PrismaClient();

export interface UpdatePreferencesInput {
  defaultProvider?: 'openai' | 'ollama';
  defaultModel?: string;
  enableStreaming?: boolean;
  enableCodeHighlight?: boolean;
  theme?: string;
}

/**
 * Get user AI preferences
 */
export async function getUserPreferences(
  userId: string
): Promise<UserAIPreference | null> {
  return prisma.userAIPreference.findUnique({
    where: { userId },
  });
}

/**
 * Get or create user AI preferences with defaults
 */
export async function getOrCreateUserPreferences(
  userId: string
): Promise<UserAIPreference> {
  const existing = await getUserPreferences(userId);
  
  if (existing) {
    return existing;
  }

  return prisma.userAIPreference.create({
    data: {
      userId,
      defaultProvider: 'openai',
      defaultModel: 'gpt-4o',
      enableStreaming: true,
      enableCodeHighlight: true,
      theme: 'dark',
    },
  });
}

/**
 * Update user AI preferences
 */
export async function updateUserPreferences(
  userId: string,
  input: UpdatePreferencesInput
): Promise<UserAIPreference> {
  // Ensure preferences exist
  await getOrCreateUserPreferences(userId);

  return prisma.userAIPreference.update({
    where: { userId },
    data: {
      ...(input.defaultProvider && { defaultProvider: input.defaultProvider }),
      ...(input.defaultModel && { defaultModel: input.defaultModel }),
      ...(input.enableStreaming !== undefined && { enableStreaming: input.enableStreaming }),
      ...(input.enableCodeHighlight !== undefined && { enableCodeHighlight: input.enableCodeHighlight }),
      ...(input.theme && { theme: input.theme }),
    },
  });
}

/**
 * Set default provider for a user
 */
export async function setDefaultProvider(
  userId: string,
  provider: 'openai' | 'ollama',
  model?: string
): Promise<UserAIPreference> {
  // Ensure preferences exist
  await getOrCreateUserPreferences(userId);

  const defaultModels: Record<string, string> = {
    openai: 'gpt-4o',
    ollama: 'gpt-oss:120b',
  };

  return prisma.userAIPreference.update({
    where: { userId },
    data: {
      defaultProvider: provider,
      defaultModel: model || defaultModels[provider],
    },
  });
}

/**
 * Toggle streaming preference
 */
export async function toggleStreaming(userId: string): Promise<UserAIPreference> {
  const prefs = await getOrCreateUserPreferences(userId);
  
  return prisma.userAIPreference.update({
    where: { userId },
    data: {
      enableStreaming: !prefs.enableStreaming,
    },
  });
}

/**
 * Toggle code highlight preference
 */
export async function toggleCodeHighlight(userId: string): Promise<UserAIPreference> {
  const prefs = await getOrCreateUserPreferences(userId);
  
  return prisma.userAIPreference.update({
    where: { userId },
    data: {
      enableCodeHighlight: !prefs.enableCodeHighlight,
    },
  });
}

/**
 * Set theme preference
 */
export async function setTheme(
  userId: string,
  theme: string
): Promise<UserAIPreference> {
  await getOrCreateUserPreferences(userId);

  return prisma.userAIPreference.update({
    where: { userId },
    data: { theme },
  });
}

/**
 * Reset preferences to defaults
 */
export async function resetPreferences(userId: string): Promise<UserAIPreference> {
  const existing = await getUserPreferences(userId);

  if (existing) {
    await prisma.userAIPreference.delete({
      where: { userId },
    });
  }

  return getOrCreateUserPreferences(userId);
}

/**
 * Get effective provider settings (from preferences or defaults)
 */
export async function getEffectiveProviderSettings(
  userId: string
): Promise<{ provider: string; model: string; streaming: boolean }> {
  const prefs = await getOrCreateUserPreferences(userId);
  
  return {
    provider: prefs.defaultProvider,
    model: prefs.defaultModel,
    streaming: prefs.enableStreaming,
  };
}
