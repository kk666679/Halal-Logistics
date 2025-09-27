"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedGradientBorderProps {
  colors: string[];
  borderWidth?: number;
  duration?: number;
  children: ReactNode;
}

export function AnimatedGradientBorder({
  colors,
  borderWidth = 1,
  duration = 4,
  children,
}: AnimatedGradientBorderProps) {
  return (
    <motion.div
      className="relative rounded"
      style={{
        padding: `${borderWidth}px`,
        background: `linear-gradient(45deg, ${colors.join(", ")})`,
        backgroundSize: "400% 400%",
      }}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  );
}
