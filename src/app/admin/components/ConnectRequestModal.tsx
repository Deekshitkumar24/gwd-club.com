'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  ConnectRequestRecord,
  ConnectRequestStatus,
  CONNECT_REQUEST_TYPE_LABELS,
} from '@/lib/cms';
import { useCms } from '@/context/CmsContext';
import styles from '../admin.module.css';

interface ConnectRequestModalProps {
  request: ConnectRequestRecord;
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

const GWD_TEAM_POCS = [
  'Deekshit Katikaneni (Technical Lead)',
  'Aldrin Paul (Executive President)',
  'Ashish Goutham (Full-Stack & Sports OS)',
  'Shravya (General Secretary)',
  'Bhavya (Events & Operations Lead)',
  'Abhishek (Creative & Design Lead)',
  'Unassigned / General Desk',
];

export default function ConnectRequestModal({
  request,
  isOpen,
  onClose,
  onToast,
}: ConnectRequestModalProps) {
  const {
    store,
    updateConnectRequestStatus,
    updateConnectRequest,
    addConnectFollowUpLog,
    deleteConnectRequest,
  } = useCms();

  // Authoritative live record from store
  const liveRequest =
    (store.connectRequests || []).find((r) => r.id === request.id) || request;

  // Local state for administrative updates
  const [assignedPoc, setAssignedPoc] = useState(liveRequest.assignedPoc || 'Unassigned / General Desk');
  const [internalNotes, setInternalNotes] = useState(liveRequest.internalNotes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // New follow-up log state
  const [showLogForm, setShowLogForm] = useState(false);
  const [logAction, setLogAction] = useState('Discovery Briefing Call');
  const [logNotes, setLogNotes] = useState('');
  const [logNextDate, setLogNextDate] = useState('');
  const [logAuthor, setLogAuthor] = useState('Admin (GWD Executive)');

  if (!isOpen) return null;

  // Handle POC update
  const handlePocChange = (newPoc: string) => {
    setAssignedPoc(newPoc);
    updateConnectRequest(liveRequest.id, { assignedPoc: newPoc });
    onToast(`Assigned GWD POC updated to ${newPoc}`);
  };

  // Handle Status update
  const handleStatusChange = (newStatus: ConnectRequestStatus) => {
    updateConnectRequestStatus(liveRequest.id, newStatus);
    onToast(`Request status updated to ${newStatus}`);
  };

  // Handle Save Internal Notes
  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    updateConnectRequest(liveRequest.id, { internalNotes: internalNotes.trim() });
    setTimeout(() => {
      setIsSavingNotes(false);
      onToast('Internal notes saved successfully');
    }, 250);
  };

  // Handle Add Follow-Up Log
  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logNotes.trim()) {
      alert('Please provide notes describing this follow-up action.');
      return;
    }

    addConnectFollowUpLog(liveRequest.id, {
      author: logAuthor.trim() || 'Admin (GWD Executive)',
      action: logAction.trim(),
      notes: logNotes.trim(),
      nextFollowUpDate: logNextDate || undefined,
    });

