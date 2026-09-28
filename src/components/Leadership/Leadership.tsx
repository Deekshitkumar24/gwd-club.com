'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useReveal } from '@/hooks/useAnimations';
import styles from './Leadership.module.css';

/* ── Leadership Data ── */
export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  description: string;
  quote?: string;
  image?: string; // undefined = placeholder
  socials?: { label: string; url: string }[];
}

export const LEADERSHIP: LeadershipMember[] = [
  {
    id: 'president',
    name: 'Aldrin Paul',
    role: 'President',
    description: 'Leading GWD\'s mission to turn students into builders who ship real work.',
    quote: 'The best way to learn is to build something that matters.',
    image: '/team/president.jpg',
  },
  {
    id: 'vice-president',
    name: 'Vice President',
    role: 'Vice President',
    description: 'Driving strategy and operations to keep GWD executing at scale.',
    // No image yet
  },
  {
    id: 'general-secretary',
    name: 'General Secretary',
    role: 'General Secretary',
    description: 'Coordinating across departments to ensure every initiative runs smoothly.',
    image: '/team/general-secretary.jpg',
  },
  {
    id: 'technical-lead',
    name: 'Technical Lead',
    role: 'Technical Lead',
    description: 'Architecting the technology behind GWD\'s projects and platforms.',
    image: '/team/technical-lead.png',
  },
  {
    id: 'creative-lead',
    name: 'Creative Lead',
    role: 'Creative Lead',
    description: 'Shaping GWD\'s visual identity and creative output across all touchpoints.',
    // No image yet
  },
  {
    id: 'marketing-lead',
    name: 'Marketing Lead',
    role: 'Marketing Lead',
    description: 'Building GWD\'s presence and telling our story to the world.',
    // No image yet
  },
  {
    id: 'event-management-lead',
    name: 'Event Management Lead',
    role: 'Event Management Lead',
    description: 'Planning and executing events that bring people together and create impact.',
    image: '/team/event-management-lead.jpg',
  },
  {
    id: 'pr-lead',
    name: 'PR Lead',
    role: 'PR Lead',
    description: 'Managing external communications and building relationships with partners.',
    // No image yet
  },
  {
    id: 'visual-media-lead',
    name: 'Visual Media Lead',
    role: 'Visual Media Lead',
    description: 'Capturing and producing visual content that documents GWD\'s journey.',
    // No image yet
  },
];

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

/* ── President Feature ── */
function PresidentFeature({ member }: { member: LeadershipMember }) {
  const reveal = useReveal(0.15);
  const { ref: tiltRef, tilt, handleMove, handleLeave } = useTilt(4);

  return (
    <div className={styles.presidentSection} ref={reveal.ref}>
      <div className={`${styles.presidentInner} ${reveal.isVisible ? 'visible' : ''}`}>
        <div
          className={styles.presidentPortrait}
          ref={tiltRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{
            transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {member.image ? (
            <img src={member.image} alt={member.name} />
          ) : (
            <div className={styles.placeholder}>
              <span className={styles.placeholderIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </span>
            </div>
          )}
          <div className={styles.presidentPortraitAccent} />
        </div>

        <div className={styles.presidentInfo}>
          <span className="label-red">Club Lead</span>
          <h3 className={styles.presidentName}>{member.name}</h3>
          <p className={styles.presidentRole}>{member.role}</p>
          <div className={styles.dividerRed} />
          <p className={styles.presidentDesc}>{member.description}</p>
          {member.quote && (
            <blockquote className={styles.presidentQuote}>
              &ldquo;{member.quote}&rdquo;
            </blockquote>
          )}
          <Link href="/team" className={`btn btn-secondary ${styles.teamCta}`}>
            Meet the Full Team →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Leadership Card ── */
function LeadershipCard({ member, index, tier }: {
  member: LeadershipMember;
  index: number;
  tier: 'senior' | 'lead';
}) {
  const { ref, isVisible } = useReveal(0.15);
  const { ref: tiltRef, tilt, handleMove, handleLeave } = useTilt(6);

  return (
    <div
      ref={ref}
      className={`${styles.card} ${styles[`card${tier}`]} reveal ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
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
        {member.image ? (
          <img src={member.image} alt={member.name} className={styles.cardImage} loading="lazy" />
        ) : (
          <div className={styles.cardPlaceholder}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
            <span className={styles.cardPlaceholderText}>Photo coming soon</span>
          </div>
        )}
        <div className={styles.cardHoverOverlay}>
          <span className={styles.cardHoverText}>View Profile →</span>
        </div>
      </div>
      <div className={styles.cardInfo}>
        <h4 className={styles.cardName}>{member.name}</h4>
        <p className={styles.cardRole}>{member.role}</p>
        <p className={styles.cardDesc}>{member.description}</p>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Leadership() {
  const headerReveal = useReveal(0.2);
  const hierarchyReveal = useReveal(0.15);

  const president = LEADERSHIP[0];
  const seniorLeadership = LEADERSHIP.slice(1, 3); // VP, Gen Sec
  const functionalLeads = LEADERSHIP.slice(3); // Tech, Creative, Marketing, Event, PR, Visual

  return (
    <section className={styles.section} id="team">
      {/* Section Header */}
      <div className={styles.sectionHeader} ref={headerReveal.ref}>
        <div className={`reveal ${headerReveal.isVisible ? 'visible' : ''}`}>
          <span className="label-red">Leadership</span>
          <h2 className={styles.sectionTitle}>The People Behind the Work</h2>
          <p className={styles.sectionDesc}>
            GWD is driven by students who turn ideas into real projects, events, experiences, and shipped work.
          </p>
        </div>
      </div>

      {/* President Feature */}
      <PresidentFeature member={president} />

      {/* Hierarchy Line */}
      <div className={styles.hierarchyLine} ref={hierarchyReveal.ref}>
        <div className={`${styles.hierarchyLineInner} ${hierarchyReveal.isVisible ? styles.hierarchyLineVisible : ''}`} />
      </div>

      {/* Senior Leadership: VP + Gen Sec */}
      <div className={styles.tierSection}>
        <div className={styles.tierHeader}>
          <span className={styles.tierLabel}>Senior Leadership</span>
        </div>
        <div className={styles.seniorGrid}>
          {seniorLeadership.map((member, i) => (
            <LeadershipCard key={member.id} member={member} index={i} tier="senior" />
          ))}
        </div>
      </div>

      {/* Hierarchy Line */}
      <div className={styles.hierarchyLine}>
        <div className={`${styles.hierarchyLineInner} ${hierarchyReveal.isVisible ? styles.hierarchyLineVisible : ''}`} />
      </div>

      {/* Functional Leads */}
      <div className={styles.tierSection}>
        <div className={styles.tierHeader}>
          <span className={styles.tierLabel}>Department Leads</span>
        </div>
        <div className={styles.leadsGrid}>
          {functionalLeads.map((member, i) => (
            <LeadershipCard key={member.id} member={member} index={i} tier="lead" />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className={styles.bottomCta}>
        <Link href="/team" className="btn btn-primary btn-lg">
          Meet the Full Team
        </Link>
      </div>
    </section>
  );
}
