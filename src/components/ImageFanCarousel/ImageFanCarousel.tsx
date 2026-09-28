'use client';

import { useState, useCallback } from 'react';
import styles from './ImageFanCarousel.module.css';

interface CarouselImage {
  src: string;
  caption?: string;
}

interface ImageFanCarouselProps {
  images: CarouselImage[];
  className?: string;
}

export default function ImageFanCarousel({ images, className = '' }: ImageFanCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(images.length / 2));

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }, [prev, next]);

  return (
    <div
      className={`${styles.carousel} ${className}`}
      role="region"
      aria-label="Image gallery carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.stage}>
        {images.map((img, i) => {
          const offset = i - activeIndex;
          const absOffset = Math.abs(offset);
          const isActive = i === activeIndex;

          const translateX = offset * 180;
          const translateZ = -absOffset * 120;
          const rotateY = offset * -15;
          const scale = isActive ? 1 : Math.max(0.7, 1 - absOffset * 0.12);
          const opacity = absOffset > 3 ? 0 : Math.max(0.3, 1 - absOffset * 0.25);
          const zIndex = images.length - absOffset;

          return (
            <div
              key={i}
              className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
              }}
              onClick={() => goTo(i)}
              role="button"
              aria-label={img.caption || `Image ${i + 1}`}
              tabIndex={isActive ? 0 : -1}
            >
              <img src={img.src} alt={img.caption || `Gallery image ${i + 1}`} className={styles.image} draggable={false} />
              {isActive && img.caption && (
                <div className={styles.caption}>{img.caption}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.controls}>
        <button className={styles.controlBtn} onClick={prev} aria-label="Previous image">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className={styles.dots}>
          {images.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
        <button className={styles.controlBtn} onClick={next} aria-label="Next image">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
