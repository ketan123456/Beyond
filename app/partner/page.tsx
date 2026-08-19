import type { Metadata } from "next";
import { ExpandableText, InteriorHero, PageShell, PartnerForm } from "../components";

export const metadata: Metadata = {
  title: "Partner With Us",
  description: "Collaborate with Beyond Disability Foundation on responsible research and accessible innovations in hearing care.",
  alternates: { canonical: "/partner" },
};

const interests = [
  {
    icon: "fa-dna",
    title: "Gene Therapy and CRISPR-Based Research",
    text: "Exploring emerging scientific approaches that may address certain genetic causes of hearing loss.",
  },
  {
    icon: "fa-microscope",
    title: "Stem Cell Therapy and Hair Cell Regeneration",
    text: "Supporting responsible research into the repair or regeneration of damaged cells within the inner ear.",
  },
  {
    icon: "fa-brain",
    title: "Advanced Auditory and Brainstem Implant Technologies",
    text: "Encouraging innovation in auditory brainstem implants and other solutions for individuals who may not benefit from conventional hearing devices or cochlear implants.These technologies are evolving and may remain experimental or suitable only for specific clinical conditions. Our role is to connect expertise, encourage evidence-based dialogue and help ensure that future innovations become safer, more affordable and more accessible.",
  },
];

export default function PartnerPage() {
  return <PageShell active="Partner With Us">
    <InteriorHero
      eyebrow="Partner With Us"
      title="Advancing the Future of Hearing Care"
      description="Emerging hearing technologies have the potential to transform diagnosis, treatment and rehabilitation for children with severe or profound hearing loss.">
      <a href="#partner-enquiry" className="btn btn-gold"><i className="fa-solid fa-flask" />Partner for Innovation</a>
      <a href="#partner-enquiry" className="btn btn-outline"><i className="fa-solid fa-envelope" />Contact Our Team</a>
    </InteriorHero>

    <section className="content-section partner-introduction">
      <div className="section-title">
        <p className="eyebrow"><span />Collaboration for progress</p>
        <h2>Progress happens when expertise comes together</h2>
        <p>Responsible research and practical collaboration can help emerging hearing technologies become safer, more affordable and more accessible.</p>
      </div>
      <div className="partner-introduction__copy">
        <article>
          <i className="fa-solid fa-wave-square" />
          <div><h3>Transforming hearing care</h3><p>Emerging hearing technologies have the potential to transform diagnosis, treatment and rehabilitation for children with severe or profound hearing loss. However, meaningful progress requires collaboration among medical professionals, researchers, technology innovators, government bodies and nonprofit organisations.</p></div>
        </article>
        <article>
          <i className="fa-solid fa-people-group" />
          <div><h3>Building responsible partnerships</h3><p>Beyond Disability Foundation welcomes partnerships that can help evaluate new developments, promote responsible research, support awareness and advocate for safe, accessible and affordable hearing-care solutions.</p></div>
        </article>
      </div>
    </section>

    <section className="content-section partner-interest-section">
      <div className="section-title">
        <p className="eyebrow"><span />Areas of Interest</p>
        <h2>Exploring the future responsibly</h2>
      </div>
      <div className="resource-grid partner-interest-grid">
        {interests.map((interest) => <article key={interest.title}>
          <i className={`fa-solid ${interest.icon}`} />
          <h3>{interest.title}</h3>
          <ExpandableText title={interest.title}>{interest.text}</ExpandableText>
        </article>)}
      </div>
      <aside className="partner-research-note">
        <i className="fa-solid fa-circle-info" />
        <p>These technologies are evolving and may remain experimental or suitable only for specific clinical conditions. Our role is to connect expertise, encourage evidence-based dialogue and help ensure that future innovations become safer, more affordable and more accessible.</p>
      </aside>
    </section>

    <section className="home-cta partner-innovation-cta">
      <div>
        <p className="eyebrow"><span />Create impact together</p>
        <h2>Are you working in hearing care?</h2>
        <p>Are you a researcher, doctor, healthcare institution or technology innovator working in hearing care? Let us explore how we can create impact together.</p>
      </div>
      <div className="actions">
        <a href="#partner-enquiry" className="btn btn-gold"><i className="fa-solid fa-flask" />Partner for Innovation</a>
        <a href="#partner-enquiry" className="btn btn-outline"><i className="fa-solid fa-envelope" />Contact Our Team</a>
      </div>
    </section>

    <section id="partner-enquiry" className="application partner-enquiry-section">
      <p className="eyebrow"><span />Start a conversation</p>
      <h2>Tell us about your expertise and idea.</h2>
      <p>Share how you would like to collaborate with Beyond Disability Foundation.</p>
      <PartnerForm />
    </section>
  </PageShell>;
}
