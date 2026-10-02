'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJECTS } from '@/data/content';
import BeforeAfterCard from '@/components/BeforeAfterCard/BeforeAfterCard';
import styles from './projectDetail.module.css';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectIndex = PROJECTS.findIndex((p) => p.id === id);
  const project = PROJECTS[projectIndex];

  if (!project) return notFound();

  const prevProject = projectIndex > 0 ? PROJECTS[projectIndex - 1] : PROJECTS[PROJECTS.length - 1];
  const nextProject = projectIndex < PROJECTS.length - 1 ? PROJECTS[projectIndex + 1] : PROJECTS[0];
  const relatedProjects = PROJECTS.filter((p) => p.id !== project.id).slice(0, 2);

  return (
    <div className={styles.page}>
      {/* Editorial Case Study Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img src={project.heroImage} alt={project.title} />
          <div className={styles.heroBgOverlay} />
        </div>
        <div className={styles.heroContent}>
          <Link href="/work" className={styles.backLink}>← Back to Work Archive</Link>
          <div className={styles.heroMeta}>
            <span className="badge">{project.category}</span>
            <span className="label" style={{ color: '#fff' }}>{project.year}</span>
          </div>
          <h1 className={styles.heroTitle}>{project.title}</h1>
          <p className={styles.heroDesc}>{project.shortDescription}</p>
        </div>
      </section>

      {/* Main Content & Alternating Storytelling Blocks */}
      <section className={styles.content}>
        <div className={styles.contentInner}>
          <div className={styles.contentGrid}>
            <div className={styles.contentMain}>
              {/* Executive Overview */}
              <div className={styles.storyBlock}>
                <span className="label" style={{ color: 'var(--brand-red)' }}>01 · Executive Brief</span>
                <h2 className={styles.contentHeading}>The Problem & Mandate</h2>
                <p className={styles.contentBody}>{project.description}</p>
              </div>

              {/* Before & After Interactive Showcase */}
              {project.beforeImage && project.afterImage && (
                <div className={styles.beforeAfter}>
                  <span className="label" style={{ color: 'var(--brand-red)' }}>02 · Visual Transformation</span>
                  <h3 className={styles.subHeading}>Before & After Execution</h3>
                  <BeforeAfterCard
                    beforeImage={project.beforeImage}
                    afterImage={project.afterImage}
                    beforeLabel="Legacy Baseline"
                    afterLabel="GWD Production"
                  />
                </div>
              )}

              {/* Alternating Story Block 1: Architecture */}
              <div className={styles.alternatingBlock}>
                <div className={styles.altText}>
                  <span className="label" style={{ color: 'var(--brand-red)' }}>03 · Systems Architecture</span>
                  <h3 className={styles.subHeading}>Engineered for Velocity</h3>
                  <p className={styles.contentBody}>
                    Built with clean component contracts, scalable state management, and real-time execution transparency. Every technical decision reflects GWD’s mandate: zero bloat, robust performance, and rapid deployment.
                  </p>
                </div>
                <div className={styles.altMedia}>
                  <img src={project.heroImage} alt="Systems Architecture" loading="lazy" />
                </div>
              </div>

              {/* Alternating Story Block 2: Impact */}
              <div className={`${styles.alternatingBlock} ${styles.altReverse}`}>
                <div className={styles.altText}>
                  <span className="label" style={{ color: 'var(--brand-red)' }}>04 · Verified Impact</span>
                  <h3 className={styles.subHeading}>Production Results</h3>
                  <p className={styles.contentBody}>
                    Validated through actual stakeholder engagement, user sessions, and operational deployment. Shipped without compromises.
                  </p>
                  <div className={styles.outcomeHighlight}>
                    ✦ {project.outcome}
                  </div>
                </div>
                <div className={styles.altMedia}>
                  <img
                    src={project.images[0] || project.afterImage || project.heroImage}
                    alt="Production Results"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Gallery Section */}
              {project.images.length > 0 && (
                <div className={styles.gallery}>
                  <span className="label" style={{ color: 'var(--brand-red)' }}>05 · Media Archive</span>
                  <h3 className={styles.subHeading}>Captured Touchpoints</h3>
                  <div className={styles.galleryGrid}>
                    {project.images.map((img, i) => (
                      <div key={i} className={styles.galleryImage}>
                        <img src={img} alt={`${project.title} captured state ${i + 1}`} loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Metadata */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarBlock}>
                <h4 className={styles.sidebarLabel}>Verified Outcome</h4>
                <p className={styles.sidebarValueOutcome}>{project.outcome}</p>
              </div>
              <div className={styles.sidebarBlock}>
                <h4 className={styles.sidebarLabel}>Year of Release</h4>
                <p className={styles.sidebarValue}>{project.year}</p>
              </div>
              <div className={styles.sidebarBlock}>
                <h4 className={styles.sidebarLabel}>Category & Domain</h4>
                <p className={styles.sidebarValue}>{project.category}</p>
              </div>
              {project.collaborators && project.collaborators.length > 0 && (
                <div className={styles.sidebarBlock}>
                  <h4 className={styles.sidebarLabel}>Key Collaborators</h4>
                  {project.collaborators.map((c) => (
                    <p key={c} className={styles.sidebarValue}>{c}</p>
                  ))}
                </div>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 'var(--space-md)', textAlign: 'center' }}
                >
                  Live Deployment ↗
                </a>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Prev / Next Project Navigation Footer */}
      <section className={styles.projectNav}>
        <div className={styles.projectNavInner}>
          <Link href={`/work/${prevProject.id}`} className={styles.navBlock}>
            <span className={styles.navLabel}>← Previous Work</span>
            <span className={styles.navTitle}>{prevProject.title}</span>
          </Link>
          <div className={styles.navCenter}>
            <Link href="/work" className="btn btn-secondary">
              Back to All Work
            </Link>
          </div>
          <Link href={`/work/${nextProject.id}`} className={`${styles.navBlock} ${styles.navBlockRight}`}>
            <span className={styles.navLabel}>Next Work →</span>
            <span className={styles.navTitle}>{nextProject.title}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
