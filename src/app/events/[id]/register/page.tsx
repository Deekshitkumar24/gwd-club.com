'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCms } from '@/context/CmsContext';
import { UPCOMING_EVENTS } from '@/data/content';
import { getEventRegistrationState } from '@/lib/cms';
import styles from './register.module.css';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function RegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { store, addRegistration } = useCms();

  const [formState, setFormState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [registrationId, setRegistrationId] = useState<string>('');

  const upcomingList = (store.upcomingEvents ?? []).filter((e) => e.status !== 'Draft' && e.status !== 'Archived');
  const event = upcomingList.find((e) => e.id === id);
  if (!event) return notFound();

  const currentRegistrations = (store.registrations || []).filter(r => r.eventId === event.id);
  const regState = getEventRegistrationState(event, currentRegistrations.length);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDuplicateError(null);

    if (regState !== 'Registration Open') {
      setDuplicateError(
        regState === 'Registration Full'
          ? 'Registration for this event is full (capacity limit reached).'
          : 'Registration for this event is currently closed.'
      );
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    const newErrors: Record<string, string> = {};

    const name = data.get('name')?.toString().trim() || '';
    const email = data.get('email')?.toString().trim().toLowerCase() || '';
    const college = data.get('college')?.toString().trim() || '';
    const phone = data.get('phone')?.toString().trim() || '';
    const department = data.get('department')?.toString().trim() || 'General';
    const year = data.get('year')?.toString() || '1';
    const message = data.get('message')?.toString().trim() || '';

    if (!name) newErrors.name = 'Full name is required';
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (!college) newErrors.college = 'College or organization is required';
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.length < 8) {
      newErrors.phone = 'Please provide a valid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check duplicate registrations in store
    const isDuplicate = (store.registrations || []).some(
      (reg) => reg.eventId === event.id && reg.email?.toLowerCase() === email
    );

    if (isDuplicate) {
      setDuplicateError(`A registration with ${email} is already confirmed for this event.`);
      return;
    }

    setErrors({});
    setFormState('submitting');

    try {
      const createdReg = addRegistration({
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        name,
        email,
        phone,
        college,
        department,
        year,
        message,
      });

      setTimeout(() => {
        setRegistrationId(createdReg.id);
        setFormState('success');
      }, 400);
    } catch {
      setDuplicateError('Unable to process registration at this moment. Please try again.');
      setFormState('error');
    }
  };

  if (formState === 'success') {
    return (
      <div className={styles.page}>
        <div className={styles.successWrap}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Registration Confirmed!</h1>
          <p className={styles.successDesc}>
            You are officially registered for <strong>{event.title}</strong>.
          </p>
          <div style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.5rem',
            margin: '1.5rem 0',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            color: 'var(--brand-red)',
            fontWeight: 700,
          }}>
            Pass ID: {registrationId}
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Please preserve this Pass ID for on-site check-in.
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

          {regState !== 'Registration Open' && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔒</span> {regState}
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                {regState === 'Registration Full'
                  ? 'This event has reached maximum attendee capacity. Registrations are no longer accepted.'
                  : regState === 'Registration Closed'
                  ? 'The organizer has closed registrations for this event.'
                  : 'Registrations for this event have not yet opened.'}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name <span className="form-required">*</span></label>
            <input id="name" name="name" type="text" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Your full name" required disabled={regState !== 'Registration Open' || formState === 'submitting'} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email <span className="form-required">*</span></label>
            <input id="email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com" required disabled={regState !== 'Registration Open' || formState === 'submitting'} />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number <span className="form-required">*</span></label>
            <input id="phone" name="phone" type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="+91 98765 43210" required disabled={regState !== 'Registration Open' || formState === 'submitting'} />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="college" className="form-label">College / University <span className="form-required">*</span></label>
            <input id="college" name="college" type="text" className={`form-input ${errors.college ? 'error' : ''}`} placeholder="Your institution" required disabled={regState !== 'Registration Open' || formState === 'submitting'} />
            {errors.college && <span className="form-error">{errors.college}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="year" className="form-label">Year of Study</label>
            <select id="year" name="year" className="form-input" disabled={regState !== 'Registration Open' || formState === 'submitting'}>
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
            <input id="department" name="department" type="text" className="form-input" placeholder="e.g., Computer Science" disabled={regState !== 'Registration Open' || formState === 'submitting'} />
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">Anything you&apos;d like us to know?</label>
            <textarea id="message" name="message" className="form-input form-textarea" placeholder="Dietary restrictions, accessibility needs, etc." disabled={regState !== 'Registration Open' || formState === 'submitting'} />
          </div>

          {duplicateError && (
            <div className={styles.errorBanner}>
              {duplicateError}
            </div>
          )}

          {formState === 'error' && (
            <div className={styles.errorBanner}>
              Something went wrong. Please try again.
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', opacity: regState !== 'Registration Open' ? 0.6 : 1 }} 
            disabled={regState !== 'Registration Open' || formState === 'submitting'}
          >
            {formState === 'submitting' ? 'Registering...' : regState !== 'Registration Open' ? regState : 'Complete Registration'}
          </button>

          <p className={styles.formNote}>
            By registering, you agree to receive event-related communications. Your information will not be shared with third parties.
          </p>
        </form>
      </div>
    </div>
  );
}
