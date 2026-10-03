-- ============================================================
-- GWD — Extended Schema (Phase 2)
-- Run this AFTER 001_initial_schema.sql
-- ============================================================

-- ── 1. CONNECT REQUESTS (Institutional Partnership Requests) ──
CREATE TABLE IF NOT EXISTS public.connect_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type text NOT NULL CHECK (request_type IN (
    'bring_to_college', 'collaborate', 'host_event', 'community_partnership', 'invite_gwd'
  )),
  status text NOT NULL DEFAULT 'new' CHECK (status IN (
    'new', 'reviewing', 'contacted', 'in_discussion', 'approved', 'completed', 'declined', 'archived'
  )),
  full_name text NOT NULL,
  role_designation text,
  email text NOT NULL,
  phone text,
  requester_type text,
  institution_name text NOT NULL,
  institution_website text,
  city text,
  state text,
  country text DEFAULT 'India',
  proposal text,
  internal_notes text,
  assigned_poc text,
  custom_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.connect_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit connect requests"
  ON public.connect_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage connect requests"
  ON public.connect_requests FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── 2. GALLERY ITEMS (Curated Gallery for Public Display) ──
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  src text NOT NULL,
  caption text,
  category text NOT NULL DEFAULT 'general',
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published gallery items public read"
  ON public.gallery_items FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage gallery items"
  ON public.gallery_items FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── 3. COLLABORATION SHOWCASES (Public Partnership Display) ──
CREATE TABLE IF NOT EXISTS public.collaboration_showcases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  collab_type text,
  year text,
  description text,
  outcome text,
  logo text,
  image text,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.collaboration_showcases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published collaborations public read"
  ON public.collaboration_showcases FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage collaboration showcases"
  ON public.collaboration_showcases FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── 4. AUDIT TRIGGERS for new tables ──
CREATE TRIGGER trg_audit_connect_requests
  AFTER INSERT OR UPDATE OR DELETE ON public.connect_requests
  FOR EACH ROW EXECUTE FUNCTION public.record_audit_log();

CREATE TRIGGER trg_audit_gallery_items
  AFTER INSERT OR UPDATE OR DELETE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.record_audit_log();

CREATE TRIGGER trg_audit_collaboration_showcases
  AFTER INSERT OR UPDATE OR DELETE ON public.collaboration_showcases
  FOR EACH ROW EXECUTE FUNCTION public.record_audit_log();

-- ── 5. UPDATE TEAM MEMBERS WITH REAL GWD DATA ──
-- (The initial seed had placeholder names)
UPDATE public.team_members SET
  name = 'Aldrin Paul',
  bio = 'Leading GWD with a clear conviction: the highest-velocity learning happens when you stop theorizing and start shipping real work.',
  quote = 'Ideas are worthless until they are built and shipped.',
  photo_url = '/team/president.jpg'
WHERE sort_order = 1;

UPDATE public.team_members SET
  name = 'Mohd Ismail',
  bio = 'Drives operational discipline, sprint roadmaps, and cross-functional alignment across all collective divisions.',
  quote = 'Execution is the only currency that matters.'
WHERE sort_order = 2;

UPDATE public.team_members SET
  name = 'Shravya',
  bio = 'Coordinates club administration, member onboarding, internal governance, and transparent documentation.',
  quote = 'Clarity and operational rigor turn momentum into lasting impact.',
  photo_url = '/team/general-secretary.jpg'
WHERE sort_order = 3;

UPDATE public.team_members SET
  name = 'Deekshit Katikaneni',
  bio = 'Architecting digital platforms, open-source systems, and production software. Mentoring technical builders to industry standards.',
  quote = 'Ship cleanly, architect for scale, and iterate fearlessly.',
  photo_url = '/team/technical-lead.png'
WHERE sort_order = 4;

UPDATE public.team_members SET
  name = 'Nishta Gaur',
  bio = 'Directs visual systems, design tokens, brand identities, and editorial storytelling across all touchpoints.',
  quote = 'Design gives form, intention, and clarity to technology.'
WHERE sort_order = 5;

UPDATE public.team_members SET
  name = 'Anvita Reddy',
  bio = 'Amplifies GWD launches, builder campaigns, distribution networks, and digital storytelling across channels.',
  quote = 'Great products deserve distribution that matches their craft.'
WHERE sort_order = 6;

UPDATE public.team_members SET
  name = 'Bhavya Koduri',
  bio = 'Directs hackathons, summits, and campus showcases with seamless stage execution and attendee experience.',
  quote = 'Every interaction and stage moment shapes the collective memory.',
  photo_url = '/team/event-management-lead.jpg'
WHERE sort_order = 7;

UPDATE public.team_members SET
  name = 'Tuba Azeem',
  bio = 'Directs external relations, institutional liaison, corporate outreach, and media communications.',
  quote = 'Meaningful partnerships compound when built on mutual trust.'
WHERE sort_order = 8;

UPDATE public.team_members SET
  name = 'Burhan Uddin',
  bio = 'Captures the builder journey through cinematic photography, documentaries, live event recaps, and visual media.',
  quote = 'Document the struggle and the craft with unvarnished honesty.'
WHERE sort_order = 9;

