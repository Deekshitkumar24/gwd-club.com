'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCms } from '@/context/CmsContext';
import { UPCOMING_EVENTS, PAST_EVENTS } from '@/data/content';
import { getEventRegistrationState } from '@/lib/cms';
import styles from './eventDetail.module.css';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { store } = useCms();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const upcomingList = (store.upcomingEvents ?? []).filter((e) => e.status !== 'Draft' && e.status !== 'Archived');
  const pastList = (store.pastEvents ?? []).filter((e) => e.status !== 'Draft' && e.status !== 'Archived');
  const allEvents = [...upcomingList, ...pastList];
  const event = allEvents.find((e) => e.id === id);
  if (!event) return notFound();

  const isUpcoming = upcomingList.some((e) => e.id === id);
  const upcomingEvent = isUpcoming ? upcomingList.find((e) => e.id === id) : null;
  const pastEvent = !isUpcoming ? pastList.find((e) => e.id === id) : null;

  // Authoritative registration state check
  const eventRegistrations = (store.registrations || []).filter(r => r.eventId === id);
  const regState = getEventRegistrationState(event, eventRegistrations.length);
  const isRegistrationAvailable = Boolean(isUpcoming && regState === 'Registration Open');

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img src={event.image} alt={event.title} />
          <div className={styles.heroBgOverlay} />
        </div>
        <div className={styles.heroContent}>
          <Link href="/events" className={styles.backLink}>← All Events</Link>
          <div className={styles.heroMeta}>
            <span className="badge">{event.category}</span>
            {isUpcoming && regState === 'Registration Open' && <span className="badge badge-success">Registration Open</span>}
            {isUpcoming && regState === 'Registration Full' && <span className="badge badge-warning">Registration Full</span>}
            {isUpcoming && regState === 'Registration Closed' && <span className="badge badge-danger">Registration Closed</span>}
            {isUpcoming && regState === 'Registration Not Open' && <span className="badge">Registration Not Open</span>}
          </div>
          <h1 className={styles.heroTitle}>{event.title}</h1>
          <div className={styles.heroDetails}>
            <span>📅 {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>🕐 {event.time}</span>
            <span>📍 {event.location}</span>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>
          <div className={styles.contentGrid}>
            <div className={styles.main}>
              <h2 className={styles.heading}>About This Event</h2>
              <p className={styles.body}>{event.description}</p>

              {/* Speakers */}
              {upcomingEvent?.speakers && upcomingEvent.speakers.length > 0 && (
                <div className={styles.block}>
                  <h3 className={styles.subHeading}>Speakers</h3>
                  <div className={styles.speakerGrid}>
                    {upcomingEvent.speakers.map((speaker, i) => (
                      <div key={i} className={styles.speakerCard}>
                        <h4 className={styles.speakerName}>{speaker.name}</h4>
                        <p className={styles.speakerRole}>{speaker.role}</p>
                        <p className={styles.speakerTopic}>{speaker.topic}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule */}
              {upcomingEvent?.schedule && upcomingEvent.schedule.length > 0 && (
                <div className={styles.block}>
                  <h3 className={styles.subHeading}>Schedule</h3>
                  <div className={styles.schedule}>
                    {upcomingEvent.schedule.map((item, i) => (
                      <div key={i} className={styles.scheduleItem}>
                        <span className={styles.scheduleTime}>{item.time}</span>
                        <div>
                          <h4 className={styles.scheduleTitle}>{item.title}</h4>
                          <p className={styles.scheduleDesc}>{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results (past) */}
              {pastEvent?.results && (
                <div className={styles.block}>
                  <h3 className={styles.subHeading}>Results</h3>
                  <p className={styles.body}>{pastEvent.results}</p>
                </div>
              )}

              {/* Highlights (past) */}
              {pastEvent?.highlights && (
                <div className={styles.block}>
                  <h3 className={styles.subHeading}>Highlights</h3>
                  <div className={styles.highlights}>
                    {pastEvent.highlights.map((h, i) => (
                      <span key={i} className={styles.highlight}>✦ {h}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery (past) */}
              {pastEvent?.gallery && pastEvent.gallery.length > 0 && (
                <div className={styles.block}>
                  <h3 className={styles.subHeading}>Gallery</h3>
                  <div className={styles.gallery}>
                    {pastEvent.gallery.map((img, i) => (
                      <div key={i} className={styles.galleryImg}>
                        <img src={img} alt={`${event.title} gallery ${i + 1}`} loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              {(event.faq?.length ? event.faq : upcomingEvent?.faq)?.length ? (
                <div className={styles.block}>
                  <h3 className={styles.subHeading}>Frequently Asked Questions</h3>
                  <div className={styles.faqList}>
                    {(event.faq?.length ? event.faq : upcomingEvent?.faq || []).map((item, i) => (
                      <div key={i} className={styles.faqItem}>
                        <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                          {item.question}
                          <span className={`${styles.faqIcon} ${openFaq === i ? styles.faqIconOpen : ''}`}>+</span>
                        </button>
                        <div className={`${styles.faqAnswer} ${openFaq === i ? styles.faqAnswerOpen : ''}`}>
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className={styles.sidebar}>
              {isUpcoming && regState === 'Registration Open' && (
                <Link href={`/events/${event.id}/register`} className="btn btn-primary btn-lg" style={{ width: '100%', textAlign: 'center' }}>
                  Register for Event →
                </Link>
              )}
              {isUpcoming && regState === 'Registration Full' && (
                <div style={{ padding: '1rem', background: 'rgba(217, 119, 6, 0.1)', border: '1px solid #d97706', borderRadius: '8px', textAlign: 'center', marginBottom: '1.25rem' }}>
                  <p style={{ color: '#d97706', fontWeight: 700, margin: 0 }}>Registration Full</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>Capacity limit of {event.capacity} attendees reached.</p>
                </div>
              )}
              {isUpcoming && regState === 'Registration Closed' && (
                <div style={{ padding: '1rem', background: 'rgba(196, 30, 30, 0.08)', border: '1px solid var(--brand-red)', borderRadius: '8px', textAlign: 'center', marginBottom: '1.25rem' }}>
                  <p style={{ color: 'var(--brand-red)', fontWeight: 700, margin: 0 }}>Registration Closed</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>This event is not accepting registrations at this time.</p>
                </div>
              )}
              {isUpcoming && regState === 'Registration Not Open' && (
                <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center', marginBottom: '1.25rem' }}>
                  <p style={{ fontWeight: 700, margin: 0 }}>Registration Not Open</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>Registration has not yet opened for this event.</p>
                </div>
              )}
              {upcomingEvent?.eligibility && (
                <div className={styles.sidebarBlock}>
                  <h4 className={styles.sidebarLabel}>Eligibility</h4>
                  <p className={styles.sidebarValue}>{upcomingEvent.eligibility}</p>
                </div>
              )}
              {upcomingEvent?.instructions && upcomingEvent.instructions.length > 0 && (
                <div className={styles.sidebarBlock}>
                  <h4 className={styles.sidebarLabel}>Important</h4>
                  <ul className={styles.instructionsList}>
                    {upcomingEvent.instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>
                </div>
              )}
              {upcomingEvent?.collaborators && upcomingEvent.collaborators.length > 0 && (
                <div className={styles.sidebarBlock}>
                  <h4 className={styles.sidebarLabel}>Partners</h4>
                  {upcomingEvent.collaborators.map((c, i) => (
                    <p key={i} className={styles.sidebarValue}>{c}</p>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
