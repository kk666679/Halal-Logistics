import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlogPost, BlogAuthor, BlogComment, BlogStatus, BlogCategory } from '@prisma/client';

export interface CreateBlogPostDto {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: BlogCategory;
  tags: string[];
  status?: BlogStatus;
  featured?: boolean;
  readTime: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords: string[];
  publishedDate?: Date;
  authorId: string;
}

export interface UpdateBlogPostDto {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  category?: BlogCategory;
  tags?: string[];
  status?: BlogStatus;
  featured?: boolean;
  readTime?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  publishedDate?: Date;
}

export interface CreateBlogAuthorDto {
  name: string;
  email: string;
  bio?: string;
  company?: string;
  role?: string;
  avatar?: string;
  isGuestContributor?: boolean;
  socialLinks?: any;
}

export interface CreateBlogCommentDto {
  content: string;
  authorName: string;
  authorEmail: string;
  postId: string;
  isReply?: boolean;
  parentId?: string;
  authorId?: string;
}

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // Blog Post Methods
  async createPost(createPostDto: CreateBlogPostDto): Promise<BlogPost> {
    try {
      // Check if slug already exists
      const existingPost = await this.prisma.blogPost.findUnique({
        where: { slug: createPostDto.slug }
      });

      if (existingPost) {
        throw new BadRequestException('Slug already exists');
      }

      // Check if author exists
      const author = await this.prisma.blogAuthor.findUnique({
        where: { id: createPostDto.authorId }
      });

      if (!author) {
        throw new BadRequestException('Author not found');
      }

      return await this.prisma.blogPost.create({
        data: {
          ...createPostDto,
          status: createPostDto.status || BlogStatus.DRAFT,
          featured: createPostDto.featured || false,
          publishedDate: createPostDto.publishedDate || null,
        },
        include: {
          author: true,
          comments: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getPosts(filters?: {
    status?: BlogStatus;
    category?: BlogCategory;
    featured?: boolean;
    authorId?: string;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<{ posts: BlogPost[]; total: number }> {
    const { status, category, featured, authorId, limit = 10, offset = 0, search } = filters || {};

    const where: any = {};

    if (status) where.status = status;
    if (category) where.category = category;
    if (featured !== undefined) where.featured = featured;
    if (authorId) where.authorId = authorId;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: search.split(' ').map(tag => tag.toLowerCase()) } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        include: {
          author: true,
          comments: {
            where: { isApproved: true, isReply: false },
            include: { replies: { where: { isApproved: true } } },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { publishedDate: 'desc' },
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return { posts, total };
  }

  async getPostBySlug(slug: string): Promise<BlogPost> {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: true,
        comments: {
          where: { isApproved: true },
          include: {
            author: true,
            replies: {
              where: { isApproved: true },
              include: { author: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    // Increment view count
    await this.prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return post;
  }

  async updatePost(id: string, updatePostDto: UpdateBlogPostDto): Promise<BlogPost> {
    try {
      // Check if post exists
      const existingPost = await this.prisma.blogPost.findUnique({
        where: { id }
      });

      if (!existingPost) {
        throw new NotFoundException('Blog post not found');
      }

      // Check if slug is being updated and if it already exists
      if (updatePostDto.slug && updatePostDto.slug !== existingPost.slug) {
        const slugExists = await this.prisma.blogPost.findUnique({
          where: { slug: updatePostDto.slug }
        });

        if (slugExists) {
          throw new BadRequestException('Slug already exists');
        }
      }

      return await this.prisma.blogPost.update({
        where: { id },
        data: updatePostDto,
        include: {
          author: true,
          comments: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deletePost(id: string): Promise<BlogPost> {
    try {
      const post = await this.prisma.blogPost.findUnique({
        where: { id }
      });

      if (!post) {
        throw new NotFoundException('Blog post not found');
      }

      return await this.prisma.blogPost.delete({
        where: { id },
        include: {
          author: true,
          comments: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Blog Author Methods
  async createAuthor(createAuthorDto: CreateBlogAuthorDto): Promise<BlogAuthor> {
    try {
      // Check if email already exists
      const existingAuthor = await this.prisma.blogAuthor.findUnique({
        where: { email: createAuthorDto.email }
      });

      if (existingAuthor) {
        throw new BadRequestException('Author with this email already exists');
      }

      return await this.prisma.blogAuthor.create({
        data: {
          ...createAuthorDto,
          isGuestContributor: createAuthorDto.isGuestContributor || false,
          isActive: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getAuthors(): Promise<BlogAuthor[]> {
    return await this.prisma.blogAuthor.findMany({
      where: { isActive: true },
      include: {
        posts: {
          where: { status: BlogStatus.PUBLISHED },
          select: { id: true, title: true, publishedDate: true },
        },
        _count: {
          select: { posts: true, comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAuthorById(id: string): Promise<BlogAuthor> {
    const author = await this.prisma.blogAuthor.findUnique({
      where: { id },
      include: {
        posts: {
          where: { status: BlogStatus.PUBLISHED },
          orderBy: { publishedDate: 'desc' },
        },
        comments: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return author;
  }

  // Blog Comment Methods
  async createComment(createCommentDto: CreateBlogCommentDto): Promise<BlogComment> {
    try {
      // Check if post exists
      const post = await this.prisma.blogPost.findUnique({
        where: { id: createCommentDto.postId }
      });

      if (!post) {
        throw new BadRequestException('Post not found');
      }

      // If it's a reply, check if parent comment exists
      if (createCommentDto.isReply && createCommentDto.parentId) {
        const parentComment = await this.prisma.blogComment.findUnique({
          where: { id: createCommentDto.parentId }
        });

        if (!parentComment) {
          throw new BadRequestException('Parent comment not found');
        }
      }

      return await this.prisma.blogComment.create({
        data: {
          ...createCommentDto,
          isApproved: false, // Comments need approval by default
          isReply: createCommentDto.isReply || false,
        },
        include: {
          post: true,
          author: true,
          parent: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async approveComment(id: string): Promise<BlogComment> {
    try {
      const comment = await this.prisma.blogComment.findUnique({
        where: { id }
      });

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      return await this.prisma.blogComment.update({
        where: { id },
        data: { isApproved: true },
        include: {
          post: true,
          author: true,
          replies: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getCommentsByPost(postId: string): Promise<BlogComment[]> {
    return await this.prisma.blogComment.findMany({
      where: {
        postId,
        isApproved: true,
        isReply: false,
      },
      include: {
        author: true,
        replies: {
          where: { isApproved: true },
          include: { author: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Analytics Methods
  async getBlogStats(): Promise<any> {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      approvedComments,
      totalAuthors,
      totalViews,
      totalLikes,
    ] = await Promise.all([
      this.prisma.blogPost.count(),
      this.prisma.blogPost.count({ where: { status: BlogStatus.PUBLISHED } }),
      this.prisma.blogPost.count({ where: { status: BlogStatus.DRAFT } }),
      this.prisma.blogComment.count(),
      this.prisma.blogComment.count({ where: { isApproved: true } }),
      this.prisma.blogAuthor.count({ where: { isActive: true } }),
      this.prisma.blogPost.aggregate({ _sum: { viewCount: true } }),
      this.prisma.blogPost.aggregate({ _sum: { likeCount: true } }),
    ]);

    return {
      posts: {
        total: totalPosts,
        published: publishedPosts,
        drafts: draftPosts,
      },
      comments: {
        total: totalComments,
        approved: approvedComments,
      },
      authors: totalAuthors,
      engagement: {
        totalViews: totalViews._sum.viewCount || 0,
        totalLikes: totalLikes._sum.likeCount || 0,
      },
    };
  }

  async getPopularPosts(limit: number = 5): Promise<BlogPost[]> {
    return await this.prisma.blogPost.findMany({
      where: { status: BlogStatus.PUBLISHED },
      include: {
        author: true,
        comments: {
          where: { isApproved: true },
        },
      },
      orderBy: [
        { viewCount: 'desc' },
        { likeCount: 'desc' },
        { shareCount: 'desc' },
      ],
      take: limit,
    });
  }

  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    return await this.prisma.blogPost.findMany({
      where: { status: BlogStatus.PUBLISHED },
      include: {
        author: true,
        comments: {
          where: { isApproved: true },
        },
      },
      orderBy: { publishedDate: 'desc' },
      take: limit,
    });
  }
}
