// Export all UI components
export * from "./button";
export * from "./card";
export * from "./input";
export * from "./label";
export * from "./textarea";
export * from "./badge";
export * from "./progress";
export * from "./tabs";
export * from "./accordion";
export * from "./dropdown-menu";
export * from "./form";
export * from "./dialog";
export * from "./avatar";
export * from "./bento-grid";
export * from "./tilt-card";
export * from "./motion-components";

// Export motion components with convenient aliases
export {
  MotionDiv,
  MotionSection,
  MotionArticle,
  MotionAside,
  MotionHeader,
  MotionFooter,
  MotionNav,
  MotionMain,
  MotionH1,
  MotionH2,
  MotionH3,
  MotionH4,
  MotionH5,
  MotionH6,
  MotionP,
  MotionSpan,
  MotionButton,
  MotionA,
  MotionImg,
  MotionUl,
  MotionOl,
  MotionLi,
  MotionCard,
  MotionModal,
  MotionDrawer,
  MotionStaggerContainer,
  MotionStaggerItem,
  MotionPage,
  MotionSpinner,
  MotionPulse,
  motionVariants,
  motionTransitions,
  type MotionComponentProps,
  type MotionVariants,
  type MotionTransitions,
} from "./motion-components";

// Export animation utilities
export {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideInFromBottom,
  staggerContainer,
  staggerItem,
  hoverScale,
  hoverLift,
  pulse,
  spin,
  pageTransition,
  modalVariants,
  drawerVariants,
  transitions,
  createDelayedAnimation,
  optimizedSettings,
  useInViewAnimation,
  animationPresets,
} from "../../lib/animations";

// Export animation hooks
export {
  useScrollReveal,
  useParallaxScroll,
  useSmoothScroll,
  useMousePosition,
  useMagneticEffect,
  useStaggeredAnimation,
  useTextReveal,
  useCounterAnimation,
  useIntersectionAnimation,
  useOptimizedAnimation,
  useViewportAnimation,
} from "../../hooks/use-framer-animations";
