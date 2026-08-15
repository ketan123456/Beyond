import type { Metadata } from "next";
import { Button, ExpandableText, Footer, Header, HeroSlider } from "./components";

export const metadata: Metadata = {
  title: "Giving Voice, Strength & Inclusion",
  description:
    "Beyond Disability Foundation provides continuity support, rehabilitation, accessible learning and family guidance for children and people with disabilities.",
  alternates: { canonical: "/" },
};

const programmes = [
  {
    icon: "fa-person-walking-arrow-right",
    title:
      "Helping Children Continue Their Journey Towards Communication and Independence",
    text: "Helping Children Continue Their Journey Towards Communication and Independence means supporting children in developing essential communication, social, and everyday life skills. Through guidance, education, therapy, and encouragement, children can build confidence, express their needs, interact with others, and gradually become more independent in their daily activities. The goal is to create a supportive environment where every child can learn, grow, and reach their full potential.",
  },
  {
    icon: "fa-ear-listen",
    title: "Cochlear Implant Continuity",
    text: "Support for essential accessories, maintenance and the continuing care needed after the first intervention.",
  },
  {
    icon: "fa-comments",
    title: "Therapy & Rehabilitation",
    text: "Speech, auditory and rehabilitation support that helps turn access into communication and participation.",
  },
  {
    icon: "fa-baby",
    title: "Early Hearing Screening",
    text: "Early assessment and guidance so families can understand the need and take the next step without delay.",
  },
  {
    icon: "fa-universal-access",
    title: "Broader Disability Inclusion",
    text: "Practical support for physical, sensory, intellectual and developmental disability-related requirements.",
  },
  {
    icon: "fa-people-roof",
    title: "Family Guidance",
    text: "Respectful guidance that helps families understand available support, eligibility and the continuing journey.",
  },
];

