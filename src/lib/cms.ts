/**
 * GWD — Central Content Management System (CMS) Data Layer
 * Single Source of Truth for both Public Website and Admin Control Center.
 * Initialized with verified records from content.ts and gwd-club-general-meeting.html
 */

import {
  CLUB,
  STATS,
  NINE_LEADERS,
  PROJECTS,
  UPCOMING_EVENTS,
  PAST_EVENTS,
  COLLABORATIONS,
  TIMELINE,
  GALLERY_IMAGES,
  ProjectItem,
  EventItem,
  LeaderSlot,
  CollaborationItem,
  Milestone,
  GalleryImage,
} from '@/data/content';

export interface DomainMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  bio: string;
  skills: string[];
  deliverables: string[];
  projects: string[];
  socials?: Record<string, string>;
  active?: boolean;
}

export interface DomainItem {
  id: string;
  name: string;
  code: string;
  iconName: string;
  shortDesc: string;
  fullDesc: string;
  leadId: string;
  leadName: string;
  leadRole: string;
  leadPhoto: string;
  leadBio: string;
  leadQuote?: string;
  memberCount: number;
  members: DomainMember[];
  projects: string[];
  deliverables: string[];
  color: string;
  status: 'Published' | 'Draft';
  order: number;
}

export interface HomepageCmsData {
  hero: {
    headline: string;
    subheadline: string;
    tagline: string;
    badge: string;
    videoUrl: string;
    fallbackVideoUrl: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
  };
  intro: {
    label: string;
    headline: string;
    leadStory: string;
    studentIdeaTitle: string;
    studentIdeaBody: string;
    threeArmsTitle: string;
    threeArmsSub: string;
  };
  featuredDomainIds: string[];
  featuredProjectIds: string[];
  featuredEventId: string;
  leadershipHighlightId: string;
  featuredCollaborationId: string;
  stats: {
    label: string;
    value: number;
    suffix: string;
    prefix?: string;
    desc: string;
  }[];
  finalCta: {
    tag: string;
    headline: string;
    highlightWord: string;
    subtitle: string;
    primaryText: string;
    primaryHref: string;
    secondaryText: string;
    secondaryHref: string;
  };
  footer: {
    tagline: string;
    address: string;
    inception: string;
    email: string;
    phone: string;
    cin: string;
    gstin: string;
  };
}

export interface RegistrationRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  message?: string;
  registeredAt: string;
  attendance: boolean;
}

export interface ApplicationRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  domain: string;
  why: string;
  portfolio: string;
  status: 'New' | 'Reviewing' | 'Shortlisted' | 'Accepted' | 'Rejected' | 'Archived';
  appliedAt: string;
  notes?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
  status: 'New' | 'Opened' | 'In Progress' | 'Resolved' | 'Archived';
}

// ── Connect & Institutional Partnership Types ──
export type ConnectRequestType =
  | 'bring_to_college'
  | 'collaborate'
  | 'host_event'
  | 'community_partnership'
  | 'invite_gwd';

export const CONNECT_REQUEST_TYPE_LABELS: Record<
  ConnectRequestType,
  { title: string; subtitle: string; icon: string; category: string }
> = {
  bring_to_college: {
    title: 'Bring GWD to Your College',
    subtitle: 'Campus tech sprints, hackathons, hands-on masterclasses & developer bootcamps.',
    icon: '🏛️',
    category: 'University & Campus Programs',
  },
  collaborate: {
    title: 'Collaborate With GWD',
    subtitle: 'Co-build production platforms, open-source initiatives & industry-aligned tech ventures.',
    icon: '🤝',
    category: 'Platform & Technical Ventures',
  },
  host_event: {
    title: 'Host an Event',
    subtitle: 'Partner with GWD to host flagship hackathons, sports leagues, demo days & pitch arenas.',
    icon: '⚡',
    category: 'Showcases & Tournaments',
  },
  community_partnership: {
    title: 'Community / Club Partnership',
    subtitle: 'Bilateral alliances with student tech clubs, builder communities & developer chapters.',
    icon: '🌐',
    category: 'Ecosystem & Club Alliances',
  },
  invite_gwd: {
    title: 'Invite GWD',
    subtitle: 'Invite GWD tech architects, design leads or founders as keynote speakers, panel experts or jury.',
    icon: '🎙️',
    category: 'Keynotes, Panels & Jury',
  },
};

export type ConnectRequestStatus =
  | 'New'
  | 'Reviewing'
  | 'Contacted'
  | 'In Discussion'
  | 'Approved'
  | 'Completed'
  | 'Declined'
  | 'Archived';

export interface FollowUpLogItem {
  id: string;
  timestamp: string;
  author: string;
  action: string;
  notes: string;
  nextFollowUpDate?: string;
}

export interface ConnectRequestRecord {
  id: string; // e.g. REQ-2026-8101
  createdAt: string;
  updatedAt: string;
  requestType: ConnectRequestType;
  status: ConnectRequestStatus;
  assignedPoc?: string; // Internal GWD POC
  internalNotes?: string;
  followUpLogs: FollowUpLogItem[];

  // Requester profile
  fullName: string;
  roleDesignation: string;
  email: string;
  phone: string;
  requesterType:
    | 'Student Council / Lead'
    | 'Faculty / Dept Head'
    | 'Club President / Lead'
    | 'Community Founder'
    | 'Industry / Corporate Partner'
    | 'Other';

  // Institution / Community representation
  institutionName: string;
  institutionWebsite?: string;
  city: string;
  state: string;
  country: string;
  existingCommunityInfo?: string;

  // Event / Collaboration specifications (Progressively Disclosed)
  proposedEventName?: string;
  eventDescription?: string;
  expectedAudienceSize?: string;
  preferredDate?: string;
  alternativeDate?: string;
  format?: 'Offline / On-Campus' | 'Virtual / Remote' | 'Hybrid';
  venue?: string;
  facilitiesAvailable?: string;
  requestedFromGwd?: string;
  budgetSponsorship?: string;
  socialLinks?: string;
  additionalMessage?: string;
}

export interface PartnershipLeadContact {
  name: string;
  role: string;
  email: string;
  phone: string;
  deskLocation: string;
  responseWindow: string;
  telegramOrWhatsapp?: string;
}

