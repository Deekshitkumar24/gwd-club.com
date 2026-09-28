/* ============================================================
   GWD — GET WORK DONE
   Content data for the GWD website.
   All content is editable placeholder data.
   ============================================================ */

// ── Club Info ──
export const CLUB = {
  name: 'GWD',
  fullName: 'Get Work Done',
  tagline: 'A student collective that turns ideas into shipped work — tech, design, and everything between.',
  shortDescription: 'A student collective that turns ideas into shipped work across technology, design, events, community, and everything between.',
  longDescription: 'GWD is a community of makers, thinkers, and builders who believe that the best ideas happen when disciplines collide. We bring together students from engineering, design, arts, and business to create projects, host events, and build experiences that matter.',
  mission: 'To create a space where students from diverse backgrounds collaborate to build meaningful projects and grow as creators.',
  vision: 'To be the most impactful student-led creative collective in the country — known for our work, our events, and our people.',
  founded: 2019,
  college: 'National Institute of Technology',
  email: 'hello@gwd.club',
  phone: '+91 98765 43210',
  address: 'Student Activity Center, NIT Campus, Block C',
  socials: {
    instagram: 'https://instagram.com/gwdclub',
    twitter: 'https://twitter.com/gwdclub',
    linkedin: 'https://linkedin.com/company/gwdclub',
    youtube: 'https://youtube.com/@gwdclub',
    github: 'https://github.com/gwdclub',
  },
};

// ── Statistics ──
export const STATS = [
  { label: 'Events', value: 48, suffix: '+' },
  { label: 'Projects', value: 32, suffix: '' },
  { label: 'Members', value: 120, suffix: '+' },
  { label: 'Collaborations', value: 15, suffix: '' },
  { label: 'Years', value: 6, suffix: '' },
];

// ── Activities ──
export const ACTIVITIES = [
  {
    id: 'events',
    title: 'Events',
    description: 'Large-scale tech and creative events that bring together hundreds of participants from across the country.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Real-world projects built by teams of students — from apps and platforms to hardware prototypes and research papers.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
  },
  {
    id: 'workshops',
    title: 'Workshops',
    description: 'Hands-on learning sessions led by industry professionals and experienced club members covering cutting-edge technologies.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
  },
  {
    id: 'competitions',
    title: 'Competitions',
    description: 'Hackathons, design challenges, and creative competitions that push members to solve complex problems under pressure.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
  },
  {
    id: 'community',
    title: 'Community',
    description: 'A tight-knit network of alumni, mentors, and peers who support each other\'s growth and professional development.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
  },
  {
    id: 'creative',
    title: 'Creative Work',
    description: 'Photography, videography, graphic design, and multimedia storytelling that captures campus life and culture.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80',
  },
];

// ── Projects ──
export const PROJECTS = [
  {
    id: 'campus-connect',
    title: 'Campus Connect',
    year: '2025',
    category: 'Platform',
    shortDescription: 'A unified platform connecting students across departments for collaboration, resource sharing, and event discovery.',
    description: 'Campus Connect reimagined how students find collaborators and resources on campus. Built over 3 months by a team of 8, the platform serves over 2,000 active users and has facilitated 500+ project collaborations.',
    heroImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1400&q=80',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    ],
    outcome: '2,000+ active users within 3 months of launch',
    collaborators: ['CS Department', 'Design Club'],
    link: '#',
    beforeImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
  },
  {
    id: 'echo-festival',
    title: 'Echo Festival',
    year: '2024',
    category: 'Event',
    shortDescription: 'A three-day immersive tech and art festival featuring 20 speakers, 15 workshops, and 500 attendees.',
    description: 'Echo Festival was our flagship event — a celebration of technology, art, and human creativity. The festival brought together industry leaders, artists, and students for three days of talks, performances, and collaborative projects.',
    heroImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80',
    images: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
    ],
    outcome: '500 attendees, 95% satisfaction rate',
    collaborators: ['TechCorp', 'Creative Labs'],
    link: '#',
    beforeImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
  },
  {
    id: 'green-campus',
    title: 'Green Campus Initiative',
    year: '2024',
    category: 'Social Impact',
    shortDescription: 'A sustainability monitoring system tracking energy usage, waste management, and carbon footprint across campus.',
    description: 'The Green Campus Initiative was a collaboration with the university administration to build a real-time sustainability dashboard. Using IoT sensors and data visualization, the project helped reduce campus energy consumption by 15%.',
    heroImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1400&q=80',
    images: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
      'https://images.unsplash.com/photo-1518173946687-a26bc02af5a4?w=800&q=80',
    ],
    outcome: '15% reduction in campus energy consumption',
    collaborators: ['Environmental Science Dept', 'Facilities Management'],
    link: '#',
    beforeImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80',
  },
  {
    id: 'soundscape',
    title: 'Soundscape',
    year: '2023',
    category: 'Creative',
    shortDescription: 'An interactive audio-visual installation that translated campus sounds into generative art.',
    description: 'Soundscape was an art-meets-technology experiment. We placed microphones across campus and used real-time audio processing to generate abstract visual art projected onto the library facade for a week-long exhibition.',
    heroImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1400&q=80',
    images: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    ],
    outcome: '3,000+ viewers over the exhibition week',
    collaborators: ['Fine Arts Department', 'Music Club'],
    link: '#',
    beforeImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
  },
];

