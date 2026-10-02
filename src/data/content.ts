/* ============================================================
   GWD — GET WORK DONE
   Primary Source of Truth Content Data
   Source: GWD Overview.html & Official Company Records
   GWD Global Pvt. Ltd. · Madhapur, Hyderabad · GWD Club at VJIT
   ============================================================ */

// ── Corporate & Club Information ──
export const CLUB = {
  name: 'GWD',
  fullName: 'GWD Global Pvt. Ltd.',
  companyName: 'GWD Global Pvt. Ltd.',
  clubName: 'GWD Club',
  campus: 'VJIT (Vidya Jyothi Institute of Technology), Hyderabad',
  campusBase: 'VJIT (Vidya Jyothi Institute of Technology), Hyderabad',
  hq: 'Madhapur, Hyderabad, Telangana, India',
  registeredOffice: 'Madhapur, Hyderabad, Telangana, India',
  cin: 'U63999TS2025PTC199800',
  gstin: '36AAMCG1250H1ZP',
  incorporationDate: '12 June 2025',
  incorporated: '12 June 2025',
  inceptionDate: 'March 2024 (Student Initiative)',
  foundingDate: 'March 2024',
  tagline: 'Your Vision. Our Expertise.',
  motto: 'GET WORK DONE.',
  description:
    'GWD Global Pvt. Ltd. — a student idea from March 2024, a registered company since 12 June 2025. Operating across borders, delivering without boundaries across enterprise software, design systems, and digital sports infrastructure.',
  shortDescription:
    'A student-founded technology and creative powerhouse that turns ideas into shipped work — tech, design, and everything between.',
  longDescription:
    'GWD is a high-velocity collective of engineers, designers, and organizers born from a student idea in March 2024 at VJIT, and officially incorporated on 12 June 2025 in Madhapur, Hyderabad. We operate across 10 countries delivering production software, grassroots sports operating systems, and creative campaigns.',
  clubDescription:
    'The student builder community behind GWD Club at VJIT — turning ideas into shipped work across technology, design, events, and media.',
  mission:
    'To build production-grade technology, design systems, and platforms that solve real-world problems while transforming ambitious students into world-class builders.',
  vision:
    'To be the benchmark student-founded innovation collective and global technology partner, delivering without boundaries across borders and industries.',
  companyHeadline: 'One company. Three arms.',
  companySubheadline:
    'GWD Global Private Limited: headquartered in Madhapur, Hyderabad, and registered with the Government of India (MCA) in 2025.',
  studentIdeaHeadline: 'It started as a student idea',
  studentIdeaStory:
    "In March 2024, a handful of students saw a gap: skilled young people couldn't get real client work, and real clients couldn't find affordable, capable teams. GWD put itself in the middle. The name never changed, because the mission never did.",
  notAnotherClubHeadline: "We didn't build another college club",
  notAnotherClubStory:
    "Most students graduate without ever working on something real. That's the exact gap GWD was started to close in 2024, and the club brings it to every student on campus.\n\nGWD Club runs like a company because a real company stands behind it: departments, deadlines, live work, and accountability.",
  vjitInauguration:
    "Launched at VJIT in 2025 as the biggest club inauguration in the college's 25-year history, with Meraj Faheem (CEO, Telangana Innovation Cell) and Sadiya Sabira (CEO, Code for India) as chief guests.",
  accolades: [
    'Top 500 Upcoming Startups of Asia · E-Cell Bombay',
    'Top 25 of India · E-Cell Bombay',
  ],
  email: 'contact@gwd-club.com',
  phone: '+91 91212 99800',
  address: 'GWD Global Pvt. Ltd., Madhapur, Hyderabad, Telangana 500081 · GWD Club at VJIT, Hyderabad',
  socials: {
    instagram: 'https://instagram.com/gwdclub',
    linkedin: 'https://linkedin.com/company/gwd-global',
    twitter: 'https://twitter.com/gwdclub',
    github: 'https://github.com/gwdclub',
  },
};

// ── Official Verified Statistics (Slide 4) ──
export const STATS = [
  { label: 'Freelance Network', value: 650, suffix: '+', desc: 'Builders, designers, and engineers across our active network' },
  { label: 'Projects Delivered', value: 230, suffix: '+', desc: 'Shipped production systems and creative deliverables' },
  { label: 'Countries Operating', value: 10, suffix: '', desc: 'Global operations spanning 3 continents' },
  { label: 'Core Team', value: 18, suffix: '+', desc: 'Specialized executive and operations layer' },
  { label: 'Revenue Booked', value: 1.78, suffix: 'Cr', prefix: '₹', desc: 'Booked across services and product lines' },
  { label: 'Collective Valuation', value: 7.3, suffix: 'Cr', prefix: '₹', desc: 'Combined enterprise value held across the group' },
];

// ── The Three Arms of GWD (Slide 2: "One company. Three arms.") ──
export interface CompanyArm {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  highlighted?: boolean;
  tag?: string;
  badge?: {
    text: string;
    statusDot?: boolean;
  };
  metrics?: {
    value: string;
    label: string;
  }[];
}

export const THREE_ARMS: CompanyArm[] = [
  {
    id: 'gwd-global',
    name: 'GWD Global',
    subtitle: 'Projects & freelancing',
    description:
      'The core business. Teams from our network deliver client work across 15 practices: software, web and mobile, AI and automation, cloud, design, branding and media production.',
    metrics: [
      { value: '230+', label: 'projects delivered' },
      { value: '10', label: 'countries' },
    ],
  },
  {
    id: 'gwd-sports',
    name: 'GWD Sports',
    subtitle: "India's grassroots sports ecosystem",
    description:
      "The digital backbone for sports academies: academy management, a Student Sports Passport, and live leagues. Early stage, and already running the Hyderabad Super League's ten clubs.",
    badge: {
      text: 'Early stage, live',
      statusDot: true,
    },
  },
  {
    id: 'gwd-club-community',
    name: 'GWD Club & Community',
    subtitle: 'One community, on campus and beyond',
    description:
      "The club and the community are one. It's where students work like professionals before they graduate. Started at VJIT, now expanding to more colleges.",
    highlighted: true,
    tag: "• You're part of this one",
  },
];

