"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { useState, useEffect } from "react";

export default function TestPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Theme Provider Test</h1>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Theme Provider Test</h1>
          <ModeToggle />
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg border bg-card"
          >
            <h2 className="text-xl font-semibold mb-4">Current Theme: {theme}</h2>
            <p className="text-muted-foreground">
              This page tests the new Framer Motion theme provider implementation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg border bg-card"
          >
            <h3 className="text-lg font-semibold mb-2">Features Working:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Framer Motion animations
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Dark/Light theme toggle
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                System theme detection
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                LocalStorage persistence
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-lg border bg-card"
          >
            <h3 className="text-lg font-semibold mb-2">Test the Theme Toggle:</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click the theme toggle button in the top-right corner to switch between light and dark modes.
              The page should smoothly animate between themes.
            </p>
            <div className="flex gap-4">
              <div className="p-4 rounded border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Light Theme Card
                </p>
              </div>
              <div className="p-4 rounded border bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800">
                <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                  Dark Theme Card
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
