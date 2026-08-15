import type { Metadata } from "next";
import { Button, InteriorHero, PageShell } from "../components";

export const metadata: Metadata = {
  title: "Transparency & Accountability",
  description: "Review Beyond Disability Foundation governance commitments, credentials, reporting approach and responsible use of contributions.",
  alternates: { canonical: "/transparency" },
};

export default function TransparencyPage() {
  return <PageShell active="Resources">
    <InteriorHero eyebrow="Compassion guided by accountability" title="Trust deserves clarity" description="Every contribution represents someone’s trust and someone else’s hope. We are committed to responsible governance, transparent use of donations and respectful, consent-based support.">
      <Button href="mailto:info@beyonddisability.org?subject=Transparency documents request" icon="fa-envelope">Request Documents</Button>
    </InteriorHero>
    <section className="content-section">
      <div className="section-title"><p className="eyebrow"><span />Foundation credentials</p><h2>Legal and governance information</h2><p>The Foundation identifies the following credentials and review commitments. Copies and supporting information can be requested from our team.</p></div>
      <div className="resource-grid transparency-grid">
        <article><i className="fa-solid fa-building-shield" /><h3>Registered NGO</h3><p>Formal organisational registration supporting accountable charitable work.</p></article>
        <article><i className="fa-solid fa-certificate" /><h3>12A &amp; 80G</h3><p>Income-tax registrations supporting eligible charitable operations and donor tax benefits.</p></article>
        <article><i className="fa-solid fa-handshake" /><h3>CSR-1 Registered</h3><p>Registration supporting eligible corporate social responsibility partnerships.</p></article>
        <article><i className="fa-solid fa-file-circle-check" /><h3>Audited Annually</h3><p>Annual financial review as part of the Foundation’s accountability commitments.</p></article>
      </div>
    </section>
    <section className="content-section">
      <div className="section-title"><p className="eyebrow"><span />How we remain accountable</p><h2>Responsible support from contribution to delivery</h2></div>
      <div className="steps transparency-steps">
        <article><i className="fa-solid fa-list-check" /><b>Needs and eligibility review</b><p>Requests are reviewed against programme scope, available resources and urgency.</p></article>
        <em><i className="fa-solid fa-arrow-right" /></em>
        <article><i className="fa-solid fa-shield-heart" /><b>Dignity and consent</b><p>Personal information and stories must be handled respectfully and with appropriate permission.</p></article>
        <em><i className="fa-solid fa-arrow-right" /></em>
        <article><i className="fa-solid fa-magnifying-glass-chart" /><b>Review and reporting</b><p>Governance records, financial review and programme documentation support transparency.</p></article>
      </div>
    </section>
    <section id="documents" className="download-band"><div><p className="eyebrow"><span />Documents and enquiries</p><h2>Request the information you need</h2></div><Button href="mailto:info@beyonddisability.org?subject=Transparency documents request" tone="outline" icon="fa-envelope">Contact Our Team</Button></section>
  </PageShell>;
}