// ── Global Presence Across 10 Countries (Slide 6) ──
export interface CountryPresence {
  country: string;
  city: string;
  isHq: boolean;
  role: string;
}

export const GLOBAL_PRESENCE: CountryPresence[] = [
  { country: 'India', city: 'Hyderabad', isHq: true, role: 'Global Headquarters (Madhapur) & VJIT Campus' },
  { country: 'United Arab Emirates', city: 'Dubai', isHq: false, role: 'Middle East Regional Operations' },
  { country: 'Saudi Arabia', city: 'Riyadh', isHq: false, role: 'Enterprise Client Operations' },
  { country: 'Qatar', city: 'Doha', isHq: false, role: 'Sports & Technology Partner Hub' },
  { country: 'Kuwait', city: 'Kuwait City', isHq: false, role: 'Client Operations' },
  { country: 'Turkey', city: 'Istanbul', isHq: false, role: 'Design & Engineering Hub' },
  { country: 'United Kingdom', city: 'London', isHq: false, role: 'European Delivery' },
  { country: 'Germany', city: 'Berlin', isHq: false, role: 'Technology & Enterprise Solutions' },
  { country: 'Singapore', city: 'Singapore', isHq: false, role: 'Asia-Pacific Operations' },
  { country: 'Canada', city: 'Toronto', isHq: false, role: 'North America Presence' },
];

// ── Ventures & Product Lines (Slide 4, 12, 14) ──
export interface ProductVenture {
  id: string;
  name: string;
  tagline: string;
  status: 'Live & Earning' | 'In Development' | 'In Design';
  currentMrr?: string;
  targetLaunch?: string;
  projectedArr?: {
    conservative: string;
    baseCase: string;
    ambitious: string;
  };
  description: string;
  partners?: string[];
  clubsInLeague?: string[];
}

export const PRODUCTS_VENTURES: ProductVenture[] = [
  {
    id: 'gwd-sports',
    name: 'GWD Sports',
    tagline: 'Grassroots Sports Operating System & Infrastructure',
    status: 'Live & Earning',
    currentMrr: '₹1.25L',
    projectedArr: {
      conservative: '₹85L',
      baseCase: '₹1.25Cr',
      ambitious: '₹2.8Cr',
    },
    description:
      'The first end-to-end digital simulation of a grassroots sports operation in India. Built from scratch by GWD, covering registration, player passports, attendance, fees, live standings, and tournament operation in one connected system.',
    partners: ['Hyderabad Super League', 'Sreenidi Deccan FC', 'Hyderabad Little Stars', 'MasterGrade'],
    clubsInLeague: [
      'Champions FC',
      'Deccan United FC',
      'Gladiators FC',
      'Guardians FC',
      'Hopeless FC',
      'IEA FC',
      'Knockout FC',
      'Strangers Stars FC',
      'Trail Blazers FC',
      'Warriors FC',
    ],
  },
  {
    id: 'next-bridge',
    name: 'Next Bridge',
    tagline: 'Property Management Platform',
    status: 'In Development',
    targetLaunch: '2026',
    description:
      'An intelligent digital property management ecosystem connecting property owners, tenants, and maintenance facilities with automated work order dispatching.',
  },
  {
    id: 'torqio',
    name: 'Torqio',
    tagline: 'Automotive Marketplace',
    status: 'In Design',
    targetLaunch: 'Q3',
    description:
      'Next-generation digital automotive marketplace combining verified vehicle provenance, digital inspection reports, and direct enthusiast builds.',
  },
];

export const VENTURES = PRODUCTS_VENTURES;

export const SPORTS_CLUBS = [
  { name: 'Champions FC', logo: '/logos/champions-fc.png' },
  { name: 'Deccan United FC', logo: '/logos/deccan-united-fc.png' },
  { name: 'Gladiators FC', logo: '/logos/gladiators-fc.png' },
  { name: 'Guardians FC', logo: '/logos/guardians-fc.png' },
  { name: 'Hopeless FC', logo: '/logos/hopeless-fc.png' },
  { name: 'IEA FC', logo: '/logos/iea-fc.png' },
  { name: 'Knockout FC', logo: '/logos/knockout-fc.png' },
  { name: 'Strangers Stars FC', logo: '/logos/strangers-stars-fc.png' },
  { name: 'Trail Blazers FC', logo: '/logos/trail-blazers-fc.png' },
  { name: 'Warriors FC', logo: '/logos/warriors-fc.png' },
  { name: 'Sreenidi Deccan FC', logo: '/logos/sreenidi-deccan-fc.png' },
  { name: 'Hyderabad Little Stars', logo: '/logos/hyderabad-little-stars.png' },
];

// ── Institutional Innovation Network (Slide 8) ──
export interface PartnerInstitution {
  id: string;
  name: string;
  category: 'Government & Innovation' | 'Ecosystem & Incubation';
  logo: string;
}

