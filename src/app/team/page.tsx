'use client';

import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useReveal } from '@/hooks/useAnimations';
import { useCms } from '@/context/CmsContext';
import { NINE_LEADERS, FOUNDERS, CORE_TEAM_NAMES, LeaderSlot } from '@/data/content';
import GwdPlaceholder from '@/components/GwdPlaceholder/GwdPlaceholder';
import { BorderBeam } from '@/components/ui/border-beam';
import styles from './team.module.css';

/* ── 3D Tilt Hook for Cards ── */
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

export default function TeamPage() {
  const { store } = useCms();
  const headerReveal = useReveal();
  const foundersReveal = useReveal();
  const councilReveal = useReveal();
  const coreReveal = useReveal();

  const leaders = (store.leaders ?? []).filter((l) => !l.status || l.status === 'Published');
  const president = leaders[0] || null;
  const remainingLeaders = leaders.slice(1);

  return (
    <div className={styles.page} data-dye-section="team">
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerInner} ref={headerReveal.ref}>
          <div className={`reveal ${headerReveal.isVisible ? 'visible' : ''}`}>
            <p className="label" style={{ color: 'var(--brand-red)', marginBottom: 'var(--space-md)' }}>
              Executive Council & Builders
            </p>
            <h1 className={styles.headerTitle}>The people behind the work.</h1>
            <p className={styles.headerDesc}>
              A disciplined collective of engineers, designers, strategists, and operators. Organized in strict functional hierarchy to execute with speed and uncompromised quality.
            </p>
          </div>
        </div>
      </section>

      {/* GWD Global Founders & Visionaries */}
      <section className={styles.foundersSection} ref={foundersReveal.ref}>
        <div className={`${styles.foundersInner} reveal ${foundersReveal.isVisible ? 'visible' : ''}`}>
          <div className={styles.sectionHeader}>
            <span className="label" style={{ color: 'var(--brand-red)' }}>Executive Board</span>
            <h2 className={styles.sectionTitle}>GWD Global Founders</h2>
            <p className={styles.sectionSubtitle}>
              Architecting the global venture ecosystem, capital allocation, and enterprise operations.
            </p>
          </div>

          <div className={styles.foundersGrid}>
            {FOUNDERS.map((founder, i) => (
              <div key={founder.name} className={styles.founderCard}>
                <BorderBeam size={220} duration={14} colorFrom="#E11D48" colorTo="#8B5CF6" borderWidth={1.5} />
                <div className={styles.founderHeader}>
                  <span className={styles.founderIndex}>0{i + 1}</span>
                  <span className={styles.founderRole}>{founder.role}</span>
                </div>
                <h3 className={styles.founderName}>{founder.name}</h3>
                <p className={styles.founderBio}>{founder.bio}</p>
                <div className={styles.founderTags}>
                  {founder.responsibilities.map((r) => (
                    <span key={r} className={styles.founderTag}>{r}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 9-Role Executive Leadership */}
      <section className={styles.teamSection} ref={councilReveal.ref}>
        <div className={styles.teamInner}>
          <div className={styles.sectionHeader}>
            <span className="label" style={{ color: 'var(--brand-red)' }}>Official Governance</span>
            <h2 className={styles.sectionTitle}>Club Leadership Hierarchy</h2>
            <p className={styles.sectionSubtitle}>
              Strict 9-role execution council orchestrating the VJIT campus base and 650+ freelance network.
            </p>
          </div>

          {/* Slot 01: President Hero Showcase */}
          {president && (
            <div className={styles.presidentHero}>
              <PresidentCard member={president} />
            </div>
          )}

          {/* Slots 02–09: Remaining Executive Council */}
          {remainingLeaders.length > 0 && (
            <div className={styles.councilGrid}>
              {remainingLeaders.map((leader, i) => (
                <LeaderCard key={leader.id} leader={leader} index={i + 2} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Extended Core Executive Team (Slide 16) */}
      <section className={styles.coreSection} ref={coreReveal.ref}>
        <div className={`${styles.coreInner} reveal ${coreReveal.isVisible ? 'visible' : ''}`}>
          <div className={styles.sectionHeader}>
            <span className="label" style={{ color: 'var(--brand-red)' }}>Operational Core</span>
            <h2 className={styles.sectionTitle}>Executive Operations Directory</h2>
            <p className={styles.sectionSubtitle}>
              Key contributors and division drivers featured in the official GWD orientation archive.
            </p>
          </div>

          <div className={styles.coreGrid}>
            {CORE_TEAM_NAMES.map((name, i) => (
              <div key={name} className={styles.coreBadge}>
                <span className={styles.coreIndex}>{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                <span className={styles.coreName}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Ranks CTA */}
      <section className={styles.teamCtaSection}>
        <div className={styles.teamCtaInner}>
          <h2 className={styles.teamCtaTitle}>Ready to build with this team?</h2>
          <p className={styles.teamCtaDesc}>
            We onboard exceptional builders, designers, and organizers into real client projects and venture teams.
          </p>
          <div className={styles.teamCtaActions}>
            <Link href="/join" className="btn btn-primary btn-lg">
              Apply to Join GWD
            </Link>
            <Link href="/work" className="btn btn-secondary btn-lg">
              Explore Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PresidentCard({ member }: { member: LeaderSlot }) {
  const { ref: tiltRef, tilt, handleMove, handleLeave } = useTilt(5);

  return (
    <div className={styles.presidentCard}>
      <BorderBeam size={320} duration={12} colorFrom="#E11D48" colorTo="#3B82F6" borderWidth={2} />
      <div
        className={styles.presidentMedia}
        ref={tiltRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {member.photo ? (
          <img src={member.photo} alt={member.name} className={styles.presidentImg} />
        ) : (
          <GwdPlaceholder name={member.name} role={member.role} />
        )}
      </div>

      <div className={styles.presidentDetails}>
        <div className={styles.slotBadge}>Slot 01 · Club President</div>
        <h3 className={styles.presidentNameText}>{member.name}</h3>
        <p className={styles.presidentRoleText}>{member.role}</p>
        <p className={styles.presidentBioText}>{member.bio}</p>
        {member.quote && (
          <blockquote className={styles.presidentQuoteText}>
            &ldquo;{member.quote}&rdquo;
          </blockquote>
        )}
        <div className={styles.presidentSkills}>
          {member.skills?.map((s: string) => (
            <span key={s} className={styles.skillTag}>{s}</span>
          ))}
        </div>
        <div className={styles.presidentActions}>
          <Link href={`/team/${member.id}`} className="btn btn-primary">
            View Full Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}

function LeaderCard({ leader, index }: { leader: LeaderSlot; index: number }) {
  const { ref, isVisible } = useReveal<HTMLAnchorElement>(0.15);
  const { ref: tiltRef, tilt, handleMove, handleLeave } = useTilt(6);

  return (
    <Link
      href={`/team/${leader.id}`}
      ref={ref}
      className={`${styles.leaderCard} reveal ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 60}ms`, textDecoration: 'none' }}
    >
      <BorderBeam size={200} duration={12} colorFrom="#E11D48" colorTo="#F59E0B" borderWidth={1.5} />
      <div
        className={styles.leaderMedia}
        ref={tiltRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {leader.photo ? (
          <img src={leader.photo} alt={leader.name} className={styles.leaderImg} loading="lazy" />
        ) : (
          <GwdPlaceholder name={leader.name} role={leader.role} />
        )}
        <span className={styles.slotTag}>Slot 0{index}</span>
      </div>

      <div className={styles.leaderBody}>
        <h4 className={styles.leaderName}>{leader.name}</h4>
        <p className={styles.leaderRole}>{leader.role}</p>
        <p className={styles.leaderBio}>{leader.bio}</p>
        <span className={styles.profileLink}>View Dossier →</span>
      </div>
    </Link>
  );
}
