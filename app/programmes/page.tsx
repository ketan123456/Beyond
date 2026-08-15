import type { Metadata } from "next";
import { Button, ExpandableText, InteriorHero, PageShell } from "../components";

export const metadata: Metadata = {
  title: "Our Programmes",
  description: "Explore cochlear implant continuity, rehabilitation, early hearing screening, broader disability inclusion and family guidance programmes.",
  alternates: { canonical: "/programmes" },
};

const programmes = [
  ["fa-ear-listen", "Cochlear Implant Continuity", "We support eligible families with essential external accessories, maintenance and continuing care needs after cochlear implantation. This helps protect access to sound when recurring costs become difficult to manage."],
  ["fa-comments", "Therapy & Rehabilitation", "Speech, auditory and rehabilitation support helps children make meaningful use of an intervention, strengthen communication and participate more confidently at home, in school and in the community."],
  ["fa-baby", "Early Hearing Screening", "Early hearing assessment and family guidance can help identify a need during an important period for language and development. We promote timely screening, diagnosis and appropriate early intervention."],
  ["fa-universal-access", "Broader Disability Inclusion", "Our wider inclusion work responds to physical, sensory, intellectual and developmental disability-related needs through practical, individualised support."],
  ["fa-laptop", "Accessible Learning", "Assistive gadgets, adaptive learning tools and related educational support can help children participate more independently in learning."],
  ["fa-van-shuttle", "School Transport Support", "Where programme resources allow, safe transport assistance can help eligible children with disabilities travel to school without avoidable hardship."],
  ["fa-people-roof", "Family Guidance", "We help families understand available support, programme eligibility, documentation and possible next steps with dignity and clarity."],
  ["fa-shield-heart", "Preventive Care & Awareness", "Awareness, responsible equipment care and timely guidance can reduce avoidable interruptions and help families protect the benefit of existing support."],
];

export default function ProgrammesPage() {
  return <PageShell active="">
    <InteriorHero eyebrow="Practical continuity of care" title="Support for every stage of the journey" description="A device or first intervention may create access. Our programmes help turn that access into communication, education, participation and greater independence.">
      <Button href="/get-help#apply" icon="fa-file-pen">Apply for Support</Button>
    </InteriorHero>
    <section id="all-programmes" className="content-section">
      <div className="section-title"><p className="eyebrow"><span />Our programmes</p><h2>Focused support built around real continuing needs</h2><p>Support is provided according to programme eligibility, available resources and the urgency of each case.</p></div>
      <div className="resource-grid programme-page-grid">
        {programmes.map(([icon,title,text]) => <article id={title.toLowerCase().replace(/[^a-z]+/g,"-")} key={title}><i className={`fa-solid ${icon}`} /><h3>{title}</h3><ExpandableText title={title}>{text}</ExpandableText></article>)}
      </div>
    </section>
    <section className="home-cta"><div><p className="eyebrow"><span />Not sure where to begin?</p><h2>Tell us what support is needed.</h2></div><div className="actions"><Button href="/get-help#apply" icon="fa-arrow-right">Start an Application</Button><Button href="/get-help" tone="outline" icon="fa-circle-question">Understand the Process</Button></div></section>
  </PageShell>;
}
