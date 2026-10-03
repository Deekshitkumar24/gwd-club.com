'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EventItem } from '@/data/content';
import { useCms } from '@/context/CmsContext';
import { compressImageFile } from '@/lib/mediaUtils';
import MediaPickerModal from './MediaPickerModal';
import ConfirmModal from './ConfirmModal';
import styles from '../admin.module.css';

interface EventEditorModalProps {
  isOpen: boolean;
  event: EventItem | null; // null for creating a new event
  onClose: () => void;
  onSaved?: (event: EventItem) => void;
}

type EditorTab = 'basic' | 'content' | 'media' | 'agenda' | 'faq' | 'registration' | 'seo';

export default function EventEditorModal({
  isOpen,
  event,
  onClose,
  onSaved,
}: EventEditorModalProps) {
  const { createEvent, updateEvent, deleteEvent, addAuditLog } = useCms();

  const isEditing = Boolean(event);
  const [activeTab, setActiveTab] = useState<EditorTab>('basic');
  const [formData, setFormData] = useState<Partial<EventItem>>({});
  const [instructionsText, setInstructionsText] = useState('');
  const [collaboratorsText, setCollaboratorsText] = useState('');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speakers & Agenda sub-state
  const [speakers, setSpeakers] = useState<{ name: string; role: string; company?: string; topic?: string }[]>([]);
  const [schedule, setSchedule] = useState<{ time: string; title: string; description: string }[]>([]);

  // FAQ state
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // SEO state
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoOgImage, setSeoOgImage] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        venue: event.venue || event.location,
        category: event.category,
        capacity: event.capacity || 200,
        registrationOpen: event.registrationOpen ?? true,
        registrationDeadline: event.registrationDeadline || '',
        registrationStatus: event.registrationStatus || (event.registrationOpen ? 'Registration Open' : 'Registration Closed'),
        featured: event.featured || false,
        status: (event.status as 'Published' | 'Draft') || 'Published',
        shortDescription: event.shortDescription,
        description: event.description,
        image: event.image,
        eligibility: event.eligibility || 'Open to all undergraduate students and builders.',
      });
      setInstructionsText((event.instructions || []).join('\n'));
      setCollaboratorsText((event.collaborators || []).join(', '));
      setSpeakers(event.speakers || []);
      setSchedule(event.schedule || []);
      setFaqs(event.faq || []);
      setSeoTitle(event.seo?.title || event.title || '');
      setSeoDesc(event.seo?.description || event.shortDescription || '');
      setSeoOgImage(event.seo?.ogImage || event.image || '');
    } else {
      const generatedId = `gwd-event-${Date.now().toString(36)}`;
      setFormData({
        id: generatedId,
        title: '',
        date: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
        time: '09:30 AM — 05:30 PM IST',
        location: 'Auditorium, VJIT Campus, Hyderabad',
        venue: 'VJIT Campus, Hyderabad',
        category: 'Hackathon & Sprint',
        capacity: 200,
        registrationOpen: true,
        registrationDeadline: '',
        registrationStatus: 'Registration Open',
        featured: false,
        status: 'Draft',
        shortDescription: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
        eligibility: 'Open to all college students, builders, and developers.',
      });
      setInstructionsText('Bring college ID card.\nBring laptop & charger.\nPre-register through GWD portal for digital entry pass.');
      setCollaboratorsText('GWD Club VJIT, GWD Global');
      setSpeakers([]);
      setSchedule([
        { time: '09:30', title: 'Check-In & Setup', description: 'Briefing, badge pickup, and track assignment' },
        { time: '10:30', title: 'Sprint Kickoff', description: 'Intensive building across tech, design, and media' },
        { time: '04:00', title: 'Final Demos & Ship', description: 'Live project demos to judges and audience' },
      ]);
      setFaqs([
        { question: 'Who can register for this sprint?', answer: 'Open to all students interested in technology, design, events, or media.' },
        { question: 'Is there any registration fee?', answer: 'No fee. Participation is completely free for student builders.' },
      ]);
      setSeoTitle('');
      setSeoDesc('');
      setSeoOgImage('');
    }
    setActiveTab('basic');
  }, [event, isOpen]);

  if (!isOpen) return null;

  // FAQ Handlers
  const handleAddFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) {
      alert('Please provide both question and answer text.');
      return;
    }
    setFaqs([...faqs, { question: newFaqQ.trim(), answer: newFaqA.trim() }]);
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleMoveFaq = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === faqs.length - 1)) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const copy = [...faqs];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setFaqs(copy);
  };

  // Image Upload / Replace
  const handleDirectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('category', 'events');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Upload failed');
      }

      setFormData((prev) => ({ ...prev, image: json.url }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload event image';
      alert(msg);
    }
  };

  // Save Event
  const handleSubmit = (publishStatus?: 'Published' | 'Draft') => {
    if (!formData.title?.trim() || !formData.date?.trim()) {
      alert('Event title and date are required.');
      setActiveTab('basic');
      return;
    }

    setIsSaving(true);

    const eventId = formData.id?.trim() || `event-${Date.now().toString(36)}`;
    const parsedInstructions = instructionsText
      .split('\n')
      .map((i) => i.trim())
      .filter(Boolean);
    const parsedCollabs = collaboratorsText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const finalStatus = publishStatus || formData.status || 'Published';

    const eventPayload: EventItem = {
      id: eventId,
      title: formData.title.trim(),
      date: formData.date.trim(),
      time: formData.time || '10:00 AM — 05:00 PM IST',
      location: formData.location || 'VJIT Campus, Hyderabad',
      venue: formData.venue || formData.location || 'VJIT Campus, Hyderabad',
      category: formData.category || 'Sprint',
      capacity: Number(formData.capacity) || 200,
      registrationOpen: Boolean(formData.registrationOpen),
      registrationDeadline: formData.registrationDeadline || undefined,
      registrationStatus: formData.registrationOpen ? 'Registration Open' : 'Registration Closed',
      featured: Boolean(formData.featured),
      status: finalStatus,
      shortDescription: formData.shortDescription || '',
      description: formData.description || '',
      image: formData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
      eligibility: formData.eligibility || 'Open to all college students',
      instructions: parsedInstructions,
      collaborators: parsedCollabs,
      speakers,
      schedule,
      faq: faqs,
      seo: {
        title: seoTitle || formData.title,
        description: seoDesc || formData.shortDescription,
        ogImage: seoOgImage || formData.image,
      },
    };

    try {
      if (isEditing) {
        updateEvent(eventId, eventPayload);
        addAuditLog({
          action: 'UPDATE_EVENT',
          targetType: 'EVENT',
          targetId: eventId,
          user: 'admin@gwd-club.com',
          details: `Event "${eventPayload.title}" updated. Status: ${finalStatus}.`,
          status: 'info',
        });
      } else {
        createEvent(eventPayload);
        addAuditLog({
          action: 'CREATE_EVENT',
          targetType: 'EVENT',
          targetId: eventId,
          user: 'admin@gwd-club.com',
          details: `New event "${eventPayload.title}" registered as ${finalStatus}.`,
          status: 'success',
        });
      }

      setIsSaving(false);
      if (onSaved) onSaved(eventPayload);
      onClose();
    } catch {
      setIsSaving(false);
      alert('Error saving event.');
    }
  };

  return (
    <>
      <div
        className={styles.modalOverlay}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-editor-title"
      >
        <div
          className={styles.modalContent}
          style={{ maxWidth: '920px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={styles.modalHeader}>
            <div>
              <h2 id="event-editor-title" className={styles.modalTitle}>
                {isEditing ? `Edit Event: ${formData.title || 'Untitled'}` : 'Create New Event'}
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                ID: <code>{formData.id}</code> · Status: <strong>{formData.status || 'Draft'}</strong>
              </span>
            </div>
            <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>

          {/* Section Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              padding: '0.6rem 1.5rem',
              background: 'var(--color-bg-secondary)',
              borderBottom: '1px solid var(--color-border)',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'basic', label: '1. Basic Info' },
              { id: 'content', label: '2. Description' },
              { id: 'media', label: '3. Media' },
              { id: 'agenda', label: '4. Speakers & Agenda' },
              { id: 'faq', label: `5. FAQ (${faqs.length})` },
              { id: 'registration', label: '6. Registration Gate' },
              { id: 'seo', label: '7. SEO & Publish' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as EditorTab)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: activeTab === tab.id ? 'var(--brand-red)' : 'transparent',
                  background: activeTab === tab.id ? 'var(--color-bg)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--brand-red)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Body Content by Tab */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            {/* ── TAB 1: BASIC INFO ── */}
            {activeTab === 'basic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Event Title *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. GWD Builder Sprint & Showcase 2026"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Category *</label>
                    <select
                      className="input"
                      value={formData.category || 'Sprint'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Hackathon & Sprint">Hackathon & Sprint</option>
                      <option value="Sprint">Sprint</option>
                      <option value="Demo Day">Demo Day</option>
                      <option value="Summit">Summit</option>
                      <option value="Showcase">Showcase</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Tournament">Tournament</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Event Date (YYYY-MM-DD) *</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.date || ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Timing *</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.time || ''}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="09:30 AM — 05:30 PM IST"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Campus / City Location *</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Auditorium, VJIT Campus, Hyderabad"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Specific Hall / Venue</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.venue || ''}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="Central Seminar Hall / Lab 4"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(formData.featured)}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span>Feature on GWD Homepage Banner</span>
                  </label>
                </div>
              </div>
            )}

            {/* ── TAB 2: DESCRIPTION & DETAILS ── */}
            {activeTab === 'content' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Short Hook / Subtitle * (Max 160 characters)</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.shortDescription || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    maxLength={160}
                    placeholder="Concise 1-sentence value proposition shown on cards and lists."
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {(formData.shortDescription || '').length}/160 chars
                  </span>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Full Event Narrative & Overview *</label>
                  <textarea
                    className="input"
                    rows={6}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive description of what will be built, who will judge, learning outcomes, and showcase format."
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Eligibility Criteria</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.eligibility || ''}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    placeholder="e.g. Open to all undergraduate engineering, design, and media students."
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Attendee Instructions (One per line)</label>
                  <textarea
                    className="input"
                    rows={4}
                    value={instructionsText}
                    onChange={(e) => setInstructionsText(e.target.value)}
                    placeholder="Bring college ID card&#10;Bring laptops and chargers&#10;Pre-register for QR gate pass"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Partners / Collaborators (Comma-separated)</label>
                  <input
                    type="text"
                    className="input"
                    value={collaboratorsText}
                    onChange={(e) => setCollaboratorsText(e.target.value)}
                    placeholder="GWD Club VJIT, MasterGrade, Hyderabad Super League"
                  />
                </div>
              </div>
            )}

            {/* ── TAB 3: MEDIA ── */}
            {activeTab === 'media' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Hero image for event posters, public headers, cards, and social sharing previews.
                </p>

                {/* Media Preview Box */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '240px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#0d0e12',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Event Hero Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
                      No image assigned
                    </div>
                  )}
                </div>

                {/* Action Controls */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📁 Upload From Computer
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsMediaPickerOpen(true)}
                  >
                    🖼 Select From Media Library
                  </button>

                  {formData.image && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ color: 'var(--brand-red)' }}
                      onClick={() => setFormData({ ...formData, image: '' })}
                    >
                      Remove Image
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleDirectImageUpload}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Or Enter Direct Image URL</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
            )}

            {/* ── TAB 4: SPEAKERS & AGENDA ── */}
            {activeTab === 'agenda' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Schedule / Agenda Items */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                      Event Timeline & Schedule
                    </h3>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
                      onClick={() =>
                        setSchedule([
                          ...schedule,
                          { time: '11:00', title: 'New Agenda Session', description: 'Session details' },
                        ])
                      }
                    >
                      + Add Session
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {schedule.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '120px 1.5fr 2fr auto',
                          gap: '0.75rem',
                          background: 'var(--color-bg-secondary)',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          alignItems: 'center',
                        }}
                      >
                        <input
                          type="text"
                          className="input"
                          value={item.time}
                          onChange={(e) => {
                            const updated = [...schedule];
                            updated[idx].time = e.target.value;
                            setSchedule(updated);
                          }}
                          placeholder="09:30 AM"
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                        />
                        <input
                          type="text"
                          className="input"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...schedule];
                            updated[idx].title = e.target.value;
                            setSchedule(updated);
                          }}
                          placeholder="Session title"
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                        />
                        <input
                          type="text"
                          className="input"
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...schedule];
                            updated[idx].description = e.target.value;
                            setSchedule(updated);
                          }}
                          placeholder="Short description"
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                        />
                        <button
                          type="button"
                          className={styles.rowBtn}
                          style={{ color: 'var(--brand-red)' }}
                          onClick={() => setSchedule(schedule.filter((_, i) => i !== idx))}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Speakers */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                      Speakers & Mentors ({speakers.length})
                    </h3>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
                      onClick={() =>
                        setSpeakers([
                          ...speakers,
                          { name: 'New Speaker', role: 'Engineering Lead', topic: 'Architecture' },
                        ])
                      }
                    >
                      + Add Speaker
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {speakers.map((spk, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.2fr 1fr 1fr auto',
                          gap: '0.75rem',
                          background: 'var(--color-bg-secondary)',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          alignItems: 'center',
                        }}
                      >
                        <input
                          type="text"
                          className="input"
                          value={spk.name}
                          onChange={(e) => {
                            const copy = [...speakers];
                            copy[idx].name = e.target.value;
                            setSpeakers(copy);
                          }}
                          placeholder="Speaker Full Name"
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                        />
                        <input
                          type="text"
                          className="input"
                          value={spk.role}
                          onChange={(e) => {
                            const copy = [...speakers];
                            copy[idx].role = e.target.value;
                            setSpeakers(copy);
                          }}
                          placeholder="Title / Company"
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                        />
                        <input
                          type="text"
                          className="input"
                          value={spk.topic || ''}
                          onChange={(e) => {
                            const copy = [...speakers];
                            copy[idx].topic = e.target.value;
                            setSpeakers(copy);
                          }}
                          placeholder="Keynote Topic"
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                        />
                        <button
                          type="button"
                          className={styles.rowBtn}
                          style={{ color: 'var(--brand-red)' }}
                          onClick={() => setSpeakers(speakers.filter((_, i) => i !== idx))}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 5: FAQ EDITOR ── */}
            {activeTab === 'faq' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Frequently asked questions displayed as interactive accordions on the public event page.
                </p>

                {/* FAQ List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--color-bg-secondary)',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-red)' }}>
                          FAQ #{idx + 1}
                        </span>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            disabled={idx === 0}
                            onClick={() => handleMoveFaq(idx, 'up')}
                          >
                            ↑ Move Up
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            disabled={idx === faqs.length - 1}
                            onClick={() => handleMoveFaq(idx, 'down')}
                          >
                            ↓ Move Down
                          </button>
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => handleRemoveFaq(idx)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input
                          type="text"
                          className="input"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...faqs];
                            updated[idx].question = e.target.value;
                            setFaqs(updated);
                          }}
                          placeholder="Question"
                        />
                        <textarea
                          className="input"
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const updated = [...faqs];
                            updated[idx].answer = e.target.value;
                            setFaqs(updated);
                          }}
                          placeholder="Answer"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New FAQ Card */}
                <div
                  style={{
                    background: 'var(--color-bg)',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    border: '1px dashed var(--color-border-strong)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    marginTop: '0.5rem',
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>+ Add New Question & Answer</h4>
                  <input
                    type="text"
                    className="input"
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    placeholder="Enter question, e.g. Do I need to be a CS major to join?"
                  />
                  <textarea
                    className="input"
                    rows={2}
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    placeholder="Enter authoritative answer..."
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ alignSelf: 'flex-start', fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                    onClick={handleAddFaq}
                  >
                    Add FAQ to Event
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 6: REGISTRATION & GATE ── */}
            {activeTab === 'registration' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div
                  style={{
                    padding: '1.25rem',
                    background: formData.registrationOpen ? 'rgba(22, 163, 74, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    border: `1px solid ${formData.registrationOpen ? '#16a34a' : 'var(--brand-red)'}`,
                    borderRadius: '8px',
                  }}
                >
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: formData.registrationOpen ? '#15803d' : 'var(--brand-red)' }}>
                    Gate Status: {formData.registrationOpen ? 'OPEN (Accepting Attendee Registrations)' : 'CLOSED (Blocked)'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {formData.registrationOpen
                      ? 'The public website registration button is live. Students can register and will receive confirmed digital passes.'
                      : 'Public registrations are strictly rejected. The register form will display a closed notice.'}
                  </p>
                  <div style={{ marginTop: '1rem' }}>
                    <button
                      type="button"
                      className={formData.registrationOpen ? 'btn btn-secondary' : 'btn btn-primary'}
                      onClick={() => setFormData({ ...formData, registrationOpen: !formData.registrationOpen })}
                    >
                      {formData.registrationOpen ? '🔒 Change to Registration Closed' : '🔓 Change to Registration Open'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Total Seat Capacity (0 = Unlimited)</label>
                    <input
                      type="number"
                      min="0"
                      className="input"
                      value={formData.capacity || 0}
                      onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      When attendee count reaches this limit, registration state automatically shifts to &quot;Registration Full&quot;.
                    </span>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Registration Cutoff Deadline</label>
                    <input
                      type="datetime-local"
                      className="input"
                      value={formData.registrationDeadline || ''}
                      onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      After this date and time, the public gate automatically blocks submissions.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 7: SEO & PUBLISHING ── */}
            {activeTab === 'seo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Custom SEO Page Title</label>
                  <input
                    type="text"
                    className="input"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={formData.title || 'Event Title | GWD'}
                    maxLength={70}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {seoTitle.length}/70 characters (Google search result title)
                  </span>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Meta Description (Max 160 characters)</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    placeholder={formData.shortDescription || 'Event summary for search engines...'}
                    maxLength={160}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {seoDesc.length}/160 characters
                  </span>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Social Sharing OG Image URL</label>
                  <input
                    type="text"
                    className="input"
                    value={seoOgImage}
                    onChange={(e) => setSeoOgImage(e.target.value)}
                    placeholder={formData.image || 'https://...'}
                  />
                </div>

                {/* Google Snippet Search Preview */}
                <div
                  style={{
                    background: '#1a1a1a',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>
                    Google Search Result Live Preview
                  </span>
                  <div style={{ marginTop: '0.4rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#6ee7b7' }}>
                      https://gwd-club.com/events/{formData.id || 'slug'}
                    </div>
                    <div style={{ fontSize: '1.1rem', color: '#93c5fd', fontWeight: 600, marginTop: '0.15rem' }}>
                      {seoTitle || formData.title || 'Untitled Event | GWD — Get Work Done'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#d1d5db', marginTop: '0.25rem', lineHeight: 1.4 }}>
                      {seoDesc || formData.shortDescription || 'Event description and register details for student builders...'}
                    </div>
                  </div>
                </div>

                {/* Publication Lifecycle */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                  <label className="label">Publication Lifecycle Status</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'Draft' })}
                      className={formData.status === 'Draft' ? 'btn btn-primary' : 'btn btn-secondary'}
                      style={{ flex: 1 }}
                    >
                      Draft (Private Admin Preview Only)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'Published' })}
                      className={formData.status === 'Published' ? 'btn btn-primary' : 'btn btn-secondary'}
                      style={{ flex: 1, background: formData.status === 'Published' ? '#16a34a' : undefined, borderColor: formData.status === 'Published' ? '#16a34a' : undefined }}
                    >
                      Published (Live on Public Events Page)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div
            className={styles.modalFooter}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--color-border)',
              padding: '1rem 1.5rem',
            }}
          >
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsConfirmDeleteOpen(true)}
                  className="btn btn-secondary"
                  style={{ color: 'var(--brand-red)', borderColor: 'var(--brand-red)' }}
                >
                  🗑 Delete Event
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSaving}>
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleSubmit('Draft')}
                disabled={isSaving}
              >
                Save as Draft
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSubmit('Published')}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Publish Event →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Library Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        title="Select Event Poster / Hero Asset"
        onSelect={(url) => setFormData((prev) => ({ ...prev, image: url }))}
        onClose={() => setIsMediaPickerOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        title="Delete Event"
        message={`Are you sure you want to permanently delete "${formData.title}"? This cannot be undone.`}
        confirmLabel="Yes, Delete Event"
        isDestructive={true}
        onConfirm={() => {
          if (formData.id) {
            deleteEvent(formData.id);
            addAuditLog({
              action: 'DELETE_EVENT',
              targetType: 'EVENT',
              targetId: formData.id,
              user: 'admin@gwd-club.com',
              details: `Event "${formData.title}" deleted.`,
              status: 'warning',
            });
            setIsConfirmDeleteOpen(false);
            onClose();
          }
        }}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />
    </>
  );
}
