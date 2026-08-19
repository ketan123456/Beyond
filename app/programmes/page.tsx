import type { Metadata } from "next";
import { Button, ExpandableText, InteriorHero, PageShell } from "../components";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Explore cochlear implant continuity, rehabilitation, early hearing screening, broader disability inclusion and family guidance programmes.",
  alternates: { canonical: "/programmes" },
};

const programmes = [
  ["fa-ear-listen", "Cochlear Implant Accessories Support", "We provide financial assistance to underprivileged families for essential external components, accessories, repairs and replacements—helping children maintain uninterrupted access to sound."],
  ["fa-comments", "Therapy and Rehabilitation Services", "We support speech-language therapy and auditory-verbal training, helping children understand sounds, develop communication skills and participate more confidently in everyday life."],
  ["fa-baby", "Newborn Hearing Screening", "We promote early hearing screening and diagnostic evaluation so that hearing loss can be identified and addressed during the most important years of a child’s development."],
  ["fa-universal-access", "Broader Disability Inclusion", "Alongside our work in hearing care, we support children with physical, intellectual and visual disabilities across Central Uttar Pradesh, helping improve their access to education, mobility and community participation."],
  ["fa-shield-heart", "Preventive Care and Cost Efficiency", "We educate families on the proper handling, care and maintenance of cochlear implant equipment. By reducing avoidable damage and exploring cost-effective repair solutions, we aim to improve service delivery and help families use their devices safely for longer."],
];

export default function ProgrammesPage() {
  return <PageShell active="Our Work">
    <InteriorHero eyebrow="Our work" title="Support that continues beyond the first intervention" description="Our primary focus is supporting deaf and hard-of-hearing children. We bridge the gaps that remain after surgery through accessories, rehabilitation, screening and family guidance, while extending practical support to children with other disabilities.">
      <Button href="/get-help#apply" icon="fa-file-pen">Apply for Support</Button>
    </InteriorHero>
    <section className="content-section our-work-introduction">
      <div className="section-title">
        <p className="eyebrow"><span />Our Work</p>
        <h2>Hearing support that continues beyond the first intervention</h2>
        <p>Technology can create access to sound. Continued care helps transform that access into communication, learning and participation.</p>
      </div>
      <div className="our-work-introduction__body">
        <aside className="our-work-stat">
          <i className="fa-solid fa-ear-listen" />
          <strong>3 in 1,000</strong>
          <span>children in India are born with significant hearing loss</span>
        </aside>
        <div className="our-work-introduction__copy">
          <p>At Beyond Disability Foundation, our primary focus is supporting deaf and hard-of-hearing children. We believe that hearing loss should never limit a child’s ability to communicate, learn or realise their potential. Advances in medical technology, including cochlear implants, can provide eligible children with access to sound—an important foundation for speech development, learning and social participation.</p>
          <p>Central and state government schemes have helped many children from economically disadvantaged families receive cochlear implant surgery. However, support often becomes limited after the procedure. Families may struggle to afford external components, replacement parts, repairs, therapy and rehabilitation. Without this continuing assistance, a child’s access to sound and developmental progress can be disrupted.</p>
          <p className="our-work-introduction__lead"><i className="fa-solid fa-arrow-down" /><strong>Beyond Disability bridges this critical gap through the following initiatives.</strong></p>
        </div>
      </div>
    </section>
    <section id="all-programmes" className="content-section">
      <div className="section-title"><p className="eyebrow"><span />Our programmes</p><h2>Focused support built around real continuing needs</h2><p>Support is provided according to programme eligibility, available resources and the urgency of each case.</p></div>
      <div className="resource-grid programme-page-grid">
        {programmes.map(([icon,title,text]) => <article id={title.toLowerCase().replace(/[^a-z]+/g,"-")} key={title}><i className={`fa-solid ${icon}`} /><h3>{title}</h3><ExpandableText title={title}>{text}</ExpandableText></article>)}
      </div>
      <p className="programme-continuity-note">Through continued care, family guidance and collaborative support, we help children move from access to communication, learning, confidence and greater independence.</p>
    </section>
    <section id="extending-support" className="content-section extending-support-section">
      <div className="section-title"><p className="eyebrow"><span />Extending Our Support</p><h2>Advancing Inclusion Beyond Hearing Care</h2><p>While hearing support remains a core focus of Beyond Disability Foundation, our commitment extends to children and young people with physical, intellectual, visual and other disabilities.</p><p>We understand that every individual has different needs. Therefore, we provide practical, need-based assistance that helps remove barriers to education, mobility, participation and greater independence.</p></div>
      <div className="resource-grid">
        <article><i className="fa-solid fa-laptop" /><h3>Assistive Technology for Learning</h3><p>We provide suitable assistive devices and adaptive learning tools to children with intellectual and visual disabilities. These solutions help make education more accessible, encourage classroom participation and support independent learning.</p></article>
        <article><i className="fa-solid fa-van-shuttle" /><h3>Accessible School Transportation</h3><p>We help arrange and fund safe, dependable transportation for children who face mobility-related difficulties while travelling to and from school. This support promotes regular attendance and ensures that transportation does not become a barrier to education.</p></article>
      </div>
      <p className="programme-continuity-note">Through assistive technology and accessible mobility support, we help children participate more confidently in school and everyday life.</p>
    </section>
    <section className="home-cta"><div><p className="eyebrow"><span />Not sure where to begin?</p><h2>Tell us what support is needed.</h2></div><div className="actions"><Button href="/get-help#apply" icon="fa-arrow-right">Start an Application</Button><Button href="/get-help" tone="outline" icon="fa-circle-question">Understand the Process</Button></div></section>
  </PageShell>;
}
