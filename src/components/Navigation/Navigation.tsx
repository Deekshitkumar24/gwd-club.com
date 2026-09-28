'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useScrollProgress } from '@/hooks/useAnimations';
import styles from './Navigation.module.css';

const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Events', href: '/events' },
  { label: 'Team', href: '/team' },
  { label: 'About', href: '/about' },
  { label: 'Join', href: '/join' },
];

const MENU_LINKS = [
  { label: 'Work', href: '/work', number: '01' },
  { label: 'Events', href: '/events', number: '02' },
  { label: 'Team', href: '/team', number: '03' },
  { label: 'About', href: '/about', number: '04' },
  { label: 'Gallery', href: '/gallery', number: '05' },
  { label: 'Collaborations', href: '/collaborations', number: '06' },
  { label: 'Join', href: '/join', number: '07' },
  { label: 'Contact', href: '/contact', number: '08' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useScrollProgress();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <div className={styles.progressBar} style={{ width: `${progress * 100}%` }} />
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`} role="navigation" aria-label="Main navigation">
        <div className={styles.inner}>
          <Link href="/" className={styles.logo} aria-label="GWD home">
            <img src="/brand/gwd-logo.png" alt="GWD" className={styles.logoImage} />
          </Link>

          <div className={styles.links}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.link}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className={styles.actions}>
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

      {/* Full-Screen Menu */}
      <div className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`} role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className={styles.overlayContent}>
          <div className={styles.overlayLinks}>
            {MENU_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.overlayLink}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: menuOpen ? `${i * 50 + 100}ms` : '0ms' }}
              >
                <span className={styles.overlayLinkNumber}>{link.number}</span>
                <span className={styles.overlayLinkText}>{link.label}</span>
              </Link>
            ))}
          </div>
          <div className={styles.overlayFooter}>
            <p>hello@gwd.club</p>
            <div className={styles.overlayFooterLinks}>
              <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