    setLogNotes('');
    setLogNextDate('');
    setShowLogForm(false);
    onToast(`Follow-up log "${logAction}" recorded`);
  };

  // Export Request Dossier to Excel
  const handleExportDossier = () => {
    const data = [
      {
        'Reference ID': liveRequest.id,
        'Submission Timestamp': liveRequest.createdAt,
        'Lifecycle Status': liveRequest.status,
        'Engagement Track': CONNECT_REQUEST_TYPE_LABELS[liveRequest.requestType]?.title || liveRequest.requestType,
        'Assigned GWD Lead': liveRequest.assignedPoc || 'Unassigned',
        'Requester Name': liveRequest.fullName,
        'Requester Role': liveRequest.roleDesignation,
        'Requester Entity': liveRequest.requesterType,
        'Email Address': liveRequest.email,
        'Phone / WhatsApp': liveRequest.phone,
        'Institution / Community': liveRequest.institutionName,
        'Website': liveRequest.institutionWebsite || '—',
        'City': liveRequest.city,
        'State': liveRequest.state,
        'Country': liveRequest.country,
        'Existing Campus Info': liveRequest.existingCommunityInfo || '—',
        'Proposed Event / Title': liveRequest.proposedEventName || '—',
        'Event Format': liveRequest.format || '—',
        'Expected Audience Size': liveRequest.expectedAudienceSize || '—',
        'Preferred Date': liveRequest.preferredDate || '—',
        'Alternative Date': liveRequest.alternativeDate || '—',
        'Campus Venue': liveRequest.venue || '—',
        'Facilities Available': liveRequest.facilitiesAvailable || '—',
        'Requested From GWD': liveRequest.requestedFromGwd || '—',
        'Budget / Sponsorship': liveRequest.budgetSponsorship || '—',
        'Social Links': liveRequest.socialLinks || '—',
        'Event Description': liveRequest.eventDescription || '—',
        'Additional Message': liveRequest.additionalMessage || '—',
        'Internal Administrative Notes': liveRequest.internalNotes || '—',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Connect_Dossier');
    XLSX.writeFile(workbook, `GWD_${liveRequest.id}_${liveRequest.institutionName.replace(/\s+/g, '_')}.xlsx`);
    onToast(`Exported dossier for ${liveRequest.id}`);
  };

  // Format phone for WhatsApp link
  const cleanPhone = liveRequest.phone.replace(/[^0-9]/g, '');
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(
        `Hi ${liveRequest.fullName}, this is regarding your GWD partnership request (${liveRequest.id}) for ${liveRequest.institutionName}.`
      )}`
    : null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{ maxWidth: '980px', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span className={styles.codeBadge} style={{ fontSize: '0.9rem', padding: '0.35rem 0.75rem' }}>
              {liveRequest.id}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>
                {CONNECT_REQUEST_TYPE_LABELS[liveRequest.requestType]?.icon || '🏛️'}
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                {CONNECT_REQUEST_TYPE_LABELS[liveRequest.requestType]?.title || liveRequest.requestType}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeBtn} title="Close window">
            ✕
          </button>
        </div>

        {/* Status & Lifecycle Action Bar */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1rem 1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>LIFECYCLE STATUS:</span>
            <select
              value={liveRequest.status}
              onChange={(e) => handleStatusChange(e.target.value as ConnectRequestStatus)}
              className={styles.statusSelect}
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                padding: '0.4rem 0.85rem',
                background:
                  liveRequest.status === 'Approved'
                    ? 'rgba(16, 185, 129, 0.2)'
                    : liveRequest.status === 'In Discussion'
                    ? 'rgba(59, 130, 246, 0.2)'
                    : liveRequest.status === 'Contacted'
                    ? 'rgba(245, 158, 11, 0.2)'
                    : liveRequest.status === 'Completed'
                    ? 'rgba(139, 92, 246, 0.2)'
                    : liveRequest.status === 'Declined'
                    ? 'rgba(239, 68, 68, 0.2)'
                    : 'rgba(255, 255, 255, 0.08)',
                color:
                  liveRequest.status === 'Approved'
                    ? '#34d399'
                    : liveRequest.status === 'In Discussion'
                    ? '#60a5fa'
                    : liveRequest.status === 'Contacted'
                    ? '#fbbf24'
                    : liveRequest.status === 'Completed'
                    ? '#a78bfa'
                    : liveRequest.status === 'Declined'
                    ? '#f87171'
                    : '#e2e8f0',
              }}
            >
              <option value="New">New (Pending Review)</option>
              <option value="Reviewing">Reviewing (Under Council Assessment)</option>
              <option value="Contacted">Contacted (Initial Outreach Made)</option>
              <option value="In Discussion">In Discussion (Scope & Curriculum Briefing)</option>
              <option value="Approved">Approved (Official Partnership Greenlit)</option>
              <option value="Completed">Completed (Sprint / Event Executed)</option>
              <option value="Declined">Declined</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', borderColor: '#25D366', color: '#25D366' }}
              >
                💬 WhatsApp Requester ↗
              </a>
            )}
            <a
              href={`mailto:${liveRequest.email}?subject=${encodeURIComponent(
                `GWD Partnership Inquiry — ${liveRequest.institutionName} (${liveRequest.id})`
              )}`}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              ✉️ Send Email
            </a>
            <button
              onClick={handleExportDossier}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              📊 Export Dossier (.xlsx)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Section 1: Institution & Requester Dossier */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#e53e3e',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              INSTITUTION & REPRESENTATION DOSSIER
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div>
                <span className={styles.subtext}>College / University / Community</span>
                <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff', marginTop: '0.2rem' }}>
                  {liveRequest.institutionName}
                </p>
                {liveRequest.institutionWebsite && (
                  <a
                    href={liveRequest.institutionWebsite}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.8rem', color: '#60a5fa' }}
                  >
                    {liveRequest.institutionWebsite} ↗
                  </a>
                )}
              </div>

              <div>
                <span className={styles.subtext}>Lead Requester</span>
                <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff', marginTop: '0.2rem' }}>
                  {liveRequest.fullName}
                </p>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{liveRequest.roleDesignation}</span>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Entity: <span style={{ color: '#ffffff' }}>{liveRequest.requesterType}</span>
                </div>
              </div>

              <div>
                <span className={styles.subtext}>Contact Credentials</span>
                <p style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '0.2rem' }}>
                  <a href={`mailto:${liveRequest.email}`} style={{ color: '#60a5fa' }}>
                    {liveRequest.email}
                  </a>
                </p>
                <p style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '0.2rem' }}>
                  <a href={`tel:${liveRequest.phone}`} style={{ color: '#cbd5e1' }}>
                    {liveRequest.phone}
                  </a>
                </p>
              </div>

              <div>
                <span className={styles.subtext}>Geographic Jurisdiction</span>
                <p style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>
                  {liveRequest.city}, {liveRequest.state}
                </p>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{liveRequest.country}</span>
              </div>
            </div>

            {liveRequest.existingCommunityInfo && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span className={styles.subtext}>Existing Clubs / Campus Societies</span>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                  {liveRequest.existingCommunityInfo}
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Engagement Specifications & Progressive Fields */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#e53e3e',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              PROPOSED ENGAGEMENT SPECIFICATIONS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div>
                <span className={styles.subtext}>Proposed Event / Initiative Title</span>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff', marginTop: '0.2rem' }}>
                  {liveRequest.proposedEventName || '—'}
                </p>
              </div>

              <div>
                <span className={styles.subtext}>Engagement Format & Venue</span>
                <p style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>
                  {liveRequest.format || 'Offline / On-Campus'}
                </p>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{liveRequest.venue || 'Campus Venue TBD'}</span>
              </div>

              <div>
                <span className={styles.subtext}>Audience / Student Footfall</span>
                <p style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>
                  {liveRequest.expectedAudienceSize || '—'}
                </p>
              </div>

              <div>
                <span className={styles.subtext}>Proposed Dates</span>
                <p style={{ fontSize: '0.875rem', color: '#ffffff', marginTop: '0.2rem' }}>
                  Preferred: <strong>{liveRequest.preferredDate || 'Flexible'}</strong>
                </p>
                {liveRequest.alternativeDate && (
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Alternative: {liveRequest.alternativeDate}
                  </p>
                )}
              </div>
            </div>

            {liveRequest.eventDescription && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span className={styles.subtext}>Detailed Scope & Objectives</span>
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#e2e8f0',
                    lineHeight: 1.6,
                    marginTop: '0.35rem',
                  }}
                >
                  {liveRequest.eventDescription}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              {liveRequest.requestedFromGwd && (
                <div>
                  <span className={styles.subtext}>Requested Deliverables from GWD</span>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                    {liveRequest.requestedFromGwd}
                  </p>
                </div>
              )}
              {liveRequest.facilitiesAvailable && (
                <div>
                  <span className={styles.subtext}>Campus Facilities Available</span>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                    {liveRequest.facilitiesAvailable}
                  </p>
                </div>
              )}
              {liveRequest.budgetSponsorship && (
                <div>
                  <span className={styles.subtext}>Budget / Sponsorship Context</span>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                    {liveRequest.budgetSponsorship}
                  </p>
                </div>
              )}
              {liveRequest.socialLinks && (
                <div>
                  <span className={styles.subtext}>Social / Community Channels</span>
                  <p style={{ fontSize: '0.85rem', color: '#60a5fa', marginTop: '0.25rem' }}>
                    {liveRequest.socialLinks}
                  </p>
                </div>
              )}
            </div>

            {liveRequest.additionalMessage && (
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span className={styles.subtext}>Additional Message / Special Constraints</span>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.25rem', fontStyle: 'italic' }}>
                  "{liveRequest.additionalMessage}"
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Administrative Point of Contact & Internal Notes */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#e53e3e',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              ADMINISTRATIVE GOVERNANCE & GWD POINT OF CONTACT
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="label" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Assigned GWD Lead (POC)
                </label>
                <select
                  value={assignedPoc}
                  onChange={(e) => handlePocChange(e.target.value)}
                  className="input"
                  style={{ width: '100%', fontSize: '0.875rem' }}
                >
                  {GWD_TEAM_POCS.map((poc) => (
                    <option key={poc} value={poc}>
                      {poc}
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', marginTop: '0.35rem' }}>
                  Lead will be logged in audit trail and notified for stakeholder calls.
                </span>
              </div>

              <div>
                <label className="label" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Internal Notes & Executive Strategy
                </label>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record campus feasibility notes, speaker availability, or pricing terms..."
                  rows={3}
                  className="input"
                  style={{ width: '100%', fontSize: '0.875rem', minHeight: '75px' }}
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem', marginTop: '0.5rem' }}
                >
                  {isSavingNotes ? 'Saving...' : '💾 Save Internal Notes'}
                </button>
              </div>
            </div>

            {/* Section 4: Follow-Up History & Log Recorder */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.07)', paddingTop: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  Follow-Up History & Milestone Logs ({liveRequest.followUpLogs?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={() => setShowLogForm(!showLogForm)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                >
                  {showLogForm ? '✕ Cancel' : '+ Record New Follow-Up'}
                </button>
              </div>

              {/* Inline Form to Add Follow-Up */}
              {showLogForm && (
                <form
                  onSubmit={handleAddFollowUp}
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <label className="label" style={{ fontSize: '0.75rem' }}>
                        Action Performed
                      </label>
                      <input
                        type="text"
                        value={logAction}
                        onChange={(e) => setLogAction(e.target.value)}
                        placeholder="e.g. Dean Briefing Call"
                        className="input"
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                      />
                    </div>
                    <div>
                      <label className="label" style={{ fontSize: '0.75rem' }}>
                        Follow-Up Author
                      </label>
                      <input
                        type="text"
                        value={logAuthor}
                        onChange={(e) => setLogAuthor(e.target.value)}
                        className="input"
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                      />
                    </div>
                    <div>
                      <label className="label" style={{ fontSize: '0.75rem' }}>
                        Next Follow-Up Target Date
                      </label>
                      <input
                        type="date"
                        value={logNextDate}
                        onChange={(e) => setLogNextDate(e.target.value)}
                        className="input"
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label" style={{ fontSize: '0.75rem' }}>
                      Detailed Notes / Outcome
                    </label>
                    <textarea
                      value={logNotes}
                      onChange={(e) => setLogNotes(e.target.value)}
                      placeholder="Summary of conversation, agreed deliverables, or next steps..."
                      rows={2}
                      className="input"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', width: '100%' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ fontSize: '0.75rem', padding: '0.4rem 1rem', marginTop: '0.5rem' }}
                  >
                    Commit Follow-Up Log →
                  </button>
                </form>
              )}

              {/* Logs List */}
              {liveRequest.followUpLogs && liveRequest.followUpLogs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {liveRequest.followUpLogs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '6px',
                        padding: '0.75rem 1rem',
                        fontSize: '0.825rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, color: '#60a5fa' }}>{log.action}</span>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'} · By {log.author}
                        </span>
                      </div>
                      <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>{log.notes}</p>
                      {log.nextFollowUpDate && (
                        <div style={{ fontSize: '0.725rem', color: '#fbbf24', marginTop: '0.35rem' }}>
                          Target Next Follow-Up: <strong>{log.nextFollowUpDate}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                  No follow-up actions recorded yet. Use the button above to log calls or meetings.
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '1.25rem',
            }}
          >
            <button
              onClick={() => {
                if (window.confirm(`Permanently delete connect request ${liveRequest.id} for ${liveRequest.institutionName}?`)) {
                  deleteConnectRequest(liveRequest.id);
                  onToast(`Deleted connect request ${liveRequest.id}`);
                  onClose();
                }
              }}
              className={styles.deleteBtn}
              style={{ fontSize: '0.8rem' }}
            >
              🗑️ Delete Request Record
            </button>

            <button onClick={onClose} className="btn btn-secondary">
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
