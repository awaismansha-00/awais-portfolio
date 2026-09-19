import { useEffect, useLayoutEffect } from "react";
import { scrollToHash } from "../lib/navigation.js";

export const INTERNAL_PATHS = new Set(["/", "/projects", "/blogs"]);

export function getPageFromPathname(pathname) {
  return INTERNAL_PATHS.has(pathname) && pathname !== "/" ? pathname.slice(1) : "home";
}

export function usePortfolioNavigation(onNavigate) {
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (onNavigate(href)) event.preventDefault();
    };

    const onPopState = () => {
      onNavigate(window.location.href, { isPop: true });
    };

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
    };
  }, [onNavigate]);
}

export function useRouteScroll(page, scrollPositions) {
  useLayoutEffect(() => {
    const hash = window.location.hash;
    if (page === "home" && hash) {
      scrollToHash(hash);
    } else if (page !== "home") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else if (scrollPositions.current["/"]) {
      window.scrollTo({ top: scrollPositions.current["/"], left: 0, behavior: "auto" });
    }
  }, [page, scrollPositions]);
}
