export interface QAAgent {
  id: string;
  name: string;
  callsign: string;
  role: string;
  avatar: string;
  specialty: string;
  replacesDuty: string;
  description: string;
  fullBio: string;
  tags: string[];
  metrics: {
    testsPerMinute: number;
    accuracyRate: string;
    avgCatchTime: string;
  };
  sampleActions: string[];
}

export interface BugFinding {
  id: string;
  agentId: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'Functional' | 'Regression' | 'Visual' | 'Security' | 'Hydration & Performance';
  affectedRoute: string;
  impact: string;
  reproductionSteps: string[];
  suggestedFix: string;
  codeSnippet?: string;
  screenshotUrl: string;
  detectedAt: string;
  status: 'BLOCKER' | 'INVESTIGATING' | 'RESOLVED';
}

export interface AgentExecutionState {
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  currentAction: string;
  completedSteps: number;
  totalSteps: number;
  findingsCount: number;
  startedAt?: number;
  durationMs?: number;
}

export interface LogEntry {
  id: string;
  agentId: string;
  timestamp: string;
  level: 'info' | 'action' | 'finding' | 'error' | 'success';
  message: string;
  metadata?: Record<string, any>;
}

export interface QARunScenario {
  id: string;
  title: string;
  subtitle: string;
  targetApp: string;
  targetUrl: string;
  branch: string;
  commitSha: string;
  commitMessage: string;
  environment: string;
  verdict: 'PASS' | 'FAIL';
  verdictTitle: string;
  verdictExplanation: string;
  canDeploy: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  durationSeconds: number;
  bugs: BugFinding[];
  agentStates: Record<string, {
    status: 'completed' | 'failed';
    durationMs: number;
    stepsCompleted: number;
    findingsCount: number;
  }>;
}

