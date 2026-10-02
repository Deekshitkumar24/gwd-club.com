'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useReveal } from '@/hooks/useAnimations';
import { useCms } from '@/context/CmsContext';
import { UPCOMING_EVENTS, PAST_EVENTS } from '@/data/content';
import Timeline, { JourneyItem, DEFAULT_TOP_JOURNEY, DEFAULT_BOTTOM_JOURNEY } from '@/components/ui/timeline';
import { BorderBeam } from '@/components/ui/border-beam';
import styles from './events.module.css';

export default function EventsPage() {
  const { store } = useCms();
  const headerReveal = useReveal();
  const [activeYear, setActiveYear] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  const upcomingEvents = store.upcomingEvents?.length ? store.upcomingEvents : UPCOMING_EVENTS;
  const pastEvents = store.pastEvents?.length ? store.pastEvents : PAST_EVENTS;

  // Derive storyline milestones from CMS store or fall back to default
  const storylineItems: JourneyItem[] = store.timeline?.length
    ? store.timeline.map((m, idx) => {
        const itemAny = m as unknown as Record<string, string | undefined>;
        return {
          id: `timeline-${idx}`,
          year: m.year,
          month: itemAny.month || 'March',
          headline: m.title,
          content: itemAny.story || m.description || '',
          image: m.image || '/img/vjit-inauguration.jpg',
          track: idx % 2 === 0 ? 'top' : 'bottom',
        };
      })
    : [...DEFAULT_TOP_JOURNEY, ...DEFAULT_BOTTOM_JOURNEY];

  const years = ['all', ...new Set(pastEvents.map(e => e.year).filter((y): y is string => Boolean(y)))];
  const categories = ['all', ...new Set(pastEvents.map(e => e.category))];

  const filteredPastEvents = pastEvents.filter(e => {
    if (activeYear !== 'all' && e.year !== activeYear) return false;
    if (activeCategory !== 'all' && e.category !== activeCategory) return false;
    return true;
  });

  return (
    <div className={styles.page} data-dye-section="events">
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerInner} ref={headerReveal.ref}>
          <div className={`reveal ${headerReveal.isVisible ? 'visible' : ''}`}>
            <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-md)' }}>Events</p>
            <h1 className={styles.headerTitle}>Experiences worth showing up for.</h1>
            <p className={styles.headerDesc}>From hackathons and summits to workshops and creative jams — every event is designed to inspire and challenge.</p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className={styles.upcoming}>
        <div className={styles.upcomingInner}>
          <h2 className={styles.sectionTitle}>Upcoming Events</h2>

          {upcomingEvents.length === 0 ? (
            <div className={styles.empty}>
              <p>Nothing scheduled yet. Check back soon.</p>
            </div>
          ) : (
            <div className={styles.upcomingGrid}>
              {upcomingEvents.map((event) => (
                <UpcomingEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events Horizontal Chronicle Timeline */}
      <section style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
        <div style={{ padding: 'var(--space-3xl) var(--space-xl) var(--space-md)', textAlign: 'center' }}>
          <span className="label" style={{ color: 'var(--brand-red)' }}>Chronicle Storyline</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '0.25rem' }}>
            Past Events Storyline
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0.5rem auto 0', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Scroll down to walk through our past summits, hackathons, and tournament launches as the horizontal track pins and slides across milestones.
          </p>
        </div>
        <Timeline
          title="Events Storyline"
          periodLabel="2024 — 2026"
          activeColor="var(--brand-red, #C41E1E)"
          backgroundColor="var(--color-bg, #ffffff)"
          textColor="var(--color-text-primary, #121212)"
          mutedTextColor="var(--color-text-secondary, #4A4A4A)"
          imageUrl="/img/vjit-inauguration.jpg"
          imageAlt="GWD Builder Chronicle & Milestones"
          duration={1.2}
          items={storylineItems}
        />
      </section>

      {/* Past Events */}
      <section className={styles.past}>
        <div className={styles.pastInner}>
          <h2 className={styles.sectionTitle}>Past Events Archive</h2>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Year</span>
              {years.map(year => (
                <button
                  key={year}
                  className={`${styles.filterBtn} ${activeYear === year ? styles.filterBtnActive : ''}`}
                  onClick={() => setActiveYear(year)}
                >
                  {year === 'all' ? 'All' : year}
                </button>
              ))}
            </div>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Type</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          {filteredPastEvents.length === 0 ? (
            <div className={styles.empty}>
              <p>No events match your filters.</p>
            </div>
          ) : (
            <div className={styles.pastGrid}>
              {filteredPastEvents.map((event) => (
                <PastEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function UpcomingEventCard({ event }: { event: typeof UPCOMING_EVENTS[0] }) {
  const { ref, isVisible } = useReveal();
  const isFeatured = event.featured;

  return (
    <div ref={ref} className={`${styles.upcomingCard} ${isFeatured ? styles.upcomingCardFeatured : ''} reveal ${isVisible ? 'visible' : ''}`}>
      <BorderBeam size={280} duration={12} colorFrom="#E11D48" colorTo="#3B82F6" borderWidth={1.5} />
      <div className={styles.upcomingCardImage}>
        <img src={event.image} alt={event.title} loading="lazy" />
        {isFeatured && <span className={styles.featuredBadge}>Featured</span>}
      </div>
      <div className={styles.upcomingCardBody}>
        <div className={styles.upcomingCardMeta}>
          <span className="badge">{event.category}</span>
          {event.registrationOpen && <span className="badge badge-success">Registration Open</span>}
        </div>
        <h3 className={styles.upcomingCardTitle}>{event.title}</h3>
        <p className={styles.upcomingCardDesc}>{event.shortDescription}</p>
        <div className={styles.upcomingCardDetails}>
          <span>📅 {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span>🕐 {event.time}</span>
          <span>📍 {event.location}</span>
        </div>
        <div className={styles.upcomingCardActions}>
          <Link href={`/events/${event.id}`} className="btn btn-primary">View Event</Link>
          {event.registrationOpen && (
            <Link href={`/events/${event.id}/register`} className="btn btn-secondary">Register</Link>
          )}
        </div>
      </div>
    </div>
  );
}

function PastEventCard({ event }: { event: typeof PAST_EVENTS[0] }) {
  const { ref, isVisible } = useReveal<HTMLAnchorElement>();

  return (
    <Link href={`/events/${event.id}`} ref={ref} className={`${styles.pastCard} reveal ${isVisible ? 'visible' : ''}`}>
      <BorderBeam size={220} duration={14} colorFrom="#E11D48" colorTo="#F59E0B" borderWidth={1.5} />
      <div className={styles.pastCardImage}>
        <img src={event.image} alt={event.title} loading="lazy" />
      </div>
      <div className={styles.pastCardBody}>
        <div className={styles.pastCardMeta}>
          <span className="badge">{event.category}</span>
          <span className="label">{event.year}</span>
        </div>
        <h3 className={styles.pastCardTitle}>{event.title}</h3>
        <p className={styles.pastCardDesc}>{event.shortDescription}</p>
        {event.highlights && (
          <div className={styles.pastCardHighlights}>
            {event.highlights.slice(0, 2).map((h, i) => (
              <span key={i} className={styles.pastCardHighlight}>✦ {h}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
