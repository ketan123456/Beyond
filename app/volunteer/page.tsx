import type { Metadata } from "next";
import { Button, InteriorHero, PageShell, PartnerForm } from "../components";

export const metadata: Metadata = {
  title: "Volunteer With Us",
  description: "Contribute time, professional expertise, medical knowledge, technology or community networks to Beyond Disability Foundation.",
  alternates: { canonical: "/volunteer" },
};

const roles = [
  ["fa-user-doctor", "Healthcare expertise", "Help families and our team better understand clinical, rehabilitation and continuing-care needs."],
  ["fa-chalkboard-user", "Education and mentoring", "Support awareness, accessible learning, family guidance and skill-building activities."],
  ["fa-laptop-code", "Technology and design", "Contribute useful technology, accessibility, communications or digital problem-solving skills."],
  ["fa-bullhorn", "Awareness and advocacy", "Help communicate systemic barriers responsibly and bring informed voices into the conversation."],
  ["fa-people-group", "Community outreach", "Help connect families, local organisations and potential supporters with relevant programmes."],
  ["fa-camera", "Ethical storytelling", "Support respectful, consent-led documentation that protects the dignity and privacy of families."],
];

export default function VolunteerPage() {
  return <PageShell active="">
    <InteriorHero eyebrow="Give time and expertise" title="Everyone has something valuable to give" description="You can contribute professional knowledge, technology, networks, communication skills or time to help keep someone’s journey moving.">
      <a className="btn btn-gold" href="#volunteer-enquiry"><i className="fa-solid fa-hand-holding-heart" />Become a Volunteer</a>
      <Button href="/partner" tone="outline" icon="fa-handshake">Explore Partnerships</Button>
    </InteriorHero>
    <section className="content-section">
      <div className="section-title"><p className="eyebrow"><span />Ways to contribute</p><h2>Find a role suited to your experience</h2><p>Volunteer opportunities depend on current programme requirements, safeguarding considerations and team capacity.</p></div>
      <div className="resource-grid">
        {roles.map(([icon,title,text]) => <article key={title}><i className={`fa-solid ${icon}`} /><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>
    <section id="volunteer-enquiry" className="application">
      <p className="eyebrow"><span />Start a conversation</p>
      <h2>Tell us how you would like to contribute</h2>
      <p>Share your interests, availability and relevant experience. Our team will contact you if there is a suitable current or upcoming opportunity.</p>
      <PartnerForm mode="volunteer" />
    </section>
  </PageShell>;
}
