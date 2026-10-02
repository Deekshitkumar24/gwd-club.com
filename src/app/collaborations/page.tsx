'use client';

import { useState } from 'react';
import { useReveal } from '@/hooks/useAnimations';
import { useCms } from '@/context/CmsContext';
import {
  COLLABORATIONS,
  INSTITUTIONAL_PARTNERS,
  CLIENT_PARTNERS,
  CLIENT_DISCLAIMER,
} from '@/data/content';
import { DyeAtmosphereTransition, DyeContainedCard } from '@/components/DyeVisual';
import styles from './collaborations.module.css';

export default function CollaborationsPage() {
  const { store, addMessage } = useCms();
  const headerReveal = useReveal();
  const featuredReveal = useReveal();
  const directoryReveal = useReveal();
  const storiesReveal = useReveal();
  const ctaReveal = useReveal();

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [enquiryRef, setEnquiryRef] = useState<string>('');

  const allPartners = store.collaborations?.length ? store.collaborations : COLLABORATIONS;
  const featured = allPartners.find((c) => c.featured) || allPartners[0];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const org = data.get('org')?.toString().trim();
    const contact = data.get('contact')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const type = data.get('type')?.toString();
    const idea = data.get('idea')?.toString().trim();
    const timeline = data.get('timeline')?.toString().trim() || 'Flexible';

    if (!org || !contact || !email || !idea) return;

    setFormState('submitting');

    try {
      const createdMsg = addMessage({
        name: `${contact} (${org})`,
        email,
        subject: `Collaboration Enquiry: ${org} (${type || 'General'})`,
        message: `Organization: ${org}\nTimeline: ${timeline}\n\nProject Scope & Idea:\n${idea}`,
      });

      setTimeout(() => {
        setEnquiryRef(createdMsg.id);
        setFormState('success');
      }, 400);
    } catch {
      setFormState('error');
    }
  };

  return (
    <div className={styles.page}>
      {/* 01: Editorial Header */}
      <section className={styles.header}>
        <div className={styles.headerInner} ref={headerReveal.ref}>
          <div className={`reveal ${headerReveal.isVisible ? 'visible' : ''}`}>
            <p className="label" style={{ color: 'var(--brand-red)', marginBottom: 'var(--space-md)' }}>
              Alliances & Ecosystem
            </p>
            <h1 className={styles.headerTitle}>Build with the GWD engine.</h1>
            <p className={styles.headerDesc}>
              We partner with government innovation bodies, international enterprises, academic incubators, and sports clubs to engineer high-velocity digital solutions.
            </p>
          </div>
        </div>
      </section>

      {/* 02: Featured Collaboration */}
      <section className={styles.featuredSection} ref={featuredReveal.ref}>
        <div className={`${styles.featuredInner} reveal ${featuredReveal.isVisible ? 'visible' : ''}`}>
          <div className={styles.sectionHeader}>
            <span className="label" style={{ color: 'var(--brand-red)' }}>Spotlight</span>
            <h2 className={styles.sectionTitle}>Featured Collaboration</h2>
            <p className={styles.sectionSubtitle}>
              A representative engagement delivering enterprise platform architecture and long-term utility.
            </p>
          </div>

          <div className={styles.featuredCard}>
            <div className={styles.featuredVisual}>
              <img
                src={featured.image}
                alt={featured.name}
                className={styles.featuredImg}
              />
              <span className={styles.featuredBadge}>FEATURED ALLIANCE</span>
            </div>

            <div className={styles.featuredBody}>
              <span className={styles.featuredCategory}>{featured.type} · {featured.year}</span>
              <h3 className={styles.featuredName}>{featured.name}</h3>
              <p className={styles.featuredDesc}>{featured.description}</p>
              <div className={styles.featuredOutcomeBox}>
                <div className={styles.featuredOutcomeLabel}>Delivered Outcome</div>
                <div className={styles.featuredOutcomeText}>✦ {featured.outcome}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Atmospheric Chapter Transition ── */}
      <DyeAtmosphereTransition
        chapter="CROSS-BORDER ALLIANCES"
        title="Connecting institutional labs and enterprise delivery"
        speed={0.7}
        density={0.8}
        stir={0.9}
      />

      {/* 03: Who We've Built For (Slide 4 & 5) */}
      <section className={styles.clientsKeyboardSection} ref={directoryReveal.ref}>
        <div className={`container reveal ${directoryReveal.isVisible ? 'visible' : ''}`}>
          <div className={styles.clientsKeyboardHeader}>
            <div>
              <span className="label" style={{ color: 'var(--brand-red)', display: 'block', marginBottom: '8px' }}>
                • The Company
              </span>
              <h2 className={styles.clientsHeadline}>Who we&apos;ve built for</h2>
            </div>
            <p className={styles.clientsSubheadline}>
              Enterprise and growth-stage clients across ten countries and three continents.
            </p>
          </div>

          <div className={styles.keycapsGrid}>
            {CLIENT_PARTNERS.map((client) => (
              <div key={client.name} className={styles.clientKeycap}>
                <span className={styles.keycapName}>{client.name}</span>
                <span className={styles.keycapSub}>Client</span>
              </div>
            ))}
          </div>

          <p className={styles.clientsDisclaimer}>
            {CLIENT_DISCLAIMER}
          </p>

          {/* Bottom Bar: Who we build with */}
          <div className={styles.ecosystemBarBox}>
            <span className={styles.ecosystemBarLabel}>Who we build with</span>
            <div className={styles.ecosystemPartnersRow}>
              {INSTITUTIONAL_PARTNERS.map((p) => (
                <span key={p.id} className={styles.ecosystemPartnerItem}>
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 04: Collaboration Stories */}
      <section className={styles.storiesSection} ref={storiesReveal.ref}>
        <div className={`${styles.storiesInner} reveal ${storiesReveal.isVisible ? 'visible' : ''}`}>
          <div className={styles.sectionHeader}>
            <span className="label" style={{ color: 'var(--brand-red)' }}>Case Studies</span>
            <h2 className={styles.sectionTitle}>Collaboration Stories</h2>
            <p className={styles.sectionSubtitle}>
              How multidisciplinary student squads deliver tangible impact for outside organizations.
            </p>
          </div>

          <div className={styles.storiesGrid}>
            <div className={styles.storyCard}>
              <div className={styles.storyImgWrap}>
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80"
                  alt="Enterprise Architecture Sprint"
                  className={styles.storyImg}
                />
              </div>
              <div className={styles.storyContent}>
                <span className={styles.storyPartner}>Government & Innovation Cells</span>
                <h3 className={styles.storyTitle}>Bridging Student Innovation to Policy</h3>
                <p className={styles.storyExcerpt}>
                  Collaborating with state incubation hubs to transform university innovation into registered IP and validated startups.
                </p>
              </div>
            </div>

            <DyeContainedCard
              badge="STRATEGIC MESH"
              title="Global Co-Creation Network"
              description="High-trust delivery pipelines for private sector partners, academic institutions, and national builders."
              theme="light"
              height={220}
              speed={0.8}
              density={0.9}
            />

            <div className={styles.storyCard}>
              <div className={styles.storyImgWrap}>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80"
                  alt="Campus Hackathon & Showcase"
                  className={styles.storyImg}
                />
              </div>
              <div className={styles.storyContent}>
                <span className={styles.storyPartner}>Academic Institutions</span>
                <h3 className={styles.storyTitle}>The VJIT Campus Delivery Model</h3>
                <p className={styles.storyExcerpt}>
                  Establishing a continuous pipeline where undergraduates ship real apps with verifiable uptime rather than simulated classroom projects.
                </p>
              </div>
            </div>

            <div className={styles.storyCard}>
              <div className={styles.storyImgWrap}>
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80"
                  alt="Client Digital Overhaul"
                  className={styles.storyImg}
                />
              </div>
              <div className={styles.storyContent}>
                <span className={styles.storyPartner}>Corporate Delivery</span>
                <h3 className={styles.storyTitle}>Commercial Enterprise Systems</h3>
                <p className={styles.storyExcerpt}>
                  Delivering clean, maintainable web systems and digital platforms under professional service contracts through GWD Global Pvt. Ltd.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05: Collaboration CTA / Enquiry Form */}
      <section className={styles.ctaSection} ref={ctaReveal.ref}>
        <div className={`${styles.ctaInner} reveal ${ctaReveal.isVisible ? 'visible' : ''}`}>
          <div className={styles.enquiryFormCard}>
            <div className={styles.sectionHeader} style={{ marginBottom: 0, textAlign: 'center' }}>
              <span className="label" style={{ color: 'var(--brand-red)' }}>Work Together</span>
              <h2 className={styles.sectionTitle}>Initiate an Alliance</h2>
              <p className={styles.sectionSubtitle} style={{ margin: '0 auto' }}>
                Whether you need specialized technical delivery or want to sponsor a student builder hackathon, tell us about your goals.
              </p>
            </div>

            {formState === 'success' ? (
              <div className={styles.successNotice}>
                <h3>Enquiry Received</h3>
                <p style={{ marginTop: '8px' }}>
                  Thank you for reaching out. Your reference code is <strong>{enquiryRef}</strong>. Our executive leadership will review and respond within 24–48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="org" className={styles.formLabel}>Organization / Company *</label>
                  <input id="org" name="org" required placeholder="e.g. Acme Tech or Innovation Cell" className={styles.formInput} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact" className={styles.formLabel}>Primary Contact Name *</label>
                  <input id="contact" name="contact" required placeholder="Your full name" className={styles.formInput} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Official Email *</label>
                  <input id="email" name="email" type="email" required placeholder="name@domain.com" className={styles.formInput} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="type" className={styles.formLabel}>Collaboration Type</label>
                  <select id="type" name="type" className={styles.formSelect}>
                    <option value="Enterprise Platform Delivery">Enterprise Platform Delivery</option>
                    <option value="Hackathon / Event Sponsorship">Hackathon / Event Sponsorship</option>
                    <option value="Academic Incubation Partnership">Academic Incubation Partnership</option>
                    <option value="Research & Prototyping">Research & Prototyping</option>
                  </select>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="idea" className={styles.formLabel}>Scope & Objectives *</label>
                  <textarea id="idea" name="idea" required placeholder="Describe the problem, timeline, or engagement scope..." className={styles.formTextarea} />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <button type="submit" disabled={formState === 'submitting'} className={`btn btn-primary ${styles.submitBtn}`}>
                    {formState === 'submitting' ? 'Submitting Enquiry...' : 'Submit Collaboration Enquiry →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
