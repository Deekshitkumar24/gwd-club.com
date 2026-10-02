'use client';

import React, { useState, useEffect } from 'react';
import { useCms } from '@/context/CmsContext';
import { PageSeoRecord, DEFAULT_SEO_PAGES } from '@/lib/cms';
import MediaPickerModal from './MediaPickerModal';
import styles from '../admin.module.css';

const SEO_PAGES_META = [
  { key: 'global', label: 'Site-Wide Global Defaults', path: '/*' },
  { key: 'home', label: 'Homepage', path: '/' },
  { key: 'about', label: 'About GWD', path: '/about' },
  { key: 'team', label: 'Team & Leadership', path: '/team' },
  { key: 'domains', label: 'Domains & Explore', path: '/explore' },
  { key: 'work', label: 'Works & Case Studies', path: '/work' },
  { key: 'events', label: 'Events & Summits', path: '/events' },
  { key: 'gallery', label: 'Visual Archive & Gallery', path: '/gallery' },
  { key: 'collaborations', label: 'Collaborations & Alliances', path: '/collaborations' },
  { key: 'join', label: 'Join GWD Application', path: '/join' },
  { key: 'contact', label: 'Contact & Inquiries', path: '/contact' },
];

export default function SeoManager() {
  const { store, updatePageSeo } = useCms();
  const [selectedKey, setSelectedKey] = useState<string>('home');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const currentSeoPages = store.settings.seoPages || DEFAULT_SEO_PAGES;
  const activeRecord: PageSeoRecord =
    currentSeoPages[selectedKey] ||
    DEFAULT_SEO_PAGES[selectedKey] || {
      pageKey: selectedKey,
      pageTitle: selectedKey,
      seoTitle: '',
      metaDescription: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '/brand/gwd-logo.png',
    };

  const [formData, setFormData] = useState<PageSeoRecord>(activeRecord);

  useEffect(() => {
    const rec = currentSeoPages[selectedKey] || DEFAULT_SEO_PAGES[selectedKey];
    if (rec) {
      setFormData(rec);
    }
    setSaveStatus(null);
  }, [selectedKey, currentSeoPages]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePageSeo(selectedKey, formData);
    setSaveStatus('SEO configuration updated & saved successfully!');
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  const activePageMeta = SEO_PAGES_META.find((p) => p.key === selectedKey) || SEO_PAGES_META[0];

  const titleLength = formData.seoTitle?.length || 0;
  const descLength = formData.metaDescription?.length || 0;

  return (
    <div className={styles.tabPane}>
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>Search Engine Optimization & Social Sharing</h1>
          <p className={styles.tabDesc}>
            Manage per-page meta tags, OpenGraph previews, and Google indexing without modifying code.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Page Selector Sidebar */}
        <div className={styles.tableCard} style={{ padding: '0.75rem' }}>
          <div style={{ padding: '0.5rem 0.75rem', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            SELECT ROUTE / PAGE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {SEO_PAGES_META.map((p) => {
              const isSelected = p.key === selectedKey;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setSelectedKey(p.key)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--color-bg-secondary)' : 'transparent',
                    border: isSelected ? '1px solid var(--brand-red)' : '1px solid transparent',
                    color: isSelected ? 'var(--color-text)' : 'var(--color-text-secondary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.label}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {p.path}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SEO Editor & Preview Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Live Previews Panel */}
          <div className={styles.tableCard} style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Google Search Snippet Preview
            </h3>
            
            {/* Google Search Result Card */}
            <div style={{
              background: '#202124',
              borderRadius: '8px',
              padding: '1.25rem',
              border: '1px solid #3c4043',
              maxWidth: '680px',
              fontFamily: 'arial, sans-serif',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#303134',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#fff',
                }}>
                  G
                </span>
                <span style={{ fontSize: '12px', color: '#bdc1c6' }}>
                  https://gwd-club.com {activePageMeta.path !== '/*' ? activePageMeta.path : ''}
                </span>
              </div>
              <h4 style={{
                color: '#8ab4f8',
                fontSize: '18px',
                lineHeight: '1.3',
                margin: '0.25rem 0 0.35rem 0',
                fontWeight: 400,
                cursor: 'pointer',
                textDecoration: 'none',
              }}>
                {formData.seoTitle || 'Page Title Not Defined'}
              </h4>
              <p style={{
                color: '#bdc1c6',
                fontSize: '13px',
                lineHeight: '1.45',
                margin: 0,
              }}>
                {formData.metaDescription || 'No meta description provided. Search engines will generate a fallback snippet from page content.'}
              </p>
            </div>

            {/* Social Share Preview Card */}
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '1.5rem 0 1rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Social Share (Open Graph) Preview
            </h3>
            <div style={{
              maxWidth: '520px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
            }}>
              <div style={{
                width: '100%',
                height: '200px',
                background: 'var(--color-bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {formData.ogImage ? (
                  <img
                    src={formData.ogImage}
                    alt={formData.ogTitle || 'OG Preview'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No OG Image Set</span>
                )}
              </div>
              <div style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  gwd-club.com
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0.25rem 0 0.35rem 0' }}>
                  {formData.ogTitle || formData.seoTitle || 'Social Title'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {formData.ogDescription || formData.metaDescription || 'Social description summary...'}
                </div>
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <form onSubmit={handleSave} className={styles.tableCard} style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.15rem' }}>
                  Configuring SEO: {activePageMeta.label}
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--brand-red)' }}>
                  Route: {activePageMeta.path}
                </span>
              </div>
              <button type="submit" className="btn btn-primary">
                Save SEO Settings
              </button>
            </div>

            {saveStatus && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}>
                ✓ {saveStatus}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* SEO Title */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="label" style={{ margin: 0 }}>
                    Page SEO Title *
                  </label>
                  <span style={{
                    fontSize: '0.75rem',
                    color: titleLength > 60 ? '#f87171' : titleLength >= 40 ? '#34d399' : 'var(--color-text-muted)',
                  }}>
                    {titleLength}/60 chars {titleLength > 60 ? '(Too long for Google snippet)' : ''}
                  </span>
                </div>
                <input
                  type="text"
                  className="input"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="e.g. Events & Builder Summits | GWD Collective"
                  required
                />
              </div>

              {/* Meta Description */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="label" style={{ margin: 0 }}>
                    Meta Description *
                  </label>
                  <span style={{
                    fontSize: '0.75rem',
                    color: descLength > 160 ? '#f87171' : descLength >= 120 ? '#34d399' : 'var(--color-text-muted)',
                  }}>
                    {descLength}/160 chars {descLength > 160 ? '(May be truncated by Google)' : ''}
                  </span>
                </div>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="Concise 140-160 character summary describing this page for search engines..."
                  required
                />
              </div>

              {/* Social Sharing Title & Description */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Social Sharing (OG) Title</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.ogTitle}
                    onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                    placeholder="Defaults to SEO Title if empty"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Social Sharing Image URL</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="input"
                      value={formData.ogImage}
                      onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                      placeholder="/brand/gwd-logo.png"
                    />
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                    >
                      Browse
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Social Sharing (OG) Description</label>
                <textarea
                  className="input"
                  rows={2}
                  value={formData.ogDescription}
                  onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                  placeholder="Summary text when link is shared on Twitter, LinkedIn, or WhatsApp..."
                />
              </div>

              {/* Indexing & Canonical Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Canonical URL (Optional)</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.canonicalUrl || ''}
                    onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                    placeholder="https://gwd-club.com/..."
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Google Indexing</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      {formData.noIndex ? 'Page is NOINDEX (hidden from search)' : 'Page is INDEX (visible to Google)'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, noIndex: !formData.noIndex })}
                    style={{
                      background: formData.noIndex ? '#ef4444' : '#10b981',
                      color: '#fff',
                      border: 'none',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {formData.noIndex ? 'NOINDEX' : 'INDEX'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  Save Changes for {activePageMeta.label}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => {
          setFormData((prev) => ({ ...prev, ogImage: url }));
          setIsMediaPickerOpen(false);
        }}
      />
    </div>
  );
}
