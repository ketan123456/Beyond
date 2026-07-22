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
    const nativeCleanups: Array<() => void> = [];
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
        gsap.to(".motion-progress__bar", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .1 } });
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

        gsap.to(".hero-copy", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .8 } });
        gsap.to(".hero-media img", { scale: 1.08, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .9 } });
        gsap.to(".impact-panel", { y: -22, rotate: 1.2, ease: "none", scrollTrigger: { trigger: ".journey", start: "top 85%", end: "bottom 25%", scrub: .8 } });
        gsap.utils.toArray<HTMLImageElement>(".page-hero img, .help-hero img, .problem img, .impact-map-section img").forEach((image) => {
          gsap.fromTo(image, { yPercent: -5, scale: 1.04 }, { yPercent: 5, scale: 1, ease: "none", scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: .8 } });
        });

        const programmeTrack = root.current?.querySelector<HTMLElement>(".programs .card-grid");
        if (programmeTrack && window.innerWidth > 980) {
          gsap.fromTo(programmeTrack, { x: 0 }, {
            x: () => Math.min(0, -(programmeTrack.scrollWidth - programmeTrack.parentElement!.clientWidth)),
            ease: "none",
            scrollTrigger: { trigger: ".programs", start: "top 82%", end: "bottom 18%", scrub: 1, invalidateOnRefresh: true },
          });
        }

        const magneticButtons = Array.from(root.current?.querySelectorAll<HTMLElement>(".btn") || []);
        magneticButtons.forEach((button) => {
          const move = (event: PointerEvent) => { const rect = button.getBoundingClientRect(); gsap.to(button, { x: (event.clientX - rect.left - rect.width / 2) * .12, y: (event.clientY - rect.top - rect.height / 2) * .12, duration: .25, overwrite: true }); };
          const reset = () => gsap.to(button, { x: 0, y: 0, duration: .5, ease: "elastic.out(1,.4)", overwrite: true });
          button.addEventListener("pointermove", move); button.addEventListener("pointerleave", reset);
          nativeCleanups.push(() => { button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", reset); });
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
    window.addEventListener("beyond:language-change", scheduleRefresh);
    document.fonts?.ready.then(scheduleRefresh);
    scheduleRefresh();

    return () => {
      window.clearTimeout(refreshTimer);
      resizeObserver.disconnect();
      nativeCleanups.forEach((cleanup) => cleanup());
      window.removeEventListener("beyond:language-change", scheduleRefresh);
      context.revert();
      document.documentElement.classList.remove("gsap-ready");
    };
  }, [pathname]);

  return <div ref={root} className="motion-root"><div className="route-curtain" aria-hidden="true"><span>BEYOND</span></div><div className="motion-progress" aria-hidden="true"><div className="motion-progress__bar"/></div>{children}</div>;
}
