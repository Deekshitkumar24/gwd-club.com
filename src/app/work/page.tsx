'use client';

import Link from 'next/link';
import { useReveal } from '@/hooks/useAnimations';
import { PROJECTS } from '@/data/content';
import BeforeAfterCard from '@/components/BeforeAfterCard/BeforeAfterCard';
import styles from './work.module.css';

export default function WorkPage() {
  const headerReveal = useReveal();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner} ref={headerReveal.ref}>
          <div className={`reveal ${headerReveal.isVisible ? 'visible' : ''}`}>
            <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-md)' }}>Our Work</p>
            <h1 className={styles.heroTitle}>Projects that create real impact.</h1>
            <p className={styles.heroDesc}>
              From platforms serving thousands to creative installations — we build things that matter.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className={styles.projectsSection}>
        <div className={styles.projectsInner}>
          {PROJECTS.map((project, i) => (
            <ProjectItem key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* Before/After Showcase */}
      <section className={styles.transformations}>
        <div className={styles.transformInner}>
          <h2 className={styles.transformTitle}>Transformations</h2>
          <p className={styles.transformDesc}>See the journey from concept to completion.</p>
          <div className={styles.transformGrid}>
            {PROJECTS.map((project) => (
              <div key={project.id} className={styles.transformItem}>
                <BeforeAfterCard
                  beforeImage={project.beforeImage}
                  afterImage={project.afterImage}
                  beforeLabel="Before"
                  afterLabel="After"
                />
                <h3 className={styles.transformItemTitle}>{project.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProjectItem({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const { ref, isVisible } = useReveal();

  return (
    <div ref={ref} className={`${styles.projectItem} reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 100}ms` }}>
      <Link href={`/work/${project.id}`} className={styles.projectImageWrap}>
        <img src={project.heroImage} alt={project.title} loading="lazy" />
        <div className={styles.projectOverlay}>
          <span className="badge">{project.category}</span>
        </div>
      </Link>
      <div className={styles.projectInfo}>
        <div className={styles.projectMeta}>
          <span className="label">{project.year}</span>
          <span className="label">{project.category}</span>
        </div>
        <Link href={`/work/${project.id}`}>
          <h2 className={styles.projectTitle}>{project.title}</h2>
        </Link>
        <p className={styles.projectDesc}>{project.shortDescription}</p>
        <p className={styles.projectOutcome}>✦ {project.outcome}</p>
        <Link href={`/work/${project.id}`} className={styles.projectLink}>View Project →</Link>
      </div>
    </div>
  );
}
