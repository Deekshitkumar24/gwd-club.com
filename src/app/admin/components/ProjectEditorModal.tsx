'use client';

import React, { useState, useEffect } from 'react';
import { ProjectItem } from '@/data/content';
import { useCms } from '@/context/CmsContext';
import MediaPickerModal from './MediaPickerModal';
import ConfirmModal from './ConfirmModal';
import styles from '../admin.module.css';

interface ProjectEditorModalProps {
  isOpen: boolean;
  project: ProjectItem | null; // null for new project
  onClose: () => void;
  onSaved?: (project: ProjectItem) => void;
}

export default function ProjectEditorModal({
  isOpen,
  project,
  onClose,
  onSaved,
}: ProjectEditorModalProps) {
  const { createProject, updateProject, deleteProject } = useCms();

  const isEditing = Boolean(project);
  const [formData, setFormData] = useState<Partial<ProjectItem>>({});
  const [tagsText, setTagsText] = useState('');
  const [collabText, setCollabText] = useState('');
  const [activeMediaTarget, setActiveMediaTarget] = useState<'hero' | 'before' | 'after' | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        id: project.id,
        title: project.title,
        year: project.year,
        category: project.category,
        shortDescription: project.shortDescription,
        description: project.description,
        outcome: project.outcome,
        heroImage: project.heroImage,
        beforeImage: project.beforeImage || '',
        afterImage: project.afterImage || '',
        link: project.link || '',
        featured: project.featured || false,
      });
      setTagsText((project.tags || []).join(', '));
      setCollabText((project.collaborators || []).join(', '));
    } else {
      setFormData({
        id: `project-${Date.now().toString(36)}`,
        title: '',
        year: new Date().getFullYear().toString(),
        category: 'Digital Infrastructure',
        shortDescription: '',
        description: '',
        outcome: '',
        heroImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80',
        beforeImage: '',
        afterImage: '',
        link: '',
        featured: false,
      });
      setTagsText('Production, Web Platform, Architecture');
      setCollabText('GWD Labs');
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Project title is required.');
      return;
    }

    const projectId = formData.id?.trim() || `proj-${Date.now().toString(36)}`;
    const parsedTags = tagsText.split(',').map((t) => t.trim()).filter(Boolean);
    const parsedCollabs = collabText.split(',').map((c) => c.trim()).filter(Boolean);

    const projectPayload: ProjectItem = {
      id: projectId,
      title: formData.title.trim(),
      year: formData.year || '2025',
      category: formData.category || 'Digital Infrastructure',
      shortDescription: formData.shortDescription || '',
      description: formData.description || '',
      outcome: formData.outcome || '',
      heroImage: formData.heroImage || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80',
      beforeImage: formData.beforeImage || undefined,
      afterImage: formData.afterImage || undefined,
      images: [formData.heroImage || ''].filter(Boolean),
      tags: parsedTags.length ? parsedTags : ['GWD Build'],
      collaborators: parsedCollabs,
      partners: parsedCollabs,
      link: formData.link || '#',
      featured: formData.featured || false,
    };

    if (isEditing && project) {
      updateProject(project.id, projectPayload);
    } else {
      createProject(projectPayload);
    }

    if (onSaved) onSaved(projectPayload);
    onClose();
  };

  const handleDelete = () => {
    if (!project) return;
    deleteProject(project.id);
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
        aria-labelledby="project-editor-title"
      >
        <div
          className={styles.modalContent}
          style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modalHeader}>
            <div>
              <span className={styles.codeBadge}>{isEditing ? `Editing ${project?.id}` : 'New Build'}</span>
              <h3 id="project-editor-title" className={styles.modalTitle} style={{ marginTop: '0.35rem' }}>
                {isEditing ? `Edit Project: ${project?.title}` : 'Add Shipped Work / Platform Venture'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0 0' }}>
                Manage project case studies, metrics, outcomes, and deliverable before/after captures.
              </p>
            </div>
            <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Title & Slug */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Project Title *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Hyderabad Super League OS"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Identifier / Slug *</label>
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

            {/* Category, Year, Featured */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '1rem', alignItems: 'center' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={formData.category || 'Digital Infrastructure'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Digital Infrastructure">Digital Infrastructure</option>
                  <option value="Real-Time Systems">Real-Time Systems</option>
                  <option value="Creative Direction">Creative Direction</option>
                  <option value="Brand Systems">Brand Systems</option>
                  <option value="Applied AI">Applied AI</option>
                  <option value="Enterprise Platform">Enterprise Platform</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Launch Year</label>
                <input
                  type="text"
                  className="input"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.4rem' }}>
                <input
                  type="checkbox"
                  id="proj-featured"
                  checked={Boolean(formData.featured)}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                />
                <label htmlFor="proj-featured" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  Feature on Homepage
                </label>
              </div>
            </div>

            {/* Descriptions */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Short Summary (Teaser on cards) *</label>
              <input
                type="text"
                className="input"
                value={formData.shortDescription || ''}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="High-impact one-liner about the product and architecture..."
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Full Case Study Narrative</label>
              <textarea
                className="input"
                rows={4}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed context: problem solved, architectural approach, and operational scale..."
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Measured Outcome & Impact *</label>
              <input
                type="text"
                className="input"
                value={formData.outcome || ''}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                placeholder="e.g. ₹1.25L Current MRR · 10 Active Football Clubs · 1 Live League"
                required
              />
            </div>

            {/* Media Images */}
            <div style={{ background: 'var(--color-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
                Visual Artifacts & Hero Imagery
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Hero / Cover Image *</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="input"
                      value={formData.heroImage || ''}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      placeholder="Image URL..."
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setActiveMediaTarget('hero')}
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                    >
                      Media...
                    </button>
                  </div>
                  {formData.heroImage && (
                    <img
                      src={formData.heroImage}
                      alt="Hero preview"
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginTop: '0.5rem' }}
                    />
                  )}
                </div>

                <div>
                  <label className="label">External / Live System Link</label>
                  <input
                    type="url"
                    className="input"
                    value={formData.link || ''}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://..."
                  />
                  <div style={{ marginTop: '0.75rem' }}>
                    <label className="label">Tags (comma-separated)</label>
                    <input
                      type="text"
                      className="input"
                      value={tagsText}
                      onChange={(e) => setTagsText(e.target.value)}
                      placeholder="Sports OS, Next.js, Real-time"
                    />
                  </div>
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
                  Delete Project
                </button>
              ) : (
                <div />
              )}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <MediaPickerModal
        isOpen={Boolean(activeMediaTarget)}
        title="Select Project Image"
        onSelect={(url) => {
          if (activeMediaTarget === 'hero') {
            setFormData((prev) => ({ ...prev, heroImage: url }));
          }
          setActiveMediaTarget(null);
        }}
        onClose={() => setActiveMediaTarget(null)}
      />

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        title={`Delete Project "${project?.title}"?`}
        message="This action will permanently remove this project case study from the public Work showcase and CMS. This cannot be undone."
        confirmLabel="Yes, Delete Project"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />
    </>
  );
}