export const QA_AGENTS: QAAgent[] = [
  {
    id: 'astra',
    name: 'Agent Astra',
    callsign: 'FLOW-SYNTHESIZER',
    role: 'Lead Functional & Behavioral Flow Agent',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    specialty: 'Autonomous multi-step user journeys, auth states, modal cascades, and state-machine integrity.',
    replacesDuty: 'Replaces 4 manual functional test engineers executing exploratory and smoke checklists.',
    description: 'Traverses web applications as thousands of diverse end-users, submitting dynamic form combinations and validating end-to-end transactional workflows.',
    fullBio: 'Astra maps the entire client-side state machine dynamically. It formulates novel interaction sequences to stress-test complex workflows—such as subscription checkout, workspace invitation sequences, and multi-tenant permission transitions—without pre-written brittle scripts.',
    tags: ['E2E Journeys', 'Form Fuzzing', 'State Machines', 'Checkout Integrity'],
    metrics: {
      testsPerMinute: 420,
      accuracyRate: '99.94%',
      avgCatchTime: '4.2s',
    },
    sampleActions: [
      'Injecting boundary card credentials into payment modal',
      'Synthesizing 200 concurrent user sessions with conflicting workspace roles',
      'Verifying optimistic mutation rollback on network throttle',
      'Validating form persistence across unexpected browser tab suspensions',
    ],
  },
  {
    id: 'kinesis',
    name: 'Agent Kinesis',
    callsign: 'VIEWPORT-INSPECTOR',
    role: 'Visual & Cross-Engine Rendering Agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    specialty: 'Pixel-differential visual regressions, Chromium vs WebKit vs Gecko layout divergence, responsive viewport matrices.',
    replacesDuty: 'Replaces manual device lab testing, cross-browser manual checks, and manual design QA audits.',
    description: 'Renders the web application across 36 headless browser targets and viewports simultaneously, detecting unintentional CSS clipping, font shifts, and layout overflows.',
    fullBio: 'Kinesis compares DOM layout geometry against baseline design tokens and historical visual captures. It catches elusive CSS layout bugs like flexbox overflow in Safari Mobile, sticky header clipping in iOS WebKit, and subpixel font rendering collapse before users ever report them.',
    tags: ['Chromium / WebKit / Gecko', 'Responsive Viewports', 'Pixel Diff', 'CLS Defect Scan'],
    metrics: {
      testsPerMinute: 310,
      accuracyRate: '99.88%',
      avgCatchTime: '3.8s',
    },
    sampleActions: [
      'Evaluating Safari 18 WebKit rendering vs Chrome 134 V8 layout engine',
      'Diffing fold-phone 280px viewport up to 4K Ultrawide 3840px',
      'Auditing cumulative layout shift (CLS) during asynchronous font hydration',
      'Verifying high-contrast accessibility color ratios in dark mode',
    ],
  },
  {
    id: 'sentinel',
    name: 'Agent Sentinel',
    callsign: 'REGRESSION-GUARD',
    role: 'Code Diff & Change Impact Sentinel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
    specialty: 'Git pull request AST diffing, blast-radius component impact analysis, regression prevention.',
    replacesDuty: 'Replaces manual regression sprint verification that typically delays production deployments by 3 to 5 business days.',
    description: 'Reads pull request changesets, maps impacted component graphs, and specifically bombards legacy flows that touch modified shared hooks or global store states.',
    fullBio: 'Sentinel connects git commit diffs directly to runtime behavior. When a developer modifies a shared billing utility, Sentinel prioritizes testing every dependent screen—account settings, upgrade modals, invoice downloaders—ensuring zero unintended regressions slip into master.',
    tags: ['AST Diff Analysis', 'Blast Radius Mapping', 'Zero Regressions', 'Shared State Verification'],
    metrics: {
      testsPerMinute: 540,
      accuracyRate: '99.98%',
      avgCatchTime: '2.9s',
    },
    sampleActions: [
      'Parsing Git diff in src/context/AuthContext.tsx for unhandled side-effects',
      'Targeting 48 dependent legacy routes with simulated expired sessions',
      'Validating backward compatibility of API response shape adaptations',
      'Confirming cookie domain isolation between staging and production realms',
    ],
  },
  {
    id: 'aegis',
    name: 'Agent Aegis',
    callsign: 'BOUNDARY-SHIELD',
    role: 'Security, Auth & Boundary Barrier Agent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    specialty: 'Client-side XSS vectors, CSRF validation, authorization boundary leakage, sanitized inputs.',
    replacesDuty: 'Replaces preliminary manual application security checklist reviews and penetration smoke testing.',
    description: 'Interrogates web forms, URL query params, and websocket frames with malicious polyglots, verifying that client sanitization and token handling adhere to strict isolation.',
    fullBio: 'Aegis acts as an adversarial tester directly in pre-deployment web environments. It checks for privilege escalation by attempting restricted UI navigation under standard roles, probes rich text inputs for stored script execution, and inspects local storage for leaked access tokens.',
    tags: ['OWASP Top 10 Web', 'Auth Bypass Fuzzing', 'Input Sanitization', 'Token Leak Detection'],
    metrics: {
      testsPerMinute: 380,
      accuracyRate: '99.99%',
      avgCatchTime: '3.1s',
    },
    sampleActions: [
      'Injecting nested SVG/onload vectors into user profile markdown fields',
      'Fuzzing query parameters with null byte and path traversal payloads',
      'Verifying JWT expiry handling doesn’t leak stale cache into public DOM',
      'Auditing CORS preflight headers and content-security-policy enforcement',
    ],
  },
  {
    id: 'chronos',
    name: 'Agent Chronos',
    callsign: 'PERF-HYDRATION',
    role: 'Hydration & Client Performance Profiler',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    specialty: 'React 19 / Next.js hydration mismatches, Interaction to Next Paint (INP), memory leaks, waterfall bottlenecks.',
    replacesDuty: 'Replaces manual performance audit runs and staging console inspection.',
    description: 'Profiles DOM tree hydration against SSR HTML payloads, detecting suppressed console warnings, slow interaction paint delays, and memory leaks during route cycling.',
    fullBio: 'Chronos monitors the browser performance timeline at millisecond resolution. It automatically catches server/client markup differences, unhandled promise rejections, runaway event listener allocations, and massive bundle chunks blocking the main thread.',
    tags: ['Hydration Mismatch', 'INP / LCP Profiler', 'Memory Leak Hunt', 'Console Error Trap'],
    metrics: {
      testsPerMinute: 490,
      accuracyRate: '99.91%',
      avgCatchTime: '4.8s',
    },
    sampleActions: [
      'Checking Next.js SSR HTML against client hydration DOM tree',
      'Stress-testing memory retention across 50 rapid route transitions',
      'Measuring Interaction to Next Paint (INP) under synthetic CPU 4x slowdown',
      'Intercepting unhandled asynchronous promise rejections in web workers',
    ],
  },
  {
    id: 'cerberus',
    name: 'Agent Cerberus',
    callsign: 'GATE-AUTHORITY',
    role: 'Release Gate Synthesizer & Deploy Decision Authority',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
    specialty: 'Multi-agent finding correlation, release gate policy enforcement, cryptographic pass/block signing.',
    replacesDuty: 'Replaces the manual QA sign-off meeting and release management rubber-stamp committees.',
    description: 'Evaluates the composite findings from all specialized agents against strict pre-deployment gate policies. Generates the authoritative single release verdict.',
    fullBio: 'Cerberus is the final arbiter. It rejects ambiguous, subjective ratings. If a critical regression or broken customer journey exists, Cerberus terminates release approval and locks the deployment pipeline with concrete evidence and suggested fixes.',
    tags: ['Release Gate Authority', 'Zero Critical Tolerance', 'Signed Release Token', 'Deploy / Block Verdict'],
    metrics: {
      testsPerMinute: 620,
      accuracyRate: '100.0%',
      avgCatchTime: '1.2s',
    },
    sampleActions: [
      'Aggregating telemetry from Astra, Kinesis, Sentinel, Aegis, and Chronos',
      'Applying Zero-Critical-Defect release gate criteria',
      'Synthesizing plain-language executive explanation for release blocker',
      'Issuing signed deployment gate approval token for CI/CD webhook',
    ],
  },
];

