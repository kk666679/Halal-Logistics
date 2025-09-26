import { BlogPost, BlogAuthor, BlogCategory, WriterInvitation } from "./types";

// Sample blog authors
export const sampleAuthors: BlogAuthor[] = [
  {
    id: "1",
    name: "Dr. Ahmed Hassan",
    bio: "Halal certification expert with 15+ years in Islamic finance and supply chain compliance.",
    company: "Islamic Finance Institute",
    role: "Senior Consultant",
    isGuestContributor: false,
    socialLinks: {
      linkedin: "https://linkedin.com/in/ahmed-hassan",
      website: "https://islamicfinanceinstitute.com"
    }
  },
  {
    id: "2",
    name: "Sarah Johnson",
    bio: "Supply chain sustainability specialist focusing on ethical and halal logistics practices.",
    company: "GreenChain Solutions",
    role: "Sustainability Director",
    isGuestContributor: true,
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarah-johnson",
      twitter: "https://twitter.com/sarahj_eco"
    }
  },
  {
    id: "3",
    name: "Mohammed Al-Rashid",
    bio: "Technology innovator specializing in blockchain solutions for halal supply chain transparency.",
    company: "TechHalal Solutions",
    role: "CTO",
    isGuestContributor: true,
    socialLinks: {
      linkedin: "https://linkedin.com/in/mohammed-al-rashid",
      website: "https://techhalal.com"
    }
  }
];

// Sample blog posts
export const sampleBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Blockchain Technology in Halal Supply Chain: Ensuring Transparency and Trust",
    slug: "blockchain-technology-halal-supply-chain-transparency",
    excerpt: "Discover how blockchain technology is revolutionizing halal supply chain management by providing unprecedented transparency and trust in product certification and tracking.",
    content: "Full content would go here...",
    featuredImage: "/placeholder.jpg",
    category: "Technology",
    tags: ["blockchain", "transparency", "certification", "innovation"],
    author: sampleAuthors[2],
    readTime: "8 min read",
    publishedDate: new Date("2024-01-15"),
    updatedDate: new Date("2024-01-15"),
    status: "published",
    featured: true,
    viewCount: 1250,
    likeCount: 45,
    shareCount: 23,
    seoTitle: "Blockchain in Halal Supply Chain | Technology for Transparency",
    seoDescription: "Learn how blockchain technology ensures transparency and trust in halal supply chain management and certification processes.",
    keywords: ["blockchain", "halal supply chain", "transparency", "certification", "technology"]
  },
  {
    id: "2",
    title: "Sustainable Practices in Halal Logistics: Balancing Faith and Environmental Responsibility",
    slug: "sustainable-practices-halal-logistics-environmental-responsibility",
    excerpt: "Explore how halal logistics companies are integrating sustainable practices while maintaining religious compliance and environmental stewardship.",
    content: "Full content would go here...",
    featuredImage: "/placeholder.jpg",
    category: "Sustainability",
    tags: ["sustainability", "environment", "halal", "logistics", "compliance"],
    author: sampleAuthors[1],
    readTime: "6 min read",
    publishedDate: new Date("2024-01-10"),
    updatedDate: new Date("2024-01-10"),
    status: "published",
    featured: true,
    viewCount: 980,
    likeCount: 32,
    shareCount: 18,
    seoTitle: "Sustainable Halal Logistics | Environmental Responsibility",
    seoDescription: "Discover sustainable practices in halal logistics that balance faith-based requirements with environmental responsibility.",
    keywords: ["sustainability", "halal logistics", "environment", "compliance", "green practices"]
  },
  {
    id: "3",
    title: "Digital Transformation in Halal Certification: Streamlining Compliance Processes",
    slug: "digital-transformation-halal-certification-compliance",
    excerpt: "Learn how digital transformation is revolutionizing halal certification processes, making compliance more efficient and accessible for businesses worldwide.",
    content: "Full content would go here...",
    featuredImage: "/placeholder.jpg",
    category: "Certification",
    tags: ["digital transformation", "certification", "compliance", "technology", "efficiency"],
    author: sampleAuthors[0],
    readTime: "7 min read",
    publishedDate: new Date("2024-01-05"),
    updatedDate: new Date("2024-01-05"),
    status: "published",
    featured: false,
    viewCount: 756,
    likeCount: 28,
    shareCount: 15,
    seoTitle: "Digital Halal Certification | Streamlined Compliance",
    seoDescription: "Explore digital transformation in halal certification processes and how it's making compliance more efficient for global businesses.",
    keywords: ["digital transformation", "halal certification", "compliance", "technology", "efficiency"]
  },
  {
    id: "4",
    title: "Supply Chain Resilience: Lessons from Global Halal Networks",
    slug: "supply-chain-resilience-global-halal-networks",
    excerpt: "Examine how global halal supply chain networks have built resilience and adaptability in the face of unprecedented challenges and disruptions.",
    content: "Full content would go here...",
    featuredImage: "/placeholder.jpg",
    category: "Supply Chain",
    tags: ["supply chain", "resilience", "global networks", "halal", "adaptability"],
    author: sampleAuthors[1],
    readTime: "9 min read",
    publishedDate: new Date("2023-12-28"),
    updatedDate: new Date("2023-12-28"),
    status: "published",
    featured: false,
    viewCount: 634,
    likeCount: 19,
    shareCount: 12,
    seoTitle: "Supply Chain Resilience | Global Halal Networks",
    seoDescription: "Learn about supply chain resilience strategies from global halal networks and how they've adapted to modern challenges.",
    keywords: ["supply chain resilience", "halal networks", "global logistics", "adaptability", "challenges"]
  },
  {
    id: "5",
    title: "AI and Machine Learning in Halal Compliance Monitoring",
    slug: "ai-machine-learning-halal-compliance-monitoring",
    excerpt: "Discover how artificial intelligence and machine learning are transforming halal compliance monitoring and quality assurance processes.",
    content: "Full content would go here...",
    featuredImage: "/placeholder.jpg",
    category: "Technology",
    tags: ["AI", "machine learning", "compliance", "monitoring", "quality assurance"],
    author: sampleAuthors[2],
    readTime: "10 min read",
    publishedDate: new Date("2023-12-20"),
    updatedDate: new Date("2023-12-20"),
    status: "published",
    featured: false,
    viewCount: 892,
    likeCount: 35,
    shareCount: 21,
    seoTitle: "AI in Halal Compliance | Machine Learning Solutions",
    seoDescription: "Explore how AI and machine learning are revolutionizing halal compliance monitoring and quality assurance in supply chains.",
    keywords: ["AI", "machine learning", "halal compliance", "monitoring", "quality assurance"]
  },
  {
    id: "6",
    title: "Best Practices for Halal Warehouse Management and Storage",
    slug: "best-practices-halal-warehouse-management-storage",
    excerpt: "Essential guidelines and best practices for maintaining halal integrity in warehouse management and product storage operations.",
    content: "Full content would go here...",
    featuredImage: "/placeholder.jpg",
    category: "Best Practices",
    tags: ["warehouse management", "storage", "best practices", "halal integrity", "operations"],
    author: sampleAuthors[0],
    readTime: "5 min read",
    publishedDate: new Date("2023-12-15"),
    updatedDate: new Date("2023-12-15"),
    status: "published",
    featured: false,
    viewCount: 567,
    likeCount: 22,
    shareCount: 8,
    seoTitle: "Halal Warehouse Management | Best Practices Guide",
    seoDescription: "Comprehensive guide to best practices for halal warehouse management and maintaining product integrity during storage.",
    keywords: ["halal warehouse", "storage management", "best practices", "product integrity", "operations"]
  }
];

