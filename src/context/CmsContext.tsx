'use client';

/**
 * GWD CMS Context — Production Version
 * 
 * This context provides the SAME interface as the original localStorage version
 * so the admin dashboard UI does not need to change. However, all data persistence
 * is now backed by Supabase server actions instead of localStorage.
 * 
 * PUBLIC PAGES DO NOT USE THIS CONTEXT. They fetch directly from the database
 * via server components. This context is ONLY used by the admin dashboard.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  GwdCmsStore,
  DEFAULT_CMS_STORE,
  DomainItem,
  RegistrationRecord,
  ApplicationRecord,
  ContactMessage,
  MediaRecord,
  WorkflowStepItem,
  AuditLogRecord,
  PageSeoRecord,
  ConnectRequestRecord,
  ConnectRequestStatus,
  FollowUpLogItem,
} from '@/lib/cms';
import { ProjectItem, EventItem, LeaderSlot, Milestone, GalleryImage, CollaborationItem } from '@/data/content';

// Import server actions
import {
  loadAllCmsData,
  updateTeamMember,
  createEventAction,
  updateEventAction,
  deleteEventAction,
  createWorkAction,
  updateWorkAction,
  deleteWorkAction,
  createGalleryItemAction,
  updateGalleryItemAction,
  deleteGalleryItemAction,
  createTimelineMilestoneAction,
  updateTimelineMilestoneAction,
  deleteTimelineMilestoneAction,
  createCollaborationAction,
  updateCollaborationAction,
  deleteCollaborationAction,
  updateSiteSettingAction,
  submitContactMessage,
  submitApplication,
  submitConnectRequest,
  updateMessageStatusAction,
  deleteMessageAction,
  updateApplicationStatusAction,
  deleteApplicationAction,
  updateRegistrationAction,
  deleteRegistrationAction,
  updateConnectRequestStatusAction,
  deleteConnectRequestAction,
  deleteMediaAction,
} from '@/app/admin/actions';

interface CmsContextType {
  store: GwdCmsStore;
  isLoaded: boolean;
  isSaving: boolean;
  lastError: string | null;
  clearError: () => void;
  updateHomepage: (patch: Partial<GwdCmsStore['homepage']>) => void;
  updateDomain: (id: string, patch: Partial<DomainItem>) => void;
  createDomain: (domain: DomainItem) => void;
  deleteDomain: (id: string) => void;
  updateProject: (id: string, patch: Partial<ProjectItem>) => void;
  createProject: (project: ProjectItem) => void;
  deleteProject: (id: string) => void;
  updateEvent: (id: string, patch: Partial<EventItem>) => void;
  createEvent: (event: EventItem) => void;
  deleteEvent: (id: string) => void;
  archiveEvent: (id: string) => void;
  updateLeader: (id: string, patch: Partial<LeaderSlot>) => void;
  createLeader: (leader: LeaderSlot) => void;
  deleteLeader: (id: string) => void;
  updateTimeline: (index: number, patch: Partial<Milestone>) => void;
  createTimeline: (milestone: Milestone) => void;
  deleteTimeline: (index: number) => void;
  updateGalleryItem: (id: string, patch: Partial<GalleryImage>) => void;
  createGalleryItem: (item: GalleryImage) => void;
  deleteGalleryItem: (id: string) => void;
  updateCollaboration: (id: string, patch: Partial<CollaborationItem>) => void;
  createCollaboration: (collab: CollaborationItem) => void;
  deleteCollaboration: (id: string) => void;
  updateWorkflowStep: (id: string, patch: Partial<WorkflowStepItem>) => void;
  createWorkflowStep: (step: WorkflowStepItem) => void;
  deleteWorkflowStep: (id: string) => void;
  addMedia: (media: MediaRecord) => void;
  deleteMedia: (id: string) => void;
  updateMedia: (id: string, patch: Partial<MediaRecord>) => void;
  addRegistration: (reg: Omit<RegistrationRecord, 'id' | 'registeredAt' | 'attendance'>) => RegistrationRecord;
  updateRegistrationStatus: (id: string, attended: boolean) => void;
  deleteRegistration: (id: string) => void;
  addApplication: (app: Omit<ApplicationRecord, 'id' | 'appliedAt' | 'status'>) => ApplicationRecord;
  updateApplicationStatus: (id: string, status: ApplicationRecord['status'], notes?: string) => void;
  deleteApplication: (id: string) => void;
  addMessage: (msg: Omit<ContactMessage, 'id' | 'receivedAt' | 'status'>) => ContactMessage;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => void;
  deleteMessage: (id: string) => void;
  addConnectRequest: (
    req: Omit<ConnectRequestRecord, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'followUpLogs'>
  ) => ConnectRequestRecord;
  updateConnectRequestStatus: (id: string, status: ConnectRequestStatus) => void;
  updateConnectRequest: (id: string, patch: Partial<ConnectRequestRecord>) => void;
  addConnectFollowUpLog: (id: string, log: Omit<FollowUpLogItem, 'id' | 'timestamp'>) => void;
  deleteConnectRequest: (id: string) => void;
  addAuditLog: (entry: Omit<AuditLogRecord, 'id' | 'timestamp'>) => void;
  updateSettings: (patch: Partial<GwdCmsStore['settings']>) => void;
  updatePageSeo: (pageKey: string, patch: Partial<PageSeoRecord>) => void;
  resetToDefaults: () => void;
}

const CmsContext = createContext<CmsContextType | null>(null);

// ── Helper: Convert DB rows to CmsStore shape ──
function dbDataToCmsStore(raw: Awaited<ReturnType<typeof loadAllCmsData>>): GwdCmsStore {
  const settings = raw.siteSettings || {};
  const homepage = (settings.homepage || {}) as GwdCmsStore['homepage'];
  const footerData = (settings.footer || {}) as GwdCmsStore['homepage']['footer'];

  const leaders: LeaderSlot[] = (raw.teamMembers || []).map((tm: Record<string, unknown>) => ({
    slot: tm.sort_order as number,
    id: tm.id as string,
    name: (tm.name as string) || '',
    role: (tm.role_title as string) || '',
    photo: (tm.photo_url as string) || undefined,
    hasCustomPhoto: !!(tm.photo_url),
    bio: (tm.bio as string) || '',
    quote: (tm.quote as string) || undefined,
    deliverables: [],
    skills: [],
    socials: (tm.social_links as Record<string, string>) || {},
    projects: [],
    tier: (tm.tier as string) || 'core',
    status: (tm.active as boolean) ? 'Published' : 'Draft',
  }));

  const events: EventItem[] = (raw.events || []).map((ev: Record<string, unknown>) => {
    const cf = (ev.custom_fields || {}) as Record<string, unknown>;
    return {
      id: (ev.slug as string) || (ev.id as string),
      title: (ev.title as string) || '',
      date: ((ev.event_date as string) || '').split('T')[0],
      time: (cf.time as string) || '',
      location: (ev.location as string) || '',
      shortDescription: (cf.shortDescription as string) || ((ev.description as string) || '').slice(0, 200),
      description: (ev.description as string) || '',
      image: (ev.cover_image as string) || '',
      category: (cf.category as string) || 'Event',
      venue: (cf.venue as string) || (ev.location as string) || '',
      registrationOpen: (ev.is_registration_open as boolean) || false,
      registrationDeadline: (ev.registration_deadline as string) || undefined,
      status: (ev.status === 'published' ? 'Published' : ev.status === 'archived' ? 'Archived' : ev.status === 'completed' ? 'Completed' : 'Draft') as EventItem['status'],
      featured: (cf.featured as boolean) || false,
      capacity: (ev.capacity as number) || undefined,
      year: new Date((ev.event_date as string) || '').getFullYear().toString(),
      schedule: cf.schedule as EventItem['schedule'],
      faq: cf.faq as EventItem['faq'],
      speakers: cf.speakers as EventItem['speakers'],
      gallery: cf.gallery as string[],
      eligibility: cf.eligibility as string,
      instructions: cf.instructions as string[],
      highlights: cf.highlights as string[],
      results: cf.results as string,
      seo: cf.seo as EventItem['seo'],
      registrationStatus: (ev.is_registration_open as boolean) ? 'Registration Open' : 'Registration Closed',
    };
  });

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
  const pastEvents = events.filter(e => new Date(e.date) < new Date());

  const projects: ProjectItem[] = (raw.works || []).map((w: Record<string, unknown>) => {
    const cs = (w.case_study || {}) as Record<string, unknown>;
    return {
      id: (w.slug as string) || (w.id as string),
      title: (w.title as string) || '',
      year: ((w.year as number) || new Date().getFullYear()).toString(),
      category: (w.category as string) || '',
      shortDescription: (w.summary as string) || '',
      description: (cs.description as string) || (w.summary as string) || '',
      outcome: (cs.outcome as string) || '',
      heroImage: (w.cover_image as string) || '',
      images: (w.gallery as string[]) || [],
      tags: (cs.tags as string[]) || [],
      featured: (cs.featured as boolean) || false,
      status: (w.is_published as boolean) ? 'Published' : 'Draft',
    };
  });

  const galleryItems: GalleryImage[] = (raw.galleryItems || []).map((g: Record<string, unknown>) => ({
    id: g.id as string,
    src: g.src as string,
    caption: (g.caption as string) || '',
    category: (g.category as string) || 'general',
    featured: (g.is_featured as boolean) || false,
    status: (g.status === 'published' ? 'Published' : g.status === 'archived' ? 'Archived' : 'Draft') as GalleryImage['status'],
  }));

  const timeline: Milestone[] = (raw.timelineMilestones || []).map((t: Record<string, unknown>) => ({
    id: t.id as string,
    date: (t.year as number || 0).toString(),
    year: (t.year as number || 0).toString(),
    title: (t.title as string) || '',
    description: (t.description as string) || '',
    achievement: (t.title as string) || '',
    image: '',
  }));

  const collaborations: CollaborationItem[] = (raw.collaborations || []).map((c: Record<string, unknown>) => ({
    id: c.id as string,
    name: (c.name as string) || '',
    type: (c.collab_type as string) || '',
    year: (c.year as string) || '',
    description: (c.description as string) || '',
    outcome: (c.outcome as string) || '',
    logo: (c.logo as string) || '',
    image: (c.image as string) || '',
    featured: (c.is_featured as boolean) || false,
    status: (c.status === 'published' ? 'Published' : c.status === 'archived' ? 'Archived' : 'Draft') as CollaborationItem['status'],
  }));

  const media: MediaRecord[] = (raw.media || []).map((m: Record<string, unknown>) => ({
    id: m.id as string,
    url: (m.url as string) || (m.path as string) || '',
    name: ((m.path as string) || '').split('/').pop() || 'media',
    type: 'image' as const,
    category: 'gallery' as const,
    size: m.file_size ? `${Math.round((m.file_size as number) / 1024)} KB` : undefined,
    uploadedAt: (m.created_at as string) || new Date().toISOString(),
    dimensions: m.width && m.height ? `${m.width}x${m.height}` : undefined,
    tags: [],
    alt: (m.alt_text as string) || '',
    album: (m.album as string) || undefined,
  }));

  const registrations: RegistrationRecord[] = (raw.registrations || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    eventId: (r.event_id as string) || '',
    eventTitle: '',
    eventDate: '',
    name: (r.name as string) || '',
    email: (r.email as string) || '',
    phone: (r.phone as string) || '',
    college: (r.college as string) || '',
    department: '',
    year: '',
    registeredAt: (r.created_at as string) || new Date().toISOString(),
    attendance: (r.attended as boolean) || false,
  }));

  const applications: ApplicationRecord[] = (raw.applications || []).map((a: Record<string, unknown>) => ({
    id: a.id as string,
    name: (a.name as string) || '',
    email: (a.email as string) || '',
    phone: (a.phone as string) || '',
    department: (a.department as string) || '',
    year: (a.year_of_study as string) || '',
    domain: ((a.role_interests as string[]) || []).join(', '),
    why: (a.why_join as string) || '',
    portfolio: (a.portfolio_url as string) || '',
    status: (a.status as ApplicationRecord['status']) || 'New',
    appliedAt: (a.created_at as string) || new Date().toISOString(),
    notes: (a.notes as string) || undefined,
  }));

  const messages: ContactMessage[] = (raw.contactMessages || []).map((m: Record<string, unknown>) => ({
    id: m.id as string,
    name: (m.name as string) || '',
    email: (m.email as string) || '',
    subject: (m.subject as string) || '',
    message: (m.message as string) || '',
    receivedAt: (m.created_at as string) || new Date().toISOString(),
    status: (m.is_read as boolean) ? 'Opened' : 'New',
  }));

  const connectRequests: ConnectRequestRecord[] = (raw.connectRequests || []).map((cr: Record<string, unknown>) => ({
    id: cr.id as string,
    createdAt: (cr.created_at as string) || new Date().toISOString(),
    updatedAt: (cr.updated_at as string) || new Date().toISOString(),
    requestType: (cr.request_type as ConnectRequestRecord['requestType']) || 'collaborate',
    status: (cr.status as ConnectRequestStatus) || 'New',
    fullName: (cr.full_name as string) || '',
    roleDesignation: (cr.role_designation as string) || '',
    email: (cr.email as string) || '',
    phone: (cr.phone as string) || '',
    requesterType: (cr.requester_type as ConnectRequestRecord['requesterType']) || 'Other',
    institutionName: (cr.institution_name as string) || '',
    institutionWebsite: (cr.institution_website as string) || '',
    city: (cr.city as string) || '',
    state: (cr.state as string) || '',
    country: (cr.country as string) || 'India',
    existingCommunityInfo: '',
    proposal: (cr.proposal as string) || '',
    internalNotes: (cr.internal_notes as string) || '',
    assignedPoc: (cr.assigned_poc as string) || '',
    followUpLogs: [],
  }));

  return {
    ...DEFAULT_CMS_STORE,
    leaders,
    upcomingEvents,
    pastEvents,
    projects,
    media,
    domains: (settings.domains as DomainItem[]) || DEFAULT_CMS_STORE.domains,
    timeline,
    workflow: (settings.workflow as WorkflowStepItem[]) || DEFAULT_CMS_STORE.workflow,
    gallery: galleryItems,
    collaborations,
    registrations,
    applications,
    messages,
    connectRequests,
    auditLogs: [],
    homepage: {
      ...DEFAULT_CMS_STORE.homepage,
      ...homepage,
      footer: { ...DEFAULT_CMS_STORE.homepage.footer, ...footerData },
    },
    settings: {
      ...DEFAULT_CMS_STORE.settings,
      seoPages: (settings.seo as GwdCmsStore['settings']['seoPages']) || DEFAULT_CMS_STORE.settings.seoPages,
    },
    lastUpdated: new Date().toISOString(),
  };
}

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<GwdCmsStore>(DEFAULT_CMS_STORE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const clearError = useCallback(() => setLastError(null), []);

  // ── Load from database on mount ──
  useEffect(() => {
    loadAllCmsData()
      .then((raw) => {
        setStore(dbDataToCmsStore(raw));
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('[CmsContext] Failed to load CMS data from database:', err);
        setLastError(err instanceof Error ? err.message : 'Failed to load CMS data');
        setIsLoaded(true); // Don't leave the UI stuck
      });
  }, []);

  // ── Generic DB mutation wrapper (fire-and-forget with error capture) ──
  function dbMutation(action: () => Promise<unknown>) {
    setIsSaving(true);
    setLastError(null);
    action()
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Save failed';
        console.error('[CmsContext] Mutation error:', msg);
        setLastError(msg);
      })
      .finally(() => setIsSaving(false));
  }

  // ── Audit Log ──
  const addAuditLog = useCallback((_entry: Omit<AuditLogRecord, 'id' | 'timestamp'>) => {
    // Audit logs are now automatically created by database triggers
  }, []);

  // ── Homepage ──
  const updateHomepage = useCallback((patch: Partial<GwdCmsStore['homepage']>) => {
    setStore((prev) => {
      const next = {
        ...prev,
        homepage: {
          ...prev.homepage,
          ...patch,
          hero: { ...prev.homepage.hero, ...(patch.hero || {}) },
          intro: { ...prev.homepage.intro, ...(patch.intro || {}) },
          finalCta: { ...prev.homepage.finalCta, ...(patch.finalCta || {}) },
          footer: { ...prev.homepage.footer, ...(patch.footer || {}) },
        },
      };
      return next;
    });
    dbMutation(async () => {
      await updateSiteSettingAction('homepage', patch);
      if (patch.footer) await updateSiteSettingAction('footer', patch.footer);
    });
  }, []);

  // ── Domains ──
  const updateDomain = useCallback((id: string, patch: Partial<DomainItem>) => {
    setStore((prev) => {
      const nextDomains = prev.domains.map((d) => (d.id === id ? { ...d, ...patch } : d));
      return { ...prev, domains: nextDomains };
    });
    dbMutation(async () => {
      const current = store.domains.map((d) => (d.id === id ? { ...d, ...patch } : d));
      await updateSiteSettingAction('domains', current);
    });
  }, [store.domains]);

  const createDomain = useCallback((domain: DomainItem) => {
    setStore((prev) => {
      const nextDomains = [...prev.domains.filter((d) => d.id !== domain.id), domain];
      return { ...prev, domains: nextDomains };
    });
    dbMutation(async () => {
      const current = [...store.domains.filter((d) => d.id !== domain.id), domain];
      await updateSiteSettingAction('domains', current);
    });
  }, [store.domains]);

  const deleteDomain = useCallback((id: string) => {
    setStore((prev) => ({ ...prev, domains: prev.domains.filter((d) => d.id !== id) }));
    dbMutation(async () => {
      const current = store.domains.filter((d) => d.id !== id);
      await updateSiteSettingAction('domains', current);
    });
  }, [store.domains]);

  // ── Projects / Work ──
  const updateProject = useCallback((id: string, patch: Partial<ProjectItem>) => {
    setStore((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
    dbMutation(() => updateWorkAction(id, patch as Record<string, unknown>));
  }, []);

  const createProject = useCallback((project: ProjectItem) => {
    setStore((prev) => ({
      ...prev,
      projects: [project, ...prev.projects.filter((p) => p.id !== project.id)],
    }));
    dbMutation(() => createWorkAction(project as unknown as Record<string, unknown>));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setStore((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
    dbMutation(() => deleteWorkAction(id));
  }, []);

  // ── Events ──
  const updateEvent = useCallback((id: string, patch: Partial<EventItem>) => {
    setStore((prev) => ({
      ...prev,
      upcomingEvents: prev.upcomingEvents.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      pastEvents: prev.pastEvents.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
    dbMutation(() => updateEventAction(id, patch as Record<string, unknown>));
  }, []);

  const createEvent = useCallback((event: EventItem) => {
    setStore((prev) => ({
      ...prev,
      upcomingEvents: [event, ...prev.upcomingEvents.filter((e) => e.id !== event.id)],
    }));
    dbMutation(() => createEventAction(event as unknown as Record<string, unknown>));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      upcomingEvents: prev.upcomingEvents.filter((e) => e.id !== id),
      pastEvents: prev.pastEvents.filter((e) => e.id !== id),
    }));
    dbMutation(() => deleteEventAction(id));
  }, []);

  const archiveEvent = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      upcomingEvents: prev.upcomingEvents.map((e) =>
        e.id === id ? { ...e, status: 'archived' as EventItem['status'] } : e
      ),
      pastEvents: prev.pastEvents.map((e) =>
        e.id === id ? { ...e, status: 'archived' as EventItem['status'] } : e
      ),
    }));
    dbMutation(() => updateEventAction(id, { status: 'archived' }));
  }, []);

  // ── Leaders / Team ──
  const updateLeader = useCallback((id: string, patch: Partial<LeaderSlot>) => {
    setStore((prev) => ({
      ...prev,
      leaders: prev.leaders.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
    dbMutation(() => updateTeamMember(id, patch as Record<string, unknown>));
  }, []);

  const createLeader = useCallback((_leader: LeaderSlot) => {
    // Team slots are fixed (9 slots) — creation is handled via updateLeader on empty slots
  }, []);

  const deleteLeader = useCallback((_id: string) => {
    // Team slots cannot be deleted (fixed 9-slot architecture)
  }, []);

  // ── Timeline ──
  const updateTimeline = useCallback((index: number, patch: Partial<Milestone>) => {
    setStore((prev) => {
      const nextTimeline = [...prev.timeline];
      if (nextTimeline[index]) {
        nextTimeline[index] = { ...nextTimeline[index], ...patch };
      }
      return { ...prev, timeline: nextTimeline };
    });
    const milestone = store.timeline[index];
    if (milestone) {
      const milestoneId = (milestone as Milestone & { id?: string }).id;
      if (milestoneId) {
        dbMutation(() => updateTimelineMilestoneAction(milestoneId, patch as Record<string, unknown>));
      }
    }
  }, [store.timeline]);

  const createTimeline = useCallback((milestone: Milestone) => {
    setStore((prev) => ({ ...prev, timeline: [...prev.timeline, milestone] }));
    dbMutation(() =>
      createTimelineMilestoneAction({
        year: milestone.year || milestone.date,
        title: milestone.title,
        description: milestone.description,
        sort_order: store.timeline.length,
      })
    );
  }, [store.timeline]);

  const deleteTimeline = useCallback((index: number) => {
    const milestone = store.timeline[index];
    setStore((prev) => ({ ...prev, timeline: prev.timeline.filter((_, i) => i !== index) }));
    if (milestone) {
      const milestoneId = (milestone as Milestone & { id?: string }).id;
      if (milestoneId) {
        dbMutation(() => deleteTimelineMilestoneAction(milestoneId));
      }
    }
  }, [store.timeline]);

  // ── Gallery ──
  const updateGalleryItem = useCallback((id: string, patch: Partial<GalleryImage>) => {
    setStore((prev) => ({
      ...prev,
      gallery: prev.gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    }));
    dbMutation(() => updateGalleryItemAction(id, patch as Record<string, unknown>));
  }, []);

  const createGalleryItem = useCallback((item: GalleryImage) => {
    setStore((prev) => ({
      ...prev,
      gallery: [...prev.gallery.filter((g) => g.id !== item.id), item],
    }));
    dbMutation(() => createGalleryItemAction(item as unknown as Record<string, unknown>));
  }, []);

  const deleteGalleryItem = useCallback((id: string) => {
    setStore((prev) => ({ ...prev, gallery: prev.gallery.filter((g) => g.id !== id) }));
    dbMutation(() => deleteGalleryItemAction(id));
  }, []);

  // ── Collaborations ──
  const updateCollaboration = useCallback((id: string, patch: Partial<CollaborationItem>) => {
    setStore((prev) => ({
      ...prev,
      collaborations: prev.collaborations.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
    dbMutation(() => updateCollaborationAction(id, patch as Record<string, unknown>));
  }, []);

  const createCollaboration = useCallback((collab: CollaborationItem) => {
    setStore((prev) => ({
      ...prev,
      collaborations: [...prev.collaborations.filter((c) => c.id !== collab.id), collab],
    }));
    dbMutation(() => createCollaborationAction(collab as unknown as Record<string, unknown>));
  }, []);

  const deleteCollaboration = useCallback((id: string) => {
    setStore((prev) => ({ ...prev, collaborations: prev.collaborations.filter((c) => c.id !== id) }));
    dbMutation(() => deleteCollaborationAction(id));
  }, []);

  // ── Workflow (stored in site_settings as JSON) ──
  const updateWorkflowStep = useCallback((id: string, patch: Partial<WorkflowStepItem>) => {
    setStore((prev) => {
      const nextWorkflow = prev.workflow.map((w) => (w.id === id ? { ...w, ...patch } : w));
      dbMutation(() => updateSiteSettingAction('workflow', nextWorkflow));
      return { ...prev, workflow: nextWorkflow };
    });
  }, []);

  const createWorkflowStep = useCallback((step: WorkflowStepItem) => {
    setStore((prev) => {
      const nextWorkflow = [...prev.workflow.filter((w) => w.id !== step.id), step];
      dbMutation(() => updateSiteSettingAction('workflow', nextWorkflow));
      return { ...prev, workflow: nextWorkflow };
    });
  }, []);

  const deleteWorkflowStep = useCallback((id: string) => {
    setStore((prev) => {
      const nextWorkflow = prev.workflow.filter((w) => w.id !== id);
      dbMutation(() => updateSiteSettingAction('workflow', nextWorkflow));
      return { ...prev, workflow: nextWorkflow };
    });
  }, []);

  // ── Media ──
  const addMedia = useCallback((mediaItem: MediaRecord) => {
    setStore((prev) => ({
      ...prev,
      media: [mediaItem, ...prev.media.filter((m) => m.id !== mediaItem.id)],
    }));
  }, []);

  const deleteMedia = useCallback((id: string) => {
    setStore((prev) => {
      const target = prev.media.find((m) => m.id === id);
      dbMutation(async () => {
        await deleteMediaAction(id, target?.url);
      });
      return { ...prev, media: prev.media.filter((m) => m.id !== id) };
    });
  }, [dbMutation]);

  const updateMedia = useCallback((id: string, patch: Partial<MediaRecord>) => {
    setStore((prev) => ({
      ...prev,
      media: prev.media.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  }, []);

  // ── Registrations ──
  const addRegistration = useCallback(
    (reg: Omit<RegistrationRecord, 'id' | 'registeredAt' | 'attendance'>): RegistrationRecord => {
      const record: RegistrationRecord = {
        ...reg,
        id: `reg-${Date.now().toString(36)}`,
        registeredAt: new Date().toISOString(),
        attendance: false,
      };
      setStore((prev) => ({
        ...prev,
        registrations: [record, ...prev.registrations],
      }));
      return record;
    },
    []
  );

  const updateRegistrationStatus = useCallback((id: string, attended: boolean) => {
    setStore((prev) => ({
      ...prev,
      registrations: prev.registrations.map((r) => (r.id === id ? { ...r, attendance: attended } : r)),
    }));
    dbMutation(() => updateRegistrationAction(id, attended));
  }, []);

  const deleteRegistration = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      registrations: prev.registrations.filter((r) => r.id !== id),
    }));
    dbMutation(() => deleteRegistrationAction(id));
  }, []);

  // ── Applications ──
  const addApplication = useCallback(
    (app: Omit<ApplicationRecord, 'id' | 'appliedAt' | 'status'>): ApplicationRecord => {
      const record: ApplicationRecord = {
        ...app,
        id: `app-${Date.now().toString(36)}`,
        appliedAt: new Date().toISOString(),
        status: 'New',
      };
      setStore((prev) => ({
        ...prev,
        applications: [record, ...prev.applications],
      }));
      dbMutation(() => submitApplication(app as Record<string, unknown>));
      return record;
    },
    []
  );

  const updateApplicationStatus = useCallback(
    (id: string, status: ApplicationRecord['status'], notes?: string) => {
      setStore((prev) => ({
        ...prev,
        applications: prev.applications.map((a) =>
          a.id === id ? { ...a, status, ...(notes !== undefined ? { notes } : {}) } : a
        ),
      }));
      dbMutation(() => updateApplicationStatusAction(id, status, notes));
    },
    []
  );

  const deleteApplication = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      applications: prev.applications.filter((a) => a.id !== id),
    }));
    dbMutation(() => deleteApplicationAction(id));
  }, []);

  // ── Messages ──
  const addMessage = useCallback(
    (msg: Omit<ContactMessage, 'id' | 'receivedAt' | 'status'>): ContactMessage => {
      const record: ContactMessage = {
        ...msg,
        id: `msg-${Date.now().toString(36)}`,
        receivedAt: new Date().toISOString(),
        status: 'New',
      };
      setStore((prev) => ({
        ...prev,
        messages: [record, ...prev.messages],
      }));
      dbMutation(() => submitContactMessage(msg));
      return record;
    },
    []
  );

  const updateMessageStatus = useCallback((id: string, status: ContactMessage['status']) => {
    setStore((prev) => ({
      ...prev,
      messages: prev.messages.map((m) => (m.id === id ? { ...m, status } : m)),
    }));
    dbMutation(() => updateMessageStatusAction(id, status !== 'New'));
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setStore((prev) => ({ ...prev, messages: prev.messages.filter((m) => m.id !== id) }));
    dbMutation(() => deleteMessageAction(id));
  }, []);

  // ── Connect Requests ──
  const addConnectRequest = useCallback(
    (
      req: Omit<ConnectRequestRecord, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'followUpLogs'>
    ): ConnectRequestRecord => {
      const record: ConnectRequestRecord = {
        ...req,
        id: `REQ-${new Date().getFullYear()}-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'New',
        followUpLogs: [],
      };
      setStore((prev) => ({
        ...prev,
        connectRequests: [record, ...prev.connectRequests],
      }));
      dbMutation(() => submitConnectRequest(req as Record<string, unknown>));
      return record;
    },
    []
  );

  const updateConnectRequestStatus = useCallback((id: string, status: ConnectRequestStatus) => {
    setStore((prev) => ({
      ...prev,
      connectRequests: prev.connectRequests.map((cr) =>
        cr.id === id ? { ...cr, status, updatedAt: new Date().toISOString() } : cr
      ),
    }));
    dbMutation(() => updateConnectRequestStatusAction(id, status.toLowerCase()));
  }, []);

  const updateConnectRequest = useCallback((id: string, patch: Partial<ConnectRequestRecord>) => {
    setStore((prev) => ({
      ...prev,
      connectRequests: prev.connectRequests.map((cr) =>
        cr.id === id ? { ...cr, ...patch, updatedAt: new Date().toISOString() } : cr
      ),
    }));
    // For complex updates, update the full record via site_settings or a dedicated action
    if (patch.status) {
      dbMutation(() => updateConnectRequestStatusAction(id, (patch.status as string).toLowerCase()));
    }
  }, []);

  const addConnectFollowUpLog = useCallback(
    (id: string, log: Omit<FollowUpLogItem, 'id' | 'timestamp'>) => {
      setStore((prev) => ({
        ...prev,
        connectRequests: prev.connectRequests.map((cr) => {
          if (cr.id !== id) return cr;
          const newLog: FollowUpLogItem = {
            ...log,
            id: `log-${Date.now().toString(36)}`,
            timestamp: new Date().toISOString(),
          };
          return {
            ...cr,
            followUpLogs: [newLog, ...(cr.followUpLogs || [])],
            updatedAt: new Date().toISOString(),
          };
        }),
      }));
    },
    []
  );

  const deleteConnectRequest = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      connectRequests: prev.connectRequests.filter((cr) => cr.id !== id),
    }));
    dbMutation(() => deleteConnectRequestAction(id));
  }, []);

  // ── Settings ──
  const updateSettings = useCallback((patch: Partial<GwdCmsStore['settings']>) => {
    setStore((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
    dbMutation(async () => {
      if (patch.partnershipLead) {
        await updateSiteSettingAction('partnership_lead', patch.partnershipLead);
      }
    });
  }, []);

  const updatePageSeo = useCallback((pageKey: string, patch: Partial<PageSeoRecord>) => {
    setStore((prev) => {
      const existing = prev.settings.seoPages?.[pageKey] || { pageKey, pageTitle: pageKey, seoTitle: pageKey, metaDescription: '', ogTitle: '', ogDescription: '', ogImage: '', canonicalUrl: '', noIndex: false };
      const nextSeoPages: Record<string, PageSeoRecord> = {
        ...(prev.settings.seoPages || {}),
        [pageKey]: { ...existing, ...patch, pageKey },
      };
      return { ...prev, settings: { ...prev.settings, seoPages: nextSeoPages } };
    });
    dbMutation(async () => {
      const seoPages = { ...store.settings.seoPages };
      const existing = seoPages[pageKey] || { pageKey, pageTitle: pageKey, seoTitle: pageKey, metaDescription: '', ogTitle: '', ogDescription: '', ogImage: '', canonicalUrl: '', noIndex: false };
      seoPages[pageKey] = { ...existing, ...patch, pageKey };
      await updateSiteSettingAction('seo', seoPages);
    });
  }, [store.settings.seoPages]);

  const resetToDefaults = useCallback(() => {
    setStore(DEFAULT_CMS_STORE);
  }, []);

  return (
    <CmsContext.Provider
      value={{
        store,
        isLoaded,
        isSaving,
        lastError,
        clearError,
        updateHomepage,
        updateDomain,
        createDomain,
        deleteDomain,
        updateProject,
        createProject,
        deleteProject,
        updateEvent,
        createEvent,
        deleteEvent,
        archiveEvent,
        updateLeader,
        createLeader,
        deleteLeader,
        updateTimeline,
        createTimeline,
        deleteTimeline,
        updateGalleryItem,
        createGalleryItem,
        deleteGalleryItem,
        updateCollaboration,
        createCollaboration,
        deleteCollaboration,
        updateWorkflowStep,
        createWorkflowStep,
        deleteWorkflowStep,
        addMedia,
        deleteMedia,
        updateMedia,
        addRegistration,
        updateRegistrationStatus,
        deleteRegistration,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
        addMessage,
        updateMessageStatus,
        deleteMessage,
        addConnectRequest,
        updateConnectRequestStatus,
        updateConnectRequest,
        addConnectFollowUpLog,
        deleteConnectRequest,
        addAuditLog,
        updateSettings,
        updatePageSeo,
        resetToDefaults,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    return {
      store: DEFAULT_CMS_STORE,
      isLoaded: true,
      isSaving: false,
      lastError: null,
      clearError: () => {},
      updateHomepage: () => {},
      updateDomain: () => {},
      createDomain: () => {},
      deleteDomain: () => {},
      updateProject: () => {},
      createProject: () => {},
      deleteProject: () => {},
      updateEvent: () => {},
      createEvent: () => {},
      deleteEvent: () => {},
      archiveEvent: () => {},
      updateLeader: () => {},
      createLeader: () => {},
      deleteLeader: () => {},
      updateTimeline: () => {},
      createTimeline: () => {},
      deleteTimeline: () => {},
      updateGalleryItem: () => {},
      createGalleryItem: () => {},
      deleteGalleryItem: () => {},
      updateCollaboration: () => {},
      createCollaboration: () => {},
      deleteCollaboration: () => {},
      updateWorkflowStep: () => {},
      createWorkflowStep: () => {},
      deleteWorkflowStep: () => {},
      addMedia: () => {},
      deleteMedia: () => {},
      updateMedia: () => {},
      addRegistration: () => ({} as RegistrationRecord),
      updateRegistrationStatus: () => {},
      deleteRegistration: () => {},
      addApplication: () => ({} as ApplicationRecord),
      updateApplicationStatus: () => {},
      deleteApplication: () => {},
      addMessage: () => ({} as ContactMessage),
      updateMessageStatus: () => {},
      deleteMessage: () => {},
      addConnectRequest: () => ({} as ConnectRequestRecord),
      updateConnectRequestStatus: () => {},
      updateConnectRequest: () => {},
      addConnectFollowUpLog: () => {},
      deleteConnectRequest: () => {},
      addAuditLog: () => {},
      updateSettings: () => {},
      updatePageSeo: () => {},
      resetToDefaults: () => {},
    };
  }
  return ctx;
}
