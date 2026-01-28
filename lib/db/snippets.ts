/**
 * Database helpers for Code Snippets
 */

import { PrismaClient, CodeSnippet, SnippetVersion } from '../../generated/prisma';

const prisma = new PrismaClient();

export interface CreateSnippetInput {
  title: string;
  description?: string;
  code: string;
  language: string;
  tags?: string[];
  conversationId?: string;
  userId: string;
  isPublic?: boolean;
}

export interface UpdateSnippetInput {
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  tags?: string[];
  isPublic?: boolean;
  isFavorite?: boolean;
}

export interface SnippetWithVersions extends CodeSnippet {
  versions: SnippetVersion[];
  _count: {
    versions: number;
  };
}

/**
 * Create a new code snippet
 */
export async function createSnippet(
  input: CreateSnippetInput
): Promise<CodeSnippet> {
  const snippet = await prisma.codeSnippet.create({
    data: {
      title: input.title,
      description: input.description,
      code: input.code,
      language: input.language,
      tags: input.tags || [],
      conversationId: input.conversationId,
      userId: input.userId,
      isPublic: input.isPublic || false,
    },
  });

  // Create initial version
  await prisma.snippetVersion.create({
    data: {
      snippetId: snippet.id,
      code: input.code,
      version: 1,
      changelog: 'Initial version',
    },
  });

  return snippet;
}

/**
 * Get a snippet by ID
 */
export async function getSnippet(
  id: string,
  userId?: string
): Promise<SnippetWithVersions | null> {
  return prisma.codeSnippet.findFirst({
    where: {
      id,
      OR: [
        { userId: userId || '' },
        { isPublic: true },
      ],
    },
    include: {
      versions: {
        orderBy: { version: 'desc' },
        take: 5,
      },
      _count: {
        select: { versions: true },
      },
    },
  });
}

/**
 * List snippets for a user
 */
