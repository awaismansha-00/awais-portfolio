import { useEffect, useRef, useState } from "react";

export function useDragScroll() {
  const ref = useRef(null);
  const drag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0, distance: 0, suppressClick: false, captured: false });

  const endDrag = (snap = true) => {
    if (!drag.current.active) return;
    const { distance, moved, scrollLeft } = drag.current;
    const track = ref.current;
    drag.current.active = false;
    drag.current.captured = false;
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
        drag.current.captured = false;
        document.body.style.userSelect = "none";
      },
      onPointerMove: (event) => {
        if (event.pointerType !== "mouse") return;
        if (!drag.current.active || !ref.current) return;
        const distance = event.pageX - drag.current.startX;
        drag.current.distance = distance;
        if (Math.abs(distance) > 5) {
          drag.current.moved = true;
          // Capture only once this is a real drag. Capturing on pointerdown retargets the
          // click to the track, which stops the card's GitHub/Medium links from opening.
          if (!drag.current.captured) {
            drag.current.captured = true;
            ref.current.setPointerCapture(event.pointerId);
          }
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

export function getCarouselState(track) {
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

export function useCarouselState(trackRef, itemCount) {
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

export function getCarouselScrollAmount(track) {
  const card = track?.querySelector("[data-carousel-card]");
  if (!track || !card) return 0;
  const styles = window.getComputedStyle(track);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
  return card.getBoundingClientRect().width + gap;
}
