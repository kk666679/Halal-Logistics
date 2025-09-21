import { Variants, Transition } from "framer-motion";

// Enhanced animation variants for consistent animations across the app
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 20,
  },
};

export const fadeInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 20,
  },
};

export const fadeInRight: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -20,
  },
};

export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
  },
};

export const slideInFromBottom: Variants = {
  initial: {
    opacity: 0,
    y: "100%",
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: "100%",
  },
};

// Staggered animations for lists
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

// Hover animations
export const hoverScale: Variants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
  },
};

export const hoverLift: Variants = {
  hover: {
    y: -5,
    transition: { duration: 0.2 },
  },
  tap: {
    y: 0,
  },
};

// Loading animations
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Page transition variants
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 20,
  },
};

// Modal/Dialog animations
export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
};

// Drawer/Slide animations
export const drawerVariants: Variants = {
  initial: {
    x: "100%",
  },
  animate: {
    x: 0,
  },
  exit: {
    x: "100%",
  },
};

// Optimized transition configurations
export const transitions: Record<string, Transition> = {
  smooth: {
    duration: 0.6,
    ease: [0.25, 0.25, 0.25, 1], // cubic-bezier
  },
  quick: {
    duration: 0.3,
    ease: [0.25, 0.25, 0.25, 1],
  },
  bounce: {
    duration: 0.6,
    ease: [0.68, -0.55, 0.265, 1.55], // bounce effect
  },
  elastic: {
    duration: 0.8,
    ease: [0.175, 0.885, 0.32, 1.275], // elastic effect
  },
  spring: {
    type: "spring",
    damping: 25,
    stiffness: 120,
  },
  gentle: {
    type: "spring",
    damping: 20,
    stiffness: 100,
  },
};

// Utility function to create delayed animations
export const createDelayedAnimation = (delay: number, variants: Variants): Variants => ({
  initial: {
    ...variants.initial,
    transition: { delay },
  },
  animate: variants.animate,
  exit: variants.exit,
});

// Performance-optimized animation settings
export const optimizedSettings = {
  layout: false, // Disable layout animations for better performance unless needed
  willChange: "transform, opacity", // Optimize for transforms
};

// Intersection Observer hook integration
export const useInViewAnimation = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
  triggerOnce: true,
};

// Animation presets for common use cases
export const animationPresets = {
  card: {
    variants: fadeInUp,
    transition: transitions.smooth,
    whileHover: hoverLift.hover,
    whileTap: hoverLift.tap,
  },
  button: {
    variants: scaleIn,
    transition: transitions.quick,
    whileHover: hoverScale.hover,
    whileTap: hoverScale.tap,
  },
  list: {
    container: staggerContainer,
    item: staggerItem,
    transition: transitions.smooth,
  },
  modal: {
    variants: modalVariants,
    transition: transitions.spring,
  },
} as const;