export interface PageSeoRecord {
  pageKey: string;
  pageTitle: string;
  seoTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export type EventRegistrationState =
  | 'Registration Open'
  | 'Registration Closed'
  | 'Registration Full'
  | 'Registration Not Open';

export function getEventRegistrationState(
  event: EventItem,
  registrationsCount: number = 0
): EventRegistrationState {
  if (event.status === 'Draft' || event.registrationStatus === 'Registration Not Open') {
    return 'Registration Not Open';
  }
  if (typeof event.capacity === 'number' && event.capacity > 0 && registrationsCount >= event.capacity) {
    return 'Registration Full';
  }
  if (event.registrationDeadline) {
    const deadlineTime = new Date(event.registrationDeadline).getTime();
    if (!isNaN(deadlineTime) && deadlineTime < Date.now()) {
      return 'Registration Closed';
    }
  }
  if (event.registrationOpen === false || event.registrationStatus === 'Registration Closed') {
    return 'Registration Closed';
  }
  return 'Registration Open';
}

export interface SiteSettings {
  clubName: string;
  companyName: string;
  hq: string;
  cin: string;
  gstin: string;
  email: string;
  phone: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  github: string;
  dyeWhorlEnabled: boolean;
  dyeWhorlIntensity?: 'subtle' | 'normal' | 'vivid';
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  footerTagline: string;
  footerAddress: string;
  footerInception: string;
  partnershipLead?: PartnershipLeadContact;
  seoPages?: Record<string, PageSeoRecord>;
}

export interface MediaRecord {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video' | 'document';
  category: 'work' | 'events' | 'team' | 'domains' | 'gallery' | 'collaborations' | 'timeline' | 'homepage';
  size?: string;
  uploadedAt: string;
  dimensions?: string;
  tags: string[];
}

export interface WorkflowStepItem {
  id?: string;
  stepNumber: string;
  phase: string;
  title: string;
  duration: string;
  summary: string;
  deliverables: string[] | string;
  status: 'Published' | 'Draft';
  order?: number;
}

export interface AuditLogRecord {
  id: string;
  action: string;
  targetType?: string;
  targetId?: string;
  target?: string;
  user?: string;
  actor?: string;
  timestamp: string;
  details: string;
  status: 'success' | 'warning' | 'info' | 'SUCCESS' | 'PENDING' | 'BLOCKED';
}

export interface GwdCmsStore {
  homepage: HomepageCmsData;
  domains: DomainItem[];
  leaders: LeaderSlot[];
  projects: ProjectItem[];
  upcomingEvents: EventItem[];
  pastEvents: EventItem[];
  collaborations: CollaborationItem[];
  timeline: Milestone[];
  gallery: GalleryImage[];
  registrations: RegistrationRecord[];
  applications: ApplicationRecord[];
  messages: ContactMessage[];
  connectRequests: ConnectRequestRecord[];
  media: MediaRecord[];
  workflow: WorkflowStepItem[];
  auditLogs: AuditLogRecord[];
  settings: SiteSettings;
  lastUpdated: string;
}

// ── Verified Seed Domains from gwd-club-general-meeting.html ──
export const SEED_DOMAINS: DomainItem[] = [
  {
    id: 'technical',
    name: 'Technical',
    code: 'TECH',
    iconName: 'code',
    color: '#E53E3E',
    shortDesc: 'Tech builds, internal platforms, sports OS, and technical workshops.',
    fullDesc:
      'The engineering arm of GWD. We architect production web platforms, real-time sports tournament engines, and developer infrastructure. From full-stack Next.js systems to cloud databases, we build for high-velocity deployment.',
    leadId: 'technical-lead',
    leadName: 'Deekshit Katikaneni',
    leadRole: 'Technical Lead',
    leadPhoto: '/team/technical-lead.png',
    leadBio:
      'Architecting digital platforms, open-source systems, and production software. Mentoring technical builders to industry standards.',
    leadQuote: 'Ship cleanly, architect for scale, and iterate fearlessly.',
    memberCount: 8,
    members: [
      {
        id: 'tech-1',
        name: 'Deekshit Katikaneni',
        role: 'Technical Lead & System Architect',
        photo: '/team/technical-lead.png',
        bio: 'Oversees software architecture, platform performance, and engineering standards across all GWD web and sports systems.',
        skills: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Cloud Infrastructure'],
        deliverables: ['GWD Sports OS', 'Next Bridge Architecture', 'Digital Infrastructure'],
        projects: ['gwd-sports-os', 'next-bridge-platform'],
        active: true,
      },
      {
        id: 'tech-2',
        name: 'Ashish Goutham',
        role: 'Senior Full-Stack Engineer',
        photo: '/team/president.jpg',
        bio: 'Core builder on live APIs, tournament simulation logic, and database schemas.',
        skills: ['React', 'PostgreSQL', 'Docker', 'Redis'],
        deliverables: ['Tournament Fixture Engine', 'Real-Time Standings API'],
        projects: ['gwd-sports-os'],
        active: true,
      },
      {
        id: 'tech-3',
        name: 'Rahul Varma',
        role: 'Frontend Engineer',
        photo: '/team/president.jpg',
        bio: 'Specializes in responsive web components, state management, and modern fluid animations.',
        skills: ['TypeScript', 'Tailwind', 'CSS Architecture'],
        deliverables: ['Player Passports UI', 'Admin Tables'],
        projects: ['gwd-sports-os'],
        active: true,
      },
      {
        id: 'tech-4',
        name: 'Praneeth Rao',
        role: 'Backend & DevOps Associate',
        photo: '/team/president.jpg',
        bio: 'Maintains deployment pipelines, server monitoring, and secure registration APIs.',
        skills: ['Docker', 'Supabase', 'CI/CD Pipelines'],
        deliverables: ['Serverless Auth', 'Database Migrations'],
        projects: ['next-bridge-platform'],
        active: true,
      },
    ],
    projects: ['gwd-sports-os', 'next-bridge-platform', 'global-enterprise-delivery'],
    deliverables: ['Full-stack web applications', 'Real-time APIs', 'Developer workshops', 'Cloud setups'],
    status: 'Published',
    order: 1,
  },
  {
    id: 'creative',
    name: 'Creative',
    code: 'DSGN',
    iconName: 'palette',
    color: '#DD6B20',
    shortDesc: "Design, posters, and the club's visual identity across touchpoints.",
    fullDesc:
      'The visual and aesthetic spine of GWD. We craft brand identities, design systems, editorial layouts, poster typography, and interactive digital interfaces with uncompromising discipline.',
    leadId: 'creative-lead',
    leadName: 'Nishta Gaur',
    leadRole: 'Creative Lead',
    leadPhoto: '/team/president.jpg',
    leadBio:
      'Directs visual systems, design tokens, brand identities, and editorial storytelling across all touchpoints.',
    leadQuote: 'Design gives form, intention, and clarity to technology.',
    memberCount: 6,
    members: [
      {
        id: 'creative-1',
        name: 'Nishta Gaur',
        role: 'Creative Lead & Brand Director',
        photo: '/team/president.jpg',
        bio: 'Leads visual design guidelines, brand architecture, and typographic hierarchy for GWD projects.',
        skills: ['Figma', 'Brand Systems', 'Typography', 'Visual Design'],
        deliverables: ['GWD Brand Guidelines', 'Summit Posters', 'Editorial Systems'],
        projects: ['torqio-automotive', 'gwd-sports-os'],
        active: true,
      },
      {
        id: 'creative-2',
        name: 'Sneha Reddy',
        role: 'UI/UX Designer',
        photo: '/team/president.jpg',
        bio: 'Designs intuitive mobile and desktop workflows for sports managers and student builders.',
        skills: ['UI/UX', 'Wireframing', 'Prototyping', 'Design Systems'],
        deliverables: ['Sports OS Mobile Wireframes', 'Registration Flow'],
        projects: ['gwd-sports-os'],
        active: true,
      },
      {
        id: 'creative-3',
        name: 'Kavya Nair',
        role: 'Graphic & Poster Designer',
        photo: '/team/president.jpg',
        bio: 'Creates event campaign visuals, club banners, and typographic presentation decks.',
        skills: ['Illustrator', 'Photoshop', 'Typography'],
        deliverables: ['Builder Sprint Visual Identity', 'Orientation Presentation'],
        projects: ['global-enterprise-delivery'],
        active: true,
      },
    ],
    projects: ['torqio-automotive', 'gwd-sports-os'],
    deliverables: ['Design tokens', 'Interactive prototypes', 'Brand guidelines', 'Event stage artwork'],
    status: 'Published',
    order: 2,
  },
  {
    id: 'visual-media',
    name: 'Visual Media',
    code: 'MEDIA',
    iconName: 'camera',
    color: '#805AD5',
    shortDesc: 'Photo and video of every event, cinematic recaps, and documentary capture.',
    fullDesc:
      'Chronicling the builder journey with unvarnished honesty. From high-energy hackathon recaps to cinematic keynote video production and live stage capture, Visual Media makes work memorable.',
    leadId: 'visual-media-lead',
    leadName: 'Burhan Uddin',
    leadRole: 'Visual Media Lead',
    leadPhoto: '/team/president.jpg',
    leadBio:
      'Captures the builder journey through cinematic photography, documentaries, live event recaps, and visual media.',
    leadQuote: 'Document the struggle and the craft with unvarnished honesty.',
    memberCount: 5,
    members: [
      {
        id: 'media-1',
        name: 'Burhan Uddin',
        role: 'Cinematographer & Lead Editor',
        photo: '/team/president.jpg',
        bio: 'Directs short films, live match coverage, and documentary recap production for GWD.',
        skills: ['Cinematography', 'DaVinci Resolve', 'Premiere Pro', 'Lighting'],
        deliverables: ['GWD Hero Film', 'Builder Sprint Recap', 'Match Day Photography'],
        projects: ['global-enterprise-delivery'],
        active: true,
      },
      {
        id: 'media-2',
        name: 'Rohan Mehra',
        role: 'Video Editor & Motion Designer',
        photo: '/team/president.jpg',
        bio: 'Edits fast-paced trailer cuts, social reels, and dynamic motion graphics.',
        skills: ['After Effects', 'Sound Design', 'Motion Graphics'],
        deliverables: ['Launch Teaser Reels', 'Event Opening Video'],
        projects: ['gwd-sports-os'],
        active: true,
      },
      {
        id: 'media-3',
        name: 'Zaid Khan',
        role: 'Photographer',
        photo: '/team/president.jpg',
        bio: 'Captures candid builder moments, stage presentations, and high-resolution club archives.',
        skills: ['Event Photography', 'Color Grading', 'Lightroom'],
        deliverables: ['VJIT Inauguration Gallery', 'Founder Portraits'],
        projects: ['global-enterprise-delivery'],
        active: true,
      },
    ],
    projects: ['global-enterprise-delivery'],
    deliverables: ['Cinematic recap films', 'Live event photo archives', 'Short-form documentaries', 'Keynote visual production'],
    status: 'Published',
    order: 3,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    code: 'MKTG',
    iconName: 'megaphone',
    color: '#319795',
    shortDesc: 'Social media, campaigns, distribution, and community reach.',
    fullDesc:
      'Distribution is half the battle. Marketing crafts the narrative, directs multi-channel launch campaigns, and builds digital engagement across student developers and industry leaders.',
    leadId: 'marketing-lead',
    leadName: 'Anvita Reddy',
    leadRole: 'Marketing Lead',
    leadPhoto: '/team/president.jpg',
    leadBio:
      'Amplifies GWD launches, builder campaigns, distribution networks, and digital storytelling across channels.',
    leadQuote: 'Great products deserve distribution that matches their craft.',
    memberCount: 6,
    members: [
      {
        id: 'mktg-1',
        name: 'Anvita Reddy',
        role: 'Marketing Lead & Growth Strategist',
        photo: '/team/president.jpg',
        bio: 'Drives overall digital audience strategy, launch campaigns, and cross-campus distribution networks.',
        skills: ['Campaign Strategy', 'Community Growth', 'Analytics', 'Social Media'],
        deliverables: ['Inauguration Social Campaign', 'Builder Sprint Registration Push'],
        projects: ['global-enterprise-delivery'],
        active: true,
      },
      {
        id: 'mktg-2',
        name: 'Varun Joshi',
        role: 'Content Strategist & Copywriter',
        photo: '/team/president.jpg',
        bio: 'Writes compelling headlines, announcements, case studies, and social thread narratives.',
        skills: ['Copywriting', 'SEO', 'Editorial Storytelling'],
        deliverables: ['Announcement Threads', 'Event Promotional Copy'],
        projects: ['global-enterprise-delivery'],
        active: true,
      },
    ],
    projects: ['global-enterprise-delivery'],
    deliverables: ['Social media campaigns', 'Launch distribution plans', 'Builder spotlight series', 'Audience growth analytics'],
    status: 'Published',
    order: 4,
  },
  {
    id: 'event-management',
    name: 'Event Management',
    code: 'EVNT',
    iconName: 'calendar',
    color: '#D69E2E',
    shortDesc: 'Plans and runs every event, on and off campus, from logistics to stage flow.',
    fullDesc:
      'Turning plans into precision execution. Event Management handles venue logistics, scheduling, guest hospitality, participant check-in, and stage coordination for all summits, sprints, and tournaments.',
    leadId: 'event-management-lead',
    leadName: 'Bhavya Koduri',
    leadRole: 'Event Management Lead',
    leadPhoto: '/team/event-management-lead.jpg',
    leadBio:
      'Directs hackathons, summits, and campus showcases with seamless stage execution and attendee experience.',
    leadQuote: 'Every interaction and stage moment shapes the collective memory.',
    memberCount: 7,
    members: [
      {
        id: 'evnt-1',
        name: 'Bhavya Koduri',
        role: 'Event Management Lead & Production Director',
        photo: '/team/event-management-lead.jpg',
        bio: 'Spearheads major hackathons, symposiums, and campus events with rigorous attention to attendee experience.',
        skills: ['Event Operations', 'Logistics', 'Stage Direction', 'Team Leadership'],
        deliverables: ['VJIT Inauguration Event', 'Builder Sprint Operations Plan'],
        projects: ['gwd-sports-os'],
        active: true,
      },
      {
        id: 'evnt-2',
        name: 'Aditya Sen',
        role: 'Logistics Coordinator',
        photo: '/team/president.jpg',
        bio: 'Manages equipment setup, check-in desks, badges, and food & venue requirements.',
        skills: ['Logistics', 'Vendor Coordination', 'Scheduling'],
        deliverables: ['Attendee Check-In Pipeline', 'Sprint Materials Setup'],
        projects: ['gwd-sports-os'],
        active: true,
      },
    ],
    projects: ['gwd-sports-os'],
    deliverables: ['Hackathon production plans', 'Stage schedules & run-of-show', 'Attendee registration logistics', 'Guest hospitality'],
    status: 'Published',
    order: 5,
  },
  {
    id: 'public-relations',
    name: 'Public Relations',
    code: 'PR',
    iconName: 'handshake',
    color: '#3182CE',
    shortDesc: 'Partner colleges, guest speakers, sponsor outreach, and media relations.',
    fullDesc:
      'Building lasting bridges. PR connects GWD with partner colleges across Hyderabad, industry leaders, corporate sponsors, and government innovation bodies like T-Hub and TGIC.',
    leadId: 'pr-lead',
    leadName: 'Tuba Azeem',
    leadRole: 'PR Lead',
    leadPhoto: '/team/president.jpg',
    leadBio:
      'Directs external relations, institutional liaison, corporate outreach, and media communications.',
    leadQuote: 'Meaningful partnerships compound when built on mutual trust.',
    memberCount: 5,
    members: [
      {
        id: 'pr-1',
        name: 'Tuba Azeem',
        role: 'PR Lead & Strategic Partnerships',
        photo: '/team/president.jpg',
        bio: 'Leads institutional communications, guest speaker invitations, and inter-college expansion.',
        skills: ['Corporate Outreach', 'Liaison', 'Public Relations', 'Partnership Management'],
        deliverables: ['Chief Guest Invitations (TGIC & CFI)', 'Inter-College Outreach'],
        projects: ['gwd-sports-os'],
        active: true,
      },
      {
        id: 'pr-2',
        name: 'Farhan Ali',
        role: 'Outreach Associate',
        photo: '/team/president.jpg',
        bio: 'Coordinates partner college club presidents and corporate mentor networks.',
        skills: ['Networking', 'Communication', 'Outreach'],
        deliverables: ['Partner Campus Directory', 'Speaker Coordination'],
        projects: ['global-enterprise-delivery'],
        active: true,
      },
    ],
    projects: ['gwd-sports-os', 'global-enterprise-delivery'],
    deliverables: ['Institutional partnerships', 'Guest speaker invites', 'Sponsorship decks', 'Press releases'],
    status: 'Published',
    order: 6,
  },
];

// ── Default Seed Registrations ──
export const SEED_REGISTRATIONS: RegistrationRecord[] = [
  {
    id: 'GWD-REG-001',
    eventId: 'gwd-vjit-builder-sprint-2025',
    eventTitle: 'GWD Builder Sprint & Showcase',
    eventDate: '2025-11-22',
    name: 'Rohit Sharma',
    email: 'rohit.s@vjit.ac.in',
    phone: '+91 98490 12345',
    college: 'Vidya Jyothi Institute of Technology',
    department: 'Computer Science & Engineering',
    year: '3',
    message: 'Interested in full-stack sports platform track.',
    registeredAt: '2025-09-24T10:15:00Z',
    attendance: true,
  },
  {
    id: 'GWD-REG-002',
    eventId: 'gwd-vjit-builder-sprint-2025',
    eventTitle: 'GWD Builder Sprint & Showcase',
    eventDate: '2025-11-22',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@cbit.org.in',
    phone: '+91 98765 67890',
    college: 'Chaitanya Bharathi Institute of Technology',
    department: 'Information Technology',
    year: '2',
    message: 'UI/UX track and editorial systems.',
    registeredAt: '2025-09-25T14:30:00Z',
    attendance: false,
  },
  {
    id: 'GWD-REG-003',
    eventId: 'gwd-sports-demo-day',
    eventTitle: 'GWD Sports League Demo Day',
    eventDate: '2025-12-10',
    name: 'Suhas Kulkarni',
    email: 'suhas.k@vjit.ac.in',
    phone: '+91 97000 45678',
    college: 'Vidya Jyothi Institute of Technology',
    department: 'Data Science & AI',
    year: '3',
    message: 'Real-time player analytics passport architecture.',
    registeredAt: '2025-09-27T16:20:00Z',
    attendance: true,
  },
];

// ── Default Seed Applications ──
export const SEED_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'GWD-APP-101',
    name: 'Pooja Sen',
    email: 'pooja.sen@vjit.ac.in',
    phone: '+91 91234 56789',
    department: 'CSE - Data Science',
    year: '2nd Year',
    domain: 'Technical',
    why: 'I want to build production systems instead of doing classroom toy projects. I know React and TypeScript.',
    portfolio: 'https://github.com/pooja-sen',
    status: 'Shortlisted',
    appliedAt: '2025-09-26T11:00:00Z',
    notes: 'Strong GitHub portfolio. Scheduled for trial sprint.',
  },
  {
    id: 'GWD-APP-102',
    name: 'Kiran Kumar',
    email: 'kiran.k@vjit.ac.in',
    phone: '+91 98888 77777',
    department: 'Information Technology',
    year: '3rd Year',
    domain: 'Creative',
    why: 'I design UI concepts on Figma and want to build real design systems that ship.',
    portfolio: 'https://behance.net/kirank',
    status: 'Reviewing',
    appliedAt: '2025-09-28T09:45:00Z',
  },
];

