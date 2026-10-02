'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCms } from '@/context/CmsContext';
import {
  ConnectRequestType,
  CONNECT_REQUEST_TYPE_LABELS,
  ConnectRequestRecord,
} from '@/lib/cms';
import styles from './connect.module.css';
import { useSharedDye } from '@/components/DyeVisual';
import { BorderBeam } from '@/components/ui/border-beam';

export default function ConnectPage() {
  const { store, addConnectRequest } = useCms();
  const { setSection } = useSharedDye();
  const settings = store.settings;
  const partnershipLead = settings.partnershipLead || {
    name: 'Ashish Goutham & Deekshit Katikaneni',
    role: 'Head of Partnerships & Ecosystem Alliances',
    email: 'partnerships@gwd-club.com',
    phone: '+91 91219 98835',
    deskLocation: 'GWD Central Desk · Hyderabad / VJIT Campus',
    responseWindow: 'Within 24–48 Business Hours',
    telegramOrWhatsapp: '+91 91219 98835',
  };

  // Active track selection
  const [selectedType, setSelectedType] = useState<ConnectRequestType>('bring_to_college');

  // Form Fields
  const [formData, setFormData] = useState({
    // Requester Credentials
    fullName: '',
    roleDesignation: '',
    email: '',
    phone: '',
    requesterType: 'Student Council / Lead' as ConnectRequestRecord['requesterType'],

    // Institution / Community Representation
    institutionName: '',
    institutionWebsite: '',
    city: '',
    state: '',
    country: 'India',
    existingCommunityInfo: '',

    // Track-specific fields (progressive disclosure)
    proposedEventName: '',
    eventDescription: '',
    expectedAudienceSize: '100–300 Attendees',
    preferredDate: '',
    alternativeDate: '',
    format: 'Offline / On-Campus' as 'Offline / On-Campus' | 'Virtual / Remote' | 'Hybrid',
    venue: '',
    facilitiesAvailable: '',
    requestedFromGwd: '',
    budgetSponsorship: '',
    socialLinks: '',
    additionalMessage: '',
  });

  // UI States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<ConnectRequestRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Field change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Client validation
  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!formData.roleDesignation.trim()) errs.roleDesignation = 'Your official role/designation is required.';
    if (!formData.email.trim()) {
      errs.email = 'Official email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone or WhatsApp number is required.';
    if (!formData.institutionName.trim()) {
      errs.institutionName =
        selectedType === 'community_partnership'
          ? 'Community / Organization name is required.'
          : 'College / University / Organization name is required.';
    }
    if (!formData.city.trim()) errs.city = 'City is required.';
    if (!formData.state.trim()) errs.state = 'State / Province is required.';

    // Track specific requirements
    if (selectedType === 'bring_to_college' || selectedType === 'host_event') {
      if (!formData.proposedEventName.trim()) {
        errs.proposedEventName = 'Proposed event / sprint title is required.';
      }
      if (!formData.eventDescription.trim()) {
        errs.eventDescription = 'Please describe the proposed event scope and student goals.';
      }
    } else if (selectedType === 'collaborate') {
      if (!formData.proposedEventName.trim()) {
        errs.proposedEventName = 'Initiative / Platform title is required.';
      }
      if (!formData.eventDescription.trim()) {
        errs.eventDescription = 'Please outline the collaboration scope and technical objectives.';
      }
    } else if (selectedType === 'invite_gwd') {
      if (!formData.proposedEventName.trim()) {
        errs.proposedEventName = 'Occasion / Fest / Conference title is required.';
      }
      if (!formData.eventDescription.trim()) {
        errs.eventDescription = 'Please describe the keynote topic or judging session requested.';
      }
    } else if (selectedType === 'community_partnership') {
      if (!formData.eventDescription.trim()) {
        errs.eventDescription = 'Please describe your community mission and bilateral synergy.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll smoothly to first error
      window.scrollTo({ top: 480, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const record = addConnectRequest({
        requestType: selectedType,
        fullName: formData.fullName.trim(),
        roleDesignation: formData.roleDesignation.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        requesterType: formData.requesterType,
        institutionName: formData.institutionName.trim(),
        institutionWebsite: formData.institutionWebsite.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim() || 'India',
        existingCommunityInfo: formData.existingCommunityInfo.trim() || undefined,
        proposedEventName: formData.proposedEventName.trim() || undefined,
        eventDescription: formData.eventDescription.trim() || undefined,
        expectedAudienceSize: formData.expectedAudienceSize || undefined,
        preferredDate: formData.preferredDate || undefined,
        alternativeDate: formData.alternativeDate || undefined,
        format: formData.format,
        venue: formData.venue.trim() || undefined,
        facilitiesAvailable: formData.facilitiesAvailable.trim() || undefined,
        requestedFromGwd: formData.requestedFromGwd.trim() || undefined,
        budgetSponsorship: formData.budgetSponsorship.trim() || undefined,
        socialLinks: formData.socialLinks.trim() || undefined,
        additionalMessage: formData.additionalMessage.trim() || undefined,
      });

      setSubmittedRecord(record);
      setIsSubmitting(false);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to submit connect request:', err);
      setIsSubmitting(false);
      alert('An unexpected error occurred. Please try again or email partnerships@gwd-club.com directly.');
    }
  };

  const handleCopyRef = () => {
    if (!submittedRecord) return;
    navigator.clipboard.writeText(submittedRecord.id);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handleResetForm = () => {
    setSubmittedRecord(null);
    setFormData({
      fullName: '',
      roleDesignation: '',
      email: '',
      phone: '',
      requesterType: 'Student Council / Lead',
      institutionName: '',
      institutionWebsite: '',
      city: '',
      state: '',
      country: 'India',
      existingCommunityInfo: '',
      proposedEventName: '',
      eventDescription: '',
      expectedAudienceSize: '100–300 Attendees',
      preferredDate: '',
      alternativeDate: '',
      format: 'Offline / On-Campus',
      venue: '',
      facilitiesAvailable: '',
      requestedFromGwd: '',
      budgetSponsorship: '',
      socialLinks: '',
      additionalMessage: '',
    });
    setErrors({});
  };

  React.useEffect(() => {
    setSection('hero');
  }, [setSection]);

  return (
    <main className={styles.page} data-dye-section="connect">

      {/* ═══════════════════════════════════════════════════════════════
          HEADER: INSTITUTIONAL PARTNERSHIP GATEWAY
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Institutional Gateway · Colleges, Communities & Ecosystem
          </div>

          <h1 className={styles.headerTitle}>
            Partner With <span>GWD.</span>
          </h1>

          <p className={styles.headerDesc}>
            Whether you are bringing a 3-day production builder sprint to your campus, co-architecting
            an open-source software venture, or inviting GWD leads as keynote speakers — this is the
            official institutional intake portal.
          </p>

          {/* CMS-Managed Partnerships Contact Desk */}
          <div className={styles.leadDeskCard}>
            <BorderBeam size={260} duration={14} colorFrom="#E11D48" colorTo="#8B5CF6" borderWidth={1.5} />
            <div className={styles.deskIcon}>🏛️</div>
            <div className={styles.deskBody}>
              <span className={styles.deskLabel}>Official Partnerships & Ecosystem Desk</span>
              <div className={styles.deskName}>{partnershipLead.name}</div>
              <div className={styles.deskRole}>{partnershipLead.role}</div>
              <div className={styles.deskMeta}>
                <div className={styles.deskMetaItem}>
                  <span>✉️</span>
                  <a href={`mailto:${partnershipLead.email}`}>{partnershipLead.email}</a>
                </div>
                <div className={styles.deskMetaItem}>
                  <span>📞</span>
                  <a href={`tel:${partnershipLead.phone}`}>{partnershipLead.phone}</a>
                </div>
                <div className={styles.deskMetaItem}>
                  <span>📍</span>
                  <span>{partnershipLead.deskLocation}</span>
                </div>
              </div>
            </div>
            <div>
              <span className={styles.deskSlaBadge}>⚡ SLA: {partnershipLead.responseWindow}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CONTENT SECTION: TRACK SELECTION & PROGRESSIVE INTAKE FORM
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.contentInner}>
          {submittedRecord ? (
            /* ─────────────────────────────────────────────────────────────
               CONFIRMATION SCREEN (REFERENCE ID & NEXT STEPS)
               ───────────────────────────────────────────────────────────── */
            <div className={styles.successCard}>
              <div className={styles.successIcon}>✓</div>
              <div className={styles.successTag}>Request Confirmed & Synchronized</div>
              <h2 className={styles.successTitle}>Partnership Dossier Logged</h2>
              <p className={styles.successDesc}>
                Thank you, <strong>{submittedRecord.fullName}</strong>. Your request for{' '}
                <strong>{CONNECT_REQUEST_TYPE_LABELS[submittedRecord.requestType].title}</strong> on behalf of{' '}
                <strong>{submittedRecord.institutionName}</strong> has been assigned to the GWD Executive Desk.
              </p>

              <div className={styles.refBox}>
                <div>
                  <div className={styles.refLabel}>Institutional Reference Identifier</div>
                  <div className={styles.refCode}>{submittedRecord.id}</div>
                </div>
                <button onClick={handleCopyRef} className={styles.copyRefBtn} type="button">
                  {copiedRef ? '✓ Copied' : 'Copy ID'}
                </button>
              </div>

              <div className={styles.nextStepsList}>
                <div className={styles.stepBox}>
                  <div className={styles.stepIndex}>STAGE 01 · ROUTING</div>
                  <div className={styles.stepTitle}>Domain Lead Assignment</div>
                  <div className={styles.stepText}>
                    The GWD Council assigns a specialized internal lead (Technical, Events, or Alliances) based on your track.
                  </div>
                </div>
                <div className={styles.stepBox}>
                  <div className={styles.stepIndex}>STAGE 02 · DIRECT CONTACT</div>
                  <div className={styles.stepTitle}>Discovery Briefing</div>
                  <div className={styles.stepText}>
                    Our lead will reach out via {submittedRecord.phone} or {submittedRecord.email} within 24–48 business hours.
                  </div>
                </div>
                <div className={styles.stepBox}>
                  <div className={styles.stepIndex}>STAGE 03 · EXECUTION</div>
                  <div className={styles.stepTitle}>Curriculum & MoA Sign-Off</div>
                  <div className={styles.stepText}>
                    Finalizing event dates, equipment, syllabus, problem statements, and institutional credentials.
                  </div>
                </div>
              </div>

              <div className={styles.successActions}>
                <button onClick={handleResetForm} className={styles.submitBtn} type="button">
                  Submit Another Institutional Request
                </button>
                <Link href="/" className={styles.secondaryBtn}>
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            /* ─────────────────────────────────────────────────────────────
               PROGRESSIVE INTAKE FORM
               ───────────────────────────────────────────────────────────── */
            <>
              <div className={styles.sectionHeadingRow}>
                <div className={styles.sectionTag}>Select Engagement Track</div>
                <h2 className={styles.sectionTitle}>How Do You Want to Work With GWD?</h2>
                <p className={styles.sectionSubtitle}>
                  Choose the track that fits your institution or organization. The form will progressively disclose the relevant fields.
                </p>
              </div>

              {/* 5 Track Selector Cards */}
              <div className={styles.tracksGrid}>
                {(Object.keys(CONNECT_REQUEST_TYPE_LABELS) as ConnectRequestType[]).map((typeKey) => {
                  const item = CONNECT_REQUEST_TYPE_LABELS[typeKey];
                  const isActive = selectedType === typeKey;
                  return (
                    <button
                      key={typeKey}
                      type="button"
                      onClick={() => setSelectedType(typeKey)}
                      className={`${styles.trackCard} ${isActive ? styles.trackCardActive : ''}`}
                    >
                      {isActive && <BorderBeam size={200} duration={10} colorFrom="#FF5252" colorTo="#FF8A65" borderWidth={1.5} />}
                      <div className={styles.trackCardTop}>
                        <span className={styles.trackIcon}>{item.icon}</span>
                        <div className={styles.trackRadio}>
                          {isActive && <div className={styles.trackRadioInner} />}
                        </div>
                      </div>
                      <div className={styles.trackTitle}>{item.title}</div>
                      <div className={styles.trackSubtitle}>{item.subtitle}</div>
                      <div className={styles.trackCategory}>{item.category}</div>
                    </button>
                  );
                })}
              </div>

              {/* Progressive Intake Form */}
              <form onSubmit={handleSubmit} className={styles.formCard} noValidate>
                <BorderBeam size={350} duration={18} colorFrom="#E11D48" colorTo="#8B5CF6" borderWidth={1.5} />
                <div className={styles.formHeader}>
                  <div>
                    <span className={styles.activeTrackNotice}>
                      <span>{CONNECT_REQUEST_TYPE_LABELS[selectedType].icon}</span>
                      <span>ACTIVE INTAKE: {CONNECT_REQUEST_TYPE_LABELS[selectedType].title.toUpperCase()}</span>
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    * Indicates mandatory institutional field
                  </span>
                </div>

                {/* ── Section 1: Requester Credentials ── */}
                <div className={styles.formSectionBlock}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionNumber}>1</div>
                    <div className={styles.sectionName}>Your Credentials & Representation</div>
                    <span className={styles.sectionCaption}>Point of contact representing the institution</span>
                  </div>

                  <div className={styles.gridTwo}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        Full Name <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Dr. K. Srinivas Rao / Ananya Sharma"
                        className={styles.input}
                      />
                      {errors.fullName && <span className={styles.fieldError}>{errors.fullName}</span>}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        Your Role / Designation <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        type="text"
                        name="roleDesignation"
                        value={formData.roleDesignation}
                        onChange={handleChange}
                        placeholder="e.g. Dean of Academics / Head of Department / Club President"
                        className={styles.input}
                      />
                      {errors.roleDesignation && (
                        <span className={styles.fieldError}>{errors.roleDesignation}</span>
                      )}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        Official Email <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. dean.academics@cbit.ac.in"
                        className={styles.input}
                      />
                      {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        Phone / WhatsApp <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 94401 23890"
                        className={styles.input}
                      />
                      {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                    </div>

                    <div className={`${styles.field} ${styles.colSpanFull}`}>
                      <label className={styles.fieldLabel}>Requester Entity Type</label>
                      <select
                        name="requesterType"
                        value={formData.requesterType}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="Faculty / Dept Head">Faculty / Academic Leadership / Dean / HOD</option>
                        <option value="Student Council / Lead">Student Council / University Elected Leadership</option>
                        <option value="Club President / Lead">Student Club / Society / Chapter Lead</option>
                        <option value="Community Founder">Developer Community / Non-Profit Founder</option>
                        <option value="Industry / Corporate Partner">Industry / Corporate Enterprise Partner</option>
                        <option value="Other">Other Representative</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ── Section 2: Institution & Location ── */}
                <div className={styles.formSectionBlock}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionNumber}>2</div>
                    <div className={styles.sectionName}>
                      {selectedType === 'community_partnership'
                        ? 'Community / Organization Details'
                        : 'Institution / College Details'}
                    </div>
                    <span className={styles.sectionCaption}>Geographic and organizational context</span>
                  </div>

                  <div className={styles.gridTwo}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        {selectedType === 'community_partnership'
                          ? 'Community / Organization Name'
                          : 'College / University Name'}{' '}
                        <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        type="text"
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleChange}
                        placeholder="e.g. Chaitanya Bharathi Institute of Technology / GDG Hyderabad"
                        className={styles.input}
                      />
                      {errors.institutionName && (
                        <span className={styles.fieldError}>{errors.institutionName}</span>
                      )}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        Institution / Community Website <span className={styles.fieldHint}>(Optional)</span>
                      </label>
                      <input
                        type="url"
                        name="institutionWebsite"
                        value={formData.institutionWebsite}
                        onChange={handleChange}
                        placeholder="https://..."
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        City <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Hyderabad"
                        className={styles.input}
                      />
                      {errors.city && <span className={styles.fieldError}>{errors.city}</span>}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        State / Province <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="e.g. Telangana"
                        className={styles.input}
                      />
                      {errors.state && <span className={styles.fieldError}>{errors.state}</span>}
                    </div>

                    <div className={`${styles.field} ${styles.colSpanFull}`}>
                      <label className={styles.fieldLabel}>
                        Existing Clubs / Societies on Campus <span className={styles.fieldHint}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="existingCommunityInfo"
                        value={formData.existingCommunityInfo}
                        onChange={handleChange}
                        placeholder="e.g. IEEE Student Branch, ACM, GDG On Campus, Robotics Club (approx. 500 members)"
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Section 3: Progressive Track-Specific Requirements ── */}
                <div className={styles.formSectionBlock}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionNumber}>3</div>
                    <div className={styles.sectionName}>
                      {selectedType === 'bring_to_college' && 'Campus Builder Sprint Specifications'}
                      {selectedType === 'collaborate' && 'Collaboration Scope & Deliverables'}
                      {selectedType === 'host_event' && 'Event Architecture & Co-Hosting Logistics'}
                      {selectedType === 'community_partnership' && 'Community Alliance Synergy'}
                      {selectedType === 'invite_gwd' && 'Keynote / Speaker / Jury Details'}
                    </div>
                    <span className={styles.sectionCaption}>Tailored to your selected engagement</span>
                  </div>

                  <div className={styles.gridTwo}>
                    {/* Event / Initiative Name */}
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        {selectedType === 'bring_to_college' && 'Proposed Event / Sprint Name'}
                        {selectedType === 'collaborate' && 'Collaboration Initiative Title'}
                        {selectedType === 'host_event' && 'Event Title'}
                        {selectedType === 'community_partnership' && 'Proposed Partnership Title'}
                        {selectedType === 'invite_gwd' && 'Conference / Fest / Assembly Name'}{' '}
                        <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        type="text"
                        name="proposedEventName"
                        value={formData.proposedEventName}
                        onChange={handleChange}
                        placeholder={
                          selectedType === 'bring_to_college'
                            ? 'e.g. CBIT × GWD 3-Day Autonomous Web Sprint'
                            : selectedType === 'invite_gwd'
                            ? 'e.g. ATMOS 2026 Tech Fest Keynote'
                            : 'e.g. Cross-Campus Hackathon 2026'
                        }
                        className={styles.input}
                      />
                      {errors.proposedEventName && (
                        <span className={styles.fieldError}>{errors.proposedEventName}</span>
                      )}
                    </div>

                    {/* Format */}
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Event / Engagement Format</label>
                      <select
                        name="format"
                        value={formData.format}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="Offline / On-Campus">Offline / On-Campus (In-Person)</option>
                        <option value="Virtual / Remote">Virtual / Remote (Online)</option>
                        <option value="Hybrid">Hybrid (Campus + Live Telecast)</option>
                      </select>
                    </div>

                    {/* Scope & Description */}
                    <div className={`${styles.field} ${styles.colSpanFull}`}>
                      <label className={styles.fieldLabel}>
                        {selectedType === 'bring_to_college' && 'Event Description & Desired Student Outcomes'}
                        {selectedType === 'collaborate' && 'Technical Scope, Synergies & Target Deliverables'}
                        {selectedType === 'host_event' && 'Event Concept, Audience & Schedule'}
                        {selectedType === 'community_partnership' && 'Community Alliance Mission & Shared Value'}
                        {selectedType === 'invite_gwd' && 'Session Context, Topic Requested & Audience Profile'}{' '}
                        <span className={styles.requiredStar}>*</span>
                      </label>
                      <textarea
                        name="eventDescription"
                        value={formData.eventDescription}
                        onChange={handleChange}
                        rows={3}
                        placeholder={
                          selectedType === 'bring_to_college'
                            ? 'Explain what you want your students to build, expected skill levels, and goals for this sprint...'
                            : selectedType === 'invite_gwd'
                            ? 'Detail the keynote topic, panel theme, or hackathon judging criteria you want GWD to lead...'
                            : 'Describe your vision, deliverables, and how GWD can create high impact...'
                        }
                        className={styles.textarea}
                      />
                      {errors.eventDescription && (
                        <span className={styles.fieldError}>{errors.eventDescription}</span>
                      )}
                    </div>

                    {/* Expected Audience Size */}
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Expected Audience / Participant Count</label>
                      <select
                        name="expectedAudienceSize"
                        value={formData.expectedAudienceSize}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="50–100 Attendees">50–100 Attendees (Focused Lab)</option>
                        <option value="100–300 Attendees">100–300 Attendees (Department Wide)</option>
                        <option value="300–500 Attendees">300–500 Attendees (Institution Wide)</option>
                        <option value="500+ Attendees">500+ Attendees (Flagship Regional Fest)</option>
                      </select>
                    </div>

                    {/* Preferred Date */}
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Preferred Date</label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className={styles.input}
                      />
                    </div>

                    {/* Alternative Date */}
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        Alternative Date <span className={styles.fieldHint}>(In case of conflict)</span>
                      </label>
                      <input
                        type="date"
                        name="alternativeDate"
                        value={formData.alternativeDate}
                        onChange={handleChange}
                        className={styles.input}
                      />
                    </div>

                    {/* Campus Venue (for Offline/Hybrid) */}
                    {(selectedType === 'bring_to_college' ||
                      selectedType === 'host_event' ||
                      selectedType === 'invite_gwd') && (
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>Campus Venue</label>
                        <input
                          type="text"
                          name="venue"
                          value={formData.venue}
                          onChange={handleChange}
                          placeholder="e.g. Main Auditorium / CSE Core Computer Lab 4"
                          className={styles.input}
                        />
                      </div>
                    )}

                    {/* Facilities Available */}
                    {(selectedType === 'bring_to_college' || selectedType === 'host_event') && (
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>Facilities Available</label>
                        <input
                          type="text"
                          name="facilitiesAvailable"
                          value={formData.facilitiesAvailable}
                          onChange={handleChange}
                          placeholder="e.g. Gigabit LAN, Projectors, Stage Mic, Faculty Coordinators"
                          className={styles.input}
                        />
                      </div>
                    )}

                    {/* What Requester Wants GWD to Provide */}
                    <div className={`${styles.field} ${styles.colSpanFull}`}>
                      <label className={styles.fieldLabel}>
                        What do you want GWD to provide? <span className={styles.fieldHint}>(Select or list)</span>
                      </label>
                      <input
                        type="text"
                        name="requestedFromGwd"
                        value={formData.requestedFromGwd}
                        onChange={handleChange}
                        placeholder={
                          selectedType === 'bring_to_college'
                            ? 'e.g. Lead Technical Mentors, Real-World Problem Statements, Code Review Rubric, Swag'
                            : selectedType === 'invite_gwd'
                            ? 'e.g. Keynote Speaker (Deekshit Katikaneni), Hackathon Jury, Fireside Chat'
                            : 'e.g. Co-branding, Engineering Mentors, Sports OS Demo'
                        }
                        className={styles.input}
                      />
                    </div>

                    {/* Budget & Sponsorship Info */}
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        Budget / Sponsorship Context <span className={styles.fieldHint}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="budgetSponsorship"
                        value={formData.budgetSponsorship}
                        onChange={handleChange}
                        placeholder="e.g. Department sanctioned budget / Student tickets / Seeking co-sponsor"
                        className={styles.input}
                      />
                    </div>

                    {/* Social / Media Links */}
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        Social / Community Links <span className={styles.fieldHint}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="socialLinks"
                        value={formData.socialLinks}
                        onChange={handleChange}
                        placeholder="e.g. LinkedIn, Instagram, Discord link"
                        className={styles.input}
                      />
                    </div>

                    {/* Additional Message */}
                    <div className={`${styles.field} ${styles.colSpanFull}`}>
                      <label className={styles.fieldLabel}>
                        Additional Message / Special Requirements <span className={styles.fieldHint}>(Optional)</span>
                      </label>
                      <textarea
                        name="additionalMessage"
                        value={formData.additionalMessage}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Any specific constraints, guest requirements, or vision you'd like to share..."
                        className={styles.textarea}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Submit Row ── */}
                <div className={styles.submitRow}>
                  <div className={styles.slaNotice}>
                    <span>🛡️</span>
                    <span>Direct routing to GWD Council · Response within 24–48 business hours</span>
                  </div>

                  <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                    {isSubmitting ? 'Transmitting Request...' : 'Submit Institutional Request →'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
