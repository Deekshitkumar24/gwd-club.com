'use server';

/**
 * GWD — CMS Server Actions
 * Every mutation writes to the production Supabase database.
 * Includes targeted cache revalidation so public pages show updated content.
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ── Helpers ──

async function getAuthenticatedClient(): Promise<any> {
  const supabase = (await createClient()) as any;
  if (!supabase) throw new Error('Database not configured');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return supabase;
}

function revalidatePublic(...paths: string[]) {
  for (const p of paths) {
    revalidatePath(p);
  }
  revalidatePath('/'); // homepage always
}

// ── Team Members ──

export async function updateTeamMember(id: string, patch: Record<string, unknown>) {
  const supabase = await getAuthenticatedClient();
  const dbPatch: Record<string, unknown> = {};
  if (patch.name !== undefined) dbPatch.name = patch.name;
  if (patch.role !== undefined) dbPatch.role_title = patch.role;
  if (patch.bio !== undefined) dbPatch.bio = patch.bio;
  if (patch.quote !== undefined) dbPatch.quote = patch.quote;
  if (patch.photo !== undefined) dbPatch.photo_url = patch.photo;
  if (patch.hasCustomPhoto !== undefined && !patch.photo) dbPatch.photo_url = null;
  if (patch.status !== undefined) dbPatch.active = patch.status === 'Published';
  if (patch.socials !== undefined) dbPatch.social_links = patch.socials;
  if (patch.tier !== undefined) dbPatch.tier = patch.tier;

  if (Object.keys(dbPatch).length === 0) return { success: true };

  const { error } = await supabase.from('team_members').update(dbPatch as any).eq('id', id);
  if (error) throw new Error(`Failed to update team member: ${error.message}`);

  revalidatePublic('/team', `/team/${id}`);
  return { success: true };
}

// ── Events ──

export async function createEventAction(data: Record<string, unknown>) {
  const supabase = await getAuthenticatedClient();
  const slug = (data.title as string || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const { error } = await supabase.from('events').insert({
    title: data.title as string,
    slug,
    description: data.description as string || '',
    cover_image: (data.image as string) || null,
    event_date: data.date as string || new Date().toISOString(),
    location: data.location as string || '',
    status: 'draft',
    is_registration_open: (data.registrationOpen as boolean) || false,
    capacity: (data.capacity as number) || null,
    registration_deadline: (data.registrationDeadline as string) || null,
    custom_fields: {
      time: data.time,
      shortDescription: data.shortDescription,
      category: data.category,
      venue: data.venue,
      featured: data.featured,
      schedule: data.schedule,
      faq: data.faq,
      collaborators: data.collaborators,
      speakers: data.speakers,
      eligibility: data.eligibility,
      instructions: data.instructions,
    } as any,
  } as any);
  if (error) throw new Error(`Failed to create event: ${error.message}`);
  revalidatePublic('/events');
  return { success: true, slug };
}

export async function updateEventAction(id: string, patch: Record<string, unknown>) {
  const supabase = await getAuthenticatedClient();
  const dbPatch: Record<string, unknown> = {};

  if (patch.title !== undefined) dbPatch.title = patch.title;
  if (patch.description !== undefined) dbPatch.description = patch.description;
  if (patch.image !== undefined) dbPatch.cover_image = patch.image;
  if (patch.date !== undefined) dbPatch.event_date = patch.date;
  if (patch.location !== undefined) dbPatch.location = patch.location;
  if (patch.status !== undefined) dbPatch.status = (patch.status as string).toLowerCase();
  if (patch.registrationOpen !== undefined) dbPatch.is_registration_open = patch.registrationOpen;
  if (patch.capacity !== undefined) dbPatch.capacity = patch.capacity;
  if (patch.registrationDeadline !== undefined) dbPatch.registration_deadline = patch.registrationDeadline;

  // Custom fields
  const cfKeys = ['time', 'shortDescription', 'category', 'venue', 'featured', 'schedule', 'faq', 'collaborators', 'speakers', 'eligibility', 'instructions'];
  const cfPatch: Record<string, unknown> = {};
  let hasCf = false;
  for (const key of cfKeys) {
    if (patch[key] !== undefined) {
      cfPatch[key] = patch[key];
      hasCf = true;
    }
  }

  if (hasCf) {
    const { data: existing } = await supabase.from('events').select('custom_fields').eq('id', id).single();
    dbPatch.custom_fields = { ...((existing?.custom_fields as Record<string, unknown>) || {}), ...cfPatch } as any;
  }

  if (Object.keys(dbPatch).length === 0) return { success: true };

  const { error } = await supabase.from('events').update(dbPatch as any).eq('id', id);
  if (error) throw new Error(`Failed to update event: ${error.message}`);

  revalidatePublic('/events', `/events/${id}`);
  return { success: true };
}

export async function deleteEventAction(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete event: ${error.message}`);
  revalidatePublic('/events');
  return { success: true };
}

// ── Works / Projects ──

export async function createWorkAction(data: Record<string, unknown>) {
  const supabase = await getAuthenticatedClient();
  const slug = (data.title as string || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const { error } = await supabase.from('works').insert({
    title: data.title as string,
    slug,
    year: parseInt(data.year as string) || new Date().getFullYear(),
    category: data.category as string || 'technology',
    summary: data.summary as string || data.tagline as string || '',
    cover_image: (data.coverImage as string) || (data.image as string) || null,
    gallery: (data.gallery as string[]) || [],
    case_study: {
      client: data.client,
      role: data.role,
      duration: data.duration,
      team: data.team,
      challenge: data.challenge,
      solution: data.solution,
      results: data.results,
      techStack: data.techStack,
      liveUrl: data.liveUrl,
      sourceUrl: data.sourceUrl,
      featured: data.featured,
    } as any,
    sort_order: (data.sortOrder as number) || 0,
    is_published: data.status === 'Published',
  } as any);
  if (error) throw new Error(`Failed to create work: ${error.message}`);
  revalidatePublic('/work');
  return { success: true, slug };
}

export async function updateWorkAction(id: string, patch: Record<string, unknown>) {
  const supabase = await getAuthenticatedClient();
  const dbPatch: Record<string, unknown> = {};

  if (patch.title !== undefined) dbPatch.title = patch.title;
  if (patch.year !== undefined) dbPatch.year = parseInt(patch.year as string);
  if (patch.category !== undefined) dbPatch.category = patch.category;
  if (patch.summary !== undefined) dbPatch.summary = patch.summary;
  if (patch.tagline !== undefined && !patch.summary) dbPatch.summary = patch.tagline;
  if (patch.coverImage !== undefined) dbPatch.cover_image = patch.coverImage;
  if (patch.image !== undefined && !patch.coverImage) dbPatch.cover_image = patch.image;
  if (patch.gallery !== undefined) dbPatch.gallery = patch.gallery;
  if (patch.status !== undefined) dbPatch.is_published = patch.status === 'Published';
  if (patch.sortOrder !== undefined) dbPatch.sort_order = patch.sortOrder;

  const csKeys = ['client', 'role', 'duration', 'team', 'challenge', 'solution', 'results', 'techStack', 'liveUrl', 'sourceUrl', 'featured'];
  const csPatch: Record<string, unknown> = {};
  let hasCs = false;
  for (const key of csKeys) {
    if (patch[key] !== undefined) { csPatch[key] = patch[key]; hasCs = true; }
  }

  if (hasCs) {
    const { data: existing } = await supabase.from('works').select('case_study').eq('id', id).single();
    dbPatch.case_study = { ...((existing?.case_study as Record<string, unknown>) || {}), ...csPatch } as any;
  }

  if (Object.keys(dbPatch).length === 0) return { success: true };

  const { error } = await supabase.from('works').update(dbPatch as any).eq('id', id);
  if (error) throw new Error(`Failed to update work: ${error.message}`);

  revalidatePublic('/work', `/work/${id}`);
  return { success: true };
}

export async function deleteWorkAction(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('works').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete work: ${error.message}`);
  revalidatePublic('/work');
  return { success: true };
}

// ── Gallery ──

export async function createGalleryItemAction(data: Record<string, unknown>) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('gallery_items').insert({
    src: data.src as string,
    caption: (data.caption as string) || null,
    category: (data.category as string) || 'general',
    is_featured: (data.featured as boolean) || false,
    sort_order: (data.sort_order as number) || 0,
    status: 'published',
  } as any);
  if (error) throw new Error(`Failed to create gallery item: ${error.message}`);
  revalidatePublic('/gallery');
  return { success: true };
}

export async function updateGalleryItemAction(id: string, patch: Record<string, unknown>) {
  const supabase = await getAuthenticatedClient();
  const dbPatch: Record<string, unknown> = {};
  if (patch.src !== undefined) dbPatch.src = patch.src;
  if (patch.caption !== undefined) dbPatch.caption = patch.caption;
  if (patch.category !== undefined) dbPatch.category = patch.category;
  if (patch.featured !== undefined) dbPatch.is_featured = patch.featured;
  if (patch.status !== undefined) dbPatch.status = (patch.status as string).toLowerCase();

  const { error } = await supabase.from('gallery_items').update(dbPatch as any).eq('id', id);
  if (error) throw new Error(`Failed to update gallery item: ${error.message}`);
  revalidatePublic('/gallery');
  return { success: true };
}

export async function deleteGalleryItemAction(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete gallery item: ${error.message}`);
  revalidatePublic('/gallery');
  return { success: true };
}

// ── Timeline ──

export async function createTimelineMilestoneAction(data: Record<string, unknown>) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('timeline_milestones').insert({
    year: parseInt(data.year as string) || new Date().getFullYear(),
    title: data.title as string,
    description: data.description as string,
    sort_order: (data.sort_order as number) || 0,
  } as any);
  if (error) throw new Error(`Failed to create milestone: ${error.message}`);
  revalidatePublic('/about');
  return { success: true };
}

export async function updateTimelineMilestoneAction(id: string, patch: Record<string, unknown>) {
  const supabase = await getAuthenticatedClient();
  const dbPatch: Record<string, unknown> = {};
  if (patch.year !== undefined) dbPatch.year = parseInt(patch.year as string);
  if (patch.title !== undefined) dbPatch.title = patch.title;
  if (patch.description !== undefined) dbPatch.description = patch.description;
  if (patch.sort_order !== undefined) dbPatch.sort_order = patch.sort_order;

  const { error } = await supabase.from('timeline_milestones').update(dbPatch as any).eq('id', id);
  if (error) throw new Error(`Failed to update milestone: ${error.message}`);
  revalidatePublic('/about');
  return { success: true };
}

export async function deleteTimelineMilestoneAction(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('timeline_milestones').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete milestone: ${error.message}`);
  revalidatePublic('/about');
  return { success: true };
}

// ── Collaboration Showcases ──

export async function createCollaborationAction(data: Record<string, unknown>) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('collaboration_showcases').insert({
    name: data.name as string,
    collab_type: (data.type as string) || null,
    year: (data.year as string) || null,
    description: (data.description as string) || null,
    outcome: (data.outcome as string) || null,
    logo: (data.logo as string) || null,
    image: (data.image as string) || null,
    is_featured: (data.featured as boolean) || false,
    status: 'published',
  } as any);
  if (error) throw new Error(`Failed to create collaboration: ${error.message}`);
  revalidatePublic('/collaborations');
  return { success: true };
}

export async function updateCollaborationAction(id: string, patch: Record<string, unknown>) {
  const supabase = await getAuthenticatedClient();
  const dbPatch: Record<string, unknown> = {};
  if (patch.name !== undefined) dbPatch.name = patch.name;
  if (patch.type !== undefined) dbPatch.collab_type = patch.type;
  if (patch.year !== undefined) dbPatch.year = patch.year;
  if (patch.description !== undefined) dbPatch.description = patch.description;
  if (patch.outcome !== undefined) dbPatch.outcome = patch.outcome;
  if (patch.logo !== undefined) dbPatch.logo = patch.logo;
  if (patch.image !== undefined) dbPatch.image = patch.image;
  if (patch.featured !== undefined) dbPatch.is_featured = patch.featured;
  if (patch.status !== undefined) dbPatch.status = (patch.status as string).toLowerCase();

  const { error } = await supabase.from('collaboration_showcases').update(dbPatch as any).eq('id', id);
  if (error) throw new Error(`Failed to update collaboration: ${error.message}`);
  revalidatePublic('/collaborations');
  return { success: true };
}

export async function deleteCollaborationAction(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('collaboration_showcases').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete collaboration: ${error.message}`);
  revalidatePublic('/collaborations');
  return { success: true };
}

// ── Site Settings ──

export async function updateSiteSettingAction(key: string, value: unknown) {
  const supabase = await getAuthenticatedClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from('site_settings').upsert({
    key,
    value: value as any,
    updated_by: user?.id || null,
    updated_at: new Date().toISOString(),
  } as any);
  if (error) throw new Error(`Failed to update setting '${key}': ${error.message}`);
  revalidatePublic('/');
  return { success: true };
}

// ── Contact Messages (Public submission) ──

export async function submitContactMessage(data: { name: string; email: string; subject: string; message: string }) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Database not configured');

  const { error } = await supabase.from('contact_messages').insert({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
  } as any);
  if (error) throw new Error(`Failed to send message: ${error.message}`);
  return { success: true };
}

// ── Applications (Public submission) ──

export async function submitApplication(data: Record<string, unknown>) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Database not configured');

  const { error } = await supabase.from('applications').insert({
    name: data.name as string,
    email: data.email as string,
    phone: (data.phone as string) || null,
    department: (data.department as string) || null,
    year_of_study: (data.year as string) || null,
    role_interests: (data.roleInterests as string[]) || [],
    portfolio_url: (data.portfolio as string) || null,
    why_join: (data.why as string) || null,
  } as any);
  if (error) throw new Error(`Failed to submit application: ${error.message}`);
  return { success: true };
}

// ── Connect Requests (Public submission) ──

export async function submitConnectRequest(data: Record<string, unknown>) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Database not configured');

  const { error } = await supabase.from('connect_requests').insert({
    request_type: data.requestType as string,
    full_name: data.fullName as string,
    role_designation: (data.roleDesignation as string) || null,
    email: data.email as string,
    phone: (data.phone as string) || null,
    requester_type: (data.requesterType as string) || null,
    institution_name: data.institutionName as string,
    institution_website: (data.institutionWebsite as string) || null,
    city: (data.city as string) || null,
    state: (data.state as string) || null,
    country: (data.country as string) || 'India',
    proposal: (data.proposal as string) || null,
  } as any);
  if (error) throw new Error(`Failed to submit connect request: ${error.message}`);
  return { success: true };
}

// ── Event Registration (Public, uses RPC for atomic registration) ──

export async function registerForEvent(data: {
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  answers?: Record<string, unknown>;
}) {
  const supabase = (await createClient()) as any;
  if (!supabase) throw new Error('Database not configured');

  const { data: result, error } = await supabase.rpc('register_for_event', {
    p_event_id: data.eventId,
    p_name: data.name,
    p_email: data.email,
    p_phone: data.phone || null,
    p_college: data.college || null,
    p_answers: (data.answers || {}) as any,
  });

  if (error) throw new Error(error.message);
  return { success: true, data: result };
}

// ── Universal CMS Data Loading (Supports Public Visitors & Authenticated Admins) ──

export async function loadAllCmsData() {
  const supabase = await createClient();
  if (!supabase) {
    return {
      teamMembers: [],
      events: [],
      works: [],
      galleryItems: [],
      timelineMilestones: [],
      collaborations: [],
      contactMessages: [],
      applications: [],
      registrations: [],
      connectRequests: [],
      siteSettings: {} as Record<string, unknown>,
      media: [],
    };
  }

  // Check if current user is an authenticated admin
  let isAdmin = false;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    isAdmin = !!user;
  } catch {
    isAdmin = false;
  }

  const [
    { data: teamMembers },
    { data: events },
    { data: works },
    { data: galleryItems },
    { data: timelineMilestones },
    { data: collaborations },
    { data: siteSettings },
    { data: media },
  ] = await Promise.all([
    supabase.from('team_members').select('*').order('sort_order'),
    supabase.from('events').select('*').order('event_date', { ascending: false }),
    supabase.from('works').select('*').order('sort_order'),
    supabase.from('gallery_items').select('*').order('sort_order'),
    supabase.from('timeline_milestones').select('*').order('sort_order'),
    supabase.from('collaboration_showcases').select('*').order('sort_order'),
    supabase.from('site_settings').select('*'),
    supabase.from('media').select('*').order('created_at', { ascending: false }),
  ]);

  let contactMessages: any[] = [];
  let applications: any[] = [];
  let registrations: any[] = [];
  let connectRequests: any[] = [];

  if (isAdmin) {
    const [
      { data: cm },
      { data: app },
      { data: reg },
      { data: cr },
    ] = await Promise.all([
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('applications').select('*').order('created_at', { ascending: false }),
      supabase.from('registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('connect_requests').select('*').order('created_at', { ascending: false }),
    ]);
    contactMessages = cm || [];
    applications = app || [];
    registrations = reg || [];
    connectRequests = cr || [];
  }

  const settings: Record<string, unknown> = {};
  for (const row of (siteSettings as any[]) || []) {
    settings[row.key] = row.value;
  }

  return {
    teamMembers: teamMembers || [],
    events: events || [],
    works: works || [],
    galleryItems: galleryItems || [],
    timelineMilestones: timelineMilestones || [],
    collaborations: collaborations || [],
    contactMessages,
    applications,
    registrations,
    connectRequests,
    siteSettings: settings,
    media: media || [],
  };
}

// ── Admin: Update message/application/registration status ──

export async function updateMessageStatusAction(id: string, isRead: boolean) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('contact_messages').update({ is_read: isRead } as any).eq('id', id);
  if (error) throw new Error(`Failed to update message: ${error.message}`);
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete message: ${error.message}`);
  return { success: true };
}

export async function updateApplicationStatusAction(id: string, status: string, notes?: string) {
  const supabase = await getAuthenticatedClient();
  const patch: Record<string, unknown> = { status };
  if (notes !== undefined) patch.notes = notes;
  const { error } = await supabase.from('applications').update(patch as any).eq('id', id);
  if (error) throw new Error(`Failed to update application: ${error.message}`);
  return { success: true };
}

export async function deleteApplicationAction(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('applications').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete application: ${error.message}`);
  return { success: true };
}

export async function updateRegistrationAction(id: string, attended: boolean) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('registrations').update({ attended } as any).eq('id', id);
  if (error) throw new Error(`Failed to update registration: ${error.message}`);
  return { success: true };
}

export async function deleteRegistrationAction(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('registrations').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete registration: ${error.message}`);
  return { success: true };
}

export async function updateConnectRequestStatusAction(id: string, status: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('connect_requests').update({
    status,
    updated_at: new Date().toISOString(),
  } as any).eq('id', id);
  if (error) throw new Error(`Failed to update connect request: ${error.message}`);
  return { success: true };
}

export async function deleteConnectRequestAction(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from('connect_requests').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete connect request: ${error.message}`);
  return { success: true };
}

// ── Admin: Logout ──

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  revalidatePath('/admin');
}
