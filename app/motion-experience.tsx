"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function MotionExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!root.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("gsap-ready");
    if (reduced) return () => document.documentElement.classList.remove("gsap-ready");

    const bar = root.current.querySelector<HTMLElement>(".motion-progress__bar");
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = `scaleX(${distance > 0 ? scrollY / distance : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };
    addEventListener("scroll", onScroll, { passive: true });
    updateProgress();

    return () => {
      removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      document.documentElement.classList.remove("gsap-ready");
    };
  }, [pathname]);

  return <div ref={root} className="motion-root"><div className="motion-progress" aria-hidden="true"><div className="motion-progress__bar"/></div>{children}</div>;
}
