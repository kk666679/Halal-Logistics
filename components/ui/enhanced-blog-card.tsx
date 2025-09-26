"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SocialShareButtons } from "@/components/ui/social-share-buttons";
import { BlogPostCard } from "@/lib/types";
import { Calendar, Clock, ArrowRight, Eye, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface EnhancedBlogCardProps {
  post: BlogPostCard;
  variant?: "default" | "featured";
  showSocialShare?: boolean;
}

export function EnhancedBlogCard({ 
  post, 
  variant = "default", 
  showSocialShare = false 
}: EnhancedBlogCardProps) {
  const articleUrl = `/blog/${post.slug}`;
  
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

  if (variant === "featured") {
    return (
      <ScrollReveal>
        <Card className="glassmorphic-card overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="md:flex">
            {/* Featured Image */}
            <div className="md:w-1/2">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-6xl opacity-20">📰</div>
              </div>
            </div>
            
            {/* Content */}
            <div className="md:w-1/2 p-6">
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                  {post.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                  <Link href={articleUrl}>{post.title}</Link>
                </CardTitle>
                
                <CardDescription className="text-sm leading-relaxed">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 pb-4">
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.author.isGuestContributor && "Guest Contributor"}
                      j{post.author.company && ` • ${post.author.company}`}
                    </p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(post.publishedDate, "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.featured ? "1.2k" : "856"} views
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-0 pt-4 border-t">
                <div className="flex items-center justify-between w-full">
                  <Button asChild>
                    <Link href={articleUrl} className="flex items-center gap-2">
                      Read Full Article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </div>
          </div>
        </Card>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal>
      <Card className="glassmorphic-card h-full group hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Featured Image */}
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
          <div className="text-4xl opacity-20">📰</div>
          {post.featured && (
            <Badge className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
              Featured
            </Badge>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className={getCategoryColor(post.category)}>
              {post.category}
            </Badge>
          </div>
          
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
            <Link href={articleUrl}>{post.title}</Link>
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-4">
          <CardDescription className="text-sm leading-relaxed line-clamp-3 mb-4">
            {post.excerpt}
          </CardDescription>

          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="text-xs">
                {post.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-xs font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {post.author.isGuestContributor && "Guest Contributor"}
              </p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(post.publishedDate, "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.featured ? "1.2k" : "856"}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 flex-col gap-3">
          <div className="flex items-center justify-between w-full">
            <Button asChild variant="default" size="sm">
              <Link href={articleUrl} className="flex items-center gap-2">
                Read Article
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Heart className="h-3 w-3" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {post.featured ? "45" : "28"}
              </span>
            </div>
          </div>

          {showSocialShare && (
            <SocialShareButtons
              url={articleUrl}
              title={post.title}
              description={post.excerpt}
              variant="compact"
            />
          )}
        </CardFooter>
      </Card>
    </ScrollReveal>
  );
}