// ── Default Seed Messages ──
export const SEED_MESSAGES: ContactMessage[] = [
  {
    id: 'GWD-MSG-001',
    name: 'Ramesh Sundaram',
    email: 'ramesh@hyderabadfootball.org',
    subject: 'Academy Onboarding for GWD Sports OS',
    message: 'We manage a football academy with 180 youth players and would like to demo the attendance and passport system.',
    receivedAt: '2025-09-28T15:30:00Z',
    status: 'New',
  },
  {
    id: 'GWD-MSG-002',
    name: 'Dr. Srinivas Rao',
    email: 'srinivas.dean@cbit.org.in',
    subject: 'Hackathon Collaboration Inquiry',
    message: 'Interested in partnering with GWD Club to host an inter-college builder sprint on our campus.',
    receivedAt: '2025-09-27T12:00:00Z',
    status: 'In Progress',
  },
];

// ── Default Seed Connect & Partnership Requests ──
export const SEED_CONNECT_REQUESTS: ConnectRequestRecord[] = [
  {
    id: 'REQ-2026-8101',
    createdAt: '2026-09-28T10:15:00Z',
    updatedAt: '2026-09-30T14:15:00Z',
    requestType: 'bring_to_college',
    status: 'In Discussion',
    assignedPoc: 'Deekshit Katikaneni',
    internalNotes:
      'Spoke with Dr. Srinivas Rao. They have a 450-seater main auditorium and a 120-seat high-performance computing lab. Proposing 3-day full-stack sprint curriculum.',
    followUpLogs: [
      {
        id: 'fol-8101-1',
        timestamp: '2026-09-29T10:30:00Z',
        author: 'Deekshit Katikaneni',
        action: 'Discovery Briefing Scheduled',
        notes: 'Held introductory call with CSE & IT Faculty Coordinators. Aligned on student builder outcomes.',
        nextFollowUpDate: '2026-10-04',
      },
      {
        id: 'fol-8101-2',
        timestamp: '2026-09-30T14:15:00Z',
        author: 'Deekshit Katikaneni',
        action: 'Curriculum & Hardware Spec Transmitted',
        notes: 'Shared GWD 3-day Campus Sprint syllabus, deployment benchmarks, and hardware prerequisites.',
        nextFollowUpDate: '2026-10-05',
      },
    ],
    fullName: 'Dr. K. Srinivas Rao',
    roleDesignation: 'Dean of Academics & Student Affairs',
    email: 'srinivas.dean@cbit.org.in',
    phone: '+91 94401 23890',
    requesterType: 'Faculty / Dept Head',
    institutionName: 'Chaitanya Bharathi Institute of Technology (CBIT)',
    institutionWebsite: 'https://www.cbit.ac.in',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    existingCommunityInfo: 'Active IEEE and ACM Student Chapters with 600+ enrolled undergraduate members.',
    proposedEventName: 'CBIT × GWD 3-Day Autonomous Systems & Web Platform Sprint',
    eventDescription:
      'Intensive campus-wide engineering sprint where student teams architect and deploy live production web platforms under direct mentorship of GWD technical leads.',
    expectedAudienceSize: '300–500 Participants',
    preferredDate: '2026-11-14',
    alternativeDate: '2026-11-28',
    format: 'Offline / On-Campus',
    venue: 'CBIT Main Assembly Auditorium & Computer Science Core Lab 4',
    facilitiesAvailable:
      'Gigabit fiber LAN, Dual 4K Laser Projection, Stage Audio System, Faculty Staff Liaison Team',
    requestedFromGwd:
      'Keynote speaker, 4 domain mentors, industry-grade problem statements, code review rubric, digital credentials.',
    budgetSponsorship:
      'Department sanctioned budget covers travel honorarium, student hospitality, and technical lead accommodation.',
    socialLinks: 'https://linkedin.com/school/cbit-hyderabad',
    additionalMessage:
      'We want our 2nd and 3rd year engineering students to learn how production software is actually shipped in industry without boilerplate tutorials.',
  },
  {
    id: 'REQ-2026-8102',
    createdAt: '2026-10-01T08:45:00Z',
    updatedAt: '2026-10-01T08:45:00Z',
    requestType: 'collaborate',
    status: 'New',
    assignedPoc: 'Aldrin Paul',
    internalNotes: 'Incoming cross-institutional open source tooling partnership from regional developer collective.',
    followUpLogs: [],
    fullName: 'Praveen Varma',
    roleDesignation: 'Regional Community Lead & Architect',
    email: 'praveen@gdghyderabad.org',
    phone: '+91 98490 55123',
    requesterType: 'Community Founder',
    institutionName: 'Google Developer Groups (GDG) On Campus Network',
    institutionWebsite: 'https://gdg.community.dev',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    existingCommunityInfo: 'Network spanning 12 engineering colleges across Telangana with 4,200+ active student builders.',
    proposedEventName: 'De-Centralized Builder Summit & Open Source Platform Track',
    eventDescription:
      'Co-architecting an open-source toolchain sprint where student developers contribute directly to active GWD platform engines and community infrastructure.',
    expectedAudienceSize: '500+ Participants',
    preferredDate: '2026-12-05',
    alternativeDate: '2026-12-19',
    format: 'Hybrid',
    venue: 'T-Hub Phase 2 / Virtual Discord & GitHub Workspaces',
    facilitiesAvailable: 'Hybrid broadcast studio, Discord community server with 5k builders, ecosystem venue pass.',
    requestedFromGwd:
      'Co-branding, real platform problem statements, live architecture reviews, domain jury representation.',
    budgetSponsorship: 'Joint developer grants and cloud compute credits available from ecosystem sponsors.',
    socialLinks: 'https://x.com/gdghyderabad',
    additionalMessage:
      'We admire GWD Sports OS and Next Bridge platforms; excited to build joint engineering momentum with student founders.',
  },
  {
    id: 'REQ-2026-8103',
    createdAt: '2026-09-30T16:20:00Z',
    updatedAt: '2026-10-01T11:00:00Z',
    requestType: 'invite_gwd',
    status: 'Contacted',
    assignedPoc: 'Ashish Goutham',
    internalNotes:
      'ATMOS annual techno-management festival invitation. Contacted student lead regarding slot timings and keynote format.',
    followUpLogs: [
      {
        id: 'fol-8103-1',
        timestamp: '2026-10-01T11:00:00Z',
        author: 'Ashish Goutham',
        action: 'Speaker Availability Confirmed',
        notes: 'Confirmed keynote availability with Deekshit Katikaneni for ATMOS 2026 Opening Day.',
        nextFollowUpDate: '2026-10-08',
      },
    ],
    fullName: 'Vikramaditya Nair',
    roleDesignation: 'Convenor, Technical Fest Committee',
    email: 'vikram.atmos@hyderabad.bits-pilani.ac.in',
    phone: '+91 91770 88210',
    requesterType: 'Student Council / Lead',
    institutionName: 'BITS Pilani, Hyderabad Campus',
    institutionWebsite: 'https://www.bits-pilani.ac.in/hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    existingCommunityInfo: 'Annual national techno-management festival ATMOS with 8,000+ national footfall.',
    proposedEventName: 'Keynote: Architecting High-Velocity Student Software Ventures',
    eventDescription:
      'Inviting GWD Technical Lead Deekshit Katikaneni and Executive Council for a 45-minute keynote address and evaluating the flagship Hack-a-Bit hackathon finalists.',
    expectedAudienceSize: '300–500 Participants',
    preferredDate: '2026-11-21',
    alternativeDate: '2026-11-22',
    format: 'Offline / On-Campus',
    venue: 'BITS Hyderabad Main Auditorium',
    facilitiesAvailable:
      'Full AV production suite, live telecast, dedicated green room & executive campus hospitality.',
    requestedFromGwd: 'Deekshit Katikaneni (Speaker) and 2 Hackathon Judges for final demo evaluation.',
    budgetSponsorship: 'Executive campus hospitality, travel honorarium, and event pass package sanctioned.',
    socialLinks: 'https://instagram.com/atmos_bitsh',
    additionalMessage: 'Looking forward to hosting the GWD leadership and engineering crew at BITS!',
  },
];