export const SAMPLE_RUN_FAILED: QARunScenario = {
  id: 'run-9842-failed',
  title: 'Staging Release Gate — PR #412: "Revamp Stripe 3DS Checkout & Plan Tiering"',
  subtitle: 'Pre-Deployment Release Gate Verification',
  targetApp: 'CloudPay Platform & Billing Portal',
  targetUrl: 'https://staging.cloudpay.io/checkout',
  branch: 'feat/stripe-3ds-migration',
  commitSha: '9e7b214c',
  commitMessage: 'feat(billing): upgrade Stripe Elements SDK and implement new tier downgrade dialog',
  environment: 'Staging (Kubernetes Cluster-East-01)',
  verdict: 'FAIL',
  verdictTitle: 'RELEASE BLOCKED',
  verdictExplanation: 'Deployment blocked due to 2 Critical defects and 1 High defect. Critical payment state machine failure prevents customers from completing checkout on Safari WebKit, and an unhandled null exception crashes the plan downgrade modal.',
  canDeploy: false,
  totalTests: 1842,
  passedTests: 1819,
  failedTests: 23,
  durationSeconds: 142,
  agentStates: {
    astra: { status: 'failed', durationMs: 138000, stepsCompleted: 420, findingsCount: 1 },
    kinesis: { status: 'failed', durationMs: 141000, stepsCompleted: 310, findingsCount: 1 },
    sentinel: { status: 'failed', durationMs: 124000, stepsCompleted: 540, findingsCount: 1 },
    aegis: { status: 'completed', durationMs: 118000, stepsCompleted: 380, findingsCount: 0 },
    chronos: { status: 'completed', durationMs: 131000, stepsCompleted: 490, findingsCount: 1 },
    cerberus: { status: 'completed', durationMs: 142000, stepsCompleted: 620, findingsCount: 0 },
  },
  bugs: [
    {
      id: 'BUG-101',
      agentId: 'astra',
      title: 'Checkout Payment Button Unresponsive When 3D Secure Challenge Cancels',
      severity: 'CRITICAL',
      category: 'Functional',
      affectedRoute: '/checkout?plan=enterprise-annual',
      impact: 'Blocks revenue collection. User is left in an infinite loading spinner state if 3DS modal is dismissed, requiring full browser cache clear.',
      reproductionSteps: [
        'Navigate to /checkout with enterprise-annual plan selected',
        'Input valid European credit card triggering 3DS modal challenge',
        'Dismiss the 3DS iframe modal via external click or cancel button',
        'Observe "Confirm Payment" button remains disabled with isLoading: true',
      ],
      suggestedFix: 'Add onError and onCancel listener in useStripePayment hook to reset isProcessing state when the Stripe 3DS overlay emits cancellation.',
      codeSnippet: `// In src/hooks/useStripePayment.ts:
- const handlePayment = async () => { setIsProcessing(true); await stripe.confirmCardPayment(...); }
+ const handlePayment = async () => {
+   setIsProcessing(true);
+   try {
+     const res = await stripe.confirmCardPayment(...);
+     if (res.error) setIsProcessing(false);
+   } catch (err) {
+     setIsProcessing(false);
+   }
+ };`,
      screenshotUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
      detectedAt: 'T+48s during Astra state mutation pass',
      status: 'BLOCKER',
    },
    {
      id: 'BUG-102',
      agentId: 'kinesis',
      title: 'Safari WebKit Payment Fields Collapsing to 0px Height on iOS Viewports',
      severity: 'CRITICAL',
      category: 'Visual',
      affectedRoute: '/checkout/mobile',
      impact: '100% of Safari iOS users cannot see or interact with Card Number, Expiration, or CVC input fields due to flexbox height calculation bug.',
      reproductionSteps: [
        'Render /checkout on WebKit viewport (iPhone 15 Pro, 393x852)',
        'Inspect .stripe-card-container element in DOM',
        'Computed CSS height evaluates to 0px due to min-height: auto within parent flex container',
      ],
      suggestedFix: 'Apply explicit min-height: 48px and flex-shrink: 0 to the iframe wrapper container.',
      codeSnippet: `/* In src/styles/checkout.css */
.stripe-elements-wrapper {
+  min-height: 48px;
+  flex-shrink: 0;
+  width: 100%;
}`,
      screenshotUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80',
      detectedAt: 'T+64s during Kinesis multi-engine matrix check',
      status: 'BLOCKER',
    },
    {
      id: 'BUG-103',
      agentId: 'sentinel',
      title: 'Regression: Downgrading Plan Throws Unhandled Null in Organization State',
      severity: 'HIGH',
      category: 'Regression',
      affectedRoute: '/settings/billing/change-plan',
      impact: 'Existing active teams attempting to switch plans crash into React Error Boundary with TypeError: Cannot read properties of undefined (reading "seatAllocation").',
      reproductionSteps: [
        'Log in as Organization Admin with an active Multi-seat Pro subscription',
        'Navigate to Billing -> Change Plan -> Select Starter',
        'Click "Review Plan Adjustment"',
        'Console logs unhandled exception: organization.seatAllocation is undefined in new modal',
      ],
      suggestedFix: 'Provide optional chaining or fallback default for seatAllocation when plan has no seat tiers.',
      codeSnippet: `// In src/components/billing/PlanAdjustmentModal.tsx:
- const seatCount = org.seatAllocation.totalSeats;
+ const seatCount = org.seatAllocation?.totalSeats ?? org.memberCount ?? 1;`,
      screenshotUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      detectedAt: 'T+82s during Sentinel change impact trace',
      status: 'BLOCKER',
    },
    {
      id: 'BUG-104',
      agentId: 'chronos',
      title: 'Hydration Mismatch on Currency Symbol Localized Formatter',
      severity: 'MEDIUM',
      category: 'Hydration & Performance',
      affectedRoute: '/pricing',
      impact: 'SSR server HTML renders "$" while client hydration re-formats to "USD" causing React 19 hydration mismatch warning and visual flash.',
      reproductionSteps: [
        'Request /pricing with header Accept-Language: de-DE',
        'Inspect server rendered HTML: content displays "$99"',
        'On client mount, Intl.NumberFormat swaps text to "99,00 €", triggering hydration mismatch',
      ],
      suggestedFix: 'Standardize currency formatting by deferring client locale resolution to useEffect or passing uniform server locale.',
      codeSnippet: `// In src/components/PriceTag.tsx
+ const [mounted, setMounted] = useState(false);
+ useEffect(() => setMounted(true), []);`,
      screenshotUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
      detectedAt: 'T+105s during Chronos hydration scan',
      status: 'INVESTIGATING',
    },
  ],
};