// ── Events ──
export const UPCOMING_EVENTS = [
  {
    id: 'gwd-summit-2025',
    title: 'GWD Summit 2025',
    date: '2025-11-15',
    time: '09:00 AM — 06:00 PM',
    location: 'Main Auditorium, NIT Campus',
    shortDescription: 'Our annual flagship summit bringing together industry leaders, innovators, and students for a day of talks, workshops, and networking.',
    description: 'GWD Summit is our marquee annual event — a full-day conference that connects students with industry leaders across technology, design, and entrepreneurship. This year, we are focusing on AI, creative technology, and sustainable innovation.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80',
    registrationOpen: true,
    featured: true,
    category: 'Conference',
    speakers: [
      { name: 'Arjun Mehta', role: 'CTO, TechVentures', topic: 'Building AI-First Products' },
      { name: 'Priya Sharma', role: 'Design Director, CreativeLab', topic: 'Design for the Next Billion Users' },
      { name: 'Dr. Ravi Kumar', role: 'Professor, IIT', topic: 'The Future of Computing' },
    ],
    schedule: [
      { time: '09:00', title: 'Registration & Networking', description: 'Check in and connect with other attendees' },
      { time: '10:00', title: 'Opening Keynote', description: 'Setting the stage for the day' },
      { time: '11:00', title: 'Panel Discussion', description: 'AI, Creativity, and the Future of Work' },
      { time: '12:30', title: 'Lunch Break', description: 'Networking lunch' },
      { time: '14:00', title: 'Workshop Track A', description: 'Hands-on AI prototyping' },
      { time: '14:00', title: 'Workshop Track B', description: 'Design thinking masterclass' },
      { time: '16:00', title: 'Showcase', description: 'Student project presentations' },
      { time: '17:30', title: 'Closing & Awards', description: 'Wrap-up and recognition' },
    ],
    eligibility: 'Open to all college students with a valid ID',
    instructions: ['Bring your laptop for workshops', 'Lunch will be provided', 'Certificates will be issued to attendees'],
    faq: [
      { question: 'Is there a registration fee?', answer: 'No, the event is free for all college students.' },
      { question: 'Can I attend individual sessions?', answer: 'Yes, you can choose your sessions after registration.' },
      { question: 'Will the sessions be recorded?', answer: 'Select sessions will be available on our YouTube channel.' },
    ],
    collaborators: ['TechVentures', 'CreativeLab', 'NIT Alumni Association'],
  },
  {
    id: 'design-sprint',
    title: 'Design Sprint Weekend',
    date: '2025-10-20',
    time: '10:00 AM — 05:00 PM',
    location: 'Innovation Hub, Block D',
    shortDescription: 'A 48-hour intensive design sprint where teams solve real-world problems using design thinking methodology.',
    description: 'Teams of 4 will tackle real challenges from partner organizations using Google\'s Design Sprint methodology. Mentors from industry will guide each team through the process.',
    image: 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?w=1400&q=80',
    registrationOpen: true,
    featured: false,
    category: 'Workshop',
    speakers: [],
    schedule: [],
    eligibility: 'Teams of 3-5 members, any department',
    instructions: ['Register as a team', 'Bring laptops and sketchbooks'],
    faq: [],
    collaborators: ['DesignHQ'],
  },
];

