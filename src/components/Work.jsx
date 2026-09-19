import { getFeaturedItems } from "../lib/content.js";
import { useDragScroll, useCarouselState, getCarouselScrollAmount } from "../hooks/useCarousel.js";
import { SectionHeading } from "./SectionHeading.jsx";
import { ProjectCard } from "./ProjectCard.jsx";
import { motion } from "motion/react";
import projects from "../content/projects.json";
import { ArrowRight } from "lucide-react";

export function Work() {
  const { ref: projectsTrack, dragProps: projectDragProps } = useDragScroll();
  const featuredProjects = getFeaturedItems(projects);
  const projectCarouselState = useCarouselState(projectsTrack, featuredProjects.length);
  const scrollProjects = (direction) => {
    const track = projectsTrack.current;
    if (!track) return;
    track.scrollBy({ left: direction * getCarouselScrollAmount(track), behavior: "smooth" });
  };

  return (
    <section id="work" className="portfolio-section-surface border-t border-white/10 px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeading title="Selected Work" />
          <a
            href="/projects"
            className="portfolio-action inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-black focus:outline-none"
          >
            View All Projects <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>

        <div
          ref={projectsTrack}
          data-testid="project-carousel"
          className="mx-auto mt-10 flex max-w-4xl cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          {...projectDragProps}
        >
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              onScrollLeft={() => scrollProjects(-1)}
              onScrollRight={() => scrollProjects(1)}
              canScrollLeft={projectCarouselState.canScrollLeft}
              canScrollRight={projectCarouselState.canScrollRight}
              isFocused={projectCarouselState.activeIndex === index}
            />
          ))}
        </div>
        <div className="mx-auto mt-4 h-px max-w-4xl overflow-hidden bg-white/10" aria-label="Project carousel progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(projectCarouselState.progress * 100)}>
          <motion.div className="h-full origin-left bg-cyan-300" animate={{ scaleX: Math.max(0.08, projectCarouselState.progress) }} transition={{ duration: 0.2, ease: "easeOut" }} />
        </div>
      </div>
    </section>
  );
}
