"use client";

import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  Users,
  Globe,
  ArrowRight,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AnimatedText } from "@/components/ui/animated-text";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Badge } from "@/components/ui/badge";
import { GradientButton } from "@/components/ui-library/buttons/gradient-button";

export function CaseStudiesSection() {
  const caseStudies = [
    {
      company: "Al-Barakah Foods",
      industry: "Food Processing",
      location: "Malaysia",
      challenge:
        "Manual certification tracking leading to compliance delays and export rejections",
      solution:
        "Implemented blockchain-based certification tracking with AI-powered validation",
      results: [
        "60% reduction in certification processing time",
        "100% compliance with JAKIM standards",
        "30% increase in export volume",
      ],
      metrics: {
        roi: "340%",
        timeframe: "6 months",
        users: "500+ employees",
      },
      logo: "ABF",
      rating: 5,
    },
    {
      company: "Green Crescent Logistics",
      industry: "Cold Chain Logistics",
      location: "UAE",
      challenge:
        "Temperature excursions during transportation causing product spoilage",
      solution:
        "Deployed IoT sensors with real-time monitoring and AI route optimization",
      results: [
        "95% reduction in temperature excursions",
        "40% improvement in delivery times",
        "25% reduction in operational costs",
      ],
      metrics: {
        roi: "280%",
        timeframe: "4 months",
        users: "200+ vehicles",
      },
      logo: "GCL",
      rating: 5,
    },
    {
      company: "Heritage Halal Meats",
      industry: "Meat Processing",
      location: "Australia",
      challenge:
        "Complex supply chain traceability requirements for international markets",
      solution:
        "Integrated multi-stakeholder platform with end-to-end supply chain visibility",
      results: [
        "100% traceability compliance",
        "50% faster audit completion",
        "20% increase in market share",
      ],
      metrics: {
        roi: "420%",
        timeframe: "8 months",
        users: "1000+ suppliers",
      },
      logo: "HHM",
      rating: 5,
    },
  ];

  const stats = [
    {
      value: "500+",
      label: "Businesses Served",
      icon: <Building2 className="h-5 w-5" />,
    },
    { value: "15+", label: "Countries", icon: <Globe className="h-5 w-5" /> },
    {
      value: "99.9%",
      label: "Uptime",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      value: "50K+",
      label: "Certifications Processed",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const testimonials = [
    {
      quote:
        "The platform transformed our certification process. What used to take weeks now takes hours.",
      author: "Ahmad Rahman",
      position: "Operations Director",
      company: "Al-Barakah Foods",
    },
    {
      quote:
        "Real-time monitoring has eliminated our temperature excursion issues completely.",
      author: "Sarah Al-Mansoori",
      position: "Logistics Manager",
      company: "Green Crescent Logistics",
    },
  ];

  return (
    <section
      id="case-studies"
      className="relative w-full py-12 md:py-24 lg:py-32 bg-muted/30 overflow-hidden"
    >
      <AnimatedBackground variant="dots" color="rgba(34, 197, 94, 0.05)" />

      <div className="container px-6 md:px-8">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <div className="space-y-4">
              <AnimatedText
                text="Success Stories & Case Studies"
                variant="heading"
                className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl gradient-text"
                animation="slide"
              />
              <AnimatedText
                text="See how leading Halal businesses worldwide have transformed their operations with our blockchain-powered platform"
                variant="paragraph"
                className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70"
                animation="fade"
                delay={0.3}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Stats Overview */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-center text-primary">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Case Studies Grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-1 mb-16">
          {caseStudies.map((study, index) => (
            <ScrollReveal key={index} delay={index * 0.2}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="glassmorphic-card border-glow-green overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {study.logo}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-xl tracking-tight">
                            {study.company}
                          </CardTitle>
                          <CardDescription className="opacity-70">
                            {study.industry} • {study.location}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(study.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        CHALLENGE
                      </h4>
                      <p className="text-sm opacity-70">{study.challenge}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        SOLUTION
                      </h4>
                      <p className="text-sm opacity-70">{study.solution}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-3">
                        RESULTS
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {study.results.map((result, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm opacity-70">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-muted/40">
                      <Badge
                        variant="outline"
                        className="border-green-500 text-green-400"
                      >
                        ROI: {study.metrics.roi}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-blue-500 text-blue-400"
                      >
                        {study.metrics.timeframe} Implementation
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-purple-500 text-purple-400"
                      >
                        {study.metrics.users}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Testimonials */}
        <ScrollReveal>
          <div className="mx-auto max-w-4xl mb-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-heading font-bold tracking-tighter mb-4">
                What Our Clients Say
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full glassmorphic-card">
                      <CardContent className="p-6">
                        <div className="mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400 inline"
                            />
                          ))}
                        </div>
                        <blockquote className="text-sm opacity-70 mb-4">
                          &ldquo;{testimonial.quote}&rdquo;
                        </blockquote>
                        <div>
                          <div className="font-medium text-sm">
                            {testimonial.author}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {testimonial.position}, {testimonial.company}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA Section */}
        <ScrollReveal>
          <div className="text-center">
            <Card className="glassmorphic-card max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl tracking-tight">
                  Ready to Join These Success Stories?
                </CardTitle>
                <CardDescription className="text-base">
                  Start your digital transformation journey with our proven
                  platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <GradientButton
                    glowAmount={5}
                    className="px-6 py-2.5"
                    gradientFrom="from-green-600"
                    gradientTo="to-blue-600"
                    asChild
                  >
                    <a href="#contact">Start Your Success Story</a>
                  </GradientButton>
                  <GradientButton
                    glowAmount={5}
                    variant="outline"
                    className="px-6 py-2.5"
                    gradientFrom="from-green-600"
                    gradientTo="to-blue-600"
                    asChild
                  >
                    <a href="#demo">
                      View More Case Studies
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </GradientButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
