import { profile } from "../content/profile.js";
import { MOTION } from "../lib/motion.js";
import { Reveal } from "./Reveal.jsx";
import { SectionHeading } from "./SectionHeading.jsx";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Copy, ExternalLink, GitBranch } from "lucide-react";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const { email } = profile;
  const reducedMotion = useReducedMotion();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <section id="contact" className="portfolio-section-surface contact-section border-t border-white/10 px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <SectionHeading title="Contact">
            <p>Need a DevOps engineer who can make delivery calmer? Send a note about your platform, cloud, automation, or reliability work. I will reply with the next useful step.</p>
          </SectionHeading>
        </Reveal>

        <motion.div className="contact-panel rounded-lg border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/25" initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0.01 : MOTION.durations.reveal, delay: reducedMotion ? 0 : MOTION.stagger, ease: MOTION.ease }}>
          <a href={`mailto:${email}`} className="block border-b border-white/10 pb-6 text-3xl font-black leading-tight text-[#f5efe4] transition-colors duration-200 hover:text-[#e0ff72] md:text-5xl">
            {email}
          </a>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyEmail}
              className="portfolio-action inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold focus:outline-none"
            >
              <Copy size={18} aria-hidden="true" /> {copied ? "Copied" : "Copy Email"}
            </button>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="portfolio-action inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold focus:outline-none">
              <GitBranch size={18} aria-hidden="true" /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="portfolio-action inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold focus:outline-none">
              <ExternalLink size={18} aria-hidden="true" /> LinkedIn
            </a>
            <a href={profile.medium} target="_blank" rel="noopener noreferrer" className="portfolio-action inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold focus:outline-none">
              <ExternalLink size={18} aria-hidden="true" /> Medium
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
