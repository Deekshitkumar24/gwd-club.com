'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useReveal } from '@/hooks/useAnimations';
import { CLUB, WHY_JOIN, JOIN_FAQ } from '@/data/content';
import styles from './join.module.css';

export default function JoinPage() {
  const headerReveal = useReveal();
  const whyReveal = useReveal();
  const formReveal = useReveal();
  const faqReveal = useReveal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => setFormState('success'), 1500);
  };

  return (
    <div className={styles.page}>
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

      {/* Application Form */}
      <section className={styles.formSection} ref={formReveal.ref}>
        <div className={`${styles.formInner} reveal ${formReveal.isVisible ? 'visible' : ''}`}>
          <h2 className={styles.sectionTitle}>Apply to Join</h2>
          <p className={styles.formDesc}>Tell us about yourself and what excites you. We review applications on a rolling basis during recruitment season.</p>

          {formState === 'success' ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.successTitle}>Application Submitted!</h3>
              <p className={styles.successDesc}>We&apos;ve received your application. We&apos;ll be in touch soon via email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className="form-group">
                  <label htmlFor="join-name" className="form-label">Full Name <span className="form-required">*</span></label>
                  <input id="join-name" type="text" className="form-input" placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="join-email" className="form-label">Email <span className="form-required">*</span></label>
                  <input id="join-email" type="email" className="form-input" placeholder="your@email.com" required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className="form-group">
                  <label htmlFor="join-dept" className="form-label">Department</label>
                  <input id="join-dept" type="text" className="form-input" placeholder="e.g., Computer Science" />
                </div>
                <div className="form-group">
                  <label htmlFor="join-year" className="form-label">Year of Study</label>
                  <select id="join-year" className="form-input">
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="join-interests" className="form-label">What interests you most? <span className="form-required">*</span></label>
                <select id="join-interests" className="form-input" required>
                  <option value="">Select area</option>
                  <option value="tech">Technology & Development</option>
                  <option value="design">Design & Creative</option>
                  <option value="events">Events & Management</option>
                  <option value="content">Content & Writing</option>
                  <option value="marketing">Marketing & Social Media</option>
                  <option value="photography">Photography & Videography</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="join-why" className="form-label">Why do you want to join? <span className="form-required">*</span></label>
                <textarea id="join-why" className="form-input form-textarea" placeholder="Tell us what excites you about GWD and what you want to build..." required />
              </div>
              <div className="form-group">
                <label htmlFor="join-portfolio" className="form-label">Portfolio / GitHub / Social Link (Optional)</label>
                <input id="join-portfolio" type="url" className="form-input" placeholder="https://..." />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={formState === 'submitting'}>
                {formState === 'submitting' ? 'Submitting...' : 'Submit Application'}
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
