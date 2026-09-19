import { MOTION } from "../lib/motion.js";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, GitBranch, Network } from "lucide-react";

export function ProjectCard({ project, index, variant = "carousel", onScrollLeft, onScrollRight, canScrollLeft = false, canScrollRight = false, isFocused = false }) {
  const isCarousel = variant === "carousel";
  const showCarouselControls = isCarousel && (canScrollLeft || canScrollRight);
  const reducedMotion = useReducedMotion();
  const shouldReveal = !reducedMotion && !isCarousel && !project.image;

  return (
    <motion.article
      data-carousel-card={isCarousel ? true : undefined}
      data-card-focus={isCarousel ? (isFocused ? "true" : "false") : undefined}
      className={`group portfolio-card overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:border-lime-300/40 focus-within:border-lime-300/40 ${
        isCarousel ? "w-full shrink-0 snap-start" : "h-full"
      }`}
      initial={shouldReveal ? { opacity: 0, y: 18 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: shouldReveal ? MOTION.durations.reveal : 0.01, delay: shouldReveal ? index * MOTION.stagger : 0, ease: MOTION.ease }}
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-[#0f1211]">
        {project.image ? (
          <img src={project.image} alt={`${project.title} architecture`} loading="eager" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-focus-within:scale-[1.03]" />
        ) : (
          <div className="grid h-full place-items-center bg-[linear-gradient(135deg,rgba(24,199,187,0.14),rgba(242,184,75,0.10)),#101413]">
            <div className="grid place-items-center gap-3 text-center">
              <span className="grid size-14 place-items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-cyan-300">
                <Network size={26} aria-hidden="true" />
              </span>
              <span className="text-xs font-black uppercase text-amber-300">Repository project</span>
            </div>
          </div>
        )}
        <div className="absolute inset-x-3 top-3 max-h-0 overflow-hidden rounded-lg border border-white/10 bg-[#0f1211]/92 opacity-0 shadow-xl shadow-black/30 backdrop-blur transition-[max-height,opacity] duration-300 group-hover:max-h-36 group-hover:opacity-100 group-focus-within:max-h-36 group-focus-within:opacity-100">
          <ul className="flex flex-wrap gap-2 p-3" aria-label={`${project.title} tools`}>
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-bold text-[#d7dfd8]">
                {tag}
              </li>
            ))}
          </ul>
        </div>
        {showCarouselControls ? (
          <div
            data-testid="project-carousel-controls"
            className="pointer-events-none absolute inset-y-0 left-3 right-3 flex items-center justify-between opacity-0 transition duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
          >
            {canScrollLeft ? (
              <button
                type="button"
                aria-label="Scroll projects left"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onScrollLeft?.();
                }}
                className="portfolio-icon-action pointer-events-auto grid size-11 -translate-x-2 place-items-center rounded-full shadow-xl shadow-black/35 backdrop-blur group-hover:translate-x-0 group-focus-within:translate-x-0 focus:outline-none"
              >
                <ChevronLeft size={21} aria-hidden="true" />
              </button>
            ) : (
              <span aria-hidden="true" />
            )}
            {canScrollRight ? (
              <button
                type="button"
                aria-label="Scroll projects right"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onScrollRight?.();
                }}
                className="portfolio-icon-action pointer-events-auto grid size-11 translate-x-2 place-items-center rounded-full shadow-xl shadow-black/35 backdrop-blur group-hover:translate-x-0 group-focus-within:translate-x-0 focus:outline-none"
              >
                <ChevronRight size={21} aria-hidden="true" />
              </button>
            ) : (
              <span aria-hidden="true" />
            )}
          </div>
        ) : null}
      </div>
      <div className={`flex flex-col p-6 ${isCarousel ? "min-h-[260px]" : "min-h-[300px]"}`}>
        <div className="flex items-center justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-full border border-cyan-300/35 text-sm font-black text-cyan-300">
            {String(index + 1).padStart(2, "0")}
          </span>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="portfolio-action portfolio-action--compact inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none">
            <GitBranch size={15} aria-hidden="true" /> GitHub
          </a>
        </div>
        <h3 className="mt-8 max-w-xl text-2xl font-black leading-tight text-[#f5efe4]">{project.title}</h3>
        <p className="mt-4 line-clamp-4 max-w-2xl leading-8 text-[#b6c1ba]">{project.summary}</p>
      </div>
    </motion.article>
  );
}
