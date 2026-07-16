import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { FaAws } from "react-icons/fa";
import {
  SiArgo,
  SiDocker,
  SiElasticsearch,
  SiFluentbit,
  SiGit,
  SiGithubactions,
  SiGrafana,
  SiIstio,
  SiJaeger,
  SiKibana,
  SiKubernetes,
  SiLinux,
  SiOpentelemetry,
  SiPrometheus,
  SiPython,
  SiTerraform,
} from "react-icons/si";
import blogPosts from "./content/blogs.json";
import certificationGroups from "./content/certifications.json";
import projects from "./content/projects.json";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  CloudCog,
  Copy,
  ExternalLink,
  GitBranch,
  Menu,
  Network,
  ServerCog,
  ShieldCheck,
  Workflow,
  X,
} from "lucide-react";

const profile = {
  name: "Awais Mansha",
  role: "DevOps Engineer",
  email: "awaismansha97@gmail.com",
  github: "https://github.com/awaismansha-00",
  linkedin: "https://www.linkedin.com/in/awaismansha/",
  medium: "https://medium.com/@awaismansha",
  image: "/assets/profile.png",
};

const navItems = [
  { label: "Home", href: "/#top" },
  { label: "Work", href: "/#work" },
  { label: "Skills", href: "/#skills" },
  { label: "Blog", href: "/#blog" },
  { label: "Process", href: "/#process" },
  { label: "LET'S WORK TOGETHER", href: "/#contact" },
];

const skillGroups = [
  {
    title: "Cloud and Infrastructure",
    icon: CloudCog,
    items: [
      { label: "AWS", icon: FaAws, color: "#ff9900" },
      { label: "Terraform", icon: SiTerraform, color: "#844fba" },
      { label: "Linux", icon: SiLinux, color: "#f5efe4" },
      { label: "Python", icon: SiPython, color: "#3776ab" },
    ],
  },
  {
    title: "Containers and Orchestration",
    icon: ServerCog,
    items: [
      { label: "Docker", icon: SiDocker, color: "#2496ed" },
      { label: "Kubernetes", icon: SiKubernetes, color: "#326ce5" },
      { label: "Istio Service Mesh", icon: SiIstio, color: "#466bb0" },
    ],
  },
  {
    title: "Delivery and Version Control",
    icon: Workflow,
    items: [
      { label: "Git", icon: SiGit, color: "#f05032" },
      { label: "GitHub Actions", icon: SiGithubactions, color: "#2088ff" },
      { label: "Argo CD", icon: SiArgo, color: "#ef7b4d" },
    ],
  },
  {
    title: "Observability",
    icon: ShieldCheck,
    items: [
      { label: "Prometheus", icon: SiPrometheus, color: "#e6522c" },
      { label: "Grafana", icon: SiGrafana, color: "#f46800" },
      { label: "Elasticsearch", icon: SiElasticsearch, color: "#00bfb3" },
      { label: "Fluent Bit", icon: SiFluentbit, color: "#49bda5" },
      { label: "Kibana", icon: SiKibana, color: "#e8478b" },
      { label: "Jaeger", icon: SiJaeger, color: "#66cfe3" },
      { label: "OpenTelemetry", icon: SiOpentelemetry, color: "#f5efe4" },
    ],
  },
];

const HOMEPAGE_PREVIEW_COUNT = 3;

const MOTION = {
  durations: {
    fast: 0.22,
    route: 0.46,
    loader: 0.9,
    reducedLoader: 0.18,
    reveal: 0.52,
  },
  ease: [0.22, 1, 0.36, 1],
  routeEase: [0.65, 0, 0.35, 1],
  stagger: 0.06,
  viewport: { once: true, amount: 0.18 },
  depth: { perspective: 900, tilt: 4, card: 8 },
  blur: { background: 18 },
};

const INTERNAL_PATHS = new Set(["/", "/projects", "/blogs"]);

