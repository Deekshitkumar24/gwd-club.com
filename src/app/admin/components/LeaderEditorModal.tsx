'use client';

import React, { useState, useEffect } from 'react';
import { LeaderSlot } from '@/data/content';
import { useCms } from '@/context/CmsContext';
import MediaPickerModal from './MediaPickerModal';
import styles from '../admin.module.css';

interface LeaderEditorModalProps {
  isOpen: boolean;
  leader: LeaderSlot | null;
  onClose: () => void;
  onSaved?: (leader: LeaderSlot) => void;
}

export default function LeaderEditorModal({
  isOpen,
  leader,
  onClose,
  onSaved,
}: LeaderEditorModalProps) {
  const { updateLeader } = useCms();

  const [formData, setFormData] = useState<Partial<LeaderSlot>>({});
  const [deliverablesText, setDeliverablesText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [socials, setSocials] = useState<{ github?: string; linkedin?: string; twitter?: string; instagram?: string }>({});
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (leader) {
      setFormData({
        name: leader.name,
        role: leader.role,
        bio: leader.bio,
        quote: leader.quote || '',
        photo: leader.photo || '',
        hasCustomPhoto: leader.hasCustomPhoto,
      });
      setDeliverablesText((leader.deliverables || []).join('\n'));
      setSkillsText((leader.skills || []).join(', '));
      setSocials({
        github: leader.socials?.github || '',
        linkedin: leader.socials?.linkedin || '',
        twitter: leader.socials?.twitter || '',
        instagram: leader.socials?.instagram || '',
      });
      setSaveStatus(null);
    }
  }, [leader]);

  if (!isOpen || !leader) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Leader name is required.');
      return;
    }

    const updatedDeliverables = deliverablesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedSocials: Record<string, string> = {};
    if (socials.github?.trim()) updatedSocials.github = socials.github.trim();
    if (socials.linkedin?.trim()) updatedSocials.linkedin = socials.linkedin.trim();
    if (socials.twitter?.trim()) updatedSocials.twitter = socials.twitter.trim();
    if (socials.instagram?.trim()) updatedSocials.instagram = socials.instagram.trim();

    const patch: Partial<LeaderSlot> = {
      name: formData.name,
      role: formData.role || leader.role,
      bio: formData.bio || '',
      quote: formData.quote || '',
      photo: formData.photo || '',
      hasCustomPhoto: Boolean(formData.photo && formData.photo.trim().length > 0),
      deliverables: updatedDeliverables.length ? updatedDeliverables : leader.deliverables,
      skills: updatedSkills,
      socials: updatedSocials,
    };

    updateLeader(leader.id, patch);
    setSaveStatus('Changes saved successfully!');
    if (onSaved) {
      onSaved({ ...leader, ...patch });
    }
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <>
      <div
        className={styles.modalOverlay}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leader-editor-title"
      >
        <div
          className={styles.modalContent}
          style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modalHeader}>
            <div>
              <span className={styles.codeBadge}>Slot 0{leader.slot}</span>
              <h3 id="leader-editor-title" className={styles.modalTitle} style={{ marginTop: '0.35rem' }}>
                Edit Leadership Profile: {leader.role}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0 0' }}>
                Updates will immediately reflect on the public Team page and Explore domain leadership tiers.
              </p>
            </div>
            <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Photo Section */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', background: '#222', border: '2px solid var(--color-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt={formData.name || leader.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                    {leader.name ? leader.name[0] : 'G'}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Official Profile Photo</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                  {formData.photo ? 'Custom verified photo set.' : 'Currently using approved GWD geometric placeholder.'}
                </span>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                  >
                    Select or Upload Photo...
                  </button>
                  {formData.photo && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, photo: '', hasCustomPhoto: false }))}
                      className={styles.deleteBtn}
                      style={{ fontSize: '0.8rem' }}
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Core Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Official Role Title *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Biography *</label>
              <textarea
                className="input"
                rows={3}
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="High-conviction narrative and leadership scope..."
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Quote / Conviction</label>
              <input
                type="text"
                className="input"
                value={formData.quote || ''}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                placeholder="e.g. Ideas are worthless until they are built and shipped."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Deliverables (one per line)</label>
                <textarea
                  className="input"
                  rows={4}
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  placeholder="GWD Direction&#10;Architecture&#10;Culture"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Specialized Skills (comma-separated)</label>
                <textarea
                  className="input"
                  rows={4}
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="Full-Stack, Next.js, System Architecture, UI/UX"
                />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                Profile & Social Links
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input
                  type="url"
                  className="input"
                  placeholder="LinkedIn URL (https://...)"
                  value={socials.linkedin || ''}
                  onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                />
                <input
                  type="url"
                  className="input"
                  placeholder="GitHub URL (https://...)"
                  value={socials.github || ''}
                  onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                />
                <input
                  type="url"
                  className="input"
                  placeholder="Twitter / X URL (https://...)"
                  value={socials.twitter || ''}
                  onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                />
                <input
                  type="url"
                  className="input"
                  placeholder="Instagram URL (https://...)"
                  value={socials.instagram || ''}
                  onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                />
              </div>
            </div>

            {saveStatus && (
              <div style={{ padding: '0.6rem 0.9rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '4px', fontSize: '0.85rem' }}>
                ✓ {saveStatus}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        title={`Select Photo for ${leader.name}`}
        onSelect={(url) => {
          setFormData((prev) => ({ ...prev, photo: url, hasCustomPhoto: true }));
          setIsMediaPickerOpen(false);
        }}
        onClose={() => setIsMediaPickerOpen(false)}
      />
    </>
  );
}
