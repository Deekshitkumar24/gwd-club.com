'use client';

import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useReveal } from '@/hooks/useAnimations';
import { useCms } from '@/context/CmsContext';
import { NINE_LEADERS, LeaderSlot } from '@/data/content';
import GwdPlaceholder from '@/components/GwdPlaceholder/GwdPlaceholder';
import styles from './Leadership.module.css';

/* ── 3D Tilt Hook ── */
function useTilt(intensity: number = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -intensity, y: x * intensity });
  }, [intensity]);

  const handleLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return { ref, tilt, handleMove, handleLeave };
}

/* ── President Feature (Slot 1) ── */
function PresidentFeature({ member }: { member: LeaderSlot }) {
  const reveal = useReveal(0.15);
  const { ref: tiltRef, tilt, handleMove, handleLeave } = useTilt(4);

  return (
    <div
      ref={reveal.ref}
      className={`${styles.presidentWrap} reveal ${reveal.isVisible ? 'visible' : ''}`}
    >
      <div className={styles.presidentCard}>
        <div
          className={styles.presidentPortrait}
          ref={tiltRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{
            transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className={styles.presidentImage}
              loading="eager"
            />
          ) : (
            <GwdPlaceholder name={member.name} role={member.role} />
          )}
          <div className={styles.presidentPortraitAccent} />
        </div>

        <div className={styles.presidentInfo}>
          <span className="label-red">Club President · Slot 01</span>
          <h3 className={styles.presidentName}>{member.name}</h3>
          <p className={styles.presidentRole}>{member.role}</p>
          <div className={styles.dividerRed} />
          <p className={styles.presidentDesc}>{member.bio}</p>
          {member.quote && (
            <blockquote className={styles.presidentQuote}>
              &ldquo;{member.quote}&rdquo;
            </blockquote>
          )}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <Link href={`/team/${member.id}`} className="btn btn-primary">
              View Profile →
            </Link>
            <Link href="/team" className={`btn btn-secondary ${styles.teamCta}`}>
              Meet All 9 Leaders →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Leadership Card (Slots 2–9) ── */
function LeadershipCard({
  member,
  index,
  tier,
}: {
  member: LeaderSlot;
  index: number;
  tier: 'senior' | 'lead';
}) {
  const { ref, isVisible } = useReveal<HTMLAnchorElement>(0.15);
  const { ref: tiltRef, tilt, handleMove, handleLeave } = useTilt(6);

  return (
    <Link
      href={`/team/${member.id}`}
      ref={ref}
      className={`${styles.card} ${styles[`card${tier}`]} reveal ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 80}ms`, textDecoration: 'none' }}
    >
      <div
        className={styles.cardImageWrap}
        ref={tiltRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {member.photo ? (
          <img src={member.photo} alt={member.name} className={styles.cardImage} loading="lazy" />
        ) : (
          <GwdPlaceholder name={member.name} role={member.role} />
        )}
        <div className={styles.cardHoverOverlay}>
          <span className={styles.cardHoverText}>View Profile →</span>
        </div>
      </div>
      <div className={styles.cardInfo}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
          <h4 className={styles.cardName}>{member.name}</h4>
          <span style={{ fontSize: '0.7rem', color: 'var(--brand-red)', fontWeight: 700 }}>
            0{member.slot}
          </span>
        </div>
        <p className={styles.cardRole}>{member.role}</p>
        <p className={styles.cardDesc}>{member.bio}</p>
      </div>
    </Link>
  );
}

/* ── Main Leadership Component ── */
export default function Leadership() {
  const headerReveal = useReveal(0.15);
  const { store } = useCms();

  const publishedLeaders = (store.leaders ?? []).filter((l) => !l.status || l.status === 'Published');
  const leaders = publishedLeaders.length > 0 ? publishedLeaders : NINE_LEADERS;
  const president = leaders[0];
  const seniorTier = leaders.slice(1, 4); // Vice President, General Secretary, Technical Lead
  const leadTier = leaders.slice(4); // Creative, Marketing, Event Management, PR, Visual Media

  return (
    <section className={styles.section} id="leadership">
      <div className={styles.container}>
        {/* Section Header */}
        <div
          ref={headerReveal.ref}
          className={`${styles.header} reveal ${headerReveal.isVisible ? 'visible' : ''}`}
        >
          <span className="label-red">Club Leadership Hierarchy</span>
          <h2 className={styles.title}>The 9-Role Leadership Structure</h2>
          <p className={styles.subtitle}>
            Organized into dedicated lanes of operational responsibility — driving technology, design, events, and media across the collective.
          </p>
        </div>

        {/* Tier 1: President Feature */}
        <PresidentFeature member={president} />

        {/* Tier 2: Senior Leadership (Slots 2–4) */}
        <div className={styles.tierSection}>
          <div className={styles.tierHeader}>
            <span className={styles.tierBadge}>TIER 01 · EXECUTIVE LEADERSHIP</span>
            <span className={styles.tierLine} />
          </div>
          <div className={styles.tierGridThree}>
            {seniorTier.map((member, i) => (
              <LeadershipCard key={member.id} member={member} index={i} tier="senior" />
            ))}
          </div>
        </div>

        {/* Tier 3: Specialized Division Leads (Slots 5–9) */}
        <div className={styles.tierSection}>
          <div className={styles.tierHeader}>
            <span className={styles.tierBadge}>TIER 02 · DIVISIONAL LEADS</span>
            <span className={styles.tierLine} />
          </div>
          <div className={styles.tierGridFive}>
            {leadTier.map((member, i) => (
              <LeadershipCard key={member.id} member={member} index={i} tier="lead" />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCta}>
          <p className={styles.ctaText}>
            Want to build alongside GWD leadership on real-world systems?
          </p>
          <Link href="/join" className="btn btn-primary">
            Apply to Join GWD →
          </Link>
        </div>
      </div>
    </section>
  );
}
