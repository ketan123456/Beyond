import type { Metadata } from "next";
import { Button, InteriorHero, PageShell, PartnerForm } from "../components";

export const metadata: Metadata = { title: "Partner With Us", description: "Partner on future hearing technologies, medical care, advocacy and high-impact disability programmes.", alternates: { canonical: "/partner" } };

export default function Partner(){return (
  <PageShell active="Partner With Us">
    <InteriorHero
      image="/hero-partner.webp"
      eyebrow="Partner with us"
      title="Build the future of hearing and inclusion"
      description="Medical experts, researchers, policymakers, organizations and patrons can help turn evolving ideas into affordable, life-changing solutions.">
      <a href="#csr-enquiry" className="btn btn-gold">
        <i className="fa-solid fa-handshake" />
        Start a partnership
      </a>
      <Button href="/csr-brochure.pdf" tone="outline" icon="fa-file-arrow-down">
        Download brochure
      </Button>
    </InteriorHero>
    <section className="csr">
      <div>
        <p className="eyebrow">
          <span />
          Future technologies
        </p>
        <h2>Help promising science reach children</h2>
        <p>
          New developments may transform the lives of children born deaf or with
          serious audiological conditions. Progress requires the medical
          fraternity, government and organizations like ours to move together
          toward better, more affordable results.
        </p>
        <ul>
          <li>Gene Therapy and CRISPR-based Gene Editing</li>
          <li>Stem Cell Therapy</li>
          <li>Hair Cell Regeneration</li>
          <li>Soft Brainstem Implants</li>
          <li>Auditory Brainstem Implants (ABIs)</li>
        </ul>
      </div>
      <aside>
        <i className="fa-solid fa-quote-left" />
        <b style={{ fontSize: "14px" }}>
          We understand the advantages of technology, new developments which are
          still in nascent stage will change the lives of kids who are born deaf
          or with serious audiological problems. In case there is some
          discussion related to new technologies and there is a push from
          government which can happen only if the medical fraternity and
          organizations like us work together to move to evolving areas that can
          give better results and are more affordable. The new areas on which we
          look for help from experts in the field are-
        </b>
      </aside>
    </section>
    <section id="associates" className="content-section">
      <div className="section-title">
        <p className="eyebrow">
          <span />
          Our associates
        </p>
        <h2>Medical expertise beside every family</h2>
        <p>
          Our journey and impact would not be possible without the unwavering
          support, expertise, and collaboration of our esteemed medical
          associates who stand shoulder-to-shoulder with us in our mission to
          empower children with disabilities. By partnering with leading medical
          professionals across Uttar Pradesh, we ensure that every
          child—especially those in our deaf and mute community requiring
          complex interventions like cochlear implants—receives world-class
          clinical guidance, compassionate care, and expert evaluations.
        </p>
      </div>
      <div className="partner-benefits associates-grid">
        <span>
          <i className="fa-solid fa-user-doctor" />
          Dr. abc
        </span>
        <span>
          <i className="fa-solid fa-stethoscope" />
          Dr. xyz
        </span>
      </div>
    </section>
    <section id="supporters" className="content-section supporters-section">
      <div className="section-title">
        <p className="eyebrow">
          <span />
          Our supporters
        </p>
        <h2>Partners powering our mission</h2>
        <p>
          Behind every transformed life is a network of dedicated partners,
          organizations, and generous patrons. We extend our deepest gratitude
          to our supporters who make our medical interventions, rehabilitation,
          and child empowerment initiatives possible across Uttar Pradesh.
        </p>
      </div>
      <div className="partner-benefits supporters-grid">
        <span>
          <i className="fa-solid fa-people-group" />
          Rotary Club of Kanpur Greater
        </span>
        <span>
          <i className="fa-solid fa-hand-holding-heart" />
          Suresh M Parikh Charitable Trust
        </span>
        <span>
          <i className="fa-solid fa-building" />
          Transcont Finvest Pvt Ltd
        </span>
        <span>
          <i className="fa-solid fa-industry" />
          Selzer Innovex Pvt. Ltd.
        </span>
      </div>
    </section>
    <section id="csr-enquiry" className="application">
      <p className="eyebrow">
        <span />
        Work with us
      </p>
      <h2>Start a partnership conversation</h2>
      <p>
        Tell us about your expertise, organization and the impact you want to
        create.
      </p>
      <PartnerForm />
    </section>
  </PageShell>
);}
