import { MOTION, TRANSITION_PATHS } from "../lib/motion.js";
import { motion } from "motion/react";

export function SvgRouteTransition({ phase }) {
  return (
    <motion.div
      className={`route-svg-transition route-svg-transition--${phase}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16, ease: MOTION.ease }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 2453 2535" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        {TRANSITION_PATHS.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            stroke={`var(--route-transition-stroke-${index + 1})`}
            strokeLinecap="round"
            initial={{ pathLength: 0, pathOffset: 0, strokeWidth: 200 }}
            animate={
              phase === "cover"
                ? { pathLength: 1, pathOffset: 0, strokeWidth: 720 }
                : { pathLength: 1, pathOffset: 1.08, strokeWidth: 200 }
            }
            transition={{
              duration: phase === "cover" ? MOTION.durations.routeCover : MOTION.durations.routeReveal,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
}
