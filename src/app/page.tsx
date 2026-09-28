'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useReveal, useCountUp, useParallax } from '@/hooks/useAnimations';
import { STATS, ACTIVITIES, PROJECTS, UPCOMING_EVENTS, EVENT_WORKFLOW, COLLABORATIONS, TIMELINE, GALLERY_IMAGES } from '@/data/content';
import Leadership from '@/components/Leadership/Leadership';
import ImageFanCarousel from '@/components/ImageFanCarousel/ImageFanCarousel';
import styles from './page.module.css';

/* ── Stat Counter ── */
function StatCounter({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const { ref, isVisible } = useReveal(0.3);
  const { count, start } = useCountUp(value, 1800);

  useEffect(() => {
    if (isVisible) start();
  }, [isVisible, start]);

  return (
    <div ref={ref} className={styles.statItem}>
      <div className={styles.statValue}>{count}{suffix}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function HomePage() {
  const [activeActivity, setActiveActivity] = useState(0);
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const aboutReveal = useReveal();
  const activitiesReveal = useReveal();
  const projectsReveal = useReveal();
  const eventReveal = useReveal();
  const workflowReveal = useReveal();
  const collabReveal = useReveal();
  const timelineReveal = useReveal();
  const ctaReveal = useReveal();
  const galleryReveal = useReveal();

  const heroParallax = useParallax(0.15);
  const featuredEvent = UPCOMING_EVENTS.find(e => e.featured) || UPCOMING_EVENTS[0];

  // Guarantee autoplay on mount
  useEffect(() => {
    const vid = heroVideoRef.current;
    if (vid) {
      vid.muted = isMuted;
      vid.play().catch(err => {
        console.warn('Hero video autoplay notice:', err);
      });
    }
  }, [isMuted]);

  const toggleSound = () => {
    const vid = heroVideoRef.current;
    if (!vid) return;
    const nextMuted = !isMuted;
    vid.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      vid.play().catch(() => {});
    }
  };

  // Workflow scroll logic
  const workflowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!workflowRef.current) return;
      const rect = workflowRef.current.getBoundingClientRect();
      const progress = 1 - (rect.top / window.innerHeight);
      const stepIndex = Math.floor(progress * EVENT_WORKFLOW.length * 0.8);
      setActiveWorkflow(Math.max(0, Math.min(stepIndex, EVENT_WORKFLOW.length - 1)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.page}>
      {/* ══════════ 01. HERO ══════════ */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroBg} ref={heroParallax.ref}>
          <video
            ref={heroVideoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            style={{ transform: `translateY(${heroParallax.offset}px) scale(1.08)` }}
          >
            <source src="/gwd-hero.mp4" type="video/mp4" />
          </video>
          <div className={styles.heroBgOverlay} />
        </div>

        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>A Student Collective</p>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleRed}>GET WORK</span> DONE.
          </h1>
          <p className={styles.heroSubtitle}>
            A student collective that turns ideas into shipped work — tech, design, and everything between.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/join" className="btn btn-primary btn-lg">Join GWD</Link>
            <Link href="/work" className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>Explore Work</Link>
            <button
              type="button"
              onClick={() => setShowVideoModal(true)}
              className="btn btn-secondary btn-lg"
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
            >
              ▶ Watch Film
            </button>
          </div>
        </div>

        {/* Audio Toggle Button */}
        <button
          type="button"
          onClick={toggleSound}
          className={styles.soundToggle}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? "🔇 Unmute Audio" : "🔊 Audio On"}
        </button>

        <div className={styles.heroScroll}>
          <span className={styles.heroScrollLabel}>Scroll</span>
          <span className={styles.heroScrollLine} />
        </div>
      </section>

      {/* Fullscreen Video Modal */}
      {showVideoModal && (
        <div className={styles.videoModal} onClick={() => setShowVideoModal(false)}>
          <div className={styles.videoModalInner} onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeModalBtn}
              onClick={() => setShowVideoModal(false)}
              aria-label="Close video"
            >
              ✕
            </button>
            <video
              src="/gwd-hero.mp4"
              controls
              autoPlay
              className={styles.modalVideoPlayer}
            />
          </div>
        </div>
      )}

      {/* ══════════ 02. LEADERSHIP ══════════ */}
      <Leadership />

      {/* ══════════ 03. ABOUT ══════════ */}
      <section className={styles.about} id="about">
        <div className={styles.aboutInner} ref={aboutReveal.ref}>
          <div className={`${styles.aboutGrid} ${aboutReveal.isVisible ? 'visible' : ''}`}>
            <div className={`${styles.aboutText} reveal ${aboutReveal.isVisible ? 'visible' : ''}`}>
              <p className={styles.sectionLabel}>Who We Are</p>
              <h2 className={styles.aboutHeading}>
                Where technology meets creativity, and ideas become shipped work.
              </h2>
              <p className={styles.aboutBody}>
                GWD is a community of makers, thinkers, and builders who believe that the best ideas happen when disciplines collide. We bring together students from engineering, design, arts, and business to create projects, host events, and build experiences that matter.
              </p>
              <p className={styles.aboutBody}>
                <strong>Our Mission:</strong> To create a space where students from diverse backgrounds collaborate to build meaningful projects and grow as creators.
              </p>
            </div>
            <div className={`${styles.aboutImage} reveal-scale ${aboutReveal.isVisible ? 'visible' : ''}`}>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="GWD members working together"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.stats}>
        <div className={styles.statsInner}>
          {STATS.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* ══════════ 04. WHAT GWD DOES ══════════ */}
      <section className={styles.activities} id="activities">
        <div className={styles.activitiesInner} ref={activitiesReveal.ref}>
          <div className={`reveal ${activitiesReveal.isVisible ? 'visible' : ''}`}>
            <p className={styles.sectionLabel}>What We Do</p>
            <h2 className={styles.activitiesTitle}>
              Six verticals. One collective mission.
            </h2>
          </div>

          <div className={`${styles.activitiesGrid} reveal ${activitiesReveal.isVisible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
            <div className={styles.activitiesList}>
              {ACTIVITIES.map((activity, i) => (
                <div
                  key={activity.id}
                  className={`${styles.activityItem} ${i === activeActivity ? styles.activityItemActive : ''}`}
                  onClick={() => setActiveActivity(i)}
                  onMouseEnter={() => setActiveActivity(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveActivity(i)}
                  aria-selected={i === activeActivity}
                >
                  <span className={styles.activityTitle}>{activity.title}</span>
                  <span className={styles.activityDesc}>{activity.description}</span>
                </div>
              ))}
            </div>
            <div className={styles.activitiesImageWrap}>
              <img
                src={ACTIVITIES[activeActivity].image}
                alt={ACTIVITIES[activeActivity].title}
                loading="lazy"
                key={activeActivity}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 05. PROJECTS ══════════ */}
      <section className={styles.projects} id="work">
        <div className={styles.projectsInner} ref={projectsReveal.ref}>
          <div className={`${styles.projectsHeader} reveal ${projectsReveal.isVisible ? 'visible' : ''}`}>
            <div>
              <p className={styles.sectionLabel}>Featured Work</p>
              <h2 className={styles.sectionTitle}>Projects that made an impact.</h2>
            </div>
            <Link href="/work" className="btn btn-secondary">View All Work →</Link>
          </div>

          <div className={styles.projectsList}>
            {PROJECTS.slice(0, 3).map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 06. UPCOMING EVENT ══════════ */}
      {featuredEvent && (
        <section className={styles.featuredEvent} id="events" ref={eventReveal.ref}>
          <div className={styles.featuredEventBg}>
            <img src={featuredEvent.image} alt="" aria-hidden="true" />
          </div>
          <div className={`${styles.featuredEventContent} reveal ${eventReveal.isVisible ? 'visible' : ''}`}>
            <div className={styles.featuredEventText}>
              <span className="badge-red">Upcoming Event</span>
              <p className={styles.featuredEventDate}>
                {new Date(featuredEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <h2 className={styles.featuredEventTitle}>{featuredEvent.title}</h2>
              <p className={styles.featuredEventDesc}>{featuredEvent.shortDescription}</p>
              <div className={styles.featuredEventMeta}>
                <span>📍 {featuredEvent.location}</span>
                <span>🕐 {featuredEvent.time}</span>
              </div>
              <div>
                <Link href={`/events/${featuredEvent.id}`} className="btn btn-primary">
                  Register Now
                </Link>
              </div>
            </div>
            <div className={styles.featuredEventImage}>
              <img src={featuredEvent.image} alt={featuredEvent.title} loading="lazy" />
            </div>
          </div>
        </section>
      )}

      {/* ══════════ 07. HOW GWD WORKS ══════════ */}
      <section className={styles.workflow} ref={workflowRef}>
        <div className={styles.workflowInner} ref={workflowReveal.ref}>
          <div className={`${styles.workflowHeader} reveal ${workflowReveal.isVisible ? 'visible' : ''}`}>
            <p className={styles.sectionLabel}>How It Works</p>
            <h2 className={styles.sectionTitle}>From idea to execution — how GWD runs events.</h2>
          </div>

          <div className={styles.workflowSteps}>
            {EVENT_WORKFLOW.map((step, i) => (
              <div
                key={step.step}
                className={`${styles.workflowStep} ${i <= activeWorkflow ? styles.workflowStepActive : ''}`}
              >
                <div className={styles.workflowStepNumber}>
                  {step.icon}
                </div>
                <div className={styles.workflowStepContent}>
                  <h3 className={styles.workflowStepTitle}>{step.title}</h3>
                  <p className={styles.workflowStepDesc}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 08. COLLABORATIONS ══════════ */}
      <section className={styles.collaborations} id="collaborations" ref={collabReveal.ref}>
        <div className={styles.collabInner}>
          <div className={`${styles.collabHeader} reveal ${collabReveal.isVisible ? 'visible' : ''}`}>
            <p className={styles.sectionLabel}>Collaborations</p>
            <h2 className={styles.sectionTitle}>Partners who believe in what we build.</h2>
          </div>

          <div className={`${styles.collabGrid} reveal ${collabReveal.isVisible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
            {COLLABORATIONS.filter(c => c.featured).map((collab) => (
              <div key={collab.id} className={styles.collabCard}>
                <div className={styles.collabCardImage}>
                  <img src={collab.image} alt={collab.name} loading="lazy" />
                </div>
                <div className={styles.collabCardBody}>
                  <span className={styles.collabCardType}>{collab.type}</span>
                  <h3 className={styles.collabCardName}>{collab.name}</h3>
                  <p className={styles.collabCardDesc}>{collab.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link href="/collaborations" className="btn btn-secondary">View All Collaborations →</Link>
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className={styles.gallerySectionWrap} ref={galleryReveal.ref}>
        <div className={`${styles.gallerySectionInner} reveal ${galleryReveal.isVisible ? 'visible' : ''}`}>
          <div className={styles.galleryHeader}>
            <p className={styles.sectionLabel}>Memories</p>
            <h2 className={styles.sectionTitle}>Moments that define us.</h2>
          </div>
          <ImageFanCarousel
            images={GALLERY_IMAGES.slice(0, 8).map(img => ({ src: img.src, caption: img.caption }))}
          />
        </div>
      </section>

      {/* ══════════ 09. JOURNEY ══════════ */}
      <section className={styles.timeline} id="timeline" ref={timelineReveal.ref}>
        <div className={styles.timelineInner}>
          <div className={`${styles.timelineHeader} reveal ${timelineReveal.isVisible ? 'visible' : ''}`}>
            <p className={styles.sectionLabel}>Our Journey</p>
            <h2 className={styles.sectionTitle}>From founding to today.</h2>
          </div>

          <div className={styles.timelineItems}>
            {TIMELINE.map((item) => (
              <TimelineItem key={item.year} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 10. FINAL CTA ══════════ */}
      <section className={styles.finalCta} ref={ctaReveal.ref}>
        <div className={`${styles.finalCtaInner} reveal ${ctaReveal.isVisible ? 'visible' : ''}`}>
          <p className="label-red">Ready?</p>
          <h2 className={styles.finalCtaTitle}>
            Be part of something bigger.
          </h2>
          <p className={styles.finalCtaDesc}>
            Whether you want to join our team or collaborate on something meaningful — we&apos;d love to hear from you.
          </p>
          <div className={styles.finalCtaButtons}>
            <Link href="/join" className="btn btn-primary btn-lg">Join GWD</Link>
            <Link href="/collaborations" className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>Collaborate With Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Sub-components ── */
function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const { ref, isVisible } = useReveal();

  return (
    <div ref={ref} className={`${styles.projectCard} reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 150}ms` }}>
      <div className={styles.projectImageWrap}>
        <img src={project.heroImage} alt={project.title} loading="lazy" />
      </div>
      <div>
        <div className={styles.projectMeta}>
          <span className="badge">{project.category}</span>
          <span className="label">{project.year}</span>
        </div>
        <h3 className={styles.projectCardTitle}>{project.title}</h3>
        <p className={styles.projectCardDesc}>{project.shortDescription}</p>
        <p className={styles.projectOutcome}>✦ {project.outcome}</p>
        <Link href={`/work/${project.id}`} className={styles.projectLink}>
          View Project →
        </Link>
      </div>
    </div>
  );
}

function TimelineItem({ item }: { item: typeof TIMELINE[0] }) {
  const { ref, isVisible } = useReveal(0.2);

  return (
    <div ref={ref} className={`${styles.timelineItem} ${isVisible ? styles.timelineItemVisible : ''} reveal ${isVisible ? 'visible' : ''}`}>
      <div>
        <span className={styles.timelineYear}>{item.year}</span>
        <h3 className={styles.timelineItemTitle}>{item.title}</h3>
        <p className={styles.timelineItemDesc}>{item.description}</p>
        {item.achievement && (
          <span className={styles.timelineAchievement}>✦ {item.achievement}</span>
        )}
      </div>
      <div className={styles.timelineItemImage}>
        <img src={item.image} alt={item.title} loading="lazy" />
      </div>
    </div>
  );
}
