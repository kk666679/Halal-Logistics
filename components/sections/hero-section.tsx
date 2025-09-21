"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Shield, Truck, FileCheck } from "lucide-react"
import { useEffect, useRef } from "react"

import { SpotlightCard } from "@/components/ui/spotlight-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { GradientButton } from "@/components/ui-library/buttons/gradient-button"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Configure video for non-stop playback
      video.muted = true // Required for autoplay
      video.loop = true
      video.playsInline = true

      // Attempt to play the video
      const playVideo = async () => {
        try {
          await video.play()
        } catch (error) {
          console.log("Video autoplay failed:", error)
          // Fallback: try again when user interacts with the page
          const handleUserInteraction = () => {
            video.play()
            document.removeEventListener("click", handleUserInteraction)
            document.removeEventListener("touchstart", handleUserInteraction)
          }
          document.addEventListener("click", handleUserInteraction)
          document.addEventListener("touchstart", handleUserInteraction)
        }
      }

      playVideo()
    }
  }, [])

  return (
    <section id="home" className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
      <AnimatedBackground
        variant="gradient"
        color="rgba(217, 119, 6, 0.08)"
        secondaryColor="rgba(99, 102, 241, 0.08)"
      />

      <div className="container px-6 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <ScrollReveal>
            <motion.div
              className="flex flex-col justify-center space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="space-y-4" variants={itemVariants}>
                <h1 className="text-4xl font-heading font-bold tracking-tighter sm:text-5xl xl:text-7xl/none">
                  <span className="gradient-text">Government-Certified Halal</span>
                  <br />
                  <span className="text-foreground">Supply Chain Platform</span>
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 opacity-70">
                  Ensure complete Halal compliance from farm to table with our blockchain-powered logistics platform, trusted by government agencies worldwide. Our multi-AI agent system enhances verification, predictive logistics, and real-time compliance monitoring.
                </p>
              </motion.div>

              <motion.div className="space-y-4" variants={itemVariants}>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    Blockchain-Verified
                  </span>
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    AI-Enhanced
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    Government-Certified
                  </span>
                </div>
              </motion.div>

              <motion.div className="flex flex-col gap-6 sm:flex-row sm:items-center" variants={itemVariants}>
                <GradientButton
                  glowAmount={5}
                  className="px-6 py-2.5 text-base halal-gradient"
                  gradientFrom="from-amber-600"
                  gradientTo="to-indigo-600"
                  asChild
                >
                  <Link href="#contact" className="flex items-center">
                    Request Government Demo
                    <motion.span
                      className="ml-2 inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, repeatDelay: 2, duration: 1 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </Link>
                </GradientButton>

                <MagneticButton className="neumorphic-button">
                  <Link href="#compliance" className="px-6 py-2.5 block">
                    View Compliance Features
                  </Link>
                </MagneticButton>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4 space-y-4">
                <p className="text-sm text-muted-foreground flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Trusted by 12+ government agencies and 500+ Halal businesses worldwide
                </p>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-indigo-50 dark:from-amber-950/20 dark:to-indigo-950/20 border border-amber-200 dark:border-amber-800"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      Fully Certified by Malaysia International Halal Authority
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Government-accredited halal certification and compliance
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <SpotlightCard className="relative h-[450px] w-full overflow-hidden rounded-xl border glassmorphic-card p-1 blockchain-glow">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-indigo-900/20 z-10"></div>

              {/* Video inside SpotlightCard */}
              <div className="relative z-20 h-full w-full rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "brightness(0.7) contrast(1.1)" }}
                  preload="metadata"
                  muted
                  loop
                  playsInline
                >
                  <source
                    src="/video/government-presentation.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Overlay content on top of video */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-950/40 via-transparent to-indigo-950/40 z-10"></div>
                <div className="relative z-20 h-full w-full p-6 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="col-span-2 h-24 rounded-xl bg-amber-800/20 border border-amber-800/30 flex items-center justify-center glassmorphic-inner-card backdrop-blur-sm"
                      whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(217, 119, 6, 0.3)" }}
                    >
                      <div className="flex items-center space-x-3">
                        <Shield className="h-6 w-6 text-amber-400" />
                        <span className="font-heading text-xl text-white tracking-tight">Halal Certified</span>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="h-32 rounded-xl bg-indigo-800/20 border border-indigo-800/30 flex items-center justify-center glassmorphic-inner-card backdrop-blur-sm"
                      whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)" }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Truck className="h-6 w-6 text-indigo-400" />
                        <span className="font-heading text-white tracking-tight text-center">Supply Chain</span>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                      className="h-32 rounded-xl bg-amber-900/20 border border-amber-900/30 flex items-center justify-center glassmorphic-inner-card backdrop-blur-sm"
                      whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(217, 119, 6, 0.3)" }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <FileCheck className="h-6 w-6 text-amber-400" />
                        <span className="font-heading text-white tracking-tight text-center">Blockchain</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
