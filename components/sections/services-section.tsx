"use client"

import { motion } from "framer-motion"
import { Shield, Truck, FileCheck, Database, Users, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/ui/animated-text"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { GradientButton } from "@/components/ui-library/buttons/gradient-button"

export function ServicesSection() {
  const services = [
    {
      icon: <Shield className="h-10 w-10 text-amber-600" />,
      title: "Halal Certification Management",
      description: "End-to-end Halal certification tracking with blockchain verification and automated compliance monitoring.",
      features: ["Real-time certificate validation", "Blockchain-verified records", "Automated renewal alerts"],
      borderClass: "border-glow-orange",
    },
    {
      icon: <Truck className="h-10 w-10 text-indigo-500" />,
      title: "Cold Chain Logistics",
      description: "Temperature-controlled supply chain management ensuring Halal compliance throughout transportation.",
      features: ["Temperature monitoring", "Route optimization", "Cross-contamination prevention"],
      borderClass: "border-glow-blue",
    },
    {
      icon: <FileCheck className="h-10 w-10 text-green-500" />,
      title: "Compliance Auditing",
      description: "Comprehensive audit management with automated reporting and regulatory compliance tracking.",
      features: ["Automated audit trails", "Regulatory reporting", "Compliance dashboards"],
      borderClass: "border-glow-green",
    },
    {
      icon: <Database className="h-10 w-10 text-purple-500" />,
      title: "Supply Chain Visibility",
      description: "Complete transparency across your entire supply chain with real-time tracking and analytics.",
      features: ["End-to-end visibility", "Real-time tracking", "Performance analytics"],
      borderClass: "border-glow-purple",
    },
    {
      icon: <Users className="h-10 w-10 text-red-500" />,
      title: "Multi-Stakeholder Platform",
      description: "Secure collaboration platform for suppliers, certifiers, auditors, and government agencies.",
      features: ["Role-based access", "Secure collaboration", "Document sharing"],
      borderClass: "border-glow-red",
    },
    {
      icon: <Globe className="h-10 w-10 text-blue-500" />,
      title: "Global Standards Compliance",
      description: "Support for international Halal standards including JAKIM, MUI, and other global certifications.",
      features: ["Multiple standard support", "Global certification", "International compliance"],
      borderClass: "border-glow-blue",
    },
  ]

  const processSteps = [
    {
      step: "01",
      title: "Product Registration",
      description: "Register your products and upload documentation for certification review"
    },
    {
      step: "02",
      title: "AI-Powered Verification",
      description: "Our AI agents automatically verify compliance against Halal standards"
    },
    {
      step: "03",
      title: "Blockchain Recording",
      description: "Approved certifications are permanently recorded on the blockchain"
    },
    {
      step: "04",
      title: "Continuous Monitoring",
      description: "Ongoing monitoring ensures sustained compliance throughout the supply chain"
    }
  ]

  return (
    <section id="services" className="relative w-full py-12 md:py-24 lg:py-32 bg-muted/30 overflow-hidden">
      <AnimatedBackground variant="dots" color="rgba(217, 119, 6, 0.05)" />

      <div className="container px-6 md:px-8">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <div className="space-y-4">
              <AnimatedText
                text="Comprehensive Halal Supply Chain Services"
                variant="heading"
                className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl gradient-text"
                animation="slide"
              />
              <AnimatedText
                text="From certification to delivery, we provide end-to-end solutions for Halal supply chain management with blockchain-powered transparency and AI-enhanced compliance."
                variant="paragraph"
                className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70"
                animation="fade"
                delay={0.3}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Services Grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {services.map((service, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className={`h-full glassmorphic-card border-none overflow-hidden group soft-glow ${service.borderClass}`}>
                  <CardHeader>
                    <div className="p-2 rounded-xl w-fit bg-muted/50 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      {service.icon}
                    </div>
                    <CardTitle className="mt-4 tracking-tight relative">
                      {service.title}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                      {service.description}
                    </CardDescription>

                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Process Section */}
        <ScrollReveal>
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-heading font-bold tracking-tighter mb-4">Our Process</h3>
              <p className="text-muted-foreground opacity-70">
                Streamlined workflow from certification to delivery
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="glassmorphic-card h-full">
                      <CardHeader>
                        <div className="text-4xl font-bold text-primary/30 mb-2">{step.step}</div>
                        <CardTitle className="text-lg tracking-tight">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="opacity-70">{step.description}</CardDescription>
                      </CardContent>
                    </Card>
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                    )}
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA Section */}
        <ScrollReveal delay={0.5}>
          <div className="mt-16 text-center">
            <Card className="glassmorphic-card max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl tracking-tight">Ready to Transform Your Supply Chain?</CardTitle>
                <CardDescription className="text-base">
                  Join leading Halal businesses worldwide who trust our platform for their supply chain management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <GradientButton
                    glowAmount={5}
                    className="px-6 py-2.5"
                    gradientFrom="from-amber-600"
                    gradientTo="to-indigo-600"
                    asChild
                  >
                    <a href="#contact">Get Started Today</a>
                  </GradientButton>
                  <GradientButton
                    glowAmount={5}
                    variant="outline"
                    className="px-6 py-2.5"
                    gradientFrom="from-amber-600"
                    gradientTo="to-indigo-600"
                    asChild
                  >
                    <a href="#demo">Request Demo</a>
                  </GradientButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
