"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
import { useLanguage, type Lang } from "./i18n";

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
          <b>500+</b>
          <span>children supported with dignity</span>
        </div>
      </div>
    </div>
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="logo"
      data-no-translate
      aria-label="Beyond Disability home">
      <i className="fa-solid fa-infinity" />
      <span>
        <b>BEYOND</b>
        <small>DISABILITY FOUNDATION</small>
      </span>
    </Link>
  );
}

export function Header({ active = "" }: { active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, languages, setLanguage } = useLanguage();
  const links = [
    ["Home", "/", "fa-house"],
    ["About Us", "/about", "fa-circle-info"],
    ["Get Help", "/get-help", "fa-hand-holding-medical"],
    ["Our Impact", "/#impact", "fa-chart-line"],
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
        <label className="mobile-language" data-no-translate>
          <i className="fa-solid fa-globe" aria-hidden="true" />
          <span aria-hidden="true">{language.toUpperCase()}</span>
          <i className="fa-solid fa-chevron-down" aria-hidden="true" />
          <select
            aria-label="Select language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Lang)}>
            {languages.map((item) => (
              <option value={item.locale} key={item.locale}>
                {item.native_name}
              </option>
            ))}
          </select>
        </label>
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
          <select
            className="language"
            aria-label="Select language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Lang)}>
            {languages.map((item) => (
              <option value={item.locale} key={item.locale}>
                {item.native_name}
              </option>
            ))}
          </select>
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
      <Stat icon="fa-child-reaching" value="500+" label="Kids Supported" />
      <Stat icon="fa-location-dot" value="75" label="Districts (U.P.)" />
      <Stat icon="fa-city" value="10+" label="Impact Zones" />
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
  value: string;
  label: string;
}) {
  return (
    <div className="stat">
      <i className={`fa-solid ${icon}`} />
      <div>
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
          <Logo />
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
          <Link href="/#impact">Our impact</Link>
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

export function ApplyForm() {
  const [status, setStatus] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Submitting…");
    const form = e.currentTarget;
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        body: new FormData(form),
      });
      const data = (await res.json()) as { reference?: string; error?: string };
      if (!res.ok) {
        setStatus(data.error || "Please check the details and try again.");
        return;
      }
      form.reset();
      setStatus(
        `Application received successfully. Reference: ${data.reference}`,
      );
    } catch {
      setStatus("Network error. Please check your connection and try again.");
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
          <select name="district" required>
            <option value="">Select district</option>
            <option>Kanpur Nagar</option>
            <option>Lucknow</option>
            <option>Prayagraj</option>
            <option>Varanasi</option>
            <option>Other U.P. district</option>
          </select>
        </label>
        <label>
          Support needed
          <select name="category" required>
            <option>Cochlear Life-Support</option>
            <option>Digital Empowerment</option>
            <option>Therapeutic Aid</option>
          </select>
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
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />
        </label>
        <label>
          Income Certificate
          <input
            type="file"
            name="income"
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" required /> I confirm that the information
        provided is correct.
      </label>
      <button className="btn btn-gold" type="submit">
        Submit Application / आवेदन जमा करें
      </button>
      <p role="status" className="form-status">
        {status}
      </p>
    </form>
  );
}

export function PartnerForm() {
  const [status, setStatus] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending…");
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    const res = await fetch("/api/partners", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      form.reset();
      setStatus(
        "Thank you. Our CSR team will contact you within two working days.",
      );
    } else
      setStatus(
        "We could not send your enquiry. Please email csr@beyonddisability.org.",
      );
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
      <button className="btn btn-gold" type="submit">
        Send CSR Enquiry
      </button>
      <p className="form-status" role="status">
        {status}
      </p>
    </form>
  );
}