// ── Default Seed Homepage CMS Data ──
export const SEED_HOMEPAGE: HomepageCmsData = {
  hero: {
    headline: 'Replace manual assumptions with shipped work.',
    subheadline:
      'GWD is a student-founded technology and creative powerhouse that turns ideas into shipped production platforms — tech, design, and everything between.',
    tagline: 'GET WORK DONE.',
    badge: 'LIVE PRODUCTION NETWORK · HYDERABAD & GLOBAL',
    videoUrl: '/gwd-hero.mp4',
    fallbackVideoUrl: '/new-era-hero.mp4',
    primaryCtaText: 'Explore the Collective',
    primaryCtaHref: '/explore',
    secondaryCtaText: 'Watch Opening Film',
    secondaryCtaHref: '#film-modal',
  },
  intro: {
    label: '01 · The Collective',
    headline: 'Built by students who ship real products.',
    leadStory:
      'GWD Global Pvt. Ltd. was born from a student idea in March 2024 at VJIT, and officially incorporated on 12 June 2025 in Madhapur, Hyderabad. We operate across 10 countries delivering production software, grassroots sports operating systems, and creative campaigns.',
    studentIdeaTitle: 'It started as a student idea',
    studentIdeaBody:
      "In March 2024, a handful of students saw a gap: skilled young people couldn't get real client work, and real clients couldn't find affordable, capable teams. GWD put itself in the middle. The name never changed, because the mission never did.",
    threeArmsTitle: 'One company. Three arms.',
    threeArmsSub: 'GWD Global Private Limited: registered with the Government of India (MCA) in 2025.',
  },
  featuredDomainIds: ['technical', 'creative', 'visual-media', 'marketing', 'event-management', 'public-relations'],
  featuredProjectIds: ['gwd-sports-os', 'next-bridge-platform', 'global-enterprise-delivery'],
  featuredEventId: 'gwd-vjit-builder-sprint-2025',
  leadershipHighlightId: 'president',
  featuredCollaborationId: 'hyderabad-super-league',
  stats: STATS,
  finalCta: {
    tag: 'JOIN THE COLLECTIVE',
    headline: 'Have an idea?',
    highlightWord: "Let's get it done.",
    subtitle:
      'Whether you want to build production software, design brand identities, or organize national-scale showcases — GWD is where ideas become shipped work.',
    primaryText: 'Join GWD',
    primaryHref: '/join',
    secondaryText: 'Explore Domains',
    secondaryHref: '/explore',
  },
  footer: {
    tagline:
      'GWD Global Pvt. Ltd. & GWD Club. Operating across 10 countries with 650+ builders, turning technical and creative ambition into shipped production work.',
    address: 'Madhapur, Hyderabad, Telangana — 500081 · VJIT Campus',
    inception: 'Inception: March 2024 · Inc: 12 June 2025',
    email: 'contact@gwd-club.com',
    phone: '+91 91212 99800',
    cin: 'U63999TS2025PTC199800',
    gstin: '36AAMCG1250H1ZP',
  },
};

