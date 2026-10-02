'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useReveal, useCountUp } from '@/hooks/useAnimations';
import { useCms } from '@/context/CmsContext';
import { CLUB, STATS, TIMELINE, THREE_ARMS, VENTURES } from '@/data/content';
import { DyeAtmosphereTransition, DyeCtaBackdrop } from '@/components/DyeVisual';
import GlobalPresence from '@/components/GlobalPresence/GlobalPresence';
import { BorderBeam } from '@/components/ui/border-beam';
import styles from './about.module.css';

function StatItem({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const { ref, isVisible } = useReveal(0.3);
  const { count, start } = useCountUp(value, 1800);
  useEffect(() => {
    if (isVisible) start();
  }, [isVisible, start]);

  return (
    <div ref={ref} className={styles.statItem}>
      <div className={styles.statValue}>{count}{suffix}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function AboutPage() {
  const { store } = useCms();
  const headerReveal = useReveal();
  const whatIsReveal = useReveal();
  const whyExistsReveal = useReveal();
  const missionReveal = useReveal();
  const statsReveal = useReveal();
  const timelineReveal = useReveal();

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Group timeline chapters from store or default
  const chapters = store.timeline?.length ? store.timeline : TIMELINE;
  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  const handleNextChapter = () => {
    setActiveChapterIndex((prev) => (prev + 1 < chapters.length ? prev + 1 : 0));
  };

  const handlePrevChapter = () => {
    setActiveChapterIndex((prev) => (prev - 1 >= 0 ? prev - 1 : chapters.length - 1));
  };

  return (
    <div className={styles.page} data-dye-section="about">
      {/* ═══════════════════════════════════════════════════════════════
          01 — INTRODUCTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.header}>
        <div className={styles.headerInner} ref={headerReveal.ref}>
          <div className={`reveal ${headerReveal.isVisible ? 'visible' : ''}`}>
            <p className="label" style={{ color: 'var(--brand-red)', marginBottom: 'var(--space-md)' }}>
              About GWD
            </p>
            <h1 className={styles.headerTitle}>Turning raw ambition into shipped work.</h1>
            <p className={styles.headerDesc}>{CLUB.longDescription}</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          02 — ONE COMPANY. THREE ARMS. (Slide 2)
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.threeArmsSection} ref={whatIsReveal.ref}>
        <div className={`container reveal ${whatIsReveal.isVisible ? 'visible' : ''}`}>
          <div className={styles.sectionHeader}>
            <span className="label" style={{ color: 'var(--brand-red)' }}>• The Company</span>
            <h2 className={styles.sectionTitle}>{CLUB.companyHeadline}</h2>
            <p className={styles.sectionSubtitle}>
              {CLUB.companySubheadline}
            </p>
          </div>

          <div className={styles.threeArmsGrid}>
            {THREE_ARMS.map((arm) => (
              <div
                key={arm.id}
                className={`${styles.armCard} ${arm.highlighted ? styles.armCardHighlighted : ''}`}
              >
                <BorderBeam size={240} duration={14} colorFrom={arm.highlighted ? '#FF5252' : '#E11D48'} colorTo={arm.highlighted ? '#FF8A65' : '#8B5CF6'} borderWidth={1.5} />
                <div>
                  <h3 className={styles.armTitle}>{arm.name}</h3>
                  <span className={styles.armSubtitle}>{arm.subtitle}</span>
                  <p className={styles.armDesc}>{arm.description}</p>
                </div>

                <div className={styles.armFooter}>
                  {arm.metrics && (
                    <div className={styles.armMetricsRow}>
                      {arm.metrics.map((m) => (
                        <div key={m.label} className={styles.armMetricItem}>
                          <span className={styles.armMetricVal}>{m.value}</span>
                          <span className={styles.armMetricLab}>{m.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {arm.badge && (
                    <div className={styles.armBadgeLive}>
                      {arm.badge.statusDot && <span className={styles.statusDotGreen} />}
                      <span>{arm.badge.text}</span>
                    </div>
                  )}

                  {arm.tag && (
                    <div className={styles.armHighlightedTag}>
                      <span>{arm.tag}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          03 — IT STARTED AS A STUDENT IDEA (Slide 1)
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.studentIdeaSection} ref={timelineReveal.ref}>
        <div className={`container reveal ${timelineReveal.isVisible ? 'visible' : ''}`}>
          <span className="label" style={{ color: 'var(--brand-red)', display: 'block', marginBottom: '8px' }}>
            • The Company
          </span>
          <h2 className={styles.studentIdeaHeadline}>{CLUB.studentIdeaHeadline}</h2>
          <p className={styles.studentIdeaStory}>{CLUB.studentIdeaStory}</p>

          <div className={styles.milestonesTrack}>
            {TIMELINE.map((m) => (
              <div
                key={m.date}
                className={`${styles.milestoneCard} ${m.highlighted ? styles.milestoneCardActive : ''}`}
              >
                {m.highlighted && <BorderBeam size={180} duration={10} colorFrom="#E11D48" colorTo="#F59E0B" borderWidth={1.5} />}
                <div className={styles.milestoneDate}>{m.date}</div>
                <h3 className={styles.milestoneTitle}>{m.title}</h3>
                <p className={styles.milestoneDesc}>{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          04 — WE DIDN'T BUILD ANOTHER COLLEGE CLUB (Slide 3)
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.collegeClubSection} ref={whyExistsReveal.ref}>
        <div className={`container reveal ${whyExistsReveal.isVisible ? 'visible' : ''}`}>
          <div className={styles.collegeClubSplit}>
            <div className={styles.collegeClubTextCol}>
              <span className="label" style={{ color: 'var(--brand-red)', display: 'block', marginBottom: 'var(--space-md)' }}>
                • The Club
              </span>
              <h2 className={styles.collegeClubHeadline}>{CLUB.notAnotherClubHeadline}</h2>
              <div className={styles.collegeClubStory}>
                <p style={{ marginBottom: '1.25rem' }}>
                  Most students graduate without ever working on something real. That&apos;s the exact gap GWD was started to close in 2024, and the club brings it to every student on campus.
                </p>
                <p>
                  GWD Club runs like a company because a real company stands behind it: departments, deadlines, live work, and accountability.
                </p>
              </div>

              <div className={styles.vjitCalloutBox}>
                <div className={styles.vjitLogoPill}>VJIT CAMPUS</div>
                <p className={styles.vjitCalloutText}>
                  Launched at VJIT in 2025 as <strong>the biggest club inauguration in the college&apos;s 25-year history</strong>, with Meraj Faheem (CEO, Telangana Innovation Cell) and Sadiya Sabira (CEO, Code for India) as chief guests.
                </p>
              </div>
            </div>

            <div className={styles.collegeClubVisualCol}>
              <div className={styles.collegeClubFrame}>
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"
                  alt="GWD Club at VJIT Inauguration"
                  className={styles.collegeClubPhoto}
                />
                <div className={styles.collegeClubCaption}>
                  <span>GWD CLUB AT VJIT</span>
                  <span>Where it started, and where the model was proven</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          04 — MISSION & 05 — VISION
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.missionSection} ref={missionReveal.ref}>
        <div className={`${styles.missionInner} reveal ${missionReveal.isVisible ? 'visible' : ''}`}>
          <div className={styles.missionGrid}>
            <div className={styles.missionBlock}>
              <BorderBeam size={220} duration={14} colorFrom="#E11D48" colorTo="#8B5CF6" borderWidth={1.5} />
              <span className="label" style={{ color: 'var(--brand-red)', marginBottom: '8px', display: 'block' }}>Mandate</span>
              <h2 className={styles.missionTitle}>Our Mission</h2>
              <p className={styles.missionBody}>{CLUB.mission}</p>
            </div>
            <div className={styles.missionBlock}>
              <BorderBeam size={220} duration={14} colorFrom="#FF5252" colorTo="#FF8A65" borderWidth={1.5} />
              <span className="label" style={{ color: 'var(--brand-red)', marginBottom: '8px', display: 'block' }}>Horizon</span>
              <h2 className={styles.missionTitle}>Our Vision</h2>
              <p className={styles.missionBody}>{CLUB.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          06 — ACHIEVEMENTS & VERIFIED METRICS
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.stats} ref={statsReveal.ref}>
        <div className={styles.statsInner}>
          {STATS.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* ── Atmospheric Transition into Chronology ── */}
      <DyeAtmosphereTransition
        chapter="05 · CHRONOLOGICAL MILESTONES"
        title="The Spiral Timeline — Growth & Milestones"
        speed={0.7}
        density={0.8}
        stir={0.9}
      />

      {/* ═══════════════════════════════════════════════════════════════
          07 — SPIRAL TIMELINE (Interactive Storytelling Component)
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.spiralSection} ref={timelineReveal.ref}>
        <div className={`${styles.spiralInner} reveal ${timelineReveal.isVisible ? 'visible' : ''}`}>
          <div className={styles.sectionHeader}>
            <span className="label" style={{ color: 'var(--brand-red)' }}>Chronological Journey</span>
            <h2 className={styles.sectionTitle}>The Spiral Timeline</h2>
            <p className={styles.sectionSubtitle}>
              Explore the key milestones in GWD&apos;s growth — from the initial student collective launch to global enterprise expansion.
            </p>
          </div>

          <div className={styles.spiralContainer}>
            {/* Spiral Ribbon Navigation */}
            <div className={styles.spiralRibbon}>
              <div className={styles.ribbonTrack}>
                {chapters.map((ch, idx) => {
                  const isActive = idx === activeChapterIndex;
                  const distance = Math.abs(idx - activeChapterIndex);
                  const scale = isActive ? 1.15 : Math.max(0.85, 1 - distance * 0.1);
                  const opacity = isActive ? 1 : Math.max(0.4, 1 - distance * 0.25);

                  return (
                    <button
                      key={ch.year + ch.title}
                      onClick={() => setActiveChapterIndex(idx)}
                      className={`${styles.ribbonNode} ${isActive ? styles.ribbonNodeActive : ''}`}
                      style={{
                        transform: `scale(${scale})`,
                        opacity,
                      }}
                      aria-label={`View milestone ${ch.year}: ${ch.title}`}
                    >
                      <span className={styles.ribbonYear}>{ch.year}</span>
                      <span className={styles.ribbonDot} />
                      <span className={styles.ribbonTitleShort}>{ch.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Chapter Card */}
            <div className={styles.chapterStage}>
              <div className={styles.chapterVisual}>
                <img
                  src={currentChapter.image}
                  alt={currentChapter.title}
                  className={styles.chapterImg}
                  key={currentChapter.image}
                />
                <div className={styles.chapterOverlay}>
                  <span className={styles.chapterYearBadge}>{currentChapter.year}</span>
                </div>
              </div>

              <div className={styles.chapterContent}>
                <div className={styles.chapterControls}>
                  <button
                    onClick={handlePrevChapter}
                    className={styles.ctrlBtn}
                    aria-label="Previous milestone"
                  >
                    ← Previous
                  </button>
                  <span className={styles.chapterCounter}>
                    Milestone {activeChapterIndex + 1} of {chapters.length}
                  </span>
                  <button
                    onClick={handleNextChapter}
                    className={styles.ctrlBtn}
                    aria-label="Next milestone"
                  >
                    Next →
                  </button>
                </div>

                <span className={styles.chapterCategoryLabel}>Milestone Focus</span>
                <h3 className={styles.chapterTitle}>{currentChapter.title}</h3>
                <p className={styles.chapterDesc}>{currentChapter.description}</p>

                {currentChapter.achievement && (
                  <div className={styles.chapterAchievement}>
                    <span className={styles.achievementIcon}>✦</span>
                    <span>{currentChapter.achievement}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          07.5 — GLOBAL PRESENCE (Slide 9: Built in Hyderabad. Working across 10 countries.)
          ═══════════════════════════════════════════════════════════════ */}
      <GlobalPresence />

      {/* ═══════════════════════════════════════════════════════════════
          08 — CLOSING CTA
          ═══════════════════════════════════════════════════════════════ */}
      <section className={styles.ctaSection}>
        <DyeCtaBackdrop
          tag="GET INVOLVED"
          title={
            <>
              Ready to build with GWD?
              <br />
              <span style={{ color: 'var(--brand-red)' }}>Ship real work today.</span>
            </>
          }
          subtitle="Join as an ambitious student builder, or partner with our engineering teams on your next enterprise product."
          primaryCtaText="Join GWD"
          primaryCtaHref="/join"
          secondaryCtaText="Collaborate With Us"
          secondaryCtaHref="/collaborations"
        />
      </section>
    </div>
  );
}
