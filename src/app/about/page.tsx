'use client';

import { useReveal, useCountUp } from '@/hooks/useAnimations';
import { CLUB, STATS, TIMELINE } from '@/data/content';
import styles from './about.module.css';
import { useEffect } from 'react';

function StatItem({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const { ref, isVisible } = useReveal(0.3);
  const { count, start } = useCountUp(value, 1800);
  useEffect(() => { if (isVisible) start(); }, [isVisible, start]);
  return (
    <div ref={ref} className={styles.statItem}>
      <div className={styles.statValue}>{count}{suffix}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function AboutPage() {
  const headerReveal = useReveal();
  const missionReveal = useReveal();
  const historyReveal = useReveal();

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={styles.headerInner} ref={headerReveal.ref}>
          <div className={`reveal ${headerReveal.isVisible ? 'visible' : ''}`}>
            <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-md)' }}>About</p>
            <h1 className={styles.headerTitle}>Where technology meets creativity.</h1>
            <p className={styles.headerDesc}>{CLUB.longDescription}</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className={styles.statsInner}>
          {STATS.map(stat => <StatItem key={stat.label} {...stat} />)}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.missionSection} ref={missionReveal.ref}>
        <div className={`${styles.missionInner} reveal ${missionReveal.isVisible ? 'visible' : ''}`}>
          <div className={styles.missionGrid}>
            <div className={styles.missionBlock}>
              <h2 className={styles.missionTitle}>Our Mission</h2>
              <p className={styles.missionBody}>{CLUB.mission}</p>
            </div>
            <div className={styles.missionBlock}>
              <h2 className={styles.missionTitle}>Our Vision</h2>
              <p className={styles.missionBody}>{CLUB.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className={styles.historySection} ref={historyReveal.ref}>
        <div className={`${styles.historyInner} reveal ${historyReveal.isVisible ? 'visible' : ''}`}>
          <h2 className={styles.sectionTitle}>Our Journey</h2>
          <div className={styles.timelineItems}>
            {TIMELINE.map(item => (
              <TimelineEntry key={item.year} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function TimelineEntry({ item }: { item: typeof TIMELINE[0] }) {
  const { ref, isVisible } = useReveal(0.2);
  return (
    <div ref={ref} className={`${styles.timelineItem} ${isVisible ? styles.timelineItemVisible : ''} reveal ${isVisible ? 'visible' : ''}`}>
      <div className={styles.timelineDot} />
      <div className={styles.timelineContent}>
        <span className={styles.timelineYear}>{item.year}</span>
        <h3 className={styles.timelineTitle}>{item.title}</h3>
        <p className={styles.timelineDesc}>{item.description}</p>
        {item.achievement && <span className={styles.timelineAchievement}>✦ {item.achievement}</span>}
      </div>
      <div className={styles.timelineImage}>
        <img src={item.image} alt={item.title} loading="lazy" />
      </div>
    </div>
  );
}
