'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCms } from '@/context/CmsContext';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();
  const { store } = useCms();
  const settings = store.settings;
  const footerCms = store.homepage?.footer;

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className={styles.footer} role="contentinfo" aria-label="GWD Corporate and Community Footer">
      {/* Decorative Brand Accent Line */}
      <div className={styles.accentBorder} aria-hidden="true" />

      <div className={styles.inner}>
        {/* ── Top Corporate Ribbon ── */}
        <div className={styles.ribbon}>
          <div className={styles.brandGroup}>
            <Link href="/" className={styles.logoLink} aria-label="GWD Home">
              <img src="/brand/gwd-logo.png" alt="GWD — Get Work Done" className={styles.logo} />
            </Link>
            <div className={styles.brandTitleWrap}>
              <span className={styles.brandCompanyName}>{settings.companyName || 'GWD Global Pvt. Ltd.'}</span>
              <span className={styles.brandClubName}>& {settings.clubName || 'GWD Club'}</span>
            </div>
          </div>

          <div className={styles.verificationBadge}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.verificationText}>
              Govt. of India Registered · CIN: <code>{settings.cin || 'U63999TS2025PTC199800'}</code>
            </span>
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className={styles.grid}>
          {/* Column 1: Organization & Identity */}
          <div className={styles.colIdentity}>
            <p className={styles.tagline}>
              {footerCms?.tagline ||
                'A disciplined builder collective turning technical ambition into shipped production work — software, design, sports infrastructure, and enterprise platforms.'}
            </p>

            <div className={styles.metaBlock}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Headquarters</span>
                <span className={styles.metaValue}>{settings.hq || 'Madhapur, Hyderabad, Telangana — 500081'}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Campus Origin</span>
                <span className={styles.metaValue}>VJIT (Vidya Jyothi Institute of Technology), Hyderabad</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Milestones</span>
                <span className={styles.metaValue}>Inception: March 2024 · Inc: 12 June 2025</span>
              </div>
            </div>

            <div className={styles.contactBlock}>
              <a href={`mailto:${settings.email || 'contact@gwd-club.com'}`} className={styles.contactLink}>
                <span className={styles.contactIcon}>✉</span> {settings.email || 'contact@gwd-club.com'}
              </a>
              <a href={`tel:${settings.phone?.replace(/\s+/g, '') || '+919121299800'}`} className={styles.contactLink}>
                <span className={styles.contactIcon}>☎</span> {settings.phone || '+91 91212 99800'}
              </a>
            </div>

            <div className={styles.socials} aria-label="Official Social Channels">
              <a
                href={settings.instagram || 'https://www.instagram.com/gwdclub.vjit/'}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="Instagram"
              >
                Instagram ↗
              </a>
              <a
                href={settings.linkedin || 'https://linkedin.com/company/gwd-global'}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="LinkedIn"
              >
                LinkedIn ↗
              </a>
              <a
                href={settings.twitter || 'https://twitter.com/gwdclub'}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="Twitter / X"
              >
                Twitter / X ↗
              </a>
              <a
                href={settings.github || 'https://github.com/gwdclub'}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="GitHub"
              >
                GitHub ↗
              </a>
            </div>
          </div>

          {/* Column 2: Core Navigation */}
          <div className={styles.colNav}>
            <h4 className={styles.navHeading}>Navigation</h4>
            <ul className={styles.navList}>
              <li>
                <Link href="/work" className={styles.navLink}>
                  Work & Ventures
                </Link>
              </li>
              <li>
                <Link href="/events" className={styles.navLink}>
                  Events & Sprints
                </Link>
              </li>
              <li>
                <Link href="/team" className={styles.navLink}>
                  Leadership & Team
                </Link>
              </li>
              <li>
                <Link href="/about" className={styles.navLink}>
                  About GWD
                </Link>
              </li>
              <li>
                <Link href="/workflow" className={styles.navLink}>
                  Our Workflow
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Explore Domains */}
          <div className={styles.colNav}>
            <h4 className={styles.navHeading}>Explore Domains</h4>
            <ul className={styles.navList}>
              <li>
                <Link href="/explore" className={styles.navLink}>
                  <span className={styles.domainDot} /> Technical Division
                </Link>
              </li>
              <li>
                <Link href="/explore" className={styles.navLink}>
                  <span className={styles.domainDot} /> Creative & Design
                </Link>
              </li>
              <li>
                <Link href="/explore" className={styles.navLink}>
                  <span className={styles.domainDot} /> Visual Media & Recaps
                </Link>
              </li>
              <li>
                <Link href="/explore" className={styles.navLink}>
                  <span className={styles.domainDot} /> Operations & Strategy
                </Link>
              </li>
              <li>
                <Link href="/explore" className={styles.navLink}>
                  <span className={styles.domainDot} /> Growth & Marketing
                </Link>
              </li>
              <li>
                <Link href="/explore" className={styles.navLink}>
                  <span className={styles.domainDot} /> Sports Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Ecosystem & Operations */}
          <div className={styles.colNav}>
            <h4 className={styles.navHeading}>Ecosystem</h4>
            <ul className={styles.navList}>
              <li>
                <Link href="/join" className={`${styles.navLink} ${styles.navLinkHighlight}`}>
                  Join GWD Collective →
                </Link>
              </li>
              <li>
                <Link href="/connect" className={`${styles.navLink} ${styles.navLinkHighlight}`}>
                  Connect & Partnerships ↗
                </Link>
              </li>
              <li>
                <Link href="/collaborations" className={styles.navLink}>
                  Collaborations & Partners
                </Link>
              </li>
              <li>
                <Link href="/gallery" className={styles.navLink}>
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.navLink}>
                  Contact Operations Desk
                </Link>
              </li>
              <li>
                <Link href="/admin" className={styles.adminPortalLink}>
                  <span className={styles.adminKeyIcon}>✦</span> Operations CMS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Legal & Compliance Bar ── */}
        <div className={styles.bottomBar}>
          <div className={styles.copyrightBlock}>
            <p className={styles.copyrightText}>
              © {new Date().getFullYear()} {settings.companyName || 'GWD Global Pvt. Ltd.'} All rights reserved.
            </p>
            <p className={styles.taxIdText}>
              CIN: <code>{settings.cin || 'U63999TS2025PTC199800'}</code> · GSTIN: <code>{settings.gstin || '36AAMCG1250H1ZP'}</code>
            </p>
          </div>

          <div className={styles.bottomLegalLinks}>
            <Link href="/privacy" className={styles.legalLink}>
              Privacy Policy
            </Link>
            <span className={styles.legalDivider} aria-hidden="true">·</span>
            <Link href="/contact" className={styles.legalLink}>
              Contact
            </Link>
            <span className={styles.legalDivider} aria-hidden="true">·</span>
            <Link href="/about" className={styles.legalLink}>
              Entity Verification
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
