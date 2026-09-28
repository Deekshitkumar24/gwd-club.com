'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJECTS } from '@/data/content';
import { useReveal } from '@/hooks/useAnimations';
import BeforeAfterCard from '@/components/BeforeAfterCard/BeforeAfterCard';
import styles from './projectDetail.module.css';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) return notFound();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img src={project.heroImage} alt={project.title} />
          <div className={styles.heroBgOverlay} />
        </div>
        <div className={styles.heroContent}>
          <Link href="/work" className={styles.backLink}>← All Projects</Link>
          <div className={styles.heroMeta}>
            <span className="badge">{project.category}</span>
            <span className="label">{project.year}</span>
          </div>
          <h1 className={styles.heroTitle}>{project.title}</h1>
          <p className={styles.heroDesc}>{project.shortDescription}</p>
        </div>
      </section>

      {/* Content */}
      <section className={styles.content}>
        <div className={styles.contentInner}>
          <div className={styles.contentGrid}>
            <div className={styles.contentMain}>
              <h2 className={styles.contentHeading}>About This Project</h2>
              <p className={styles.contentBody}>{project.description}</p>

              {/* Before/After */}
              <div className={styles.beforeAfter}>
                <h3 className={styles.subHeading}>The Transformation</h3>
                <BeforeAfterCard
                  beforeImage={project.beforeImage}
                  afterImage={project.afterImage}
                  beforeLabel="Before"
                  afterLabel="After"
                />
              </div>

              {/* Gallery */}
              {project.images.length > 0 && (
                <div className={styles.gallery}>
                  <h3 className={styles.subHeading}>Gallery</h3>
                  <div className={styles.galleryGrid}>
                    {project.images.map((img, i) => (
                      <div key={i} className={styles.galleryImage}>
                        <img src={img} alt={`${project.title} image ${i + 1}`} loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className={styles.sidebar}>
              <div className={styles.sidebarBlock}>
                <h4 className={styles.sidebarLabel}>Outcome</h4>
                <p className={styles.sidebarValue}>{project.outcome}</p>
              </div>
              <div className={styles.sidebarBlock}>
                <h4 className={styles.sidebarLabel}>Year</h4>
                <p className={styles.sidebarValue}>{project.year}</p>
              </div>
              <div className={styles.sidebarBlock}>
                <h4 className={styles.sidebarLabel}>Category</h4>
                <p className={styles.sidebarValue}>{project.category}</p>
              </div>
              {project.collaborators.length > 0 && (
                <div className={styles.sidebarBlock}>
                  <h4 className={styles.sidebarLabel}>Collaborators</h4>
                  {project.collaborators.map((c) => (
                    <p key={c} className={styles.sidebarValue}>{c}</p>
                  ))}
                </div>
              )}
              {project.link && (
                <a href={project.link} className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>
                  Visit Project →
                </a>
              )}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
