import { processSteps } from "../content/process.js";
import { MOTION } from "../lib/motion.js";
import { SectionHeading } from "./SectionHeading.jsx";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

export function Process() {
  return (
    <section id="process" className="portfolio-section-surface relative isolate overflow-hidden border-t border-white/10 px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="Process" />

        <div className="relative z-10 mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {processSteps.map(([step, title, body], index) => (
            <ProcessStep key={step} step={step} title={title} body={body} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessStep({ step, title, body, index }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);
  const active = useInView(ref, { once: true, amount: 0.35 });

  return (
    <motion.article
      ref={ref}
      data-process-step={step}
      data-process-active={active ? "true" : "false"}
      className="process-step relative min-h-80 overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20"
      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reducedMotion ? 0.01 : MOTION.durations.reveal, delay: reducedMotion ? 0 : index * MOTION.stagger, ease: MOTION.ease }}
    >
              <span className="text-xs font-black uppercase text-cyan-300">{step}</span>
              <h3 className="mt-8 text-xl font-black leading-tight text-[#f5efe4]">{title}</h3>
              <p className="mt-4 leading-7 text-[#b6c1ba]">{body}</p>
              <span className="absolute bottom-2 right-4 text-7xl font-black leading-none text-white/[0.055]" aria-hidden="true">
                {step}
              </span>
    </motion.article>
  );
}
