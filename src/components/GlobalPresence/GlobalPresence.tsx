'use client';

import React, { useState } from 'react';
import WorldMapSvg from './WorldMapSvg';
import styles from './GlobalPresence.module.css';

interface CountryItem {
  id: string;
  name: string;
  city: string;
  flag: string;
  isHq: boolean;
  role: string;
}

const COUNTRIES: CountryItem[] = [
  {
    id: 'india',
    name: 'India, HQ',
    city: 'Hyderabad',
    flag: '🇮🇳',
    isHq: true,
    role: 'Global Headquarters (Madhapur) & VJIT Campus Tech Base',
  },
  {
    id: 'uae',
    name: 'United Arab Emirates',
    city: 'Dubai',
    flag: '🇦🇪',
    isHq: false,
    role: 'Middle East Regional Operations & Commercial Base',
  },
  {
    id: 'saudi',
    name: 'Saudi Arabia',
    city: 'Riyadh',
    flag: '🇸🇦',
    isHq: false,
    role: 'Enterprise Client Operations & Government Partnerships',
  },
  {
    id: 'qatar',
    name: 'Qatar',
    city: 'Doha',
    flag: '🇶🇦',
    isHq: false,
    role: 'Sports & Technology Partner Delivery Hub',
  },
  {
    id: 'kuwait',
    name: 'Kuwait',
    city: 'Kuwait City',
    flag: '🇰🇼',
    isHq: false,
    role: 'Regional Client Operations & System Integrations',
  },
  {
    id: 'turkey',
    name: 'Turkey',
    city: 'Istanbul',
    flag: '🇹🇷',
    isHq: false,
    role: 'Design & Engineering Hub at Eurasian Crossroad',
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    city: 'London',
    flag: '🇬🇧',
    isHq: false,
    role: 'European Commercial Delivery & Client Leadership',
  },
  {
    id: 'germany',
    name: 'Germany',
    city: 'Berlin',
    flag: '🇩🇪',
    isHq: false,
    role: 'Technology Systems & Enterprise Digital Infrastructure',
  },
  {
    id: 'singapore',
    name: 'Singapore',
    city: 'Singapore',
    flag: '🇸🇬',
    isHq: false,
    role: 'Asia-Pacific Regional Operations & Tech Scale',
  },
  {
    id: 'canada',
    name: 'Canada',
    city: 'Toronto',
    flag: '🇨🇦',
    isHq: false,
    role: 'North America Presence & Enterprise Solutions',
  },
];

export default function GlobalPresence() {
  const [selectedId, setSelectedId] = useState<string>('india');

  const selectedCountry = COUNTRIES.find((c) => c.id === selectedId) || COUNTRIES[0];

  return (
    <section className={styles.globalPresenceSection} data-dye-section="global">
      <div className={styles.presenceContainer}>
        {/* Top Header Row matching Slide 9 */}
        <div className={styles.topMetaBar}>
          <div className={styles.brandGroup}>
            <span className={styles.brandBadge}>GWD</span>
            <span>GWD Global Presence &amp; Infrastructure</span>
          </div>
          <div className={styles.chapterGroup}>
            <span>The company · Slide 09</span>
          </div>
        </div>

        {/* Headline & Lead Header Grid */}
        <header className={styles.mapHead}>
          <h2 className={styles.mainHeadline}>
            Built in Hyderabad.<br />
            Working across 10 countries.
          </h2>
          <p className={styles.leadText}>
            From our headquarters in Madhapur to clients across the Gulf, Europe, North America and Southeast Asia.
          </p>
        </header>

        {/* Authentic Deck Vector World Map */}
        <div
          className={styles.mapBox}
          role="img"
          aria-label="World map: Hyderabad headquarters linked to Dubai, Riyadh, Doha, Kuwait City, Istanbul, London, Berlin, Singapore and Toronto"
        >
          <WorldMapSvg />
        </div>

        {/* 10 Country Chips exactly as shown in Slide 9 */}
        <div className={styles.chipsContainer}>
          {COUNTRIES.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`${styles.countryChip} ${
                  item.isHq ? styles.countryChipHq : ''
                } ${isSelected ? styles.countryChipActive : ''}`}
                aria-label={`View operations in ${item.name}`}
              >
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Active Hub Detail Bar */}
        {selectedCountry && (
          <div className={styles.activeHubDetailBar}>
            <div className={styles.hubDetailLeft}>
              <span className={styles.hubDetailFlag}>{selectedCountry.flag}</span>
              <div>
                <h4 className={styles.hubDetailTitle}>
                  {selectedCountry.city}, {selectedCountry.name.replace(', HQ', '')}
                </h4>
                <p className={styles.hubDetailRole}>{selectedCountry.role}</p>
              </div>
            </div>
            <span className={styles.hubDetailPill}>
              {selectedCountry.isHq ? 'Global Headquarters' : 'International Hub'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
