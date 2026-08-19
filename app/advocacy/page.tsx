import type { Metadata } from "next";
import { Button, InteriorHero, PageShell } from "../components";

export const metadata: Metadata = {
  title: "Advocacy",
  description: "Our advocacy for lifelong cochlear implant support and universal newborn hearing screening.",
  alternates: { canonical: "/advocacy" },
};

export default function AdvocacyPage() {
  return (
    <PageShell active="Advocacy">
      <InteriorHero
        eyebrow="Advocacy"
        title="Turning Policies into Lifelong Support"
        description="Sustainable change requires more than individual assistance—it requires policies and programmes that support children throughout their developmental journey.">
        <Button href="/partner#partner-enquiry" icon="fa-bullhorn">
          Support Our Advocacy
        </Button>
        <Button
          href="/partner#partner-enquiry"
          tone="outline"
          icon="fa-handshake">
          Collaborate With Us
        </Button>
      </InteriorHero>
      <section className="content-section advocacy-introduction">
        <div className="section-title">
          <p className="eyebrow">
            <span />
            Why advocacy matters
          </p>
          <h2>Support must continue throughout a child’s journey</h2>
          <p>Individual assistance changes lives. Strong policies help ensure that progress can continue for every eligible child.</p>
        </div>
        <div className="advocacy-introduction__copy">
          <article>
            <i className="fa-solid fa-route" />
            <div><h3>From intervention to lifelong progress</h3><p>At Beyond Disability Foundation, we believe sustainable change requires more than individual assistance—it requires disability policies and government programmes that support children throughout their developmental journey.</p></div>
          </article>
          <article>
            <i className="fa-solid fa-landmark" />
            <div><h3>Working with decision-makers</h3><p>We engage with policymakers, healthcare authorities, medical professionals and administrative bodies to identify gaps in existing hearing-care programmes and advocate for practical, inclusive and long-term solutions. We also welcome the support of individuals and institutions that can help strengthen dialogue with decision-makers.</p></div>
          </article>
        </div>
      </section>
      <section className="content-section advocacy-policy-section">
        <div className="advocacy-policy-icon">
          <i className="fa-solid fa-ear-listen" />
        </div>
        <div>
          <p className="eyebrow">
            <span />
            Continuity of care
          </p>
          <h2>Continuity of Cochlear Implant Support</h2>
          <p>
            Government-funded cochlear implant programmes have enabled many
            eligible children from economically disadvantaged families to access
            surgery. However, long-term outcomes may be affected when families
            cannot afford essential accessories, replacement components, repairs
            and rehabilitation after implantation.
          </p>
          <p>
            We advocate for government schemes to include structured
            post-implant support so that a child’s access to sound and
            developmental progress are not interrupted by financial hardship.
          </p>
        </div>
      </section>
      <section className="content-section advocacy-screening-section">
        <div className="section-title">
          <p className="eyebrow">
            <span />
            Early identification
          </p>
          <h2>Universal Newborn Hearing Screening</h2>
          <p>
            Early identification of hearing loss can significantly improve
            access to timely clinical care and rehabilitation. We advocate for
            standardised newborn hearing-screening protocols based on the
            internationally recognised 1–3–6 framework:
          </p>
        </div>
        <div className="resource-grid advocacy-framework">
          <article>
            <i className="fa-solid fa-baby" />
            <h3>1 month</h3>
            <p>Hearing screening by 1 month.</p>
          </article>
          <article>
            <i className="fa-solid fa-stethoscope" />
            <h3>3 months</h3>
            <p>Diagnostic evaluation by 3 months.</p>
          </article>
          <article>
            <i className="fa-solid fa-comments" />
            <h3>6 months</h3>
            <p>Appropriate early intervention by 6 months.</p>
          </article>
        </div>
        <p className="advocacy-followup">
          We continue to engage with relevant authorities to encourage
          consistent implementation, stronger referral systems and better family
          awareness.
        </p>
      </section>
      <section className="home-cta">
        <div>
          <p className="eyebrow">
            <span />
            Help Strengthen Our Voice
          </p>
          <h2>Policy change gains momentum when we work together.</h2>
          <p>
            Policy change gains momentum when healthcare experts, researchers,
            institutions, community leaders and responsible advocates work
            together. Partner with us to help make hearing care more continuous,
            accessible and effective for every child.
          </p>
        </div>
        <div className="actions">
          <Button href="/partner#partner-enquiry" icon="fa-arrow-right">
            Support Our Advocacy
          </Button>
          <Button
            href="/partner#partner-enquiry"
            tone="outline"
            icon="fa-handshake">
            Collaborate With Us
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
