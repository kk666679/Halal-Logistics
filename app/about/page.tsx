"use client"

import { motion } from "framer-motion"
import { Building2, Users, Globe, Award, Target, Heart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/ui/animated-text"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { GradientButton } from "@/components/ui-library/buttons/gradient-button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Integrity First",
      description: "We maintain the highest standards of integrity in all our operations, ensuring complete transparency and trust."
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Global Excellence",
      description: "We strive for excellence in serving the global Halal community with world-class technology and service."
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Community Focus",
      description: "We are committed to supporting and empowering the Halal business community worldwide."
    },
    {
      icon: <Award className="h-8 w-8 text-amber-500" />,
      title: "Innovation",
      description: "We continuously innovate to provide cutting-edge solutions for modern Halal supply chain challenges."
    }
  ]

  const team = [
    {
      name: "Dr. Ahmad Al-Rashid",
      role: "Founder & CEO",
      description: "20+ years in supply chain management and Halal industry expertise",
      initials: "AR"
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      description: "Former Oracle blockchain architect with deep expertise in enterprise systems",
      initials: "SC"
    },
    {
      name: "Mohammed Al-Farsi",
      role: "Head of Compliance",
      description: "Certified Halal auditor with international regulatory experience",
      initials: "MA"
    },
    {
      name: "Dr. Aisha Rahman",
      role: "AI Research Director",
      description: "PhD in Machine Learning, specializing in supply chain optimization",
      initials: "AR"
    }
  ]

  const milestones = [
    { year: "2020", event: "Company founded with vision to digitize Halal supply chains" },
    { year: "2021", event: "Launched beta platform with first 10 customers" },
    { year: "2022", event: "Secured Oracle Cloud partnership and expanded to 5 countries" },
    { year: "2023", event: "Achieved 500+ active businesses and 99.9% uptime" },
    { year: "2024", event: "Launched AI agent system and blockchain integration" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          <AnimatedBackground variant="waves" color="rgba(217, 119, 6, 0.05)" />

          <div className="container px-6 md:px-8">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="space-y-4">
                  <AnimatedText
                    text="About HalalChain"
                    variant="heading"
                    className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl gradient-text"
                    animation="slide"
                  />
                  <AnimatedText
                    text="Pioneering the future of Halal supply chain management through technology, innovation, and unwavering commitment to Islamic principles"
                    variant="paragraph"
                    className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 opacity-70"
                    animation="fade"
                    delay={0.3}
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-6 md:px-8">
            <ScrollReveal>
              <div className="mx-auto max-w-4xl text-center">
                <Card className="glassmorphic-card">
                  <CardHeader>
                    <CardTitle className="text-2xl tracking-tight">Our Mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground opacity-70 leading-relaxed">
                      To empower the global Halal industry with cutting-edge technology that ensures transparency,
                      efficiency, and compliance while maintaining the sacred trust of Halal certification.
                      We believe that modern technology and Islamic principles can work together to create
                      a more efficient, transparent, and trustworthy Halal supply chain ecosystem.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-6 md:px-8">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
                <div className="space-y-4">
                  <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-4xl">Our Values</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed dark:text-gray-400 opacity-70">
                    The principles that guide everything we do
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
              {values.map((value, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="h-full glassmorphic-card">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-xl bg-muted/50">
                            {value.icon}
                          </div>
                          <CardTitle className="text-lg tracking-tight">{value.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="opacity-70">{value.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-6 md:px-8">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
                <div className="space-y-4">
                  <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-4xl">Leadership Team</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed dark:text-gray-400 opacity-70">
                    Meet the experts behind HalalChain's success
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {team.map((member, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="h-full glassmorphic-card text-center">
                      <CardHeader>
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <span className="text-xl font-bold text-primary">{member.initials}</span>
                        </div>
                        <CardTitle className="text-lg tracking-tight">{member.name}</CardTitle>
                        <CardDescription className="opacity-70">{member.role}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground opacity-70">{member.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-6 md:px-8">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
                <div className="space-y-4">
                  <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-4xl">Our Journey</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed dark:text-gray-400 opacity-70">
                    Key milestones in our mission to transform Halal supply chains
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="mx-auto max-w-4xl">
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <motion.div
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-white font-bold">{milestone.year.slice(-2)}</span>
                        </div>
                        {index < milestones.length - 1 && (
                          <div className="w-0.5 h-16 bg-primary/30 mt-4"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="text-sm font-medium text-primary mb-1">{milestone.year}</div>
                        <p className="text-muted-foreground opacity-70">{milestone.event}</p>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-6 md:px-8">
            <ScrollReveal>
              <div className="text-center">
                <Card className="glassmorphic-card max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl tracking-tight">Join Our Mission</CardTitle>
                    <CardDescription className="text-base">
                      Be part of the digital transformation of the Halal industry
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
                        <a href="/contact">Get In Touch</a>
                      </GradientButton>
                      <GradientButton
                        glowAmount={5}
                        variant="outline"
                        className="px-6 py-2.5"
                        gradientFrom="from-amber-600"
                        gradientTo="to-indigo-600"
                        asChild
                      >
                        <a href="/careers">View Careers</a>
                      </GradientButton>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
