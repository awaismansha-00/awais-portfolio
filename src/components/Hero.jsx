import { CV_URL, CV_DOWNLOAD_NAME } from "../content/profile.js";
import { MOTION, HERO_WORDS, HERO_WORD_INTERVAL } from "../lib/motion.js";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function FlipFadeLetter({ char, letterDuration }) {
  return (
    <motion.span
      className="hero-flip-word__letter"
      style={{ transformStyle: "preserve-3d" }}
      variants={{
        initial: {
          rotateX: 90,
          y: 20,
          opacity: 0,
          filter: "blur(8px)",
        },
        animate: {
          rotateX: 0,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            duration: letterDuration,
            ease: [0.2, 0.65, 0.3, 0.9],
          },
        },
        exit: {
          rotateX: -90,
          y: -20,
          opacity: 0,
          filter: "blur(8px)",
          transition: {
            duration: letterDuration * 0.67,
            ease: "easeIn",
          },
        },
      }}
    >
      {char}
    </motion.span>
  );
}

export function FlipFadeWord({ text, letterDuration = 0.6, staggerDelay = 0.1, exitStaggerDelay = 0.05 }) {
  const letters = useMemo(() => text.split(""), [text]);

  return (
    <motion.span
      key={text}
      className="hero-section__accent hero-rotating-word__value hero-flip-word"
      initial="initial"
      animate="animate"
      exit="exit"
      aria-hidden="true"
      variants={{
        initial: { opacity: 1 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
        exit: {
          opacity: 1,
          transition: {
            staggerChildren: exitStaggerDelay,
          },
        },
      }}
    >
      {letters.map((char, index) => (
        <FlipFadeLetter key={`${char}-${index}`} char={char} letterDuration={letterDuration} />
      ))}
    </motion.span>
  );
}

export function RotatingHeroWord({ reducedMotion }) {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const interval = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % HERO_WORDS.length);
    }, HERO_WORD_INTERVAL);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  const word = HERO_WORDS[wordIndex];

  return (
    <span className="hero-rotating-word">
      <span className="hero-rotating-word__stage" style={{ perspective: "1000px" }}>
        {reducedMotion ? (
          <span className="hero-section__accent hero-rotating-word__value hero-flip-word" aria-hidden="true">
            {word}
          </span>
        ) : (
          <AnimatePresence mode="wait">
            <FlipFadeWord text={word} />
          </AnimatePresence>
        )}
      </span>
      {/* Static so the heading keeps one stable accessible name instead of re-announcing every rotation. */}
      <span className="sr-only">{HERO_WORDS[0]}</span>
    </span>
  );
}

export function Hero({ isReady, reducedMotion }) {
  return (
    <section id="top" className="hero-section relative isolate min-h-[92svh] overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pt-32">
      <div className="hero-section__base" aria-hidden="true" />
      <div className="hero-section__grid" aria-hidden="true" />
      <div className="hero-section__visual" aria-hidden="true">
        <img className="hero-section__image" src="/assets/awais-hero-portrait.webp" alt="" />
        <div className="hero-section__image-wash" />
      </div>
      <div className="hero-section__visual-glow" aria-hidden="true" />

      <div className="hero-section__layout relative z-10 mx-auto flex max-w-7xl items-center lg:min-h-[calc(92svh-8rem)]">
        <motion.div
          className="hero-section__content flex w-full max-w-7xl flex-col justify-between"
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          animate={isReady || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: reducedMotion ? 0.01 : MOTION.durations.reveal, delay: reducedMotion ? 0 : 0.08, ease: MOTION.ease }}
        >
          <div className="hero-section__headline-block">
            <p className="hero-section__eyebrow mb-5">Devops engineer, cloud security and platform engineering</p>
            <h1 className="hero-section__title max-w-[12ch] text-balance">
              <span>BUILD WITH </span>
              <RotatingHeroWord reducedMotion={reducedMotion} />
            </h1>
          </div>

          <div className="hero-section__bottom-row mt-10">
            <div className="hero-section__actions flex flex-wrap gap-3">
              <a
                href="#work"
                className="portfolio-action portfolio-action--solid inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-black focus:outline-none"
              >
                View Projects <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a
                href={CV_URL}
                download={CV_DOWNLOAD_NAME}
                className="portfolio-action inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-black focus:outline-none"
              >
                Download CV <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
            <p className="hero-section__description max-w-2xl">
              Based in the UK, I’m Awais Mansha — a DevOps and Cloud Engineer focused on reusable infrastructure, secure cloud platforms, and automated delivery systems built to evolve.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
