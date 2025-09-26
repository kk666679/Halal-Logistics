"use client";

import { useRef, useEffect, type ReactNode } from "react";
import {
  motion,
  useAnimation,
  useScroll,
  useTransform,
  type Variants,
  type Easing,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

type AnimationDirection = "up" | "down" | "left" | "right" | "none";
type AnimationType = "fade" | "slide" | "scale" | "rotate" | "flip" | "none";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  type?: AnimationType;
  direction?: AnimationDirection;
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
  distance?: number;
  staggerChildren?: boolean;
  staggerDelay?: number;
  ease?: Easing | Easing[];
}

export function ScrollAnimation({
  children,
  className,
  type = "fade",
  direction = "up",
  duration = 0.5,
  delay = 0,
  threshold = 0.1,
  once = true,
  distance = 50,
  staggerChildren = false,
  staggerDelay = 0.1,
  ease = "easeOut",
}: ScrollAnimationProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: once, threshold });

  // Define animation variants
  const getVariants = (): Variants => {
    const hidden: Record<string, number | string> = {};
    const visible: Record<string, number | string> = {};

    // Handle fade animation
    if (type === "fade" || type === "slide") {
      hidden.opacity = 0;
      visible.opacity = 1;
    }

    // Handle slide animation
    if (type === "slide") {
      switch (direction) {
        case "up":
          hidden.y = distance;
          visible.y = 0;
          break;
        case "down":
          hidden.y = -distance;
          visible.y = 0;
          break;
        case "left":
          hidden.x = distance;
          visible.x = 0;
          break;
        case "right":
          hidden.x = -distance;
          visible.x = 0;
          break;
      }
    }

    // Handle scale animation
    if (type === "scale") {
      hidden.scale = 0.8;
      visible.scale = 1;
    }

    // Handle rotate animation
    if (type === "rotate") {
      hidden.rotate = direction === "left" ? -90 : 90;
      visible.rotate = 0;
    }

    // Handle flip animation
    if (type === "flip") {
      if (direction === "up" || direction === "down") {
        hidden.rotateX = direction === "down" ? 90 : -90;
        visible.rotateX = 0;
      } else {
        hidden.rotateY = direction === "right" ? 90 : -90;
        visible.rotateY = 0;
      }
    }

    return { hidden, visible };
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [controls, inView, once]);

  const variants = getVariants();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{
        duration,
        delay,
        ease,
        staggerChildren: staggerChildren ? staggerDelay : 0,
      }}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
}

export function Parallax({
  children,
  className,
  speed = 0.5,
  direction = "vertical",
  reverse = false,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const factor = reverse ? -1 : 1;
  const yRange = useTransform(
    scrollYProgress,
    [0, 1],
    [0, speed * 100 * factor],
  );
  const xRange = useTransform(
    scrollYProgress,
    [0, 1],
    [0, speed * 100 * factor],
  );

  return (
    <motion.div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        style={direction === "vertical" ? { y: yRange } : { x: xRange }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
  threshold?: number;
}

export function StaggerContainer({
  children,
  className,
  delay = 0,
  staggerDelay = 0.1,
  once = true,
  threshold = 0.1,
}: StaggerContainerProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: once, threshold });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [controls, inView, once]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut",
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