export const SAMPLE_RUN_PASSED: QARunScenario = {
  id: 'run-9843-passed',
  title: 'Production Candidate Gate — PR #415: "Fix Payment 3DS Listener & WebKit CSS"',
  subtitle: 'Pre-Deployment Release Gate Verification',
  targetApp: 'CloudPay Platform & Billing Portal',
  targetUrl: 'https://staging.cloudpay.io/checkout',
  branch: 'main',
  commitSha: '3a4f89d1',
  commitMessage: 'fix(billing): resolve 3DS listener state reset and add WebKit min-height fix',
  environment: 'Staging (Kubernetes Cluster-East-01)',
  verdict: 'PASS',
  verdictTitle: 'RELEASE APPROVED',
  verdictExplanation: 'All 6 autonomous QA agents completed full pre-deployment sweeps with zero critical or high defects detected. All checkout flows, cross-browser viewports, regressions, security boundaries, and hydration tests passed authoritative gate criteria.',
  canDeploy: true,
  totalTests: 1914,
  passedTests: 1914,
  failedTests: 0,
  durationSeconds: 118,
  agentStates: {
    astra: { status: 'completed', durationMs: 112000, stepsCompleted: 450, findingsCount: 0 },
    kinesis: { status: 'completed', durationMs: 114000, stepsCompleted: 330, findingsCount: 0 },
    sentinel: { status: 'completed', durationMs: 105000, stepsCompleted: 580, findingsCount: 0 },
    aegis: { status: 'completed', durationMs: 98000, stepsCompleted: 390, findingsCount: 0 },
    chronos: { status: 'completed', durationMs: 110000, stepsCompleted: 510, findingsCount: 0 },
    cerberus: { status: 'completed', durationMs: 118000, stepsCompleted: 640, findingsCount: 0 },
  },
  bugs: [],
};