function useInitialLoader() {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(() => {
    try {
      if (window.sessionStorage.getItem("awais-portfolio-loader") === "shown") return false;
      window.sessionStorage.setItem("awais-portfolio-loader", "shown");
      return true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setIsVisible(false),
      (prefersReducedMotion ? MOTION.durations.reducedLoader : MOTION.durations.loader) * 1000,
    );
    return () => window.clearTimeout(timeout);
  }, [prefersReducedMotion]);

  return { isVisible, prefersReducedMotion };
}

function usePortfolioNavigation(setPage, setTransitioning, scrollPositions) {
  useEffect(() => {
    const navigate = (href, replace = false) => {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin || !INTERNAL_PATHS.has(url.pathname)) return false;

      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      if (nextUrl === `${window.location.pathname}${window.location.search}${window.location.hash}`) return true;

      scrollPositions.current[window.location.pathname] = window.scrollY;
      if (replace) window.history.replaceState({}, "", nextUrl);
      else window.history.pushState({}, "", nextUrl);
      setTransitioning(true);
      setPage(url.pathname === "/" ? "home" : url.pathname.slice(1));
      return true;
    };

    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (navigate(href)) event.preventDefault();
    };

    const onPopState = () => {
      setTransitioning(true);
      setPage(INTERNAL_PATHS.has(window.location.pathname) && window.location.pathname !== "/" ? window.location.pathname.slice(1) : "home");
    };

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
    };
  }, [scrollPositions, setPage, setTransitioning]);
}

function useRouteScroll(page, scrollPositions) {
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const hash = window.location.hash;
      if (page === "home" && hash) {
        document.querySelector(hash)?.scrollIntoView({ block: "start" });
      } else if (page !== "home") {
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (scrollPositions.current["/"]) {
        window.scrollTo({ top: scrollPositions.current["/"] , behavior: "auto" });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [page, scrollPositions]);
}

function Loader({ reducedMotion }) {
  return (
    <motion.div
      className="portfolio-loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.24, ease: MOTION.ease }}
      aria-label="Loading portfolio"
      role="status"
    >
      <div className="portfolio-loader__system" aria-hidden="true">
        {[0, 1, 2, 3].map((block) => (
          <motion.span
            key={block}
            className="portfolio-loader__block"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.35, x: (block % 2 ? 1 : -1) * 28, y: block < 2 ? -28 : 28 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.42, delay: reducedMotion ? 0 : block * MOTION.stagger, ease: MOTION.ease }}
          />
        ))}
        <span className="portfolio-loader__cross" />
      </div>
      <motion.p
        className="portfolio-loader__name"
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0.01 : 0.34, delay: reducedMotion ? 0 : 0.35, ease: MOTION.ease }}
      >
        Awais Mansha
      </motion.p>
      <span className="portfolio-loader__label">DevOps Engineer</span>
    </motion.div>
  );
}

function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(() => typeof document === "undefined" || document.visibilityState !== "hidden");

  useEffect(() => {
    const onVisibilityChange = () => setIsVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return isVisible;
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, [query]);

  return matches;
}

function Reveal({ children, className = "", delay = 0, amount = MOTION.viewport.amount, y = 18 }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: reducedMotion ? 0.01 : MOTION.durations.reveal, delay: reducedMotion ? 0 : delay, ease: MOTION.ease }}
    >
      {children}
    </motion.div>
  );
}

function useTilt(enabled) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return {
    style: enabled ? { rotateX, rotateY, transformPerspective: MOTION.depth.perspective } : undefined,
    onPointerMove: enabled
      ? (event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          rotateX.set(-y * MOTION.depth.tilt);
          rotateY.set(x * MOTION.depth.tilt);
        }
      : undefined,
    onPointerLeave: enabled ? reset : undefined,
  };
}

