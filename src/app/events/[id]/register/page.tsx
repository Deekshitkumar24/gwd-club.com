'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { UPCOMING_EVENTS } from '@/data/content';
import styles from './register.module.css';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function RegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const event = UPCOMING_EVENTS.find((e) => e.id === id);
  if (!event) return notFound();

  const [formState, setFormState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const newErrors: Record<string, string> = {};

    if (!data.get('name')) newErrors.name = 'Name is required';
    if (!data.get('email')) newErrors.email = 'Email is required';
    if (!data.get('college')) newErrors.college = 'College name is required';
    if (!data.get('phone')) newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setFormState('submitting');

    // Simulate submission
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  if (formState === 'success') {
    return (
      <div className={styles.page}>
        <div className={styles.successWrap}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>You&apos;re Registered!</h1>
          <p className={styles.successDesc}>
            You&apos;ve been registered for <strong>{event.title}</strong>. Check your email for confirmation and event details.
          </p>
          <div className={styles.successActions}>
            <Link href={`/events/${event.id}`} className="btn btn-secondary">Back to Event</Link>
            <Link href="/events" className="btn btn-ghost">Browse More Events</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.formWrap}>
        <div className={styles.formHeader}>
          <Link href={`/events/${event.id}`} className={styles.backLink}>← Back to Event</Link>
          <span className="badge">{event.category}</span>
          <h1 className={styles.formTitle}>Register for {event.title}</h1>
          <p className={styles.formDate}>
            {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {event.time}
          </p>
          <p className={styles.formLocation}>📍 {event.location}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name <span className="form-required">*</span></label>
            <input id="name" name="name" type="text" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Your full name" required />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email <span className="form-required">*</span></label>
            <input id="email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com" required />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number <span className="form-required">*</span></label>
            <input id="phone" name="phone" type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="+91 98765 43210" required />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="college" className="form-label">College / University <span className="form-required">*</span></label>
            <input id="college" name="college" type="text" className={`form-input ${errors.college ? 'error' : ''}`} placeholder="Your institution" required />
            {errors.college && <span className="form-error">{errors.college}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="year" className="form-label">Year of Study</label>
            <select id="year" name="year" className="form-input">
              <option value="">Select year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="pg">Post Graduate</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="department" className="form-label">Department</label>
            <input id="department" name="department" type="text" className="form-input" placeholder="e.g., Computer Science" />
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">Anything you&apos;d like us to know?</label>
            <textarea id="message" name="message" className="form-input form-textarea" placeholder="Dietary restrictions, accessibility needs, etc." />
          </div>

          {formState === 'error' && (
            <div className={styles.errorBanner}>
              Something went wrong. Please try again.
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={formState === 'submitting'}>
            {formState === 'submitting' ? 'Registering...' : 'Complete Registration'}
          </button>

          <p className={styles.formNote}>
            By registering, you agree to receive event-related communications. Your information will not be shared with third parties.
          </p>
        </form>
      </div>
    </div>
  );
}
