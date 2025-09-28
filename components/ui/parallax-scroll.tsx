"use client";

import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ParallaxScrollProps {
  baseVelocity?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  children: React.ReactNode;
}

export function ParallaxScroll({
  baseVelocity = 0.1,
  direction = "up",
  className,
  children,
}: ParallaxScrollProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const x = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useAnimationFrame(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const velocity = baseVelocity;

    if (direction === "up") {
      y.set(y.get() - velocity);
      if (y.get() <= -rect.height / 2) {
        y.set(0);
      }
    } else if (direction === "down") {
      y.set(y.get() + velocity);
      if (y.get() >= rect.height / 2) {
        y.set(0);
      }
    } else if (direction === "left") {
      x.set(x.get() - velocity);
      if (x.get() <= -rect.width / 2) {
        x.set(0);
      }
    } else if (direction === "right") {
      x.set(x.get() + velocity);
      if (x.get() >= rect.width / 2) {
        x.set(0);
      }
    }
  });

  if (!mounted) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      <motion.div
        className="flex"
        style={{
          y: direction === "up" || direction === "down" ? y : 0,
          x: direction === "left" || direction === "right" ? x : 0,
          flexDirection:
            direction === "up" || direction === "down" ? "column" : "row",
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
