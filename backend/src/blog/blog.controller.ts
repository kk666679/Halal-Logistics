import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { BlogService, CreateBlogPostDto, UpdateBlogPostDto, CreateBlogAuthorDto, CreateBlogCommentDto } from './blog.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // Blog Post Endpoints
  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() createPostDto: CreateBlogPostDto) {
    return await this.blogService.createPost(createPostDto);
  }

  @Get('posts')
  async getPosts(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('featured') featured?: string,
    @Query('authorId') authorId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
  ) {
    const filters: any = {};

    if (status) filters.status = status;
    if (category) filters.category = category;
    if (featured !== undefined) filters.featured = featured === 'true';
    if (authorId) filters.authorId = authorId;
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);
    if (search) filters.search = search;

    return await this.blogService.getPosts(filters);
  }

  @Get('posts/slug/:slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return await this.blogService.getPostBySlug(slug);
  }

  @Get('posts/:id')
  async getPostById(@Param('id') id: string) {
    return await this.blogService.getPostBySlug(id); // For now, treating ID as slug
  }

  @Put('posts/:id')
  @UseGuards(JwtAuthGuard)
  async updatePost(@Param('id') id: string, @Body() updatePostDto: UpdateBlogPostDto) {
    return await this.blogService.updatePost(id, updatePostDto);
  }

  @Delete('posts/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    await this.blogService.deletePost(id);
  }

  // Blog Author Endpoints
  @Post('authors')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createAuthor(@Body() createAuthorDto: CreateBlogAuthorDto) {
    return await this.blogService.createAuthor(createAuthorDto);
  }

  @Get('authors')
  async getAuthors() {
    return await this.blogService.getAuthors();
  }

  @Get('authors/:id')
  async getAuthorById(@Param('id') id: string) {
    return await this.blogService.getAuthorById(id);
  }

  // Blog Comment Endpoints
  @Post('comments')
  async createComment(@Body() createCommentDto: CreateBlogCommentDto) {
    return await this.blogService.createComment(createCommentDto);
  }

  @Put('comments/:id/approve')
  @UseGuards(JwtAuthGuard)
  async approveComment(@Param('id') id: string) {
    return await this.blogService.approveComment(id);
  }

  @Get('posts/:postId/comments')
  async getCommentsByPost(@Param('postId') postId: string) {
    return await this.blogService.getCommentsByPost(postId);
  }

  // Analytics Endpoints
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getBlogStats() {
    return await this.blogService.getBlogStats();
  }

  @Get('posts/popular')
  async getPopularPosts(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 5;
    return await this.blogService.getPopularPosts(limitNum);
  }

  @Get('posts/recent')
  async getRecentPosts(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 5;
    return await this.blogService.getRecentPosts(limitNum);
  }

  // Category Endpoints
  @Get('categories')
  async getCategories() {
    return {
      categories: [
        'TECHNOLOGY',
        'SUSTAINABILITY',
        'CERTIFICATION',
        'SUPPLY_CHAIN',
        'COMPLIANCE',
        'INNOVATION',
        'BEST_PRACTICES',
      ],
    };
  }

  // Tag Cloud Endpoint
  @Get('tags')
  async getTags() {
    // This would typically aggregate tags from all posts
    return {
      tags: [
        'Halal Certification',
        'Supply Chain',
        'Blockchain',
        'AI',
        'Machine Learning',
        'Sustainability',
        'Compliance',
        'Technology',
        'Innovation',
        'Best Practices',
      ],
    };
  }
}