export const PAST_EVENTS = [
  {
    id: 'hackathon-2024',
    title: 'Code & Create Hackathon',
    date: '2024-09-10',
    time: '09:00 AM — 09:00 PM',
    location: 'Computer Science Block',
    shortDescription: 'A 12-hour hackathon focused on building solutions for campus life.',
    description: 'Over 200 students participated in our annual hackathon. Teams built everything from a campus navigation app to an automated library system.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&q=80',
    category: 'Hackathon',
    year: '2024',
    results: '1st Place: CampusNav, 2nd Place: LibBot, 3rd Place: StudyMatch',
    highlights: ['200+ participants', '45 teams', '12 hours of coding', '₹50,000 prize pool'],
    gallery: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    ],
  },
  {
    id: 'photography-walk',
    title: 'Campus Through the Lens',
    date: '2024-03-15',
    time: '06:00 AM — 10:00 AM',
    location: 'Campus Wide',
    shortDescription: 'An early morning photography walk capturing the beauty of campus in golden hour.',
    description: 'Our photography team led a group of 40 students on a guided photo walk, teaching composition, lighting, and storytelling through images.',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1400&q=80',
    category: 'Creative',
    year: '2024',
    results: 'Top 20 photographs exhibited in the campus gallery',
    highlights: ['40 participants', 'Professional camera equipment provided', 'Exhibition in campus gallery'],
    gallery: [
      'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800&q=80',
      'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80',
    ],
  },
  {
    id: 'tech-talk-series',
    title: 'Tech Talk Series: Web3',
    date: '2023-11-20',
    time: '04:00 PM — 06:00 PM',
    location: 'Seminar Hall A',
    shortDescription: 'An industry expert-led session exploring the fundamentals and future of decentralized technologies.',
    description: 'Part of our ongoing Tech Talk series, this session featured a senior engineer from a leading blockchain company discussing real-world applications of Web3 technology.',
    image: 'https://images.unsplash.com/photo-1591115765373-5f9cf1da241c?w=1400&q=80',
    category: 'Talk',
    year: '2023',
    results: 'Highly rated by attendees, follow-up workshop planned',
    highlights: ['120 attendees', 'Live demo of smart contracts', 'Q&A with industry expert'],
    gallery: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
    ],
  },
];

// ── Event Workflow ──
export const EVENT_WORKFLOW = [
  {
    step: 1,
    title: 'Announcement',
    description: 'We announce the event across all our channels — social media, campus posters, and our website. Every announcement includes dates, eligibility, and what to expect.',
    icon: '📢',
  },
  {
    step: 2,
    title: 'Registration',
    description: 'Registration opens on our platform. We keep forms short and clear. You get a confirmation email with all the details you need.',
    icon: '📝',
  },
  {
    step: 3,
    title: 'Selection',
    description: 'For competitive events, our team reviews applications and selects participants based on transparent criteria shared during announcement.',
    icon: '✅',
  },
  {
    step: 4,
    title: 'Preparation',
    description: 'Selected participants receive prep materials, team assignments, and logistics details. We run pre-event briefings for complex events.',
    icon: '🔧',
  },
  {
    step: 5,
    title: 'Event Day',
    description: 'The day arrives. Our team handles everything from registration desks to technical support so participants can focus on what matters.',
    icon: '🎯',
  },
  {
    step: 6,
    title: 'Results',
    description: 'For competitions, results are announced on event day. For all events, certificates and resources are shared within 48 hours.',
    icon: '🏆',
  },
  {
    step: 7,
    title: 'Gallery & Recap',
    description: 'Photos, videos, and a summary of the event are published on our website and social channels. Memories preserved for everyone.',
    icon: '📸',
  },
];

