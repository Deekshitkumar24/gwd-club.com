'use client';

import { useState } from 'react';
import { useCms } from '@/context/CmsContext';
import { GALLERY_IMAGES } from '@/data/content';
import { Component as LuminaInteractiveList } from '@/components/ui/lumina-interactive-list';
import { SmoothScrollHero } from '@/components/ui/modern-hero';
import { BorderBeam } from '@/components/ui/border-beam';
import styles from './gallery.module.css';

export default function GalleryPage() {
  const { store } = useCms();
  const galleryImages = (store.gallery ?? []).filter((i) => !i.status || i.status === 'Published');
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const categories = ['all', ...new Set(galleryImages.map((i) => i.category))];
  const filtered =
    activeCategory === 'all'
      ? galleryImages
      : galleryImages.filter((i) => i.category === activeCategory);

  return (
    <div className={styles.page} data-dye-section="gallery">
      {/* ── Upper Section: Lumina Interactive WebGL Glass Shader Slider ── */}
      <section className={styles.luminaHeroSection}>
        <LuminaInteractiveList />
      </section>

      {/* ── Lower Section: Pure Spatial Image Parallax & Expanding Center Builder Shot ── */}
      <section className={styles.modernHeroWrapper} data-dye-section="gallery">
        <SmoothScrollHero />
      </section>

      {/* ── Lower Section 2: Complete Photographic Evidence & Archive Grid ── */}
      <section className={styles.gridSection}>
        <div className={styles.gridInner}>
          <div className={styles.archiveHeaderRow}>
            <div>
              <span className="label" style={{ color: 'var(--brand-red)' }}>
                06.3 · Complete Photographic Records
              </span>
              <h2 className={styles.archiveTitle}>Moments worth remembering.</h2>
              <p className={styles.archiveSub}>
                Verified photographic record of builder sprints, grassroots sports tournaments, and campus builds.
              </p>
            </div>

            <div className={styles.filters}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'all' ? 'All Records' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid var(--color-border)', margin: '1rem 0' }}>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>No photographic records found in this category.</p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>Select another category or check back soon.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((img, i) => (
                <div
                  key={img.id || i}
                  className={styles.gridItem}
                  onClick={() => setLightbox(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setLightbox(i)}
                >
                  <img src={img.src} alt={img.caption} loading="lazy" />
                  <BorderBeam size={180} duration={14} colorFrom="#E11D48" colorTo="#8B5CF6" borderWidth={1} />
                  <div className={styles.gridItemOverlay}>
                    <span className={styles.gridCategoryBadge}>{img.category}</span>
                    <p className={styles.gridItemCaption}>{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox Modal ── */}
      {lightbox !== null && (
        <div
          className={styles.lightbox}
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button className={styles.lightboxClose} onClick={() => setLightbox(null)} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img src={filtered[lightbox].src} alt={filtered[lightbox].caption} />
            <div className={styles.lightboxMetaBar}>
              <span className={styles.gridCategoryBadge}>{filtered[lightbox].category}</span>
              <p className={styles.lightboxCaption}>{filtered[lightbox].caption}</p>
            </div>
          </div>
          <div className={styles.lightboxNav}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(lightbox > 0 ? lightbox - 1 : filtered.length - 1);
              }}
              aria-label="Previous"
            >
              ←
            </button>
            <span>{lightbox + 1} / {filtered.length}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(lightbox < filtered.length - 1 ? lightbox + 1 : 0);
              }}
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
