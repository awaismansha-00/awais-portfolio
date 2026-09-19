import { usePageVisibility } from "../hooks/useMotionEffects.js";
import { useRef } from "react";
import { useInView } from "motion/react";

export function GlobalBackground({ reducedMotion, isMobile }) {
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
