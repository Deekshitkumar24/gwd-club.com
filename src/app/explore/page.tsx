'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCms } from '@/context/CmsContext';
import { DomainItem, DomainMember } from '@/lib/cms';
import { BorderBeam } from '@/components/ui/border-beam';
import styles from './explore.module.css';

export default function ExplorePage() {
  const { store } = useCms();
  const domains = store.domains;

  const [activeDomainId, setActiveDomainId] = useState<string>(domains[0]?.id || 'technical');
  const [selectedMember, setSelectedMember] = useState<DomainMember | null>(null);

  const activeDomain = useMemo(() => {
    return domains.find((d) => d.id === activeDomainId) || domains[0];
  }, [domains, activeDomainId]);

  return (
    <div className={styles.explorePage} data-dye-section="explore">
      {/* ── Top Header ── */}
      <header className={styles.heroHeader}>
        <div className={styles.eyebrow}>05 · Organizational Architecture</div>
        <h1 className={styles.mainTitle}>Explore GWD Domains</h1>
        <p className={styles.mainSub}>
          Six specialized divisions. Zero silos. Discover how student builders, designers, and organizers execute across real client platforms, digital infrastructure, and national showcases.
        </p>
      </header>

      {/* ── Domain Selector Navigation Grid ── */}
      <div className={styles.domainNavContainer}>
        <div className={styles.domainNavGrid} role="tablist" aria-label="GWD Organizational Domains">
          {domains.map((domain) => {
            const isActive = domain.id === activeDomainId;
            return (
              <button
                key={domain.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.domainTabBtn} ${isActive ? styles.domainTabBtnActive : ''}`}
                onClick={() => setActiveDomainId(domain.id)}
              >
                <span className={styles.domainTabCode}>{domain.code}</span>
                <span className={styles.domainTabName}>{domain.name}</span>
                <span className={styles.domainTabLead}>Lead: {domain.leadName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Domain Experience Stage ── */}
      {activeDomain && (
        <section className={styles.activeDomainStage} aria-label={`${activeDomain.name} Domain Overview`}>
          <div className={styles.domainHeaderCard}>
            <BorderBeam size={300} duration={16} colorFrom="#E11D48" colorTo="#8B5CF6" borderWidth={1.5} />
            <div className={styles.domainInfoCol}>
              <span className="label" style={{ color: activeDomain.color || 'var(--brand-red)' }}>
                {activeDomain.code} · Domain Focus
              </span>
              <h2>{activeDomain.name}</h2>
              <p className={styles.domainFullDesc}>{activeDomain.fullDesc}</p>

              <div className={styles.domainDeliverablesWrap}>
                <span className={styles.deliverableLabel}>Core Deliverables:</span>
                <div className={styles.deliverablesList}>
                  {activeDomain.deliverables.map((item, idx) => (
                    <span key={idx} className={styles.deliverableBadge}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Domain Lead Highlight */}
            <div className={styles.leadCard}>
              <BorderBeam size={200} duration={12} colorFrom="#FF5252" colorTo="#FF8A65" borderWidth={1.5} />
              <div className={styles.leadCardHeader}>
                <img
                  src={activeDomain.leadPhoto || '/team/president.jpg'}
                  alt={activeDomain.leadName}
                  className={styles.leadAvatar}
                />
                <div className={styles.leadMeta}>
                  <span className={styles.leadRoleTag}>{activeDomain.leadRole}</span>
                  <h3 className={styles.leadName}>{activeDomain.leadName}</h3>
                </div>
              </div>
              <p className={styles.leadBio}>{activeDomain.leadBio}</p>
              {activeDomain.leadQuote && (
                <blockquote className={styles.leadQuote}>
                  &ldquo;{activeDomain.leadQuote}&rdquo;
                </blockquote>
              )}
            </div>
          </div>

          {/* ── Team Members (Progressive Disclosure) ── */}
          <div className={styles.membersSection}>
            <div className={styles.membersHeaderRow}>
              <h3 className={styles.membersTitle}>{activeDomain.name} Team Members</h3>
              <span className={styles.memberCountTag}>
                {activeDomain.members.length} verified builders
              </span>
            </div>

            <div className={styles.membersGrid}>
              {activeDomain.members.map((member) => (
                <div
                  key={member.id}
                  className={styles.memberCard}
                  onClick={() => setSelectedMember(member)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedMember(member);
                    }
                  }}
                  aria-label={`View profile for ${member.name}`}
                >
                  <BorderBeam size={160} duration={10} colorFrom="#E11D48" colorTo="#F59E0B" borderWidth={1} />
                  <div className={styles.memberCardTop}>
                    <img
                      src={member.photo || '/team/president.jpg'}
                      alt={member.name}
                      className={styles.memberPhoto}
                    />
                    <div>
                      <h4 className={styles.memberName}>{member.name}</h4>
                      <p className={styles.memberRole}>{member.role}</p>
                    </div>
                  </div>

                  <p className={styles.memberShortBio}>{member.bio}</p>

                  <div className={styles.memberExpandHint}>
                    <span>View profile & deliverables</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Member Profile Drawer (Modal / Progressive Disclosure) ── */}
      {selectedMember && (
        <div
          className={styles.profileDrawerBackdrop}
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedMember.name} Profile`}
        >
          <div className={styles.profileDrawerContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.drawerCloseBtn}
              onClick={() => setSelectedMember(null)}
              aria-label="Close profile drawer"
            >
              ✕
            </button>

            <div className={styles.drawerPhotoWrap}>
              <img
                src={selectedMember.photo || '/team/president.jpg'}
                alt={selectedMember.name}
                className={styles.drawerPhoto}
              />
              <div>
                <h3 className={styles.drawerName}>{selectedMember.name}</h3>
                <p className={styles.drawerRole}>{selectedMember.role}</p>
              </div>
            </div>

            <p className={styles.drawerBio}>{selectedMember.bio}</p>

            {selectedMember.skills && selectedMember.skills.length > 0 && (
              <>
                <div className={styles.drawerSectionTitle}>Skills & Competencies</div>
                <div className={styles.drawerTagList}>
                  {selectedMember.skills.map((s, i) => (
                    <span key={i} className={styles.drawerTag}>
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}

            {selectedMember.deliverables && selectedMember.deliverables.length > 0 && (
              <>
                <div className={styles.drawerSectionTitle}>Key Deliverables & Responsibilities</div>
                <div className={styles.drawerTagList}>
                  {selectedMember.deliverables.map((d, i) => (
                    <span key={i} className={styles.drawerTag}>
                      {d}
                    </span>
                  ))}
                </div>
              </>
            )}

            <div className={styles.drawerActions}>
              <Link href="/join" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                Build with this Domain →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
