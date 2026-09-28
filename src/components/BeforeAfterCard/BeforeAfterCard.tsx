'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './BeforeAfterCard.module.css';

interface BeforeAfterCardProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  orientation?: 'horizontal' | 'vertical';
  initialPosition?: number;
  className?: string;
}

export default function BeforeAfterCard({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  orientation = 'horizontal',
  initialPosition = 50,
  className = '',
}: BeforeAfterCardProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    let newPosition: number;
    if (orientation === 'horizontal') {
      newPosition = ((clientX - rect.left) / rect.width) * 100;
    } else {
      newPosition = ((clientY - rect.top) / rect.height) * 100;
    }
    setPosition(Math.max(0, Math.min(100, newPosition)));
  }, [orientation]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX, e.clientY);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX, e.clientY);
  }, [isDragging, updatePosition]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = 2;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - step));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + step));
    }
  }, []);

  const isH = orientation === 'horizontal';

  return (
    <div
      className={`${styles.container} ${className}`}
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="slider"
      aria-label="Before and after comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* After (full) */}
      <div className={styles.imageLayer}>
        <img src={afterImage} alt={afterLabel} className={styles.image} draggable={false} />
      </div>

      {/* Before (clipped) */}
      <div
        className={styles.imageLayer}
        style={{
          clipPath: isH
            ? `inset(0 ${100 - position}% 0 0)`
            : `inset(0 0 ${100 - position}% 0)`,
        }}
      >
        <img src={beforeImage} alt={beforeLabel} className={styles.image} draggable={false} />
      </div>

      {/* Labels */}
      <span className={`${styles.label} ${styles.labelBefore}`}>{beforeLabel}</span>
      <span className={`${styles.label} ${styles.labelAfter}`}>{afterLabel}</span>

      {/* Slider line */}
      <div
        className={styles.slider}
        style={isH ? { left: `${position}%` } : { top: `${position}%` }}
      >
        <div className={`${styles.sliderLine} ${isH ? styles.sliderLineH : styles.sliderLineV}`} />
        <div className={`${styles.sliderHandle} ${isDragging ? styles.sliderHandleActive : ''}`}>
          {isH ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 4l-6 8 6 8M16 4l6 8-6 8" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8l8-6 8 6M4 16l8 6 8-6" />
            </svg>
          )}
        </div>
      </div>

      {/* Percentage */}
      <div className={styles.percentage}>{Math.round(position)}%</div>
    </div>
  );
}
