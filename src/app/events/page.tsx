'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useReveal } from '@/hooks/useAnimations';
import { UPCOMING_EVENTS, PAST_EVENTS } from '@/data/content';
import styles from './events.module.css';

export default function EventsPage() {
  const headerReveal = useReveal();
  const [activeYear, setActiveYear] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  const years = ['all', ...new Set(PAST_EVENTS.map(e => e.year))];
  const categories = ['all', ...new Set(PAST_EVENTS.map(e => e.category))];

  const filteredPastEvents = PAST_EVENTS.filter(e => {
    if (activeYear !== 'all' && e.year !== activeYear) return false;
    if (activeCategory !== 'all' && e.category !== activeCategory) return false;
    return true;
  });

  return (
    <div className={styles.page}>
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

          {UPCOMING_EVENTS.length === 0 ? (
            <div className={styles.empty}>
              <p>Nothing scheduled yet. Check back soon.</p>
            </div>
          ) : (
            <div className={styles.upcomingGrid}>
              {UPCOMING_EVENTS.map((event) => (
                <UpcomingEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className={styles.past}>
        <div className={styles.pastInner}>
          <h2 className={styles.sectionTitle}>Past Events</h2>

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
