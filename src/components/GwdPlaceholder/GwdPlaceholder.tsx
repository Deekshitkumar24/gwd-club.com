'use client';

import styles from './GwdPlaceholder.module.css';

interface GwdPlaceholderProps {
  name: string;
  role: string;
  className?: string;
}

export default function GwdPlaceholder({ name, role, className = '' }: GwdPlaceholderProps) {
  // Extract initials
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div className={`${styles.placeholderWrap} ${className}`} aria-label={`${name} — ${role}`}>
      <div className={styles.glow} />
      <div className={styles.gridPattern} />
      <div className={styles.centerBadge}>
        <div className={styles.monogramRing}>
          <span className={styles.initials}>{initials || 'GWD'}</span>
        </div>
        <span className={styles.brandLabel}>GWD · LEADER</span>
      </div>
      <div className={styles.watermark}>{role}</div>
    </div>
  );
}
