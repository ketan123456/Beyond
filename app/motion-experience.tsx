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
    const programmeSection = root.current.querySelector<HTMLElement>(".programs");
    let frame = 0;
    let disposed = false;
    let destroyProgrammeMotion: (() => void) | undefined;
    let programmeObserver: IntersectionObserver | undefined;
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

    const startProgrammeMotion = async () => {
      if (!programmeSection || destroyProgrammeMotion) return;
      const programmeTrack = programmeSection.querySelector<HTMLElement>(".card-grid");
      if (!programmeTrack) return;

      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        const distance = () => Math.max(0, programmeTrack.scrollWidth - innerWidth);
        gsap.set(programmeTrack, { x: 0 });
        gsap.to(programmeTrack, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: programmeSection,
            start: "top top",
            end: () => `+=${Math.max(distance(), innerHeight * 0.8)}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, programmeSection);
      ScrollTrigger.refresh();
      destroyProgrammeMotion = () => context.revert();
    };

    if (programmeSection && matchMedia("(min-width: 981px)").matches) {
      programmeObserver = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting) return;
          programmeObserver?.disconnect();
          void startProgrammeMotion();
        },
        { rootMargin: "800px 0px" },
      );
      programmeObserver.observe(programmeSection);
    }

    return () => {
      disposed = true;
      programmeObserver?.disconnect();
      destroyProgrammeMotion?.();
      removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      document.documentElement.classList.remove("gsap-ready");
    };
  }, [pathname]);

  return <div ref={root} className="motion-root"><div className="motion-progress" aria-hidden="true"><div className="motion-progress__bar"/></div>{children}</div>;
}
