'use client';

import React, { useState, useRef } from 'react';
import { useCms } from '@/context/CmsContext';
import { MediaRecord } from '@/lib/cms';
import { compressImageFile } from '@/lib/mediaUtils';
import styles from '../admin.module.css';

interface MediaPickerModalProps {
  isOpen: boolean;
  title?: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function MediaPickerModal({
  isOpen,
  title = 'Select Media Asset',
  onSelect,
  onClose,
}: MediaPickerModalProps) {
  const { store, addMedia } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const mediaList = store.media || [];

  const filteredMedia = mediaList.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = categoryFilter === 'all' || m.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    compressImageFile(file, 1200, 1200, 0.82)
      .then((dataUrl) => {
        const sizeKb = Math.round(dataUrl.length * 0.75 / 1024);
        const sizeStr = `${sizeKb} KB`;

        const newRecord: MediaRecord = {
          id: `media-${Date.now().toString(36)}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: dataUrl,
          type: 'image',
          category: 'gallery',
          size: sizeStr,
          uploadedAt: new Date().toISOString(),
          tags: ['uploaded', 'admin-picker'],
        };

        addMedia(newRecord);
        setIsUploading(false);
        onSelect(dataUrl);
        onClose();
      })
      .catch((err) => {
        console.error('Image compression error:', err);
        setIsUploading(false);
        alert('Failed to process image file.');
      });
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-picker-title"
    >
      <div
        className={styles.modalContent}
        style={{ maxWidth: '840px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <h3 id="media-picker-title" className={styles.modalTitle}>{title}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0 0' }}>
              Choose an existing asset from the GWD Media Library or upload a new image.
            </p>
          </div>
          <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Filter & Upload Toolbar */}
        <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Search media by name or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
            <select
              className={styles.formSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: '140px', fontSize: '0.85rem' }}
            >
              <option value="all">All Categories</option>
              <option value="team">Team</option>
              <option value="events">Events</option>
              <option value="work">Work</option>
              <option value="domains">Domains</option>
              <option value="gallery">Gallery</option>
              <option value="homepage">Homepage</option>
              <option value="timeline">Timeline</option>
            </select>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <button
              type="button"
              className="btn btn-primary"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
            >
              {isUploading ? 'Uploading...' : '📁 Upload New File'}
            </button>
          </div>
        </div>

        {/* Media Grid */}
        <div style={{ overflowY: 'auto', padding: '1.25rem 1.5rem', flex: 1 }}>
          {filteredMedia.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>No matching media assets found</p>
              <p style={{ fontSize: '0.85rem' }}>Upload a file above or clear your search filter.</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '1rem',
              }}
            >
              {filteredMedia.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    onSelect(m.url);
                    onClose();
                  }}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'var(--color-bg-secondary)',
                    transition: 'transform 0.15s ease, border-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--brand-red)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.transform = 'none';
                  }}
                  title={`Click to select: ${m.name}`}
                >
                  <div style={{ height: '90px', width: '100%', overflow: 'hidden', background: '#000', position: 'relative' }}>
                    <img
                      src={m.url}
                      alt={m.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ padding: '0.4rem 0.5rem' }}>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {m.name}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                      <span style={{ textTransform: 'capitalize' }}>{m.category}</span>
                      <span>{m.size || ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.modalFooter} style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
