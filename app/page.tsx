import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { CertificationSection } from "@/components/sections/certification-section"
import { TrackingSection } from "@/components/sections/tracking-section"
import { BlockchainSection } from "@/components/sections/blockchain-section"
import { ComplianceSection } from "@/components/sections/compliance-section"
import { CtaSection } from "@/components/sections/cta-section"

export default function HomePage() {
  return (
    <main className="flex flex-col items-center relative">
      <HeroSection />
      <FeaturesSection />
      <CertificationSection />
      <TrackingSection />
      <BlockchainSection />
      <ComplianceSection />
      <CtaSection />
    </main>
  )
}
