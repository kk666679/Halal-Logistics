"use client"

import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/ui/animated-text"

export function AIAgentSection() {
  return (
    <section id="ai-agent" className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <AnimatedText
              text="Our Multi-AI Agent System"
              variant="heading"
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4"
              animation="slide"
            />
            <AnimatedText
              text="A symphony of specialized AI agents working together to automate and enforce Halal compliance across your entire supply chain."
              variant="paragraph"
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
              animation="fade"
              delay={0.3}
            />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* AI Agent Visualization */}
          <ScrollReveal delay={0.2}>
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="relative h-80 mx-auto" style={{ maxWidth: "400px" }}>
                  {/* Central Orchestrator */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg z-10">
                    <i className="fas fa-brain text-3xl text-white"></i>
                    <div className="absolute text-xs font-bold text-white text-center w-full bottom-2">Orchestrator</div>
                  </div>

                  {/* Orbiting Agent Nodes */}
                  <div className="agent-node animate-orbit-1 absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shadow-md border-2 border-red-300 dark:border-red-600">
                    <i className="fas fa-file-certificate text-red-600 dark:text-red-400"></i>
                    <div className="absolute text-xs font-bold text-gray-800 dark:text-gray-200 text-center w-full -bottom-6">Certification</div>
                  </div>

                  <div className="agent-node animate-orbit-2 absolute top-1/2 right-0 transform -translate-y-1/2 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shadow-md border-2 border-blue-300 dark:border-blue-600">
                    <i className="fas fa-truck text-blue-600 dark:text-blue-400"></i>
                    <div className="absolute text-xs font-bold text-gray-800 dark:text-gray-200 text-center w-full -left-4">Logistics</div>
                  </div>

                  <div className="agent-node animate-orbit-3 absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shadow-md border-2 border-purple-300 dark:border-purple-600">
                    <i className="fas fa-shield-alt text-purple-600 dark:text-purple-400"></i>
                    <div className="absolute text-xs font-bold text-gray-800 dark:text-gray-200 text-center w-full -bottom-6">Compliance</div>
                  </div>

                  <div className="agent-node animate-orbit-4 absolute top-1/2 left-0 transform -translate-y-1/2 w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center shadow-md border-2 border-yellow-300 dark:border-yellow-600">
                    <i className="fas fa-chart-line text-yellow-600 dark:text-yellow-400"></i>
                    <div className="absolute text-xs font-bold text-gray-800 dark:text-gray-200 text-center w-full -right-2">Analytics</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* AI Agent Descriptions */}
          <div className="space-y-6">
            <ScrollReveal delay={0.3}>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mr-4">
                    <i className="fas fa-file-certificate text-red-600 dark:text-red-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Certification Agent</h3>
                    <p className="text-gray-600 dark:text-gray-400">Automatically validates and monitors Halal certificates from suppliers in real-time, flagging any expirations or inconsistencies.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
                    <i className="fas fa-truck text-blue-600 dark:text-blue-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Logistics Agent</h3>
                    <p className="text-gray-600 dark:text-gray-400">Optimizes routes, monitors transportation conditions (temperature, humidity), and ensures no cross-contamination occurs.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg mr-4">
                    <i className="fas fa-shield-alt text-purple-600 dark:text-purple-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Compliance Agent</h3>
                    <p className="text-gray-600 dark:text-gray-400">Continuously audits processes against global Halal standards and generates automated reports for government authorities.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg mr-4">
                    <i className="fas fa-chart-line text-yellow-600 dark:text-yellow-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Analytics Agent</h3>
                    <p className="text-gray-600 dark:text-gray-400">Predicts supply chain risks, optimizes inventory for Halal products, and provides insights for continuous improvement.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
