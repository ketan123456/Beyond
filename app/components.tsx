"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
import { useLanguage, type Lang } from "./i18n";
import { popupError, popupSuccess } from "./sweet-alert";
import SelectControl from "./select-control";
import Image from "next/image";
import { NumberTicker } from "./components/magicui/number-ticker";

export const heroImage = "/beyond-hero.webp";

const heroSlides = [
  {
    src: heroImage,
    alt: "Children learning together with inclusive assistive technology",
  },
  
  {
    src: "/hero-therapy-support.webp",
    alt: "A child taking part in a supportive speech therapy session",
  },
];
export function HeroSlider() {
  return (
    <div className="hero-media">
      <Splide
        className="hero-splide"
        hasTrack={false}
        aria-label="Stories of children supported by Beyond Disability"
        options={{
          type: "fade",
          rewind: true,
          autoplay: true,
          interval: 5200,
          speed: 1300,
          rewindSpeed: 1300,
          pauseOnHover: true,
          pauseOnFocus: true,
          resetProgress: false,
          arrows: true,
          pagination: true,
          lazyLoad: "nearby",
          reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: "pause" },
        }}>
        <SplideTrack>
          {heroSlides.map((slide, index) => (
            <SplideSlide key={slide.src}>
              <div className="wave-slide">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  width={1672}
                  height={941}
                />
              </div>
            </SplideSlide>
          ))}
        </SplideTrack>
        <div className="splide__arrows hero-slider-arrows">
          <button
            className="splide__arrow splide__arrow--prev"
            type="button"
            aria-label="Previous story">
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
          </button>
          <button
            className="splide__arrow splide__arrow--next"
            type="button"
            aria-label="Next story">
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </Splide>
      <div className="hero-impact-card">
        <i className="fa-solid fa-hands-holding-child" />
        <div>
          <b>
            <span className="number-with-icon">
              <NumberTicker value={500} />
              <i className="fa-solid fa-plus" aria-label="plus" />
            </span>
          </b>
          <span>children supported with dignity</span>
        </div>
      </div>
    </div>
  );
}

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link
      href="/"
      className={`logo ${onDark ? "logo--on-dark" : "logo--on-light"}`}
      data-no-translate
      aria-label="Beyond Disability home">
      <Image
        className="logo-image"
        src={onDark ? "/logo1.jpeg" : "/logo1.jpeg"}
        alt="Beyond Disability Foundation"
        width={512}
        height={onDark ? 258 : 307}
        priority={!onDark}
        sizes="(max-width: 600px) 140px, 180px"
      />
    </Link>
  );
}

