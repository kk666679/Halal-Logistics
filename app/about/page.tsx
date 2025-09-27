import PageWrapper from "@/components/PageWrapper";
import SectionDivider from "@/components/SectionDivider";
import WireframeCard from "@/components/WireframeCard";

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="space-y-8">
        <WireframeCard title="About HalalChain">
          <p>Wireframe placeholder for about content</p>
        </WireframeCard>

        <SectionDivider title="Our Mission" />

        <WireframeCard title="Mission Statement">
          <p>Wireframe placeholder for mission</p>
        </WireframeCard>

        <SectionDivider title="Our Values" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WireframeCard title="Integrity First">
            <p>Wireframe placeholder for value</p>
          </WireframeCard>
          <WireframeCard title="Global Excellence">
            <p>Wireframe placeholder for value</p>
          </WireframeCard>
          <WireframeCard title="Community Focus">
            <p>Wireframe placeholder for value</p>
          </WireframeCard>
          <WireframeCard title="Innovation">
            <p>Wireframe placeholder for value</p>
          </WireframeCard>
        </div>

        <SectionDivider title="Leadership Team" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <WireframeCard title="Dr. Ahmad Al-Rashid">
            <p>Founder & CEO</p>
          </WireframeCard>
          <WireframeCard title="Sarah Chen">
            <p>CTO</p>
          </WireframeCard>
          <WireframeCard title="Mohammed Al-Farsi">
            <p>Head of Compliance</p>
          </WireframeCard>
          <WireframeCard title="Dr. Aisha Rahman">
            <p>AI Research Director</p>
          </WireframeCard>
        </div>

        <SectionDivider title="Our Journey" />

        <WireframeCard title="Timeline">
          <p>Wireframe placeholder for timeline</p>
        </WireframeCard>

        <SectionDivider title="Join Our Mission" />

        <WireframeCard title="Call to Action">
          <p>Wireframe placeholder for CTA</p>
        </WireframeCard>
      </div>
    </PageWrapper>
  );
}
