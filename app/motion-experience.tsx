"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MotionExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const select = gsap.utils.selector(root);
    const progress = select<HTMLDivElement>(".motion-progress__bar")[0];
    const cursor = select<HTMLDivElement>(".motion-cursor")[0];

    document.documentElement.classList.add("gsap-ready");
    gsap.set(".route-curtain", { scaleY: 1, transformOrigin: "top" });
    gsap.timeline({ defaults: { ease: "power4.out" } })
      .to(".route-curtain", { scaleY: 0, duration: 1.1 })
      .from("header", { y: -100, opacity: 0, duration: .8 }, "<.15")
      .from(".hero-copy > *", { y: 70, opacity: 0, duration: 1, stagger: .1 }, "<")
      .from(".hero-media", { clipPath: "inset(0 0 100% 0)", duration: 1.35 }, "<.05");

    if (progress) {
      gsap.to(progress, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .15 } });
    }

    gsap.utils.toArray<HTMLElement>("main > section:not(.hero):not(.programs), .footer-banner, .footer-grid").forEach((section) => {
      gsap.from(section, {
        y: 90,
        opacity: 0,
        rotateX: 4,
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 88%", toggleActions: "play none none reverse" },
      });
    });

    gsap.utils.toArray<HTMLElement>(".service-card, .journey-steps article, .contact-strip > div, .partner-benefits > span, details").forEach((item, index) => {
      gsap.from(item, {
        y: 70,
        opacity: 0,
        rotate: index % 2 ? 1.5 : -1.5,
        duration: .8,
        ease: "back.out(1.25)",
        scrollTrigger: { trigger: item, start: "top 92%" },
      });
    });

    gsap.utils.toArray<HTMLImageElement>(".page-hero img, .help-hero img, .problem img, .impact-map-section img").forEach((image) => {
      gsap.fromTo(image, { yPercent: -8, scale: 1.08 }, { yPercent: 8, scale: 1, ease: "none", scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: 1 } });
    });

    gsap.fromTo(".motion-marquee__track", { xPercent: 0 }, { xPercent: -50, ease: "none", scrollTrigger: { trigger: ".motion-marquee", start: "top bottom", end: "bottom top", scrub: 1 } });
    gsap.to(".impact-panel", { rotate: 2.5, y: -35, ease: "none", scrollTrigger: { trigger: ".journey", start: "top bottom", end: "bottom top", scrub: 1.2 } });
    gsap.to(".hero-copy", { yPercent: 14, opacity: .35, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
    gsap.to(".hero-media img", { scale: 1.12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.2 } });

    mm.add({ desktop: "(min-width: 981px)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
      if (!context.conditions?.desktop || !context.conditions?.motion) return;
      const cards = select<HTMLElement>(".programs .card-grid")[0];
      if (cards) {
        gsap.to(cards, {
          x: () => -(cards.scrollWidth - window.innerWidth + 120),
          ease: "none",
          scrollTrigger: { trigger: ".programs", start: "top top", end: () => `+=${cards.scrollWidth}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
        });
      }
    });

    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      if (!cursor) return;
      const moveX = gsap.quickTo(cursor, "x", { duration: .45, ease: "power3" });
      const moveY = gsap.quickTo(cursor, "y", { duration: .45, ease: "power3" });
      const onMove = (event: PointerEvent) => { moveX(event.clientX); moveY(event.clientY); };
      window.addEventListener("pointermove", onMove);
      const interactives = select<HTMLElement>("a, button, select, input, textarea");
      const enter = () => gsap.to(cursor, { scale: 2.8, opacity: .32, duration: .25 });
      const leave = () => gsap.to(cursor, { scale: 1, opacity: .8, duration: .25 });
      interactives.forEach((element) => { element.addEventListener("pointerenter", enter); element.addEventListener("pointerleave", leave); });
      const magnetic = select<HTMLElement>(".btn");
      const cleanups = magnetic.map((button) => {
        const move = (event: PointerEvent) => { const rect = button.getBoundingClientRect(); gsap.to(button, { x: (event.clientX - rect.left - rect.width / 2) * .18, y: (event.clientY - rect.top - rect.height / 2) * .18, duration: .35 }); };
        const reset = () => gsap.to(button, { x: 0, y: 0, duration: .6, ease: "elastic.out(1,.35)" });
        button.addEventListener("pointermove", move); button.addEventListener("pointerleave", reset);
        return () => { button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", reset); };
      });
      return () => { window.removeEventListener("pointermove", onMove); interactives.forEach((element) => { element.removeEventListener("pointerenter", enter); element.removeEventListener("pointerleave", leave); }); cleanups.forEach((cleanup) => cleanup()); };
    });

    ScrollTrigger.refresh();
    return () => { mm.revert(); document.documentElement.classList.remove("gsap-ready"); };
  }, { scope: root, dependencies: [pathname], revertOnUpdate: true });

  return <div ref={root} className="motion-root"><div className="route-curtain" aria-hidden="true"><span>BEYOND</span></div><div className="motion-progress" aria-hidden="true"><div className="motion-progress__bar"/></div><div className="motion-cursor" aria-hidden="true"/>{children}</div>;
}
