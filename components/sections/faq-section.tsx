"use client";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Database, ShieldCheck, ArrowRight, TrendingUp } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { MotionStaggerContainer, MotionStaggerItem } from "@/components/ui/motion-components";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = [
    {
      question: "What is Halal Logistics?",
      answer: "Halal logistics refers to the transportation, storage, and handling of halal-certified products in compliance with Islamic principles, ensuring no cross-contamination with non-halal items and maintaining the integrity of the supply chain."
    },
    {
      question: "How does halal certification work in logistics?",
      answer: "Halal certification involves rigorous audits of the entire supply chain, from sourcing to delivery. Certified logistics providers use dedicated facilities, temperature-controlled environments, and blockchain tracking to verify compliance at every stage."
    },
    {
      question: "Why is traceability important in halal supply chains?",
      answer: "Traceability ensures full visibility into the product's journey, allowing consumers and regulators to verify halal status. Technologies like IoT sensors and blockchain provide real-time data on handling, storage conditions, and certifications."
    },
    {
      question: "What role does technology play in halal logistics?",
      answer: "AI, blockchain, and IoT are revolutionizing halal logistics by enabling automated compliance checks, predictive maintenance, and transparent tracking, reducing errors and building consumer trust."
    },
    {
      question: "How can businesses ensure halal compliance during transportation?",
      answer: "Businesses should partner with certified halal logistics providers, implement segregated storage, use GPS-enabled monitoring, and conduct regular audits to maintain compliance throughout the transportation process."
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70">
                Get answers to common questions about halal logistics and certification processes.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <MotionStaggerContainer className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <MotionStaggerItem key={index}>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </MotionStaggerItem>
            ))}
          </Accordion>
        </MotionStaggerContainer>
      </div>
    </section>
  );
}

export function LatestInsightsSection() {
  const insights = [
    {
      icon: Brain,
      title: "AI-Driven Quality Control",
      description: "Recent implementation of machine learning algorithms for real-time halal certification verification, reducing inspection times by 60% in major supply chains.",
      metric: "60% faster inspections",
    },
    {
      icon: Zap,
      title: "Automated Compliance Monitoring",
      description: "IoT sensors and blockchain integration enabling continuous monitoring of temperature, handling, and sourcing compliance throughout the logistics journey.",
      metric: "100% traceability",
    },
    {
      icon: Database,
      title: "Data-Driven Route Optimization",
      description: "Advanced analytics platforms analyzing historical data to optimize delivery routes, reducing transportation costs and carbon emissions by 25%.",
      metric: "25% cost reduction",
    },
    {
      icon: ShieldCheck,
      title: "Digital Certification Ecosystem",
      description: "Unified digital platform connecting producers, certifiers, and retailers, streamlining the halal certification process with instant verification.",
      metric: "Instant verification",
    },
  ];

  const caseStudies = [
    {
      company: "Global Halal Foods Inc.",
      achievement: "Achieved 40% reduction in compliance costs through AI automation",
      tech: "AI + Blockchain",
    },
    {
      company: "Middle East Logistics Hub",
      achievement: "Expanded market reach by 300% with digital traceability",
      tech: "IoT + Data Analytics",
    },
    {
      company: "Asian Halal Supply Chain",
      achievement: "Reduced food waste by 35% using predictive analytics",
      tech: "ML + IoT",
    },
  ];

  return (
    <section id="latest-insights" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        {/* Introduction */}
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl">
                Latest Insights in Halal Logistics
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70">
                Discover cutting-edge implementations transforming the halal supply chain industry through AI, automation, and data-driven solutions.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Key Advancements */}
        <MotionStaggerContainer className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {insights.map((insight, index) => (
            <MotionStaggerItem key={index} className="glassmorphic-card p-6 rounded-xl border-none soft-glow">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary w-12 h-12 flex items-center justify-center mt-1">
                  <insight.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{insight.title}</h3>
                    <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {insight.metric}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStaggerContainer>

        {/* Case Studies */}
        <ScrollReveal>
          <div className="mb-16">
            <h3 className="text-2xl font-heading font-bold text-center mb-8">Success Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {caseStudies.map((study, index) => (
                <div key={index} className="glassmorphic-card p-6 rounded-xl border-none soft-glow text-center">
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">{study.company}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{study.achievement}</p>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {study.tech}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Call to Action */}
        <ScrollReveal>
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto">
              Stay ahead of the curve with our latest technological advancements in halal logistics.
            </p>
            <Button asChild size="lg" className="group">
              <a href="/case-studies">
                Explore Case Studies
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
