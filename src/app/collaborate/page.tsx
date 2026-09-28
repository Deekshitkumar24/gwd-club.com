'use client';

import { useState } from 'react';
import { useReveal } from '@/hooks/useAnimations';
import { COLLABORATIONS, CLUB } from '@/data/content';
import styles from './collaborate.module.css';

export default function CollaboratePage() {
  const headerReveal = useReveal();
  const partnersReveal = useReveal();
  const formReveal = useReveal();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => setFormState('success'), 1500);
  };

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={styles.headerInner} ref={headerReveal.ref}>
          <div className={`reveal ${headerReveal.isVisible ? 'visible' : ''}`}>
            <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-md)' }}>Collaborate</p>
            <h1 className={styles.headerTitle}>Let&apos;s build something together.</h1>
            <p className={styles.headerDesc}>
              We partner with companies, organizations, and institutions to create meaningful experiences. If you share our values, let&apos;s talk.
            </p>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className={styles.partnersSection} ref={partnersReveal.ref}>
        <div className={`${styles.partnersInner} reveal ${partnersReveal.isVisible ? 'visible' : ''}`}>
          <h2 className={styles.sectionTitle}>Our Partners</h2>
          <div className={styles.partnersGrid}>
            {COLLABORATIONS.map(collab => (
              <div key={collab.id} className={styles.partnerCard}>
                <div className={styles.partnerImage}>
                  <img src={collab.image} alt={collab.name} loading="lazy" />
                </div>
                <div className={styles.partnerBody}>
                  <span className={styles.partnerType}>{collab.type}</span>
                  <h3 className={styles.partnerName}>{collab.name}</h3>
                  <p className={styles.partnerDesc}>{collab.description}</p>
                  <p className={styles.partnerOutcome}>✦ {collab.outcome}</p>
                  <span className={styles.partnerYear}>{collab.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className={styles.formSection} ref={formReveal.ref}>
        <div className={`${styles.formInner} reveal ${formReveal.isVisible ? 'visible' : ''}`}>
          <h2 className={styles.sectionTitle}>Collaboration Enquiry</h2>
          <p className={styles.formDesc}>Tell us about your organization and what you have in mind. We respond within 3 business days.</p>

          {formState === 'success' ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.successTitle}>Enquiry Sent!</h3>
              <p className={styles.successDesc}>We&apos;ve received your collaboration enquiry. Our team will review it and get back to you at the provided email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className="form-group">
                  <label htmlFor="collab-org" className="form-label">Organization / Company <span className="form-required">*</span></label>
                  <input id="collab-org" type="text" className="form-input" placeholder="Your organization" required />
                </div>
                <div className="form-group">
                  <label htmlFor="collab-contact" className="form-label">Contact Person <span className="form-required">*</span></label>
                  <input id="collab-contact" type="text" className="form-input" placeholder="Your name" required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className="form-group">
                  <label htmlFor="collab-email" className="form-label">Email <span className="form-required">*</span></label>
                  <input id="collab-email" type="email" className="form-input" placeholder="you@company.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="collab-type" className="form-label">Collaboration Type <span className="form-required">*</span></label>
                  <select id="collab-type" className="form-input" required>
                    <option value="">Select type</option>
                    <option value="sponsorship">Event Sponsorship</option>
                    <option value="workshop">Workshop Partnership</option>
                    <option value="project">Project Collaboration</option>
                    <option value="mentorship">Mentorship Program</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="collab-idea" className="form-label">Proposed Idea <span className="form-required">*</span></label>
                <textarea id="collab-idea" className="form-input form-textarea" placeholder="Tell us about your idea for collaboration..." required />
              </div>
              <div className="form-group">
                <label htmlFor="collab-timeline" className="form-label">Expected Timeline</label>
                <input id="collab-timeline" type="text" className="form-input" placeholder="e.g., Q4 2025, Ongoing, etc." />
              </div>

              {formState === 'error' && <div className={styles.errorBanner}>Something went wrong. Please try again.</div>}

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={formState === 'submitting'}>
                {formState === 'submitting' ? 'Sending...' : 'Submit Enquiry'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
