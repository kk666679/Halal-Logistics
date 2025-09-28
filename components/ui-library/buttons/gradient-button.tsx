"use client";

import { motion } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonProps {
  gradientFrom?: string;
  gradientTo?: string;
  gradientHoverFrom?: string;
  gradientHoverTo?: string;
  glowAmount?: number;
  borderWidth?: number;
}

export function GradientButton({
  children,
  className,
  gradientFrom = "from-blue-500",
  gradientTo = "to-purple-500",
  gradientHoverFrom,
  gradientHoverTo,
  glowAmount = 0,
  borderWidth,
  ...props
}: GradientButtonProps) {
  const Comp = props.asChild ? Slot : "button";

  const buttonClass = cn(
    borderWidth
      ? `border border-${borderWidth} border-white/30 bg-transparent text-white relative overflow-hidden hover:bg-gradient-to-r hover:${gradientFrom} hover:${gradientTo}`
      : `bg-gradient-to-r ${gradientFrom} ${gradientTo} ${gradientHoverFrom && gradientHoverTo ? `hover:${gradientHoverFrom} hover:${gradientHoverTo}` : ''} text-white border-0 relative overflow-hidden`,
    glowAmount > 0 && `shadow-lg shadow-current/25`,
    className
  );

  const buttonStyle = {
    boxShadow: glowAmount > 0 ? `0 0 ${glowAmount * 4}px currentColor` : undefined,
  };

  if (props.asChild) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative inline-block"
      >
        <Comp
          className={buttonClass}
          style={buttonStyle}
          {...props}
        >
          {children}
        </Comp>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative inline-block"
    >
      <Comp
        className={buttonClass}
        style={buttonStyle}
        {...props}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-md"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Comp>
    </motion.div>
  );
}
