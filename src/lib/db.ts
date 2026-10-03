/**
 * GWD — Server-Side Database Queries
 * All public page data fetching goes through this module.
 * Every function returns data from the production Supabase database.
 * No localStorage, no content.ts fallbacks for CMS-managed content.
 */

import { createClient } from '@/lib/supabase/server';
import type { LeaderSlot, EventItem, ProjectItem, Milestone, GalleryImage, CollaborationItem } from '@/data/content';

// ── Type Mappers: Database Rows → Application Types ──

interface DbTeamMember {
  id: string;
  sort_order: number;
  role_title: string;
  name: string;
  photo_url: string | null;
  bio: string | null;
  quote: string | null;
  social_links: Record<string, string>;
  active: boolean;
  tier: string;
}

function dbTeamToLeaderSlot(row: DbTeamMember): LeaderSlot {
  return {
    slot: row.sort_order,
    id: row.id,
    name: row.name,
    role: row.role_title,
    photo: row.photo_url || undefined,
    hasCustomPhoto: !!row.photo_url,
    bio: row.bio || '',
    quote: row.quote || undefined,
    deliverables: [],
    skills: [],
    socials: row.social_links || {},
    projects: [],
    tier: row.tier,
    status: row.active ? 'Published' : 'Draft',
  };
}

interface DbEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string | null;
  event_date: string;
  location: string;
  status: string;
  registration_deadline: string | null;
  capacity: number | null;
  is_registration_open: boolean;
  custom_fields: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

function dbEventToEventItem(row: DbEvent): EventItem {
  const cf = row.custom_fields || {};
  const eventDate = new Date(row.event_date);
  const isPast = eventDate < new Date();
  return {
    id: row.slug || row.id,
    title: row.title,
    date: row.event_date.split('T')[0],
    time: (cf.time as string) || eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    location: row.location,
    shortDescription: (cf.shortDescription as string) || row.description.slice(0, 200),
    description: row.description,
    image: row.cover_image || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&q=80',
    category: (cf.category as string) || 'Event',
    venue: (cf.venue as string) || row.location,
    registrationOpen: row.is_registration_open,
    registrationDeadline: row.registration_deadline || undefined,
    status: row.status as EventItem['status'],
    featured: (cf.featured as boolean) || false,
    capacity: row.capacity || undefined,
    year: eventDate.getFullYear().toString(),
    results: (cf.results as string) || undefined,
    highlights: (cf.highlights as string[]) || undefined,
    schedule: (cf.schedule as EventItem['schedule']) || undefined,
    faq: (cf.faq as EventItem['faq']) || undefined,
    collaborators: (cf.collaborators as string[]) || undefined,
    speakers: (cf.speakers as EventItem['speakers']) || undefined,
    gallery: (cf.gallery as string[]) || undefined,
    eligibility: (cf.eligibility as string) || undefined,
    instructions: (cf.instructions as string[]) || undefined,
    seo: (cf.seo as EventItem['seo']) || undefined,
    registrationStatus: row.is_registration_open ? 'Registration Open' : 'Registration Closed',
  };
}

interface DbWork {
  id: string;
  title: string;
  slug: string;
  year: number;
  category: string;
  summary: string;
  cover_image: string | null;
  gallery: string[];
  case_study: Record<string, unknown>;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

function dbWorkToProjectItem(row: DbWork): ProjectItem {
  const cs = row.case_study || {};
  return {
    id: row.slug || row.id,
    title: row.title,
    year: row.year.toString(),
    category: row.category,
    shortDescription: row.summary,
    description: (cs.description as string) || row.summary,
    outcome: (cs.outcome as string) || '',
    heroImage: row.cover_image || 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1400&q=80',
    beforeImage: (cs.beforeImage as string) || undefined,
    afterImage: (cs.afterImage as string) || undefined,
    images: row.gallery || [],
    tags: (cs.tags as string[]) || [],
    collaborators: (cs.collaborators as string[]) || undefined,
    partners: (cs.partners as string[]) || undefined,
    link: (cs.link as string) || undefined,
    featured: (cs.featured as boolean) || false,
    status: row.is_published ? 'Published' : 'Draft',
  };
}

interface DbGalleryItem {
  id: string;
  src: string;
  caption: string | null;
  category: string;
  is_featured: boolean;
  sort_order: number;
  status: string;
}

function dbGalleryToGalleryImage(row: DbGalleryItem): GalleryImage {
  return {
    id: row.id,
    src: row.src,
    caption: row.caption || '',
    category: row.category,
    featured: row.is_featured,
    status: row.status as GalleryImage['status'],
  };
}

interface DbTimeline {
  id: string;
  year: number;
  title: string;
  description: string;
  sort_order: number;
}

function dbTimelineToMilestone(row: DbTimeline): Milestone {
  return {
    date: row.year.toString(),
    year: row.year.toString(),
    title: row.title,
    description: row.description,
    achievement: row.title,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
  };
}

interface DbCollabShowcase {
  id: string;
  name: string;
  collab_type: string | null;
  year: string | null;
  description: string | null;
  outcome: string | null;
  logo: string | null;
  image: string | null;
  is_featured: boolean;
  sort_order: number;
  status: string;
}

function dbCollabToCollaborationItem(row: DbCollabShowcase): CollaborationItem {
  return {
    id: row.id,
    name: row.name,
    type: row.collab_type || '',
    year: row.year || '',
    description: row.description || '',
    outcome: row.outcome || '',
    logo: row.logo || '',
    image: row.image || '',
    featured: row.is_featured,
    status: row.status as CollaborationItem['status'],
  };
}

// ── Public Data Queries ──

export async function getPublishedTeamMembers(): Promise<LeaderSlot[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[db] Failed to fetch team members:', error.message);
    return [];
  }
  return (data || []).map(dbTeamToLeaderSlot);
}

