'use client';

import React from 'react';
import styles from './DyeVisual.module.css';

/* ── 1. Atmospheric Chapter Transition ── */
export interface DyeAtmosphereTransitionProps {
  chapter?: string;
  title?: string;
  theme?: 'light' | 'dark' | 'auto';
  speed?: number;
  density?: number;
  stir?: number;
  className?: string;
  children?: React.ReactNode;
}

export function DyeAtmosphereTransition({
  chapter = 'CHAPTER TRANSITION',
  title,
  theme = 'auto',
  className = '',
  children,
}: DyeAtmosphereTransitionProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`${styles.atmosphereTransition} ${isDark ? styles.atmosphereDark : ''} ${className}`}
      data-dye-section={isDark ? 'explore' : 'intro'}
      aria-label={`Atmospheric Transition: ${chapter}`}
    >
      {(chapter || title || children) && (
        <div className={styles.atmosphereContent}>
          <div className={styles.atmosphereLabelCol}>
            {chapter && <span className={styles.atmosphereChapterTag}>{chapter}</span>}
            {title && (
              <h3 className={`${styles.atmosphereHeadline} ${isDark ? styles.atmosphereHeadlineDark : ''}`}>
                {title}
              </h3>
            )}
            {children}
          </div>

          <div className={styles.atmosphereHint}>
            <span className={styles.atmospherePulseDot} />
            <span>INTERACTIVE FLUID FIELD</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 2. Contained Interactive Card ── */
export interface DyeContainedCardProps {
  badge?: string;
  title: string;
  description: string;
  theme?: 'light' | 'dark';
  height?: number | string;
  speed?: number;
  density?: number;
  stir?: number;
  className?: string;
  children?: React.ReactNode;
}

export function DyeContainedCard({
  badge = 'FLUID SYSTEM',
  title,
  description,
  theme = 'light',
  height = 240,
  className = '',
  children,
}: DyeContainedCardProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`${styles.containedCard} ${isDark ? styles.containedCardDark : ''} ${className}`}
      data-dye-section={isDark ? 'collab' : 'whatwedo'}
    >
      <div
        className={styles.containedCanvasBox}
        style={{
          height,
          background: isDark
            ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(196,30,30,0.08) 100%)'
            : 'linear-gradient(135deg, rgba(253,236,236,0.5) 0%, rgba(255,255,255,0.8) 100%)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className={styles.containedOverlayTop}>
          <span className={styles.containedBadge}>{badge}</span>
          <span className={styles.containedInteractiveNote}>Shared Fluid Field</span>
        </div>
        {children}
      </div>

      <div className={`${styles.containedBody} ${isDark ? styles.containedBodyDark : ''}`}>
        <h4 className={`${styles.containedTitle} ${isDark ? styles.containedTitleDark : ''}`}>{title}</h4>
        <p className={`${styles.containedDesc} ${isDark ? styles.containedDescDark : ''}`}>{description}</p>
      </div>
    </div>
  );
}

/* ── 3. Full-Bleed Ambient Hero/CTA Stage ── */
export interface DyeCtaBackdropProps {
  tag?: string;
  title: React.ReactNode;
  subtitle: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  speed?: number;
  density?: number;
  stir?: number;
  className?: string;
  children?: React.ReactNode;
}

export function DyeCtaBackdrop({
  tag = 'JOIN THE COLLECTIVE',
  title,
  subtitle,
  primaryCtaText = 'Join GWD',
  primaryCtaHref = '/join',
  secondaryCtaText = 'Explore Domains',
  secondaryCtaHref = '/explore',
  className = '',
  children,
}: DyeCtaBackdropProps) {
  return (
    <div className={`${styles.ambientCtaStage} ${className}`} data-dye-section="cta">
      <div className={styles.ambientCtaScrim} />

      <div className={styles.ambientCtaContainer}>
        {tag && <div className={styles.ambientCtaTag}>{tag}</div>}
        <h2 className={styles.ambientCtaTitle}>{title}</h2>
        <p className={styles.ambientCtaSubtitle}>{subtitle}</p>

        {(primaryCtaText || secondaryCtaText) && (
          <div className={styles.ambientCtaActions}>
            {primaryCtaText && (
              <a href={primaryCtaHref} className={styles.btnPrimaryCta}>
                {primaryCtaText}
              </a>
            )}
            {secondaryCtaText && (
              <a href={secondaryCtaHref} className={styles.btnSecondaryCta}>
                {secondaryCtaText}
              </a>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
