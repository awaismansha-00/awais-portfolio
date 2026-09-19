import { MOTION } from "../lib/motion.js";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export function useInitialLoader() {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return window.sessionStorage.getItem("awais-portfolio-loader") !== "shown";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem("awais-portfolio-loader", "shown");
    } catch {
      // The loader still works when browser storage is unavailable.
    }
    const timeout = window.setTimeout(
      () => setIsVisible(false),
      (prefersReducedMotion ? MOTION.durations.reducedLoader : MOTION.durations.loader) * 1000,
    );
    return () => window.clearTimeout(timeout);
  }, [prefersReducedMotion]);

  return { isVisible, prefersReducedMotion };
}
