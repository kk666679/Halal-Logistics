"use client";

import React, { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export interface BaseMotionProps {
  variant?: "fadeInUp" | "fadeInDown" | "fadeInLeft" | "fadeInRight" | "scaleIn" | "slideInFromBottom";
  delay?: number;
  duration?: number;
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

// Helper function to get variants
const getVariants = (variant: BaseMotionProps["variant"]) => {
  return variant ? motionVariants[variant] : motionVariants.fadeInUp;
};

// Helper function to get transition
const getTransition = (duration?: number, delay?: number, isQuick = false) => {
  const baseTransition = isQuick ? motionTransitions.quick : motionTransitions.smooth;
  return duration ? { ...baseTransition, duration } : { ...baseTransition, delay };
};

// Motion components with semantic HTML elements
export const MotionDiv = forwardRef<HTMLDivElement, BaseMotionProps & HTMLMotionProps<"div">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.div
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
MotionDiv.displayName = "MotionDiv";

export const MotionSection = forwardRef<HTMLElement, BaseMotionProps & HTMLMotionProps<"section">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.section
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
MotionSection.displayName = "MotionSection";

export const MotionArticle = forwardRef<HTMLElement, BaseMotionProps & HTMLMotionProps<"article">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.article
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
MotionArticle.displayName = "MotionArticle";

export const MotionAside = forwardRef<HTMLElement, BaseMotionProps & HTMLMotionProps<"aside">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.aside
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
MotionAside.displayName = "MotionAside";

export const MotionHeader = forwardRef<HTMLElement, BaseMotionProps & HTMLMotionProps<"header">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.header
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
MotionHeader.displayName = "MotionHeader";

export const MotionFooter = forwardRef<HTMLElement, BaseMotionProps & HTMLMotionProps<"footer">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.footer
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
MotionFooter.displayName = "MotionFooter";

export const MotionNav = forwardRef<HTMLElement, BaseMotionProps & HTMLMotionProps<"nav">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.nav
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
MotionNav.displayName = "MotionNav";

export const MotionMain = forwardRef<HTMLElement, BaseMotionProps & HTMLMotionProps<"main">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.main
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
MotionMain.displayName = "MotionMain";

export const MotionH1 = forwardRef<HTMLHeadingElement, BaseMotionProps & HTMLMotionProps<"h1">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.h1
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
MotionH1.displayName = "MotionH1";

export const MotionH2 = forwardRef<HTMLHeadingElement, BaseMotionProps & HTMLMotionProps<"h2">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.h2
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
MotionH2.displayName = "MotionH2";

export const MotionH3 = forwardRef<HTMLHeadingElement, BaseMotionProps & HTMLMotionProps<"h3">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.h3
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
MotionH3.displayName = "MotionH3";

export const MotionH4 = forwardRef<HTMLHeadingElement, BaseMotionProps & HTMLMotionProps<"h4">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.h4
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
MotionH4.displayName = "MotionH4";

export const MotionH5 = forwardRef<HTMLHeadingElement, BaseMotionProps & HTMLMotionProps<"h5">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.h5
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
MotionH5.displayName = "MotionH5";

export const MotionH6 = forwardRef<HTMLHeadingElement, BaseMotionProps & HTMLMotionProps<"h6">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.h6
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
MotionH6.displayName = "MotionH6";

export const MotionP = forwardRef<HTMLParagraphElement, BaseMotionProps & HTMLMotionProps<"p">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.p
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
MotionP.displayName = "MotionP";

export const MotionSpan = forwardRef<HTMLSpanElement, BaseMotionProps & HTMLMotionProps<"span">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.span
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
MotionSpan.displayName = "MotionSpan";

export const MotionButton = forwardRef<HTMLButtonElement, BaseMotionProps & HTMLMotionProps<"button">>(
  ({ variant = "scaleIn", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay, true);

    return (
      <motion.button
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
MotionButton.displayName = "MotionButton";

export const MotionA = forwardRef<HTMLAnchorElement, BaseMotionProps & HTMLMotionProps<"a">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.a
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
MotionA.displayName = "MotionA";

export const MotionImg = forwardRef<HTMLImageElement, BaseMotionProps & HTMLMotionProps<"img">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.img
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
MotionImg.displayName = "MotionImg";

export const MotionUl = forwardRef<HTMLUListElement, BaseMotionProps & HTMLMotionProps<"ul">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.ul
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
MotionUl.displayName = "MotionUl";

export const MotionOl = forwardRef<HTMLOListElement, BaseMotionProps & HTMLMotionProps<"ol">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.ol
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
MotionOl.displayName = "MotionOl";

export const MotionLi = forwardRef<HTMLLIElement, BaseMotionProps & HTMLMotionProps<"li">>(
  ({ variant = "fadeInUp", delay = 0, duration, className, ...props }, ref) => {
    const selectedVariants = getVariants(variant);
    const transition = getTransition(duration, delay);

    return (
      <motion.li
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
MotionLi.displayName = "MotionLi";

// Specialized motion components for common UI patterns
export const MotionCard = forwardRef<HTMLDivElement, BaseMotionProps & HTMLMotionProps<"div">>(
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

export const MotionModal = forwardRef<HTMLDivElement, BaseMotionProps & HTMLMotionProps<"div">>(
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

export const MotionDrawer = forwardRef<HTMLDivElement, BaseMotionProps & HTMLMotionProps<"div">>(
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
export const MotionStaggerContainer = forwardRef<HTMLDivElement, BaseMotionProps & HTMLMotionProps<"div">>(
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

export const MotionStaggerItem = forwardRef<HTMLDivElement, BaseMotionProps & HTMLMotionProps<"div">>(
  ({ variant = "fadeInUp", className, ...props }, ref) => (
    <MotionDiv
      ref={ref}
      variants={getVariants(variant)}
      className={className}
      {...props}
    />
  )
);
MotionStaggerItem.displayName = "MotionStaggerItem";

// Page transition wrapper
export const MotionPage = forwardRef<HTMLDivElement, BaseMotionProps & HTMLMotionProps<"div">>(
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
export const MotionSpinner = forwardRef<HTMLDivElement, BaseMotionProps & HTMLMotionProps<"div">>(
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
export const MotionPulse = forwardRef<HTMLDivElement, BaseMotionProps & HTMLMotionProps<"div">>(
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