export const INSTITUTIONAL_PARTNERS: PartnerInstitution[] = [
  { id: 'tgic', name: 'TGIC', category: 'Government & Innovation', logo: '/logos/tgic.png' },
  { id: 't-hub', name: 'T-Hub', category: 'Government & Innovation', logo: '/logos/t-hub.png' },
  { id: 'k-tech', name: 'K-Tech Innovation Hub', category: 'Government & Innovation', logo: '/logos/k-tech-innovation-hub.png' },
  { id: 'gwd-club', name: 'GWD Club', category: 'Ecosystem & Incubation', logo: '/logos/gwd-club.png' },
  { id: 'edventure-park', name: 'Edventure Park', category: 'Ecosystem & Incubation', logo: '/logos/edventure-park.png' },
  { id: 'studlyf', name: 'Studlyf', category: 'Ecosystem & Incubation', logo: '/logos/studlyf.png' },
  { id: 'tg10x', name: 'TG10X', category: 'Ecosystem & Incubation', logo: '/logos/tg10x.png' },
  { id: 'bharat-startup', name: 'Bharat Startup', category: 'Ecosystem & Incubation', logo: '/logos/bharat-startup.png' },
  { id: 'e-cell', name: 'E-Cell', category: 'Ecosystem & Incubation', logo: '/logos/e-cell.png' },
];

// ── Clients & Partners (Slide 10) ──
export interface ClientPartner {
  name: string;
  logo: string;
  tier?: string;
}

export const CLIENT_PARTNERS: ClientPartner[] = [
  { name: 'Accenture', logo: '/logos/accenture.png' },
  { name: 'FedEx', logo: '/logos/fedex.png' },
  { name: 'ADP', logo: '/logos/adp.png' },
  { name: 'Adani Connex', logo: '/logos/adani-connex.png' },
  { name: 'Al Ansari International', logo: '/logos/al-ansari-international.png' },
  { name: 'Saudi Energy', logo: '/logos/saudi-energy.png' },
  { name: 'Focus Softnet', logo: '/logos/focus-softnet.png' },
  { name: 'Unifonic', logo: '/logos/unifonic.png' },
  { name: 'Waabi', logo: '/logos/waabi.png' },
  { name: 'AlayaCare', logo: '/logos/alayacare.png' },
  { name: 'Synthesia', logo: '/logos/synthesia.png' },
  { name: 'D&B Properties', logo: '/logos/d-amp-b-properties.png' },
  { name: 'Electra', logo: '/logos/electra.png' },
  { name: 'Skello', logo: '/logos/skello.png' },
  { name: 'BrioHR', logo: '/logos/briohr.png' },
  { name: 'CIEL HR', logo: '/logos/ciel-hr.png' },
  { name: 'Red String HR', logo: '/logos/red-string-hr.png' },
  { name: 'Pearl Constructions', logo: '/logos/pearl-constructions.png' },
  { name: 'Shopezy', logo: '/logos/shopezy.png' },
  { name: 'Intex', logo: '/logos/intex.png' },
  { name: 'MasterGrade', logo: '/logos/mastergrade.png' },
  { name: 'Xentrox', logo: '/logos/xentrox.png' },
  { name: 'Carrera Pictures', logo: '/logos/carrera-pictures.png' },
  { name: 'Good Mind', logo: '/logos/good-mind.png' },
];

export const CLIENT_DISCLAIMER =
  'Includes direct clients and partners reached through agencies, intermediaries and channel partners.';

// ── Collaborations Full Array (For /collaborate page) ──
export interface CollaborationItem {
  id: string;
  name: string;
  type: string;
  year: string;
  description: string;
  outcome: string;
  logo: string;
  image: string;
  featured: boolean;
}

export const COLLABORATIONS: CollaborationItem[] = [
  {
    id: 'hyderabad-super-league',
    name: 'Hyderabad Super League',
    type: 'Sports OS & League Partner',
    year: '2025–Present',
    description:
      'GWD is the exclusive IT and digital partner powering the entire grassroots tournament operating system, player passports, and live league standings.',
    outcome: '10 clubs actively running on platform · Real-time scoring and standings',
    logo: '/logos/hyderabad-super-league.png',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    featured: true,
  },
  {
    id: 'tgic-t-hub',
    name: 'T-Hub & TGIC',
    type: 'Innovation & Incubation Body',
    year: '2024–Present',
    description:
      'Government innovation bodies and startup ecosystem backing GWD build velocity, student entrepreneurship, and product incubation.',
    outcome: 'Incubation mentorship · Scaling support across Telangana',
    logo: '/logos/t-hub.png',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    featured: true,
  },
  {
    id: 'sreenidi-deccan-fc',
    name: 'Sreenidi Deccan FC',
    type: 'Football Academy Partner',
    year: '2025–Present',
    description:
      'Digital infrastructure partnership implementing academy management, attendance, and player development tracking.',
    outcome: 'Academy operations digitized',
    logo: '/logos/sreenidi-deccan-fc.png',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
    featured: true,
  },
  {
    id: 'edventure-park',
    name: 'Edventure Park',
    type: 'Startup Ecosystem Partner',
    year: '2024–Present',
    description:
      'Collaborative cohort acceleration supporting student startup founders and rapid prototyping sprints.',
    outcome: 'Student ventures incubated across cohorts',
    logo: '/logos/edventure-park.png',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    featured: true,
  },
  {
    id: 'mastergrade',
    name: 'MasterGrade',
    type: 'Sports Education Partner',
    year: '2025',
    description:
      'Integration of curriculum tracking and athlete skill progression into the GWD Sports management ecosystem.',
    outcome: 'Integrated skills evaluation framework',
    logo: '/logos/mastergrade.png',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    featured: false,
  },
];

