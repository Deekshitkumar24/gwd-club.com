'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useReveal } from '@/hooks/useAnimations';
import { useCms } from '@/context/CmsContext';
import { CLUB, WHY_JOIN, JOIN_FAQ } from '@/data/content';
import { DyeAtmosphereTransition } from '@/components/DyeVisual';
import styles from './join.module.css';

export default function JoinPage() {
  const { addApplication } = useCms();
  const headerReveal = useReveal();
  const whyReveal = useReveal();
  const formReveal = useReveal();
  const faqReveal = useReveal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [applicationId, setApplicationId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = data.get('name')?.toString().trim() || '';
    const email = data.get('email')?.toString().trim().toLowerCase() || '';
    const phone = data.get('phone')?.toString().trim() || '';
    const department = data.get('department')?.toString().trim() || 'General';
    const year = data.get('year')?.toString() || '1';
    const domain = data.get('domain')?.toString() || 'Technology';
    const why = data.get('why')?.toString().trim() || '';
    const portfolio = data.get('portfolio')?.toString().trim() || '';

    if (!name || !email || !why) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setFormState('submitting');

    try {
      const createdApp = addApplication({
        name,
        email,
        phone,
        department,
        year,
        domain,
        why,
        portfolio,
      });

      setTimeout(() => {
        setApplicationId(createdApp.id);
        setFormState('success');
      }, 400);
    } catch {
      setErrorMessage('Failed to submit application. Please try again.');
      setFormState('error');
    }
  };

  return (
    <div className={styles.page} data-dye-section="join">
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerInner} ref={headerReveal.ref}>
          <div className={`reveal ${headerReveal.isVisible ? 'visible' : ''}`}>
            <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-md)' }}>Join Us</p>
            <h1 className={styles.headerTitle}>Be part of something bigger.</h1>
            <p className={styles.headerDesc}>
              {CLUB.name} is always looking for passionate students who want to build, create, and grow. No prior experience required — just bring your curiosity.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className={styles.whySection} ref={whyReveal.ref}>
        <div className={`${styles.whyInner} reveal ${whyReveal.isVisible ? 'visible' : ''}`}>
          <h2 className={styles.sectionTitle}>Why Join {CLUB.name}?</h2>
          <div className={styles.whyGrid}>
            {WHY_JOIN.map((item, i) => (
              <div key={i} className={styles.whyCard} style={{ transitionDelay: `${i * 100}ms` }}>
                <h3 className={styles.whyCardTitle}>{item.title}</h3>
                <p className={styles.whyCardDesc}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Members Do */}
      <section className={styles.membersSection}>
        <div className={styles.membersInner}>
          <h2 className={styles.sectionTitle}>What Members Do</h2>
          <div className={styles.membersList}>
            {['Collaborate on real projects with real users', 'Organize and run events for hundreds of students', 'Learn cutting-edge skills through workshops and mentorship', 'Build your professional network with industry leaders', 'Create content, photography, and visual stories', 'Lead teams and develop management experience'].map((item, i) => (
              <div key={i} className={styles.memberItem}>
                <span className={styles.memberNumber}>0{i + 1}</span>
                <p className={styles.memberText}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Atmospheric Chapter Transition ── */}
      <DyeAtmosphereTransition
        chapter="APPLICANT ONBOARDING"
        title="Enter the collective — where ambition meets execution"
        speed={0.7}
        density={0.85}
        stir={1.0}
      />

      {/* Application Form */}
      <section className={styles.formSection} ref={formReveal.ref}>
        <div className={`${styles.formInner} reveal ${formReveal.isVisible ? 'visible' : ''}`}>
          <h2 className={styles.sectionTitle}>Apply to Join</h2>
          <p className={styles.formDesc}>Tell us about yourself and what excites you. We review applications on a rolling basis during recruitment season.</p>

          {formState === 'success' ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.successTitle}>Application Submitted!</h3>
              <p className={styles.successDesc}>
                We&apos;ve received your application to join the collective. Our operations team reviews candidate portfolios and responds ahead of each seasonal builder sprint.
              </p>
              <div style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.875rem 1.25rem',
                margin: '1.25rem auto',
                display: 'inline-block',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                color: 'var(--brand-red)',
                fontWeight: 700,
              }}>
                Application Ref: {applicationId}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {errorMessage && (
                <div style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--brand-red)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--brand-red)',
                  fontSize: 'var(--text-xs)',
                  marginBottom: '1rem',
                }}>
                  {errorMessage}
                </div>
              )}
              <div className={styles.formRow}>
                <div className="form-group">
                  <label htmlFor="join-name" className="form-label">Full Name <span className="form-required">*</span></label>
                  <input id="join-name" name="name" type="text" className="form-input" placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="join-email" className="form-label">Email <span className="form-required">*</span></label>
                  <input id="join-email" name="email" type="email" className="form-input" placeholder="your@email.com" required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className="form-group">
                  <label htmlFor="join-dept" className="form-label">Department / Branch</label>
                  <input id="join-dept" name="department" type="text" className="form-input" placeholder="e.g., CSE, IT, Design" />
                </div>
                <div className="form-group">
                  <label htmlFor="join-year" className="form-label">Year of Study</label>
                  <select id="join-year" name="year" className="form-input">
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="join-domain" className="form-label">Core Domain of Interest <span className="form-required">*</span></label>
                <select id="join-domain" name="domain" className="form-input" required>
                  <option value="Technology">Technology & Development (Full-Stack, Systems, DevOps)</option>
                  <option value="Design">Design & Creative (UI/UX, Visual Identity, Motion)</option>
                  <option value="Events">Event Operations & Logistics</option>
                  <option value="Media">Visual Media, Photography & Editorial</option>
                  <option value="Marketing">Marketing, Distribution & Growth</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="join-why" className="form-label">Why do you want to join GWD? <span className="form-required">*</span></label>
                <textarea id="join-why" name="why" className="form-input form-textarea" placeholder="Tell us what you build, what you want to master, and why GWD..." required />
              </div>
              <div className="form-group">
                <label htmlFor="join-portfolio" className="form-label">Portfolio / GitHub / Work Link</label>
                <input id="join-portfolio" name="portfolio" type="url" className="form-input" placeholder="https://github.com/... or https://portfolio.site" />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={formState === 'submitting'}>
                {formState === 'submitting' ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection} ref={faqReveal.ref}>
        <div className={`${styles.faqInner} reveal ${faqReveal.isVisible ? 'visible' : ''}`}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {JOIN_FAQ.map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  {item.question}
                  <span className={`${styles.faqIcon} ${openFaq === i ? styles.faqIconOpen : ''}`}>+</span>
                </button>
                <div className={`${styles.faqAnswer} ${openFaq === i ? styles.faqAnswerOpen : ''}`}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
