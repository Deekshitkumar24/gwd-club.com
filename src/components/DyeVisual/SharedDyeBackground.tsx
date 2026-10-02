'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { DyeWhorl } from '@/components/ui/dye-whorl';
import { useCms } from '@/context/CmsContext';
import styles from './SharedDyeBackground.module.css';

export interface DyeSectionProfile {
  theme: 'light' | 'dark';
  speed: number;
  density: number;
  stir: number;
  opacity: number;
  scale: number;
  blur: number;
  background?: string;
}

export const DYE_PROFILES: Record<string, DyeSectionProfile> = {
  hero: {
    theme: 'dark',
    speed: 0.65,
    density: 0.9,
    stir: 0.9,
    opacity: 0.65,
    scale: 1.0,
    blur: 0,
    background: '#0D0D10',
  },
  intro: {
    theme: 'light',
    speed: 0.6,
    density: 0.85,
    stir: 0.9,
    opacity: 0.62,
    scale: 1.05,
    blur: 0,
    background: '#FAFAFB',
  },
  whatwedo: {
    theme: 'light',
    speed: 0.62,
    density: 0.85,
    stir: 0.9,
    opacity: 0.62,
    scale: 1.05,
    blur: 0,
    background: '#FFFFFF',
  },
  work: {
    theme: 'light',
    speed: 0.65,
    density: 0.88,
    stir: 0.92,
    opacity: 0.65,
    scale: 1.05,
    blur: 0,
    background: '#F9F9FB',
  },
  events: {
    theme: 'light',
    speed: 0.62,
    density: 0.85,
    stir: 0.9,
    opacity: 0.64,
    scale: 1.05,
    blur: 0,
    background: '#FFFFFF',
  },
  team: {
    theme: 'light',
    speed: 0.6,
    density: 0.85,
    stir: 0.88,
    opacity: 0.62,
    scale: 1.0,
    blur: 0,
    background: '#FAFAFB',
  },
  collab: {
    theme: 'dark',
    speed: 0.7,
    density: 0.92,
    stir: 0.9,
    opacity: 0.68,
    scale: 1.05,
    blur: 0,
    background: '#0D0D10',
  },
  stats: {
    theme: 'light',
    speed: 0.6,
    density: 0.85,
    stir: 0.9,
    opacity: 0.62,
    scale: 1.0,
    blur: 0,
    background: '#FFFFFF',
  },
  cta: {
    theme: 'dark',
    speed: 0.75,
    density: 0.95,
    stir: 0.95,
    opacity: 0.72,
    scale: 1.0,
    blur: 0,
    background: '#0A0A0C',
  },
  explore: {
    theme: 'dark',
    speed: 0.65,
    density: 0.88,
    stir: 0.9,
    opacity: 0.7,
    scale: 1.05,
    blur: 0,
    background: '#0D0D10',
  },
  gallery: {
    theme: 'dark',
    speed: 0.65,
    density: 0.88,
    stir: 0.9,
    opacity: 0.7,
    scale: 1.05,
    blur: 0,
    background: '#0B0B0E',
  },
  join: {
    theme: 'dark',
    speed: 0.7,
    density: 0.9,
    stir: 0.9,
    opacity: 0.72,
    scale: 1.05,
    blur: 0,
    background: '#0E0E12',
  },
  connect: {
    theme: 'dark',
    speed: 0.7,
    density: 0.92,
    stir: 0.92,
    opacity: 0.75,
    scale: 1.05,
    blur: 0,
    background: '#0D0E14',
  },
  workflow: {
    theme: 'light',
    speed: 0.62,
    density: 0.85,
    stir: 0.88,
    opacity: 0.62,
    scale: 1.05,
    blur: 0,
    background: '#FFFFFF',
  },
  about: {
    theme: 'light',
    speed: 0.6,
    density: 0.85,
    stir: 0.9,
    opacity: 0.64,
    scale: 1.05,
    blur: 0,
    background: '#FAFAFB',
  },
  admin: {
    theme: 'dark',
    speed: 0.25,
    density: 0.35,
    stir: 0.2,
    opacity: 0.15,
    scale: 1.0,
    blur: 2,
    background: '#0B0C0E',
  },
  default: {
    theme: 'light',
    speed: 0.62,
    density: 0.85,
    stir: 0.9,
    opacity: 0.62,
    scale: 1.0,
    blur: 0,
    background: '#FFFFFF',
  },
};