// ── Disciplines (What We Do) ──
export const DISCIPLINES = [
  {
    index: '01',
    title: 'Technology & Platforms',
    desc: 'Engineering production web systems, platforms, and real-time tournament infrastructure that powers organizations across India and globally.',
    tags: ['Full-Stack Systems', 'Sports OS', 'Real-Time APIs', 'Cloud Architecture'],
    deliverables: 'Internal platforms, Grassroots sports software, developer tools, custom web architectures',
  },
  {
    index: '02',
    title: 'Design & Visual Systems',
    desc: 'Crafting brand identities, design systems, editorial layouts, and user experiences with uncompromising typographic and visual discipline.',
    tags: ['Design Systems', 'Design Tokens', 'Interaction Design', 'Brand Architecture'],
    deliverables: 'Brand guidelines, digital interfaces, interactive prototypes, design tokens',
  },
  {
    index: '03',
    title: 'Events & Hackathons',
    desc: 'Organizing national-scale hackathons, technical workshops, builder sprints, and creative showcases that gather hundreds of creators.',
    tags: ['Hackathons', 'Summits', 'Design Sprints', 'Technical Showcases'],
    deliverables: '48-hour sprints, live event production, campus gatherings, builder competitions',
  },
  {
    index: '04',
    title: 'Media & Storytelling',
    desc: 'Producing cinematic video, documentary captures, photography, and recaps that chronicle the builder journey from concept to shipped product.',
    tags: ['Cinematic Video', 'Recap Films', 'Editorial Stories', 'Live Photography'],
    deliverables: 'Short films, documentary captures, event recaps, builder interviews',
  },
];

// ── Strict 9-Slot Leadership Hierarchy (Slide 18) ──
export interface LeaderSlot {
  slot: number;
  id: string;
  name: string;
  role: string;
  photo?: string;
  hasCustomPhoto: boolean;
  bio: string;
  quote?: string;
  deliverables: string[];
  skills?: string[];
  socials?: Record<string, string>;
  projects?: string[];
  tier?: string;
}

export const NINE_LEADERS: LeaderSlot[] = [
  {
    slot: 1,
    id: 'president',
    name: 'Aldrin Paul',
    role: 'President',
    photo: '/team/president.jpg',
    hasCustomPhoto: true,
    bio: 'Leading GWD with a clear conviction: the highest-velocity learning happens when you stop theorizing and start shipping real work.',
    quote: 'Ideas are worthless until they are built and shipped.',
    deliverables: ['GWD Club Direction', 'Summit & Showcase Architecture', 'Builder Culture'],
  },
  {
    slot: 2,
    id: 'vice-president',
    name: 'Mohd Ismail',
    role: 'Vice President',
    hasCustomPhoto: false,
    bio: 'Drives operational discipline, sprint roadmaps, and cross-functional alignment across all collective divisions.',
    quote: 'Execution is the only currency that matters.',
    deliverables: ['Inter-departmental Execution', 'Operational Roadmaps', 'Sprint Governance'],
  },
  {
    slot: 3,
    id: 'general-secretary',
    name: 'Shravya',
    role: 'General Secretary',
    photo: '/team/general-secretary.jpg',
    hasCustomPhoto: true,
    bio: 'Coordinates club administration, member onboarding, internal governance, and transparent documentation.',
    quote: 'Clarity and operational rigor turn momentum into lasting impact.',
    deliverables: ['Member Governance', 'Administrative Systems', 'Executive Documentation'],
  },
  {
    slot: 4,
    id: 'technical-lead',
    name: 'Deekshit Katikaneni',
    role: 'Technical Lead',
    photo: '/team/technical-lead.png',
    hasCustomPhoto: true,
    bio: 'Architecting digital platforms, open-source systems, and production software. Mentoring technical builders to industry standards.',
    quote: 'Ship cleanly, architect for scale, and iterate fearlessly.',
    deliverables: ['Full-Stack Systems', 'Cloud & Architecture', 'GWD Digital Infrastructure'],
  },
  {
    slot: 5,
    id: 'creative-lead',
    name: 'Nishta Gaur',
    role: 'Creative Lead',
    hasCustomPhoto: false,
    bio: 'Directs visual systems, design tokens, brand identities, and editorial storytelling across all touchpoints.',
    quote: 'Design gives form, intention, and clarity to technology.',
    deliverables: ['Design Systems', 'Brand Guidelines', 'Interactive Interfaces'],
  },
  {
    slot: 6,
    id: 'marketing-lead',
    name: 'Anvita Reddy',
    role: 'Marketing Lead',
    hasCustomPhoto: false,
    bio: 'Amplifies GWD launches, builder campaigns, distribution networks, and digital storytelling across channels.',
    quote: 'Great products deserve distribution that matches their craft.',
    deliverables: ['Launch Distribution', 'Growth Campaigns', 'Community Reach'],
  },
  {
    slot: 7,
    id: 'event-management-lead',
    name: 'Bhavya Koduri',
    role: 'Event Management Lead',
    photo: '/team/event-management-lead.jpg',
    hasCustomPhoto: true,
    bio: 'Directs hackathons, summits, and campus showcases with seamless stage execution and attendee experience.',
    quote: 'Every interaction and stage moment shapes the collective memory.',
    deliverables: ['Hackathon Production', 'Summit Logistics', 'Live Event Operations'],
  },
  {
    slot: 8,
    id: 'pr-lead',
    name: 'Tuba Azeem',
    role: 'PR Lead',
    hasCustomPhoto: false,
    bio: 'Directs external relations, institutional liaison, corporate outreach, and media communications.',
    quote: 'Meaningful partnerships compound when built on mutual trust.',
    deliverables: ['Corporate Outreach', 'University Liaison', 'Media Communication'],
  },
  {
    slot: 9,
    id: 'visual-media-lead',
    name: 'Burhan Uddin',
    role: 'Visual Media Lead',
    hasCustomPhoto: false,
    bio: 'Captures the builder journey through cinematic photography, documentaries, live event recaps, and visual media.',
    quote: 'Document the struggle and the craft with unvarnished honesty.',
    deliverables: ['Cinematography', 'Live Photography', 'Documentary Films'],
  },
];

// ── Team Hierarchy Export (For /team page) ──
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  skills: string[];
  quote?: string;
  socials: Record<string, string>;
  projects: string[];
  hasPhoto?: boolean;
}

export interface TeamLevel {
  level: string;
  members: TeamMember[];
}

