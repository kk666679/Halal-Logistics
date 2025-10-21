import PageWrapper from "@/components/PageWrapper";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { AIAgentSection } from "@/components/sections/ai-agent-section";
import { CaseStudiesSection } from "@/components/sections/case-studies-section";
import { TechnologySection } from "@/components/sections/technology-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { EnhancedBlogSection } from "@/components/sections/enhanced-blog-section";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <PageWrapper>
      <HeroSection />
      <ServicesSection />
      <AIAgentSection />
      <CaseStudiesSection />
      <TechnologySection />
      <PricingSection />
      <EnhancedBlogSection />
      <FaqSection />
      <CtaSection />
    </PageWrapper>
  );
}
