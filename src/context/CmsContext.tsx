'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  GwdCmsStore,
  DEFAULT_CMS_STORE,
  getCmsStore,
  saveCmsStore,
  resetCmsStore,
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

interface CmsContextType {
  store: GwdCmsStore;
  isLoaded: boolean;
  updateHomepage: (patch: Partial<GwdCmsStore['homepage']>) => void;
  // Domains
  updateDomain: (id: string, patch: Partial<DomainItem>) => void;
  createDomain: (domain: DomainItem) => void;
  deleteDomain: (id: string) => void;
  // Projects / Work
  updateProject: (id: string, patch: Partial<ProjectItem>) => void;
  createProject: (project: ProjectItem) => void;
  deleteProject: (id: string) => void;
  // Events
  updateEvent: (id: string, patch: Partial<EventItem>) => void;
  createEvent: (event: EventItem) => void;
  deleteEvent: (id: string) => void;
  archiveEvent: (id: string) => void;
  // Leaders
  updateLeader: (id: string, patch: Partial<LeaderSlot>) => void;
  createLeader: (leader: LeaderSlot) => void;
  deleteLeader: (id: string) => void;
  // Timeline
  updateTimeline: (index: number, patch: Partial<Milestone>) => void;
  createTimeline: (milestone: Milestone) => void;
  deleteTimeline: (index: number) => void;
  // Gallery
  updateGalleryItem: (id: string, patch: Partial<GalleryImage>) => void;
  createGalleryItem: (item: GalleryImage) => void;
  deleteGalleryItem: (id: string) => void;
  // Collaborations
  updateCollaboration: (id: string, patch: Partial<CollaborationItem>) => void;
  createCollaboration: (collab: CollaborationItem) => void;
  deleteCollaboration: (id: string) => void;
  // Workflow
  updateWorkflowStep: (id: string, patch: Partial<WorkflowStepItem>) => void;
  createWorkflowStep: (step: WorkflowStepItem) => void;
  deleteWorkflowStep: (id: string) => void;
  // Media
  addMedia: (media: MediaRecord) => void;
  deleteMedia: (id: string) => void;
  updateMedia: (id: string, patch: Partial<MediaRecord>) => void;
  // Registrations
  addRegistration: (reg: Omit<RegistrationRecord, 'id' | 'registeredAt' | 'attendance'>) => RegistrationRecord;
  updateRegistrationStatus: (id: string, attended: boolean) => void;
  deleteRegistration: (id: string) => void;
  // Applications
  addApplication: (app: Omit<ApplicationRecord, 'id' | 'appliedAt' | 'status'>) => ApplicationRecord;
  updateApplicationStatus: (id: string, status: ApplicationRecord['status'], notes?: string) => void;
  deleteApplication: (id: string) => void;
  // Messages
  addMessage: (msg: Omit<ContactMessage, 'id' | 'receivedAt' | 'status'>) => ContactMessage;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => void;
  deleteMessage: (id: string) => void;
  // Connect & Institutional Partnerships
  addConnectRequest: (
    req: Omit<ConnectRequestRecord, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'followUpLogs'>
  ) => ConnectRequestRecord;
  updateConnectRequestStatus: (id: string, status: ConnectRequestStatus) => void;
  updateConnectRequest: (id: string, patch: Partial<ConnectRequestRecord>) => void;
  addConnectFollowUpLog: (id: string, log: Omit<FollowUpLogItem, 'id' | 'timestamp'>) => void;
  deleteConnectRequest: (id: string) => void;
  // Audit Log
  addAuditLog: (entry: Omit<AuditLogRecord, 'id' | 'timestamp'>) => void;
  // Settings & Reset
  updateSettings: (patch: Partial<GwdCmsStore['settings']>) => void;
  updatePageSeo: (pageKey: string, patch: Partial<PageSeoRecord>) => void;
  resetToDefaults: () => void;
}

