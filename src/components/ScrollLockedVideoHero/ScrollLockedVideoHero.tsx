'use client';

import {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import styles from './ScrollLockedVideoHero.module.css';

// ── TODO: replace with final GWD hero video ──
const DEFAULT_VIDEO_SRC = '/gwd-hero.mp4';

/* ═══════════════════════════════════════════════════════════
   ScrollLockedVideoHero
   ───────────────────────────────────────────────────────────
   Full-viewport section that scroll-locks the page.
   While locked, wheel / touch input scrubs the video's
   currentTime from 0 → duration. Title, tagline, hint,
   and progress bar all react to the same 0→1 progress value.
   ═══════════════════════════════════════════════════════════ */

interface ScrollLockedVideoHeroProps {
  /** Path or URL to the hero video.
   *  TODO: replace default with final GWD hero footage. */
  videoSrc?: string;
  /** Large hero title — supports JSX for mixed styling */
  title?: string;
  /** Subtitle shown below the title */
  tagline?: string;
  /** Show author / signature line (set false for GWD) */
  signature?: boolean;
  /** Total px of virtual scroll before unlock.
   *  Tune to the video's duration — longer videos want more.
   *  Default: 3000 */
  scrubDistance?: number;
}

export default function ScrollLockedVideoHero({
  videoSrc = DEFAULT_VIDEO_SRC,
  title = 'GET WORK DONE.',
  tagline = 'A student collective that turns ideas into shipped work — tech, design, and everything between.',
  signature = false,
  scrubDistance = 3000,
}: ScrollLockedVideoHeroProps) {
  /* ── Refs ── */
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  /* ── State ── */
  const [ready, setReady] = useState(false);

  /* ── Mutable scrub state (no re-renders) ── */
  const scrubState = useRef({
    locked: false,
    scrollAccum: 0,        // accumulated virtual scroll (px)
    currentProgress: 0,    // 0→1
    targetProgress: 0,     // what we're animating toward
    animFrame: 0,
    isSeeking: false,
    pendingTime: -1,
  });

  /* ── Lenis coordination ── */
  const getLenis = useCallback(() => {
    // Lenis attaches itself to window.__lenis when instantiated
    // via the standard <SmoothScrollProvider> pattern.
    // If Lenis hasn't been added yet this safely returns null.
    return (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis ?? null;
  }, []);

  /* ── Lock / Unlock helpers ── */
  const lockScroll = useCallback(() => {
    const s = scrubState.current;
    if (s.locked) return;
    s.locked = true;

    // Prevent native scroll
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // Tell Lenis to stop so we own scroll
    getLenis()?.stop();
  }, [getLenis]);

  const unlockScroll = useCallback(() => {
    const s = scrubState.current;
    if (!s.locked) return;
    s.locked = false;

    document.body.style.overflow = '';
    document.body.style.touchAction = '';

    // Hand scroll back to Lenis
    getLenis()?.start();
  }, [getLenis]);

  /* ── Determine if hero is in viewport → engage/disengage lock ── */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !ready) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          lockScroll();
        } else {
          unlockScroll();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(wrap);
    return () => {
      observer.disconnect();
      unlockScroll(); // safety
    };
  }, [ready, lockScroll, unlockScroll]);

  /* ── Video ready ── */
  const handleLoadedData = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    setReady(true);
  }, []);

  /* ── Seeking queue — only seek when the browser is done with the previous seek ── */
  const handleSeeked = useCallback(() => {
    const s = scrubState.current;
    s.isSeeking = false;
    if (s.pendingTime >= 0) {
      const vid = videoRef.current;
      if (vid) {
        s.isSeeking = true;
        vid.currentTime = s.pendingTime;
        s.pendingTime = -1;
      }
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    const vid = videoRef.current;
    const s = scrubState.current;
    if (!vid) return;

    if (s.isSeeking) {
      s.pendingTime = time;
    } else {
      s.isSeeking = true;
      vid.currentTime = time;
    }
  }, []);

  /* ═══ Animation frame loop ═══
     Interpolates currentProgress → targetProgress,
     then updates all visual layers accordingly.       */
  const frame = useCallback(() => {
    const s = scrubState.current;
    const vid = videoRef.current;

    // Lerp toward target
    const diff = s.targetProgress - s.currentProgress;
    if (Math.abs(diff) > 0.0005) {
      s.currentProgress += diff * 0.12; // smoothing factor
    } else {
      s.currentProgress = s.targetProgress;
    }
    const p = s.currentProgress;

    /* ── Video time ── */
    if (vid && vid.duration) {
      seekTo(p * vid.duration);
    }

    /* ── Video scale (subtle zoom as you scrub) ── */
    if (vid) {
      const scale = 1.0 + p * 0.06;
      vid.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    /* ── Title: fade + blur away in the first 40% ── */
    if (titleRef.current) {
      const titleOpacity = Math.max(0, 1 - p / 0.4);
      const titleBlur = Math.min(p / 0.4, 1) * 12;
      titleRef.current.style.opacity = String(titleOpacity);
      titleRef.current.style.filter = `blur(${titleBlur}px)`;
    }

    /* ── Tagline: visible between 30%–70% ── */
    if (taglineRef.current) {
      let taglineOpacity: number;
      if (p < 0.3) {
        taglineOpacity = 0;
      } else if (p < 0.45) {
        taglineOpacity = (p - 0.3) / 0.15;
      } else if (p < 0.55) {
        taglineOpacity = 1;
      } else if (p < 0.7) {
        taglineOpacity = 1 - (p - 0.55) / 0.15;
      } else {
        taglineOpacity = 0;
      }
      const taglineY = p < 0.3 ? 16 : Math.max(0, 16 - ((p - 0.3) / 0.15) * 16);
      taglineRef.current.style.opacity = String(taglineOpacity);
      taglineRef.current.style.transform = `translateY(${taglineY}px)`;
    }

    /* ── Scroll hint: fade out in first 15% ── */
    if (hintRef.current) {
      const hintOpacity = Math.max(0, 1 - p / 0.15);
      hintRef.current.style.opacity = String(hintOpacity);
    }

    /* ── Progress bar ── */
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${p * 100}%`;
    }

    /* ── If progress hit 1, unlock ── */
    if (p >= 0.999) {
      unlockScroll();
    }

    s.animFrame = requestAnimationFrame(frame);
  }, [seekTo, unlockScroll]);

  /* ── Start / stop the loop ── */
  useEffect(() => {
    if (!ready) return;

    // Check reduced-motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Jump to end state
      const s = scrubState.current;
      s.currentProgress = 1;
      s.targetProgress = 1;
      const vid = videoRef.current;
      if (vid && vid.duration) vid.currentTime = vid.duration;
      if (titleRef.current) {
        titleRef.current.style.opacity = '0';
        titleRef.current.style.filter = 'blur(12px)';
      }
      if (taglineRef.current) {
        taglineRef.current.style.opacity = '0';
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = '0';
      }
      if (progressFillRef.current) {
        progressFillRef.current.style.width = '100%';
      }
      unlockScroll();
      return;
    }

    scrubState.current.animFrame = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(scrubState.current.animFrame);
  }, [ready, frame, unlockScroll]);

  /* ═══ Wheel / Touch handlers ═══ */
  useEffect(() => {
    if (!ready) return;

    const handleWheel = (e: WheelEvent) => {
      const s = scrubState.current;
      if (!s.locked) return;
      e.preventDefault();

      // Accumulate scroll delta
      s.scrollAccum += e.deltaY;
      s.scrollAccum = Math.max(0, Math.min(s.scrollAccum, scrubDistance));
      s.targetProgress = s.scrollAccum / scrubDistance;

      // If user scrolls back to 0, re-lock is handled by intersection observer
      // If user scrolls past 1, unlock happens in frame()
    };

    let touchStartY = 0;
    let touchAccumAtStart = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const s = scrubState.current;
      if (!s.locked) return;
      touchStartY = e.touches[0].clientY;
      touchAccumAtStart = s.scrollAccum;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const s = scrubState.current;
      if (!s.locked) return;
      e.preventDefault();

      const deltaY = touchStartY - e.touches[0].clientY;
      s.scrollAccum = Math.max(0, Math.min(touchAccumAtStart + deltaY * 2, scrubDistance));
      s.targetProgress = s.scrollAccum / scrubDistance;
    };

    // Attach to window so we capture all input while locked
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [ready, scrubDistance]);

  /* ── Kickstart video load (iOS needs explicit load()) ── */
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.load();
    }
  }, [videoSrc]);

  /* ═══ Render ═══ */
  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div className={styles.stickyFrame}>
        {/* ── Video Layer ── */}
        <div className={styles.videoLayer}>
          <video
            ref={videoRef}
            className={styles.videoElement}
            src={videoSrc}
            muted
            playsInline
            preload="auto"
            onLoadedData={handleLoadedData}
            onSeeked={handleSeeked}
          />
          <div className={styles.overlay} />
        </div>

        {/* ── Content Layer ── */}
        <div className={styles.contentLayer}>
          <h1 ref={titleRef} className={styles.title}>
            <span className={styles.titleRed}>GET WORK</span> DONE.
          </h1>
          <p ref={taglineRef} className={styles.tagline}>
            {tagline}
          </p>
        </div>

        {/* ── Scroll Hint ── */}
        <div ref={hintRef} className={styles.scrollHint}>
          <span className={styles.scrollHintLabel}>Scroll</span>
          <span className={styles.scrollHintLine} />
        </div>

        {/* ── Progress Bar ── */}
        <div className={styles.progressBar}>
          <div ref={progressFillRef} className={styles.progressFill} />
        </div>
      </div>
    </div>
  );
}
