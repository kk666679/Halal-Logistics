"use client";

import React, { forwardRef } from "react";
import type { JSX } from "react";
import { motion, type HTMLMotionProps, type Variants, type Transition } from "framer-motion";

// Reusable motion components with consistent animation patterns
export interface MotionComponentProps extends HTMLMotionProps<"div"> {
  variant?: keyof typeof motionVariants;
  delay?: number;
  duration?: number;
  className?: string;
}

// Predefined animation variants for consistent usage
export const motionVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  slideInFromBottom: {
    initial: { opacity: 0, y: "100%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "100%" },
  },
} as const;

// Transition presets
export const motionTransitions = {
  smooth: { duration: 0.6, ease: [0.25, 0.25, 0.25, 1] },
  quick: { duration: 0.3, ease: [0.25, 0.25, 0.25, 1] },
  bounce: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] },
  elastic: { duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] },
  spring: { type: "spring" as const, damping: 25, stiffness: 120 },
  gentle: { type: "spring" as const, damping: 20, stiffness: 100 },
} as const;

// Base motion component factory
function createMotionComponent<T extends keyof JSX.IntrinsicElements>(
  element: T,
  defaultVariants: Variants = motionVariants.fadeInUp,
  defaultTransition: Transition = motionTransitions.smooth
) {
  const MotionComponent = forwardRef<HTMLElement, MotionComponentProps>(
    ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
      const selectedVariants = motionVariants[variant] || defaultVariants;
      const transition = duration
        ? { ...defaultTransition, duration }
        : { ...defaultTransition, delay };

      const Component = motion[element as keyof typeof motion];

      return (
        <Component
          ref={ref}
          className={className}
          variants={selectedVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          {...props}
        />
      );
    }
  );

  MotionComponent.displayName = `Motion${String(element).charAt(0).toUpperCase() + String(element).slice(1)}`;
  return MotionComponent;
}

// Motion components with semantic HTML elements
export const MotionDiv = createMotionComponent("div");
export const MotionSection = createMotionComponent("section");
export const MotionArticle = createMotionComponent("article");
export const MotionAside = createMotionComponent("aside");
export const MotionHeader = createMotionComponent("header");
export const MotionFooter = createMotionComponent("footer");
export const MotionNav = createMotionComponent("nav");
export const MotionMain = createMotionComponent("main");
export const MotionH1 = createMotionComponent("h1");
export const MotionH2 = createMotionComponent("h2");
export const MotionH3 = createMotionComponent("h3");
export const MotionH4 = createMotionComponent("h4");
export const MotionH5 = createMotionComponent("h5");
export const MotionH6 = createMotionComponent("h6");
export const MotionP = createMotionComponent("p");
export const MotionSpan = createMotionComponent("span");
export const MotionButton = createMotionComponent("button", motionVariants.scaleIn, motionTransitions.quick);
export const MotionA = createMotionComponent("a");
export const MotionImg = createMotionComponent("img");
export const MotionUl = createMotionComponent("ul");
export const MotionOl = createMotionComponent("ol");
export const MotionLi = createMotionComponent("li");

// Specialized motion components for common UI patterns
export const MotionCard = forwardRef<HTMLDivElement, MotionComponentProps>(
  ({ variant = "fadeInUp", delay = 0, className, ...props }, ref) => (
    <MotionDiv
      ref={ref}
      variant={variant}
      delay={delay}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={className}
      {...props}
    />
  )
);
MotionCard.displayName = "MotionCard";

export const MotionModal = forwardRef<HTMLDivElement, MotionComponentProps>(
  ({ className, ...props }, ref) => (
    <MotionDiv
      ref={ref}
      variants={{
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 },
      }}
      transition={motionTransitions.spring}
      className={className}
      {...props}
    />
  )
);
MotionModal.displayName = "MotionModal";

export const MotionDrawer = forwardRef<HTMLDivElement, MotionComponentProps>(
  ({ className, ...props }, ref) => (
    <MotionDiv
      ref={ref}
      variants={{
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
      }}
      transition={motionTransitions.spring}
      className={className}
      {...props}
    />
  )
);
MotionDrawer.displayName = "MotionDrawer";

// Stagger container for list animations
export const MotionStaggerContainer = forwardRef<HTMLDivElement, MotionComponentProps>(
  ({ className, children, ...props }, ref) => (
    <MotionDiv
      ref={ref}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
          },
        },
      }}
      initial="initial"
      animate="animate"
      className={className}
      {...props}
    >
      {children}
    </MotionDiv>
  )
);
MotionStaggerContainer.displayName = "MotionStaggerContainer";

export const MotionStaggerItem = forwardRef<HTMLDivElement, MotionComponentProps>(
  ({ variant = "fadeInUp", className, ...props }, ref) => (
    <MotionDiv
      ref={ref}
      variants={motionVariants[variant]}
      className={className}
      {...props}
    />
  )
);
MotionStaggerItem.displayName = "MotionStaggerItem";

// Page transition wrapper
export const MotionPage = forwardRef<HTMLDivElement, MotionComponentProps>(
  ({ className, children, ...props }, ref) => (
    <MotionDiv
      ref={ref}
      variants={{
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
      }}
      transition={motionTransitions.smooth}
      className={className}
      {...props}
    >
      {children}
    </MotionDiv>
  )
);
MotionPage.displayName = "MotionPage";

// Loading spinner component
export const MotionSpinner = forwardRef<HTMLDivElement, MotionComponentProps>(
  ({ className, ...props }, ref) => (
    <MotionDiv
      ref={ref}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={className}
      {...props}
    />
  )
);
MotionSpinner.displayName = "MotionSpinner";

// Pulse animation component
export const MotionPulse = forwardRef<HTMLDivElement, MotionComponentProps>(
  ({ className, ...props }, ref) => (
    <MotionDiv
      ref={ref}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={className}
      {...props}
    />
  )
);
MotionPulse.displayName = "MotionPulse";

// Export types for external use
export type MotionVariants = typeof motionVariants;
export type MotionTransitions = typeof motionTransitions;
