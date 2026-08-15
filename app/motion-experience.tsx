"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function MotionExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useLayoutEffect(() => {
    if (!root.current) return;
    if (previousPathname.current !== pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      previousPathname.current = pathname;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isAdmin = pathname.startsWith("/admin");
    document.documentElement.classList.add("gsap-ready");
    document.documentElement.classList.toggle("admin-native-scroll", isAdmin);
    if (!reduced) {
      root.current.style.opacity = "0";
      root.current.style.visibility = "hidden";
    }
    if (reduced) return () => {
      document.documentElement.classList.remove("gsap-ready", "admin-native-scroll");
    };

    const lenis = isAdmin ? null : new Lenis({
      autoRaf: true,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.05,
      syncTouch: false,
      anchors: { offset: -84 },
    });
    const bar = root.current.querySelector<HTMLElement>(".motion-progress__bar");
    let frame = 0;
    let disposed = false;
    let destroyMotion: (() => void) | undefined;
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

    const startMotion = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);
      lenis?.on("scroll", ScrollTrigger.update);
      const motionMedia = gsap.matchMedia();
      const context = gsap.context(() => {
        gsap.fromTo(
          root.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.42, ease: "power2.out", clearProps: "opacity,visibility" },
        );
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro.from("header", { y: 32, autoAlpha: 0, duration: 1.5 });

        if (root.current?.querySelector(".hero")) {
          intro
            .from(".hero-copy .eyebrow", { y: 32, autoAlpha: 0, duration: 1.5 }, "<.1")
            .from(".hero-copy h1", { y: 32, autoAlpha: 0, duration: 1.5 }, "<.08")
            .from(".hero-copy .lead", { y: 32, autoAlpha: 0, duration: 1.5 }, "<.18")
            .from(".hero-copy .actions .btn", { y: 32, autoAlpha: 0, stagger: 0.09, duration: 1.5 }, "<.12")
            .from(".hero-trust span", { y: 32, autoAlpha: 0, stagger: 0.08, duration: 1.5 }, "<.08")
            .from(".hero-media", { y: 32, autoAlpha: 0, duration: 1.5 }, "<-.25")
            .from(".hero-impact-card", { y: 32, autoAlpha: 0, duration: 1.5 }, "<.35");
        } else {
          intro
            .from("main > section:first-child h1", { y: 32, autoAlpha: 0, duration: 1.5 }, "<.05")
            .from("main > section:first-child p, main > section:first-child b", { y: 32, autoAlpha: 0, stagger: 0.08, duration: 1.5 }, "<.15");
        }

        ScrollTrigger.batch(
          "main > section:not(.hero) > *, .programs > .section-heading, .programs > .card-grid",
          {
            start: "top 93%",
            once: true,
            onEnter: (elements) => {
              gsap.fromTo(
                elements,
                { y: 32, autoAlpha: 0 },
                {
                  y: 0,
                  autoAlpha: 1,
                  duration: 1.5,
                  stagger: 0.075,
                  ease: "power3.out",
                  clearProps: "transform,opacity,visibility",
                },
              );
              elements.forEach((element) => element.classList.add("motion-revealed"));
            },
          },
        );

        ScrollTrigger.batch(
          ".stat, .service-card, .journey-steps article, .contact-strip > div, .steps article, .timeline article, .partner-benefits > span, .documents > *, .resource-grid > *, details, .donate-box, .admin-kpis article",
          {
            start: "top 94%",
            once: true,
            onEnter: (elements) => {
              gsap.fromTo(
                elements,
                { y: 32, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 1.5, stagger: 0.075, ease: "power3.out", clearProps: "transform,opacity,visibility" },
              );
              elements.forEach((element) => element.classList.add("motion-revealed"));
            },
          },
        );

        gsap.utils.toArray<HTMLElement>(".eyebrow span").forEach((line) => {
          gsap.from(line, {
            autoAlpha: 0,
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: line, start: "top 94%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("main section h2, footer h2").forEach((heading) => {
          gsap.from(heading, {
            y: 24,
            autoAlpha: 0,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: { trigger: heading, start: "top 93%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>(".stat > i, .service-card > i, .steps article > i, .timeline article > i").forEach((icon) => {
          gsap.from(icon, {
            autoAlpha: 0,
            rotate: -14,
            scale: 0.65,
            duration: 0.65,
            ease: "back.out(1.8)",
            scrollTrigger: { trigger: icon, start: "top 95%", once: true },
          });
        });

        gsap.utils.toArray<HTMLImageElement>(".page-hero img, .help-hero img, .problem img, .impact-map-section img").forEach((image) => {
          gsap.from(image, {
            autoAlpha: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: { trigger: image, start: "top 94%", once: true },
          });
          gsap.fromTo(
            image,
            { yPercent: -4, scale: 1.045 },
            {
              yPercent: 4,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: 0.8 },
            },
          );
        });

        if (root.current?.querySelector(".hero")) {
          gsap.to(".hero-copy", {
            yPercent: 7,
            ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 },
          });
          gsap.to(".hero-media img", {
            scale: 1.07,
            ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.9 },
          });
        }

        if (root.current?.querySelector(".impact-panel")) {
          gsap.fromTo(
            ".impact-panel",
            { rotate: -1.5, y: 34, autoAlpha: 0 },
            {
              rotate: 1,
              y: -18,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: { trigger: ".journey", start: "top 88%", end: "bottom 24%", scrub: 0.75 },
            },
          );
        }

        motionMedia.add("(min-width: 981px)", () => {
          const programmeSection = root.current?.querySelector<HTMLElement>(".programs");
          const programmeTrack = programmeSection?.querySelector<HTMLElement>(".card-grid");
          if (!programmeSection || !programmeTrack) return;
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
        });
      }, root);

      ScrollTrigger.refresh();
      destroyMotion = () => {
        lenis?.off("scroll", ScrollTrigger.update);
        motionMedia.revert();
        context.revert();
      };
    };

    void startMotion().catch(() => {
      document.documentElement.classList.remove("motion-enabled");
      if (root.current) {
        root.current.style.removeProperty("opacity");
        root.current.style.removeProperty("visibility");
      }
    });

    return () => {
      disposed = true;
      destroyMotion?.();
      lenis?.destroy();
      removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      root.current?.style.removeProperty("opacity");
      root.current?.style.removeProperty("visibility");
      document.documentElement.classList.remove("gsap-ready", "admin-native-scroll");
    };
  }, [pathname]);

  return <div ref={root} className="motion-root"><div className="motion-progress" aria-hidden="true"><div className="motion-progress__bar"/></div><div key={pathname} className="motion-page">{children}</div></div>;
}
