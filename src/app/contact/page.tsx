'use client';

import { useState } from 'react';
import { useCms } from '@/context/CmsContext';
import { CLUB } from '@/data/content';
import styles from './contact.module.css';

export default function ContactPage() {
  const { store, addMessage } = useCms();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [msgRef, setMsgRef] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const subject = data.get('subject')?.toString().trim();
    const message = data.get('message')?.toString().trim();

    if (!name || !email || !message) return;

    setFormState('submitting');

    try {
      const createdMsg = addMessage({
        name,
        email,
        subject: subject || 'General Query',
        message,
      });

      setTimeout(() => {
        setMsgRef(createdMsg.id);
        setFormState('success');
      }, 400);
    } catch {
      setFormState('idle');
    }
  };

  return (
    <div className={styles.page} data-dye-section="intro">
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <p className="label" style={{ color: 'var(--brand-red)', marginBottom: 'var(--space-md)' }}>
            Direct Communications
          </p>
          <h1 className={styles.headerTitle}>Contact GWD</h1>
          <p className={styles.headerDesc}>
            Connect with our corporate operations desk at Madhapur or our student executive council at VJIT.
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.contentInner}>
          <div className={styles.contactGrid}>
            {/* Information Cards */}
            <div className={styles.infoCol}>
              <div className={styles.infoCard}>
                <span className={styles.cardBadge}>Corporate Headquarters</span>
                <h3 className={styles.cardTitle}>{CLUB.companyName}</h3>
                <p className={styles.cardText}>{CLUB.registeredOffice}</p>
                <div className={styles.metaRow}>
                  <span>CIN: {CLUB.cin}</span>
                  <span>GSTIN: {CLUB.gstin}</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <span className={styles.cardBadge}>Student Collective Base</span>
                <h3 className={styles.cardTitle}>{CLUB.name} (At VJIT)</h3>
                <p className={styles.cardText}>{CLUB.campusBase}, Aziz Nagar Gate, Hyderabad — 500075</p>
                <div className={styles.metaRow}>
                  <span>Inception: March 2024</span>
                  <span>Executive Council: 9 Roles</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <span className={styles.cardBadge}>Inquiries & Channels</span>
                <h3 className={styles.cardTitle}>Direct Desks</h3>
                <div className={styles.channelList}>
                  <div className={styles.channelItem}>
                    <span className={styles.channelKey}>General</span>
                    <span className={styles.channelVal}>hello@gwd-club.com</span>
                  </div>
                  <div className={styles.channelItem}>
                    <span className={styles.channelKey}>Enterprise & Ventures</span>
                    <span className={styles.channelVal}>ops@gwd-global.com</span>
                  </div>
                  <div className={styles.channelItem}>
                    <span className={styles.channelKey}>Operating Hours</span>
                    <span className={styles.channelVal}>Mon – Fri · 09:30 – 18:30 IST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Enquiry Form */}
            <div className={styles.formCol}>
              <div className={styles.formCard}>
                <h3 className={styles.formTitle}>Send a Transmission</h3>
                <p className={styles.formSubtitle}>Our desk routes messages directly to the responsible division lead.</p>

                {formState === 'success' ? (
                  <div className={styles.successBlock}>
                    <div className={styles.successIcon}>✓</div>
                    <h4>Message Dispatched</h4>
                    <p>We have logged your transmission. Our desk will follow up promptly.</p>
                    <div className={styles.refBadge}>Ref: {msgRef}</div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Full Name <span className="form-required">*</span></label>
                      <input id="name" name="name" type="text" className="form-input" placeholder="Your name" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email Address <span className="form-required">*</span></label>
                      <input id="email" name="email" type="email" className="form-input" placeholder="you@example.com" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject" className="form-label">Subject</label>
                      <input id="subject" name="subject" type="text" className="form-input" placeholder="What is this regarding?" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message" className="form-label">Message <span className="form-required">*</span></label>
                      <textarea id="message" name="message" className="form-input form-textarea" placeholder="Detail your query or communication..." required />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={formState === 'submitting'}>
                      {formState === 'submitting' ? 'Sending...' : 'Transmit Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