export const SEED_MEDIA: MediaRecord[] = [
  {
    id: 'media-brand-logo',
    url: '/brand/gwd-logo.png',
    name: 'GWD Official Brand Mark',
    type: 'image',
    category: 'homepage',
    size: '25 KB',
    uploadedAt: '2025-06-12',
    dimensions: '512x180',
    tags: ['Brand', 'Identity', 'Vector'],
  },
  {
    id: 'media-team-pres',
    url: '/team/president.jpg',
    name: 'Aldrin Paul — Executive Portrait',
    type: 'image',
    category: 'team',
    size: '184 KB',
    uploadedAt: '2025-07-01',
    dimensions: '800x800',
    tags: ['Leadership', 'President', 'Board'],
  },
  {
    id: 'media-team-tech',
    url: '/team/technical-lead.png',
    name: 'Deekshit Katikaneni — Technical Lead',
    type: 'image',
    category: 'team',
    size: '210 KB',
    uploadedAt: '2025-07-01',
    dimensions: '800x800',
    tags: ['Technical', 'Lead', 'Software'],
  },
  {
    id: 'media-team-gs',
    url: '/team/general-secretary.jpg',
    name: 'Shravya — General Secretary',
    type: 'image',
    category: 'team',
    size: '165 KB',
    uploadedAt: '2025-07-01',
    dimensions: '800x800',
    tags: ['Governance', 'Executive', 'Council'],
  },
  {
    id: 'media-collab-hsl',
    url: '/logos/hyderabad-super-league.png',
    name: 'Hyderabad Super League Tournament Emblem',
    type: 'image',
    category: 'collaborations',
    size: '42 KB',
    uploadedAt: '2025-08-15',
    dimensions: '400x400',
    tags: ['Sports OS', 'Partner', 'League'],
  },
  {
    id: 'media-collab-thub',
    url: '/logos/t-hub.png',
    name: 'T-Hub Innovation Partner Logo',
    type: 'image',
    category: 'collaborations',
    size: '38 KB',
    uploadedAt: '2025-08-20',
    dimensions: '400x160',
    tags: ['Incubation', 'Government', 'Ecosystem'],
  },
  {
    id: 'media-event-sprint',
    url: '/img/visit-conversation.jpg',
    name: 'Builder Sprint Technical Briefing',
    type: 'image',
    category: 'events',
    size: '624 KB',
    uploadedAt: '2025-09-10',
    dimensions: '1920x1080',
    tags: ['Showcase', 'VJIT', 'Briefing'],
  },
  {
    id: 'media-work-sports-os',
    url: '/img/visit-match.jpg',
    name: 'GWD Sports OS Matchday Telemetry & Live Game',
    type: 'image',
    category: 'work',
    size: '720 KB',
    uploadedAt: '2025-09-18',
    dimensions: '1920x1080',
    tags: ['Work', 'Sports OS', 'Real-Time'],
  },
  {
    id: 'media-vjit-inauguration',
    url: '/img/vjit-inauguration.jpg',
    name: 'GWD Club VJIT Campus Inauguration Assembly',
    type: 'image',
    category: 'events',
    size: '245 KB',
    uploadedAt: '2025-06-15',
    dimensions: '1920x1080',
    tags: ['VJIT', 'Inauguration', 'Club'],
  },
  {
    id: 'media-visit-workstation',
    url: '/img/visit-workstation.jpg',
    name: 'Live Tournament Operations Desk',
    type: 'image',
    category: 'work',
    size: '600 KB',
    uploadedAt: '2025-09-22',
    dimensions: '1920x1080',
    tags: ['Operations', 'Scoring', 'Desk'],
  },
];

