"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal } from "@/components/scroll-reveal";
import { EnhancedBlogCard } from "@/components/ui/enhanced-blog-card";
import { WriterInvitationCard } from "@/components/ui/writer-invitation-card";
import { sampleBlogPosts, writerInvitation, blogCategories } from "@/lib/blog-data";
import { BlogCategory } from "@/lib/types";
import { Filter, Grid3X3, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function EnhancedBlogSection() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Filter posts based on category, search query, and featured status
  const filteredPosts = useMemo(() => {
    let posts = sampleBlogPosts;

    // Filter by category
    if (selectedCategory !== "all") {
      posts = posts.filter(post => post.category === selectedCategory);
    }

    // Filter by featured status
    if (showFeaturedOnly) {
      posts = posts.filter(post => post.featured);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.author.name.toLowerCase().includes(query)
      );
    }

    // Sort by featured first, then by date
    return posts.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });
  }, [selectedCategory, searchQuery, showFeaturedOnly]);

  // Get featured posts for the hero section
  const featuredPosts = useMemo(() => {
    return sampleBlogPosts.filter(post => post.featured).slice(0, 2);
  }, []);

  return (
    <section id="blog" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        {/* Header Section */}
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl">
                Halal Logistics Insights
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70">
                Stay updated with the latest insights, innovations, and best practices in Halal supply chain management.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Writer Invitation - Top */}
        <div className="mb-12">
          <WriterInvitationCard invitation={writerInvitation} />
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <ScrollReveal>
              <h3 className="text-2xl font-bold mb-6">Featured Articles</h3>
            </ScrollReveal>
            <div className="grid gap-6 lg:grid-cols-2">
              {featuredPosts.map((post) => (
                <EnhancedBlogCard
                  key={post.id}
                  post={post}
                  variant="featured"
                  showSocialShare={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <ScrollReveal>
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as BlogCategory | "all")}>
              <div className="flex items-center justify-between">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  {blogCategories.slice(0, 7).map((category) => (
                    <TabsTrigger key={category.value} value={category.value} className="text-xs">
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant={showFeaturedOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Featured
                  </Button>
                  
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Category Descriptions */}
              <div className="mt-4">
                {selectedCategory === "all" ? (
                  <p className="text-sm text-muted-foreground">
                    Browse all articles across {blogCategories.length} categories
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {blogCategories.find(c => c.value === selectedCategory)?.description}
                  </p>
                )}
              </div>
            </Tabs>
          </div>
        </ScrollReveal>

        {/* Blog Posts Grid/List */}
        {filteredPosts.length > 0 ? (
          <div className={
            viewMode === "grid"
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-6"
          }>
            {filteredPosts.map((post) => (
              <EnhancedBlogCard
                key={post.id}
                post={post}
                variant="default"
                showSocialShare={false}
              />
            ))}
          </div>
        ) : (
          <ScrollReveal>
            <Card className="glassmorphic-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4 opacity-20">🔍</div>
                <CardTitle className="text-xl mb-2">No articles found</CardTitle>
                <CardDescription className="text-center max-w-md">
                  Try adjusting your search terms or browse a different category to find relevant articles.
                </CardDescription>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setShowFeaturedOnly(false);
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {/* Load More Button */}
        {filteredPosts.length > 0 && filteredPosts.length >= 6 && (
          <ScrollReveal>
            <div className="flex justify-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </ScrollReveal>
        )}

        {/* Writer Invitation - Bottom */}
        <div className="mt-16">
          <WriterInvitationCard invitation={writerInvitation} variant="compact" />
        </div>
      </div>
    </section>
  );
}