export const SAMPLE_PROJECTS = [
  {
    id: 'proj-1',
    name: 'CloudPay Billing Portal',
    url: 'https://app.cloudpay.io',
    repository: 'github.com/cloudpay/core-web',
    activeBranch: 'main',
    lastRunStatus: 'FAIL',
    lastRunId: 'run-9842-failed',
    lastRunTime: '12 minutes ago',
    gatePolicy: 'Strict (0 Critical / 0 High)',
    passRate: '94.2%',
    activeAgents: 6,
    trend: [98, 96, 99, 92, 94, 88, 79],
  },
  {
    id: 'proj-2',
    name: 'SaaS Customer Admin Console',
    url: 'https://admin.cloudpay.io',
    repository: 'github.com/cloudpay/admin-portal',
    activeBranch: 'release/v2.14',
    lastRunStatus: 'PASS',
    lastRunId: 'run-9840-passed',
    lastRunTime: '2 hours ago',
    gatePolicy: 'Strict (0 Critical / 0 High)',
    passRate: '100%',
    activeAgents: 6,
    trend: [100, 100, 98, 100, 100, 100, 100],
  },
  {
    id: 'proj-3',
    name: 'Auth & Identity Gateway',
    url: 'https://auth.cloudpay.io',
    repository: 'github.com/cloudpay/id-gateway',
    activeBranch: 'feat/passkeys-support',
    lastRunStatus: 'PASS',
    lastRunId: 'run-9835-passed',
    lastRunTime: '1 day ago',
    gatePolicy: 'Strict (0 Critical / 0 High)',
    passRate: '98.5%',
    activeAgents: 6,
    trend: [96, 97, 98, 98, 99, 98, 99],
  },
];

