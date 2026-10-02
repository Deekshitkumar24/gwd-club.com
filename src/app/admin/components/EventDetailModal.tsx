'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { EventItem } from '@/data/content';
import { useCms } from '@/context/CmsContext';
import { getEventRegistrationState } from '@/lib/cms';
import styles from '../admin.module.css';

interface EventDetailModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: EventItem) => void;
}

export default function EventDetailModal({
  event,
  isOpen,
  onClose,
  onEdit,
}: EventDetailModalProps) {
  const { store, updateEvent, updateRegistrationStatus, deleteRegistration, addAuditLog } = useCms();
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [isUpdatingReg, setIsUpdatingReg] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Editable capacity/deadline inline state
  const [isEditingLimits, setIsEditingLimits] = useState(false);

  if (!isOpen) return null;

  // Always resolve the live authoritative event from the CMS store
  const liveEvent =
    store.upcomingEvents.find((e) => e.id === event.id) ||
    store.pastEvents.find((e) => e.id === event.id) ||
    event;

  // Registrations strictly for this event
  const eventRegistrations = (store.registrations || []).filter((r) => r.eventId === liveEvent.id);

  const filteredAttendees = eventRegistrations.filter((r) => {
    const q = attendeeSearch.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.college.toLowerCase().includes(q) ||
      (r.phone && r.phone.toLowerCase().includes(q)) ||
      r.id.toLowerCase().includes(q)
    );
  });

  const totalRegistered = eventRegistrations.length;
  const capacity = liveEvent.capacity || 0;
  const remainingSlots = capacity > 0 ? Math.max(0, capacity - totalRegistered) : 'Unlimited';
  const regState = getEventRegistrationState(liveEvent, totalRegistered);
  const isRegOpen = regState === 'Registration Open';

  // Toggle Registration Open / Closed with immediate feedback & loading state
  const handleToggleRegistration = async () => {
    if (isUpdatingReg) return;
    setIsUpdatingReg(true);
    setFeedbackMsg(null);

    const nextState = !liveEvent.registrationOpen;
    const nextStatus = nextState ? 'Registration Open' : 'Registration Closed';

    try {
      updateEvent(liveEvent.id, {
        registrationOpen: nextState,
        registrationStatus: nextStatus,
      });

      addAuditLog({
        action: nextState ? 'OPEN_REGISTRATION' : 'CLOSE_REGISTRATION',
        targetType: 'EVENT',
        targetId: liveEvent.id,
        user: 'admin@gwd-club.com',
        details: `${nextState ? 'Opened' : 'Closed'} public registration for "${liveEvent.title}". State is now ${nextStatus}.`,
        status: nextState ? 'success' : 'warning',
      });

      setFeedbackMsg({
        type: 'success',
        text: `Registration successfully ${nextState ? 'OPENED' : 'CLOSED'}. Public forms and event page updated immediately.`,
      });
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch {
      setFeedbackMsg({
        type: 'error',
        text: 'Failed to update registration status. Please try again.',
      });
    } finally {
      setIsUpdatingReg(false);
    }
  };

  // Event-specific Excel export
  const handleExportEventRegistrations = () => {
    if (eventRegistrations.length === 0) {
      alert(`No registrations exist yet for "${liveEvent.title}".`);
      return;
    }

    const rows = eventRegistrations.map((r, i) => ({
      'S.No': i + 1,
      'Pass ID': r.id,
      'Event Name': liveEvent.title,
      'Attendee Name': r.name,
      'Email Address': r.email,
      'Phone Number': r.phone || '',
      'College / Institution': r.college,
      'Department / Branch': r.department,
      'Year of Study': r.year,
      'Attendance Verified': r.attendance ? 'YES' : 'NO',
      'Registration Timestamp': r.registeredAt,
      'Attendee Message / Notes': r.message || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    const cleanTitle = liveEvent.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    const dateStamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `GWD_${cleanTitle}_Registrations_${dateStamp}.xlsx`);
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-detail-title"
    >
      <div
        className={styles.modalContent}
        style={{ maxWidth: '960px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span
              className={styles.statusBadge}
              style={{
                background:
                  regState === 'Registration Open'
                    ? 'rgba(22, 163, 74, 0.1)'
                    : regState === 'Registration Full'
                    ? 'rgba(217, 119, 6, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)',
                color:
                  regState === 'Registration Open'
                    ? '#16a34a'
                    : regState === 'Registration Full'
                    ? '#d97706'
                    : 'var(--brand-red)',
                border: `1px solid ${
                  regState === 'Registration Open'
                    ? '#16a34a'
                    : regState === 'Registration Full'
                    ? '#d97706'
                    : 'var(--brand-red)'
                }`,
                fontWeight: 700,
              }}
            >
              {regState === 'Registration Open'
                ? '● Registration Open'
                : regState === 'Registration Full'
                ? '▲ Registration Full'
                : '○ Registration Closed'}
            </span>
            <span className={styles.codeBadge}>{liveEvent.category}</span>
            {liveEvent.featured && (
              <span className={styles.codeBadge} style={{ background: '#fef08a', color: '#854d0e' }}>
                ★ Featured
              </span>
            )}
          </div>
          <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Title & Metadata Strip */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2
            id="event-detail-title"
            style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.4rem', fontFamily: 'var(--font-display)' }}
          >
            {liveEvent.title}
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              color: 'var(--color-text-secondary)',
              fontSize: '0.85rem',
              flexWrap: 'wrap',
            }}
          >
            <span>📅 {liveEvent.date}</span>
            <span>🕐 {liveEvent.time}</span>
            <span>📍 {liveEvent.location}</span>
            <span>🏷️ ID: <code style={{ color: 'var(--brand-red)' }}>{liveEvent.id}</code></span>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedbackMsg && (
          <div
            style={{
              padding: '0.75rem 1.5rem',
              background: feedbackMsg.type === 'success' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderBottom: `1px solid ${feedbackMsg.type === 'success' ? '#16a34a' : 'var(--brand-red)'}`,
              color: feedbackMsg.type === 'success' ? '#15803d' : 'var(--brand-red)',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>{feedbackMsg.type === 'success' ? '✓' : '⚠'}</span>
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Operational Metrics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            padding: '1rem 1.5rem',
            background: 'var(--color-bg-secondary)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              background: 'var(--color-bg)',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
            }}
          >
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Confirmed
            </span>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.2rem 0 0', color: 'var(--color-text-primary)' }}>
              {totalRegistered}
            </p>
          </div>

          <div
            style={{
              background: 'var(--color-bg)',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
            }}
          >
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Max Capacity
            </span>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.2rem 0 0', color: 'var(--color-text-primary)' }}>
              {capacity || 'Unlimited'}
            </p>
          </div>

          <div
            style={{
              background: 'var(--color-bg)',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
            }}
          >
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Slots Remaining
            </span>
            <p
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                margin: '0.2rem 0 0',
                color: remainingSlots === 0 ? 'var(--brand-red)' : '#16a34a',
              }}
            >
              {remainingSlots}
            </p>
          </div>

          <div
            style={{
              background: 'var(--color-bg)',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
            }}
          >
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Live Public Gate
            </span>
            <p
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                margin: '0.4rem 0 0',
                color: isRegOpen ? '#16a34a' : 'var(--brand-red)',
              }}
            >
              {isRegOpen ? 'Accepting Registrations' : 'Blocked / Closed'}
            </p>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              disabled={isUpdatingReg}
              className={liveEvent.registrationOpen ? 'btn btn-secondary' : 'btn btn-primary'}
              onClick={handleToggleRegistration}
              style={{ fontSize: '0.85rem' }}
            >
              {isUpdatingReg ? (
                'Saving state...'
              ) : liveEvent.registrationOpen ? (
                '🔒 Close Registration'
              ) : (
                '🔓 Open Registration'
              )}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onEdit(liveEvent)}
              style={{ fontSize: '0.85rem' }}
            >
              ✎ Edit Full Event
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditingLimits(!isEditingLimits)}
              style={{ fontSize: '0.85rem' }}
            >
              ⚙ Capacity & Deadline
            </button>

            <a
              href={`/events/${liveEvent.id}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', textDecoration: 'none' }}
            >
              ↗ View Public Page
            </a>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExportEventRegistrations}
              style={{ fontSize: '0.85rem', background: '#16a34a', borderColor: '#16a34a' }}
            >
              📊 Export Registrations (.xlsx)
            </button>
          </div>
        </div>

        {/* Inline Capacity & Deadline Quick Editor */}
        {isEditingLimits && (
          <div
            style={{
              padding: '1rem 1.5rem',
              background: 'var(--color-bg-secondary)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
            }}
          >
            <div className="form-group" style={{ marginBottom: 0, minWidth: '160px' }}>
              <label className="label" style={{ fontSize: '0.75rem' }}>Max Capacity (Seats)</label>
              <input
                type="number"
                min="0"
                className="input"
                defaultValue={liveEvent.capacity || 150}
                id="inline-capacity-input"
                style={{ padding: '0.4rem 0.65rem', fontSize: '0.85rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0, minWidth: '200px' }}>
              <label className="label" style={{ fontSize: '0.75rem' }}>Registration Deadline</label>
              <input
                type="datetime-local"
                className="input"
                defaultValue={liveEvent.registrationDeadline || ''}
                id="inline-deadline-input"
                style={{ padding: '0.4rem 0.65rem', fontSize: '0.85rem' }}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
              onClick={() => {
                const capEl = document.getElementById('inline-capacity-input') as HTMLInputElement;
                const dlEl = document.getElementById('inline-deadline-input') as HTMLInputElement;
                const newCap = Number(capEl?.value) || 0;
                const newDl = dlEl?.value || '';

                updateEvent(liveEvent.id, {
                  capacity: newCap,
                  registrationDeadline: newDl,
                });
                setIsEditingLimits(false);
                setFeedbackMsg({
                  type: 'success',
                  text: 'Capacity and registration deadline updated.',
                });
                setTimeout(() => setFeedbackMsg(null), 3000);
              }}
            >
              Save Limits
            </button>
          </div>
        )}

        {/* Registrations Table Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              Registered Attendees ({totalRegistered})
            </h3>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Search attendees by name, email, college..."
              value={attendeeSearch}
              onChange={(e) => setAttendeeSearch(e.target.value)}
              style={{ width: '280px', fontSize: '0.85rem', padding: '0.35rem 0.65rem' }}
            />
          </div>

          {eventRegistrations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>No registrations for this event yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                When students register on the public site, their confirmed passes and attendee records will appear here in real time.
              </p>
            </div>
          ) : filteredAttendees.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)' }}>
              <p>No attendees match your search query.</p>
            </div>
          ) : (
            <div className={styles.tableCard} style={{ margin: 0, boxShadow: 'none' }}>
              <table className={styles.dataTable} style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th>Pass ID</th>
                    <th>Attendee</th>
                    <th>Institution & Dept</th>
                    <th>Registered At</th>
                    <th>Attended</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendees.map((att) => (
                    <tr key={att.id}>
                      <td>
                        <code style={{ fontSize: '0.75rem', color: 'var(--brand-red)' }}>{att.id}</code>
                      </td>
                      <td>
                        <strong>{att.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {att.email} {att.phone && `· ${att.phone}`}
                        </div>
                      </td>
                      <td>
                        {att.college}
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {att.department} · Year {att.year}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {new Date(att.registeredAt).toLocaleDateString()}{' '}
                        {new Date(att.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(att.attendance)}
                            onChange={(e) => updateRegistrationStatus(att.id, e.target.checked)}
                          />
                          <span>{att.attendance ? 'Verified' : 'Pending'}</span>
                        </label>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.rowBtn}
                          style={{ color: 'var(--brand-red)', fontSize: '0.75rem' }}
                          onClick={() => {
                            if (confirm(`Remove registration for ${att.name}?`)) {
                              deleteRegistration(att.id);
                            }
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={styles.modalFooter}
          style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)' }}
        >
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