export const SEED_WORKFLOW_STEPS: WorkflowStepItem[] = [
  {
    id: 'wf-01',
    stepNumber: '01',
    phase: 'INITIATION',
    title: 'Idea Incubation & Problem Validation',
    duration: 'Week 1',
    summary:
      'Every project starts with an actual problem statement rather than abstract speculation. We filter ideas against market reality: is this an enterprise contract, an incubation venture, or a community tool that creates undeniable utility?',
    deliverables: [
      'Problem Brief & Market Validation',
      'Target User Persona & Scope Definition',
      'Technical Feasibility Assessment',
    ],
    status: 'Published',
    order: 1,
  },
  {
    id: 'wf-02',
    stepNumber: '02',
    phase: 'SPECIFICATION',
    title: 'Planning & Systems Architecture',
    duration: 'Weeks 1–2',
    summary:
      'We deconstruct the product into architectural contracts, wireframes, and sprint milestones. Cross-functional leads assign distinct lanes across Engineering, Creative, and Product Operations so parallel build execution can proceed without blockers.',
    deliverables: [
      'Component Architecture & Data Model',
      'High-Fidelity Figma Design System',
      'Sprint Roadmap & Milestones Breakdown',
    ],
    status: 'Published',
    order: 2,
  },
  {
    id: 'wf-03',
    stepNumber: '03',
    phase: 'ENGAGEMENT',
    title: 'Registration & Crew Assembling',
    duration: 'Week 2',
    summary:
      'For community sprints and major showcases, registration opens with role-based application tracks. Builders are onboarded based on verified skill domains, matched with senior mentors, and integrated into active repo branches.',
    deliverables: [
      'Role Matching (Tech, Creative, Ops)',
      'GitHub Workspace & Repository Access',
      'Live Kickoff & Sprint Briefing',
    ],
    status: 'Published',
    order: 3,
  },
  {
    id: 'wf-04',
    stepNumber: '04',
    phase: 'BUILD VELOCITY',
    title: 'Short-Cycle Prototyping & Sprint Execution',
    duration: 'Weeks 3–6',
    summary:
      'Continuous daily deployment cadence. Builders push feature branches reviewed directly by Domain Leads. Code is validated with strict type safety, end-to-end integration tests, and responsive layout audits.',
    deliverables: [
      'Weekly Incremental Demo Releases',
      'Automated Test Coverage & Pull Requests',
      'Lead Code & UX Review Approvals',
    ],
    status: 'Published',
    order: 4,
  },
  {
    id: 'wf-05',
    stepNumber: '05',
    phase: 'VALIDATION',
    title: 'Pre-Deployment QA & User Verification',
    duration: 'Week 7',
    summary:
      'Comprehensive pre-deployment verification across desktop, tablet, and mobile breakpoints. Interactive edge cases, contrast guidelines, accessibility, and form validation are rigorously tested before greenlighting release.',
    deliverables: [
      'Cross-Device & Browser Verification Report',
      'Visual Contrast & Accessibility Audit',
      'Operational Release Gate Sign-off',
    ],
    status: 'Published',
    order: 5,
  },
  {
    id: 'wf-06',
    stepNumber: '06',
    phase: 'RELEASE & SCALE',
    title: 'Production Deployment & Operations',
    duration: 'Week 8+',
    summary:
      'Product is deployed to global CDN edge infrastructure with DNS routing, analytics, and operational monitoring. Ongoing maintenance and sprint retro documents ensure compounding institutional knowledge.',
    deliverables: [
      'Global Vercel Edge Production Deployment',
      'Live Monitoring & Operational Governance',
      'Post-Launch Retrospective & Case Study',
    ],
    status: 'Published',
    order: 6,
  },
];

