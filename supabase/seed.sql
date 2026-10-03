-- ============================================================
-- GWD — GET WORK DONE: Seed Data (Phase 1)
-- ============================================================

-- ── 1. FIXED NINE-SLOT TEAM MEMBERS ──
INSERT INTO public.team_members (sort_order, role_title, name, photo_url, bio, quote, social_links, active, tier)
VALUES
  (
    1,
    'President',
    'Club Lead',
    '/team/president.jpg',
    'Directs strategic vision and organizational execution across all departments.',
    'Ideas are worthless until they are built and shipped.',
    '{"linkedin": "https://linkedin.com", "github": "https://github.com"}'::jsonb,
    true,
    'lead'
  ),
  (
    2,
    'Vice President',
    'Vice President',
    NULL,
    'Drives internal alignment and operational excellence across initiatives.',
    'Focus is about saying no to good ideas to pursue great executions.',
    '{}'::jsonb,
    true,
    'lead'
  ),
  (
    3,
    'General Secretary',
    'General Secretary',
    '/team/general-secretary.jpg',
    'Oversees organizational operations, administration, and inter-team alignment.',
    'Execution eats strategy for breakfast every single day.',
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    true,
    'lead'
  ),
  (
    4,
    'Technical Lead',
    'Technical Lead',
    '/team/technical-lead.png',
    'Architects digital infrastructure, engineering projects, and code standards.',
    'Build reliable systems that compound value over time.',
    '{"github": "https://github.com", "twitter": "https://twitter.com"}'::jsonb,
    true,
    'core'
  ),
  (
    5,
    'Creative Lead',
    'Creative Lead',
    NULL,
    'Shapes the brand aesthetic, visual storytelling, and design ethos of GWD.',
    'Design is not just how it looks, but how clearly it communicates.',
    '{}'::jsonb,
    true,
    'core'
  ),
  (
    6,
    'Marketing Lead',
    'Marketing Lead',
    NULL,
    'Leads growth distribution, outreach campaigns, and audience engagement.',
    'The best product wins only when people know it exists.',
    '{}'::jsonb,
    true,
    'core'
  ),
  (
    7,
    'Event Management Lead',
    'Event Management Lead',
    '/team/event-management-lead.jpg',
    'Directs large-scale production, logistics, and on-ground execution.',
    'Every detail of an event shapes the attendee experience.',
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    true,
    'core'
  ),
  (
    8,
    'PR Lead',
    'PR Lead',
    NULL,
    'Manages press relations, industry outreach, and corporate partnerships.',
    'Relationships and trust are the currency of long-term impact.',
    '{}'::jsonb,
    true,
    'core'
  ),
  (
    9,
    'Visual Media Lead',
    'Visual Media Lead',
    NULL,
    'Directs cinematography, photography, motion design, and archival media.',
    'Capture the raw energy of builders at work.',
    '{}'::jsonb,
    true,
    'core'
  )
ON CONFLICT (sort_order) DO UPDATE SET
  role_title = EXCLUDED.role_title,
  photo_url = EXCLUDED.photo_url;

-- ── 2. SITE SETTINGS ──
INSERT INTO public.site_settings (key, value)
VALUES
  (
    'hero',
    '{
      "headline": "GET WORK DONE.",
      "tagline": "A student collective that turns ideas into shipped work — tech, design, and everything between.",
      "video_url": "/gwd-hero.mp4"
    }'::jsonb
  ),
  (
    'stats',
    '[
      {"label": "Events", "value": 48, "suffix": "+"},
      {"label": "Projects", "value": 32, "suffix": ""},
      {"label": "Members", "value": 120, "suffix": "+"},
      {"label": "Collaborations", "value": 15, "suffix": ""}
    ]'::jsonb
  ),
  (
    'contact',
    '{
      "email": "hello@gwd.club",
      "phone": "+91 98765 43210",
      "college": "National Institute of Technology",
      "address": "Student Activity Center, NIT Campus, Block C"
    }'::jsonb
  ),
  (
    'socials',
    '{
      "instagram": "https://www.instagram.com/gwdclub.vjit/",
      "twitter": "https://twitter.com/gwdclub",
      "linkedin": "https://linkedin.com/company/gwdclub",
      "youtube": "https://youtube.com/@gwdclub",
      "github": "https://github.com/gwdclub"
    }'::jsonb
  )
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value;

-- ── 3. TIMELINE MILESTONES (For /about) ──
INSERT INTO public.timeline_milestones (year, title, description, sort_order)
VALUES
  (2019, 'Founding Genesis', 'GWD was founded by 6 engineers and designers passionate about shipping real projects.', 1),
  (2021, 'First National Hackathon', 'Hosted HACK-GWD with over 500 participants across 30 institutions.', 2),
  (2023, 'Open Source Initiative', 'Launched GWD Labs with 8 public repositories adopted by the student community.', 3),
  (2024, 'Design & Media Expansion', 'Expanded into creative media production and brand identity consultation.', 4),
  (2025, 'Venture Accelerator Track', 'Incubated 4 student startups that achieved pre-seed angel funding.', 5),
  (2026, 'The Collective Today', 'Over 120 active members shipping technology, design, and creative work at scale.', 6)
ON CONFLICT DO NOTHING;
