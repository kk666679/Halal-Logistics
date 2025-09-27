"use client";

import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonProps {
  gradientFrom?: string;
  gradientTo?: string;
  glowAmount?: number;
}

export function GradientButton({
  children,
  className,
  gradientFrom = "from-blue-500",
  gradientTo = "to-purple-500",
  glowAmount = 0,
  ...props
}: GradientButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Button
        className={cn(
          `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white border-0 relative overflow-hidden`,
          glowAmount > 0 && `shadow-lg shadow-current/25`,
          className
        )}
        style={{
          boxShadow: glowAmount > 0 ? `0 0 ${glowAmount * 4}px currentColor` : undefined,
        }}
        {...props}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Button>
    </motion.div>
  );
}