export const SEED_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'audit-001',
    action: 'SYSTEM_INIT',
    targetType: 'SYSTEM',
    user: 'system@gwd-club.com',
    timestamp: '2026-10-01T09:00:00Z',
    details: 'GWD Operations CMS initialized with verified corporate and club records (CIN: U63999TS2025PTC199800).',
    status: 'success',
  },
  {
    id: 'audit-002',
    action: 'DYEWHORL_ISOLATION',
    targetType: 'GRAPHICS_LAYER',
    user: 'deekshit.k@gwd-club.com',
    timestamp: '2026-10-01T10:15:00Z',
    details: 'DyeWhorl fluid canvas isolated to dedicated non-interactive decorative layer; pointer-events disabled.',
    status: 'success',
  },
  {
    id: 'audit-003',
    action: 'FOOTER_REBUILD',
    targetType: 'PUBLIC_UI',
    user: 'aldrin.p@gwd-club.com',
    timestamp: '2026-10-01T11:30:00Z',
    details: 'Public footer rebuilt with solid high-contrast corporate architecture and clickable navigation.',
    status: 'success',
  },
  {
    id: 'audit-004',
    action: 'REGISTRATIONS_VERIFY',
    targetType: 'EVENTS',
    targetId: 'gwd-builder-sprint',
    user: 'bhavya.k@gwd-club.com',
    timestamp: '2026-10-01T14:20:00Z',
    details: 'Verified event registration pipeline and validated live Excel (.xlsx) export utility.',
    status: 'info',
  },
  {
    id: 'audit-005',
    action: 'DOMAIN_SYNC',
    targetType: 'ORGANIZATION',
    user: 'shravya@gwd-club.com',
    timestamp: '2026-10-01T16:45:00Z',
    details: 'Leadership council and 6 organizational domains synchronized between CMS and public explore views.',
    status: 'success',
  },
];

// ── Default SEO Page Presets ──
export const DEFAULT_SEO_PAGES: Record<string, PageSeoRecord> = {
  global: {
    pageKey: 'global',
    pageTitle: 'Site-Wide Global Defaults',
    seoTitle: 'GWD — Get Work Done | Student Technology & Creative Collective',
    metaDescription: 'A student collective that turns ideas into shipped work — tech, design, and everything between. Operating across 10 countries.',
    ogTitle: 'GWD — Get Work Done',
    ogDescription: 'Production platforms, software engines, design systems, and creative summits engineered by GWD.',
    ogImage: '/brand/gwd-logo.png',
  },
  home: {
    pageKey: 'home',
    pageTitle: 'Homepage',
    seoTitle: 'GWD — Get Work Done | Student Technology & Creative Collective',
    metaDescription: 'A student collective that turns ideas into shipped work — tech, design, and everything between. Operating across 10 countries from Hyderabad to the world.',
    ogTitle: 'GWD — Get Work Done',
    ogDescription: 'From student ideas to shipped enterprise software and creative showcases.',
    ogImage: '/brand/gwd-logo.png',
  },
  about: {
    pageKey: 'about',
    pageTitle: 'About GWD',
    seoTitle: 'About GWD — Inception, Legacy & Operating Model',
    metaDescription: 'Founded at VJIT Hyderabad in March 2024. Incorporated June 2025. Discover the vision, 3 core arms, and global delivery footprint of GWD.',
    ogTitle: 'About GWD — The Student Technology Collective',
    ogDescription: 'Bridging academia and enterprise reality through hands-on shipped engineering.',
    ogImage: '/brand/gwd-logo.png',
  },
  team: {
    pageKey: 'team',
    pageTitle: 'Leadership & Team',
    seoTitle: 'Leadership & Collective Builders | GWD',
    metaDescription: 'Meet the founders, domain directors, and lead engineers directing GWD across technical platforms, sports OS, and digital media.',
    ogTitle: 'GWD Leadership & Builders',
    ogDescription: 'Executive leadership, domain heads, and community directors.',
    ogImage: '/brand/gwd-logo.png',
  },
  domains: {
    pageKey: 'domains',
    pageTitle: 'Domains & Capabilities (Explore)',
    seoTitle: 'Explore GWD Organizational Domains & Capabilities',
    metaDescription: 'Six specialized divisions: Technical, Creative Design, Marketing & Growth, Corporate Operations, Media & Film, and Event Operations.',
    ogTitle: 'GWD Domains — 6 Divisions, Zero Silos',
    ogDescription: 'Explore our organizational structure, leads, deliverables, and student builder rosters.',
    ogImage: '/brand/gwd-logo.png',
  },
  work: {
    pageKey: 'work',
    pageTitle: 'Shipped Work & Case Studies',
    seoTitle: 'Shipped Work, Platforms & Case Studies | GWD',
    metaDescription: 'Production deliverables built by GWD: Next Bridge Property Management, Hyderabad Super League Sports OS, and Global Enterprise Engineering.',
    ogTitle: 'GWD Shipped Work & Platforms',
    ogDescription: 'Explore enterprise platforms, mobile applications, and tournament engines shipped by GWD.',
    ogImage: '/brand/gwd-logo.png',
  },
  events: {
    pageKey: 'events',
    pageTitle: 'Events & Sprints',
    seoTitle: 'Events, Summits & Builder Sprints | GWD',
    metaDescription: 'Hands-on hackathons, summits, and builder demos organized by GWD across campuses. Register for upcoming sprints.',
    ogTitle: 'GWD Events & Hackathons',
    ogDescription: 'Live builder showcases, demo days, and campus hackathons.',
    ogImage: '/brand/gwd-logo.png',
  },
  gallery: {
    pageKey: 'gallery',
    pageTitle: 'Visual Archive & Gallery',
    seoTitle: 'Visual Archive & Event Atmosphere | GWD',
    metaDescription: 'Photographic captures and memories from GWD summits, hackathons, and builder sprints.',
    ogTitle: 'GWD Visual Archive',
    ogDescription: 'Memories, sprints, and showcases.',
    ogImage: '/brand/gwd-logo.png',
  },
  collaborations: {
    pageKey: 'collaborations',
    pageTitle: 'Collaborations & Alliances',
    seoTitle: 'Collaborate with GWD — Enterprise & Campus Alliances',
    metaDescription: 'Partner with GWD to engineer products, sponsor hackathons, or hire student builders.',
    ogTitle: 'Collaborate with GWD',
    ogDescription: 'Enterprise software partnerships, event sponsorships, and club collaborations.',
    ogImage: '/brand/gwd-logo.png',
  },
  join: {
    pageKey: 'join',
    pageTitle: 'Join GWD Collective',
    seoTitle: 'Join GWD — Student Builder & Creative Application',
    metaDescription: 'Apply to join the GWD collective. Build real software, brand identities, and enterprise solutions before graduation.',
    ogTitle: 'Join GWD — Applications Open',
    ogDescription: 'Direct application for undergraduate builders, designers, and organizers.',
    ogImage: '/brand/gwd-logo.png',
  },
  contact: {
    pageKey: 'contact',
    pageTitle: 'Contact & Inquiries',
    seoTitle: 'Contact GWD — Corporate & Campus Inquiries',
    metaDescription: 'Reach out to the GWD leadership team for platform inquiries, media, or partnerships.',
    ogTitle: 'Contact GWD',
    ogDescription: 'Hyderabad HQ, VJIT Campus, and global client inquiries.',
    ogImage: '/brand/gwd-logo.png',
  },
  connect: {
    pageKey: 'connect',
    pageTitle: 'Connect & Institutional Partnerships',
    seoTitle: 'Connect with GWD — Colleges, Communities & Strategic Alliances',
    metaDescription:
      'Official institutional gateway for universities, colleges, student clubs, and tech communities to bring GWD to their campus, co-host hackathons, or forge bilateral alliances.',
    ogTitle: 'Connect & Partner with GWD',
    ogDescription:
      'Bring GWD to your college, collaborate on software ventures, co-host flagships, or invite GWD leads.',
    ogImage: '/brand/gwd-logo.png',
  },
};