export async function listSnippets(
  userId: string,
  options: {
    language?: string;
    tags?: string[];
    conversationId?: string;
    favoritesOnly?: boolean;
    includePublic?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<CodeSnippet[]> {
  const {
    language,
    tags,
    conversationId,
    favoritesOnly = false,
    includePublic = false,
    limit = 50,
    offset = 0,
  } = options;

  return prisma.codeSnippet.findMany({
    where: {
      OR: [
        { userId },
        ...(includePublic ? [{ isPublic: true }] : []),
      ],
      ...(language && { language }),
      ...(tags && tags.length > 0 && { tags: { hasSome: tags } }),
      ...(conversationId && { conversationId }),
      ...(favoritesOnly && { isFavorite: true }),
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

/**
 * Update a snippet (creates a new version if code changes)
 */
export async function updateSnippet(
  id: string,
  userId: string,
  input: UpdateSnippetInput,
  changelog?: string
): Promise<CodeSnippet | null> {
  const existing = await prisma.codeSnippet.findFirst({
    where: { id, userId },
    include: {
      versions: {
        orderBy: { version: 'desc' },
        take: 1,
      },
    },
  });

  if (!existing) {
    return null;
  }

  // If code is being updated, create a new version
  if (input.code && input.code !== existing.code) {
    const latestVersion = existing.versions[0]?.version || 0;
    await prisma.snippetVersion.create({
      data: {
        snippetId: id,
        code: input.code,
        version: latestVersion + 1,
        changelog: changelog || 'Updated code',
      },
    });
  }

  return prisma.codeSnippet.update({
    where: { id },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.code && { code: input.code }),
      ...(input.language && { language: input.language }),
      ...(input.tags && { tags: input.tags }),
      ...(input.isPublic !== undefined && { isPublic: input.isPublic }),
      ...(input.isFavorite !== undefined && { isFavorite: input.isFavorite }),
    },
  });
}

/**
 * Delete a snippet
 */
export async function deleteSnippet(
  id: string,
  userId: string
): Promise<boolean> {
  const snippet = await prisma.codeSnippet.findFirst({
    where: { id, userId },
  });

  if (!snippet) {
    return false;
  }

  await prisma.codeSnippet.delete({
    where: { id },
  });

  return true;
}

/**
 * Toggle favorite status
 */
export async function toggleSnippetFavorite(
  id: string,
  userId: string
): Promise<CodeSnippet | null> {
  const snippet = await prisma.codeSnippet.findFirst({
    where: { id, userId },
  });

  if (!snippet) {
    return null;
  }

  return prisma.codeSnippet.update({
    where: { id },
    data: { isFavorite: !snippet.isFavorite },
  });
}

/**
 * Search snippets by title, description, or code
 */
export async function searchSnippets(
  userId: string,
  query: string,
  options: {
    language?: string;
    includePublic?: boolean;
    limit?: number;
  } = {}
): Promise<CodeSnippet[]> {
  const { language, includePublic = false, limit = 50 } = options;

  return prisma.codeSnippet.findMany({
    where: {
      OR: [
        {
          userId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { code: { contains: query, mode: 'insensitive' } },
          ],
        },
        ...(includePublic
          ? [
              {
                isPublic: true,
                OR: [
                  { title: { contains: query, mode: 'insensitive' as const } },
                  { description: { contains: query, mode: 'insensitive' as const } },
                  { code: { contains: query, mode: 'insensitive' as const } },
                ],
              },
            ]
          : []),
      ],
      ...(language && { language }),
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });
}

/**
 * Get snippet version history
 */
export async function getSnippetVersions(
  snippetId: string,
  userId: string
): Promise<SnippetVersion[]> {
  const snippet = await prisma.codeSnippet.findFirst({
    where: {
      id: snippetId,
      OR: [{ userId }, { isPublic: true }],
    },
  });

  if (!snippet) {
    return [];
  }

  return prisma.snippetVersion.findMany({
    where: { snippetId },
    orderBy: { version: 'desc' },
  });
}

/**
 * Restore a snippet to a specific version
 */
export async function restoreSnippetVersion(
  snippetId: string,
  versionNumber: number,
  userId: string
): Promise<CodeSnippet | null> {
  const version = await prisma.snippetVersion.findUnique({
    where: {
      snippetId_version: {
        snippetId,
        version: versionNumber,
      },
    },
  });

  if (!version) {
    return null;
  }

  return updateSnippet(
    snippetId,
    userId,
    { code: version.code },
    `Restored to version ${versionNumber}`
  );
}

/**
 * Get languages used in snippets
 */
export async function getSnippetLanguages(userId: string): Promise<string[]> {
  const snippets = await prisma.codeSnippet.findMany({
    where: { userId },
    select: { language: true },
    distinct: ['language'],
  });

  return snippets.map((s) => s.language);
}

/**
 * Get all tags used in snippets
 */
export async function getSnippetTags(userId: string): Promise<string[]> {
  const snippets = await prisma.codeSnippet.findMany({
    where: { userId },
    select: { tags: true },
  });

  const allTags = snippets.flatMap((s) => s.tags);
  return [...new Set(allTags)].sort();
}

/**
 * Export snippet as a file content
 */
export async function exportSnippet(
  id: string,
  userId: string
): Promise<{ filename: string; content: string; language: string } | null> {
  const snippet = await prisma.codeSnippet.findFirst({
    where: {
      id,
      OR: [{ userId }, { isPublic: true }],
    },
  });

  if (!snippet) {
    return null;
  }

  const extensions: Record<string, string> = {
    typescript: '.ts',
    javascript: '.js',
    python: '.py',
    prisma: '.prisma',
    sql: '.sql',
    json: '.json',
    yaml: '.yaml',
    markdown: '.md',
    html: '.html',
    css: '.css',
    rust: '.rs',
    go: '.go',
  };

  const ext = extensions[snippet.language.toLowerCase()] || '.txt';
  const filename = snippet.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() + ext;

  return {
    filename,
    content: snippet.code,
    language: snippet.language,
  };
}
