'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScrollProgress } from '@/hooks/useAnimations';
import styles from './Navigation.module.css';

const PUBLIC_NAV_LINKS = [
  { label: 'Work', href: '/work', number: '01' },
  { label: 'Events', href: '/events', number: '02' },
  { label: 'Team', href: '/team', number: '03' },
  { label: 'About', href: '/about', number: '04' },
  { label: 'Explore', href: '/explore', number: '05' },
  { label: 'Gallery', href: '/gallery', number: '06' },
  { label: 'Connect', href: '/connect', number: '07' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeroRevealed, setIsHeroRevealed] = useState(true);
  const progress = useScrollProgress();

  useEffect(() => {
    // Determine whether navbar should be initially hidden for the hero video
    if (pathname === '/') {
      const alreadySeen = typeof window !== 'undefined' && sessionStorage.getItem('gwd_hero_intro_seen') === 'true';
      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!alreadySeen && !prefersReducedMotion) {
        setIsHeroRevealed(false);
      } else {
        setIsHeroRevealed(true);
      }

      const handleHeroRevealed = () => {
        setIsHeroRevealed(true);
      };

      window.addEventListener('gwd:hero-revealed', handleHeroRevealed);
      return () => window.removeEventListener('gwd:hero-revealed', handleHeroRevealed);
    } else {
      setIsHeroRevealed(true);
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navVisibilityClass = isHeroRevealed ? styles.navVisible : styles.navHidden;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div
        className={styles.progressBar}
        style={{ width: `${progress * 100}%` }}
        aria-hidden="true"
      />

      <nav
        className={`${styles.nav} ${navVisibilityClass} ${isScrolled ? styles.scrolled : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={styles.inner}>
          <Link href="/" className={styles.logo} aria-label="GWD home">
            <span className={styles.logoChip}>
              <img
                src="/brand/gwd-logo.png"
                alt="GWD Logo"
                className={styles.logoImage}
              />
            </span>
          </Link>

          <div className={styles.links}>
            {PUBLIC_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className={styles.actions}>
            <Link href="/join" className={styles.joinBtn}>
              Join GWD
            </Link>

            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={`${styles.menuIcon} ${menuOpen ? styles.menuIconOpen : ''}`}>
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className={styles.overlayContent}>
          <div className={styles.overlayLinks}>
            {PUBLIC_NAV_LINKS.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.overlayLink} ${isActive ? styles.overlayLinkActive : ''}`}
                  onClick={() => setMenuOpen(false)}
                  style={{ transitionDelay: menuOpen ? `${i * 35 + 60}ms` : '0ms' }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={styles.overlayLinkNumber}>{link.number}</span>
                  <span className={styles.overlayLinkText}>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className={styles.overlayJoinContainer}>
            <Link
              href="/join"
              className={styles.overlayJoinBtn}
              onClick={() => setMenuOpen(false)}
            >
              Join GWD →
            </Link>
          </div>

          <div className={styles.overlayFooter}>
            <p>contact@gwd-club.com</p>
            <div className={styles.overlayFooterLinks}>
              <a href="https://www.instagram.com/gwdclub.vjit/" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://linkedin.com/company/gwd-global" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <Link href="/admin">CMS Portal</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