export const TEAM_HIERARCHY: TeamLevel[] = [
  {
    level: 'Leadership',
    members: [
      {
        id: 'president',
        name: 'Aldrin Paul',
        role: 'President',
        bio: 'Leading GWD with a clear conviction: the highest-velocity learning happens when you stop theorizing and start shipping real work.',
        image: '/team/president.jpg',
        skills: ['Club Leadership', 'Showcase Architecture', 'Builder Culture'],
        quote: 'Ideas are worthless until they are built and shipped.',
        socials: { linkedin: '#', twitter: '#' },
        projects: ['gwd-sports-os', 'global-enterprise-delivery'],
        hasPhoto: true,
      },
      {
        id: 'vice-president',
        name: 'Mohd Ismail',
        role: 'Vice President',
        bio: 'Drives operational discipline, sprint roadmaps, and cross-functional alignment across all collective divisions.',
        image: '/team/president.jpg',
        skills: ['Operations', 'Sprint Governance', 'Execution'],
        quote: 'Execution is the only currency that matters.',
        socials: { linkedin: '#' },
        projects: ['next-bridge-platform'],
        hasPhoto: false,
      },
    ],
  },
  {
    level: 'Senior Leads',
    members: [
      {
        id: 'general-secretary',
        name: 'Shravya',
        role: 'General Secretary',
        bio: 'Coordinates club administration, member onboarding, internal governance, and transparent documentation.',
        image: '/team/general-secretary.jpg',
        skills: ['Administration', 'Governance', 'Operations'],
        quote: 'Clarity and operational rigor turn momentum into lasting impact.',
        socials: { linkedin: '#' },
        projects: ['gwd-sports-os'],
        hasPhoto: true,
      },
      {
        id: 'technical-lead',
        name: 'Deekshit Katikaneni',
        role: 'Technical Lead',
        bio: 'Architecting digital platforms, open-source systems, and production software. Mentoring technical builders to industry standards.',
        image: '/team/technical-lead.png',
        skills: ['Full-Stack Systems', 'Sports OS', 'Cloud Architecture'],
        quote: 'Ship cleanly, architect for scale, and iterate fearlessly.',
        socials: { github: '#', linkedin: '#' },
        projects: ['gwd-sports-os', 'next-bridge-platform'],
        hasPhoto: true,
      },
      {
        id: 'creative-lead',
        name: 'Nishta Gaur',
        role: 'Creative Lead',
        bio: 'Directs visual systems, design tokens, brand identities, and editorial storytelling across all touchpoints.',
        image: '/team/president.jpg',
        skills: ['Design Systems', 'Brand Identity', 'Editorial Design'],
        quote: 'Design gives form, intention, and clarity to technology.',
        socials: { linkedin: '#' },
        projects: ['torqio-automotive'],
        hasPhoto: false,
      },
    ],
  },
  {
    level: 'Divisional Leads',
    members: [
      {
        id: 'marketing-lead',
        name: 'Anvita Reddy',
        role: 'Marketing Lead',
        bio: 'Amplifies GWD launches, builder campaigns, distribution networks, and digital storytelling across channels.',
        image: '/team/president.jpg',
        skills: ['Launch Distribution', 'Growth Campaigns', 'Storytelling'],
        socials: { instagram: '#', linkedin: '#' },
        projects: ['global-enterprise-delivery'],
        hasPhoto: false,
      },
      {
        id: 'event-management-lead',
        name: 'Bhavya Koduri',
        role: 'Event Management Lead',
        bio: 'Directs hackathons, summits, and campus showcases with seamless stage execution and attendee experience.',
        image: '/team/event-management-lead.jpg',
        skills: ['Event Production', 'Summit Logistics', 'Stage Management'],
        quote: 'Every interaction and stage moment shapes the collective memory.',
        socials: { linkedin: '#' },
        projects: ['gwd-sports-os'],
        hasPhoto: true,
      },
      {
        id: 'pr-lead',
        name: 'Tuba Azeem',
        role: 'PR Lead',
        bio: 'Directs external relations, institutional liaison, corporate outreach, and media communications.',
        image: '/team/president.jpg',
        skills: ['Corporate Outreach', 'University Liaison', 'PR'],
        quote: 'Meaningful partnerships compound when built on mutual trust.',
        socials: { linkedin: '#' },
        projects: ['gwd-sports-os'],
        hasPhoto: false,
      },
      {
        id: 'visual-media-lead',
        name: 'Burhan Uddin',
        role: 'Visual Media Lead',
        bio: 'Captures the builder journey through cinematic photography, documentaries, live event recaps, and visual media.',
        image: '/team/president.jpg',
        skills: ['Cinematography', 'Live Photography', 'Documentary'],
        quote: 'Document the struggle and the craft with unvarnished honesty.',
        socials: { instagram: '#' },
        projects: ['global-enterprise-delivery'],
        hasPhoto: false,
      },
    ],
  },
];

// ── Founders & Advisory (Slide 18) ──
export const FOUNDERS = [
  {
    name: 'Abdul Mudabbir',
    role: 'Founder & Club Director',
    org: 'GWD Club & GWD Global (COO & CMO)',
    bio: 'Directing GWD ecosystem operations, institutional alliances, and creative strategy.',
    responsibilities: ['Ecosystem Direction', 'Agency Partnerships', 'Brand Growth'],
  },
  {
    name: 'Rahman Pasha',
    role: 'Founder',
    org: 'GWD Global (Co-Founder & CEO)',
    bio: 'Leading enterprise software delivery, commercial agreements, and global client pipelines.',
    responsibilities: ['Corporate Leadership', 'Commercial Delivery', 'Global Expansion'],
  },
  {
    name: 'Moin',
    role: 'Founder',
    org: 'GWD Global (Chief Product Officer)',
    bio: 'Driving product architecture, user research, and technical roadmaps across proprietary ventures.',
    responsibilities: ['Product Strategy', 'Venture Architecture', 'Engineering Governance'],
  },
];

