"use client";

import { motion } from "framer-motion";
import { FileCheck, BarChart3, AlertCircle, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AnimatedText } from "@/components/ui/animated-text";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function ComplianceSection() {
  const complianceMetrics = [
    {
      title: "Certification Compliance",
      value: 98,
      status: "Excellent",
      color: "text-green-500",
      bgColor: "bg-green-500",
    },
    {
      title: "Supply Chain Integrity",
      value: 95,
      status: "Very Good",
      color: "text-blue-500",
      bgColor: "bg-blue-500",
    },
    {
      title: "Audit Readiness",
      value: 92,
      status: "Good",
      color: "text-amber-500",
      bgColor: "bg-amber-500",
    },
    {
      title: "Documentation Complete",
      value: 100,
      status: "Perfect",
      color: "text-green-500",
      bgColor: "bg-green-500",
    },
  ];

  const auditFeatures = [
    {
      icon: <FileCheck className="h-6 w-6 text-green-500" />,
      title: "Automated Audit Trails",
      description:
        "Complete blockchain-verified audit trails for regulatory compliance",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-indigo-500" />,
      title: "Real-time Dashboards",
      description:
        "Live compliance monitoring with customizable reporting dashboards",
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-amber-500" />,
      title: "Compliance Alerts",
      description:
        "Proactive notifications for certification renewals and compliance issues",
    },
    {
      icon: <Users className="h-6 w-6 text-purple-500" />,
      title: "Multi-stakeholder Access",
      description:
        "Secure access for auditors, regulators, and certification bodies",
    },
  ];

  return (
    <section
      id="compliance"
      className="relative w-full py-12 md:py-24 lg:py-32 bg-muted/30 overflow-hidden"
    >
      <div className="container px-6 md:px-8">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <div className="space-y-4">
              <AnimatedText
                text="Audit & Compliance Dashboard"
                variant="heading"
                className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl gradient-text"
                animation="slide"
              />
              <AnimatedText
                text="Comprehensive compliance monitoring and audit management with blockchain-verified records"
                variant="paragraph"
                className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70"
                animation="fade"
                delay={0.3}
              />
            </div>
          </div>
        </ScrollReveal>

        <div className="mx-auto max-w-6xl">
          {/* Compliance Metrics */}
          <ScrollReveal>
            <Card className="glassmorphic-card mb-12">
              <CardHeader>
                <CardTitle className="text-2xl tracking-tight">
                  Compliance Overview
                </CardTitle>
                <CardDescription>
                  Real-time compliance metrics across your supply chain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {complianceMetrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="text-center space-y-3"
                    >
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm">{metric.title}</h3>
                        <div className={`text-3xl font-bold ${metric.color}`}>
                          {metric.value}%
                        </div>
                        <Badge
                          variant="outline"
                          className={`${metric.color} border-current`}
                        >
                          {metric.status}
                        </Badge>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Audit Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {auditFeatures.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full glassmorphic-card group">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-muted/50 transition-transform duration-300 group-hover:scale-110">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-lg tracking-tight group-hover:text-primary transition-colors">
                          {feature.title}
                        </CardTitle>
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
        </div>
      </div>
    </section>
  );
}
