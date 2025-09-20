"use client"

import { motion } from "framer-motion"
import { Link2, Shield, Database, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/ui/animated-text"
import { AnimatedBackground } from "@/components/ui/animated-background"

export function BlockchainSection() {
  const blockchainFeatures = [
    {
      icon: <Link2 className="h-8 w-8 text-indigo-500" />,
      title: "Immutable Records",
      description:
        "All certification and tracking data is permanently stored on the blockchain, ensuring tamper-proof records.",
      highlight: "99.9% Uptime",
    },
    {
      icon: <Shield className="h-8 w-8 text-amber-600" />,
      title: "Smart Contracts",
      description:
        "Automated compliance verification and certification renewals through Oracle Blockchain smart contracts.",
      highlight: "Zero Manual Errors",
    },
    {
      icon: <Database className="h-8 w-8 text-green-500" />,
      title: "Decentralized Storage",
      description: "Distributed ledger technology ensures data availability and prevents single points of failure.",
      highlight: "Enterprise Grade",
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      title: "Real-time Verification",
      description: "Instant verification of Halal status and supply chain integrity through blockchain queries.",
      highlight: "Sub-second Response",
    },
  ]

  return (
    <section id="blockchain" className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
      <AnimatedBackground variant="waves" color="rgba(99, 102, 241, 0.05)" />

      <div className="container px-6 md:px-8">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <div className="space-y-4">
              <AnimatedText
                text="Blockchain-Powered Transparency"
                variant="heading"
                className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl"
                animation="slide"
              />
              <AnimatedText
                text="Leverage Oracle Blockchain Platform for unparalleled security, transparency, and trust in your Halal supply chain"
                variant="paragraph"
                className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70"
                animation="fade"
                delay={0.3}
              />
            </div>
          </div>
        </ScrollReveal>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blockchainFeatures.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="h-full glassmorphic-card group blockchain-glow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 rounded-xl bg-muted/50 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                            {feature.icon}
                          </div>
                          <div>
                            <CardTitle className="text-xl tracking-tight group-hover:text-primary transition-colors">
                              {feature.title}
                            </CardTitle>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                          {feature.highlight}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base opacity-70 group-hover:opacity-100 transition-opacity">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.4}>
            <div className="mt-12 text-center">
              <Card className="glassmorphic-card max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl tracking-tight">Oracle Cloud Infrastructure</CardTitle>
                  <CardDescription className="text-base">
                    Built on enterprise-grade Oracle Cloud Infrastructure for maximum scalability and security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">99.95%</div>
                      <div className="text-sm text-muted-foreground">SLA Uptime</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">256-bit</div>
                      <div className="text-sm text-muted-foreground">Encryption</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">24/7</div>
                      <div className="text-sm text-muted-foreground">Monitoring</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
