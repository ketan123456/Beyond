import type { Metadata } from "next";
import { Button, InteriorHero, PageShell } from "../components";

export const metadata: Metadata = {
  title: "Our Impact",
  description: "See how continuity support, rehabilitation, screening, accessible learning and family guidance create meaningful everyday change.",
  alternates: { canonical: "/impact" },
};

const outcomes = [
  ["fa-ear-listen", "Continued access to sound", "Accessories, maintenance and rehabilitation help protect progress after a hearing intervention."],
  ["fa-comments", "Communication and confidence", "Therapy and family participation help children strengthen communication and everyday confidence."],
  ["fa-school", "Participation in learning", "Accessible tools and practical support help students take part more fully in education."],
  ["fa-people-roof", "Families moving forward", "Clear guidance helps families understand options, eligibility and the next stage of support."],
];

export default function ImpactPage() {
  return <PageShell active="Our Impact">
    <InteriorHero eyebrow="Meaningful everyday progress" title="Real support creates change that continues" description="Impact is reflected not only in numbers, but in a child responding to sound, participating in class, communicating with family and moving towards greater independence.">
      <Button href="/donate" icon="fa-heart">Help Continue the Journey</Button>
    </InteriorHero>
    <section className="content-section">
      <div className="section-title"><p className="eyebrow"><span />What progress looks like</p><h2>Milestones that matter to children and families</h2><p>Our programmes focus on continuity: helping prevent financial or practical barriers from interrupting progress after the first intervention.</p></div>
      <div className="resource-grid">
        {outcomes.map(([icon,title,text]) => <article key={title}><i className={`fa-solid ${icon}`} /><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>
    <section className="content-section impact-page-map">
      <div className="section-title"><p className="eyebrow"><span />Where we work</p><h2>Rooted in Kanpur, serving families across Uttar Pradesh</h2><p>We work with families, medical professionals, community organisations and supporters to improve access to continuing disability support.</p></div>
      <img src="/impact-map.webp" alt="Map showing Beyond Disability Foundation support across Uttar Pradesh" width="1478" height="1064" />
    </section>
    <section className="home-cta"><div><p className="eyebrow"><span />Create the next milestone</p><h2>Your support can keep someone’s progress moving.</h2></div><div className="actions"><Button href="/donate" icon="fa-heart">Donate Now</Button><Button href="/partner" tone="outline" icon="fa-handshake">Partner With Us</Button></div></section>
  </PageShell>;
}
