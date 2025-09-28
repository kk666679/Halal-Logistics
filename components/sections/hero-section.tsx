"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { MagneticButton } from "@/components/ui/magnetic-button";
import { GradientButton } from "@/components/ui-library/buttons/gradient-button";

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
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Configure video for non-stop playback
      video.muted = true; // Required for autoplay
      video.loop = true;
      video.playsInline = true;

      // Attempt to play the video
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log("Video autoplay failed:", error);
          // Fallback: try again when user interacts with the page
          const handleUserInteraction = () => {
            video.play();
            document.removeEventListener("click", handleUserInteraction);
            document.removeEventListener("touchstart", handleUserInteraction);
          };
          document.addEventListener("click", handleUserInteraction);
          document.addEventListener("touchstart", handleUserInteraction);
        }
      };

      playVideo();
    }
  }, []);

  return (
    <section
      id="home"
      className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden"
    >
      {/* Full-width video background */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.7) contrast(1.1)" }}
            poster="/placeholder.jpg"
            preload="metadata"
            muted
            loop
            playsInline
            autoPlay
            aria-hidden="true"
            onError={() => setVideoError(true)}
          >
            <source
              src="https://tdqwbwhr1jotkcsm.public.blob.vercel-storage.com/1758417682088.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              backgroundImage: `url(/placeholder.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: "brightness(0.7) contrast(1.1)"
            }}
            aria-hidden="true"
          />
        )}
        {/* Video overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br via-transparent"
          style={{
            background: `linear-gradient(to bottom right, hsl(var(--framer-blue-900) / 0.4), transparent, hsl(var(--framer-purple-900) / 0.4))`
          }}
        ></div>
      </div>

      <div className="container px-6 md:px-8 relative z-10">
        <motion.div
          className="flex flex-col justify-center space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-4" variants={itemVariants} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <h1 className="text-4xl font-heading font-bold tracking-tighter sm:text-5xl xl:text-7xl/none">
              <span className="gradient-text">
                Business to Business - Business to Government
              </span>
              <br />
              <span className="text-foreground">Certified Halal - Supply Chain Platform</span>
            </h1>
            <p
              className="max-w-[600px] md:text-xl opacity-70 text-framer-gray-500"
            >
              Ensure complete Halal compliance from farm to table with our
              blockchain-powered logistics platform, trusted by government
              agencies worldwide. Our multi-AI agent system enhances
              verification, predictive logistics, and real-time compliance
              monitoring.
            </p>
          </motion.div>

          <motion.div className="space-y-4" variants={itemVariants} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex flex-wrap gap-2">
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-framer-warning/10 text-framer-warning"
              >
                Blockchain-Verified
              </span>
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-framer-purple-50 text-framer-purple-800"
              >
                AI-Enhanced
              </span>
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-framer-success/10 text-framer-success"
              >
                Government-Certified
              </span>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-6 sm:flex-row sm:items-center"
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <GradientButton
              glowAmount={5}
              className="px-6 py-2.5 text-base halal-gradient"
              gradientFrom="from-framer-blue-500"
              gradientTo="to-framer-purple-500"
              asChild
            >
              <Link href="#contact" className="flex items-center">
                Request Government Demo
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 2,
                    duration: 1,
                  }}
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

          <motion.div variants={itemVariants} className="pt-4 space-y-4" transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <p
              className="text-sm flex items-center text-framer-gray-400"
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-2 bg-framer-success"
              ></span>
              Trusted by 12+ government agencies and 500+ Halal businesses
              worldwide
            </p>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 p-4 rounded-lg border bg-gradient-to-r from-framer-blue-50 to-framer-purple-50 border-framer-blue-200"
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-framer-blue-500"
                >
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p
                  className="text-sm font-medium text-framer-gray-900"
                >
                  Fully Certified by Malaysia International Halal Authority
                </p>
                <p
                  className="text-xs text-framer-gray-700"
                >
                  Government-accredited halal certification and compliance
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
