import { getFeaturedItems } from "../lib/content.js";
import { useDragScroll, useCarouselState, getCarouselScrollAmount } from "../hooks/useCarousel.js";
import { SectionHeading } from "./SectionHeading.jsx";
import { BlogCard } from "./BlogCard.jsx";
import blogPosts from "../content/blogs.json";
import { ArrowRight } from "lucide-react";

export function Blog() {
  const { ref: blogTrack, dragProps: blogDragProps } = useDragScroll();
  const featuredPosts = getFeaturedItems(blogPosts);
  const blogCarouselState = useCarouselState(blogTrack, featuredPosts.length);
  const scrollBlogs = (direction) => {
    const track = blogTrack.current;
    if (!track) return;
    track.scrollBy({ left: direction * getCarouselScrollAmount(track), behavior: "smooth" });
  };

  return (
    <section id="blog" className="portfolio-section-surface border-t border-white/10 px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeading title="Blog" />
          <a
            href="/blogs"
            className="portfolio-action inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-black focus:outline-none"
          >
            View All Blogs <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>

        <div
          ref={blogTrack}
          data-testid="blog-carousel"
          className="mx-auto mt-10 flex max-w-4xl cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          {...blogDragProps}
        >
          {featuredPosts.map((post) => (
            <BlogCard
              key={post.title}
              post={post}
              onScrollLeft={() => scrollBlogs(-1)}
              onScrollRight={() => scrollBlogs(1)}
              canScrollLeft={blogCarouselState.canScrollLeft}
              canScrollRight={blogCarouselState.canScrollRight}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
