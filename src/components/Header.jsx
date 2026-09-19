import { profile, navItems, SECTION_IDS } from "../content/profile.js";
import { useMediaQuery } from "../hooks/useMotionEffects.js";
import { useActiveSection } from "../hooks/useActiveSection.js";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b px-4 transition duration-200 md:px-8 ${
        isScrolled || isOpen
          ? "border-white/10 bg-[#0f1211]/90 shadow-2xl shadow-black/30 backdrop-blur-2xl"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between">
        <a href="#top" className="group flex min-w-0 items-center gap-3" aria-label={`${profile.name} home`}>
          <span className="grid size-11 overflow-hidden rounded-full border border-cyan-300/40 bg-cyan-300/15 transition group-hover:border-cyan-300">
            <img src={profile.image} alt="" className="h-full w-full object-cover object-[50%_30%]" aria-hidden="true" />
          </span>
          <span className="grid leading-tight">
            <strong className="text-sm font-extrabold text-[#f5efe4]">{profile.name}</strong>
            <span className="text-xs font-medium text-[#b6c1ba]">{profile.role}</span>
          </span>
        </a>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/5 text-[#f5efe4] md:hidden"
          aria-expanded={isOpen}
          aria-controls="site-nav"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          <span className="sr-only">Toggle navigation</span>
        </button>

        <nav
          id="site-nav"
          className={`absolute left-4 right-4 top-[78px] grid gap-2 rounded-lg border border-white/10 bg-[#0f1211]/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-2xl transition md:static md:flex md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none ${
            isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0 md:pointer-events-auto md:translate-y-0 md:opacity-100"
          }`}
          aria-label="Primary navigation"
          inert={isMobile && !isOpen ? true : undefined}
        >
          {navItems.map((item) => {
            const isActive = activeId === item.href.split("#")[1];
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-md px-4 py-3 text-sm font-semibold transition md:rounded-full md:px-3 md:py-2 ${
                  isActive ? "bg-white/10 text-[#f5efe4]" : "text-[#b6c1ba] hover:bg-white/8 hover:text-[#f5efe4]"
                } ${item.href.endsWith("#contact") ? "hero-contact-nav" : ""}`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
