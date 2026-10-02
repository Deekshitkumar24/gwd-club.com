'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useReveal } from '@/hooks/useAnimations';
import { useCms } from '@/context/CmsContext';
import { PROJECTS, STATS } from '@/data/content';
import BeforeAfterCard from '@/components/BeforeAfterCard/BeforeAfterCard';
import { DyeAtmosphereTransition, DyeCtaBackdrop } from '@/components/DyeVisual';
import { BorderBeam } from '@/components/ui/border-beam';
import styles from './work.module.css';

export default function WorkPage() {
  const { store } = useCms();
  const headerReveal = useReveal();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = store.projects?.length ? store.projects : PROJECTS;

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    return ['All', ...cats];
  }, [projects]);

  // Extract unique years
  const years = useMemo(() => {
    const yrs = Array.from(new Set(projects.map((p) => p.year)));
    return ['All', ...yrs.sort().reverse()];
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchYear = selectedYear === 'All' || p.year === selectedYear;
      const matchSearch =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchYear && matchSearch;
    });
  }, [projects, activeCategory, selectedYear, searchQuery]);

  return (
    <div className={styles.page} data-dye-section="work">
      {/* Editorial Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner} ref={headerReveal.ref}>
          <div className={`reveal ${headerReveal.isVisible ? 'visible' : ''}`}>
            <p className="label" style={{ color: 'var(--brand-red)', marginBottom: 'var(--space-md)' }}>
              Work & Ventures
            </p>
            <h1 className={styles.heroTitle}>From concept to deployed reality.</h1>
            <p className={styles.heroDesc}>
              Explore our production ventures, client engineering deliverables, and digital systems shipped across India and international markets since March 2024.
            </p>
          </div>
        </div>
      </section>

      {/* ── Atmospheric Chapter Transition ── */}
      <DyeAtmosphereTransition
        chapter="PRODUCTION VENTURES"
        title="Live systems engineered for scale"
        speed={0.7}
        density={0.85}
        stir={1.0}
      />

      {/* Flagship Production Projects Grid */}
      <section className={styles.projectsSection}>
        <div className={styles.projectsInner}>
          <div className={styles.sectionHeader}>
            <span className="label" style={{ color: 'var(--brand-red)' }}>Case Studies & Deliverables</span>
            <h2 className={styles.sectionTitle}>Project Archive</h2>
            <p className={styles.sectionSubtitle}>
              Filter by engineering discipline, launch year, or search for specific platform architectures.
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className={styles.filterBar}>
            <div className={styles.categoryTabs}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`${styles.categoryTab} ${activeCategory === cat ? styles.categoryTabActive : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className={styles.filterControls}>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search projects"
              />

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={styles.yearSelect}
                aria-label="Filter by year"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y === 'All' ? 'All Years' : y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Projects List or Empty State */}
          {filteredProjects.length === 0 ? (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>No matching projects found</h3>
              <p>Try selecting a different category or clearing your search term.</p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSelectedYear('All');
                  setSearchQuery('');
                }}
                className="btn btn-secondary"
                style={{ marginTop: 'var(--space-md)' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.projectsList}>
              {filteredProjects.map((project, i) => (
                <ProjectItem key={project.id} project={project} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Before / After Transformations */}
      <section className={styles.transformations}>
        <div className={styles.transformInner}>
          <div className={styles.sectionHeader}>
            <span className="label" style={{ color: 'var(--brand-red)' }}>Execution Standard</span>
            <h2 className={styles.sectionTitle}>Visual Transformations</h2>
            <p className={styles.sectionSubtitle}>
              Drag the interactive slider to compare initial legacy interfaces with GWD production deliverables.
            </p>
          </div>

          <div className={styles.transformGrid}>
            {PROJECTS.filter((p) => p.beforeImage && p.afterImage).slice(0, 2).map((project) => (
              <div key={project.id} className={styles.transformItem}>
                <BorderBeam size={240} duration={12} colorFrom="#E11D48" colorTo="#F59E0B" borderWidth={1.5} />
                <BeforeAfterCard
                  beforeImage={project.beforeImage!}
                  afterImage={project.afterImage!}
                  beforeLabel="Before GWD"
                  afterLabel="Shipped Production"
                />
                <div className={styles.transformItemDetails}>
                  <span className="badge">{project.category}</span>
                  <h3 className={styles.transformItemTitle}>{project.title}</h3>
                  <p className={styles.transformItemOutcome}>✦ {project.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Proof Strip */}
      <section className={styles.metricsStrip}>
        <div className={styles.metricsInner}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.metricBlock}>
              <span className={styles.metricVal}>
                {s.value}
                {s.suffix}
              </span>
              <span className={styles.metricLab}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Start a Project CTA ── */}
      <DyeCtaBackdrop
        tag="START A PROJECT"
        title={
          <>
            Have a product to build?
            <br />
            <span style={{ color: 'var(--brand-red)' }}>Let&apos;s engineer it.</span>
          </>
        }
        subtitle="From rapid proof-of-concept sprints to enterprise-grade web infrastructure, GWD delivers production reality."
        primaryCtaText="Collaborate with GWD"
        primaryCtaHref="/collaborations"
        secondaryCtaText="View Team"
        secondaryCtaHref="/team"
      />
    </div>
  );
}

function ProjectItem({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const { ref, isVisible } = useReveal();

  return (
    <div
      ref={ref}
      className={`${styles.projectItem} reveal ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <BorderBeam size={300} duration={14} colorFrom="#E11D48" colorTo="#3B82F6" borderWidth={1.5} />
      <Link href={`/work/${project.id}`} className={styles.projectImageWrap}>
        <img src={project.heroImage} alt={project.title} loading="lazy" />
        <div className={styles.projectOverlay}>
          <span className="badge">{project.category}</span>
          <span className={styles.projectYearTag}>{project.year}</span>
        </div>
      </Link>
      <div className={styles.projectInfo}>
        <div className={styles.projectMeta}>
          <span className="label" style={{ color: 'var(--brand-red)' }}>{project.year}</span>
          <span className="label">{project.category}</span>
        </div>
        <Link href={`/work/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2 className={styles.projectTitle}>{project.title}</h2>
        </Link>
        <p className={styles.projectDesc}>{project.shortDescription}</p>
        <p className={styles.projectOutcome}>✦ {project.outcome}</p>
        <Link href={`/work/${project.id}`} className={styles.projectLink}>
          Read Complete Case Study →
        </Link>
      </div>
    </div>
  );
}
