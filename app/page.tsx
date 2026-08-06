import {
  Button,
  Header,
  Footer,
  HeroSlider,
  ServiceCards,
  Stats,
} from "./components";
import { NumberTicker } from "./components/magicui/number-ticker";
import AppointmentForm from "./appointment-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giving Voice, Strength & Inclusion",
  description: "Beyond Disability Foundation transforms lives across physical, sensory, intellectual and developmental disabilities, with special focus on hearing impairment and cochlear implant support.",
  alternates: { canonical: "/" },
};
const marqueePhrases=["GIVE HOPE","CHANGE A LIFE","EVERY CHILD MATTERS","EMPOWER DREAMS","INCLUSIVE FUTURE","MAKE A DIFFERENCE","SUPPORT ABILITIES","OPEN DOORS","SHARE KINDNESS","BUILD CONFIDENCE","CREATE OPPORTUNITIES","INSPIRE CHANGE","STRENGTHEN FAMILIES","UNLOCK POTENTIAL","DONATE TODAY","BE THE REASON"];
export default function Home() {
  return (
    <>
      <Header active="Home" />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span />
              Hearing. Dignity. Inclusion.
            </p>
            <h1>
              Giving voice to the silent and <em>strength to the vulnerable.</em>
            </h1>
            <p className="lead">
              Welcome to Beyond Disability Foundation. We transform lives
              across physical, sensory, intellectual and developmental
              disabilities, with a special focus on hearing impairment and
              cochlear implant related support.
            </p>
            <div className="actions">
              <Button href="/donate" icon="fa-heart">
                Donate & Change a Life
              </Button>
              <Button
                href="/get-help"
                tone="outline"
                icon="fa-hand-holding-medical">
                Apply for Support
              </Button>
            </div>
            <div className="hero-trust">
              <span>
                <i className="fa-solid fa-shield-heart" /> Registered nonprofit
              </span>
              <span>
                <i className="fa-solid fa-receipt" /> 80G tax benefits
              </span>
            </div>
          </div>
          <HeroSlider />
        </section>
        <Stats />
        <section className="motion-marquee" aria-hidden="true">
          <div className="motion-marquee__track">
            {[...marqueePhrases, ...marqueePhrases].map((phrase, index) => (
              <span key={`${phrase}-${index}`}>
                {phrase}
                <i>✦</i>
              </span>
            ))}
          </div>
        </section>
        <section
          className="impact-map-section"
          aria-labelledby="impact-map-title">
          <h2 id="impact-map-title" className="sr-only">
            The Impact Map
          </h2>
          <img
            src="/impact-map.webp"
            alt="Impact map showing Beyond Disability support zones across Uttar Pradesh and expansion across 75 districts"
            loading="lazy"
            decoding="async"
            width="1478"
            height="1064"
          />
        </section>
        <section className="home-intro" id="impact">
          <div>
            <p className="eyebrow">
              <span />
              Who we are
            </p>
            <h2>Rooted in Kanpur. Driven by compassion. United by inclusion.</h2>
          </div>
          <div>
            <p>
              Our work began with changemakers directly helping children and
              families in local communities. Today, IIT Kanpur alumni,
              academicians, doctors, social workers and Rotary Club members
              work together to bridge the gap between ability and opportunity.
            </p>
            <a href="/about">
              Discover our mission <i className="fa-solid fa-arrow-right" />
            </a>
          </div>
        </section>
        <section className="programs">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span />
                Our programmes
              </p>
              <h2>Support that keeps children connected</h2>
            </div>
            <p>
              We sustain the gift of hearing through cochlear accessories,
              rehabilitation, screening and practical family support, while
              serving children across the wider spectrum of disability.
            </p>
          </div>
          <ServiceCards focus />
        </section>
        <section className="journey">
          <div className="journey-copy">
            <p className="eyebrow">
              <span />
              How support works
            </p>
            <h2>A clear path from need to possibility.</h2>
            <p>
              Families should not have to navigate disability support alone. Our
              team keeps every step transparent and human.
            </p>
            <div className="journey-steps">
              <article>
                <b>
                  <NumberTicker value={1} />
                </b>
                <div>
                  <h3>Tell us what you need</h3>
                  <p>
                    Submit a simple application with the essential documents.
                  </p>
                </div>
              </article>
              <article>
                <b>
                  <NumberTicker value={2} />
                </b>
                <div>
                  <h3>We review together</h3>
                  <p>
                    Our team verifies eligibility and understands the right
                    support.
                  </p>
                </div>
              </article>
              <article>
                <b>
                  <NumberTicker value={3} />
                </b>
                <div>
                  <h3>Support reaches you</h3>
                  <p>
                    Approved aid is coordinated with trusted providers and
                    families.
                  </p>
                </div>
              </article>
            </div>
            <Button href="/get-help" tone="navy" icon="fa-arrow-right">
              Start an application
            </Button>
          </div>
          <div className="impact-panel">
            <span className="impact-icon">
              <i className="fa-solid fa-quote-left" />
            </span>
            <blockquote>
              “The right support does more than solve today&apos;s problem. It
              gives a child confidence, connection and choice for years to
              come.”
            </blockquote>
            <div className="impact-metric">
              <strong>
                <NumberTicker value={75} />
              </strong>
              <span>districts within our growing support network</span>
            </div>
          </div>
        </section>
        <section className="home-cta">
          <div>
            <p className="eyebrow">
              <span />
              Be part of the change
            </p>
            <h2>Your support can keep a child from returning to silence.</h2>
          </div>
          <div className="actions">
            <Button href="/donate" icon="fa-heart">
              Make a secure donation
            </Button>
            <Button href="/partner" tone="outline" icon="fa-handshake">
              Partner with us
            </Button>
          </div>
        </section>
        <section className="appointment-section" id="book-appointment">
          <AppointmentForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
