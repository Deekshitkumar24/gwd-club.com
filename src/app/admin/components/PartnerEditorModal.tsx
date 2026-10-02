'use client';

import React, { useState, useEffect } from 'react';
import { CollaborationItem } from '@/data/content';
import { useCms } from '@/context/CmsContext';
import MediaPickerModal from './MediaPickerModal';
import ConfirmModal from './ConfirmModal';
import styles from '../admin.module.css';

interface PartnerEditorModalProps {
  isOpen: boolean;
  partner: CollaborationItem | null; // null for new
  onClose: () => void;
  onSaved?: (partner: CollaborationItem) => void;
}

export default function PartnerEditorModal({
  isOpen,
  partner,
  onClose,
  onSaved,
}: PartnerEditorModalProps) {
  const { createCollaboration, updateCollaboration, deleteCollaboration } = useCms();

  const isEditing = Boolean(partner);
  const [formData, setFormData] = useState<Partial<CollaborationItem>>({});
  const [activeMediaTarget, setActiveMediaTarget] = useState<'logo' | 'image' | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (partner) {
      setFormData({
        id: partner.id,
        name: partner.name,
        type: partner.type,
        year: partner.year,
        description: partner.description,
        outcome: partner.outcome,
        logo: partner.logo,
        image: partner.image,
        featured: partner.featured || false,
      });
    } else {
      setFormData({
        id: `partner-${Date.now().toString(36)}`,
        name: '',
        type: 'Institutional Partner',
        year: `${new Date().getFullYear()}–Present`,
        description: '',
        outcome: '',
        logo: '/logos/gwd-badge.png',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
        featured: false,
      });
    }
  }, [partner, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Partner name is required.');
      return;
    }

    const partnerId = formData.id?.trim() || `partner-${Date.now().toString(36)}`;
    const payload: CollaborationItem = {
      id: partnerId,
      name: formData.name.trim(),
      type: formData.type || 'Institutional Partner',
      year: formData.year || '2025–Present',
      description: formData.description || '',
      outcome: formData.outcome || '',
      logo: formData.logo || '/logos/gwd-badge.png',
      image: formData.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
      featured: Boolean(formData.featured),
    };

    if (isEditing && partner) {
      updateCollaboration(partner.id, payload);
    } else {
      createCollaboration(payload);
    }

    if (onSaved) onSaved(payload);
    onClose();
  };

  const handleDelete = () => {
    if (!partner) return;
    deleteCollaboration(partner.id);
    setIsConfirmDeleteOpen(false);
    onClose();
  };

  return (
    <>
      <div
        className={styles.modalOverlay}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-editor-title"
      >
        <div
          className={styles.modalContent}
          style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modalHeader}>
            <div>
              <span className={styles.codeBadge}>{isEditing ? `Editing ${partner?.id}` : 'New Alliance'}</span>
              <h3 id="partner-editor-title" className={styles.modalTitle} style={{ marginTop: '0.35rem' }}>
                {isEditing ? `Edit Partner: ${partner?.name}` : 'Add Institutional Partner / Alliance'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0 0' }}>
                Partnership records populate the public /collaborations ecosystem showcase.
              </p>
            </div>
            <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Organization / Partner Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hyderabad Super League"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Alliance Slug / ID *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.id || ''}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={isEditing}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '1rem', alignItems: 'center' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Alliance Type</label>
                <select
                  className="input"
                  value={formData.type || 'Institutional Partner'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Sports OS & League Partner">Sports OS & League Partner</option>
                  <option value="Government & Innovation Body">Government & Innovation Body</option>
                  <option value="Institutional Partner">Institutional Partner</option>
                  <option value="Academic & Incubation Partner">Academic & Incubation Partner</option>
                  <option value="Venture / Commercial Client">Venture / Commercial Client</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Tenure / Years</label>
                <input
                  type="text"
                  className="input"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2025–Present"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.4rem' }}>
                <input
                  type="checkbox"
                  id="part-featured"
                  checked={Boolean(formData.featured)}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                />
                <label htmlFor="part-featured" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  Feature on Landing
                </label>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Description of Collaboration *</label>
              <textarea
                className="input"
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Scope of work, integration, and joint engineering initiatives..."
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Delivered Outcome & Scale</label>
              <input
                type="text"
                className="input"
                value={formData.outcome || ''}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                placeholder="e.g. 10 clubs actively running on platform · Real-time scoring and standings"
              />
            </div>

            {/* Media: Logo & Cover */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <label className="label">Logo Image URL</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="input"
                    value={formData.logo || ''}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveMediaTarget('logo')}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
                  >
                    Pick...
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Cover / Context Image URL</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="input"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveMediaTarget('image')}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
                  >
                    Pick...
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsConfirmDeleteOpen(true)}
                  className={styles.deleteBtn}
                >
                  Delete Partner
                </button>
              ) : (
                <div />
              )}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save Changes' : 'Add Partner'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <MediaPickerModal
        isOpen={Boolean(activeMediaTarget)}
        title={`Select Partner ${activeMediaTarget === 'logo' ? 'Logo' : 'Cover Image'}`}
        onSelect={(url) => {
          if (activeMediaTarget === 'logo') {
            setFormData((prev) => ({ ...prev, logo: url }));
          } else if (activeMediaTarget === 'image') {
            setFormData((prev) => ({ ...prev, image: url }));
          }
          setActiveMediaTarget(null);
        }}
        onClose={() => setActiveMediaTarget(null)}
      />

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        title={`Delete Alliance with "${partner?.name}"?`}
        message="This will remove the organization from the public collaborations showcase."
        confirmLabel="Yes, Delete Partner"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />
    </>
  );
}
