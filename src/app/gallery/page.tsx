'use client';

import { useState } from 'react';
import { useReveal } from '@/hooks/useAnimations';
import { GALLERY_IMAGES } from '@/data/content';
import ImageFanCarousel from '@/components/ImageFanCarousel/ImageFanCarousel';
import styles from './gallery.module.css';

export default function GalleryPage() {
  const headerReveal = useReveal();
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const categories = ['all', ...new Set(GALLERY_IMAGES.map(i => i.category))];
  const filtered = activeCategory === 'all' ? GALLERY_IMAGES : GALLERY_IMAGES.filter(i => i.category === activeCategory);

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={styles.headerInner} ref={headerReveal.ref}>
          <div className={`reveal ${headerReveal.isVisible ? 'visible' : ''}`}>
            <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-md)' }}>Gallery</p>
            <h1 className={styles.headerTitle}>Moments worth remembering.</h1>
          </div>
        </div>
      </section>

      {/* 3D Fan Carousel */}
      <section className={styles.carouselSection}>
        <div className={styles.carouselInner}>
          <ImageFanCarousel images={GALLERY_IMAGES.slice(0, 8).map(img => ({ src: img.src, caption: img.caption }))} />
        </div>
      </section>

      {/* Grid Gallery */}
      <section className={styles.gridSection}>
        <div className={styles.gridInner}>
          <div className={styles.filters}>
            {categories.map(cat => (
              <button key={cat} className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {filtered.map((img, i) => (
              <div key={i} className={styles.gridItem} onClick={() => setLightbox(i)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setLightbox(i)}>
                <img src={img.src} alt={img.caption} loading="lazy" />
                <div className={styles.gridItemOverlay}>
                  <p className={styles.gridItemCaption}>{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label="Image viewer">
          <button className={styles.lightboxClose} onClick={() => setLightbox(null)} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img src={filtered[lightbox].src} alt={filtered[lightbox].caption} />
            <p className={styles.lightboxCaption}>{filtered[lightbox].caption}</p>
          </div>
          <div className={styles.lightboxNav}>
            <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox > 0 ? lightbox - 1 : filtered.length - 1); }} aria-label="Previous">←</button>
            <span>{lightbox + 1} / {filtered.length}</span>
            <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox < filtered.length - 1 ? lightbox + 1 : 0); }} aria-label="Next">→</button>
          </div>
        </div>
      )}
    </div>
  );
}