// Writer invitation content
export const writerInvitation: WriterInvitation = {
  id: "1",
  title: "📝 Join Our Expert Contributors",
  description: "We're looking for industry professionals to share insights about Halal supply chain innovation, certification processes, and logistics best practices.",
  benefits: [
    "Reach 50K+ monthly readers in the Halal logistics industry",
    "Establish yourself as an industry thought leader",
    "Contribute to the growth of the global Halal ecosystem",
    "Network with other industry professionals",
    "Earn recognition and build your professional portfolio"
  ],
  ctaText: "Become a Contributor",
  ctaLink: "/contact?subject=writer-inquiry",
  image: "/placeholder.jpg"
};

// Blog categories with descriptions
export const blogCategories: { value: BlogCategory; label: string; description: string }[] = [
  {
    value: "Technology",
    label: "Technology",
    description: "Latest innovations in Halal logistics technology"
  },
  {
    value: "Sustainability",
    label: "Sustainability",
    description: "Environmental and ethical practices in Halal supply chains"
  },
  {
    value: "Certification",
    label: "Certification",
    description: "Halal certification processes and compliance"
  },
  {
    value: "Supply Chain",
    label: "Supply Chain",
    description: "Supply chain management and optimization"
  },
  {
    value: "Compliance",
    label: "Compliance",
    description: "Regulatory compliance and standards"
  },
  {
    value: "Innovation",
    label: "Innovation",
    description: "Cutting-edge solutions and emerging trends"
  },
  {
    value: "Best Practices",
    label: "Best Practices",
    description: "Industry best practices and guidelines"
  }
];
