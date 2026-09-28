'use client';

import Link from 'next/link';
import { useReveal } from '@/hooks/useAnimations';
import { TEAM_HIERARCHY } from '@/data/content';
import styles from './team.module.css';

export default function TeamPage() {
  const headerReveal = useReveal();

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={styles.headerInner} ref={headerReveal.ref}>
          <div className={`reveal ${headerReveal.isVisible ? 'visible' : ''}`}>
            <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-md)' }}>Our People</p>
            <h1 className={styles.headerTitle}>The people who make it happen.</h1>
            <p className={styles.headerDesc}>
              A diverse team of builders, designers, writers, and organizers united by a shared passion for creating impact.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.teamSection}>
        <div className={styles.teamInner}>
          {TEAM_HIERARCHY.map((level, li) => (
            <TeamLevel key={level.level} level={level} index={li} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TeamLevel({ level, index }: { level: typeof TEAM_HIERARCHY[0]; index: number }) {
  const { ref, isVisible } = useReveal();
  const isLeadership = index === 0;

  return (
    <div ref={ref} className={`${styles.level} reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 150}ms` }}>
      <div className={styles.levelHeader}>
        <span className={styles.levelLabel}>{level.level}</span>
        <span className={styles.levelCount}>{level.members.length} members</span>
      </div>

      <div className={`${styles.grid} ${isLeadership ? styles.gridLeadership : ''}`}>
        {level.members.map((member) => (
          <Link href={`/team/${member.id}`} key={member.id} className={`${styles.card} ${isLeadership ? styles.cardLeadership : ''}`}>
            <div className={styles.cardImage}>
              <img src={member.image} alt={member.name} loading="lazy" />
              <div className={styles.cardImageOverlay} />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardName}>{member.name}</h3>
              <p className={styles.cardRole}>{member.role}</p>
              {isLeadership && <p className={styles.cardBio}>{member.bio}</p>}
              {member.skills && member.skills.length > 0 && (
                <div className={styles.cardSkills}>
                  {member.skills.map((s) => (
                    <span key={s} className={styles.cardSkill}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
