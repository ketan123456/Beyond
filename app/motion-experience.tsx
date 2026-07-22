"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function MotionExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!root.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("gsap-ready");

    const context = gsap.context(() => {
      gsap.set(".route-curtain", { scaleY: 1, transformOrigin: "top" });
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .to(".route-curtain", { scaleY: 0, duration: reduced ? 0 : .55 })
        .from("header", { y: reduced ? 0 : -28, autoAlpha: 0, duration: reduced ? 0 : .45 }, "<.1");
      if (document.querySelector(".hero")) {
        intro
          .from(".hero-copy > *", { y: reduced ? 0 : 30, autoAlpha: 0, duration: reduced ? 0 : .65, stagger: .06 }, "<")
          .from(".hero-media", { autoAlpha: 0, duration: reduced ? 0 : .7 }, "<.1");
      }

      if (!reduced) {
        gsap.to(".motion-progress__bar", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: .1 },
        });

        ScrollTrigger.batch("main > section:not(.hero), .footer-banner, .footer-grid", {
          start: "top 94%",
          once: true,
          onEnter: (elements) => gsap.fromTo(elements, { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .65, stagger: .08, ease: "power2.out", clearProps: "transform,opacity,visibility" }),
        });

        ScrollTrigger.batch(".service-card, .journey-steps article, .contact-strip > div, .partner-benefits > span, details", {
          start: "top 96%",
          once: true,
          onEnter: (elements) => gsap.fromTo(elements, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .5, stagger: .05, ease: "power2.out", clearProps: "transform,opacity,visibility" }),
        });
      }
    }, root);

    let refreshTimer = 0;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    const resizeObserver = new ResizeObserver(scheduleRefresh);
    resizeObserver.observe(root.current);
    window.addEventListener("load", scheduleRefresh, { once: true });
    document.fonts?.ready.then(scheduleRefresh);
    scheduleRefresh();

    return () => {
      window.clearTimeout(refreshTimer);
      resizeObserver.disconnect();
      context.revert();
      document.documentElement.classList.remove("gsap-ready");
    };
  }, [pathname]);

  return <div ref={root} className="motion-root"><div className="route-curtain" aria-hidden="true"><span>BEYOND</span></div><div className="motion-progress" aria-hidden="true"><div className="motion-progress__bar"/></div>{children}</div>;
}
