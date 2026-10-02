'use client';

import { useState, useEffect } from 'react';
import { useReveal } from '@/hooks/useAnimations';
import { useCms } from '@/context/CmsContext';
import { DyeAtmosphereTransition, DyeCtaBackdrop } from '@/components/DyeVisual';
import styles from './workflow.module.css';

interface WorkflowStep {
  phase: string;
  number: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    phase: '01 · INITIATION',
    number: '01',
    title: 'Idea Incubation & Problem Validation',
    duration: 'Week 1',
    description:
      'Every project starts with an actual problem statement rather than abstract speculation. We filter ideas against market reality: is this an enterprise contract, an incubation venture, or a community tool that creates undeniable utility?',
    deliverables: [
      'Problem Brief & Market Validation',
      'Target User Persona & Scope Definition',
      'Technical Feasibility Assessment',
    ],
  },
  {
    phase: '02 · SPECIFICATION',
    number: '02',
    title: 'Planning & Systems Architecture',
    duration: 'Weeks 1–2',
    description:
      'We deconstruct the product into architectural contracts, wireframes, and sprint milestones. Cross-functional leads assign distinct lanes across Engineering, Creative, and Product Operations so parallel build execution can proceed without blockers.',
    deliverables: [
      'Component Architecture & Data Model',
      'High-Fidelity Figma Design System',
      'Sprint Roadmap & Milestones Breakdown',
    ],
  },
  {
    phase: '03 · ENGAGEMENT',
    number: '03',
    title: 'Registration / Participation & Crew Assembling',
    duration: 'Week 2',
    description:
      'For community sprints and major showcases, registration opens with role-based application tracks. Builders are onboarded based on verified skill domains, matched with senior mentors, and integrated into active repo branches.',
    deliverables: [
      'Role Matching (Tech, Creative, Ops)',
      'GitHub Workspace & Repository Access',
      'Live Kickoff & Sprint Briefing',
    ],
  },
  {
    phase: '04 · BUILD VELOCITY',
    number: '04',
    title: 'Execution & Continuous Shipping',
    duration: 'Weeks 3–6',
    description:
      'The core shipping phase. Fast iterations, transparent daily logs, and production-first standards. No half-finished academic prototypes: systems are deployed continuously to staging environments with live user testing.',
    deliverables: [
      'Daily Async Standups & PR Reviews',
      'Staging Deployments & CI/CD Pipelines',
      'Functional End-to-End Testing',
    ],
  },
  {
    phase: '05 · RIGOR',
    number: '05',
    title: 'Feedback, QA & Stakeholder Review',
    duration: 'Week 7',
    description:
      'Products undergo rigorous review with client stakeholders, community alpha testers, and mentors. Edge cases are identified, visual polish is finalized, and performance metrics are benchmarked before production clearance.',
    deliverables: [
      'Real-World User Testing Sessions',
      'Performance, Accessibility & Security Audit',
      'Final Production Sign-Off',
    ],
  },
  {
    phase: '06 · OUTCOME',
    number: '06',
    title: 'Deployment & Long-Term Impact',
    duration: 'Post-Launch',
    description:
      'The system goes live on production domains, distributed to real end users and enterprises. We track adoption, measure impact against key performance indicators, and transition projects into sustainable operations or independent ventures.',
    deliverables: [
      'Production Release & DNS Migration',
      'Operational Documentation & Handover',
      'Measurable Business & User Impact',
    ],
  },
];

export default function WorkflowPage() {
  const { store } = useCms();
  const { ref: headerRef, isVisible: isHeaderVisible } = useReveal();
  const [activeStep, setActiveStep] = useState(0);

  const publishedCmsSteps = (store.workflow || []).filter((w) => w.status === 'Published');
  const activeSteps =
    publishedCmsSteps.length > 0
      ? publishedCmsSteps.map((s) => ({
          phase: `${s.stepNumber} · ${s.phase}`,
          number: s.stepNumber,
          title: s.title,
          duration: s.duration,
          description: s.summary,
          deliverables: s.deliverables,
        }))
      : WORKFLOW_STEPS;

  useEffect(() => {
    const handleScroll = () => {
      const stepElements = document.querySelectorAll('[data-step-index]');
      const scrollPos = window.scrollY + window.innerHeight * 0.45;

      stepElements.forEach((el) => {
        const top = (el as HTMLElement).offsetTop;
        const height = (el as HTMLElement).offsetHeight;
        const idx = parseInt(el.getAttribute('data-step-index') || '0', 10);
        if (scrollPos >= top && scrollPos < top + height) {
          setActiveStep(idx);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.page}>
      {/* Editorial Header */}
      <section className={styles.header}>
        <div className={styles.headerInner} ref={headerRef}>
          <div className={`reveal ${isHeaderVisible ? 'visible' : ''}`}>
            <p className="label" style={{ color: 'var(--brand-red)', marginBottom: 'var(--space-md)' }}>
              Execution Framework
            </p>
            <h1 className={styles.headerTitle}>How GWD gets work done.</h1>
            <p className={styles.headerDesc}>
              A battle-tested six-phase methodology that transforms raw concepts into scalable, production-grade systems with total accountability.
            </p>
          </div>
        </div>
      </section>

      {/* ── Atmospheric Chapter Transition ── */}
      <DyeAtmosphereTransition
        chapter="SIX PHASES OF EXECUTION"
        title="From raw concept to deployed reality"
        speed={0.75}
        density={0.85}
        stir={1.0}
      />

      {/* Workflow Stepper */}
      <section className={styles.workflowSection}>
        <div className={styles.workflowInner}>
          <div className={styles.stepperTrack}>
            {activeSteps.map((step, index) => {
              const isCurrent = activeStep === index;
              return (
                <div
                  key={step.number}
                  className={styles.stepRow}
                  data-step-index={index}
                >
                  <div className={`${styles.stepNode} ${isCurrent ? styles.stepNodeActive : ''}`}>
                    {step.number}
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepPhaseLabel}>{step.phase}</span>
                      <span className={styles.stepEstimatedTime}>{step.duration}</span>
                    </div>

                    <h2 className={styles.stepTitle}>{step.title}</h2>
                    <p className={styles.stepDesc}>{step.description}</p>

                    <div className={styles.stepOutputs}>
                      <div className={styles.stepOutputTitle}>Phase Key Outputs</div>
                      <div className={styles.stepOutputList}>
                        {(Array.isArray(step.deliverables)
                          ? step.deliverables
                          : typeof step.deliverables === 'string'
                          ? (step.deliverables as string).split(',').map((s) => s.trim()).filter(Boolean)
                          : []
                        ).map((item: string) => (
                          <span key={item} className={styles.outputTag}>
                            <span className={styles.outputCheck}>✓</span>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <DyeCtaBackdrop
          tag="START THE PIPELINE"
          title={
            <>
              Ready to ship through our pipeline?
              <br />
              <span style={{ color: 'var(--brand-red)' }}>Build with total accountability.</span>
            </>
          }
          subtitle="Join as an ambitious builder to work on production software, or partner with GWD to bring your organization's product to life."
          primaryCtaText="Apply to Join GWD"
          primaryCtaHref="/join"
          secondaryCtaText="Partner With Us"
          secondaryCtaHref="/collaborations"
        />
      </section>
    </div>
  );
}
