import { SectionHeading } from "../components/SectionHeading.jsx";
import { ProjectCard } from "../components/ProjectCard.jsx";
import { BlogCard } from "../components/BlogCard.jsx";
import blogPosts from "../content/blogs.json";
import projects from "../content/projects.json";
import { ChevronLeft } from "lucide-react";

export function ListingPage({ type }) {
  const isProjects = type === "projects";
  const title = isProjects ? "Projects" : "Blogs";
  const items = isProjects ? projects : blogPosts;

  return (
    <main id="content">
      <section id="top" className="portfolio-section-surface min-h-screen border-t border-white/10 px-4 pb-20 pt-32 md:px-8 md:pb-28 md:pt-36">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading title={title} className="section-heading--listing" />
            <a
              href={isProjects ? "/#work" : "/#blog"}
              className="portfolio-action inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold focus:outline-none"
            >
              <ChevronLeft size={17} aria-hidden="true" /> Back to homepage
            </a>
          </div>

          <div className={`mt-10 grid gap-5 ${isProjects ? "md:grid-cols-2 xl:grid-cols-3" : "lg:grid-cols-2"}`}>
            {items.map((item, index) =>
              isProjects ? (
                <ProjectCard key={item.title} project={item} index={index} variant="grid" />
              ) : (
                <BlogCard key={item.title} post={item} variant="grid" />
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
