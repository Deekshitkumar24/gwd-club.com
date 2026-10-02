'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useReveal, useCountUp } from '@/hooks/useAnimations';
import { useCms } from '@/context/CmsContext';
import { getEventRegistrationState } from '@/lib/cms';
import {
  CLUB,
  STATS,
  DISCIPLINES,
  UPCOMING_EVENTS,
  NINE_LEADERS,
  PROJECTS,
  COLLABORATIONS,
  CLIENT_DISCLAIMER,
  THREE_ARMS,
} from '@/data/content';
import { DyeAtmosphereTransition, DyeContainedCard, DyeCtaBackdrop } from '@/components/DyeVisual';
import { GwdClientScroller, EcosystemScroller } from '@/components/ui/brand-scoller';
import GlobalPresence from '@/components/GlobalPresence/GlobalPresence';
import { BorderBeam } from '@/components/ui/border-beam';
import styles from './page.module.css';

type HeroState = 'loading' | 'playing' | 'transitioning' | 'revealed';

/* ── Stat Counter Component ── */
function StatItem({ label, value, suffix, prefix = '' }: { label: string; value: number; suffix: string; prefix?: string }) {
  const { ref, isVisible } = useReveal(0.3);
  const { count, start } = useCountUp(value, 1800);

  useEffect(() => {
    if (isVisible) start();
  }, [isVisible, start]);

  return (
    <div ref={ref} className={styles.statItem}>
      <div className={styles.statValue}>
        {prefix}{count}<span className={styles.statSuffix}>{suffix}</span>
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function HomePage() {
  const { store } = useCms();

  const heroCms = store.homepage.hero;
  const introCms = store.homepage.intro;
  const finalCtaCms = store.homepage.finalCta;
  const statsCms = store.homepage.stats || STATS;
  const domainsList = store.domains;

  const [heroState, setHeroState] = useState<HeroState>('loading');
  const [videoProgress, setVideoProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  isMutedRef.current = isMuted;
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeDiscipline, setActiveDiscipline] = useState(0);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const watchFilmBtnRef = useRef<HTMLButtonElement>(null);
  const closeModalBtnRef = useRef<HTMLButtonElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const failsafeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Section reveals
  const introReveal = useReveal();
  const threeArmsReveal = useReveal();
  const studentIdeaReveal = useReveal();
  const whatWeDoReveal = useReveal();
  const workReveal = useReveal();
  const eventReveal = useReveal();
  const leaderReveal = useReveal();
  const collabReveal = useReveal();
  const statsReveal = useReveal();
  const ctaReveal = useReveal();

  const publishedEvents = (store.upcomingEvents ?? []).filter((e) => e.status !== 'Draft' && e.status !== 'Archived');
  const featuredEvent =
    publishedEvents.find((e) => e.id === store.homepage.featuredEventId) ||
    publishedEvents.find((e) => e.featured) ||
    publishedEvents[0] ||
    null;

  const featuredEventRegistrationsCount = featuredEvent
    ? (store.registrations ?? []).filter((r) => r.eventId === featuredEvent.id).length
    : 0;
  const eventRegState = featuredEvent
    ? getEventRegistrationState(featuredEvent, featuredEventRegistrationsCount)
    : null;
  const isRegOpen = eventRegState === 'Registration Open';
  const eventDateObj = featuredEvent?.date ? new Date(featuredEvent.date) : null;
  const monthStr = eventDateObj && !isNaN(eventDateObj.getTime())
    ? eventDateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    : 'GWD';
  const dayStr = eventDateObj && !isNaN(eventDateObj.getTime())
    ? String(eventDateObj.getDate())
    : 'LIVE';

  const publishedLeaders = (store.leaders ?? []).filter((l) => !l.status || l.status === 'Published');
  const president =
    publishedLeaders.find((l) => l.id === store.homepage.leadershipHighlightId) ||
    publishedLeaders[0] ||
    null;

  const publishedProjects = (store.projects ?? []).filter((p) => !p.status || p.status === 'Published');
  const featuredProjects = (
    publishedProjects.filter((p) => store.homepage.featuredProjectIds?.includes(p.id) || p.featured).length > 0
      ? publishedProjects.filter((p) => store.homepage.featuredProjectIds?.includes(p.id) || p.featured)
      : publishedProjects
  ).slice(0, 3);

  const publishedCollabs = (store.collaborations ?? []).filter((c) => !c.status || c.status === 'Published');
  const featuredCollab =
    publishedCollabs.find((c) => c.id === store.homepage.featuredCollaborationId) ||
    publishedCollabs[0] ||
    null;

  const publishedTimeline = (store.timeline ?? []).filter((m) => !m.status || m.status === 'Published');

  // ── Scroll lock / unlock helpers ──
  const unlockScroll = useCallback(() => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }, []);

  const lockScroll = useCallback(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }, []);

  // ── Transition to revealed state ──
  const transitionToRevealed = useCallback((autoScrollToJoin = false) => {
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    if (failsafeTimeoutRef.current) clearTimeout(failsafeTimeoutRef.current);

    setHeroState('transitioning');
    unlockScroll();

    if (heroVideoRef.current) {
      heroVideoRef.current.pause();
      heroVideoRef.current.loop = false;
      heroVideoRef.current.muted = true;
    }
    isMutedRef.current = true;
    setIsMuted(true);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gwd:hero-revealed'));
    }

    setTimeout(() => {
      setHeroState('revealed');
      if (autoScrollToJoin) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 450);
  }, [unlockScroll]);

  // ── Video start / playback handler ──
  const startVideo = useCallback(() => {
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);

    const video = heroVideoRef.current;
    if (!video) {
      transitionToRevealed(false);
      return;
    }

    setHeroState('playing');
    lockScroll();
    video.playsInline = true;
    video.loop = false;

    // Attempt unmuted playback first
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Unmuted autoplay permitted
          setIsMuted(false);
          isMutedRef.current = false;
          const durationMs =
            video.duration && !isNaN(video.duration) ? video.duration * 1000 + 1000 : 50000;
          if (failsafeTimeoutRef.current) clearTimeout(failsafeTimeoutRef.current);
          failsafeTimeoutRef.current = setTimeout(() => transitionToRevealed(true), durationMs);
        })
        .catch(() => {
          // If browser restricts unmuted autoplay, smoothly continue playing muted so video is immediately visible
          video.muted = true;
          setIsMuted(true);
          isMutedRef.current = true;
          video.play().catch(() => {});
          const durationMs =
            video.duration && !isNaN(video.duration) ? video.duration * 1000 + 1000 : 50000;
          if (failsafeTimeoutRef.current) clearTimeout(failsafeTimeoutRef.current);
          failsafeTimeoutRef.current = setTimeout(() => transitionToRevealed(true), durationMs);
        });
    }
  }, [lockScroll, transitionToRevealed]);

  // ── Initial hero check on mount ──
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('gwd_hero_intro_seen');
      } catch {
        /* noop */
      }
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setHeroState('revealed');
      unlockScroll();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gwd:hero-revealed'));
      }
      return;
    }

    // Set playing state immediately so video is not blocked by loading screen
    setHeroState('playing');

    const video = heroVideoRef.current;
    if (video) {
      startVideo();
    }

    // Fallback failsafe timeout
    loadTimeoutRef.current = setTimeout(() => {
      transitionToRevealed(false);
    }, 15000);

    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      if (failsafeTimeoutRef.current) clearTimeout(failsafeTimeoutRef.current);
      unlockScroll();
    };
  }, [startVideo, transitionToRevealed, unlockScroll]);

  const handleTimeUpdate = () => {
    const video = heroVideoRef.current;
    if (video && video.duration) setVideoProgress(video.currentTime / video.duration);
  };

  const handleVideoEnded = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.pause();
      heroVideoRef.current.loop = false;
    }
    transitionToRevealed(true);
  };

  const handleSkipIntro = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.pause();
      heroVideoRef.current.loop = false;
    }
    transitionToRevealed(true);
  };

  const handleToggleSound = () => {
    if (heroVideoRef.current) {
      const nextMuted = !heroVideoRef.current.muted;
      heroVideoRef.current.muted = nextMuted;
      isMutedRef.current = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleVideoError = () => transitionToRevealed(false);

  // ── Watch Film modal handlers ──
  const openWatchFilmModal = () => setShowVideoModal(true);

  const closeWatchFilmModal = useCallback(() => {
    setShowVideoModal(false);
    watchFilmBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showVideoModal) closeWatchFilmModal();
    };
    if (showVideoModal) {
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeModalBtnRef.current?.focus(), 50);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showVideoModal, closeWatchFilmModal]);

  const isIntroPlaying = heroState === 'loading' || heroState === 'playing';

  return (
    <div className={styles.page}>
      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: HERO FILM (Full Viewport First Impression)
          ═══════════════════════════════════════════════════════════════ */}
      <section
        className={`${styles.filmSection} ${heroState === 'revealed' ? styles.filmSettled : ''}`}
        aria-label="Opening Film"
        data-dye-section="hero"
      >
        {/* Intro controls: Sound on/off & Skip intro */}
        {isIntroPlaying && (
          <div className={styles.introControls}>
            <button
              type="button"
              className={styles.soundToggleBtn}
              onClick={handleToggleSound}
              aria-label={isMuted ? 'Turn sound on' : 'Mute sound'}
              tabIndex={0}
            >
              {isMuted ? (
                <>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                  <span>Sound on</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                  <span>Mute</span>
                </>
              )}
            </button>

            <button
              type="button"
              className={styles.skipIntroBtn}
              onClick={handleSkipIntro}
              aria-label="Skip introduction film"
              tabIndex={0}
            >
              <span>Skip intro</span>
              <span className={styles.skipArrow}>→</span>
            </button>
          </div>
        )}

        {/* Minimal dark loading screen with centered GWD logo */}
        {heroState === 'loading' && (
          <div className={styles.loadingScreen}>
            <div className={styles.loadingLogoWrap}>
              <img
                src="/brand/gwd-logo.png"
                alt="GWD"
                className={styles.loadingLogo}
              />
              <span className={styles.loadingPulseDot} />
            </div>
          </div>
        )}

        {/* Cinematic Video Background */}
        <div className={styles.filmContainer}>
          <video
            ref={heroVideoRef}
            className={styles.filmVideo}
            muted={isMuted}
            autoPlay
            playsInline
            preload="auto"
            onCanPlay={startVideo}
            onLoadedData={startVideo}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
          >
            <source src={heroCms.videoUrl || '/gwd-hero.mp4'} type="video/mp4" />
            <source src={heroCms.fallbackVideoUrl || '/new-era-hero.mp4'} type="video/mp4" />
          </video>

          <div
            className={`${styles.filmScrim} ${heroState === 'revealed' || heroState === 'transitioning' ? styles.scrimActive : ''}`}
            aria-hidden="true"
          />

          {heroState === 'playing' && (
            <div
              className={styles.filmProgressBar}
              style={{ width: `${Math.min(100, Math.max(0, videoProgress * 100))}%` }}
              aria-hidden="true"
            />
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: GWD INTRODUCTION — HERO REVEAL
          ═══════════════════════════════════════════════════════════════ */}
      <section
        className={`${styles.heroRevealSection} ${heroState === 'revealed' ? styles.revealedVisible : ''}`}
        id="main-content"
        ref={introReveal.ref}
        data-dye-section="intro"
      >
        <div className="container">
          <div className={`${styles.heroSplitGrid} reveal ${introReveal.isVisible || heroState === 'revealed' ? 'visible' : ''}`}>
            {/* Left Column: Strong Headline & CTAs from CMS */}
            <div className={styles.heroTextCol}>
              <div className={styles.eyebrowChip}>
                <span className={styles.redDot} />
                <span className={styles.eyebrowText}>{heroCms.badge || 'GWD / GET WORK DONE'}</span>
              </div>

              <h1 className={styles.mainTitle}>
                {heroCms.headline ? (
                  <span style={{ whiteSpace: 'pre-line' }}>{heroCms.headline}</span>
                ) : (
                  <>
                    <span className={styles.redHighlight}>GET WORK</span>
                    <br />
                    DONE.
                  </>
                )}
              </h1>

              <p className={styles.mainSubtitle}>
                {heroCms.subheadline || 'A student collective that turns ideas into shipped work — tech, design, and everything between.'}
              </p>

              <div className={styles.heroActionGroup}>
                <Link href={heroCms.primaryCtaHref || '/explore'} className={styles.btnPrimary}>
                  {heroCms.primaryCtaText || 'Explore Domains'}
                </Link>
                <Link href="/work" className={styles.btnSecondary}>
                  Explore Work
                </Link>
                <button
                  ref={watchFilmBtnRef}
                  type="button"
                  onClick={openWatchFilmModal}
                  className={styles.btnWatchFilm}
                  aria-label="Watch intro film in modal"
                >
                  <svg className={styles.playIcon} viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>{heroCms.secondaryCtaText || 'Watch Film'}</span>
                </button>
              </div>

              {/* Connecting Accent Indicator */}
              <div className={styles.heroConnectingAccent}>
                <span className={styles.accentLabel}>{introCms.label || '01 · OVERVIEW'}</span>
                <span className={styles.accentLine} />
              </div>
            </div>

            {/* Right Column: Builder Activity Visual */}
            <div className={styles.heroVisualCol}>
              <div className={styles.heroFrame}>
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&q=80"
                  alt="GWD Builders collaborating on production systems"
                  className={styles.heroPhoto}
                  loading="eager"
                />
                <div className={styles.heroBadgeOverlay}>
                  <span className={styles.badgeText}>GWD GLOBAL &middot; INCORPORATED JUNE 2025</span>
                  <span className={styles.badgeSub}>Madhapur HQ &middot; VJIT Campus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2.5A: ONE COMPANY. THREE ARMS. (Slide 1)
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.threeArmsSection} ref={threeArmsReveal.ref} data-dye-section="intro">
        <div className="container">
          <div className={`reveal ${threeArmsReveal.isVisible ? 'visible' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <span className="label" style={{ color: 'var(--brand-red)' }}>• The company</span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.5)' }}>
                MCA Registered 2025 · Hyderabad HQ
              </span>
            </div>
            <h2 className={styles.sectionHeadingLarge} style={{ color: '#FFFFFF' }}>{introCms.threeArmsTitle || CLUB.companyHeadline}</h2>
            <p className={styles.sectionHeadingSub} style={{ color: 'rgba(255, 255, 255, 0.75)', maxWidth: '780px' }}>
              {introCms.threeArmsSub || CLUB.companySubheadline}
            </p>

            <div className={styles.threeArmsGrid}>
              {THREE_ARMS.map((arm) => (
                <div
                  key={arm.id}
                  className={`${styles.armCard} ${arm.highlighted ? styles.armCardHighlighted : ''}`}
                >
                  <div>
                    <h3 className={styles.armTitle}>{arm.name}</h3>
                    <span className={styles.armSubtitle}>{arm.subtitle}</span>
                    <p className={styles.armDesc}>{arm.description}</p>
                  </div>

                  <div className={styles.armFooter}>
                    {arm.tag && <span className={styles.armTag}>{arm.tag}</span>}
                    {arm.badge && (
                      <span className={styles.armBadge}>
                        {arm.badge.statusDot && <span className={styles.armStatusDot} />}
                        {arm.badge.text}
                      </span>
                    )}
                    {arm.metrics && (
                      <div className={styles.armMetrics}>
                        {arm.metrics.map((m, i) => (
                          <div key={i} className={styles.armMetricItem}>
                            <span className={styles.armMetricVal}>{m.value}</span>
                            <span className={styles.armMetricLbl}>{m.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2.5B: IT STARTED AS A STUDENT IDEA (Slide 1)
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.studentIdeaSection} ref={studentIdeaReveal.ref} data-dye-section="intro">
        <div className="container">
          <div className={`reveal ${studentIdeaReveal.isVisible ? 'visible' : ''}`}>
            <span className="label" style={{ color: 'var(--brand-red)' }}>• How it began</span>
            <div className={styles.studentIdeaGrid}>
              <div>
                <h2 className={styles.studentIdeaTitle}>{introCms.studentIdeaTitle || CLUB.studentIdeaHeadline}</h2>
                <p className={styles.studentIdeaBody}>
                  {introCms.studentIdeaBody || CLUB.studentIdeaStory}
                </p>
              </div>
              <div className={styles.studentIdeaRight}>
                <div className={styles.studentIdeaBox}>
                  <p className={styles.studentIdeaBoxTitle}>&ldquo;{CLUB.motto}&rdquo;</p>
                  <p className={styles.studentIdeaBoxSub}>The name never changed, because the mission never did.</p>
                  <div style={{ marginTop: 'var(--space-md)' }}>
                    <span className={styles.accoladeChip}>Top 500 Startups of Asia · E-Cell Bombay</span>
                    <span className={styles.accoladeChip}>Top 25 of India · E-Cell Bombay</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones Horizontal Row */}
            <div className={styles.milestonesTrack}>
              {publishedTimeline.slice(0, 4).map((m) => (
                <div
                  key={m.title}
                  className={`${styles.milestoneCard} ${m.highlighted ? styles.milestoneCardActive : ''}`}
                >
                  <div className={styles.milestoneDate}>{m.date}</div>
                  <h3 className={styles.milestoneTitle}>{m.title}</h3>
                  <p className={styles.milestoneDesc}>{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: WHAT GWD DOES (Core Domains & Capabilities)
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.whatWeDoSection} ref={whatWeDoReveal.ref} data-dye-section="whatwedo">
        <div className="container">
          <div className={`${styles.sectionHeader} reveal ${whatWeDoReveal.isVisible ? 'visible' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="label" style={{ color: 'var(--brand-red)' }}>02 · Capabilities & Domains</span>
                <h2 className={styles.sectionHeadingLarge}>What We Do</h2>
                <p className={styles.sectionHeadingSub}>
                  Specialized organizational domains operating with synchronized execution — from systems architecture to live production.
                </p>
              </div>
              <Link href="/explore" className={styles.viewAllWorkLink}>
                <span>Explore all {domainsList.length} domains</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className={styles.disciplinesInteractive}>
            <div className={styles.disciplinesList}>
              {domainsList.slice(0, 4).map((domain, index) => {
                const isActive = activeDiscipline === index;
                return (
                  <div
                    key={domain.id}
                    className={`${styles.disciplineRow} ${isActive ? styles.disciplineRowActive : ''}`}
                    onClick={() => setActiveDiscipline(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveDiscipline(index)}
                    aria-label={`View details for ${domain.name}`}
                  >
                    <div className={styles.rowMain}>
                      <span className={styles.rowIndex}>0{index + 1}</span>
                      <h3 className={styles.rowTitle}>{domain.name}</h3>
                    </div>
                    <p className={styles.rowDesc}>{domain.shortDesc}</p>
                    <div className={styles.tagPills}>
                      {domain.deliverables.slice(0, 3).map((tag) => (
                        <span key={tag} className={styles.tagPill}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Discipline Deliverable Showcase */}
            <div className={styles.disciplinePreviewCol}>
              {domainsList[activeDiscipline] && (
                <div className={styles.previewCard}>
                  <div className={styles.previewImageWrap}>
                    <img
                      src={domainsList[activeDiscipline].leadPhoto || '/team/president.jpg'}
                      alt={domainsList[activeDiscipline].name}
                      className={styles.previewImage}
                    />
                    <div className={styles.previewOverlay}>
                      <span className={styles.previewIndex}>0{activeDiscipline + 1}</span>
                      <span className={styles.previewCategory}>DOMAIN FOCUS · {domainsList[activeDiscipline].code}</span>
                    </div>
                  </div>
                  <div className={styles.previewInfo}>
                    <span className={styles.previewLabel}>LEAD & DELIVERABLES</span>
                    <p style={{ fontWeight: 600, color: '#121212', marginBottom: '0.25rem' }}>
                      Lead: {domainsList[activeDiscipline].leadName} ({domainsList[activeDiscipline].leadRole})
                    </p>
                    <p className={styles.previewDeliverables}>{domainsList[activeDiscipline].fullDesc}</p>
                    <div style={{ marginTop: '1.25rem' }}>
                      <Link href="/explore" className={styles.projectActionLink}>
                        Explore Domain members & work →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Atmospheric Fluid Chapter Transition ── */}
      <DyeAtmosphereTransition
        chapter="03 · ARCHITECTURE & SHIPPED SYSTEMS"
        title="Execution velocity across live production environments"
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: SELECTED WORK (Things We Actually Built)
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.featuredWorkSection} ref={workReveal.ref} data-dye-section="work">
        <div className="container">
          <div className={styles.workHeaderRow}>
            <div className={styles.sectionHeader} style={{ marginBottom: 0 }}>
              <span className="label" style={{ color: 'var(--brand-red)' }}>03 · Shipped Deliverables</span>
              <h2 className={styles.sectionHeadingLarge}>Work That Ships</h2>
              <p className={styles.sectionHeadingSub}>
                Production platforms, enterprise systems, and digital infrastructure built and delivered by the GWD collective.
              </p>
            </div>
            <Link href="/work" className={styles.viewAllWorkLink}>
              <span>View all work</span>
              <span>→</span>
            </Link>
          </div>

          <div className={styles.workAsymmetricGrid}>
            {featuredProjects.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '3rem 1.5rem', textAlign: 'center', background: '#121212', borderRadius: '16px', border: '1px solid #222', color: '#999' }}>
                <p style={{ margin: 0, fontSize: '1rem', color: '#bbb' }}>No projects currently published in the showcase.</p>
                <Link href="/work" style={{ color: 'var(--brand-red)', display: 'inline-block', marginTop: '0.75rem', fontWeight: 600 }}>
                  View All Archives &rarr;
                </Link>
              </div>
            )}
            {/* Dominant Featured Project */}
            {featuredProjects[0] && (
              <div className={styles.dominantProjectCard} style={{ position: 'relative', overflow: 'hidden' }}>
                <BorderBeam size={360} duration={12} colorFrom="#C41E1E" colorTo="#EF4444" borderWidth={2} />
                <Link href={`/work/${featuredProjects[0].id}`} className={styles.dominantMediaWrap}>
                  <img
                    src={featuredProjects[0].heroImage}
                    alt={featuredProjects[0].title}
                    className={styles.dominantCoverImage}
                  />
                  <div className={styles.mediaOverlayGradient} />
                  <span className={styles.projectCategoryBadge}>{featuredProjects[0].category}</span>
                  <span className={styles.dominantYearBadge}>{featuredProjects[0].year}</span>
                </Link>
                <div className={styles.dominantDetails}>
                  {featuredProjects[0].outcome && (
                    <div className={styles.outcomePillRow}>
                      <span className={styles.outcomePill}>
                        <span className={styles.outcomePulseDot} />
                        <span className={styles.outcomePillText}>{featuredProjects[0].outcome}</span>
                      </span>
                    </div>
                  )}
                  <Link href={`/work/${featuredProjects[0].id}`} className={styles.dominantTitleLink}>
                    <h3 className={styles.dominantTitle}>{featuredProjects[0].title}</h3>
                  </Link>
                  <p className={styles.dominantDesc}>{featuredProjects[0].shortDescription}</p>
                  <div className={styles.dominantFooter}>
                    <div className={styles.collaboratorChips}>
                      {featuredProjects[0].tags.slice(0, 4).map((tag) => (
                        <span key={tag} className={styles.collaboratorChip}>{tag}</span>
                      ))}
                    </div>
                    <Link href={`/work/${featuredProjects[0].id}`} className={styles.projectActionLink}>
                      <span>Read Full Case Study</span>
                      <span className={styles.arrowGlyph}>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Supporting Projects Grid */}
            <div className={styles.supportingProjectsGrid}>
              {featuredProjects.slice(1, 3).map((project) => (
                <div key={project.id} className={styles.supportingProjectCard} style={{ position: 'relative', overflow: 'hidden' }}>
                  <BorderBeam size={240} duration={14} colorFrom="#E11D48" colorTo="#F59E0B" borderWidth={1.5} />
                  <Link href={`/work/${project.id}`} className={styles.supportingMediaWrap}>
                    <img
                      src={project.heroImage}
                      alt={project.title}
                      className={styles.supportingCoverImage}
                    />
                    <div className={styles.mediaOverlayGradient} />
                    <span className={styles.supportingCategoryBadge}>{project.category}</span>
                    <span className={styles.supportingYearBadge}>{project.year}</span>
                  </Link>
                  <div className={styles.supportingDetails}>
                    {project.outcome && (
                      <div className={styles.outcomePillRow}>
                        <span className={styles.outcomePill}>
                          <span className={styles.outcomePulseDot} />
                          <span className={styles.outcomePillText}>{project.outcome}</span>
                        </span>
                      </div>
                    )}
                    <Link href={`/work/${project.id}`} className={styles.supportingTitleLink}>
                      <h3 className={styles.supportingTitle}>{project.title}</h3>
                    </Link>
                    <p className={styles.supportingDesc}>{project.shortDescription}</p>
                    <div className={styles.supportingFooter}>
                      <div className={styles.supportingTags}>
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className={styles.supportingTagChip}>{tag}</span>
                        ))}
                      </div>
                      <Link href={`/work/${project.id}`} className={styles.supportingLink}>
                        <span>Case study</span>
                        <span className={styles.arrowGlyph}>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: FEATURED EVENT SHOWCASE
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.eventShowcaseSection} ref={eventReveal.ref} data-dye-section="events">
        <div className="container">
          <div className={styles.eventHeaderRow}>
            <div className={styles.sectionHeader} style={{ marginBottom: 0 }}>
              <span className="label" style={{ color: 'var(--brand-red)' }}>04 · Events & Showcases</span>
              <h2 className={styles.sectionHeadingLarge}>Upcoming Gathering</h2>
              <p className={styles.sectionHeadingSub}>
                Hands-on hackathons, summits, and builder demos organized by GWD across campuses.
              </p>
            </div>
            <Link href="/events" className={styles.viewAllEventsLink}>
              <span>All events & schedule</span>
              <span>→</span>
            </Link>
          </div>

          {featuredEvent ? (
            <div className={`${styles.eventFeatureBanner} reveal ${eventReveal.isVisible ? 'visible' : ''}`}>
              <div className={styles.eventBannerMediaCol}>
                <img
                  src={featuredEvent.image}
                  alt={featuredEvent.title}
                  className={styles.eventBannerImg}
                />
                <div className={styles.eventBannerCategoryBadge}>
                  {featuredEvent.category}
                </div>
                <div
                  className={styles.eventLiveStatusBadge}
                  style={{
                    background: isRegOpen ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    borderColor: isRegOpen ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                    color: isRegOpen ? '#4ade80' : '#f87171',
                  }}
                >
                  <span
                    className={styles.livePulseDot}
                    style={{ background: isRegOpen ? '#22c55e' : '#ef4444' }}
                  />
                  <span>{isRegOpen ? 'REGISTRATIONS OPEN' : eventRegState ? eventRegState.toUpperCase() : 'REGISTRATIONS CLOSED'}</span>
                </div>
                <div className={styles.eventVisualBottomBar}>
                  <div className={styles.dateBlock}>
                    <span className={styles.dateBlockMonth}>{monthStr}</span>
                    <span className={styles.dateBlockDay}>{dayStr}</span>
                  </div>
                  <div className={styles.visualMetaText}>
                    <span className={styles.visualMetaTitle}>{featuredEvent.location}</span>
                    <span className={styles.visualMetaSub}>{featuredEvent.title}</span>
                  </div>
                </div>
              </div>

              <div className={styles.eventBannerDetailsCol}>
                <div>
                  <div className={styles.eventDateBadge}>
                    <span className={styles.dateCalIcon}>📅</span>
                    <span>{featuredEvent.date} • {featuredEvent.time}</span>
                  </div>

                  <h3 className={styles.eventBannerTitle}>{featuredEvent.title}</h3>
                  <p className={styles.eventBannerDesc}>{featuredEvent.description}</p>
                </div>

                <div className={styles.eventMetaGrid}>
                  <div className={styles.eventMetaCard}>
                    <span className={styles.metaIcon}>📍</span>
                    <div>
                      <span className={styles.metaLabel}>LOCATION & VENUE</span>
                      <span className={styles.metaValue}>{featuredEvent.location}</span>
                    </div>
                  </div>
                  <div className={styles.eventMetaCard}>
                    <span className={styles.metaIcon}>👥</span>
                    <div>
                      <span className={styles.metaLabel}>ATTENDANCE CAP</span>
                      <span className={styles.metaValue}>{featuredEvent.capacity || 150} Builder Seats</span>
                    </div>
                  </div>
                  <div className={styles.eventMetaCard}>
                    <span className={styles.metaIcon}>⚡</span>
                    <div>
                      <span className={styles.metaLabel}>EVENT TRACKS</span>
                      <span className={styles.metaValue}>Full-Stack • Design • Systems</span>
                    </div>
                  </div>
                </div>

                <div className={styles.eventActionRow}>
                  {isRegOpen ? (
                    <Link href={`/events/${featuredEvent.id}/register`} className={styles.btnEventRegister}>
                      <span>Register for Event</span>
                      <span>→</span>
                    </Link>
                  ) : (
                    <span
                      className={styles.btnEventRegister}
                      style={{ opacity: 0.5, cursor: 'not-allowed', background: '#262626' }}
                      title="Registrations are currently closed"
                    >
                      <span>{eventRegState || 'Registration Closed'}</span>
                    </span>
                  )}
                  <Link href={`/events/${featuredEvent.id}`} className={styles.btnEventDetails}>
                    <span>Full Schedule & Details</span>
                    <span>↗</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#121212', borderRadius: '16px', border: '1px solid #222', color: '#999' }}>
              <p style={{ margin: 0, fontSize: '1rem', color: '#bbb' }}>No upcoming events scheduled at this time.</p>
              <Link href="/events" style={{ color: 'var(--brand-red)', display: 'inline-block', marginTop: '0.75rem', fontWeight: 600 }}>
                View Past Event Archives &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: LEADERSHIP SPOTLIGHT
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.presidentSection} ref={leaderReveal.ref} data-dye-section="team">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="label" style={{ color: 'var(--brand-red)' }}>05 · Executive Direction</span>
            <h2 className={styles.sectionHeadingLarge}>Leadership & Direction</h2>
            <p className={styles.sectionHeadingSub}>
              Structured leadership driving accountability, project delivery, and student transformation.
            </p>
          </div>

          {president && (
            <div className={`${styles.presidentFeatureCard} reveal ${leaderReveal.isVisible ? 'visible' : ''}`}>
              <div className={styles.presidentPortraitCol}>
                <div className={styles.portraitWrap}>
                  <img
                    src={president.photo || '/team/president.jpg'}
                    alt={president.name}
                    className={styles.presidentImg}
                  />
                  <div className={styles.portraitTag}>CLUB LEADERSHIP · SLOT 01</div>
                </div>
              </div>

              <div className={styles.presidentDetailsCol}>
                <span className={styles.leaderRoleChip}>{president.role} · GWD Club</span>
                <h3 className={styles.presidentName}>{president.name}</h3>
                <p className={styles.presidentBio}>{president.bio}</p>

                {president.quote && (
                  <blockquote className={styles.presidentQuoteBox}>
                    &ldquo;{president.quote}&rdquo;
                  </blockquote>
                )}

                <div className={styles.leaderCtaRow}>
                  <Link href="/team" className={styles.btnFullHierarchy}>
                    Meet the Full Team →
                  </Link>
                  <Link href="/explore" className={styles.btnSecondary} style={{ display: 'inline-flex' }}>
                    Explore Working Domains
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: SELECTED COLLABORATION
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.collabSection} ref={collabReveal.ref} data-dye-section="collab">
        <div className="container">
          <div className={styles.collabHeaderRow}>
            <div className={styles.sectionHeader} style={{ marginBottom: 0 }}>
              <span className="label" style={{ color: 'var(--brand-red)' }}>06 · Collaborations</span>
              <h2 className={styles.sectionHeadingLarge}>Partners & Ecosystem</h2>
              <p className={styles.sectionHeadingSub}>
                Organizations, institutions, and clients powering GWD&apos;s build velocity across borders.
              </p>
            </div>
            <Link href="/collaborations" className={styles.viewCollabLink}>
              <span>View all collaborations</span>
              <span>→</span>
            </Link>
          </div>

          <div className={styles.collabGrid}>
            <DyeContainedCard
              badge="ECOSYSTEM ENGINE"
              title="The GWD Collective Mesh"
              description="Real-time execution network connecting student builders, enterprise sponsors, and industry labs across India and worldwide."
              theme="light"
              height={220}
            />
            {publishedCollabs.slice(0, 2).map((c) => (
              <div key={c.name} className={styles.collabCard}>
                <div className={styles.collabTopRow}>
                  <span className={styles.collabTypeBadge}>{c.type}</span>
                  <span className={styles.collabYearBadge}>{c.year}</span>
                </div>
                <h3 className={styles.collabName}>{c.name}</h3>
                <p className={styles.collabDesc}>{c.description}</p>
                <div className={styles.collabOutcomeBox}>
                  <span className={styles.outcomeTag}>OUTCOME:</span>
                  <span className={styles.outcomeVal}>{c.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7.4: SLIDE 9 — BUILT IN HYDERABAD. WORKING ACROSS 10 COUNTRIES.
          ═══════════════════════════════════════════════════════════════ */}
      <GlobalPresence />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7.5: WHO WE'VE BUILT FOR — DARK HARDWARE CONSOLE
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.clientsConsoleSection} data-dye-section="collab">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className={styles.clientsConsoleHeader}>
            <div>
              <span className="label" style={{ color: 'var(--brand-red)' }}>• Who we&apos;ve built for</span>
              <h2 className={styles.clientsConsoleTitle}>Enterprise &amp; Growth Alliances</h2>
            </div>
            <p className={styles.clientsConsoleSub}>
              Enterprise and growth-stage clients across ten countries and three continents.
            </p>
          </div>

          {/* Kinetic Marquee Scroller with Dark Hardware Beveled Keycaps */}
          <GwdClientScroller theme="dark" />

          <p className={styles.clientsConsoleDisclaimer}>
            {CLIENT_DISCLAIMER}
          </p>

          {/* Bottom Bar: Who we build with */}
          <div className={styles.ecosystemConsoleBar}>
            <span className={styles.ecosystemConsoleBadge}>
              Who we build with
            </span>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <EcosystemScroller theme="dark" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 8: CLUB & GLOBAL STATS STRIP
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.statsStripSection} ref={statsReveal.ref} data-dye-section="stats">
        <div className="container">
          <div className={`${styles.sectionHeader} reveal ${statsReveal.isVisible ? 'visible' : ''}`} style={{ textAlign: 'center', margin: '0 auto var(--space-2xl)' }}>
            <span className="label" style={{ color: 'var(--brand-red)' }}>07 · Impact</span>
            <h2 className={styles.sectionHeadingLarge}>The Journey So Far</h2>
          </div>
          <div className={`${styles.statsStripGrid} reveal ${statsReveal.isVisible ? 'visible' : ''}`}>
            {statsCms.map((stat) => (
              <StatItem
                key={stat.label}
                label={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 9: FINAL CALL TO ACTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.finalCtaSection} ref={ctaReveal.ref} data-dye-section="cta">
        <DyeCtaBackdrop
          tag={finalCtaCms.tag || 'JOIN THE COLLECTIVE'}
          title={
            <>
              {finalCtaCms.headline || 'Have an idea?'}
              <br />
              <span className={styles.finalCtaRed}>{finalCtaCms.highlightWord || "Let's get it done."}</span>
            </>
          }
          subtitle={
            finalCtaCms.subtitle ||
            'Whether you want to build projects, organize national events, or sharpen your craft — GWD is where ideas become shipped work.'
          }
          primaryCtaText={finalCtaCms.primaryText || 'Join GWD'}
          primaryCtaHref={finalCtaCms.primaryHref || '/join'}
          secondaryCtaText={finalCtaCms.secondaryText || 'Explore Domains'}
          secondaryCtaHref={finalCtaCms.secondaryHref || '/explore'}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WATCH FILM MODAL (Full Screen High Resolution Player)
          ═══════════════════════════════════════════════════════════════ */}
      {showVideoModal && (
        <div
          className={styles.videoModal}
          onClick={closeWatchFilmModal}
          role="dialog"
          aria-modal="true"
          aria-label="GWD Introduction Film"
        >
          <div className={styles.videoModalInner} onClick={(e) => e.stopPropagation()}>
            <button
              ref={closeModalBtnRef}
              type="button"
              className={styles.closeModalBtn}
              onClick={closeWatchFilmModal}
              aria-label="Close video"
            >
              ✕
            </button>
            <video
              ref={modalVideoRef}
              className={styles.modalVideoPlayer}
              controls
              autoPlay
              playsInline
            >
              <source src={heroCms.videoUrl || '/gwd-hero.mp4'} type="video/mp4" />
              <source src={heroCms.fallbackVideoUrl || '/new-era-hero.mp4'} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
