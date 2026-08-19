import type { Metadata } from "next";
import { Button, InteriorHero, PageShell } from "../components";

export const metadata: Metadata = {
  title: "Our Associates",
  description: "Meet the medical professionals and hearing-care specialists who strengthen our work.",
  alternates: { canonical: "/associates" },
};

export default function AssociatesPage() {
  return <PageShell active="Our Associates">
    <InteriorHero eyebrow="Our Associates" title="Expertise That Strengthens Every Child’s Journey" description="Our work is strengthened by the knowledge, guidance and commitment of experienced medical professionals who share our mission of improving the lives of children with disabilities.">
      <Button href="/partner#csr-enquiry" icon="fa-user-doctor">Join Our Medical Network</Button>
    </InteriorHero>
    <section className="content-section">
      <div className="section-title"><p className="eyebrow"><span />Clinical collaboration</p><h2>Medical expertise beside every family</h2><p>Through collaboration with doctors and hearing-care specialists across Uttar Pradesh, we help families access appropriate clinical guidance, expert assessment and compassionate care—particularly for children with hearing loss who may require cochlear implants, rehabilitation or continued audiological support.</p><p>We are grateful to our medical associates for contributing their time and expertise to help families make informed decisions and access the right support at every stage.</p></div>
      <div className="partner-benefits associates-grid">
        <span><i className="fa-solid fa-user-doctor" />Dr. ABC<small>Specialisation / Hospital or Institution</small></span>
        <span><i className="fa-solid fa-stethoscope" />Dr. XYZ<small>Specialisation / Hospital or Institution</small></span>
      </div>
    </section>
    <section className="content-section commitment-section"><div className="section-title"><p className="eyebrow"><span />Important note</p><h2>Independent professional care</h2><p>Medical advice, diagnosis and treatment are provided independently by qualified medical professionals. Beyond Disability Foundation facilitates access and support but does not replace professional medical consultation.</p></div></section>
  </PageShell>;
}