const CmsContext = createContext<CmsContextType | null>(null);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<GwdCmsStore>(DEFAULT_CMS_STORE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from storage on mount
  useEffect(() => {
    const loaded = getCmsStore();
    queueMicrotask(() => {
      setStore(loaded);
      setIsLoaded(true);
    });

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<GwdCmsStore>;
      if (customEvent.detail) {
        setStore(customEvent.detail);
      } else {
        setStore(getCmsStore());
      }
    };

    window.addEventListener('gwd:cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('gwd:cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const addAuditLog = useCallback((entry: Omit<AuditLogRecord, 'id' | 'timestamp'>) => {
    setStore((prev) => {
      const logRecord: AuditLogRecord = {
        ...entry,
        id: `audit-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
      };
      const nextLogs = [logRecord, ...(prev.auditLogs || [])].slice(0, 100);
      const next = { ...prev, auditLogs: nextLogs };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const updateHomepage = useCallback((patch: Partial<GwdCmsStore['homepage']>) => {
    setStore((prev) => {
      const next: GwdCmsStore = {
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
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'UPDATE_HOMEPAGE',
      targetType: 'HOMEPAGE',
      user: 'admin@gwd-club.com',
      details: 'Homepage configuration updated through CMS.',
      status: 'info',
    });
  }, [addAuditLog]);

  // Domains
  const updateDomain = useCallback((id: string, patch: Partial<DomainItem>) => {
    setStore((prev) => {
      const nextDomains = prev.domains.map((d) => (d.id === id ? { ...d, ...patch } : d));
      const next = { ...prev, domains: nextDomains };
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'UPDATE_DOMAIN',
      targetType: 'DOMAIN',
      targetId: id,
      user: 'admin@gwd-club.com',
      details: `Domain ${id} updated.`,
      status: 'info',
    });
  }, [addAuditLog]);

  const createDomain = useCallback((domain: DomainItem) => {
    setStore((prev) => {
      const nextDomains = [...prev.domains.filter((d) => d.id !== domain.id), domain];
      const next = { ...prev, domains: nextDomains };
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'CREATE_DOMAIN',
      targetType: 'DOMAIN',
      targetId: domain.id,
      user: 'admin@gwd-club.com',
      details: `New domain "${domain.name}" created.`,
      status: 'success',
    });
  }, [addAuditLog]);

  const deleteDomain = useCallback((id: string) => {
    setStore((prev) => {
      const nextDomains = prev.domains.filter((d) => d.id !== id);
      const next = { ...prev, domains: nextDomains };
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'DELETE_DOMAIN',
      targetType: 'DOMAIN',
      targetId: id,
      user: 'admin@gwd-club.com',
      details: `Domain ${id} deleted.`,
      status: 'warning',
    });
  }, [addAuditLog]);

  // Projects
  const updateProject = useCallback((id: string, patch: Partial<ProjectItem>) => {
    setStore((prev) => {
      const nextProjects = prev.projects.map((p) => (p.id === id ? { ...p, ...patch } : p));
      const next = { ...prev, projects: nextProjects };
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'UPDATE_PROJECT',
      targetType: 'PROJECT',
      targetId: id,
      user: 'admin@gwd-club.com',
      details: `Project ${id} updated.`,
      status: 'info',
    });
  }, [addAuditLog]);

  const createProject = useCallback((project: ProjectItem) => {
    setStore((prev) => {
      const next = { ...prev, projects: [project, ...prev.projects.filter((p) => p.id !== project.id)] };
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'CREATE_PROJECT',
      targetType: 'PROJECT',
      targetId: project.id,
      user: 'admin@gwd-club.com',
      details: `New project "${project.title}" created.`,
      status: 'success',
    });
  }, [addAuditLog]);

  const deleteProject = useCallback((id: string) => {
    setStore((prev) => {
      const next = { ...prev, projects: prev.projects.filter((p) => p.id !== id) };
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'DELETE_PROJECT',
      targetType: 'PROJECT',
      targetId: id,
      user: 'admin@gwd-club.com',
      details: `Project ${id} removed.`,
      status: 'warning',
    });
  }, [addAuditLog]);

  // Events
  const updateEvent = useCallback((id: string, patch: Partial<EventItem>) => {
    setStore((prev) => {
      const nextUpcoming = prev.upcomingEvents.map((e) => (e.id === id ? { ...e, ...patch } : e));
      const nextPast = prev.pastEvents.map((e) => (e.id === id ? { ...e, ...patch } : e));
      const next = { ...prev, upcomingEvents: nextUpcoming, pastEvents: nextPast };
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'UPDATE_EVENT',
      targetType: 'EVENT',
      targetId: id,
      user: 'admin@gwd-club.com',
      details: `Event ${id} modified.`,
      status: 'info',
    });
  }, [addAuditLog]);

  const createEvent = useCallback((event: EventItem) => {
    setStore((prev) => {
      const next = { ...prev, upcomingEvents: [event, ...prev.upcomingEvents.filter((e) => e.id !== event.id)] };
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'CREATE_EVENT',
      targetType: 'EVENT',
      targetId: event.id,
      user: 'admin@gwd-club.com',
      details: `New event "${event.title}" registered.`,
      status: 'success',
    });
  }, [addAuditLog]);

  const deleteEvent = useCallback((id: string) => {
    setStore((prev) => {
      const nextUpcoming = prev.upcomingEvents.filter((e) => e.id !== id);
      const nextPast = prev.pastEvents.filter((e) => e.id !== id);
      const next = { ...prev, upcomingEvents: nextUpcoming, pastEvents: nextPast };
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'DELETE_EVENT',
      targetType: 'EVENT',
      targetId: id,
      user: 'admin@gwd-club.com',
      details: `Event ${id} deleted.`,
      status: 'warning',
    });
  }, [addAuditLog]);

  const archiveEvent = useCallback((id: string) => {
    setStore((prev) => {
      const target = prev.upcomingEvents.find((e) => e.id === id);
      if (!target) return prev;
      const nextUpcoming = prev.upcomingEvents.filter((e) => e.id !== id);
      const nextPast = [{ ...target, isUpcoming: false, registrationOpen: false }, ...prev.pastEvents];
      const next = { ...prev, upcomingEvents: nextUpcoming, pastEvents: nextPast };
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'ARCHIVE_EVENT',
      targetType: 'EVENT',
      targetId: id,
      user: 'admin@gwd-club.com',
      details: `Event ${id} moved to Past Events archive.`,
      status: 'info',
    });
  }, [addAuditLog]);

  // Leaders
  const updateLeader = useCallback((id: string, patch: Partial<LeaderSlot>) => {
    setStore((prev) => {
      const nextLeaders = prev.leaders.map((l) => (l.id === id ? { ...l, ...patch } : l));
      const next = { ...prev, leaders: nextLeaders };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const createLeader = useCallback((leader: LeaderSlot) => {
    setStore((prev) => {
      const nextLeaders = [...prev.leaders.filter((l) => l.id !== leader.id), leader];
      const next = { ...prev, leaders: nextLeaders };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const deleteLeader = useCallback((id: string) => {
    setStore((prev) => {
      const next = { ...prev, leaders: prev.leaders.filter((l) => l.id !== id) };
      saveCmsStore(next);
      return next;
    });
  }, []);

  // Timeline
  const updateTimeline = useCallback((index: number, patch: Partial<Milestone>) => {
    setStore((prev) => {
      const nextTimeline = [...prev.timeline];
      if (nextTimeline[index]) {
        nextTimeline[index] = { ...nextTimeline[index], ...patch };
      }
      const next = { ...prev, timeline: nextTimeline };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const createTimeline = useCallback((milestone: Milestone) => {
    setStore((prev) => {
      const next = { ...prev, timeline: [...prev.timeline, milestone] };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const deleteTimeline = useCallback((index: number) => {
    setStore((prev) => {
      const next = { ...prev, timeline: prev.timeline.filter((_, i) => i !== index) };
      saveCmsStore(next);
      return next;
    });
  }, []);

  // Gallery
  const updateGalleryItem = useCallback((id: string, patch: Partial<GalleryImage>) => {
    setStore((prev) => {
      const nextGallery = prev.gallery.map((g) => ((g.id || g.src) === id ? { ...g, ...patch } : g));
      const next = { ...prev, gallery: nextGallery };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const createGalleryItem = useCallback((item: GalleryImage) => {
    setStore((prev) => {
      const id = item.id || `gallery-${Date.now().toString(36)}`;
      const normalizedItem = { ...item, id };
      const next = { ...prev, gallery: [normalizedItem, ...prev.gallery.filter((g) => (g.id || g.src) !== id)] };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const deleteGalleryItem = useCallback((id: string) => {
    setStore((prev) => {
      const next = { ...prev, gallery: prev.gallery.filter((g) => (g.id || g.src) !== id) };
      saveCmsStore(next);
      return next;
    });
  }, []);

  // Collaborations
  const updateCollaboration = useCallback((id: string, patch: Partial<CollaborationItem>) => {
    setStore((prev) => {
      const nextCollabs = prev.collaborations.map((c) => (c.id === id ? { ...c, ...patch } : c));
      const next = { ...prev, collaborations: nextCollabs };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const createCollaboration = useCallback((collab: CollaborationItem) => {
    setStore((prev) => {
      const next = { ...prev, collaborations: [collab, ...prev.collaborations.filter((c) => c.id !== collab.id)] };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const deleteCollaboration = useCallback((id: string) => {
    setStore((prev) => {
      const next = { ...prev, collaborations: prev.collaborations.filter((c) => c.id !== id) };
      saveCmsStore(next);
      return next;
    });
  }, []);

  // Workflow
  const updateWorkflowStep = useCallback((id: string, patch: Partial<WorkflowStepItem>) => {
    setStore((prev) => {
      const next = { ...prev, workflow: (prev.workflow || []).map((w) => (w.id === id ? { ...w, ...patch } : w)) };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const createWorkflowStep = useCallback((step: WorkflowStepItem) => {
    setStore((prev) => {
      const next = { ...prev, workflow: [...(prev.workflow || []).filter((w) => w.id !== step.id), step] };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const deleteWorkflowStep = useCallback((id: string) => {
    setStore((prev) => {
      const next = { ...prev, workflow: (prev.workflow || []).filter((w) => w.id !== id) };
      saveCmsStore(next);
      return next;
    });
  }, []);

  // Media
  const addMedia = useCallback((media: MediaRecord) => {
    setStore((prev) => {
      const next = { ...prev, media: [media, ...(prev.media || []).filter((m) => m.id !== media.id)] };
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'UPLOAD_MEDIA',
      targetType: 'MEDIA',
      targetId: media.id,
      user: 'admin@gwd-club.com',
      details: `Media asset "${media.name}" added to library.`,
      status: 'success',
    });
  }, [addAuditLog]);

  const deleteMedia = useCallback((id: string) => {
    setStore((prev) => {
      const next = { ...prev, media: (prev.media || []).filter((m) => m.id !== id) };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const updateMedia = useCallback((id: string, patch: Partial<MediaRecord>) => {
    setStore((prev) => {
      const next = { ...prev, media: (prev.media || []).map((m) => (m.id === id ? { ...m, ...patch } : m)) };
      saveCmsStore(next);
      return next;
    });
  }, []);

  // Registrations
  const addRegistration = useCallback(
    (data: Omit<RegistrationRecord, 'id' | 'registeredAt' | 'attendance'>) => {
      const newRecord: RegistrationRecord = {
        ...data,
        id: `GWD-REG-${Date.now().toString(36).toUpperCase()}`,
        registeredAt: new Date().toISOString(),
        attendance: false,
      };

      setStore((prev) => {
        const next = { ...prev, registrations: [newRecord, ...prev.registrations] };
        saveCmsStore(next);
        return next;
      });

      return newRecord;
    },
    []
  );

  const updateRegistrationStatus = useCallback((id: string, attended: boolean) => {
    setStore((prev) => {
      const updated = prev.registrations.map((r) => (r.id === id ? { ...r, attendance: attended } : r));
      const next = { ...prev, registrations: updated };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const deleteRegistration = useCallback((id: string) => {
    setStore((prev) => {
      const next = { ...prev, registrations: prev.registrations.filter((r) => r.id !== id) };
      saveCmsStore(next);
      return next;
    });
  }, []);

  // Applications
  const addApplication = useCallback(
    (data: Omit<ApplicationRecord, 'id' | 'appliedAt' | 'status'>) => {
      const newRecord: ApplicationRecord = {
        ...data,
        id: `GWD-APP-${Date.now().toString(36).toUpperCase()}`,
        appliedAt: new Date().toISOString(),
        status: 'New',
      };

      setStore((prev) => {
        const next = { ...prev, applications: [newRecord, ...prev.applications] };
        saveCmsStore(next);
        return next;
      });

      return newRecord;
    },
    []
  );

  const updateApplicationStatus = useCallback((id: string, status: ApplicationRecord['status'], notes?: string) => {
    setStore((prev) => {
      const updated = prev.applications.map((a) => (a.id === id ? { ...a, status, notes: notes ?? a.notes } : a));
      const next = { ...prev, applications: updated };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const deleteApplication = useCallback((id: string) => {
    setStore((prev) => {
      const next = { ...prev, applications: prev.applications.filter((a) => a.id !== id) };
      saveCmsStore(next);
      return next;
    });
  }, []);

  // Messages
  const addMessage = useCallback(
    (data: Omit<ContactMessage, 'id' | 'receivedAt' | 'status'>) => {
      const newRecord: ContactMessage = {
        ...data,
        id: `GWD-MSG-${Date.now().toString(36).toUpperCase()}`,
        receivedAt: new Date().toISOString(),
        status: 'New',
      };

      setStore((prev) => {
        const next = { ...prev, messages: [newRecord, ...prev.messages] };
        saveCmsStore(next);
        return next;
      });

      return newRecord;
    },
    []
  );

  const updateMessageStatus = useCallback((id: string, status: ContactMessage['status']) => {
    setStore((prev) => {
      const updated = prev.messages.map((m) => (m.id === id ? { ...m, status } : m));
      const next = { ...prev, messages: updated };
      saveCmsStore(next);
      return next;
    });
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setStore((prev) => {
      const next = { ...prev, messages: prev.messages.filter((m) => m.id !== id) };
      saveCmsStore(next);
      return next;
    });
  }, []);

  // Connect & Institutional Partnerships
  const addConnectRequest = useCallback(
    (data: Omit<ConnectRequestRecord, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'followUpLogs'>) => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newRecord: ConnectRequestRecord = {
        ...data,
        id: `REQ-2026-${randomSuffix}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'New',
        followUpLogs: [],
      };

      setStore((prev) => {
        const next = { ...prev, connectRequests: [newRecord, ...(prev.connectRequests || [])] };
        saveCmsStore(next);
        return next;
      });

      addAuditLog({
        action: 'CONNECT_REQUEST_SUBMITTED',
        targetType: 'CONNECT_REQUEST',
        targetId: newRecord.id,
        user: newRecord.email,
        details: `Institutional connect request received from ${newRecord.fullName} (${newRecord.institutionName}) for "${newRecord.requestType}". Assigned ID: ${newRecord.id}`,
        status: 'success',
      });

      return newRecord;
    },
    [addAuditLog]
  );

  const updateConnectRequestStatus = useCallback(
    (id: string, status: ConnectRequestStatus) => {
      let institution = '';
      let requester = '';
      setStore((prev) => {
        const updated = (prev.connectRequests || []).map((req) => {
          if (req.id === id) {
            institution = req.institutionName;
            requester = req.fullName;
            return { ...req, status, updatedAt: new Date().toISOString() };
          }
          return req;
        });
        const next = { ...prev, connectRequests: updated };
        saveCmsStore(next);
        return next;
      });

      addAuditLog({
        action: 'CONNECT_STATUS_CHANGE',
        targetType: 'CONNECT_REQUEST',
        targetId: id,
        user: 'admin@gwd-club.com',
        details: `Request ${id} (${requester} · ${institution}) transitioned to lifecycle status "${status}".`,
        status: 'info',
      });
    },
    [addAuditLog]
  );

  const updateConnectRequest = useCallback(
    (id: string, patch: Partial<ConnectRequestRecord>) => {
      setStore((prev) => {
        const updated = (prev.connectRequests || []).map((req) =>
          req.id === id ? { ...req, ...patch, updatedAt: new Date().toISOString() } : req
        );
        const next = { ...prev, connectRequests: updated };
        saveCmsStore(next);
        return next;
      });

      const details = patch.assignedPoc
        ? `Request ${id} assigned to GWD POC: "${patch.assignedPoc}".`
        : `Request ${id} details and internal notes updated.`;

      addAuditLog({
        action: patch.assignedPoc ? 'CONNECT_ASSIGN_POC' : 'CONNECT_UPDATE',
        targetType: 'CONNECT_REQUEST',
        targetId: id,
        user: 'admin@gwd-club.com',
        details,
        status: 'info',
      });
    },
    [addAuditLog]
  );

  const addConnectFollowUpLog = useCallback(
    (id: string, log: Omit<FollowUpLogItem, 'id' | 'timestamp'>) => {
      const logItem: FollowUpLogItem = {
        id: `fol-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        ...log,
      };

      setStore((prev) => {
        const updated = (prev.connectRequests || []).map((req) => {
          if (req.id === id) {
            return {
              ...req,
              updatedAt: new Date().toISOString(),
              followUpLogs: [...(req.followUpLogs || []), logItem],
            };
          }
          return req;
        });
        const next = { ...prev, connectRequests: updated };
        saveCmsStore(next);
        return next;
      });

      addAuditLog({
        action: 'CONNECT_FOLLOWUP_LOG',
        targetType: 'CONNECT_REQUEST',
        targetId: id,
        user: log.author || 'admin@gwd-club.com',
        details: `Follow-up recorded on request ${id}: "${log.action}".`,
        status: 'info',
      });
    },
    [addAuditLog]
  );

  const deleteConnectRequest = useCallback(
    (id: string) => {
      setStore((prev) => {
        const next = {
          ...prev,
          connectRequests: (prev.connectRequests || []).filter((r) => r.id !== id),
        };
        saveCmsStore(next);
        return next;
      });

      addAuditLog({
        action: 'CONNECT_DELETE',
        targetType: 'CONNECT_REQUEST',
        targetId: id,
        user: 'admin@gwd-club.com',
        details: `Connect request ${id} permanently deleted from archive.`,
        status: 'warning',
      });
    },
    [addAuditLog]
  );

  // Settings
  const updateSettings = useCallback((patch: Partial<GwdCmsStore['settings']>) => {
    setStore((prev) => {
      const next = { ...prev, settings: { ...prev.settings, ...patch } };
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'UPDATE_SETTINGS',
      targetType: 'SETTINGS',
      user: 'admin@gwd-club.com',
      details: 'Global site settings and DyeWhorl preferences saved.',
      status: 'info',
    });
  }, [addAuditLog]);

  const updatePageSeo = useCallback((pageKey: string, patch: Partial<PageSeoRecord>) => {
    setStore((prev) => {
      const currentPages = prev.settings.seoPages || {};
      const current = currentPages[pageKey] || {
        pageKey,
        pageTitle: pageKey,
        seoTitle: '',
        metaDescription: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '/brand/gwd-logo.png',
      };
      const updatedPage = { ...current, ...patch };
      const nextSettings = {
        ...prev.settings,
        seoPages: {
          ...currentPages,
          [pageKey]: updatedPage,
        },
      };
      const next = { ...prev, settings: nextSettings };
      saveCmsStore(next);
      return next;
    });
    addAuditLog({
      action: 'UPDATE_SEO',
      targetType: 'SEO',
      targetId: pageKey,
      user: 'admin@gwd-club.com',
      details: `SEO metadata updated for page "${pageKey}".`,
      status: 'info',
    });
  }, [addAuditLog]);

  const resetToDefaults = useCallback(() => {
    const fresh = resetCmsStore();
    setStore(fresh);
  }, []);

  return (
    <CmsContext.Provider
      value={{
        store,
        isLoaded,
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