// ── Team ──
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
        skills: ['Leadership', 'System Architecture', 'Product Strategy', 'Community'],
        quote: 'The best way to learn is to build something that matters.',
        socials: { linkedin: '#', twitter: '#', github: '#' },
        projects: ['campus-connect', 'gwd-summit-2025'],
      },
      {
        id: 'vice-president',
        name: 'Vice President',
        role: 'Vice President',
        bio: 'Driving strategy and cross-functional operations to ensure every GWD initiative executes on schedule and with precision.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        skills: ['Operations', 'Strategy', 'Project Management'],
        quote: 'Execution is everything.',
        socials: { linkedin: '#', github: '#' },
        projects: ['green-campus'],
      },
    ],
  },
  {
    level: 'Core Team',
    members: [
      {
        id: 'general-secretary',
        name: 'General Secretary',
        role: 'General Secretary',
        bio: 'Keeps GWD running smoothly. Coordinates across departments, oversees member administration, and drives documentation.',
        image: '/team/general-secretary.jpg',
        skills: ['Communication', 'Operations', 'Administration'],
        quote: 'Great teams thrive on transparency and clarity.',
        socials: { linkedin: '#' },
        projects: ['gwd-summit-2025'],
      },
      {
        id: 'technical-lead',
        name: 'Technical Lead',
        role: 'Technical Lead',
        bio: 'Architecting the software, platforms, and technical frameworks built by GWD. Mentoring builders and establishing high engineering standards.',
        image: '/team/technical-lead.png',
        skills: ['Full-Stack', 'System Design', 'Cloud', 'Mentoring'],
        quote: 'Ship cleanly, iterate fearlessly.',
        socials: { github: '#', linkedin: '#' },
        projects: ['campus-connect'],
      },
      {
        id: 'event-management-lead',
        name: 'Event Management Lead',
        role: 'Event Management Lead',
        bio: 'Directing GWD\'s major events, summits, and hackathons with seamless logistics, stage coordination, and memorable experiences.',
        image: '/team/event-management-lead.jpg',
        skills: ['Event Management', 'Logistics', 'Stage Production', 'Budgeting'],
        quote: 'Every detail counts when creating memorable moments.',
        socials: { linkedin: '#' },
        projects: ['echo-festival', 'gwd-summit-2025'],
      },
      {
        id: 'creative-lead',
        name: 'Creative Lead',
        role: 'Creative Lead',
        bio: 'Directs GWD\'s visual identity, editorial style, motion graphics, and brand experiences across all mediums.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
        skills: ['UI/UX', 'Branding', 'Art Direction', 'Motion'],
        quote: 'Design gives form to purpose.',
        socials: { linkedin: '#', twitter: '#' },
        projects: ['echo-festival', 'soundscape'],
      },
    ],
  },
  {
    level: 'Team Leads',
    members: [
      {
        id: 'marketing-lead',
        name: 'Marketing Lead',
        role: 'Marketing Lead',
        bio: 'Amplifies GWD\'s voice, campaigns, and project launches to the wider university and tech ecosystem.',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
        skills: ['Growth', 'Social Media', 'Content Strategy', 'Campaigns'],
        socials: { instagram: '#', linkedin: '#' },
        projects: [],
      },
      {
        id: 'pr-lead',
        name: 'PR Lead',
        role: 'PR & Outreach Lead',
        bio: 'Manages external relations, speaker outreach, university liaison, and industry partnerships.',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
        skills: ['Public Relations', 'Partnerships', 'Outreach'],
        socials: { twitter: '#', linkedin: '#' },
        projects: [],
      },
      {
        id: 'media-lead',
        name: 'Media & Photography Lead',
        role: 'Media Lead',
        bio: 'Documents GWD culture and live events through cinematic photography and video recaps.',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
        skills: ['Cinematography', 'Photography', 'Video Editing'],
        socials: { instagram: '#' },
        projects: ['soundscape'],
      },
    ],
  },
];

// ── Collaborations ──
export const COLLABORATIONS = [
  {
    id: 'techventures',
    name: 'TechVentures Inc.',
    type: 'Corporate Sponsor',
    year: '2024-Present',
    description: 'TechVentures has been our primary technology partner, providing cloud infrastructure, mentorship, and sponsoring our annual summit.',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    outcome: 'Sponsored 3 major events, provided ₹5L in resources',
    featured: true,
  },
  {
    id: 'creativelab',
    name: 'Creative Lab Studio',
    type: 'Creative Partner',
    year: '2023-Present',
    description: 'Creative Lab collaborates with us on design workshops and provides professional design tools and licenses to our members.',
    logo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&q=80',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    outcome: '4 joint workshops, 50+ students trained',
    featured: true,
  },
  {
    id: 'nit-alumni',
    name: 'NIT Alumni Association',
    type: 'Institutional Partner',
    year: '2019-Present',
    description: 'Our founding partner. The alumni association provides mentorship, funding, and connects current students with industry professionals.',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=200&q=80',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
    outcome: 'Annual mentorship program, career guidance sessions',
    featured: true,
  },
  {
    id: 'startupincubator',
    name: 'Launchpad Incubator',
    type: 'Startup Partner',
    year: '2024',
    description: 'Partnered for our entrepreneurship bootcamp, providing workspace, mentors, and seed funding opportunities for student startups.',
    logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&q=80',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    outcome: '3 student startups incubated',
    featured: false,
  },
  {
    id: 'designhq',
    name: 'DesignHQ',
    type: 'Workshop Partner',
    year: '2024',
    description: 'Collaborated on the Design Sprint Weekend, providing professional facilitators and real industry design challenges.',
    logo: 'https://images.unsplash.com/photo-1614680376408-81e91ced14e6?w=200&q=80',
    image: 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?w=800&q=80',
    outcome: '60 students participated, 12 prototypes built',
    featured: false,
  },
];

