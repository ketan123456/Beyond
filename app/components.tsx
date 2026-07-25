"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
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
    src: "/hero-inclusive-learning.webp",
    alt: "A visually impaired student learning with accessible digital technology",
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
        src={onDark ? "/logo-light.png" : "/logo.png"}
        alt="Beyond Disability Foundation"
        width={150}
        height={1024}
        priority={!onDark}
        sizes="(max-width: 600px) 140px, 180px"
      />
    </Link>
  );
}

export function Header({ active = "" }: { active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, languages, setLanguage } = useLanguage();
  const languageOptions = languages.map((item) => ({ value: item.locale, label: item.native_name }));
  const links = [
    ["Home", "/", "fa-house"],
    ["About Us", "/about", "fa-circle-info"],
    ["Get Help", "/get-help", "fa-hand-holding-medical"],
    ["Our Impact", "/#impact-map-title", "fa-chart-line"],
    ["Partner With Us", "/partner", "fa-handshake"],
    ["Resources", "/resources", "fa-book-open"],
  ];
  return (
    <header>
      <div className="topbar">
        <div>
          <span>
            <i className="fa-solid fa-phone" /> +91 80000 12345
          </span>
          <span>
            <i className="fa-solid fa-envelope" /> info@beyonddisability.org
          </span>
          <span className="topbar-message">
            Building an inclusive Uttar Pradesh, one family at a time.
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
              onClick={() => setMenuOpen(false)}>
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

export function Stats() {
  return (
    <div className="stats">
      <Stat
        icon="fa-child-reaching"
        value={
          <span className="number-with-icon">
            <NumberTicker value={500} />
            <i className="fa-solid fa-plus" aria-label="plus" />
          </span>
        }
        label="Kids Supported"
      />
      <Stat icon="fa-location-dot" value={<NumberTicker value={75} />} label="Districts (U.P.)" />
      <Stat
        icon="fa-city"
        value={
          <span className="number-with-icon">
            <NumberTicker value={10} />
            <i className="fa-solid fa-plus" aria-label="plus" />
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
      <div style={{display:"block"}}>
        <b>{value}</b>
        <span>{label}</span>
      </div>
    </div>
  );
}

export const services = [
  {
    icon: "fa-ear-listen",
    title: "Cochlear Life-Support",
    text: "Providing critical external parts—cables, batteries and coils—to ensure the Gift of Hearing never fades.",
  },
  {
    icon: "fa-laptop",
    title: "Digital Empowerment",
    text: "Equipping blind students with smartphones and laptops to unlock modern education.",
  },
  {
    icon: "fa-hand-holding-heart",
    title: "Therapeutic Aid",
    text: "Financial grants for specialized Autism, Speech and OT therapy for early intervention.",
  },
];

export function ServiceCards({ focus = false }: { focus?: boolean }) {
  const data = focus
    ? [
        {
          icon: "fa-ear-deaf",
          title: "Deaf & Mute",
          text: "Empowering hearing-impaired children through cochlear support, therapy & education.",
        },
        {
          icon: "fa-eye-low-vision",
          title: "Blind",
          text: "Enabling visually impaired students with assistive technology & resources.",
        },
        {
          icon: "fa-brain",
          title: "Mentally Challenged",
          text: "Supporting children with autism and other cognitive challenges through therapy & care.",
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
            <p>{x.text}</p>
            <Link href="/get-help">Learn More →</Link>
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
            Removing barriers and creating pathways to independence for children
            with disabilities and their families.
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
          <Link href="/#impact-map-title">Our impact</Link>
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
      <main>{children}</main>
      <Footer />
    </>
  );
}

export function InteriorHero({
  image,
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`interior-hero ${className}`}>
      <img
        src={image}
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        fetchPriority="high"
      />
      <div className="interior-hero__shade" />
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
