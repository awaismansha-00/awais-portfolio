import { MOTION } from "../lib/motion.js";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export function BlogCard({ post, variant = "carousel", onScrollLeft, onScrollRight, canScrollLeft = false, canScrollRight = false }) {
  const isCarousel = variant === "carousel";
  const showCarouselControls = isCarousel && (canScrollLeft || canScrollRight);
  const reducedMotion = useReducedMotion();
  const shouldReveal = !reducedMotion && !isCarousel && !post.image;

  return (
    <motion.article
      data-carousel-card={isCarousel ? true : undefined}
      className={`group blog-card overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-lime-300/40 ${
        isCarousel ? "w-full shrink-0 snap-start" : "h-full"
      }`}
      initial={shouldReveal ? { opacity: 0, y: 16 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: shouldReveal ? MOTION.durations.reveal : 0.01, ease: MOTION.ease }}
    >
      {post.image || isCarousel ? (
        <div className="blog-card__media relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-[#0f1211]">
          {post.image ? (
            <img src={post.image} alt={`${post.title} architecture guide`} loading="eager" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-focus-within:scale-[1.03]" />
          ) : (
            <div className="grid h-full place-items-center bg-[linear-gradient(135deg,rgba(24,199,187,0.14),rgba(242,184,75,0.10)),#101413]">
              <span className="text-xs font-black uppercase text-amber-300">Medium article</span>
            </div>
          )}
          {showCarouselControls ? (
            <div
              data-testid="blog-carousel-controls"
              className="pointer-events-none absolute inset-y-0 left-3 right-3 flex items-center justify-between opacity-0 transition duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
            >
              {canScrollLeft ? (
                <button
                  type="button"
                  aria-label="Scroll blogs left"
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
                  aria-label="Scroll blogs right"
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
      ) : null}
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase text-cyan-300">Medium article</p>
            <h3 className="mt-3 text-2xl font-black leading-tight text-[#f5efe4]">{post.title}</h3>
          </div>
          <a href={post.href} target="_blank" rel="noopener noreferrer" className="portfolio-action portfolio-action--compact inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none">
            Read on Medium <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
        <p className="mt-4 max-w-3xl leading-8 text-[#b6c1ba]">{post.summary}</p>
      </div>
    </motion.article>
  );
}