// ── Timeline / Club Journey ──
export const TIMELINE = [
  {
    year: '2019',
    title: 'Founded',
    description: 'A group of 12 students from different departments came together with a shared vision — to build a space where creativity and technology could thrive together.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    achievement: 'Founding team of 12',
  },
  {
    year: '2020',
    title: 'First Workshop',
    description: 'Hosted our first public workshop on web development. 80 students attended. It was chaotic, imperfect, and exactly the energy we needed.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    achievement: '80 attendees at first event',
  },
  {
    year: '2021',
    title: 'First Major Project',
    description: 'Built a campus event management system used by 15+ clubs. Our first project that had real users and real impact.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    achievement: '15+ clubs adopted the platform',
  },
  {
    year: '2022',
    title: 'First Industry Collaboration',
    description: 'Partnered with TechVentures for our first sponsored event. This opened doors to more corporate partnerships and resources.',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
    achievement: 'First corporate sponsor',
  },
  {
    year: '2023',
    title: 'Rapid Growth',
    description: 'Membership grew to 80+. Launched three new verticals: Creative, Content, and Community. The club became a recognized institution on campus.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    achievement: '80+ active members',
  },
  {
    year: '2024',
    title: 'Echo Festival',
    description: 'Our most ambitious event yet — a three-day tech and art festival with 500 attendees, 20 speakers, and national media coverage.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    achievement: '500 attendees, national coverage',
  },
  {
    year: '2025',
    title: 'Today & Beyond',
    description: '120+ members strong, 6 active verticals, and a vision to become the most impactful student collective in the country. The journey continues.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    achievement: '120+ members, 6 verticals',
  },
];

// ── Gallery ──
export const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80', caption: 'GWD Summit 2024 — Opening Ceremony', category: 'events' },
  { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80', caption: 'Team brainstorming for Campus Connect', category: 'projects' },
  { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80', caption: 'Club picnic — Spring 2024', category: 'community' },
  { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80', caption: 'Code & Create Hackathon 2024', category: 'events' },
  { src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80', caption: 'Workshop on Machine Learning', category: 'workshops' },
  { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80', caption: 'Design thinking session', category: 'workshops' },
  { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80', caption: 'Echo Festival closing ceremony', category: 'events' },
  { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80', caption: 'Core team planning retreat', category: 'team' },
  { src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=900&q=80', caption: 'Industry collaboration kickoff', category: 'collaborations' },
  { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&q=80', caption: 'Annual day celebrations', category: 'community' },
  { src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&q=80', caption: 'Guest lecture by industry expert', category: 'events' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=900&q=80', caption: 'Creative team at work', category: 'projects' },
];

// ── Navigation ──
export const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Events', href: '/events' },
  { label: 'Team', href: '/team' },
  { label: 'About', href: '/about' },
  { label: 'Join', href: '/join' },
];

// ── Join / Why Join ──
export const WHY_JOIN = [
  {
    title: 'Build Real Projects',
    description: 'Work on projects that have real users and real impact — not just academic exercises.',
  },
  {
    title: 'Learn from Peers',
    description: 'Learn skills that aren\'t taught in classrooms — from design thinking to leadership to technical architecture.',
  },
  {
    title: 'Network & Grow',
    description: 'Connect with industry professionals, alumni, and a community of like-minded creators.',
  },
  {
    title: 'Lead & Mentor',
    description: 'Take ownership of projects and teams. Develop leadership skills by leading, not just following.',
  },
  {
    title: 'Create Memories',
    description: 'Some of the best college memories come from working on something you care about with people you respect.',
  },
  {
    title: 'Stand Out',
    description: 'A portfolio of real work, event experience, and leadership roles that set you apart in any application.',
  },
];

// ── FAQ ──
export const JOIN_FAQ = [
  {
    question: 'Who can join GWD?',
    answer: 'Any currently enrolled student at NIT, regardless of department or year, can apply to join GWD.',
  },
  {
    question: 'When do you recruit new members?',
    answer: 'We hold two recruitment drives each year — at the start of each semester. Follow our socials for announcements.',
  },
  {
    question: 'What\'s the selection process?',
    answer: 'We look for passion and willingness to contribute, not just technical skills. The process includes a short application form, a creative task, and an informal conversation.',
  },
  {
    question: 'How much time commitment is expected?',
    answer: 'We expect members to contribute 5-8 hours per week. This includes meetings, project work, and event preparation.',
  },
  {
    question: 'Do I need prior experience?',
    answer: 'No. We value curiosity and willingness to learn over existing skills. Many of our best members started with zero experience.',
  },
];