interface SharedDyeContextType {
  activeSection: string;
  setSection: (sectionKey: string) => void;
  profile: DyeSectionProfile;
}

const SharedDyeContext = createContext<SharedDyeContextType | null>(null);

export function SharedDyeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { store } = useCms();
  const [activeSection, setActiveSection] = useState<string>('hero');

  const isAdmin = pathname?.startsWith('/admin') ?? false;
  const isEnabled = (store?.settings?.dyeWhorlEnabled !== false) && !isAdmin;

  // Set default initial section based on route
  useEffect(() => {
    if (pathname === '/') {
      setActiveSection('hero');
    } else if (pathname.startsWith('/explore')) {
      setActiveSection('explore');
    } else if (pathname.startsWith('/gallery')) {
      setActiveSection('gallery');
    } else if (pathname.startsWith('/join')) {
      setActiveSection('join');
    } else if (pathname.startsWith('/work')) {
      setActiveSection('work');
    } else if (pathname.startsWith('/events')) {
      setActiveSection('events');
    } else if (pathname.startsWith('/team')) {
      setActiveSection('team');
    } else if (pathname.startsWith('/about')) {
      setActiveSection('about');
    } else if (pathname.startsWith('/admin')) {
      setActiveSection('admin');
    } else if (pathname.startsWith('/workflow')) {
      setActiveSection('workflow');
    } else if (pathname.startsWith('/connect')) {
      setActiveSection('connect');
    } else {
      setActiveSection('default');
    }
  }, [pathname]);

  // Observe elements with [data-dye-section] on scroll
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Find the entry that has the largest intersection ratio
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length > 0) {
        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const sec = visible[0].target.getAttribute('data-dye-section');
        if (sec && DYE_PROFILES[sec]) {
          setActiveSection(sec);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: [0.15, 0.35, 0.6],
      rootMargin: '-5% 0px -10% 0px',
    });

    const elements = document.querySelectorAll('[data-dye-section]');
    elements.forEach((el) => observer.observe(el));

    // Re-query if DOM changes
    const mutationObserver = new MutationObserver(() => {
      const currentElements = document.querySelectorAll('[data-dye-section]');
      currentElements.forEach((el) => observer.observe(el));
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  const profile = useMemo(() => {
    return DYE_PROFILES[activeSection] || DYE_PROFILES.default;
  }, [activeSection]);

  const isDark = profile.theme === 'dark';

  return (
    <SharedDyeContext.Provider value={{ activeSection, setSection: setActiveSection, profile }}>
      {/* ── Single Viewport-Wide Fixed Canvas (Purely Decorative Background Layer) ── */}
      {isEnabled && (
        <div
          className={styles.sharedDyeRoot}
          style={{
            opacity: profile.opacity,
            transform: `scale(${profile.scale})`,
            filter: profile.blur > 0 ? `blur(${profile.blur}px)` : 'none',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          <div className={styles.canvasWrap} style={{ pointerEvents: 'none', userSelect: 'none' }}>
            <DyeWhorl
              key={profile.theme} // recreate solver if fundamental color palette changes
              speed={profile.speed}
              density={profile.density}
              stir={profile.stir}
              theme={profile.theme}
              interactive="global"
              globalTracking={true}
              background={profile.background}
              style={{ width: '100%', height: '100%', pointerEvents: 'none', userSelect: 'none' }}
            />
          </div>
          <div
            className={`${styles.globalScrim} ${isDark ? styles.globalScrimDark : ''}`}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          />
        </div>
      )}

      {children}
    </SharedDyeContext.Provider>
  );
}

export function useSharedDye() {
  const ctx = useContext(SharedDyeContext);
  if (!ctx) {
    return {
      activeSection: 'default',
      setSection: () => {},
      profile: DYE_PROFILES.default,
    };
  }
  return ctx;
}
