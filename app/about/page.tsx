import type { Metadata } from "next";
import { AboutSectionNav, Button, InteriorHero, PageShell } from "../components";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the story, vision, mission, focus and committed team behind Beyond Disability Foundation.",
  alternates: { canonical: "/about" },
};

const team = [
  ["fa-graduation-cap", "IIT Kanpur Alumni", "Contributing strategic insight, innovation and technological expertise."],
  ["fa-book-open-reader", "Distinguished Academicians", "Helping shape inclusive and accessible educational approaches."],
  ["fa-user-doctor", "Doctors & Medical Professionals", "Providing essential clinical guidance and healthcare expertise."],
  ["fa-people-carry-box", "Dedicated Social Workers", "Connecting families with support and driving meaningful change at the grassroots level."],
  ["fa-people-group", "Rotary Club Members", "Members of the Rotary Club of Kanpur Greater strengthen our community outreach through service and philanthropic leadership."],
];

export default function About() {
  return <PageShell active="About Us">
    <InteriorHero eyebrow="About us" title="Building a more accessible, inclusive and independent future" description="Beyond Disability Foundation helps children and families continue their journey towards communication, learning, participation and independence.">
      <Button href="/programmes" icon="fa-hands-holding-child">Explore Our Work</Button>
      <Button href="/partner" tone="outline" icon="fa-handshake">Partner With Us</Button>
    </InteriorHero>

    <AboutSectionNav />

    <section id="our-story" className="problem about-story-section">
      <div>
        <p className="eyebrow"><span />Our Story</p>
        <h2>A simple mission grew into structured support.</h2>
        <p>Beyond Disability Foundation began with a simple mission: to ensure that no child’s potential is limited by hearing loss or lack of financial support. What started as an individual effort to help families access cochlear implant accessories gradually grew into a structured disability-support organisation.</p>
        <p>Today, we assist children through hearing-device support, speech therapy, rehabilitation, early hearing screening and family guidance. Our work also extends to children with physical, intellectual and visual disabilities across Central Uttar Pradesh. Every milestone strengthens our commitment to building a more accessible, inclusive and independent future for persons with disabilities.</p>
      </div>
      <img src="/hero-about.webp" alt="Children learning together through accessible technology" loading="lazy" width="1536" height="1024" />
    </section>

    <section id="our-vision" className="content-section about-principle-section about-vision-section">
      <div className="about-principle-icon"><i className="fa-solid fa-eye" /></div>
      <div>
        <p className="eyebrow"><span />Our Vision</p>
        <h2>Equal opportunities to communicate, learn and participate</h2>
        <p>To build an inclusive society where every child and person with a disability has equal opportunities to communicate, learn, participate and live with dignity and independence.</p>
      </div>
    </section>

    <section id="our-mission" className="content-section about-principle-section about-mission-section">
      <div>
        <p className="eyebrow"><span />Our Mission</p>
        <h2>Continued support that creates lasting independence</h2>
        <p>To support deaf and hard-of-hearing children through cochlear implant accessories, hearing rehabilitation, speech therapy, early hearing screening and family guidance. We also work to improve access, education and participation for children with physical, intellectual and visual disabilities.</p>
      </div>
      <div className="about-principle-icon"><i className="fa-solid fa-bullseye" /></div>
    </section>

    <section id="our-focus" className="content-section about-focus-section">
      <div className="about-focus-icon"><i className="fa-solid fa-location-dot" /></div>
      <div>
        <p className="eyebrow"><span />Our Focus</p>
        <h2>Supporting underserved families across Central Uttar Pradesh</h2>
        <p>Based in Central Uttar Pradesh, Beyond Disability Foundation primarily supports children and families from economically disadvantaged backgrounds who cannot afford essential assistive devices, rehabilitation services or continued care. Through partnerships and community participation, we aim to gradually extend our reach to more underserved communities.</p>
      </div>
    </section>

    <section id="our-team" className="content-section about-team-section">
      <div className="section-title"><p className="eyebrow"><span />Team</p><h2>A Collective of Committed Changemakers</h2><p>Our founding members and active supporters bring together diverse experience, expertise and a shared commitment to creating a more inclusive society. This strong network includes:</p></div>
      <div className="resource-grid about-team-grid">
        {team.map(([icon, title, text]) => <article key={title}><i className={`fa-solid ${icon}`} /><h3>{title}</h3><p>{text}</p></article>)}
      </div>
      <p className="about-team-closing">Together, they provide the knowledge, compassion and collective strength needed to create lasting impact.</p>
    </section>

    <section className="home-cta"><div><p className="eyebrow"><span />Join The Journey</p><h2>Help us turn continued support into lasting independence.</h2></div><div className="actions"><Button href="/donate" icon="fa-heart">Donate Now</Button><Button href="/partner" tone="outline" icon="fa-handshake">Partner With Us</Button></div></section>
  </PageShell>;
}
