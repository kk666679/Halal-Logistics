"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedBackgroundProps {
  variant?: "waves" | "particles" | "gradient" | "grid" | "dots";
  color?: string;
  className?: string;
  children?: React.ReactNode;
}

export function AnimatedBackground({
  variant = "waves",
  color = "rgba(99, 102, 241, 0.05)",
  className = "",
  children,
}: AnimatedBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  const renderBackground = () => {
    switch (variant) {
      case "waves":
        return (
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 20% 50%, ${color} 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, ${color} 0%, transparent 50%),
                            radial-gradient(circle at 40% 80%, ${color} 0%, transparent 50%)`,
              }}
              animate={{
                background: [
                  `radial-gradient(circle at 20% 50%, ${color} 0%, transparent 50%),
                   radial-gradient(circle at 80% 20%, ${color} 0%, transparent 50%),
                   radial-gradient(circle at 40% 80%, ${color} 0%, transparent 50%)`,
                  `radial-gradient(circle at 30% 60%, ${color} 0%, transparent 50%),
                   radial-gradient(circle at 70% 30%, ${color} 0%, transparent 50%),
                   radial-gradient(circle at 50% 90%, ${color} 0%, transparent 50%)`,
                  `radial-gradient(circle at 20% 50%, ${color} 0%, transparent 50%),
                   radial-gradient(circle at 80% 20%, ${color} 0%, transparent 50%),
                   radial-gradient(circle at 40% 80%, ${color} 0%, transparent 50%)`,
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        );
      case "particles":
        return (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: color.replace("0.05", "0.3"),
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        );
      case "gradient":
        return (
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(45deg, ${color}, transparent, ${color})`,
            }}
            animate={{
              background: [
                `linear-gradient(45deg, ${color}, transparent, ${color})`,
                `linear-gradient(135deg, ${color}, transparent, ${color})`,
                `linear-gradient(225deg, ${color}, transparent, ${color})`,
                `linear-gradient(315deg, ${color}, transparent, ${color})`,
                `linear-gradient(45deg, ${color}, transparent, ${color})`,
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      case "grid":
        return (
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(${color} 1px, transparent 1px),
                                linear-gradient(90deg, ${color} 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
              animate={{
                backgroundPosition: ["0px 0px", "50px 50px"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        );
      case "dots":
        return (
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
              animate={{
                backgroundPosition: ["0px 0px", "20px 20px"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {renderBackground()}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
