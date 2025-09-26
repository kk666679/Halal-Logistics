import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogPostPage from '@/app/blog/[slug]/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn()
}))

// Mock the blog data
jest.mock('@/lib/blog-data', () => ({
  sampleBlogPosts: [
    {
      id: '1',
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      excerpt: 'This is a test blog post excerpt',
      content: 'This is the full content of the test blog post.',
      category: 'Technology',
      tags: ['test', 'blog'],
      author: {
        name: 'Test Author',
        avatar: '/test-avatar.jpg',
        bio: 'Test author bio',
        company: 'Test Company',
        isGuestContributor: false,
        socialLinks: {
          linkedin: 'https://linkedin.com/test',
          twitter: 'https://twitter.com/test',
          website: 'https://test.com'
        }
      },
      publishedDate: new Date('2024-01-01'),
      updatedDate: new Date('2024-01-01'),
      readTime: '5 min read',
      viewCount: 100,
      likeCount: 10,
      featured: true,
      seoTitle: 'Test Blog Post SEO Title',
      seoDescription: 'Test blog post SEO description',
      keywords: ['test', 'blog', 'technology']
    }
  ],
  writerInvitation: {
    title: 'Test Invitation',
    description: 'Test description',
    ctaText: 'Join Now',
    ctaLink: '/join'
  }
}))

describe('BlogPostPage', () => {
  it('renders blog post content correctly', async () => {
    const mockParams = Promise.resolve({ slug: 'test-blog-post' })

    const component = await BlogPostPage({ params: mockParams })
    render(component)

    // Wait for the component to render
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    expect(screen.getByText('This is a test blog post excerpt')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })

  it('renders not found page for invalid slug', async () => {
    const mockParams = Promise.resolve({ slug: 'non-existent-post' })

    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const component = await BlogPostPage({ params: mockParams })
    render(component)

    // The component should handle the not found case
    consoleSpy.mockRestore()
  })
})
