import PageWrapper from "@/components/PageWrapper";
import SectionDivider from "@/components/SectionDivider";
import WireframeCard from "@/components/WireframeCard";

export default function ServicesPage() {
  return (
    <PageWrapper>
      <div className="space-y-8">
        <WireframeCard title="Our Services">
          <p>Wireframe placeholder for services overview</p>
        </WireframeCard>

        <SectionDivider title="Core Services" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WireframeCard title="Supply Chain Management">
            <p>Wireframe placeholder for service</p>
          </WireframeCard>
          <WireframeCard title="Certification Tracking">
            <p>Wireframe placeholder for service</p>
          </WireframeCard>
          <WireframeCard title="Blockchain Integration">
            <p>Wireframe placeholder for service</p>
          </WireframeCard>
          <WireframeCard title="AI Agent System">
            <p>Wireframe placeholder for service</p>
          </WireframeCard>
        </div>

        <SectionDivider title="Additional Services" />

        <WireframeCard title="Consulting & Support">
          <p>Wireframe placeholder for additional services</p>
        </WireframeCard>
      </div>
    </PageWrapper>
  );
}
