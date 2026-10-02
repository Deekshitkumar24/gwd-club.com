import { CLUB } from '@/data/content';
import Link from 'next/link';
import styles from './privacy.module.css';

export const metadata = {
  title: 'Privacy Policy · GWD Global Pvt. Ltd.',
  description: 'Official data protection and privacy policies for GWD Global Pvt. Ltd. and GWD Club.',
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <p className="label" style={{ color: 'var(--brand-red)', marginBottom: 'var(--space-md)' }}>
            Legal Transparency
          </p>
          <h1 className={styles.headerTitle}>Privacy Policy</h1>
          <p className={styles.headerDesc}>
            Effective Date: June 12, 2025 · Last Updated: 2026
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.contentInner}>
          <div className={styles.article}>
            <h2>1. Legal Entity & Scope</h2>
            <p>
              This Privacy Policy governs the collection, processing, and safeguarding of data by{' '}
              <strong>{CLUB.companyName}</strong> (Corporate Identification Number: <code>{CLUB.cin}</code>, GSTIN: <code>{CLUB.gstin}</code>), headquartered in {CLUB.registeredOffice}, together with the student collective <strong>{CLUB.name}</strong> based at {CLUB.campusBase}.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We collect information exclusively when submitted directly through our digital interfaces:</p>
            <ul>
              <li>
                <strong>Event Registrations:</strong> Full name, institutional affiliation (college or company), email address, phone number, academic branch/year, and accessibility requirements.
              </li>
              <li>
                <strong>Collective Applications:</strong> Candidate name, contact details, domain of specialization (Engineering, Design, Events, Media, Operations), portfolio/GitHub URLs, and builder statements.
              </li>
              <li>
                <strong>Enterprise & Collaboration Inquiries:</strong> Organization name, liaison contact details, corporate email, and project scope briefs.
              </li>
            </ul>

            <h2>3. Purpose & Legal Basis of Processing</h2>
            <p>All collected data is processed strictly for legitimate operational purposes:</p>
            <ul>
              <li>Verifying attendee credentials and issuing event security check-in passes.</li>
              <li>Evaluating candidate portfolios during seasonal GWD builder sprint recruitment cycles.</li>
              <li>Executing commercial software and creative service agreements with client partners.</li>
              <li>Maintaining administrative compliance under applicable Indian corporate laws.</li>
            </ul>

            <h2>4. Absolute Prohibition on Commercial Data Sale</h2>
            <p>
              <strong>We never sell, lease, monetize, or broker personal information to third-party marketing brokers or advertisers.</strong> User data is treated as confidential and accessed only by authorized GWD division directors and administrative personnel.
            </p>

            <h2>5. Data Storage, Retention & Security</h2>
            <p>
              Data is stored on enterprise-grade infrastructure utilizing industry-standard encryption in transit (HTTPS/TLS) and at rest. Event registration records are retained for a maximum of 24 months post-event for accreditation and reporting before permanent decommissioning.
            </p>

            <h2>6. Third-Party Links & Integrations</h2>
            <p>
              Our public website may reference client repositories, project demos, or external event venues. GWD is not responsible for the privacy policies or practices of third-party platforms accessed via external hyperlinks.
            </p>

            <h2>7. Contact & Privacy Inquiries</h2>
            <p>
              To request inspection, correction, or deletion of any personal data submitted to GWD, please contact our Data Governance Desk:
            </p>
            <div className={styles.contactBox}>
              <p><strong>Data Governance Desk — GWD Global Pvt. Ltd.</strong></p>
              <p>Madhapur, Hyderabad, Telangana — 500081</p>
              <p>Email: <a href="mailto:privacy@gwd-global.com">privacy@gwd-global.com</a></p>
            </div>

            <div className={styles.backWrap}>
              <Link href="/" className="btn btn-secondary">← Back to Homepage</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
