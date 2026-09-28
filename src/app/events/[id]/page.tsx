'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { UPCOMING_EVENTS, PAST_EVENTS } from '@/data/content';
import styles from './eventDetail.module.css';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const event = [...UPCOMING_EVENTS, ...PAST_EVENTS].find((e) => e.id === id);
  if (!event) return notFound();

  const isUpcoming = UPCOMING_EVENTS.some(e => e.id === id);
  const upcomingEvent = isUpcoming ? UPCOMING_EVENTS.find(e => e.id === id) : null;
  const pastEvent = !isUpcoming ? PAST_EVENTS.find(e => e.id === id) : null;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            {isUpcoming && upcomingEvent?.registrationOpen && <span className="badge badge-success">Registration Open</span>}
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
              {upcomingEvent?.faq && upcomingEvent.faq.length > 0 && (
                <div className={styles.block}>
                  <h3 className={styles.subHeading}>FAQ</h3>
                  <div className={styles.faqList}>
                    {upcomingEvent.faq.map((item, i) => (
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
              )}
            </div>

            <aside className={styles.sidebar}>
              {isUpcoming && upcomingEvent?.registrationOpen && (
                <Link href={`/events/${event.id}/register`} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  Register Now
                </Link>
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
