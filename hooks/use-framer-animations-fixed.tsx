"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  useAnimation,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type Variants,
  type Transition,
} from "framer-motion";

// Enhanced scroll reveal hook with framer-motion
export function useScrollReveal(threshold = 0.1, rootMargin = "0px 0px -50px 0px") {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: threshold,
    rootMargin,
    once: true,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [isInView, controls]);

  return { ref, controls, isInView };
}

// Parallax scroll hook
export function useParallaxScroll(speed = 0.5) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -speed * 100]);

  return y;
}

// Smooth scroll progress hook
export function useSmoothScroll() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return smoothProgress;
}

// Mouse position tracking hook
export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return mousePosition;
}

// Magnetic effect hook
export function useMagneticEffect(strength = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) * strength);
    mouseY.set((e.clientY - centerY) * strength);
  }, [strength, mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength, handleMouseMove, handleMouseLeave]);

  return { ref, mouseX, mouseY };
}

// Stagger animation hook
export function useStaggeredAnimation(itemCount: number, staggerDelay = 0.1) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  const showItem = (index: number) => {
    setVisibleItems(prev => new Set([...prev, index]));
  };

  const hideItem = (index: number) => {
    setVisibleItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const isItemVisible = (index: number) => visibleItems.has(index);

  return {
    showItem,
    hideItem,
    isItemVisible,
    staggerDelay,
  };
}

// Text reveal animation hook
export function useTextReveal() {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      setIsRevealed(true);
    }
  }, [isInView]);

  return { ref, isRevealed };
}

// Counter animation hook
export function useCounterAnimation(end: number, duration = 2) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [isInView, end, duration]);

  return { ref, count };
}

// Intersection observer with animation controls
export function useIntersectionAnimation(
  variants: Variants,
  options = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: options.threshold,
    rootMargin: options.rootMargin,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    } else {
      controls.start("initial");
    }
  }, [isInView, controls]);

  return { ref, controls, isInView };
}

// Performance-optimized animation hook
export function useOptimizedAnimation() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const getOptimizedTransition = (transition: Transition): Transition => {
    if (isReducedMotion) {
      return {
        duration: 0.01,
        ease: "linear",
      };
    }
    return transition;
  };

  return { isReducedMotion, getOptimizedTransition };
}

// Viewport-based animation hook
export function useViewportAnimation() {
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateViewport = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const isMobile = viewportSize.width < 768;
  const isTablet = viewportSize.width >= 768 && viewportSize.width < 1024;
  const isDesktop = viewportSize.width >= 1024;

  return { viewportSize, isMobile, isTablet, isDesktop };
}
