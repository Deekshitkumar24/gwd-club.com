'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NINE_LEADERS, TEAM_HIERARCHY, PROJECTS } from '@/data/content';
import { useCms } from '@/context/CmsContext';
import GwdPlaceholder from '@/components/GwdPlaceholder/GwdPlaceholder';
import styles from './memberDetail.module.css';

export default function TeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { store } = useCms();

  // Search in store.leaders first, then NINE_LEADERS, then domain members, then TEAM_HIERARCHY
  const activeLeaders = store.leaders?.length ? store.leaders : NINE_LEADERS;
  const leaderMatch = activeLeaders.find((l) => l.id === id);

  const domainMembers = (store.domains || []).flatMap((d) => d.members || []);
  const allHierarchyMembers = [...TEAM_HIERARCHY.flatMap((l) => l.members), ...domainMembers];
  const hierarchyMatch = allHierarchyMembers.find((m) => m.id === id);

  const member = leaderMatch
    ? {
        id: leaderMatch.id,
        name: leaderMatch.name,
        role: leaderMatch.role,
        bio: leaderMatch.bio,
        quote: leaderMatch.quote,
        skills: leaderMatch.skills || [],
        image: leaderMatch.photo,
        hasPhoto: !!leaderMatch.photo,
        socials: leaderMatch.socials || {},
        projects: leaderMatch.projects || [],
        tier: leaderMatch.tier,
      }
    : hierarchyMatch
    ? (() => {
        const h = hierarchyMatch as { photo?: string; image?: string; hasPhoto?: boolean; quote?: string; skills?: string[]; socials?: Record<string, string>; projects?: string[] };
        const memberImg = h.photo || h.image;
        return {
          id: hierarchyMatch.id,
          name: hierarchyMatch.name,
          role: hierarchyMatch.role,
          bio: hierarchyMatch.bio || '',
          quote: h.quote,
          skills: h.skills || [],
          image: memberImg,
          hasPhoto: h.hasPhoto ?? !!memberImg,
          socials: h.socials || {},
          projects: h.projects || [],
          tier: 'council',
        };
      })()
    : null;

  if (!member) return notFound();

  const allProjects = store.projects?.length ? store.projects : PROJECTS;
  const relatedProjects = allProjects.filter((p) => member.projects?.includes(p.id));

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href="/team" className={styles.backLink}>← Back to Executive Council</Link>

          <div className={styles.heroGrid}>
            <div className={styles.heroImage}>
              {member.hasPhoto && member.image ? (
                <img src={member.image} alt={member.name} />
              ) : (
                <GwdPlaceholder name={member.name} role={member.role} />
              )}
            </div>

            <div className={styles.heroText}>
              <span className="label" style={{ color: 'var(--brand-red)' }}>Executive Leadership</span>
              <h1 className={styles.heroName}>{member.name}</h1>
              <p className={styles.heroRole}>{member.role}</p>
              <p className={styles.heroBio}>{member.bio}</p>

              {member.quote && (
                <blockquote className={styles.quote}>
                  &ldquo;{member.quote}&rdquo;
                </blockquote>
              )}

              {member.skills && member.skills.length > 0 && (
                <div className={styles.skills}>
                  {member.skills.map((s: string) => (
                    <span key={s} className={styles.skill}>{s}</span>
                  ))}
                </div>
              )}

              {member.socials && Object.keys(member.socials).length > 0 && (
                <div className={styles.socials}>
                  {Object.entries(member.socials).map(([name, url]) => (
                    <a key={name} href={String(url)} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className={styles.projects}>
          <div className={styles.projectsInner}>
            <h2 className={styles.projectsTitle}>Directed Projects & Platforms</h2>
            <div className={styles.projectsGrid}>
              {relatedProjects.map((project) => (
                <Link href={`/work/${project.id}`} key={project.id} className={styles.projectCard}>
                  <div className={styles.projectImage}>
                    <img src={project.heroImage} alt={project.title} loading="lazy" />
                  </div>
                  <div className={styles.projectInfo}>
                    <span className="badge">{project.category}</span>
                    <h3 className={styles.projectName}>{project.title}</h3>
                    <p className={styles.projectDesc}>{project.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
