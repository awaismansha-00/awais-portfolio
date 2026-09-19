import { MOTION } from "../lib/motion.js";
import { motion, useReducedMotion } from "motion/react";

export function Reveal({ children, className = "", delay = 0, amount = MOTION.viewport.amount, y = 18 }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: reducedMotion ? 0.01 : MOTION.durations.reveal, delay: reducedMotion ? 0 : delay, ease: MOTION.ease }}
    >
      {children}
    </motion.div>
  );
}