// ── GWD Global Pvt Ltd Executive Core (Slide 16) ──
export const EXECUTIVES = [
  { name: 'Mohd Abdul Rahman Pasha', role: 'Co-Founder & Chief Executive Officer' },
  { name: 'Mohammed Abdul Mudabbir', role: 'Co-Founder · Chief Operating Officer & Chief Marketing Officer' },
  { name: 'Mohammed Moin', role: 'Chief Product Officer' },
  { name: 'Ashish Goutham', role: 'Chief Technology Officer' },
  { name: 'Afnan Munwar', role: 'Sales & BD Lead' },
  { name: 'Oliver Joshua', role: 'Marketing Lead' },
  { name: 'Akhil', role: 'People & Culture Lead' },
  { name: 'Deekshit', role: 'Development Lead' },
  { name: 'Aldrin Paul', role: 'Event Lead' },
  { name: 'Yuvraj', role: 'Production Lead' },
];

export const CORE_TEAM_NAMES = EXECUTIVES.map((e) => e.name);

// ── Past & Major Projects (Work Archive) ──
export interface ProjectItem {
  id: string;
  title: string;
  year: string;
  category: string;
  shortDescription: string;
  description: string;
  outcome: string;
  heroImage: string;
  beforeImage?: string;
  afterImage?: string;
  images: string[];
  tags: string[];
  collaborators?: string[];
  partners?: string[];
  link?: string;
  featured?: boolean;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'gwd-sports-os',
    title: 'GWD Sports Tournament & Academy OS',
    year: '2025',
    category: 'Digital Infrastructure',
    shortDescription:
      'The first end-to-end digital simulation and operational platform for grassroots sports in India, powering the Hyderabad Super League.',
    description:
      'We are the IT and digital partner behind Hyderabad Super League, Sreenidi Deccan FC, Hyderabad Little Stars, and MasterGrade. Built from scratch by GWD, the system handles player registration, player passports, attendance, fee collection, live standings, and tournament operation across 10 clubs in one unified real-time system.',
    outcome: '₹1.25L Current MRR · 10 Active Football Clubs · 1 Live League',
    heroImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
      'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80',
    ],
    tags: ['Sports OS', 'Tournament Management', 'Real-Time Standings', 'Next.js & Cloud'],
    collaborators: ['Hyderabad Super League', 'Sreenidi Deccan FC', 'MasterGrade'],
    partners: ['Hyderabad Super League', 'Sreenidi Deccan FC', 'MasterGrade'],
    link: '#',
    featured: true,
  },
  {
    id: 'next-bridge-platform',
    title: 'Next Bridge Property Management',
    year: '2025-2026',
    category: 'Enterprise Platform',
    shortDescription:
      'Comprehensive property management platform unifying facilities, tenant operations, and asset maintenance.',
    description:
      'Developed to bridge property managers and enterprise tenants, Next Bridge streamlines billing, work order dispatch, and tenant self-service with real-time operational transparency.',
    outcome: 'Commercial Launch scheduled for 2026',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80',
    ],
    tags: ['Property Tech', 'Enterprise Workflows', 'Tenant Portal'],
    collaborators: ['Real Estate Partners in Hyderabad & Dubai'],
    partners: ['Real Estate Partners in Hyderabad & Dubai'],
    link: '#',
    featured: true,
  },
  {
    id: 'torqio-automotive',
    title: 'Torqio Automotive Marketplace',
    year: '2025',
    category: 'Digital Marketplace',
    shortDescription:
      'Modern digital automotive marketplace engineered for verified vehicle trade, inspections, and enthusiast builds.',
    description:
      'Torqio integrates vehicle provenance tracking with digital inspection workflows, creating a trustworthy marketplace for automobile buyers, sellers, and specialized tuners.',
    outcome: 'In Design · Q3 Target Build',
    heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80',
    ],
    tags: ['Automotive', 'Marketplace', 'Inspection Verification'],
    collaborators: ['Automotive Networks'],
    partners: ['Automotive Networks'],
    link: '#',
    featured: false,
  },
  {
    id: 'global-enterprise-delivery',
    title: 'Global Enterprise Engineering Delivery',
    year: '2024-2025',
    category: 'Software Engineering',
    shortDescription:
      '230+ projects delivered for clients and partners across 10 countries and 3 continents.',
    description:
      'GWD engineers and designers have shipped over 230 client deliverables spanning North America, Europe, the Middle East, and Asia. Delivering high-performance interfaces, backend APIs, and design systems for enterprise and growth-stage brands.',
    outcome: '230+ Projects Delivered · 10 Countries · ₹1.78 Cr Revenue Booked',
    heroImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1400&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    ],
    tags: ['Global Delivery', 'Enterprise Software', 'Design Systems'],
    collaborators: ['Direct & Intermediary Enterprise Clients'],
    partners: ['Direct & Intermediary Enterprise Clients'],
    link: '#',
    featured: true,
  },
];

// ── Timeline & Milestones (Slide 1: "It started as a student idea") ──
export interface Milestone {
  date: string;
  year: string;
  title: string;
  description: string;
  highlighted?: boolean;
  achievement: string;
  image: string;
}

