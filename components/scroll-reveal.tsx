"use client";

import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  variant?: "fade" | "slide" | "scale";
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  once = true,
  variant = "slide",
  direction = "up",
  distance = 50,
}: ScrollRevealProps) {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: once,
  });

  const getVariants = (): Variants => {
    const hidden: Record<string, number | string> = { opacity: 0 };
    const visible: Record<string, number | string> = { opacity: 1 };

    if (variant === "slide") {
      if (direction === "up") {
        hidden.y = distance;
        visible.y = 0;
      } else if (direction === "down") {
        hidden.y = -distance;
        visible.y = 0;
      } else if (direction === "left") {
        hidden.x = distance;
        visible.x = 0;
      } else if (direction === "right") {
        hidden.x = -distance;
        visible.x = 0;
      }
    } else if (variant === "scale") {
      hidden.scale = 0.8;
      visible.scale = 1;
    }

    return { hidden, visible };
  };

  const variants = getVariants();

  return (
    <motion.div
      ref={ref}
      className={cn("w-full", className)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