export default function Home() {
  return (
    <>
      <Header active="Home" />
      <main id="main-content">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span />
              Hearing. Dignity. Inclusion.
            </p>
            <h1>
              Giving voice. Building strength. <em>Creating inclusion.</em>
            </h1>
            <p className="lead">
              Welcome to Beyond Disability Foundation. We transform lives across
              physical, sensory, intellectual and developmental disabilities,
              with special focus on hearing impairment and cochlear implant
              related support.
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
          </div>
          <HeroSlider />
        </section>

        <aside className="home-credibility" aria-label="Foundation credentials">
          <span>
            <i className="fa-solid fa-building-shield" />
            Registered NGO
          </span>
          <span>
            <i className="fa-solid fa-certificate" />
            12A &amp; 80G
          </span>
          <span>
            <i className="fa-solid fa-handshake" />
            CSR-1 Registered
          </span>
          <span>
            <i className="fa-solid fa-file-circle-check" />
            Audited Annually
          </span>
        </aside>

        <section className="home-story home-story--beginning">
          <div className="home-story__heading">
            <p className="eyebrow">
              <span />
              The continuing journey
            </p>
            <h2>The First Intervention Is Only the Beginning</h2>
          </div>
          <div className="home-story__copy">
            <p>
              A cochlear implant, hearing device or mobility aid can open a new
              world—but it is only the beginning. Continued progress often
              requires accessories, maintenance, therapy, family guidance and
              accessible education.
            </p>
            <p>
              For many families, these recurring costs become difficult to
              manage. When continuing support is interrupted, a child’s progress
              in communication, learning and confidence may also slow down.
            </p>
            <Button href="/about" tone="navy" icon="fa-arrow-right">
              Discover Our Story
            </Button>
          </div>
        </section>

        <section className="home-story home-story--response">
          <div className="home-story__visual" aria-hidden="true">
            <i className="fa-solid fa-hands-holding-child" />
            <span>Access</span>
            <b>→</b>
            <span>Continuity</span>
            <b>→</b>
            <span>Independence</span>
          </div>
          <div className="home-story__copy">
            <p className="eyebrow">
              <span />
              Why we exist
            </p>
            <h2>We Step in Where Support Often Stops</h2>
            <p>
              Beyond Disability was founded on a simple belief: no child’s
              progress should stop because their family cannot afford the next
              stage of support.
            </p>
            <p>
              A cochlear implant, hearing device or mobility aid may begin a
              life-changing journey, but lasting progress requires continued
              access to accessories, maintenance, therapy, rehabilitation,
              family guidance and inclusive education.
            </p>
            <p>
              By bridging gaps in accessories, maintenance, therapy,
              rehabilitation, family guidance and inclusive education, we help
              people move from access to communication, from learning to
              participation, and towards greater confidence and independence.
            </p>
            <Button href="/about" tone="outline" icon="fa-arrow-right">
              Discover Our Story
            </Button>
          </div>
        </section>

        <section className="home-accountability">
          <div>
            <p className="eyebrow">
              <span />
              Trust and transparency
            </p>
            <h2>Compassion Guided by Accountability</h2>
            <p>
              Every contribution represents someone’s trust and someone else’s
              hope. We are committed to responsible governance, transparent use
              of donations and respectful, consent-based support.
            </p>
            <p>
              Our legal credentials, audited financials, annual reports and
              policies are available for supporters, families and partners to
              review.
            </p>
            <Button href="/transparency" icon="fa-file-shield">
              View Our Transparency
            </Button>
          </div>
          <div
            className="home-accountability__checks"
            aria-label="Accountability commitments">
            <span>
              <i className="fa-solid fa-scale-balanced" />
              Responsible governance
            </span>
            <span>
              <i className="fa-solid fa-magnifying-glass-chart" />
              Transparent use of funds
            </span>
            <span>
              <i className="fa-solid fa-user-shield" />
              Consent-based support
            </span>
            <span>
              <i className="fa-solid fa-clipboard-check" />
              Annual review
            </span>
          </div>
        </section>

        <section id="impact-map" className="home-impact">
          <div className="home-impact__copy">
            <p className="eyebrow">
              <span />
              Our impact
            </p>
            <h2>Real Support. Meaningful Change.</h2>
            <p>
              Our impact is reflected not only in numbers, but in everyday
              milestones—a child responding to sound, a student participating in
              class, or a family finding the confidence to move forward.
            </p>
            <p>
              Through assistive support, rehabilitation, screening, accessible
              learning and family guidance, we help people continue their
              journey towards inclusion and independence.
            </p>
            <Button href="/impact" tone="navy" icon="fa-chart-line">
              See Our Impact
            </Button>
          </div>
          <figure className="home-impact__map">
            <img
              src="/impact-map.webp"
              alt="Map showing Beyond Disability Foundation support across Uttar Pradesh"
              loading="lazy"
              decoding="async"
              width="1478"
              height="1064"
            />
          </figure>
        </section>

        <section className="home-programmes">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span />
                Our programmes
              </p>
              <h2>Support for Every Stage of the Journey</h2>
            </div>
            <p>
              Helping children continue their journey towards communication and
              independence through practical, person-centred support.
            </p>
          </div>
          <div className="home-programmes__grid">
            {programmes.map((programme) => (
              <article key={programme.title}>
                <i
                  className={`fa-solid ${programme.icon}`}
                  aria-hidden="true"
                />
                <h3>{programme.title}</h3>
                <ExpandableText title={programme.title}>
                  {programme.text}
                </ExpandableText>
              </article>
            ))}
          </div>
          <Button href="/programmes" tone="navy" icon="fa-arrow-right">
            Explore All Programmes
          </Button>
        </section>

        <section className="home-contribute">
          <div>
            <p className="eyebrow">
              <span />
              Be part of the journey
            </p>
            <h2>Everyone Has Something Valuable to Give</h2>
          </div>
          <div className="home-contribute__copy">
            <p>
              Creating an inclusive society requires more than financial
              support. You can contribute your time, professional expertise,
              technology, medical knowledge, networks or institutional
              resources.
            </p>
            <p>
              A device may provide access, but continued support turns that
              access into communication, education, confidence and independence.
            </p>
            <p>
              Whether you are an individual, volunteer, healthcare professional,
              technology company or CSR partner, there is a meaningful role for
              you at Beyond Disability.
            </p>
            <p>
              Your donation, time, expertise or partnership can help ensure that
              financial or practical barriers do not interrupt someone’s
              progress.
            </p>
            <div className="actions">
              <Button href="/donate" icon="fa-heart">
                Donate
              </Button>
              <Button
                href="/volunteer"
                tone="outline"
                icon="fa-hand-holding-heart">
                Volunteer
              </Button>
              <Button href="/partner" tone="outline" icon="fa-handshake">
                Partner With Us
              </Button>
            </div>
          </div>
        </section>

        <section className="home-guidance">
          <div className="home-guidance__icon">
            <i className="fa-solid fa-compass" />
          </div>
          <div>
            <p className="eyebrow">
              <span />
              Guidance for families
            </p>
            <h2>You Don’t Have to Navigate This Journey Alone</h2>
            <p>
              If your child needs support with cochlear implant accessories,
              hearing rehabilitation, speech therapy, early hearing assessment
              or another disability-related requirement, Beyond Disability is
              here to guide you.
            </p>
            <p>
              Tell us about your needs, and our team will review your request,
              explain the available support and help you understand the next
              steps. Assistance is provided according to programme eligibility,
              available resources and the urgency of each case.
            </p>
            <Button href="/get-help#apply" tone="navy" icon="fa-file-pen">
              Apply for Support
            </Button>
            <small>
              <i className="fa-solid fa-lock" />
              All information shared with us is treated with dignity and
              confidentiality.
            </small>
          </div>
        </section>

        <section className="home-cta home-cta--final">
          <div>
            <p className="eyebrow">
              <span />
              Keep progress moving
            </p>
            <h2>Help Keep Someone’s Journey Moving</h2>
            <p>
              Your donation, time, expertise or partnership can help turn access
              into communication, education and greater independence.
            </p>
          </div>
          <div className="actions">
            <Button href="/donate" icon="fa-heart">
              Donate Now
            </Button>
            <Button
              href="/volunteer"
              tone="outline"
              icon="fa-hand-holding-heart">
              Volunteer
            </Button>
            <Button href="/partner" tone="outline" icon="fa-handshake">
              Partner With Us
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