export const TIMELINE: Milestone[] = [
  {
    date: 'Mar 2024',
    year: '2024',
    title: 'A student initiative begins',
    description: 'A freelance collective connecting young talent with paid client work.',
    achievement: 'Inception at VJIT Campus',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
  },
  {
    date: 'Dec 2024',
    year: '2024',
    title: 'Recognised in year one',
    description: 'Top 500 Upcoming Startups of Asia and Top 25 of India, by E-Cell Bombay.',
    achievement: 'National Recognition',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
  },
  {
    date: 'Jun 2025',
    year: '2025',
    title: 'Officially incorporated',
    description: 'GWD Global Pvt. Ltd., registered with the MCA on 12 June. Office in Madhapur.',
    achievement: 'CIN Registered Entity',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
  },
  {
    date: '2025',
    year: '2025',
    title: 'GWD Club launches at VJIT',
    description: "The biggest club inauguration in VJIT's 25-year history.",
    achievement: '650+ Active Network',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80',
  },
  {
    date: '2026',
    year: '2026',
    title: 'GWD Sports goes live',
    description: 'Our first product line, and a company now working across 10 countries.',
    highlighted: true,
    achievement: 'Hyderabad Super League Live',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
  },
];

// ── Events (Separated into Upcoming and Past) ──
export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  shortDescription: string;
  description: string;
  image: string;
  category: string;
  venue?: string;
  registrationOpen?: boolean;
  registrationStatus?: 'Registration Open' | 'Registration Closed' | 'Registration Full' | 'Registration Not Open';
  registrationDeadline?: string;
  status?: 'Published' | 'Draft' | 'Completed' | 'Archived';
  featured?: boolean;
  capacity?: number;
  year?: string;
  results?: string;
  highlights?: string[];
  schedule?: { time: string; title: string; description: string }[];
  faq?: { question: string; answer: string }[];
  collaborators?: string[];
  speakers?: { name: string; role: string; company?: string; avatar?: string; topic?: string }[];
  gallery?: string[];
  eligibility?: string;
  instructions?: string[];
  seo?: {
    title?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}

export const UPCOMING_EVENTS: EventItem[] = [
  {
    id: 'gwd-vjit-builder-sprint-2025',
    title: 'GWD Builder Sprint & Showcase',
    date: '2025-11-22',
    time: '09:30 AM — 05:30 PM IST',
    location: 'Auditorium, VJIT Campus, Hyderabad',
    venue: 'VJIT Campus, Hyderabad',
    shortDescription:
      'A hands-on builder sprint where student teams build and demo live software, brand prototypes, and creative media.',
    description:
      'The premier builder showcase for GWD Club at VJIT. Students collaborate across technology, creative design, marketing, and video media to build real prototypes guided by GWD leads and founders.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&q=80',
    registrationOpen: true,
    featured: true,
    category: 'Hackathon & Sprint',
    capacity: 150,
    schedule: [
      { time: '09:30', title: 'Check-In & Team Formation', description: 'Briefing, prompt reveal, and mentor assignments' },
      { time: '10:30', title: 'Sprint Kickoff', description: 'Intensive building across tech, design, and media tracks' },
      { time: '01:00', title: 'Mid-Sprint Review', description: 'Critique and architecture check with GWD leads' },
      { time: '04:00', title: 'Final Demos & Ship', description: 'Live 3-minute project demos to judges and audience' },
      { time: '05:00', title: 'Awards & Onboarding', description: 'Top projects recognized and invited into core GWD tracks' },
    ],
    faq: [
      { question: 'Who can register?', answer: 'Open to all students interested in technology, design, events, or media.' },
      { question: 'Do I need a team?', answer: 'You can register individually or as a team of up to 4 members.' },
      { question: 'Is there any fee?', answer: 'No registration fee. Participation is completely free.' },
    ],
    collaborators: ['GWD Club VJIT', 'GWD Global'],
  },
  {
    id: 'gwd-sports-demo-day',
    title: 'GWD Sports League Demo Day',
    date: '2025-12-10',
    time: '10:00 AM — 04:00 PM IST',
    location: 'Hyderabad Super League Arena / Virtual Stream',
    venue: 'Hyderabad Super League Arena',
    shortDescription:
      'Live demonstration of the GWD Sports Tournament Operating System with football club managers and sports tech partners.',
    description:
      'Showcasing real-time player passports, automated fixture management, fee processing, and live referee scoring for the 10 Hyderabad football clubs running on GWD infrastructure.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80',
    registrationOpen: true,
    featured: false,
    category: 'Showcase',
    capacity: 100,
    schedule: [
      { time: '10:00', title: 'Keynote: Grassroots Sports OS', description: 'The technology architecture behind GWD Sports' },
      { time: '11:30', title: 'Live Tournament Simulation', description: 'Real-time player tracking and live standings demo' },
      { time: '02:00', title: 'Club Manager Roundtable', description: 'Feedback from Hyderabad Super League club directors' },
    ],
    faq: [
      { question: 'Can sport academies participate?', answer: 'Yes, sports directors and club academies can request onboarding demos.' },
    ],
    collaborators: ['Hyderabad Super League', 'Sreenidi Deccan FC'],
  },
];

export const PAST_EVENTS: EventItem[] = [
  {
    id: 'gwd-orientation-2025',
    title: 'GWD Global Orientation 2025',
    date: '2025-06-18',
    time: '10:00 AM — 01:00 PM IST',
    location: 'Madhapur HQ & Virtual Stream',
    venue: 'Madhapur, Hyderabad',
    shortDescription:
      'Official orientation announcing GWD Global Pvt. Ltd. incorporation, group ventures, and the VJIT club roadmap.',
    description:
      'Founders Abdul Mudabbir, Rahman Pasha, and Moin presented the GWD trajectory from a March 2024 student idea to a registered corporation with ₹1.78 Cr revenue, 650+ builders, and 10 countries.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1400&q=80',
    category: 'Orientation',
    year: '2025',
    results: '200+ attendees · Incorporation unveil · Sports OS rollout',
    highlights: ['Incorporation announcement', 'Sports OS live demo', 'Top 25 Creative Startups recognition'],
  },
  {
    id: 'hyderabad-super-league-kickoff',
    title: 'Hyderabad Super League 2025 Kickoff',
    date: '2025-04-12',
    time: '04:00 PM — 09:00 PM IST',
    location: 'Gachibowli Sports Complex, Hyderabad',
    venue: 'Gachibowli Sports Complex',
    shortDescription:
      'Tournament launch powering 10 grassroots football clubs on the GWD Sports management platform.',
    description:
      'Launch of India’s first connected grassroots football tournament system. All 10 clubs adopted GWD player passports, digitized registrations, and live automated standings.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1400&q=80',
    category: 'Tournament Launch',
    year: '2025',
    results: '10 Clubs Onboarded · 250+ Player Passports Created · Zero Paper Scorekeeping',
    highlights: ['10 clubs live', 'Player digital IDs', 'Real-time standings'],
  },
];

