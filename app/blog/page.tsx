import { EnhancedBlogSection } from "@/components/sections/enhanced-blog-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halal Logistics Blog | Insights & Best Practices",
  description: "Stay updated with the latest insights, innovations, and best practices in Halal supply chain management, certification, and logistics technology.",
  keywords: ["halal logistics", "supply chain", "certification", "blog", "insights", "best practices"],
  openGraph: {
    title: "Halal Logistics Blog | Industry Insights & Best Practices",
    description: "Discover the latest trends, innovations, and expert insights in Halal supply chain management and certification.",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <EnhancedBlogSection />
    </main>
  );
}