function GlobalBackground({ reducedMotion, isMobile }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.01 });
  const isPageVisible = usePageVisibility();
  const active = isInView && isPageVisible && !reducedMotion && !isMobile;
  const nodes = ["14% 28%", "82% 19%", "68% 68%", "27% 78%", "92% 84%"];

  return (
    <div ref={ref} className={`global-background ${active ? "global-background--active" : ""}`} aria-hidden="true">
      <div className="global-background__grid" />
      <div className="global-background__glow" />
      <div className="global-background__lines" />
      {nodes.map((position, index) => <span key={position} className={`global-background__node global-background__node--${index}`} style={{ left: position.split(" ")[0], top: position.split(" ")[1] }} />)}
    </div>
  );
}

function RotatingHeroWord({ reducedMotion }) {
  const words = ["PURPOSE", "IMPACT", "INTENT"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const interval = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % words.length);
    }, 2800);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  return (
    <span className="hero-rotating-word" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[wordIndex]}
          className="hero-section__accent hero-rotating-word__value"
          initial={reducedMotion ? false : { opacity: 0, y: "70%", rotateX: -70 }}
          animate={{ opacity: 1, y: "0%", rotateX: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: "-70%", rotateX: 70 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.42, ease: MOTION.ease }}
        >
          {words[wordIndex]}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only">Purpose, Impact, Intent</span>
    </span>
  );
}

const processSteps = [
  [
    "01",
    "Understand Before Choosing",
    "I start with the problem, not the tool. I study the application, constraints, risks, and operational needs before deciding whether Kubernetes, GitOps, serverless, or another approach is appropriate.",
  ],
  [
    "02",
    "Design for the Real Environment",
    "I treat architecture as more than a diagram. I think about networking, environments, failure points, scalability, security boundaries, deployment strategy, and operational ownership before implementation begins.",
  ],
  [
    "03",
    "Build Reusable Foundations",
    "When I solve a problem, I try to turn the solution into a reusable module, workflow, or pattern. Instead of rebuilding the same VPC, EKS cluster, or CI pipeline for every project, I improve the existing foundation and spend more time on the parts that make each system unique.",
  ],
  [
    "04",
    "Secure by Design",
    "I do not treat security as a final checklist. I consider identity, least-privilege access, secrets, supply-chain risks, workload isolation, and security scanning while designing and building the system.",
  ],
  [
    "05",
    "Validate Through Failure",
    "I test assumptions by troubleshooting deployments, permissions, networking, scaling, and pipeline failures. I use those failures to improve both the system and the reusable patterns behind it.",
  ],
  [
    "06",
    "Document and Share",
    "I turn the final implementation and lessons learned into architecture diagrams, documentation, GitHub projects, and technical articles so that the reasoning behind the system is as clear as the code.",
  ],
];

function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

function useDragScroll() {
  const ref = useRef(null);
  const drag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0, distance: 0, suppressClick: false });

  const endDrag = (snap = true) => {
    if (!drag.current.active) return;
    const { distance, moved, scrollLeft } = drag.current;
    const track = ref.current;
    drag.current.active = false;
    document.body.style.userSelect = "";

    if (snap && track && moved && Math.abs(distance) > 24) {
      const amount = getCarouselScrollAmount(track);
      if (amount > 0) {
        const direction = distance < 0 ? 1 : -1;
        track.scrollTo({ left: scrollLeft + direction * amount, behavior: "smooth" });
      }
    }

    if (moved) {
      drag.current.suppressClick = true;
      window.setTimeout(() => {
        drag.current.suppressClick = false;
        drag.current.moved = false;
        drag.current.distance = 0;
      }, 0);
    }
  };

  return {
    ref,
    dragProps: {
      onPointerDown: (event) => {
        if (event.pointerType !== "mouse" || event.button !== 0 || !ref.current) return;
        drag.current.active = true;
        drag.current.moved = false;
        drag.current.startX = event.pageX;
        drag.current.scrollLeft = ref.current.scrollLeft;
        drag.current.distance = 0;
        ref.current.setPointerCapture(event.pointerId);
        document.body.style.userSelect = "none";
      },
      onPointerMove: (event) => {
        if (event.pointerType !== "mouse") return;
        if (!drag.current.active || !ref.current) return;
        const distance = event.pageX - drag.current.startX;
        drag.current.distance = distance;
        if (Math.abs(distance) > 5) {
          drag.current.moved = true;
        }
        ref.current.scrollLeft = drag.current.scrollLeft - distance * 1.6;
        event.preventDefault();
      },
      onPointerUp: (event) => {
        if (event.pointerType !== "mouse") return;
        endDrag();
      },
      onPointerCancel: () => endDrag(false),
      onLostPointerCapture: () => endDrag(false),
      onDragStart: (event) => event.preventDefault(),
      onClickCapture: (event) => {
        if (!drag.current.suppressClick) return;
        event.preventDefault();
        event.stopPropagation();
      },
    },
  };
}