export const DEFAULT_CMS_STORE: GwdCmsStore = {
  homepage: SEED_HOMEPAGE,
  domains: SEED_DOMAINS,
  leaders: NINE_LEADERS,
  projects: PROJECTS,
  upcomingEvents: UPCOMING_EVENTS,
  pastEvents: PAST_EVENTS,
  collaborations: COLLABORATIONS,
  timeline: TIMELINE,
  gallery: GALLERY_IMAGES,
  registrations: SEED_REGISTRATIONS,
  applications: SEED_APPLICATIONS,
  messages: SEED_MESSAGES,
  connectRequests: SEED_CONNECT_REQUESTS,
  media: SEED_MEDIA,
  workflow: SEED_WORKFLOW_STEPS,
  auditLogs: SEED_AUDIT_LOGS,
  settings: {
    clubName: CLUB.clubName,
    companyName: CLUB.companyName,
    hq: CLUB.hq,
    cin: CLUB.cin,
    gstin: CLUB.gstin,
    email: CLUB.email,
    phone: CLUB.phone,
    instagram: CLUB.socials.instagram,
    linkedin: CLUB.socials.linkedin,
    twitter: CLUB.socials.twitter,
    github: CLUB.socials.github,
    dyeWhorlEnabled: true,
    dyeWhorlIntensity: 'normal',
    seoDefaultTitle: 'GWD — Get Work Done | Student Technology & Creative Collective',
    seoDefaultDescription:
      'A student collective that turns ideas into shipped work — tech, design, and everything between. Operating across 10 countries.',
    footerTagline:
      'GWD Global Pvt. Ltd. & GWD Club. Operating across 10 countries with 650+ builders, turning technical and creative ambition into shipped production work.',
    footerAddress: 'Madhapur, Hyderabad, Telangana — 500081 · VJIT Campus',
    footerInception: 'Inception: March 2024 · Inc: 12 June 2025',
    partnershipLead: {
      name: 'Ashish Goutham & Deekshit Katikaneni',
      role: 'Head of Partnerships & Ecosystem Alliances',
      email: 'partnerships@gwd-club.com',
      phone: '+91 91219 98835',
      deskLocation: 'GWD Central Desk · Hyderabad / VJIT Campus',
      responseWindow: 'Within 24–48 Business Hours',
      telegramOrWhatsapp: '+91 91219 98835',
    },
    seoPages: DEFAULT_SEO_PAGES,
  },
  lastUpdated: new Date().toISOString(),
};

const STORAGE_KEY = 'gwd_cms_store_v6';

/**
 * Load CMS Store from localStorage (or fallback to defaults)
 */
export function getCmsStore(): GwdCmsStore {
  if (typeof window === 'undefined') {
    return DEFAULT_CMS_STORE;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CMS_STORE));
      return DEFAULT_CMS_STORE;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CMS_STORE,
      ...parsed,
      homepage: { ...DEFAULT_CMS_STORE.homepage, ...(parsed.homepage || {}) },
      settings: {
        ...DEFAULT_CMS_STORE.settings,
        ...(parsed.settings || {}),
        partnershipLead: {
          ...DEFAULT_CMS_STORE.settings.partnershipLead!,
          ...(parsed.settings?.partnershipLead || {}),
        },
        seoPages: { ...DEFAULT_SEO_PAGES, ...(parsed.settings?.seoPages || {}) },
      },
      upcomingEvents: parsed.upcomingEvents?.length ? parsed.upcomingEvents : DEFAULT_CMS_STORE.upcomingEvents,
      pastEvents: parsed.pastEvents?.length ? parsed.pastEvents : DEFAULT_CMS_STORE.pastEvents,
      domains: parsed.domains?.length ? parsed.domains : DEFAULT_CMS_STORE.domains,
      leaders: parsed.leaders?.length ? parsed.leaders : DEFAULT_CMS_STORE.leaders,
      projects: parsed.projects?.length ? parsed.projects : DEFAULT_CMS_STORE.projects,
      media: parsed.media?.length ? parsed.media : DEFAULT_CMS_STORE.media,
      workflow: parsed.workflow?.length ? parsed.workflow : DEFAULT_CMS_STORE.workflow,
      auditLogs: parsed.auditLogs?.length ? parsed.auditLogs : DEFAULT_CMS_STORE.auditLogs,
      registrations: parsed.registrations || DEFAULT_CMS_STORE.registrations,
      applications: parsed.applications || DEFAULT_CMS_STORE.applications,
      messages: parsed.messages || DEFAULT_CMS_STORE.messages,
      connectRequests:
        parsed.connectRequests?.length !== undefined && parsed.connectRequests !== null
          ? parsed.connectRequests
          : DEFAULT_CMS_STORE.connectRequests,
    };
  } catch (err) {
    console.error('Failed to parse CMS store from localStorage:', err);
    return DEFAULT_CMS_STORE;
  }
}

/**
 * Save CMS Store to localStorage and broadcast an update event
 */
export function saveCmsStore(updated: GwdCmsStore): void {
  if (typeof window === 'undefined') return;
  try {
    updated.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('gwd:cms-updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to save CMS store to localStorage:', err);
    // Quota fallback: trim base64 media if storage space is constrained
    try {
      const pruned = {
        ...updated,
        media: (updated.media || []).slice(0, 15).map((m) =>
          m.url.startsWith('data:') && m.url.length > 250000
            ? { ...m, url: '/img/vjit-inauguration.jpg' }
            : m
        ),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
      window.dispatchEvent(new CustomEvent('gwd:cms-updated', { detail: pruned }));
    } catch {
      // safe fallback
    }
  }
}

/**
 * Reset CMS store back to official factory defaults
 */
export function resetCmsStore(): GwdCmsStore {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  saveCmsStore(DEFAULT_CMS_STORE);
  return DEFAULT_CMS_STORE;
}