export async function getTeamMemberById(id: string): Promise<LeaderSlot | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return dbTeamToLeaderSlot(data);
}

export async function getAllTeamMembers(): Promise<LeaderSlot[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[db] Failed to fetch all team members:', error.message);
    return [];
  }
  return (data || []).map(dbTeamToLeaderSlot);
}

export async function getPublishedEvents(): Promise<{ upcoming: EventItem[]; past: EventItem[] }> {
  const supabase = await createClient();
  if (!supabase) return { upcoming: [], past: [] };

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('event_date', { ascending: false });

  if (error) {
    console.error('[db] Failed to fetch events:', error.message);
    return { upcoming: [], past: [] };
  }

  const now = new Date();
  const events = (data || []).map(dbEventToEventItem);
  return {
    upcoming: events.filter((e) => new Date(e.date) >= now),
    past: events.filter((e) => new Date(e.date) < now),
  };
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return dbEventToEventItem(data);
}

export async function getPublishedWorks(): Promise<ProjectItem[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[db] Failed to fetch works:', error.message);
    return [];
  }
  return (data || []).map(dbWorkToProjectItem);
}

export async function getWorkBySlug(slug: string): Promise<ProjectItem | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) return null;
  return dbWorkToProjectItem(data);
}

export async function getPublishedGalleryItems(): Promise<GalleryImage[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[db] Failed to fetch gallery:', error.message);
    return [];
  }
  return (data || []).map(dbGalleryToGalleryImage);
}

export async function getPublishedTimeline(): Promise<Milestone[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('timeline_milestones')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[db] Failed to fetch timeline:', error.message);
    return [];
  }
  return (data || []).map(dbTimelineToMilestone);
}

export async function getPublishedCollaborations(): Promise<CollaborationItem[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('collaboration_showcases')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[db] Failed to fetch collaborations:', error.message);
    return [];
  }
  return (data || []).map(dbCollabToCollaborationItem);
}

export async function getSiteSetting<T = unknown>(key: string): Promise<T | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) return null;
  return (data as any).value as T;
}

export async function getAllSiteSettings(): Promise<Record<string, unknown>> {
  const supabase = await createClient();
  if (!supabase) return {};

  const { data, error } = await supabase.from('site_settings').select('key, value');

  if (error) {
    console.error('[db] Failed to fetch site settings:', error.message);
    return {};
  }

  const settings: Record<string, unknown> = {};
  for (const row of (data as any[]) || []) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function getEventRegistrationCount(eventId: string): Promise<number> {
  const supabase = await createClient();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId);

  if (error) return 0;
  return count || 0;
}

// ── Composite Queries for Pages ──

export async function getHomepageData() {
  const [teamMembers, events, works, collaborations, settings] = await Promise.all([
    getPublishedTeamMembers(),
    getPublishedEvents(),
    getPublishedWorks(),
    getPublishedCollaborations(),
    getAllSiteSettings(),
  ]);

  return {
    teamMembers,
    upcomingEvents: events.upcoming,
    pastEvents: events.past,
    works,
    collaborations,
    heroSettings: settings.hero as Record<string, string> | null,
    stats: settings.stats as Array<{ label: string; value: number; suffix: string; prefix?: string; desc: string }> | null,
    socialLinks: settings.social_links as Record<string, string> | null,
    footerSettings: settings.footer as Record<string, string> | null,
  };
}
