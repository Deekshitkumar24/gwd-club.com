'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TEAM_HIERARCHY, PROJECTS } from '@/data/content';
import styles from './memberDetail.module.css';

export default function TeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const allMembers = TEAM_HIERARCHY.flatMap(l => l.members);
  const member = allMembers.find(m => m.id === id);
  if (!member) return notFound();

  const level = TEAM_HIERARCHY.find(l => l.members.some(m => m.id === id));
  const relatedProjects = PROJECTS.filter(p => member.projects?.includes(p.id));

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href="/team" className={styles.backLink}>← Back to Team</Link>

          <div className={styles.heroGrid}>
            <div className={styles.heroImage}>
              <img src={member.image} alt={member.name} />
            </div>

            <div className={styles.heroText}>
              <span className="label" style={{ color: 'var(--color-accent)' }}>{level?.level}</span>
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
                  {member.skills.map(s => (
                    <span key={s} className={styles.skill}>{s}</span>
                  ))}
                </div>
              )}

              {member.socials && (
                <div className={styles.socials}>
                  {Object.entries(member.socials).map(([name, url]) => (
                    <a key={name} href={url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
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
            <h2 className={styles.projectsTitle}>Related Projects</h2>
            <div className={styles.projectsGrid}>
              {relatedProjects.map(project => (
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