export function Header({ active = "" }: { active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { language, languages, setLanguage } = useLanguage();
  const languageOptions = languages.map((item) => ({ value: item.locale, label: item.native_name }));
  const links = [
    ["Home", "/", "fa-house"],
    ["About Us", "/about", "fa-circle-info"],
    ["Get Help", "/get-help", "fa-hand-holding-medical"],
    ["Our Impact", "/#impact-map", "fa-chart-line"],
    ["Partner With Us", "/partner", "fa-handshake"],
    ["Resources", "/resources", "fa-book-open"],
  ];
  useEffect(() => {
    if (pathname !== "/") return;
    if (window.sessionStorage.getItem("scroll-to-impact") !== "true") return;
    window.scrollTo({ top: 0, behavior: "auto" });
    let attempts = 0;
    const timer = window.setInterval(() => {
      const target = document.getElementById("impact-map");
      attempts += 1;
      if (!target && attempts < 30) return;
      window.clearInterval(timer);
      if (!target) return;
      window.sessionStorage.removeItem("scroll-to-impact");
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [pathname]);
  return (
    <header>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="topbar">
        <div>
          <span>
            <i className="fa-solid fa-phone" /> +91 80000 12345
          </span>
          <span>
            <i className="fa-solid fa-envelope" /> info@beyonddisability.org
          </span>
          <span className="topbar-message">
            -Giving Voice to the Silent, Strength to the Vulnerable, and
            Inclusion to Everyone
          </span>
        </div>
      </div>
      <div className="nav">
        <Logo />
        <Link className="mobile-donate" href="/donate" aria-label="Donate now">
          <i className="fa-solid fa-heart" aria-hidden="true" />
          <span>Donate</span>
        </Link>
        <div className="mobile-language" data-no-translate>
          <i className="fa-solid fa-globe" aria-hidden="true" />
          <SelectControl
            instanceId="mobile-language"
            className="mobile-language-select"
            value={language}
            options={languageOptions}
            onChange={(value) => setLanguage(value as Lang)}
          />
        </div>
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}>
          <i
            className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}
            aria-hidden="true"
          />
        </button>
        <nav className={menuOpen ? "open" : ""} aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link
              className={active === label ? "active" : ""}
              href={href}
              key={label}
              onClick={(event) => {
                setMenuOpen(false);
                if (href !== "/#impact-map") return;
                event.preventDefault();
                if (pathname !== "/") {
                  window.sessionStorage.setItem("scroll-to-impact", "true");
                  router.push("/", { scroll: false });
                  return;
                }
                window.history.replaceState(null, "", "/#impact-map");
                document.getElementById("impact-map")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <div data-no-translate>
            <SelectControl
              instanceId="desktop-language"
              className="language"
              value={language}
              options={languageOptions}
              onChange={(value) => setLanguage(value as Lang)}
            />
          </div>
          <Link className="btn btn-gold compact" href="/donate">
            <i className="fa-solid fa-heart" aria-hidden="true" />
            Donate
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Button({
  href,
  children,
  tone = "gold",
  icon,
}: {
  href: string;
  children: ReactNode;
  tone?: "gold" | "navy" | "outline" | "green";
  icon?: string;
}) {
  return (
    <Link href={href} className={`btn btn-${tone}`}>
      {icon && <i className={`fa-solid ${icon}`} aria-hidden="true" />}
      <span>{children}</span>
    </Link>
  );
}

export function ExpandableText({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const copyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;
    const measure = () => setOverflowing(copy.scrollHeight > copy.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(copy);
    return () => observer.disconnect();
  }, [children]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return <>
    <p ref={copyRef} className="clamped-copy">{children}</p>
    {overflowing && <button className="content-read-more" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog">
      Read more <i className="fa-solid fa-arrow-right" aria-hidden="true" />
    </button>}
    {open && createPortal(
      <div className="content-modal-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
        <section className="content-modal" role="dialog" aria-modal="true" aria-labelledby="content-modal-title" onMouseDown={(event) => event.stopPropagation()}>
          <button className="content-modal-close" type="button" aria-label="Close" onClick={() => setOpen(false)}><i className="fa-solid fa-xmark" /></button>
          <p className="eyebrow"><span />Beyond Disability Foundation</p>
          <h2 id="content-modal-title">{title}</h2>
          <div className="content-modal-copy">{children}</div>
        </section>
      </div>,
      document.body,
    )}
  </>;
}

export function Stats() {
  return (
    <div className="stats impact-stats">
      <Stat
        icon="fa-child-reaching"
        value={
          <span className="number-with-icon">
            <NumberTicker value={500} />+
          </span>
        }
        label="Kids Supported"
      />
      <Stat
        icon="fa-location-dot"
        value={
          <span className="number-with-icon">
            <NumberTicker value={75} />
          </span>
        }
        label="Districts (U.P.)"
      />
      <Stat
        icon="fa-city"
        value={
          <span className="number-with-icon">
            <NumberTicker value={10} />+
          </span>
        }
        label="Impact Zones"
      />
      <Stat icon="fa-people-group" value="Thousands" label="Lives Touched" />
    </div>
  );
}
function Stat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: ReactNode;
  label: string;
}) {
  return (
    <div className="stat">
      <i className={`fa-solid ${icon}`} />
      <div className="stat-copy">
        <b>{value}</b>
        <span>{label}</span>
      </div>
    </div>
  );
}

export const services = [
  {
    icon: "fa-ear-listen",
    title: "Cochlear Implant Support",
    text: "Financial assistance for costly external accessories, repairs and replacements so children do not slip back into silence.",
  },
  {
    icon: "fa-comments",
    title: "Therapy & Rehabilitation",
    text: "Speech-language therapy and auditory training that help children process sound, communicate clearly and participate fully.",
  },
  {
    icon: "fa-baby",
    title: "Newborn Hearing Screening",
    text: "Early screening and diagnostic support so hearing loss can be identified during the most important developmental years.",
  },
];

export function ServiceCards({ focus = false }: { focus?: boolean }) {
  const data = focus
    ? [
        {
          icon: "fa-ear-deaf",
          title: "Hearing Support",
          text: "Cochlear accessories, rehabilitation, early screening and family guidance for children with hearing loss.",
        },
        {
          icon: "fa-eye-low-vision",
          title: "Accessible Learning",
          text: "Assistive gadgets and adaptive learning tools for blind children and learners with intellectual disabilities.",
        },
        {
          icon: "fa-brain",
          title: "Mobility & Inclusion",
          text: "School transport and individualized support for children with physical, sensory and developmental disabilities.",
        },
      ]
    : services;
  return (
    <div className="card-grid">
      {data.map((x) => (
        <article className="service-card" key={x.title}>
          <i className={`fa-solid ${x.icon}`} />
          <div>
            <h3>{x.title}</h3>
            <ExpandableText title={x.title}>{x.text}</ExpandableText>
          </div>
        </article>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="footer-banner">
        <div>
          <p>Need guidance?</p>
          <h2>Our team is here to listen.</h2>
        </div>
        <Button href="/get-help" tone="outline" icon="fa-arrow-right">
          Get support
        </Button>
      </div>
      <div className="footer-grid">
        <div className="footer-brand">
          <Logo onDark />
          <p>
            Giving voice to the silent, strength to the vulnerable, and inclusion
            to everyone—with a special focus on children with hearing loss.
          </p>
          <div className="social">
            <a href="tel:+918000012345" aria-label="Call us">
              <i className="fa-solid fa-phone" />
            </a>
            <a href="mailto:info@beyonddisability.org" aria-label="Email us">
              <i className="fa-solid fa-envelope" />
            </a>
            <a
              href="https://wa.me/918000012345"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp us">
              <i className="fa-brands fa-whatsapp" />
            </a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/about">About our work</Link>
          <Link href="/get-help">Get support</Link>
          <Link href="/#impact-map">Our impact</Link>
          <Link href="/partner">CSR partnerships</Link>
        </div>
        <div>
          <h4>Programmes</h4>
          <Link href="/about#services">Hearing support</Link>
          <Link href="/about#services">Digital access</Link>
          <Link href="/about#services">Therapy assistance</Link>
          <Link href="/resources">Resources</Link>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <a href="tel:+918000012345">
            <i className="fa-solid fa-phone" />
            <span>
              +91 80000 12345<small>Mon–Sat, 9:00–18:00</small>
            </span>
          </a>
          <a href="mailto:info@beyonddisability.org">
            <i className="fa-solid fa-envelope" />
            <span>info@beyonddisability.org</span>
          </a>
          <span>
            <i className="fa-solid fa-location-dot" /> Kanpur, Uttar Pradesh
          </span>
        </div>
      </div>
      <div className="copyright">
        <span>© 2026 Beyond Disability Foundation</span>
        <span>
          <Link href="/resources#privacy">Privacy</Link> ·{" "}
          <Link href="/resources#reports">Transparency</Link>
        </span>
      </div>
    </footer>
  );
}

export function PageShell({
  children,
  active,
}: {
  children: ReactNode;
  active?: string;
}) {
  return (
    <>
      <Header active={active} />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}

export function InteriorHero({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  image?: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`interior-hero interior-hero--plain ${className}`}>
      <div className="interior-hero__content">
        <p className="eyebrow"><span />{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        {children && <div className="actions">{children}</div>}
      </div>
    </section>
  );
}

export function ApplyForm() {
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("Cochlear Life-Support");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    if (!district || !category) {
      await popupError("Select support details", "Choose your district and the support you need.");
      return;
    }
    setStatus("Submitting…");
    setSubmitting(true);
    const form = e.currentTarget;
    try {
      const formData = new FormData(form);
      const uploads = ["udid", "income"].map((name) => formData.get(name));
      if (uploads.some((file) => !(file instanceof File) || !file.size)) {
        setStatus("");
        await popupError("Documents required", "Please upload both required documents.");
        return;
      }
      if (uploads.some((file) => file instanceof File && file.size > 8 * 1024 * 1024)) {
        setStatus("");
        await popupError("File too large", "Each document must be smaller than 8 MB.");
        return;
      }
      const res = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });
      const responseText = await res.text();
      let data: { reference?: string; error?: string } = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data.error =
          res.status === 413
            ? "The uploaded documents are too large. Please choose smaller files."
            : "The server could not process the application. Please try again.";
      }
      if (!res.ok) {
        const message =
          data.error ||
          `We could not submit the application (error ${res.status}). Please try again.`;
        setStatus("");
        await popupError("Application not submitted", message);
        return;
      }
      form.reset();
      setDistrict("");
      setCategory("Cochlear Life-Support");
      setStatus("");
      await popupSuccess(
        "Application submitted",
        `Your application was received successfully. Reference: ${data.reference}`,
      );
    } catch (error) {
      const message =
        error instanceof TypeError
          ? "The application service could not be reached. Please try again."
          : "We could not submit the application. Please try again.";
      setStatus("");
      await popupError("Application not submitted", message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form className="apply-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Child / Applicant name
          <input name="name" required />
        </label>
        <label>
          Mobile number
          <input name="phone" inputMode="tel" required />
        </label>
        <label>
          District
          <SelectControl instanceId="aid-district" name="district" value={district} onChange={setDistrict} placeholder="Select district" options={["Kanpur Nagar","Lucknow","Prayagraj","Varanasi","Other U.P. district"].map(value=>({value,label:value}))}/>
        </label>
        <label>
          Support needed
          <SelectControl instanceId="aid-category" name="category" value={category} onChange={setCategory} options={["Cochlear Life-Support","Digital Empowerment","Therapeutic Aid"].map(value=>({value,label:value}))}/>
        </label>
        <label className="wide">
          Tell us what support is needed
          <textarea name="details" rows={3} />
        </label>
        <label>
          UDID Card
          <input
            type="file"
            name="udid"
            accept=".pdf"
            required
          />
        </label>
        <label>
          Income Certificate
          <input
            type="file"
            name="income"
            accept=".pdf"
            required
          />
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" name="confirmation" value="confirmed" role="switch" required />
        <span className="consent-switch" aria-hidden="true">
          <span />
          <i className="fa-solid fa-check" />
        </span>
        <span className="consent-copy">
          <b>I confirm that the information provided is correct.</b>
          <small>Please review your details and uploaded documents before submitting.</small>
        </span>
      </label>
      <button className="btn btn-gold" type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit Application / आवेदन जमा करें"}
      </button>
      <p role="status" className="form-status">
        {status}
      </p>
    </form>
  );
}

export function PartnerForm() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setStatus("Sending…");
    setSubmitting(true);
    const form = e.currentTarget;
    try {
      const payload = Object.fromEntries(new FormData(form));
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(
          data.error ||
            "We could not send your enquiry. Please email csr@beyonddisability.org.",
        );
      }
      form.reset();
      setStatus("");
      await popupSuccess(
        "CSR enquiry sent",
        "Thank you. Our CSR team will contact you within two working days.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not send your enquiry. Please try again.";
      setStatus("");
      await popupError("Enquiry not sent", message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form className="apply-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Company / Organisation
          <input name="company" required />
        </label>
        <label>
          Contact person
          <input name="contactName" required />
        </label>
        <label>
          Email address
          <input name="email" type="email" required />
        </label>
        <label>
          Phone number
          <input name="phone" type="tel" required />
        </label>
        <label className="wide">
          How would you like to partner?
          <textarea name="message" rows={4} required />
        </label>
      </div>
      <button className="btn btn-gold" type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Send CSR Enquiry"}
      </button>
      <p className="form-status" role="status">
        {status}
      </p>
    </form>
  );
}
