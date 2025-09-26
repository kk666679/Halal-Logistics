import { notFound } from "next/navigation";
import { Metadata } from "next";
import { sampleBlogPosts } from "@/lib/blog-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SocialShareButtons } from "@/components/ui/social-share-buttons";
import { WriterInvitationCard } from "@/components/ui/writer-invitation-card";
import { writerInvitation } from "@/lib/blog-data";
import { Calendar, Clock, Eye, Heart, MessageCircle, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = sampleBlogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.keywords?.join(", "),
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: "article",
      publishedTime: post.publishedDate.toISOString(),
      modifiedTime: post.updatedDate.toISOString(),
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
    },
  };
}

export async function generateStaticParams() {
  return sampleBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = sampleBlogPosts.find(p => p.slug === slug);
  
  if (!post) {
    notFound();
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Technology": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "Sustainability": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "Certification": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "Supply Chain": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      "Compliance": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      "Innovation": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
      "Best Practices": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  };

  // Get related posts (same category, excluding current post)
  const relatedPosts = sampleBlogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Navigation */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <article className="mb-12">
        <header className="mb-8">
          {/* Category and Featured Badge */}
          <div className="flex items-center gap-2 mb-4">
            <Badge className={getCategoryColor(post.category)}>
              {post.category}
            </Badge>
            {post.featured && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                Featured
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {post.excerpt}
          </p>

          {/* Author and Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6 border-y">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">
                  {post.author.isGuestContributor && "Guest Contributor"}
                  {post.author.company && ` • ${post.author.company}`}
                </p>
                {post.author.bio && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {post.author.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(post.publishedDate, "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.viewCount.toLocaleString()} views
              </div>
            </div>
          </div>

          {/* Social Links */}
          {post.author.socialLinks && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Follow:</span>
              {post.author.socialLinks.linkedin && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={post.author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
              {post.author.socialLinks.twitter && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={post.author.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    Twitter <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
              {post.author.socialLinks.website && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={post.author.socialLinks.website} target="_blank" rel="noopener noreferrer">
                    Website <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
            </div>
          )}
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
            <div className="text-8xl opacity-20">📰</div>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div className="text-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Article Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              {post.likeCount}
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Comments
            </Button>
          </div>

          <SocialShareButtons
            url={`${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`}
            title={post.title}
            description={post.excerpt}
          />
        </div>
      </article>

      {/* Writer Invitation Section */}
      <div className="mb-12">
        <WriterInvitationCard invitation={writerInvitation} variant="compact" />
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.id} className="glassmorphic-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className={getCategoryColor(relatedPost.category)}>
                      {relatedPost.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    <Link href={`/blog/${relatedPost.slug}`} className="hover:text-primary transition-colors">
                      {relatedPost.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">
                    {relatedPost.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{format(relatedPost.publishedDate, "MMM d, yyyy")}</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
