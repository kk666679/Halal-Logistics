import { ScrollReveal } from "@/components/scroll-reveal";
import { AnimatedText } from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AIAgentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">
                AI-Powered Innovation
              </Badge>
              <AnimatedText
                text="AI Multi-Agent System for Halal Logistics & Supply Chain"
                variant="heading"
                className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-6"
                animation="slide"
              />
              <AnimatedText
                text="This collection provides a comprehensive set of API endpoints for managing and automating halal logistics and supply chain operations using a multi-agent system. The system integrates halal and ISO compliance, blockchain verification, data analysis, product recommendations, workflow automation, and sales reporting."
                variant="paragraph"
                className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto mb-8"
                animation="fade"
                delay={0.3}
              />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="neumorphic-button-primary" asChild>
                  <Link href="/get-started">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Overview
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Streamline halal-certified supply chain operations with AI agents and blockchain tracking.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <i className="fas fa-certificate text-green-600"></i>
                    Halal & ISO Certification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Automated validation and monitoring of Halal certificates from suppliers in real-time, flagging any expirations or inconsistencies.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <i className="fas fa-link text-blue-600"></i>
                    Blockchain Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Secure, transparent tracking of shipments and supply chain processes using blockchain technology for immutable records.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <i className="fas fa-chart-line text-purple-600"></i>
                    Data Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Advanced analytics and reporting capabilities to optimize supply chain performance and identify improvement opportunities.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <i className="fas fa-lightbulb text-yellow-600"></i>
                    Product Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    AI-powered suggestions for products, suppliers, and logistics optimization based on historical data and market trends.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <i className="fas fa-cogs text-indigo-600"></i>
                    Workflow Automation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Streamlined processes with automated workflows for order processing, compliance checks, and documentation management.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <i className="fas fa-chart-bar text-red-600"></i>
                    Sales Reporting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Comprehensive sales analytics and reporting tools to track performance, revenue, and market trends across the supply chain.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Key Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Our AI Multi-Agent System provides comprehensive solutions for modern halal supply chain management.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start mb-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4">
                    <i className="fas fa-shield-alt text-green-600 dark:text-green-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Compliance Management
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Automated halal compliance monitoring and validation across all supply chain touchpoints.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
                    <i className="fas fa-truck text-blue-600 dark:text-blue-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Logistics Optimization
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      AI-powered route optimization and transportation monitoring to ensure product integrity.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg mr-4">
                    <i className="fas fa-brain text-purple-600 dark:text-purple-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Intelligent Analytics
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Predictive analytics and insights for supply chain optimization and risk management.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start mb-4">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg mr-4">
                    <i className="fas fa-globe text-yellow-600 dark:text-yellow-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Global Standards
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Support for multiple halal certification standards and international compliance requirements.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Supply Chain?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join leading halal logistics companies using our AI Multi-Agent System to streamline operations and ensure compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="neumorphic-button" asChild>
                <Link href="/get-started">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600" asChild>
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
