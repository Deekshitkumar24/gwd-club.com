-- ============================================================
-- GWD — GET WORK DONE: Initial Database Schema (Phase 1)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. PROFILES & ROLES ──
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('superadmin', 'admin', 'editor')) DEFAULT 'editor',
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper functions for admin checks (SECURITY DEFINER with strict search_path)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'editor')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'superadmin'
  );
$$;

-- Revoke default public execute and grant strictly
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_superadmin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_superadmin() TO authenticated, anon;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Superadmin can manage profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_superadmin())
  WITH CHECK (public.is_superadmin());

CREATE POLICY "Users can update own profile name"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role IS NOT DISTINCT FROM (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- ── 2. AUDIT LOG ──
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION public.record_audit_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.audit_log (actor_id, action, table_name, record_id, old_data, new_data)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text, NULL),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.record_audit_log() FROM PUBLIC;

-- ── 3. SITE SETTINGS ──
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings public read"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE TRIGGER trg_audit_site_settings
  AFTER INSERT OR UPDATE OR DELETE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.record_audit_log();

-- ── 4. TEAM MEMBERS (Fixed 9 Slots with Hierarchy Lock) ──
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order integer NOT NULL UNIQUE CHECK (sort_order BETWEEN 1 AND 9),
  role_title text NOT NULL,
  name text NOT NULL DEFAULT '',
  photo_url text,
  bio text,
  quote text,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  active boolean NOT NULL DEFAULT true,
  tier text NOT NULL DEFAULT 'core' CHECK (tier IN ('core', 'lead', 'faculty')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members public read"
  ON public.team_members FOR SELECT
  TO anon, authenticated
  USING (active = true OR public.is_admin());

CREATE POLICY "Admins can update team members"
  ON public.team_members FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Clarification 3: Team lock trigger
CREATE OR REPLACE FUNCTION public.check_team_member_lock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF NOT public.is_superadmin() THEN
      RAISE EXCEPTION 'Only superadmin can delete team member slots.';
    END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF (NEW.sort_order <> OLD.sort_order OR NEW.role_title <> OLD.role_title) AND NOT public.is_superadmin() THEN
      RAISE EXCEPTION 'Only superadmin can change sort_order or role_title.';
    END IF;
    NEW.updated_at = now();
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_team_member_lock() FROM PUBLIC;

CREATE TRIGGER trg_team_member_lock
  BEFORE UPDATE OR DELETE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.check_team_member_lock();

CREATE TRIGGER trg_audit_team_members
  AFTER INSERT OR UPDATE OR DELETE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.record_audit_log();

-- ── 5. EVENTS ──
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  cover_image text,
  event_date timestamptz NOT NULL,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'cancelled')),
  registration_deadline timestamptz,
  capacity integer CHECK (capacity > 0),
  is_registration_open boolean NOT NULL DEFAULT false,
  custom_fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published events public read"
  ON public.events FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE TRIGGER trg_audit_events
  AFTER INSERT OR UPDATE OR DELETE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.record_audit_log();

-- ── 6. REGISTRATIONS ──
CREATE TABLE IF NOT EXISTS public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  college text,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  attended boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_registrations_event_email UNIQUE (event_id, email)
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Anonymous users cannot SELECT registrations
CREATE POLICY "Admins can view registrations"
  ON public.registrations FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update registrations"
  ON public.registrations FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Secure atomic registration function (Clarification 4)
CREATE OR REPLACE FUNCTION public.register_for_event(
  p_event_id uuid,
  p_name text,
  p_email text,
  p_phone text DEFAULT NULL,
  p_college text DEFAULT NULL,
  p_answers jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_event public.events%ROWTYPE;
  v_count integer;
  v_reg_id uuid;
BEGIN
  -- Lock event row
  SELECT * INTO v_event
  FROM public.events
  WHERE id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found.';
  END IF;

  IF v_event.status <> 'published' THEN
    RAISE EXCEPTION 'This event is not published.';
  END IF;

  IF NOT v_event.is_registration_open THEN
    RAISE EXCEPTION 'Registration is currently closed for this event.';
  END IF;

  IF v_event.registration_deadline IS NOT NULL AND now() > v_event.registration_deadline THEN
    RAISE EXCEPTION 'Registration deadline has passed.';
  END IF;

  IF v_event.capacity IS NOT NULL THEN
    SELECT count(*) INTO v_count
    FROM public.registrations
    WHERE event_id = p_event_id;

    IF v_count >= v_event.capacity THEN
      RAISE EXCEPTION 'Event capacity has been reached.';
    END IF;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.registrations
    WHERE event_id = p_event_id AND email = LOWER(TRIM(p_email))
  ) THEN
    RAISE EXCEPTION 'This email is already registered for this event.';
  END IF;

  INSERT INTO public.registrations (
    event_id, name, email, phone, college, answers
  ) VALUES (
    p_event_id, TRIM(p_name), LOWER(TRIM(p_email)), TRIM(p_phone), TRIM(p_college), p_answers
  ) RETURNING id INTO v_reg_id;

  RETURN jsonb_build_object(
    'success', true,
    'registration_id', v_reg_id,
    'event_title', v_event.title
  );
END;
$$;

-- Revoke default public execute, grant to anon & authenticated
REVOKE EXECUTE ON FUNCTION public.register_for_event FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_for_event(uuid, text, text, text, text, jsonb) TO anon, authenticated;

-- ── 7. APPLICATIONS ──
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  department text,
  year_of_study text,
  role_interests text[] NOT NULL DEFAULT '{}'::text[],
  portfolio_url text,
  why_join text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit application"
  ON public.applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view and manage applications"
  ON public.applications FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── 8. COLLABORATORS (Clarification 1) ──
CREATE TABLE IF NOT EXISTS public.collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  organization text NOT NULL,
  email text NOT NULL,
  proposal text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'partnered', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit collaboration"
  ON public.collaborators FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view collaborators"
  ON public.collaborators FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── 9. WORKS (Projects) ──
CREATE TABLE IF NOT EXISTS public.works (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  year integer NOT NULL,
  category text NOT NULL,
  summary text NOT NULL,
  cover_image text,
  gallery text[] NOT NULL DEFAULT '{}'::text[],
  case_study jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published works public read"
  ON public.works FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage works"
  ON public.works FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE TRIGGER trg_audit_works
  AFTER INSERT OR UPDATE OR DELETE ON public.works
  FOR EACH ROW EXECUTE FUNCTION public.record_audit_log();

-- ── 10. TIMELINE MILESTONES (Clarification 2) ──
CREATE TABLE IF NOT EXISTS public.timeline_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.timeline_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Milestones public read"
  ON public.timeline_milestones FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage milestones"
  ON public.timeline_milestones FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── 11. CONTACT MESSAGES ──
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit contact message"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── 12. MEDIA METADATA & STORAGE BUCKET CONFIGURATION (Clarification 6) ──
CREATE TABLE IF NOT EXISTS public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  url text NOT NULL,
  alt_text text,
  album text,
  width integer,
  height integer,
  file_size integer CHECK (file_size <= 5242880), -- 5MB limit
  mime_type text CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif')),
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media public read"
  ON public.media FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage media"
  ON public.media FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Storage Bucket Configuration (enforcing 5MB and image MIME types at bucket level)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];

CREATE POLICY "Public media bucket read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');

CREATE POLICY "Admin media bucket upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admin media bucket update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admin media bucket delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());