export const TESTIMONIALS = [
  {
    quote: "ProjectGuard replaced our entire 8-person manual QA vendor sprint. We deployed 43 times this month with zero regressions slipping into production. The release gate is non-negotiable for our team now.",
    author: "Elena Rostova",
    role: "VP of Engineering",
    company: "Veloce Cloud",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
    metrics: "43 releases / 0 rollbacks",
  },
  {
    quote: "Before ProjectGuard, manual QA took 4 days per release and still missed Safari checkout bugs. Now all 6 AI agents run in under 3 minutes, giving us an authoritative release verdict with exact code diff fixes.",
    author: "Marcus Vance",
    role: "Head of Product Delivery",
    company: "Synthetix Financial",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    metrics: "Release cycle cut from 4 days to 3 mins",
  },
  {
    quote: "The transparency is extraordinary. Other tools give you a black-box summary. ProjectGuard lets you watch Astra and Kinesis fuzz edge states in real-time, inspect every live log, and trust the release gate with 100% confidence.",
    author: "David Chen",
    role: "Staff Infrastructure Architect",
    company: "OmniFlow Systems",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    metrics: "$340k/yr saved in outsourced QA",
  },
];

export const PRICING_TIERS = [
  {
    id: 'starter',
    name: 'Autonomous Startup',
    badge: 'Replaces 1-2 Manual QA Contractors',
    price: '$490',
    billingPeriod: '/month',
    description: 'For fast-shipping teams deploying multiple times per week who need total QA certainty.',
    features: [
      'Up to 3 Production / Staging Web Apps',
      'All 6 Autonomous QA Agents deployed',
      'Parallel Execution Swarm (up to 4 concurrent runs)',
      'Authoritative Release Gate CLI & Webhook blocker',
      'Full visual evidence & plain-English suggested code diffs',
      'Slack & GitHub PR bot integration',
      'Email & Community Discord support',
    ],
    ctaText: 'Start 14-Day Free Trial',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth & Scale',
    badge: 'Replaces Entire 4-8 Person QA Team',
    price: '$1,490',
    billingPeriod: '/month',
    description: 'For scaling engineering organizations needing zero release delays and authoritative CI/CD release gates.',
    features: [
      'Unlimited Web Applications & Preview Environments',
      'All 6 Autonomous QA Agents deployed with prioritized GPU execution',
      'High-Concurrency Swarm (up to 16 parallel runs)',
      'Sub-2-Minute Turbo Execution mode',
      'Historical regression blast-radius tracking',
      'SOC2 Type II compliance reports & cryptographic gate tokens',
      'Dedicated Customer Success Engineer & 99.9% SLA',
    ],
    ctaText: 'Deploy Swarm Now',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Shield',
    badge: 'Enterprise-Wide QA Replacement',
    price: 'Custom',
    billingPeriod: '',
    description: 'Custom governance, on-prem VPC execution, bespoke security compliance policies, and tailored SLAs.',
    features: [
      'Unlimited Workspaces, Teams & Environments',
      'Dedicated VPC Private Runners or Self-Hosted execution',
      'Custom QA Agent Training on company proprietary design systems',
      'Air-gapped deployment gate authorization',
      'Custom SSO, SAML, and granular RBAC governance',
      '24/7 Phone & Slack Bridge with Senior Engineering Leads',
      'Guaranteed Zero-Regression financial warranty',
    ],
    ctaText: 'Schedule Engineering Briefing',
    popular: false,
  },
];
