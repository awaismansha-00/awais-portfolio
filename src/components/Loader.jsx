import { MOTION } from "../lib/motion.js";
import { motion } from "motion/react";

export function Loader({ reducedMotion }) {
  const hundreds = ["0", "1"];
  const tens = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const ones = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <motion.div
      className={`portfolio-loader ${reducedMotion ? "portfolio-loader--reduced" : ""}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.28, ease: MOTION.ease }}
      aria-label="Loading portfolio"
      role="status"
    >
      <div className="portfolio-loader__bars" aria-hidden="true">
        <span className="portfolio-loader__bar portfolio-loader__bar--one" />
      </div>
      <div className="portfolio-loader__counter" aria-hidden="true">
        <span className="portfolio-loader__digit portfolio-loader__digit--hundreds">
          {hundreds.map((num, index) => <span key={`${num}-${index}`}>{num}</span>)}
        </span>
        <span className="portfolio-loader__digit portfolio-loader__digit--tens">
          {tens.map((num, index) => <span key={`${num}-${index}`}>{num}</span>)}
        </span>
        <span className="portfolio-loader__digit portfolio-loader__digit--ones">
          {ones.map((num, index) => <span key={`${num}-${index}`}>{num}</span>)}
        </span>
      </div>
      <p className="portfolio-loader__name">Awais Mansha</p>
      <span className="portfolio-loader__label">DevOps Engineer</span>
    </motion.div>
  );
}
