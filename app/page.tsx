import {Button,Header,Footer,HeroSlider,ServiceCards,Stats} from "./components";
import AppointmentForm from "./appointment-form";
<<<<<<< Updated upstream
export default function Home(){return <><Header active="Home"/><main>
<section className="hero"><div className="hero-copy"><p className="eyebrow"><span/>Inclusive care. Lasting independence.</p><h1>Every child deserves the tools to <em>thrive.</em></h1><p className="lead">We connect children with disabilities across Uttar Pradesh to assistive technology, therapy, education and family support.</p><div className="actions"><Button href="/donate" icon="fa-heart">Donate & Change a Life</Button><Button href="/get-help" tone="outline" icon="fa-hand-holding-medical">Apply for Support</Button></div><div className="hero-trust"><span><i className="fa-solid fa-shield-heart"/> Registered nonprofit</span><span><i className="fa-solid fa-receipt"/> 80G tax benefits</span></div></div><HeroSlider/></section>
<Stats/>
<section className="motion-marquee" aria-hidden="true"><div className="motion-marquee__track"><span>ACCESS</span><i>✦</i><span>DIGNITY</span><i>✦</i><span>INDEPENDENCE</span><i>✦</i><span>INCLUSION</span><i>✦</i><span>EMPOWERMENT</span><i>✦</i><span>CARE</span><i>✦</i><span>OPPORTUNITY</span><i>✦</i><span>BELONGING</span><i>✦</i><span>ACCESS</span><i>✦</i><span>DIGNITY</span><i>✦</i><span>INDEPENDENCE</span><i>✦</i><span>INCLUSION</span><i>✦</i><span>EMPOWERMENT</span><i>✦</i><span>CARE</span><i>✦</i><span>OPPORTUNITY</span><i>✦</i><span>BELONGING</span><i>✦</i></div></section>
<section className="impact-map-section" aria-labelledby="impact-map-title"><h2 id="impact-map-title" className="sr-only">The Impact Map</h2><img src="/impact-map.webp" alt="Impact map showing Beyond Disability support zones across Uttar Pradesh and expansion across 75 districts" loading="lazy" decoding="async" width="1478" height="1064"/></section>
<section className="home-intro" id="impact"><div><p className="eyebrow"><span/>What we believe</p><h2>Disability should never decide a child&apos;s future.</h2></div><div><p>Beyond Disability Foundation removes the practical barriers that stand between children and a more independent life. We work alongside families, specialists and community partners to make essential support reachable, understandable and sustainable.</p><a href="/about">Discover our mission <i className="fa-solid fa-arrow-right"/></a></div></section>
<section className="programs"><div className="section-heading"><div><p className="eyebrow"><span/>Our programmes</p><h2>Support designed around real lives</h2></div><p>From first assessment to ongoing care, every programme responds to a clear need and measurable outcome.</p></div><ServiceCards focus/></section>
<section className="journey"><div className="journey-copy"><p className="eyebrow"><span/>How support works</p><h2>A clear path from need to possibility.</h2><p>Families should not have to navigate disability support alone. Our team keeps every step transparent and human.</p><div className="journey-steps"><article><b>01</b><div><h3>Tell us what you need</h3><p>Submit a simple application with the essential documents.</p></div></article><article><b>02</b><div><h3>We review together</h3><p>Our team verifies eligibility and understands the right support.</p></div></article><article><b>03</b><div><h3>Support reaches you</h3><p>Approved aid is coordinated with trusted providers and families.</p></div></article></div><Button href="/get-help" tone="navy" icon="fa-arrow-right">Start an application</Button></div><div className="impact-panel"><span className="impact-icon"><i className="fa-solid fa-quote-left"/></span><blockquote>“The right support does more than solve today&apos;s problem. It gives a child confidence, connection and choice for years to come.”</blockquote><div className="impact-metric"><b>75</b><span>districts within our growing support network</span></div></div></section>
<section className="home-cta"><div><p className="eyebrow"><span/>Be part of the change</p><h2>One generous decision can open a lifetime of possibilities.</h2></div><div className="actions"><Button href="/donate" icon="fa-heart">Make a secure donation</Button><Button href="/partner" tone="outline" icon="fa-handshake">Partner with us</Button></div></section>
<section className="appointment-section" id="book-appointment"><AppointmentForm/></section>
</main><Footer/></>}
=======
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
              with a special focus on hearing impairment and cochlear implant
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
          id="impact-map"
          className="impact-map-section"
          aria-labelledby="impact-map-title">
          <h2 id="impact-map-title" className="sr-only">
            The Impact Map
          </h2>
          <img
            src="/impact-map.webp"
            alt="Impact map showing Beyond Disability support across Uttar Pradesh"
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
            <h2>
              Rooted in Kanpur. Driven by compassion. United by inclusion.
            </h2>
          </div>
          <div>
            <p>
              Our work began with changemakers directly helping children and
              families in local communities. Today, IIT Kanpur alumni,
              academicians, doctors, social workers and Rotary Club members work
              together to bridge the gap between ability and opportunity.
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
                <NumberTicker value={6} />
              </strong>
              <span>months: the target for beginning early intervention</span>
            </div>
          </div>
        </section>
        <section className="donation-pathway" aria-labelledby="donation-pathway-title">
          <div className="section-title">
            <p className="eyebrow"><span />Why your donation matters</p>
            <h2 id="donation-pathway-title">A cochlear implant is only the beginning</h2>
            <p>When an external processor, cable, battery or coil fails, a child can lose access to sound again. Your donation helps families protect the progress made after surgery.</p>
          </div>
          <div className="donation-pathway__steps">
            <article><span>01</span><i className="fa-solid fa-ear-listen"/><h3>A child needs continued hearing</h3><p>Surgery creates access to sound, but equipment and rehabilitation require ongoing support.</p></article>
            <article><span>02</span><i className="fa-solid fa-hand-holding-heart"/><h3>Your donation funds the gap</h3><p>Contributions help provide accessories, repairs, speech therapy and auditory training.</p></article>
            <article><span>03</span><i className="fa-solid fa-comments"/><h3>Support becomes communication</h3><p>Consistent hearing helps a child develop language, participate in school and connect with family.</p></article>
          </div>
          <div className="donation-pathway__action"><p><strong>80G Certified</strong> for eligible tax benefits. CSR eligible under Schedule VII.</p><Button href="/donate" icon="fa-heart">Help a child stay connected to sound</Button></div>
        </section>
        <section className="home-cta">
          <div>
            <p className="eyebrow">
              <span />
              Multiply the impact
            </p>
            <h2>Bring expertise, influence or institutional support to the mission.</h2>
          </div>
          <div className="actions">
            <Button href="/partner" icon="fa-handshake">
              Explore partnerships
            </Button>
            <Button href="/resources" tone="outline" icon="fa-book-open">
              Understand our advocacy
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
>>>>>>> Stashed changes
