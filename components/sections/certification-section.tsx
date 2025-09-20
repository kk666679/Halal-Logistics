"use client"

import { motion } from "framer-motion"
import { Shield, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/ui/animated-text"
import { Badge } from "@/components/ui/badge"

export function CertificationSection() {
  const certificationSteps = [
    {
      icon: <Shield className="h-8 w-8 text-amber-600" />,
      title: "Submit Application",
      description: "Upload product details and documentation for Halal certification review",
      status: "completed",
      blockchain: true,
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Blockchain Verification",
      description: "Smart contracts automatically verify compliance against Halal standards",
      status: "completed",
      blockchain: true,
    },
    {
      icon: <Clock className="h-8 w-8 text-indigo-500" />,
      title: "Certifier Review",
      description: "Authorized Halal certifiers review and approve applications",
      status: "in-progress",
      blockchain: false,
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-orange-500" />,
      title: "Immutable Record",
      description: "Approved certifications are permanently recorded on the blockchain",
      status: "pending",
      blockchain: true,
    },
  ]

  return (
    <section id="certification" className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
      <div className="container px-6 md:px-8">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <div className="space-y-4">
              <AnimatedText
                text="Halal Certification Workflow"
                variant="heading"
                className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl"
                animation="slide"
              />
              <AnimatedText
                text="Streamlined certification process with blockchain verification and smart contract automation"
                variant="paragraph"
                className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70"
                animation="fade"
                delay={0.3}
              />
            </div>
          </div>
        </ScrollReveal>

        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificationSteps.map((step, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="h-full glassmorphic-card group blockchain-glow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-xl bg-muted/50 transition-transform duration-300 group-hover:scale-110">
                            {step.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg tracking-tight group-hover:text-primary transition-colors">
                              {step.title}
                            </CardTitle>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge
                            variant={
                              step.status === "completed"
                                ? "default"
                                : step.status === "in-progress"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {step.status.replace("-", " ")}
                          </Badge>
                          {step.blockchain && (
                            <Badge variant="outline" className="text-xs border-amber-600 text-amber-600">
                              Blockchain
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base opacity-70 group-hover:opacity-100 transition-opacity">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