-- ── 6. SEED SITE SETTINGS WITH REAL GWD DATA ──
INSERT INTO public.site_settings (key, value) VALUES
  ('hero', '{
    "headline": "Your Vision. Our Expertise.",
    "subheadline": "GWD is a student-founded technology and creative powerhouse that turns ideas into shipped work — tech, design, and everything between.",
    "tagline": "GET WORK DONE.",
    "badge": "Student Collective · Est. March 2024",
    "primaryCtaText": "See Our Work",
    "primaryCtaHref": "/work",
    "secondaryCtaText": "Join the Collective",
    "secondaryCtaHref": "/join"
  }'::jsonb),
  ('footer', '{
    "tagline": "Your Vision. Our Expertise.",
    "address": "GWD Global Pvt. Ltd., Madhapur, Hyderabad, Telangana 500081 · GWD Club at VJIT, Hyderabad",
    "inception": "March 2024",
    "email": "contact@gwd-club.com",
    "phone": "+91 91212 99800",
    "cin": "U63999TS2025PTC199800",
    "gstin": "36AAMCG1250H1ZP"
  }'::jsonb),
  ('social_links', '{
    "instagram": "https://www.instagram.com/gwdclub.vjit/",
    "linkedin": "https://linkedin.com/company/gwd-global",
    "twitter": "https://twitter.com/gwdclub",
    "github": "https://github.com/gwdclub"
  }'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- ── 7. SEED GALLERY WITH REAL GWD IMAGES ──
INSERT INTO public.gallery_items (src, caption, category, is_featured, sort_order, status) VALUES
  ('/img/visit-conversation.jpg', 'Student builder leads conducting tactical briefing and strategy on the turf', 'community', true, 1, 'published'),
  ('/img/visit-match.jpg', 'Competitive grassroots football match powered by GWD Sports digital management system', 'sports', true, 2, 'published'),
  ('/img/visit-team.jpg', 'Cross-functional student collective collaborating under tournament operations canopy', 'community', true, 3, 'published'),
  ('/img/visit-training.jpg', 'Athlete lineup and squad coordination through verified digital player passports', 'sports', true, 4, 'published'),
  ('/img/visit-workstation.jpg', 'Live event operations desk running real-time tournament scoring and field telemetry', 'projects', true, 5, 'published'),
  ('/img/visit-behind-scenes.jpg', 'Field infrastructure, sound engineering, and ground logistics deployed by GWD leads', 'events', true, 6, 'published'),
  ('/img/img2.jpg', 'Landmark GWD Club inauguration and student assembly at VJIT Campus', 'events', true, 7, 'published'),
  ('/img/img3.jpg', 'Intensive builder sprint and prototype testing session with student teams', 'projects', false, 8, 'published'),
  ('/img/img4.jpg', 'Product showcase and live system demonstration at campus auditorium', 'events', false, 9, 'published'),
  ('/img/vjit-inauguration.jpg', 'Successful Inauguration of GWD Club — Empowering Future Freelancers & Entrepreneurs at VJIT', 'events', true, 10, 'published'),
  ('/img/gwd-community-banner.jpeg', 'GWD Club student builder community and orientation assembly', 'community', true, 11, 'published'),
  ('/img/img1.jpg', 'GWD student leadership team and department directors', 'community', false, 12, 'published')
ON CONFLICT DO NOTHING;

-- ── 8. SEED COLLABORATION SHOWCASES ──
INSERT INTO public.collaboration_showcases (name, collab_type, year, description, outcome, logo, image, is_featured, sort_order, status) VALUES
  ('Hyderabad Super League', 'Sports OS & League Partner', '2025–Present',
   'GWD is the exclusive IT and digital partner powering the entire grassroots tournament operating system, player passports, and live league standings.',
   '10 clubs actively running on platform · Real-time scoring and standings',
   '/logos/hyderabad-super-league.png', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
   true, 1, 'published'),
  ('T-Hub & TGIC', 'Innovation & Incubation Body', '2024–Present',
   'Government innovation bodies and startup ecosystem backing GWD build velocity, student entrepreneurship, and product incubation.',
   'Incubation mentorship · Scaling support across Telangana',
   '/logos/t-hub.png', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
   true, 2, 'published'),
  ('Sreenidi Deccan FC', 'Football Academy Partner', '2025–Present',
   'Digital infrastructure partnership implementing academy management, attendance, and player development tracking.',
   'Academy operations digitized',
   '/logos/sreenidi-deccan-fc.png', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
   true, 3, 'published'),
  ('Edventure Park', 'Startup Ecosystem Partner', '2024–Present',
   'Collaborative cohort acceleration supporting student startup founders and rapid prototyping sprints.',
   'Student ventures incubated across cohorts',
   '/logos/edventure-park.png', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
   true, 4, 'published'),
  ('MasterGrade', 'Sports Education Partner', '2025',
   'Integration of curriculum tracking and athlete skill progression into the GWD Sports management ecosystem.',
   'Integrated skills evaluation framework',
   '/logos/mastergrade.png', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
   false, 5, 'published')
ON CONFLICT DO NOTHING;

-- ── 9. SEED TIMELINE WITH REAL DATA ──
DELETE FROM public.timeline_milestones;
INSERT INTO public.timeline_milestones (year, title, description, sort_order) VALUES
  (2024, 'A student initiative begins', 'A freelance collective connecting young talent with paid client work. Inception at VJIT Campus.', 1),
  (2024, 'Recognised in year one', 'Top 500 Upcoming Startups of Asia and Top 25 of India, by E-Cell Bombay.', 2),
  (2025, 'Officially incorporated', 'GWD Global Pvt. Ltd., registered with the MCA on 12 June. Office in Madhapur, Hyderabad.', 3),
  (2025, 'GWD Club launches at VJIT', 'The biggest club inauguration in VJIT''s 25-year history. 650+ active builder network.', 4),
  (2026, 'GWD Sports goes live', 'Our first product line, and a company now working across 10 countries. Hyderabad Super League Live.', 5);
