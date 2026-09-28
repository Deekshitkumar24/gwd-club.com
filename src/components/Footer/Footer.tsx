'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  {
    title: 'GWD',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Team', href: '/team' },
      { label: 'Work', href: '/work' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
  {
    title: 'Participate',
    links: [
      { label: 'Events', href: '/events' },
      { label: 'Join', href: '/join' },
      { label: 'Collaborate', href: '/collaborations' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Updates', href: '/updates' },
      { label: 'Workflow', href: '/workflow' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <img src="/brand/gwd-logo.png" alt="GWD — Get Work Done" className={styles.logo} />
            <p className={styles.tagline}>
              A student collective that turns ideas into shipped work — tech, design, and everything between.
            </p>
            <div className={styles.socials}>
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="YouTube">YouTube</a>
            </div>
          </div>

          <div className={styles.linksGrid}>
            {FOOTER_LINKS.map((group) => (
              <div key={group.title} className={styles.linkGroup}>
                <h4 className={styles.linkGroupTitle}>{group.title}</h4>
                <div className={styles.linkGroupList}>
                  {group.links.map((link) => (
                    <Link key={link.href} href={link.href} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2026 GWD — Get Work Done</p>
          <p className={styles.credit}>Built with intention.</p>
        </div>
      </div>
    </footer>
  );
}