// ── Gallery Images (For /gallery page) ──
export interface GalleryImage {
  id?: string;
  src: string;
  caption: string;
  category: string;
  featured?: boolean;
}

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'gwd-img-conv',
    src: '/img/visit-conversation.jpg',
    caption: 'Student builder leads conducting tactical briefing and strategy on the turf',
    category: 'community',
    featured: true,
  },
  {
    id: 'gwd-img-match',
    src: '/img/visit-match.jpg',
    caption: 'Competitive grassroots football match powered by GWD Sports digital management system',
    category: 'sports',
    featured: true,
  },
  {
    id: 'gwd-img-team',
    src: '/img/visit-team.jpg',
    caption: 'Cross-functional student collective collaborating under tournament operations canopy',
    category: 'community',
    featured: true,
  },
  {
    id: 'gwd-img-train',
    src: '/img/visit-training.jpg',
    caption: 'Athlete lineup and squad coordination through verified digital player passports',
    category: 'sports',
    featured: true,
  },
  {
    id: 'gwd-img-work',
    src: '/img/visit-workstation.jpg',
    caption: 'Live event operations desk running real-time tournament scoring and field telemetry',
    category: 'projects',
    featured: true,
  },
  {
    id: 'gwd-img-bts',
    src: '/img/visit-behind-scenes.jpg',
    caption: 'Field infrastructure, sound engineering, and ground logistics deployed by GWD leads',
    category: 'events',
    featured: true,
  },
  {
    id: 'gwd-img-vjit',
    src: '/img/img2.jpg',
    caption: 'Landmark GWD Club inauguration and student assembly at VJIT Campus',
    category: 'events',
    featured: true,
  },
  {
    id: 'gwd-img-sprint',
    src: '/img/img3.jpg',
    caption: 'Intensive builder sprint and prototype testing session with student teams',
    category: 'projects',
    featured: false,
  },
  {
    id: 'gwd-img-demo',
    src: '/img/img4.jpg',
    caption: 'Product showcase and live system demonstration at campus auditorium',
    category: 'events',
    featured: false,
  },
  {
    id: 'gwd-img-vjit-official',
    src: '/img/vjit-inauguration.jpg',
    caption: '🌟 Successful Inauguration of GWD Club — Empowering Future Freelancers & Entrepreneurs at VJIT!',
    category: 'events',
    featured: true,
  },
  {
    id: 'gwd-img-community-banner',
    src: '/img/gwd-community-banner.jpeg',
    caption: 'GWD Club student builder community and orientation assembly',
    category: 'community',
    featured: true,
  },
  {
    id: 'gwd-img-leads',
    src: '/img/img1.jpg',
    caption: 'GWD student leadership team and department directors',
    category: 'community',
    featured: false,
  },
];

// ── Why Join & FAQ (For /join page) ──
export const WHY_JOIN = [
  {
    title: 'Ship Real Production Work',
    description: 'We don’t do simulated coursework. You will build and deploy platforms, brand systems, and live operations that real clients and thousands of users depend on.',
  },
  {
    title: 'Cross-Disciplinary Velocity',
    description: 'Work alongside software architects, visual designers, event directors, and cinematographers in tight, synchronized build cycles.',
  },
  {
    title: 'Global Delivery Network',
    description: 'Connect into GWD’s 650+ builder network operating across 10 countries spanning North America, Europe, the Middle East, and Asia.',
  },
  {
    title: 'Clear Leadership & Mentorship',
    description: 'Direct mentorship from founders and lead builders who navigated the journey from a March 2024 campus idea to an incorporated enterprise.',
  },
];

export const JOIN_FAQ = [
  {
    question: 'Who is eligible to join GWD Club?',
    answer: 'Students from any department or year at VJIT and affiliated institutions who are dedicated to shipping real work in technology, design, events, marketing, PR, or media.',
  },
  {
    question: 'Do I need prior experience?',
    answer: 'We value hunger, curiosity, and consistency over extensive resumes. If you show up, take feedback, and iterate fearlessly, you will thrive here.',
  },
  {
    question: 'What is the commitment expectation?',
    answer: 'Expect dedicated sprint hours per week depending on active initiatives, project deliverables, or upcoming event timelines.',
  },
  {
    question: 'How does the application process work?',
    answer: 'Submit the application form below. Our divisional leads review answers weekly, followed by a short conversation and practical trial sprint.',
  },
];

// ── Application Disciplines for /join ──
export const JOIN_DISCIPLINES = [
  { id: 'tech', label: 'Technology', desc: 'Full-stack software, mobile apps, DevOps, sports infrastructure' },
  { id: 'design', label: 'Design & Visuals', desc: 'UI/UX interfaces, design systems, editorial layouts, 3D' },
  { id: 'events', label: 'Event Management', desc: 'Hackathon production, summit coordination, campus logistics' },
  { id: 'marketing', label: 'Marketing & Growth', desc: 'Campaign distribution, social growth, builder storytelling' },
  { id: 'pr', label: 'Public Relations', desc: 'Corporate partnerships, university liaison, outreach' },
  { id: 'media', label: 'Visual Media', desc: 'Cinematography, documentary filming, live photography, editing' },
];
