"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedTextProps {
  text: string;
  variant?: "heading" | "paragraph";
  className?: string;
  animation?: "fade" | "slide" | "typewriter";
  delay?: number;
}

export function AnimatedText({
  text,
  variant = "paragraph",
  className = "",
  animation = "fade",
  delay = 0,
}: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (animation === "typewriter") {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    } else {
      setDisplayText(text);
    }
  }, [text, animation]);

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    typewriter: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
  };

  const MotionComponent = variant === "heading" ? motion.h1 : motion.p;

  return (
    <MotionComponent
      className={className}
      initial={variants[animation].initial}
      animate={variants[animation].animate}
      transition={{ duration: 0.6, delay }}
    >
      {displayText}
    </MotionComponent>
  );
}
