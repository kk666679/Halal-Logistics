"use client"

import { motion } from "framer-motion"
import { Database, Shield, Zap, Globe, Cpu, Cloud, Link2, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/ui/animated-text"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { ProgressCard } from "@/components/ui-library/cards/progress-card"

export function TechnologySection() {
  const technologies = [
    {
      icon: <Database className="h-8 w-8 text-indigo-500" />,
      title: "Oracle Blockchain Platform",
      description: "Enterprise-grade blockchain infrastructure for immutable record keeping and smart contract execution.",
      features: ["Hyperledger Fabric", "Smart Contracts", "Distributed Ledger"],
      performance: 99.9,
      category: "Blockchain"
    },
    {
      icon: <Cpu className="h-8 w-8 text-purple-500" />,
      title: "Multi-AI Agent System",
      description: "Advanced AI agents for certification validation, logistics optimization, and compliance monitoring.",
      features: ["Machine Learning", "Natural Language Processing", "Predictive Analytics"],
      performance: 95,
      category: "AI/ML"
    },
    {
      icon: <Cloud className="h-8 w-8 text-blue-500" />,
      title: "Oracle Cloud Infrastructure",
      description: "Scalable cloud infrastructure with enterprise-grade security and global availability.",
      features: ["Auto-scaling", "Global CDN", "Enterprise Security"],
      performance: 99.95,
      category: "Cloud"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Advanced Security",
      description: "Military-grade encryption and security protocols to protect sensitive Halal certification data.",
      features: ["256-bit Encryption", "Zero-Knowledge Proofs", "Multi-factor Authentication"],
      performance: 100,
      category: "Security"
    },
    {
      icon: <Zap className="h-8 w-8 text-amber-500" />,
      title: "Real-time Processing",
      description: "High-performance real-time data processing for supply chain monitoring and alerts.",
      features: ["Sub-second Response", "Real-time Analytics", "Live Dashboards"],
      performance: 98,
      category: "Performance"
    },
    {
      icon: <Globe className="h-8 w-8 text-red-500" />,
      title: "Global Integration",
      description: "Seamless integration with international Halal certification bodies and regulatory systems.",
      features: ["API Integrations", "Global Standards", "Multi-language Support"],
      performance: 92,
      category: "Integration"
    }
  ]

  const techSpecs = [
    { label: "Uptime SLA", value: "99.95%", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Response Time", value: "< 100ms", icon: <Zap className="h-4 w-4" /> },
    { label: "Data Centers", value: "15+ Global", icon: <Globe className="h-4 w-4" /> },
    { label: "Security Compliance", value: "ISO 27001", icon: <Shield className="h-4 w-4" /> }
  ]

  const architectureFeatures = [
    {
      title: "Microservices Architecture",
      description: "Modular design allowing independent scaling and deployment of different components",
      benefits: ["Scalability", "Fault Isolation", "Technology Diversity"]
    },
    {
      title: "Event-Driven Processing",
      description: "Real-time event processing for supply chain monitoring and automated responses",
      benefits: ["Real-time Updates", "Automated Workflows", "Instant Notifications"]
    },
    {
      title: "API-First Design",
      description: "Comprehensive REST and GraphQL APIs for seamless third-party integrations",
      benefits: ["Easy Integration", "Developer Friendly", "Extensible Platform"]
    }
  ]

  return (
    <section id="technology" className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
      <AnimatedBackground variant="waves" color="rgba(99, 102, 241, 0.05)" />

      <div className="container px-6 md:px-8">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <div className="space-y-4">
              <AnimatedText
                text="Enterprise-Grade Technology Stack"
                variant="heading"
                className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl"
                animation="slide"
              />
              <AnimatedText
                text="Built on Oracle Cloud Infrastructure with advanced AI and blockchain technology for unmatched performance, security, and scalability"
                variant="paragraph"
                className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70"
                animation="fade"
                delay={0.3}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Technology Grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {technologies.map((tech, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="h-full glassmorphic-card group blockchain-glow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-muted/50 transition-transform duration-300 group-hover:scale-110">
                          {tech.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg tracking-tight group-hover:text-primary transition-colors">
                            {tech.title}
                          </CardTitle>
                          <div className="text-xs text-muted-foreground opacity-70">{tech.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">{tech.performance}%</div>
                        <div className="text-xs text-muted-foreground">Performance</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                      {tech.description}
                    </CardDescription>

                    <div className="space-y-2">
                      {tech.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-xs text-muted-foreground">
                          <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <ProgressCard
                      title=""
                      progress={tech.performance}
                      total={100}
                      status={tech.performance >= 95 ? "success" : "default"}
                      showPercentage
                      variant="minimal"
                      progressColor={tech.performance >= 95 ? "bg-green-500" : "bg-primary"}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Tech Specs */}
        <ScrollReveal>
          <Card className="glassmorphic-card mb-12">
            <CardHeader>
              <CardTitle className="text-2xl tracking-tight">Platform Specifications</CardTitle>
              <CardDescription>Enterprise-grade performance and reliability metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {techSpecs.map((spec, index) => (
                  <motion.div
                    key={index}
                    className="text-center space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex justify-center text-primary">{spec.icon}</div>
                    <div className="text-lg font-bold">{spec.value}</div>
                    <div className="text-sm text-muted-foreground">{spec.label}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Architecture Features */}
        <ScrollReveal>
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-heading font-bold tracking-tighter mb-4">Architecture Highlights</h3>
              <p className="text-muted-foreground opacity-70">
                Modern, scalable architecture designed for enterprise deployment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {architectureFeatures.map((feature, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="h-full glassmorphic-card">
                      <CardHeader>
                        <CardTitle className="text-lg tracking-tight">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription className="opacity-70">{feature.description}</CardDescription>
                        <div className="space-y-2">
                          {feature.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
