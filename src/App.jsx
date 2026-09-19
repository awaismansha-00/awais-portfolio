import { profile } from "./content/profile.js";
import { MOTION } from "./lib/motion.js";
import { FEATURED_IMAGE_URLS, preloadImage, preloadRouteImages } from "./lib/images.js";
import { INTERNAL_PATHS, getPageFromPathname, usePortfolioNavigation, useRouteScroll } from "./hooks/usePortfolioNavigation.js";
import { useInitialLoader } from "./hooks/useInitialLoader.js";
import { useMediaQuery } from "./hooks/useMotionEffects.js";
import { Loader } from "./components/Loader.jsx";
import { SvgRouteTransition } from "./components/SvgRouteTransition.jsx";
import { GlobalBackground } from "./components/GlobalBackground.jsx";
import { Header } from "./components/Header.jsx";
import { Hero } from "./components/Hero.jsx";
import { Work } from "./components/Work.jsx";
import { Skills } from "./components/Skills.jsx";
import { Blog } from "./components/Blog.jsx";
import { Process } from "./components/Process.jsx";
import { Contact } from "./components/Contact.jsx";
import { ListingPage } from "./pages/ListingPage.jsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { scrollToHash } from "./lib/navigation.js";

export function App() {
  const normalizedPath = window.location.pathname.replace(/\/$/, "") || "/";
  const [page, setPage] = useState(normalizedPath === "/projects" || normalizedPath === "/blogs" ? normalizedPath.slice(1) : "home");
  const [routeTransition, setRouteTransition] = useState(null);
  const scrollPositions = useRef({});
  const pageRef = useRef(page);
  const routeInFlightRef = useRef(false);
  const routeTimersRef = useRef([]);
  const { isVisible: isLoaderVisible, prefersReducedMotion } = useInitialLoader();
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    [...new Set(FEATURED_IMAGE_URLS)].forEach((imageUrl) => preloadImage(imageUrl));
  }, []);

  const clearRouteTimers = useCallback(() => {
    routeTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    routeTimersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearRouteTimers();
  }, [clearRouteTimers]);

  const scrollSameRoute = useCallback((url, nextPage) => {
    window.requestAnimationFrame(() => {
      if (nextPage === "home" && url.hash) {
        scrollToHash(url.hash);
      } else if (nextPage !== "home") {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    });
  }, []);

  const navigateWithTransition = useCallback((href, options = {}) => {
    const { replace = false, isPop = false } = options;
    let url;

    try {
      url = new URL(href, window.location.origin);
    } catch {
      return false;
    }

    if (url.origin !== window.location.origin || !INTERNAL_PATHS.has(url.pathname)) return false;

    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    const currentBrowserUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const nextPage = getPageFromPathname(url.pathname);
    const currentRenderedPage = pageRef.current;
    const currentRenderedPath = currentRenderedPage === "home" ? "/" : `/${currentRenderedPage}`;

    if (!isPop && nextUrl === currentBrowserUrl) {
      if (nextPage === currentRenderedPage && url.pathname === currentRenderedPath) {
        scrollSameRoute(url, nextPage);
      }
      return true;
    }

    if (nextPage === currentRenderedPage && url.pathname === currentRenderedPath) {
      scrollPositions.current[window.location.pathname] = window.scrollY;
      if (!isPop) {
        if (replace) window.history.replaceState({}, "", nextUrl);
        else window.history.pushState({}, "", nextUrl);
      }
      setPage(nextPage);
      scrollSameRoute(url, nextPage);
      return true;
    }

    if (routeInFlightRef.current) return true;

    scrollPositions.current[window.location.pathname] = window.scrollY;
    const targetImagesReady = preloadRouteImages(nextPage).catch(() => undefined);

    const applyRoute = () => {
      if (!isPop) {
        if (replace) window.history.replaceState({}, "", nextUrl);
        else window.history.pushState({}, "", nextUrl);
      }
      setPage(nextPage);
    };

    if (prefersReducedMotion) {
      applyRoute();
      return true;
    }

    routeInFlightRef.current = true;
    clearRouteTimers();
    setRouteTransition({ phase: "cover" });

    const coverTimer = window.setTimeout(() => {
      targetImagesReady.then(() => {
        applyRoute();
        setRouteTransition({ phase: "reveal" });

        const revealTimer = window.setTimeout(() => {
          routeInFlightRef.current = false;
          setRouteTransition(null);
        }, MOTION.durations.routeReveal * 1000);

        routeTimersRef.current.push(revealTimer);
      });
    }, MOTION.durations.routeCover * 1000);

    routeTimersRef.current.push(coverTimer);
    return true;
  }, [clearRouteTimers, prefersReducedMotion, scrollSameRoute]);

  usePortfolioNavigation(navigateWithTransition);
  useRouteScroll(page, scrollPositions);

  return (
    <div className="min-h-screen bg-[#050706] text-[#f5efe4] selection:bg-cyan-300/30">
      <AnimatePresence>{isLoaderVisible ? <Loader reducedMotion={prefersReducedMotion} /> : null}</AnimatePresence>
      <GlobalBackground reducedMotion={prefersReducedMotion} isMobile={isMobile} />
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:border focus:border-cyan-300 focus:bg-[#0f1211] focus:px-4 focus:py-3">
        Skip to content
      </a>
      <Header />
      <motion.div
        key={page}
        className="portfolio-route"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0.01 : MOTION.durations.fast, ease: MOTION.ease }}
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
      <AnimatePresence>
        {routeTransition ? <SvgRouteTransition phase={routeTransition.phase} /> : null}
      </AnimatePresence>
      <footer className="border-t border-white/10 bg-[#050706] px-4 py-8 text-[#b6c1ba] md:px-8">
        <div className="mx-auto max-w-7xl">
          <p>&copy; {new Date().getFullYear()} {profile.name}.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
