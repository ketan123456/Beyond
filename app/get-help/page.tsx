import type { Metadata } from "next";
import { ApplyForm, Button, InteriorHero, PageShell } from "../components";

export const metadata: Metadata = {
  title: "Get Disability Support",
  description:
    "Apply for financial aid for assistive devices, therapy, maintenance or school transport from Beyond Disability Foundation.",
  alternates: { canonical: "/get-help" },
};

export default function GetHelp() {
  return (
    <PageShell active="Get Help">
      <InteriorHero
        className="mb-2"
        image="/hero-get-help.webp"
        eyebrow="We are here for you"
        title="Support starts with one simple step"
        description="If you or your child needs financial support for assistive devices, therapy, maintenance or school transport, our team is ready to listen.">
        <a className="btn btn-gold" href="#apply">
          <i className="fa-solid fa-file-pen" /> Apply for Aid
        </a>
        <Button href="https://wa.me/918000012345" tone="outline" icon="fa-comment-dots">
          Chat on WhatsApp
        </Button>
      </InteriorHero>
      <section className="contact-strip">
        <div><i className="fa-solid fa-phone-volume" /><b>Beyond Disability Helpline</b><span>+91 80000 12345<small>Mon–Sat | 9:00–18:00</small></span></div>
        <div><i className="fa-solid fa-envelope" /><b>Email Support</b><span>help@beyonddisability.org<small>Reply within 24–48 hours</small></span></div>
        <div><i className="fa-solid fa-location-dot" /><b>Our Support Centres</b><span>Across Uttar Pradesh<small>Reaching every district</small></span></div>
      </section>
      <section className="content-section">
        <div className="section-title"><p className="eyebrow"><span />Simple and transparent</p><h2>How support works</h2></div>
        <div className="steps">
          <article><i className="fa-solid fa-file-pen" /><b>Apply Online</b><p>Fill the application form with basic details.</p></article>
          <em><i className="fa-solid fa-arrow-right" /></em>
          <article><i className="fa-solid fa-cloud-arrow-up" /><b>Upload Documents</b><p>Upload your UDID card and income certificate.</p></article>
          <em><i className="fa-solid fa-arrow-right" /></em>
          <article><i className="fa-solid fa-user-check" /><b>Verification & Support</b><p>Our team verifies your details and coordinates support.</p></article>
        </div>
      </section>
      <section className="documents">
        <div><h2><i className="fa-solid fa-folder-open" /> Documents Required</h2><ul><li>UDID Card</li><li>Aadhaar Card</li><li>Income Certificate</li><li>Bank Details</li><li>Medical Report</li><li>Recent Photograph</li></ul></div>
        <aside><h3><i className="fa-solid fa-headset" /> Need help with the form?</h3><p>Our team can guide you through every step.</p><Button href="https://wa.me/918000012345" tone="green" icon="fa-comment-dots">Chat on WhatsApp</Button></aside>
      </section>
      <section id="apply" className="application">
        <p className="eyebrow"><span />Secure digital verification</p>
        <h2>Apply for financial aid</h2>
        <p>Upload clear photos or PDFs. Your documents are encrypted and visible only to the verification team.</p>
        <ApplyForm />
      </section>
    </PageShell>
  );
}
