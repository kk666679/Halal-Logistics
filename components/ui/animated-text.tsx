"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  variant?: "heading" | "paragraph" | "subtitle";
  className?: string;
  animation?: "fade" | "slide" | "typewriter" | "scale";
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function AnimatedText({
  text,
  variant = "paragraph",
  className,
  animation = "fade",
  delay = 0,
  duration = 0.6,
  once = true,
}: AnimatedTextProps) {
  const [ref, inView] = useInView({ triggerOnce: once });

  const getVariants = () => {
    switch (animation) {
      case "slide":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        };
      case "typewriter":
        return {
          hidden: { width: 0 },
          visible: { width: "100%" },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  const baseClass = cn(
    "font-body",
    {
      "text-4xl font-bold": variant === "heading",
      "text-lg font-semibold": variant === "subtitle",
      "text-base": variant === "paragraph",
    },
    className
  );

  return (
    <motion.div
      ref={ref}
      className={baseClass}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={getVariants()}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {animation === "typewriter" ? (
        <motion.div
          className="overflow-hidden whitespace-nowrap"
          variants={getVariants()}
        >
          <span>{text}</span>
        </motion.div>
      ) : (
        text
      )}
    </motion.div>
  );
}
