import type { Metadata } from "next";
import { Button, ExpandableText, InteriorHero, PageShell, ServiceCards } from "../components";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the Kanpur roots, team and programmes behind Beyond Disability Foundation.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <PageShell active="About Us">
      <InteriorHero
        image="/hero-about.webp"
        eyebrow="About us"
        title="Rooted in Kanpur, driven by compassion, and united by a shared vision of a truly inclusive world"
        description="Based in the industrial and educational hub of Kanpur, we are united by a shared vision of a truly inclusive world and a desire to bridge the gap between ability and opportunity.">
        <Button href="/get-help" icon="fa-file-pen">
          Apply for Aid
        </Button>
        <Button href="/partner" tone="outline" icon="fa-handshake">
          Partner With Us
        </Button>
      </InteriorHero>
      <section className="problem">
        <div>
          <p className="eyebrow">
            <span />
            Our beginnings
          </p>
          <h2>Personal action became a shared movement.</h2>
          <p>
            Long before becoming a formal foundation, passionate changemakers
            directly supported children with disabilities in local communities -
            offering hands-on guidance, resources and emotional support to
            families who felt left behind.
          </p>
        </div>
        <img
          src="/hero-about.webp"
          alt="Children learning together through accessible technology"
          loading="lazy"
          width="1536"
          height="1024"
        />
      </section>
      <section className="content-section">
        <div className="section-title">
          <p className="eyebrow">
            <span />
            Our founding community
          </p>
          <h2>A powerful coalition of changemakers</h2>
        </div>
        <div className="resource-grid">
          <article>
            <i className="fa-solid fa-graduation-cap" />
            <h3>IIT Kanpur Alumni</h3>
            <ExpandableText title="IIT Kanpur Alumni">Alumni from IIT Kanpur provide strategic thinking and technological perspectives to strengthen our mission and programmes.</ExpandableText>
          </article>
          <article>
            <i className="fa-solid fa-book-open-reader" />
            <h3>Academicians</h3>
            <ExpandableText title="Academicians">Esteemed academicians help shape inclusive educational frameworks that respond to the needs of children with disabilities.</ExpandableText>
          </article>
          <article>
            <i className="fa-solid fa-user-doctor" />
            <h3>Doctors & Medical Professionals</h3>
            <ExpandableText title="Doctors & Medical Professionals">Prominent doctors and medical professionals offer vital clinical guidance, expert evaluations and health support.</ExpandableText>
          </article>
          <article>
            <i className="fa-solid fa-people-carry-box" />
            <h3>Social Workers</h3>
            <ExpandableText title="Social Workers">Dedicated social workers work tirelessly with children and families at the grassroots level.</ExpandableText>
          </article>
          <article>
            <i className="fa-solid fa-people-group" />
            <h3>Rotary Club Members</h3>
            <ExpandableText title="Rotary Club Members">Members of the Rotary Club of Kanpur Greater amplify our reach through community service and philanthropic leadership.</ExpandableText>
          </article>
        </div>
      </section>
      <section id="services" className="content-section">
        <div className="section-title">
          <p className="eyebrow">
            <span />
            Our work
          </p>
          <h2>Keeping the gift of hearing alive</h2>
          <p>
            Our primary heartbeat at Beyond Disability Foundation lies with the
            hearing-loss community, where we champion the belief that hearing
            loss should never be a barrier to a child's potential. While India sees 3
            out of every 1000 children born deaf, the incredible advancement of
            medical technology now allows children born deaf to hear, as hearing
            is the vital gateway to language acquisition, cognitive growth, and
            social integration. Over the years, central and state governments
            have started commendable schemes to help profound deaf children with
            free cochlear implant surgeries; however, in most states, there is
            minimal help to provide expensive external accessories in case of
            damage, failure, or loss of parts. To bridge this critical gap, we
            step in to ensure children do not slip back into silence.
          </p>
        </div>
        <ServiceCards />
        <div className="resource-grid">
          <article>
            <i className="fa-solid fa-universal-access" />
            <h3>Broader Disability Inclusion</h3>
            <ExpandableText title="Broader Disability Inclusion">We maintain dedicated support for children facing physical, intellectual and visual disabilities across Central Uttar Pradesh.</ExpandableText>
          </article>
          <article>
            <i className="fa-solid fa-screwdriver-wrench" />
            <h3>Efficiency Improvement</h3>
            <ExpandableText title="Efficiency Improvement">Efforts are being made to save costs on the repair and maintenance of cochlear implant accessories, educate families to care for equipment correctly, and reduce the possibility of avoidable damage.</ExpandableText>
          </article>
        </div>
      </section>
      <section className="content-section">
        <div className="section-title">
          <p className="eyebrow">
            <span />
            Extension of our work
          </p>
          <h2>Removing barriers to education, mobility and self-reliance</h2>
          <p>
            Beyond our core focus on the deaf and mute community, our commitment
            to inclusivity drives us to extend hands-on help to children and
            youth living with a wide spectrum of other physical, mental and
            sensory challenges. Recognizing that every disability demands
            customized solutions, we work to remove barriers to education,
            mobility and self-reliance.
          </p>
        </div>
        <div className="resource-grid">
          <article>
            <i className="fa-solid fa-laptop" />
            <h3>Gadgets for Improved Learning</h3>
            <ExpandableText title="Gadgets for Improved Learning">We provide specialized assistive devices and adaptive learning tools to empower children with intellectual disabilities and blind children in their educational pursuits.</ExpandableText>
          </article>
          <article>
            <i className="fa-solid fa-bus-simple" />
            <h3>School Commuting Support</h3>
            <ExpandableText title="School Commuting Support">We fund and arrange safe transport solutions to help children with disabilities travel to and from their schools without hardship.</ExpandableText>
          </article>
        </div>
        <div className="actions center-actions">
          <Button href="/get-help" icon="fa-file-pen">
            Apply for Aid
          </Button>
          <Button href="/partner" tone="navy" icon="fa-handshake">
            Partner With Us
          </Button>
        </div>
      </section>
      <section className="content-section commitment-section">
        <div className="section-title">
          <p className="eyebrow"><span />Our commitment</p>
          <h2>Creating systemic, long-lasting change</h2>
          <p>
            Beyond Disability Foundation is committed to expanding our reach,
            deepening our specialized programs for children with hearing loss,
            and creating systemic, long-lasting change for children with
            disabilities across Uttar Pradesh and beyond.
          </p>
        </div>
      </section>
      <section className="navy-strip">
        <h3>Our commitment</h3>
        <div>
          <span>
            <i className="fa-solid fa-ear-listen" /> Hearing Support
          </span>
          <span>
            <i className="fa-solid fa-comments" /> Rehabilitation
          </span>
          <span>
            <i className="fa-solid fa-laptop" /> Accessible Learning
          </span>
          <span>
            <i className="fa-solid fa-universal-access" /> Broader Inclusion
          </span>
        </div>
      </section>
    </PageShell>
  );
}