function getCarouselState(track) {
  if (!track) return { canScrollLeft: false, canScrollRight: false, isScrollable: false, progress: 0, activeIndex: 0 };
  const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
  const canScrollLeft = track.scrollLeft > 2;
  const canScrollRight = track.scrollLeft < maxScrollLeft - 2;
  const cards = [...track.querySelectorAll("[data-carousel-card]")];
  const trackCenter = track.scrollLeft + track.clientWidth / 2;
  const activeIndex = cards.reduce((closest, card, index) => {
    const center = card.offsetLeft + card.offsetWidth / 2;
    return Math.abs(center - trackCenter) < Math.abs((cards[closest]?.offsetLeft + cards[closest]?.offsetWidth / 2 || 0) - trackCenter) ? index : closest;
  }, 0);
  return {
    canScrollLeft,
    canScrollRight,
    isScrollable: maxScrollLeft > 2,
    progress: maxScrollLeft ? track.scrollLeft / maxScrollLeft : 0,
    activeIndex,
  };
}

function useCarouselState(trackRef, itemCount) {
  const [state, setState] = useState({ canScrollLeft: false, canScrollRight: false, isScrollable: false, progress: 0, activeIndex: 0 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const update = () => setState(getCarouselState(track));
    update();

    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    resizeObserver?.observe(track);

    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      resizeObserver?.disconnect();
    };
  }, [trackRef, itemCount]);

  return state;
}

function getCarouselScrollAmount(track) {
  const card = track?.querySelector("[data-carousel-card]");
  if (!track || !card) return 0;
  const styles = window.getComputedStyle(track);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
  return card.getBoundingClientRect().width + gap;
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const activeId = useActiveSection(["top", "work", "skills", "blog", "process", "contact"]);

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

function SectionHeading({ eyebrow, title, children, className = "" }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <p className="mb-4 text-xs font-black uppercase text-amber-300">{eyebrow}</p>
      <h2 className="text-balance text-4xl font-black leading-[1.05] text-[#f5efe4] md:text-5xl">{title}</h2>
      {children ? <div className="mt-5 text-base leading-8 text-[#b6c1ba] md:text-lg">{children}</div> : null}
    </div>
  );
}

