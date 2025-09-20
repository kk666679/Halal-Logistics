import { HeroSection } from "@/components/sections/hero-section"
import { AIAgentSection } from "@/components/sections/ai-agent-section"
import { ServicesSection } from "@/components/sections/services-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { CertificationSection } from "@/components/sections/certification-section"
import { TrackingSection } from "@/components/sections/tracking-section"
import { TechnologySection } from "@/components/sections/technology-section"
import { CaseStudiesSection } from "@/components/sections/case-studies-section"
import { BlockchainSection } from "@/components/sections/blockchain-section"
import { ComplianceSection } from "@/components/sections/compliance-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { BlogSection } from "@/components/sections/blog-section"
import { FaqSection } from "@/components/sections/faq-section"
import { CtaSection } from "@/components/sections/cta-section"

export default function HomePage() {
  return (
    <main className="flex flex-col items-center relative">
      <HeroSection />
      <AIAgentSection />
      <ServicesSection />
      <FeaturesSection />
      <CertificationSection />
      <TrackingSection />
      <TechnologySection />
      <CaseStudiesSection />
      <BlockchainSection />
      <ComplianceSection />
      <PricingSection />
      <BlogSection />
      <FaqSection />
      <CtaSection />
    </main>
  )
}
