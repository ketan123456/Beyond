import type { Metadata } from "next";
import { Button, InteriorHero, PageShell } from "../components";

export const metadata: Metadata = {
  title: "Our Supporters",
  description: "The organisations, businesses and patrons helping Beyond Disability Foundation create lasting impact.",
  alternates: { canonical: "/supporters" },
};

const supporters = [
  ["fa-people-group", "Rotary Club of Kanpur Greater"],
  ["fa-hand-holding-heart", "Suresh M. Parikh Charitable Trust"],
  ["fa-building", "Transcont Finvest Pvt. Ltd."],
  ["fa-industry", "Selzer Innovex Pvt. Ltd."],
];

export default function SupportersPage() {
  return <PageShell active="Our Supporters">
    <InteriorHero eyebrow="Our Supporters" title="Together, We Create Lasting Impact" description="Every child supported by Beyond Disability Foundation is strengthened by a wider community of compassionate organisations, responsible businesses and generous patrons.">
      <Button href="/partner#partner-enquiry" icon="fa-hand-holding-heart">Become a Supporter</Button>
      <Button href="/partner#partner-enquiry" tone="outline" icon="fa-handshake">Partner With Us</Button>
    </InteriorHero>
    <section className="content-section supporters-section">
      <div className="section-title"><p className="eyebrow"><span />With gratitude</p><h2>We gratefully acknowledge the continued support of</h2><p>Their contributions help us provide cochlear implant accessories, hearing rehabilitation, therapy, assistive learning tools and mobility support to children with disabilities across Uttar Pradesh. Through these partnerships, we are able to reach more families, bridge critical gaps in care and create meaningful pathways towards communication, education and independence.</p></div>
      <div className="partner-benefits supporters-grid">
        {supporters.map(([icon, name]) => <span key={name}><i className={`fa-solid ${icon}`} />{name}</span>)}
      </div>
      <p className="supporters-closing">Their trust and commitment strengthen our mission to create a more accessible and inclusive future for every child.</p>
    </section>
    <section className="home-cta"><div><p className="eyebrow"><span />Stand with us</p><h2>Help create a more accessible and inclusive future.</h2></div><div className="actions"><Button href="/partner#partner-enquiry" icon="fa-arrow-right">Become a Supporter</Button><Button href="/partner#partner-enquiry" tone="outline" icon="fa-handshake">Partner With Us</Button></div></section>
  </PageShell>;
}