function Hero({ isReady, reducedMotion }) {
  return (
    <section id="top" className="hero-section relative isolate min-h-[92svh] overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pt-32">
      <div className="hero-section__base" aria-hidden="true" />
      <div className="hero-section__grid" aria-hidden="true" />
      <div className="hero-section__visual" aria-hidden="true">
        <img className="hero-section__image" src="/assets/awais-hero-portrait.png" alt="" />
        <div className="hero-section__image-wash" />
      </div>
      <div className="hero-section__visual-glow" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-7xl items-center lg:min-h-[calc(92svh-8rem)]">
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
                className="hero-section__primary-button inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-black transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-lime-300"
              >
                View Projects <ArrowRight size={18} aria-hidden="true" />
              </a>
              <button
                type="button"
                className="hero-section__cv-button inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-lime-300"
                aria-disabled="true"
                aria-label="Download CV — CV coming soon"
                title="CV coming soon"
                disabled
              >
                Download CV <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
            <p className="hero-section__description max-w-2xl">
              I’m Awais Mansha — a DevOps and Cloud Engineer focused on reusable infrastructure, secure cloud platforms, and automated delivery systems built to evolve.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, variant = "carousel", onScrollLeft, onScrollRight, canScrollLeft = false, canScrollRight = false, isFocused = false }) {
  const isCarousel = variant === "carousel";
  const showCarouselControls = isCarousel && (canScrollLeft || canScrollRight);
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const tilt = useTilt(isCarousel && finePointer && !reducedMotion);

  return (
    <motion.article
      data-carousel-card={isCarousel ? true : undefined}
      data-card-focus={isCarousel ? (isFocused ? "true" : "false") : undefined}
      className={`group portfolio-card overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:border-amber-300/40 focus-within:border-amber-300/40 ${
        isCarousel ? "w-full shrink-0 snap-start" : "h-full"
      }`}
      style={tilt.style}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reducedMotion ? 0.01 : MOTION.durations.reveal, delay: reducedMotion ? 0 : index * MOTION.stagger, ease: MOTION.ease }}
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-[#0f1211]">
        {project.image ? (
          <img src={project.image} alt={`${project.title} architecture`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-focus-within:scale-[1.03]" />
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
        <div className="absolute inset-x-3 top-3 max-h-0 overflow-hidden rounded-lg border border-white/10 bg-[#0f1211]/92 opacity-0 shadow-xl shadow-black/30 backdrop-blur transition-all duration-300 group-hover:max-h-36 group-hover:opacity-100 group-focus-within:max-h-36 group-focus-within:opacity-100">
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
                className="pointer-events-auto grid size-11 -translate-x-2 place-items-center rounded-full border border-white/20 bg-[#0f1211]/80 text-[#f5efe4] shadow-xl shadow-black/35 backdrop-blur transition hover:border-cyan-300/70 hover:bg-[#0f1211]/95 group-hover:translate-x-0 group-focus-within:translate-x-0 focus:outline-none focus:ring-2 focus:ring-cyan-200"
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
                className="pointer-events-auto grid size-11 translate-x-2 place-items-center rounded-full border border-white/20 bg-[#0f1211]/80 text-[#f5efe4] shadow-xl shadow-black/35 backdrop-blur transition hover:border-cyan-300/70 hover:bg-[#0f1211]/95 group-hover:translate-x-0 group-focus-within:translate-x-0 focus:outline-none focus:ring-2 focus:ring-cyan-200"
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
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-xs font-bold text-[#f5efe4] transition hover:border-cyan-300/60">
            <GitBranch size={15} aria-hidden="true" /> GitHub
          </a>
        </div>
        <h3 className="mt-8 max-w-xl text-2xl font-black leading-tight text-[#f5efe4]">{project.title}</h3>
        <p className="mt-4 line-clamp-4 max-w-2xl leading-8 text-[#b6c1ba]">{project.summary}</p>
      </div>
    </motion.article>
  );
}

function Work() {
  const { ref: projectsTrack, dragProps: projectDragProps } = useDragScroll();
  const featuredProjects = projects.slice(0, HOMEPAGE_PREVIEW_COUNT);
  const projectCarouselState = useCarouselState(projectsTrack, featuredProjects.length);
  const scrollProjects = (direction) => {
    const track = projectsTrack.current;
    if (!track) return;
    track.scrollBy({ left: direction * getCarouselScrollAmount(track), behavior: "smooth" });
  };

  return (
    <section id="work" className="border-t border-white/10 bg-[#0f1211] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-black uppercase text-amber-300">Selected Work</p>
          <a
            href="/projects"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-cyan-300/45 bg-cyan-300/10 px-4 py-2 text-sm font-black text-[#f5efe4] transition hover:border-cyan-300/80 hover:bg-cyan-300/15 focus:outline-none focus:ring-2 focus:ring-cyan-200"
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

function CertificationBadge({ item }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = item.image && !imageFailed;
  const content = (
    <>
      <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-amber-300/25 bg-amber-300/10 text-amber-300" data-certification-icon="certified">
        {hasImage ? (
          <img src={item.image} alt="" className="h-full w-full object-contain p-1" onError={() => setImageFailed(true)} aria-hidden="true" />
        ) : (
          <BadgeCheck size={26} aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-black leading-6 text-[#f5efe4]">{item.title}</span>
        {item.href ? <span className="mt-1 block text-xs font-bold uppercase text-cyan-300">View credential</span> : null}
      </span>
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-20 items-center gap-4 rounded-lg border border-white/10 bg-[#0f1211]/60 px-4 py-3 transition hover:border-amber-300/45 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-amber-200"
      >
        {content}
      </a>
    );
  }

  return <div className="flex min-h-20 items-center gap-4 rounded-lg border border-white/10 bg-[#0f1211]/60 px-4 py-3">{content}</div>;
}

function Skills() {
  const reducedMotion = useReducedMotion();
  return (
    <section id="skills" className="relative isolate overflow-hidden border-t border-white/10 bg-[#101413] px-4 py-20 md:px-8 md:py-28">
      <div className="skills-grid-background" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Skills" title="Hands-on tools across cloud, delivery, and observability.">
          <p>A focused DevOps toolkit for building, shipping, monitoring, and operating production systems.</p>
        </SectionHeading>

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {skillGroups.map(({ title, icon: Icon, items }, groupIndex) => (
            <motion.article
              key={title}
              className="skill-group rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: reducedMotion ? 0.01 : MOTION.durations.reveal, delay: reducedMotion ? 0 : groupIndex * MOTION.stagger, ease: MOTION.ease }}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-black text-[#f5efe4]">{title}</h3>
                <Icon size={22} className="shrink-0 text-amber-300" aria-hidden="true" />
              </div>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${title} skills`}>
                {items.map(({ label, icon: SkillIcon, color }, itemIndex) => (
                  <motion.li key={label} className="skill-chip inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-sm font-bold text-[#d7dfd8]" initial={reducedMotion ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reducedMotion ? 0.01 : 0.3, delay: reducedMotion ? 0 : groupIndex * MOTION.stagger + itemIndex * 0.025, ease: MOTION.ease }}>
                    <SkillIcon size={15} className="shrink-0" style={{ color }} data-skill-icon={label} aria-hidden="true" />
                    {label}
                  </motion.li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal className="h-full">
          <div className="skill-group h-full rounded-lg border border-amber-300/25 bg-amber-300/[0.08] p-5 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full border border-amber-300/35 bg-amber-300/10 text-amber-300">
                <Award size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-black uppercase text-amber-300">Certifications</p>
                <h3 className="mt-1 text-xl font-black text-[#f5efe4]">Validated cloud and Kubernetes growth.</h3>
              </div>
            </div>
          </div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {certificationGroups.map((group) => {
              const isCertified = group.status === "Certified";
              return (
              <Reveal key={group.status} delay={isCertified ? MOTION.stagger : MOTION.stagger * 2} className="h-full">
              <article className="skill-group h-full rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
                <h3 className="text-sm font-black uppercase text-cyan-300">{group.status}</h3>
                <ul className="mt-4 grid gap-3" aria-label={`${group.status} certifications`}>
                  {group.items.map((item) => (
                    <li key={item.title}>
                      {isCertified ? (
                        <CertificationBadge item={item} />
                      ) : (
                        <div className="rounded-lg border border-white/10 bg-[#0f1211]/60 px-4 py-3 text-sm font-bold leading-6 text-[#f5efe4]">
                          <span className="mb-1 block text-xs font-black uppercase text-[#b6c1ba]">Preparing</span>
                          {item.title}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
              </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post, variant = "carousel", onScrollLeft, onScrollRight, canScrollLeft = false, canScrollRight = false }) {
  const isCarousel = variant === "carousel";
  const showCarouselControls = isCarousel && (canScrollLeft || canScrollRight);
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      data-carousel-card={isCarousel ? true : undefined}
      className={`group blog-card overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-amber-300/40 ${
        isCarousel ? "w-full shrink-0 snap-start" : "h-full"
      }`}
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reducedMotion ? 0.01 : MOTION.durations.reveal, ease: MOTION.ease }}
    >
      {post.image || isCarousel ? (
        <div className="blog-card__media relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-[#0f1211]">
          {post.image ? (
            <img src={post.image} alt={`${post.title} architecture guide`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-focus-within:scale-[1.03]" />
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
                  className="pointer-events-auto grid size-11 -translate-x-2 place-items-center rounded-full border border-white/20 bg-[#0f1211]/80 text-[#f5efe4] shadow-xl shadow-black/35 backdrop-blur transition hover:border-amber-300/70 hover:bg-[#0f1211]/95 group-hover:translate-x-0 group-focus-within:translate-x-0 focus:outline-none focus:ring-2 focus:ring-amber-200"
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
                  className="pointer-events-auto grid size-11 translate-x-2 place-items-center rounded-full border border-white/20 bg-[#0f1211]/80 text-[#f5efe4] shadow-xl shadow-black/35 backdrop-blur transition hover:border-amber-300/70 hover:bg-[#0f1211]/95 group-hover:translate-x-0 group-focus-within:translate-x-0 focus:outline-none focus:ring-2 focus:ring-amber-200"
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
          <a href={post.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-xs font-bold text-[#f5efe4] transition hover:border-amber-300/60">
            Read on Medium <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
        <p className="mt-4 max-w-3xl leading-8 text-[#b6c1ba]">{post.summary}</p>
      </div>
    </motion.article>
  );
}

function Blog() {
  const { ref: blogTrack, dragProps: blogDragProps } = useDragScroll();
  const featuredPosts = blogPosts.slice(0, HOMEPAGE_PREVIEW_COUNT);
  const blogCarouselState = useCarouselState(blogTrack, featuredPosts.length);
  const scrollBlogs = (direction) => {
    const track = blogTrack.current;
    if (!track) return;
    track.scrollBy({ left: direction * getCarouselScrollAmount(track), behavior: "smooth" });
  };

  return (
    <section id="blog" className="border-t border-white/10 bg-[linear-gradient(135deg,rgba(242,184,75,0.10),transparent_34%),#151917] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-black uppercase text-amber-300">Blog</p>
          <a
            href="/blogs"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-amber-300/45 bg-amber-300/10 px-4 py-2 text-sm font-black text-[#f5efe4] transition hover:border-amber-300/80 hover:bg-amber-300/15 focus:outline-none focus:ring-2 focus:ring-amber-200"
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

function Process() {
  const processRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: processRef, offset: ["start 0.82", "end 0.32"] });
  const lineScale = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 120, damping: 24 });

  return (
    <section ref={processRef} id="process" className="relative isolate overflow-hidden border-t border-white/10 bg-[#0f1211] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Process" title="How I Work" />

        <div className="process-path" aria-hidden="true">
          <div className="process-path__track" />
          <motion.div className="process-path__progress" style={{ scaleY: reducedMotion ? 1 : lineScale }} />
        </div>
        <div className="relative z-10 mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {processSteps.map(([step, title, body], index) => (
            <ProcessStep key={step} step={step} title={title} body={body} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ step, title, body, index }) {
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

function Contact() {
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
    <section id="contact" className="contact-section border-t border-white/10 bg-[linear-gradient(135deg,rgba(242,184,75,0.12),transparent_32%),linear-gradient(315deg,rgba(239,113,94,0.10),transparent_34%),#121614] px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <SectionHeading eyebrow="Contact" title="Need a DevOps engineer who can make delivery calmer?">
            <p>Send a note about your platform, cloud, automation, or reliability work. I will reply with the next useful step.</p>
          </SectionHeading>
        </Reveal>

        <motion.div className="contact-panel rounded-lg border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/25" initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0.01 : MOTION.durations.reveal, delay: reducedMotion ? 0 : MOTION.stagger, ease: MOTION.ease }}>
          <a href={`mailto:${email}`} className="block border-b border-white/10 pb-6 text-3xl font-black leading-tight text-[#f5efe4] transition hover:text-cyan-200 md:text-5xl">
            {email}
          </a>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-5 py-3 text-sm font-bold text-[#f5efe4] transition hover:-translate-y-0.5 hover:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            >
              <Copy size={18} aria-hidden="true" /> {copied ? "Copied" : "Copy Email"}
            </button>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-5 py-3 text-sm font-bold text-[#f5efe4] transition hover:-translate-y-0.5 hover:border-amber-300/60">
              <GitBranch size={18} aria-hidden="true" /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-5 py-3 text-sm font-bold text-[#f5efe4] transition hover:-translate-y-0.5 hover:border-amber-300/60">
              <ExternalLink size={18} aria-hidden="true" /> LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ListingPage({ type }) {
  const isProjects = type === "projects";
  const title = isProjects ? "All DevOps projects" : "All technical writing";
  const eyebrow = isProjects ? "Projects" : "Blog";
  const body = isProjects
    ? "A fuller view of the infrastructure, Kubernetes, automation, and delivery systems behind the selected work."
    : "All published DevOps notes and walkthroughs, with each post linking to the full article on Medium.";
  const items = isProjects ? projects : blogPosts;

  return (
    <main id="content">
      <section id="top" className="min-h-screen border-t border-white/10 bg-[linear-gradient(135deg,rgba(24,199,187,0.10),transparent_32%),linear-gradient(315deg,rgba(242,184,75,0.10),transparent_34%),#0f1211] px-4 pb-20 pt-32 md:px-8 md:pb-28 md:pt-36">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={eyebrow} title={title}>
              <p>{body}</p>
            </SectionHeading>
            <a
              href={isProjects ? "/#work" : "/#blog"}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/8 px-4 py-2 text-sm font-bold text-[#f5efe4] transition hover:border-cyan-300/60 hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-cyan-200"
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

function App() {
  const normalizedPath = window.location.pathname.replace(/\/$/, "") || "/";
  const [page, setPage] = useState(normalizedPath === "/projects" || normalizedPath === "/blogs" ? normalizedPath.slice(1) : "home");
  const [isTransitioning, setTransitioning] = useState(false);
  const scrollPositions = useRef({});
  const { isVisible: isLoaderVisible, prefersReducedMotion } = useInitialLoader();
  const isPageVisible = usePageVisibility();
  const isMobile = useMediaQuery("(max-width: 767px)");

  usePortfolioNavigation(setPage, setTransitioning, scrollPositions);
  useRouteScroll(page, scrollPositions);

  return (
    <div className="min-h-screen bg-[#0f1211] text-[#f5efe4] selection:bg-cyan-300/30">
      <AnimatePresence>{isLoaderVisible ? <Loader reducedMotion={prefersReducedMotion} /> : null}</AnimatePresence>
      <GlobalBackground reducedMotion={prefersReducedMotion} isMobile={isMobile} />
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:border focus:border-cyan-300 focus:bg-[#0f1211] focus:px-4 focus:py-3">
        Skip to content
      </a>
      <Header />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => setTransitioning(false)}>
        <motion.div
          key={page}
          className="portfolio-route"
          initial={{ opacity: 0, y: 18, scale: 0.992 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.988 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : MOTION.durations.route, ease: MOTION.routeEase }}
        >
          {page === "home" ? (
            <main id="content">
              <Hero isReady={!isLoaderVisible} reducedMotion={prefersReducedMotion} />
              <Work />
              <Skills />
              <Blog />
              <Process />
              <Contact />
            </main>
          ) : (
            <ListingPage type={page} />
          )}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {isTransitioning ? (
          <motion.div
            className="route-mask"
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: prefersReducedMotion ? 0.01 : MOTION.durations.route * 0.72, ease: MOTION.routeEase }}
            aria-hidden="true"
          />
        ) : null}
      </AnimatePresence>
      <footer className="border-t border-white/10 bg-[#0b0e0d] px-4 py-8 text-[#b6c1ba] md:px-8">
        <div className="mx-auto max-w-7xl">
          <p>&copy; {new Date().getFullYear()} {profile.name}.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
