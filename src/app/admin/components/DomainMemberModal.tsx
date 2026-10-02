'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DomainMember } from '@/lib/cms';
import { compressImageFile } from '@/lib/mediaUtils';
import MediaPickerModal from './MediaPickerModal';
import styles from '../admin.module.css';

interface DomainMemberModalProps {
  isOpen: boolean;
  member: DomainMember | null;
  isNew?: boolean;
  domainName: string;
  onClose: () => void;
  onSave: (member: DomainMember) => void;
}

export default function DomainMemberModal({
  isOpen,
  member,
  isNew = false,
  domainName,
  onClose,
  onSave,
}: DomainMemberModalProps) {
  const [formData, setFormData] = useState<Partial<DomainMember>>({
    name: '',
    role: '',
    photo: '',
    bio: '',
    skills: [],
    deliverables: [],
    projects: [],
    active: true,
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (member) {
      setFormData({
        id: member.id,
        name: member.name || '',
        role: member.role || '',
        photo: member.photo || '',
        bio: member.bio || '',
        skills: member.skills || [],
        deliverables: member.deliverables || [],
        projects: member.projects || [],
        active: member.active !== false,
      });
      setSkillsInput((member.skills || []).join(', '));
      setError(null);
      setSaveStatus(null);
    } else {
      setFormData({
        id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: '',
        role: '',
        photo: '',
        bio: '',
        skills: [],
        deliverables: [],
        projects: [],
        active: true,
      });
      setSkillsInput('');
      setError(null);
      setSaveStatus(null);
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImageFile(file, 800, 800, 0.82);
      setFormData((prev) => ({ ...prev, photo: compressedDataUrl }));
    } catch {
      setError('Unable to compress profile photo. Please try a different image.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError('Member name is required.');
      return;
    }
    if (!formData.role?.trim()) {
      setError('Role title is required.');
      return;
    }

    const skillsArray = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const finalizedMember: DomainMember = {
      id: formData.id || `mem-${Date.now()}`,
      name: formData.name.trim(),
      role: formData.role.trim(),
      photo: formData.photo || '',
      bio: formData.bio?.trim() || '',
      skills: skillsArray,
      deliverables: formData.deliverables || [],
      projects: formData.projects || [],
      active: formData.active !== false,
    };

    setSaveStatus('Saving member...');
    setTimeout(() => {
      onSave(finalizedMember);
      onClose();
    }, 250);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>
              {isNew ? `Add Member to ${domainName}` : `Edit Member: ${formData.name || 'Member'}`}
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Operational roster record for public /explore and domain workspace.
            </p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.85rem',
            }}>
              {error}
            </div>
          )}

          {saveStatus && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.85rem',
            }}>
              {saveStatus}
            </div>
          )}

          {/* Member Photo Preview & Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1rem',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              background: 'var(--color-bg-secondary)',
              border: '2px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt={formData.name || 'Preview'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '1.5rem', opacity: 0.4 }}>👤</span>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                Profile Photo
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.65rem' }}>
                {isCompressing ? 'Compressing image...' : 'Compressed automatically to protect storage quota.'}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  disabled={isCompressing}
                >
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  Media Library
                </button>
                {formData.photo && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, photo: '' }))}
                    className="btn btn-ghost"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: '#ef4444' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Basic Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">
                Full Name <span style={{ color: 'var(--brand-red)' }}>*</span>
              </label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Chen"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">
                Role Title <span style={{ color: 'var(--brand-red)' }}>*</span>
              </label>
              <input
                type="text"
                className="input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Lead Systems Architect"
                required
              />
            </div>
          </div>

          {/* Member Bio */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label">Biography & Focus</label>
            <textarea
              className="input"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief summary of domain contributions and technical focus..."
            />
          </div>

          {/* Skills */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label">Core Skills / Deliverables (comma-separated)</label>
            <input
              type="text"
              className="input"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, Next.js, Cloudflare Workers, Tailwind"
            />
          </div>

          {/* Active Status Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Active Member</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Inactive members are hidden from the public roster while preserving records.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, active: !prev.active }))}
              style={{
                background: formData.active ? '#10b981' : '#6b7280',
                color: '#fff',
                border: 'none',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {formData.active ? 'ACTIVE' : 'INACTIVE'}
            </button>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isNew ? 'Add Member' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Media Picker Modal */}
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={(url) => {
            setFormData((prev) => ({ ...prev, photo: url }));
            setIsMediaPickerOpen(false);
          }}
        />
      </div>
    </div>
  );
}
