"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function NeonDemo() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Theme-Aware Neon Effects
          </Badge>
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-center mb-4 rainbow-text"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Neon Effects Showcase
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience our enhanced neon effects with vibrant colors, glowing animations, and theme-aware styling that adapts to light and dark modes.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              Light Mode Optimized
            </Badge>
            <Badge variant="outline" className="text-xs">
              Dark Mode Enhanced
            </Badge>
            <Badge variant="outline" className="text-xs">
              System Theme Compatible
            </Badge>
          </div>
        </div>

        {/* Neon Color Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { name: "Neon Pink", class: "neon-pink", bg: "glow-pink" },
            { name: "Neon Green", class: "neon-green", bg: "glow-green" },
            { name: "Neon Blue", class: "neon-blue", bg: "glow-blue" },
            { name: "Neon Purple", class: "neon-purple", bg: "glow-purple" },
          ].map((color, index) => (
            <motion.div
              key={color.name}
              className={`p-6 rounded-xl ${color.bg} cursor-pointer`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveredCard(color.name)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <h3 className={`text-xl font-bold ${color.class} text-center`}>
                {color.name}
              </h3>
              {hoveredCard === color.name && (
                <motion.p
                  className="text-white text-center mt-2 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Hover Effect Active!
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Animated Gradient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { name: "Animated Gradient 1", class: "animated-gradient" },
            { name: "Animated Gradient 2", class: "animated-gradient-2" },
            { name: "Animated Gradient 3", class: "animated-gradient-3" },
          ].map((gradient, index) => (
            <motion.div
              key={gradient.name}
              className={`h-32 rounded-xl ${gradient.class} flex items-center justify-center`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <span className="text-white font-bold text-lg">
                {gradient.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Pulsing Effects */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { name: "Pulse Glow", class: "pulse-glow" },
            { name: "Fast Pulse", class: "pulse-glow-fast" },
            { name: "Slow Pulse", class: "pulse-glow-slow" },
            { name: "Multi Glow", class: "multi-glow-pulse" },
          ].map((pulse, index) => (
            <motion.div
              key={pulse.name}
              className={`h-24 rounded-xl bg-gray-800 ${pulse.class} flex items-center justify-center border-2 border-pink-500`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-white font-medium text-center">
                {pulse.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Neon Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { text: "Neon Button", class: "neon-button" },
            { text: "Hover Glow", class: "hover-glow bg-blue-600 text-white px-6 py-3 rounded-lg" },
            { text: "Hover Neon", class: "hover-neon text-pink-400 text-xl font-bold" },
          ].map((button, index) => (
            <motion.button
              key={button.text}
              className={button.class}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {button.text}
            </motion.button>
          ))}
        </div>

        {/* Special Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="h-32 rounded-xl glassmorphic-neon flex items-center justify-center"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-white font-bold">Glass Morphism Neon</span>
          </motion.div>

          <motion.div
            className="h-32 rounded-xl shimmer bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white font-bold">Shimmer Effect</span>
          </motion.div>
        </div>

        {/* Floating Animation Demo */}
        <div className="mt-12 flex justify-center">
          <div className="relative">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full float-animation"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-2 left-2 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full float-animation-delayed"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        {/* Theme Comparison Section */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Light Mode
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                <span className="neon-pink text-3xl font-bold">Neon Pink</span>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                <span className="neon-blue text-3xl font-bold">Neon Blue</span>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                <span className="neon-green text-3xl font-bold">Neon Green</span>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 glow-pink">
                <span className="text-white text-xl font-semibold">Glow Background</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Dark Mode
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-800 p-6 rounded-xl border-2 border-gray-700">
                <span className="neon-pink text-3xl font-bold">Neon Pink</span>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border-2 border-gray-700">
                <span className="neon-blue text-3xl font-bold">Neon Blue</span>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border-2 border-gray-700">
                <span className="neon-green text-3xl font-bold">Neon Green</span>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border-2 border-gray-700 glow-pink">
                <span className="text-white text-xl font-semibold">Glow Background</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Toggle your system theme to see the effects adapt automatically!
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge variant="outline" className="text-sm">
              Enhanced glow in dark mode
            </Badge>
            <Badge variant="outline" className="text-sm">
              Optimized colors for readability
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
