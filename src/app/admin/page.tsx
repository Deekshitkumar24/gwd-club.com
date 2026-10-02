'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  LeaderSlot,
  GalleryImage,
  ProjectItem,
  EventItem,
  CollaborationItem,
} from '@/data/content';
import {
  JourneyItem,
  DEFAULT_TOP_JOURNEY,
  DEFAULT_BOTTOM_JOURNEY,
} from '@/components/ui/timeline';
import { useCms } from '@/context/CmsContext';
import {
  DomainItem,
  DomainMember,
  WorkflowStepItem,
  RegistrationRecord,
  ApplicationRecord,
  ContactMessage,
  MediaRecord,
  ConnectRequestRecord,
  ConnectRequestStatus,
  ConnectRequestType,
  CONNECT_REQUEST_TYPE_LABELS,
} from '@/lib/cms';
import { compressImageFile } from '@/lib/mediaUtils';

import EventDetailModal from './components/EventDetailModal';
import EventEditorModal from './components/EventEditorModal';
import LeaderEditorModal from './components/LeaderEditorModal';
import ProjectEditorModal from './components/ProjectEditorModal';
import PartnerEditorModal from './components/PartnerEditorModal';
import MediaPickerModal from './components/MediaPickerModal';
import ConfirmModal from './components/ConfirmModal';
import DomainMemberModal from './components/DomainMemberModal';
import SeoManager from './components/SeoManager';
import ConnectRequestModal from './components/ConnectRequestModal';
import { BorderBeam } from '@/components/ui/border-beam';

import styles from './admin.module.css';

type AdminTab =
  | 'dashboard'
  | 'content'
  | 'team'
  | 'domains'
  | 'work'
  | 'events'
  | 'timeline'
  | 'gallery'
  | 'media'
  | 'collaborations'
  | 'workflow'
  | 'applications'
  | 'registrations'
  | 'messages'
  | 'partnerships'
  | 'seo'
  | 'settings'
  | 'auditLog';

export default function AdminPortal() {
  const {
    store,
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
    resetToDefaults,
  } = useCms();

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Modals & Active Selections
  const [activeDetailEvent, setActiveDetailEvent] = useState<EventItem | null>(null);
  const [activeEditEvent, setActiveEditEvent] = useState<EventItem | null>(null);
  const [isEventEditorOpen, setIsEventEditorOpen] = useState(false);

  const [activeEditLeader, setActiveEditLeader] = useState<LeaderSlot | null>(null);
  const [isLeaderEditorOpen, setIsLeaderEditorOpen] = useState(false);

  const [activeEditProject, setActiveEditProject] = useState<ProjectItem | null>(null);
  const [isProjectEditorOpen, setIsProjectEditorOpen] = useState(false);

  const [activeEditPartner, setActiveEditPartner] = useState<CollaborationItem | null>(null);
  const [isPartnerEditorOpen, setIsPartnerEditorOpen] = useState(false);

  // Connect & Partnerships Modal
  const [activeConnectModalReq, setActiveConnectModalReq] = useState<ConnectRequestRecord | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Selected Detail Drawers
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);

  // Domain Editing State & Handlers
  const [selectedDomain, setSelectedDomain] = useState<DomainItem | null>(null);
  const [editingDomainMember, setEditingDomainMember] = useState<DomainMember | null>(null);
  const [isDomainMemberModalOpen, setIsDomainMemberModalOpen] = useState(false);
  const [isNewDomainMember, setIsNewDomainMember] = useState(false);
  const [isDomainLeadMediaPickerOpen, setIsDomainLeadMediaPickerOpen] = useState(false);
  const domainLeadFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDomainLeadPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDomain) return;
    try {
      const compressed = await compressImageFile(file, 800, 800, 0.82);
      const updated = { ...selectedDomain, leadPhoto: compressed };
      setSelectedDomain(updated);
      updateDomain(selectedDomain.id, updated);
      showToast(`Updated lead photo for ${selectedDomain.name}`);
    } catch {
      showToast('Error compressing image');
    }
  };

  const handleMoveMember = (domain: DomainItem, index: number, direction: 'up' | 'down') => {
    const members = [...(domain.members || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= members.length) return;
    const temp = members[index];
    members[index] = members[targetIndex];
    members[targetIndex] = temp;
    const updated = { ...domain, members };
    setSelectedDomain(updated);
    updateDomain(domain.id, updated);
    showToast(`Reordered members in ${domain.name}`);
  };

  const handleToggleMemberActive = (domain: DomainItem, memberId: string) => {
    const members = (domain.members || []).map((m) =>
      m.id === memberId ? { ...m, active: m.active === false ? true : false } : m
    );
    const updated = { ...domain, members };
    setSelectedDomain(updated);
    updateDomain(domain.id, updated);
    showToast('Updated member active status');
  };

  const handleSaveDomainMember = (savedMember: DomainMember) => {
    if (!selectedDomain) return;
    const members = [...(selectedDomain.members || [])];
    const existingIndex = members.findIndex((m) => m.id === savedMember.id);
    if (existingIndex >= 0) {
      members[existingIndex] = savedMember;
    } else {
      members.push(savedMember);
    }
    const updated = { ...selectedDomain, members };
    setSelectedDomain(updated);
    updateDomain(selectedDomain.id, updated);
    showToast(`Saved member ${savedMember.name}`);
  };

  const handleDeleteDomainMember = (domain: DomainItem, memberId: string, memberName: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Remove Domain Member?',
      message: `Are you sure you want to remove "${memberName}" from the ${domain.name} domain roster?`,
      confirmLabel: 'Remove Member',
      isDestructive: true,
      onConfirm: () => {
        const nextMembers = (domain.members || []).filter((x) => x.id !== memberId);
        const updated = { ...domain, members: nextMembers };
        setSelectedDomain(updated);
        updateDomain(domain.id, updated);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        showToast(`Removed ${memberName} from ${domain.name}`);
      },
    });
  };

  // Storyline / Timeline Management State
  const [storylineMilestones, setStorylineMilestones] = useState<JourneyItem[]>([]);
  const [storylineSubTab, setStorylineSubTab] = useState<'storyline' | 'spiral'>('storyline');
  const [isStorylineModalOpen, setIsStorylineModalOpen] = useState(false);
  const [editingStorylineItem, setEditingStorylineItem] = useState<JourneyItem | null>(null);
  const [storylineForm, setStorylineForm] = useState<{
    id?: string;
    year: string;
    month: string;
    headline: string;
    content: string;
    track: 'top' | 'bottom';
    image: string;
  }>({
    year: '2025',
    month: 'October',
    headline: '',
    content: '',
    track: 'top',
    image: '',
  });

  // Gallery Management State
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [gallerySearch, setGallerySearch] = useState('');
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryImage | null>(null);
  const [galleryForm, setGalleryForm] = useState<{
    id?: string;
    src: string;
    caption: string;
    category: string;
    featured: boolean;
  }>({
    src: '',
    caption: '',
    category: 'Showcase',
    featured: false,
  });

  // Workflow Management State
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [editingWorkflowStep, setEditingWorkflowStep] = useState<WorkflowStepItem | null>(null);
  const [workflowForm, setWorkflowForm] = useState<{
    id?: string;
    stepNumber: string;
    phase: string;
    title: string;
    duration: string;
    summary: string;
    deliverables: string;
    status: 'Published' | 'Draft';
  }>({
    stepNumber: '07',
    phase: 'SCALE',
    title: '',
    duration: 'Ongoing',
    summary: '',
    deliverables: '',
    status: 'Published',
  });

  // Search & Filters
  const [regSearch, setRegSearch] = useState('');
  const [regEventFilter, setRegEventFilter] = useState('all');
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [appDomainFilter, setAppDomainFilter] = useState('all');
  const [msgSearch, setMsgSearch] = useState('');
  const [msgStatusFilter, setMsgStatusFilter] = useState('all');
  const [connectSearch, setConnectSearch] = useState('');
  const [connectTypeFilter, setConnectTypeFilter] = useState('all');
  const [connectStatusFilter, setConnectStatusFilter] = useState('all');
  const [connectInstitutionFilter, setConnectInstitutionFilter] = useState('all');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditStatusFilter, setAuditStatusFilter] = useState('all');
  const [mediaSearch, setMediaSearch] = useState('');

  // Confirmation Modals
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  // Authentication check on mount
  useEffect(() => {
    const auth = sessionStorage.getItem('gwd_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Initialize Storyline Milestones from store or default
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gwd_storyline_milestones');
      if (stored) {
        setStorylineMilestones(JSON.parse(stored));
      } else {
        const initial = [...DEFAULT_TOP_JOURNEY, ...DEFAULT_BOTTOM_JOURNEY];
        setStorylineMilestones(initial);
        localStorage.setItem('gwd_storyline_milestones', JSON.stringify(initial));
      }
    } catch {
      setStorylineMilestones([...DEFAULT_TOP_JOURNEY, ...DEFAULT_BOTTOM_JOURNEY]);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      passphrase.toLowerCase() === 'gwd2026' ||
      passphrase.toLowerCase() === 'admin' ||
      passphrase.toLowerCase() === 'getworkdone'
    ) {
      sessionStorage.setItem('gwd_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gwd_admin_auth');
    setIsAuthenticated(false);
  };

  // ── Unified Data Derivations from Authoritative Store ──
  const upcomingEvents = store.upcomingEvents || [];
  const pastEvents = store.pastEvents || [];
  const allEvents = useMemo(() => [...upcomingEvents, ...pastEvents], [upcomingEvents, pastEvents]);
  const projects = store.projects || [];
  const leaders = store.leaders || [];
  const domains = store.domains || [];
  const mediaList = store.media || [];
  const registrations = store.registrations || [];
  const applications = store.applications || [];
  const messages = store.messages || [];
  const connectRequests = store.connectRequests || [];
  const collaborations = store.collaborations || [];
  const workflowSteps = store.workflow || [];
  const auditLogs = store.auditLogs || [];

  // Filtered Registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(regSearch.toLowerCase()) ||
        r.email.toLowerCase().includes(regSearch.toLowerCase()) ||
        r.college.toLowerCase().includes(regSearch.toLowerCase()) ||
        r.id.toLowerCase().includes(regSearch.toLowerCase());
      const matchEvent = regEventFilter === 'all' || r.eventId === regEventFilter;
      return matchSearch && matchEvent;
    });
  }, [registrations, regSearch, regEventFilter]);

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(appSearch.toLowerCase()) ||
        a.email.toLowerCase().includes(appSearch.toLowerCase()) ||
        a.department.toLowerCase().includes(appSearch.toLowerCase());
      const matchStatus = appStatusFilter === 'all' || a.status === appStatusFilter;
      const matchDomain = appDomainFilter === 'all' || a.domain.toLowerCase() === appDomainFilter.toLowerCase();
      return matchSearch && matchStatus && matchDomain;
    });
  }, [applications, appSearch, appStatusFilter, appDomainFilter]);

  // Filtered Messages
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(msgSearch.toLowerCase()) ||
        m.email.toLowerCase().includes(msgSearch.toLowerCase()) ||
        m.subject.toLowerCase().includes(msgSearch.toLowerCase());
      const matchStatus = msgStatusFilter === 'all' || m.status === msgStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [messages, msgSearch, msgStatusFilter]);

  // Filtered Connect & Institutional Partnership Requests
  const uniqueConnectInstitutions = useMemo(() => {
    const set = new Set<string>();
    connectRequests.forEach((r) => {
      if (r.institutionName) set.add(r.institutionName.trim());
    });
    return Array.from(set).sort();
  }, [connectRequests]);

  const filteredConnectRequests = useMemo(() => {
    return connectRequests.filter((r) => {
      const q = connectSearch.toLowerCase();
      const matchSearch =
        r.fullName.toLowerCase().includes(q) ||
        r.institutionName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.proposedEventName && r.proposedEventName.toLowerCase().includes(q));

      const matchType = connectTypeFilter === 'all' || r.requestType === connectTypeFilter;
      const matchStatus = connectStatusFilter === 'all' || r.status === connectStatusFilter;
      const matchInst =
        connectInstitutionFilter === 'all' || r.institutionName === connectInstitutionFilter;

      return matchSearch && matchType && matchStatus && matchInst;
    });
  }, [connectRequests, connectSearch, connectTypeFilter, connectStatusFilter, connectInstitutionFilter]);

  // Filtered Media
  const filteredMedia = useMemo(() => {
    return mediaList.filter((m) => {
      return (
        m.name.toLowerCase().includes(mediaSearch.toLowerCase()) ||
        m.category.toLowerCase().includes(mediaSearch.toLowerCase()) ||
        m.tags?.some((t) => t.toLowerCase().includes(mediaSearch.toLowerCase()))
      );
    });
  }, [mediaList, mediaSearch]);

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchSearch =
        log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
        (log.user || log.actor || '').toLowerCase().includes(auditSearch.toLowerCase());
      const matchStatus = auditStatusFilter === 'all' || log.status.toLowerCase() === auditStatusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [auditLogs, auditSearch, auditStatusFilter]);

  // ── Operations & Mutations ──

  // Media File Upload Handler
  const handleBatchMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let count = 0;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const sizeKb = Math.round(file.size / 1024);
        const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

        const newRecord: MediaRecord = {
          id: `media-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: dataUrl,
          type: 'image',
          category: 'gallery',
          size: sizeStr,
          uploadedAt: new Date().toISOString(),
          tags: ['uploaded', 'admin-library'],
        };

        addMedia(newRecord);
        count++;
        if (count === files.length) {
          showToast(`Successfully uploaded ${count} media asset(s)!`);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // Toggle Attendance
  const handleToggleAttendance = (regId: string) => {
    const target = registrations.find((r) => r.id === regId);
    if (!target) return;
    const nextVal = !target.attendance;
    updateRegistrationStatus(regId, nextVal);
    if (selectedReg && selectedReg.id === regId) {
      setSelectedReg({ ...selectedReg, attendance: nextVal });
    }
    showToast(`Attendance marked as ${nextVal ? 'Checked In' : 'Pending'}`);
  };

  // Update Application Status
  const handleUpdateAppStatus = (appId: string, status: ApplicationRecord['status']) => {
    updateApplicationStatus(appId, status);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, status });
    }
    showToast(`Application marked as ${status}`);
  };

  // Update Message Status
  const handleUpdateMsgStatus = (msgId: string, status: ContactMessage['status']) => {
    updateMessageStatus(msgId, status);
    if (selectedMsg && selectedMsg.id === msgId) {
      setSelectedMsg({ ...selectedMsg, status });
    }
    showToast(`Message marked as ${status}`);
  };

  // Export Master Registrations to Excel
  const handleExportAllRegistrations = () => {
    if (filteredRegistrations.length === 0) {
      alert('No registrations available to export.');
      return;
    }

    const rows = filteredRegistrations.map((r, i) => ({
      'S.No': i + 1,
      'Pass ID': r.id,
      'Event Name': r.eventTitle,
      'Event Date': r.eventDate,
      'Full Name': r.name,
      'Email Address': r.email,
      'Phone Number': r.phone,
      'Institution': r.college,
      'Department / Branch': r.department,
      'Year of Study': r.year,
      'Attendance Checked': r.attendance ? 'YES' : 'NO',
      'Registration Timestamp': r.registeredAt,
      'Additional Notes': r.message || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    const dateStamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `GWD_All_Registrations_${dateStamp}.xlsx`);
    showToast('Exported registrations to Excel');
  };

  // Export Applications to Excel
  const handleExportApplications = () => {
    if (filteredApplications.length === 0) {
      alert('No applications to export.');
      return;
    }

    const rows = filteredApplications.map((a, i) => ({
      'S.No': i + 1,
      'Application ID': a.id,
      'Applicant Name': a.name,
      'Email Address': a.email,
      'Phone Number': a.phone,
      'Target Domain': a.domain,
      'Department': a.department,
      'Year': a.year,
      'Status': a.status,
      'Applied Date': a.appliedAt,
      'Portfolio Link': a.portfolio,
      'Statement': a.why,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');

    const dateStamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `GWD_Candidates_${dateStamp}.xlsx`);
    showToast('Exported applications to Excel');
  };

  // Export Master Connect & Partnerships to Excel
  const handleExportAllConnectRequests = () => {
    if (filteredConnectRequests.length === 0) {
      alert('No partnership requests available to export.');
      return;
    }

    const rows = filteredConnectRequests.map((r, i) => ({
      'S.No': i + 1,
      'Reference ID': r.id,
      'Submission Date': r.createdAt,
      'Lifecycle Status': r.status,
      'Engagement Track': CONNECT_REQUEST_TYPE_LABELS[r.requestType]?.title || r.requestType,
      'Assigned GWD Lead': r.assignedPoc || 'Unassigned',
      'Requester Name': r.fullName,
      'Role / Designation': r.roleDesignation,
      'Requester Entity': r.requesterType,
      'Email Address': r.email,
      'Phone / WhatsApp': r.phone,
      'Institution / Community': r.institutionName,
      'Website': r.institutionWebsite || '—',
      'City': r.city,
      'State': r.state,
      'Country': r.country,
      'Proposed Event / Title': r.proposedEventName || '—',
      'Format': r.format || '—',
      'Audience Footfall': r.expectedAudienceSize || '—',
      'Preferred Date': r.preferredDate || '—',
      'Alternative Date': r.alternativeDate || '—',
      'Campus Venue': r.venue || '—',
      'Requested from GWD': r.requestedFromGwd || '—',
      'Budget Context': r.budgetSponsorship || '—',
      'Internal Notes': r.internalNotes || '—',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Partnerships_Connect');

    const dateStamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `GWD_Partnerships_Connect_${dateStamp}.xlsx`);
    showToast(`Exported ${filteredConnectRequests.length} connect records to Excel`);
  };

  // Storyline Milestone Handlers
  const handleSaveStoryline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storylineForm.year || !storylineForm.content) {
      alert('Year and description are required.');
      return;
    }

    const id = storylineForm.id || `${storylineForm.year.toLowerCase()}-${storylineForm.month.toLowerCase()}-${Date.now().toString(36)}`;
    const newItem: JourneyItem = {
      id,
      year: storylineForm.year,
      month: storylineForm.month,
      headline: storylineForm.headline || undefined,
      content: storylineForm.content,
      track: storylineForm.track,
      image: storylineForm.image || undefined,
    };

    let updated: JourneyItem[];
    if (storylineForm.id) {
      updated = storylineMilestones.map((m) => (m.id === storylineForm.id ? newItem : m));
      showToast('Storyline milestone updated');
    } else {
      updated = [...storylineMilestones, newItem];
      showToast('New milestone & photo saved');
    }

    setStorylineMilestones(updated);
    localStorage.setItem('gwd_storyline_milestones', JSON.stringify(updated));
    setIsStorylineModalOpen(false);
    setEditingStorylineItem(null);
  };

  const handleOpenEditStoryline = (item: JourneyItem) => {
    setEditingStorylineItem(item);
    setStorylineForm({
      id: item.id,
      year: item.year,
      month: item.month,
      headline: item.headline || '',
      content: item.content,
      track: item.track || 'top',
      image: item.image || '',
    });
    setIsStorylineModalOpen(true);
  };

  const handleOpenCreateStoryline = () => {
    setEditingStorylineItem(null);
    setStorylineForm({
      year: '2025',
      month: 'October',
      headline: '',
      content: '',
      track: 'top',
      image: '',
    });
    setIsStorylineModalOpen(true);
  };

  const handleDeleteStoryline = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Remove Timeline Milestone?',
      message: 'This milestone will be removed from the public About journey.',
      confirmLabel: 'Remove Milestone',
      isDestructive: true,
      onConfirm: () => {
        const updated = storylineMilestones.filter((m) => m.id !== id);
        setStorylineMilestones(updated);
        localStorage.setItem('gwd_storyline_milestones', JSON.stringify(updated));
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        showToast('Milestone removed');
      },
    });
  };

  // Gallery Handlers
  const handleOpenCreateGallery = () => {
    setEditingGalleryItem(null);
    setGalleryForm({
      src: '',
      caption: '',
      category: 'Showcase',
      featured: false,
    });
    setIsGalleryModalOpen(true);
  };

  const handleOpenEditGallery = (item: GalleryImage) => {
    setEditingGalleryItem(item);
    setGalleryForm({
      id: item.id,
      src: item.src,
      caption: item.caption,
      category: item.category,
      featured: item.featured || false,
    });
    setIsGalleryModalOpen(true);
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.src.trim() || !galleryForm.caption.trim()) {
      alert('Source URL and caption are required.');
      return;
    }

    if (editingGalleryItem && (editingGalleryItem.id || editingGalleryItem.src)) {
      const targetId = editingGalleryItem.id || editingGalleryItem.src;
      updateGalleryItem(targetId, {
        src: galleryForm.src,
        caption: galleryForm.caption,
        category: galleryForm.category,
        featured: galleryForm.featured,
      });
      showToast('Gallery image updated');
    } else {
      createGalleryItem({
        id: `gallery-${Date.now().toString(36)}`,
        src: galleryForm.src,
        caption: galleryForm.caption,
        category: galleryForm.category,
        featured: galleryForm.featured,
      });
      showToast('Added new photo to public Gallery');
    }

    setIsGalleryModalOpen(false);
    setEditingGalleryItem(null);
  };

  const handleDeleteGallery = (id: string, caption: string) => {
    setConfirmConfig({
      isOpen: true,
      title: `Delete Gallery Image?`,
      message: `Are you sure you want to remove "${caption}" from the public gallery?`,
      confirmLabel: 'Delete Photo',
      isDestructive: true,
      onConfirm: () => {
        deleteGalleryItem(id);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        showToast('Gallery photo deleted');
      },
    });
  };

  // Workflow Handlers
  const handleOpenCreateWorkflow = () => {
    setEditingWorkflowStep(null);
    setWorkflowForm({
      stepNumber: `0${(workflowSteps.length + 1).toString()}`.slice(-2),
      phase: 'EXECUTION',
      title: '',
      duration: '1–2 Weeks',
      summary: '',
      deliverables: '',
      status: 'Published',
    });
    setIsWorkflowModalOpen(true);
  };

  const handleOpenEditWorkflow = (step: WorkflowStepItem) => {
    setEditingWorkflowStep(step);
    setWorkflowForm({
      id: step.id,
      stepNumber: step.stepNumber,
      phase: step.phase,
      title: step.title,
      duration: step.duration,
      summary: step.summary,
      deliverables: Array.isArray(step.deliverables) ? step.deliverables.join(', ') : step.deliverables,
      status: step.status,
    });
    setIsWorkflowModalOpen(true);
  };

  const handleSaveWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflowForm.title.trim()) {
      alert('Step title is required.');
      return;
    }

    const parsedDeliverables = workflowForm.deliverables
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const stepPayload: WorkflowStepItem = {
      id: workflowForm.id || `wf-${workflowForm.stepNumber}-${Date.now().toString(36)}`,
      stepNumber: workflowForm.stepNumber,
      phase: workflowForm.phase,
      title: workflowForm.title.trim(),
      duration: workflowForm.duration,
      summary: workflowForm.summary,
      deliverables: parsedDeliverables,
      status: workflowForm.status,
    };

    if (editingWorkflowStep && editingWorkflowStep.id) {
      updateWorkflowStep(editingWorkflowStep.id, stepPayload);
      showToast('Workflow step updated');
    } else {
      createWorkflowStep(stepPayload);
      showToast('New workflow phase published');
    }

    setIsWorkflowModalOpen(false);
    setEditingWorkflowStep(null);
  };

  const handleDeleteWorkflow = (id: string, title: string) => {
    setConfirmConfig({
      isOpen: true,
      title: `Delete Workflow Step?`,
      message: `Are you sure you want to remove "${title}" from the public /workflow page?`,
      confirmLabel: 'Delete Step',
      isDestructive: true,
      onConfirm: () => {
        deleteWorkflowStep(id);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        showToast('Workflow step deleted');
      },
    });
  };

  // ── Authentication Gate ──
  if (!isAuthenticated) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <img src="/brand/gwd-logo.png" alt="GWD Official Logo" className={styles.authLogo} />
            <h1 className={styles.authTitle}>GWD Operations CMS</h1>
            <p className={styles.authSubtitle}>
              Pre-deployment release gate, content pipeline, and student operations management.
            </p>
          </div>

          <form onSubmit={handleLogin} className={styles.authForm}>
            <div className="form-group">
              <label htmlFor="passphrase" className="label">
                Master Security Passphrase
              </label>
              <input
                id="passphrase"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter authorized credential..."
                className="input"
                autoFocus
              />
            </div>

            {authError && (
              <div className={styles.authError}>
                Invalid passphrase. Authorized GWD administrators only.
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Authenticate & Unlock CMS
            </button>

            <p className={styles.authHint}>
              Default system pass: <code>gwd2026</code>
            </p>
          </form>

          <div className={styles.authFooter}>
            <Link href="/" className={styles.authReturnLink}>
              ← Return to GWD Public Platform
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminRoot}>
      {/* Hidden File Input for Batch Media Uploads */}
      <input
        type="file"
        ref={mediaFileInputRef}
        accept="image/*"
        multiple
        onChange={handleBatchMediaUpload}
        style={{ display: 'none' }}
      />
      {/* Hidden File Input for Domain Lead Photo */}
      <input
        type="file"
        ref={domainLeadFileInputRef}
        accept="image/*"
        onChange={handleDomainLeadPhotoUpload}
        style={{ display: 'none' }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          PERSISTENT ADMINISTRATIVE SIDEBAR
          ═══════════════════════════════════════════════════════════════ */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <img src="/brand/gwd-logo.png" alt="GWD Official Logo" className={styles.sidebarLogo} />
          <div className={styles.sidebarInfo}>
            <h2 className={styles.sidebarTitle}>GWD</h2>
            <span className={styles.sidebarBadge}>CMS / OPERATIONS</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroupLabel}>CORE OPERATIONS</div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>📊</span> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`${styles.navItem} ${activeTab === 'events' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>⚡</span> Events ({allEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`${styles.navItem} ${activeTab === 'registrations' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>🎟️</span> Registrations ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`${styles.navItem} ${activeTab === 'applications' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>📝</span> Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`${styles.navItem} ${activeTab === 'messages' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>💬</span> Inquiries ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('partnerships')}
            className={`${styles.navItem} ${activeTab === 'partnerships' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>🏛️</span> Partnerships & Connect ({connectRequests.length})
          </button>

          <div className={styles.navGroupLabel} style={{ marginTop: '1.25rem' }}>
            PUBLIC CONTENT PIPELINE
          </div>
          <button
            onClick={() => setActiveTab('content')}
            className={`${styles.navItem} ${activeTab === 'content' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>🌐</span> Site Copy & Hero
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`${styles.navItem} ${activeTab === 'team' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>👥</span> Team & Leads ({leaders.length})
          </button>
          <button
            onClick={() => setActiveTab('domains')}
            className={`${styles.navItem} ${activeTab === 'domains' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>🧱</span> Domains ({domains.length})
          </button>
          <button
            onClick={() => setActiveTab('work')}
            className={`${styles.navItem} ${activeTab === 'work' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>🚀</span> Works & Platforms ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`${styles.navItem} ${activeTab === 'timeline' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>⏳</span> Timeline & Journey
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`${styles.navItem} ${activeTab === 'gallery' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>🖼️</span> Gallery ({store.gallery?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`${styles.navItem} ${activeTab === 'media' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>📁</span> Media Library ({mediaList.length})
          </button>
          <button
            onClick={() => setActiveTab('collaborations')}
            className={`${styles.navItem} ${activeTab === 'collaborations' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>🤝</span> Alliances ({collaborations.length})
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`${styles.navItem} ${activeTab === 'workflow' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>🔄</span> Delivery Workflow
          </button>

          <div className={styles.navGroupLabel} style={{ marginTop: '1.25rem' }}>
            GOVERNANCE & SYSTEM
          </div>
          <button
            onClick={() => setActiveTab('seo')}
            className={`${styles.navItem} ${activeTab === 'seo' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>🔍</span> SEO & Meta Tags
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>⚙️</span> Settings & DyeWhorl
          </button>
          <button
            onClick={() => setActiveTab('auditLog')}
            className={`${styles.navItem} ${activeTab === 'auditLog' ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>📜</span> Audit Trail ({auditLogs.length})
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminUser}>
            <div className={styles.adminAvatar}>A</div>
            <div>
              <div className={styles.adminName}>Superadmin</div>
              <div className={styles.adminRole}>admin@gwd-club.com</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <Link
              href="/"
              target="_blank"
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem', textAlign: 'center' }}
            >
              Public Site ↗
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.65rem', fontSize: '0.75rem', color: '#ef4444' }}
              title="Sign Out"
            >
              Exit
            </button>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN APPLICATION WORKSPACE
          ═══════════════════════════════════════════════════════════════ */}
      <main className={styles.content}>
        {/* Executive Operations Topbar */}
        <header className={styles.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span
              className={styles.badgeSuccess}
              style={{
                padding: '0.3rem 0.75rem',
                fontSize: '0.72rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                letterSpacing: '0.04em',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#34D399',
                  boxShadow: '0 0 10px #34D399',
                  display: 'inline-block',
                }}
              />
              CLOUD REPLICATION SYNCHRONIZED
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
              OPS RUNTIME v6.2.4 · HYDERABAD CLOUD CLUSTER
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => {
                setActiveEditEvent(null);
                setIsEventEditorOpen(true);
              }}
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
            >
              + Add Event
            </button>
            <button
              onClick={() => mediaFileInputRef.current?.click()}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
            >
              + Upload Media
            </button>
          </div>
        </header>

        {/* Dynamic Toast Feedback */}
        {toastMessage && <div className={styles.toast}>✓ {toastMessage}</div>}

        {/* ═══════════════════════════════════════════════════════════════
            01 — TAB: OPERATIONS DASHBOARD
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Operational Overview</h1>
                <p className={styles.tabDesc}>
                  Real-time participant counts, pending recruit applications, published summits, and pre-deployment health.
                </p>
              </div>
            </div>

            {/* Executive KPI Metrics Grid */}
            <div className={styles.metricsGrid}>
              <div className={`${styles.metricCard} ${styles.featuredMetricCard}`}>
                <BorderBeam size={170} duration={8} colorFrom="#E11D48" colorTo="#8B5CF6" borderWidth={2} />
                <div className={styles.metricLabel}>
                  <span>Total Registrations</span>
                  <span style={{ fontSize: '0.62rem', background: 'rgba(225, 29, 72, 0.15)', color: '#FB7185', padding: '0.15rem 0.45rem', borderRadius: '4px', letterSpacing: '0.04em' }}>
                    LIVE ATTENDEES
                  </span>
                </div>
                <span className={styles.metricValue}>{registrations.length}</span>
                <span className={styles.metricChange}>Across {allEvents.length} active summits & sprints</span>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricLabel}>
                  <span>Candidate Roster</span>
                  <span style={{ fontSize: '0.62rem', background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', padding: '0.15rem 0.45rem', borderRadius: '4px', letterSpacing: '0.04em' }}>
                    APPLICATIONS
                  </span>
                </div>
                <span className={styles.metricValue}>{applications.length}</span>
                <span className={styles.metricChange}>
                  <strong style={{ color: '#FBBF24' }}>{applications.filter((a) => a.status === 'New').length}</strong> pending review
                </span>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricLabel}>
                  <span>Platform Ventures</span>
                  <span style={{ fontSize: '0.62rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', padding: '0.15rem 0.45rem', borderRadius: '4px', letterSpacing: '0.04em' }}>
                    PRODUCTION
                  </span>
                </div>
                <span className={styles.metricValue}>{projects.length}</span>
                <span className={styles.metricChange}>Deployed case studies & systems</span>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricLabel}>
                  <span>Inbound Inquiries</span>
                  <span style={{ fontSize: '0.62rem', background: 'rgba(139, 92, 246, 0.15)', color: '#C084FC', padding: '0.15rem 0.45rem', borderRadius: '4px', letterSpacing: '0.04em' }}>
                    LEADS
                  </span>
                </div>
                <span className={styles.metricValue}>{messages.length}</span>
                <span className={styles.metricChange}>
                  <strong style={{ color: '#C084FC' }}>{messages.filter((m) => m.status === 'New').length}</strong> unread messages
                </span>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricLabel}>
                  <span>Connect & Partnerships</span>
                  <span style={{ fontSize: '0.62rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '0.15rem 0.45rem', borderRadius: '4px', letterSpacing: '0.04em' }}>
                    CAMPUS & CLUBS
                  </span>
                </div>
                <span className={styles.metricValue}>{connectRequests.length}</span>
                <span className={styles.metricChange}>
                  <strong style={{ color: '#34D399' }}>{connectRequests.filter((c) => c.status === 'New' || c.status === 'In Discussion').length}</strong> active in discussion
                </span>
              </div>
            </div>

            {/* Operations Quick Actions */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setActiveEditEvent(null);
                  setIsEventEditorOpen(true);
                }}
                className="btn btn-primary"
              >
                + Add Event
              </button>
              <button
                onClick={() => {
                  setActiveEditProject(null);
                  setIsProjectEditorOpen(true);
                }}
                className="btn btn-secondary"
              >
                + New Project Case Study
              </button>
              <button
                onClick={() => mediaFileInputRef.current?.click()}
                className="btn btn-secondary"
              >
                + Upload Media File
              </button>
              <button onClick={() => setActiveTab('applications')} className="btn btn-secondary">
                Review Candidate Applications ({applications.filter((a) => a.status === 'New').length})
              </button>
              <button onClick={() => setActiveTab('registrations')} className="btn btn-secondary">
                Manage Event Check-Ins ({registrations.length})
              </button>
            </div>

            {/* Live Events Table */}
            <div className={styles.tableCard} style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Active Sprints & Summits</h3>
                <button onClick={() => setActiveTab('events')} className={styles.textBtn}>
                  View All Events →
                </button>
              </div>

              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date & Venue</th>
                    <th>Registrations / Cap</th>
                    <th>Registration State</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.map((evt) => {
                    const count = registrations.filter((r) => r.eventId === evt.id).length;
                    const cap = evt.capacity || 200;
                    return (
                      <tr key={evt.id}>
                        <td>
                          <strong>{evt.title}</strong>
                          <span className={styles.subtext}>{evt.category}</span>
                        </td>
                        <td>
                          {evt.date} · {evt.time}
                          <span className={styles.subtext}>{evt.location}</span>
                        </td>
                        <td>
                          <strong>{count}</strong> / {cap}
                          <div style={{ width: '120px', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${Math.min(100, Math.round((count / cap) * 100))}%`,
                                height: '100%',
                                background: count >= cap ? 'linear-gradient(90deg, #EF4444, #F87171)' : 'linear-gradient(90deg, #E11D48, #F43F5E)',
                                boxShadow: '0 0 8px rgba(225, 29, 72, 0.5)',
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${evt.registrationOpen ? styles.badgeSuccess : styles.badgePending}`}>
                            {evt.registrationOpen ? 'Open' : 'Closed'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => setActiveDetailEvent(evt)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                          >
                            Manage Event & Attendees →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Recent Audit Log Preview */}
            <div className={styles.tableCard} style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Recent Administrative Audit Trail</h3>
                <button onClick={() => setActiveTab('auditLog')} className={styles.textBtn}>
                  Full Audit Log →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {auditLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      background: 'var(--color-bg)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div>
                      <span className={styles.codeBadge} style={{ marginRight: '0.5rem' }}>
                        {log.action}
                      </span>
                      <span>{log.details}</span>
                    </div>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            02 — TAB: SITE CONTENT & HOMEPAGE COPY
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'content' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Public Website Copy & Narrative</h1>
                <p className={styles.tabDesc}>
                  Manage hero copy, organizational statements, mission, vision, and final call-to-action blocks.
                </p>
              </div>
            </div>

            <div className={styles.tableCard} style={{ padding: '1.75rem' }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Homepage copy updated successfully!');
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Homepage Hero Section</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Headline *</label>
                      <input
                        type="text"
                        className="input"
                        value={store.homepage.hero.headline}
                        onChange={(e) => updateHomepage({ hero: { ...store.homepage.hero, headline: e.target.value } })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Badge Pill *</label>
                      <input
                        type="text"
                        className="input"
                        value={store.homepage.hero.badge}
                        onChange={(e) => updateHomepage({ hero: { ...store.homepage.hero, badge: e.target.value } })}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem', marginBottom: 0 }}>
                    <label className="label">Subheadline *</label>
                    <textarea
                      className="input"
                      rows={2}
                      value={store.homepage.hero.subheadline}
                      onChange={(e) => updateHomepage({ hero: { ...store.homepage.hero, subheadline: e.target.value } })}
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Mission & Vision Statements</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Institutional Mission</label>
                      <textarea
                        className="input"
                        rows={3}
                        value={store.homepage.intro.studentIdeaBody}
                        onChange={(e) => updateHomepage({ intro: { ...store.homepage.intro, studentIdeaBody: e.target.value } })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Long Lead Narrative</label>
                      <textarea
                        className="input"
                        rows={3}
                        value={store.homepage.intro.leadStory}
                        onChange={(e) => updateHomepage({ intro: { ...store.homepage.intro, leadStory: e.target.value } })}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Final Call-To-Action (Footer Banner)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">CTA Headline</label>
                      <input
                        type="text"
                        className="input"
                        value={store.homepage.finalCta.headline}
                        onChange={(e) => updateHomepage({ finalCta: { ...store.homepage.finalCta, headline: e.target.value } })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Highlight Keyword</label>
                      <input
                        type="text"
                        className="input"
                        value={store.homepage.finalCta.highlightWord}
                        onChange={(e) => updateHomepage({ finalCta: { ...store.homepage.finalCta, highlightWord: e.target.value } })}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary">
                    Save All Content Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            03 — TAB: TEAM & LEADERSHIP DOSSIERS
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'team' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Official 9-Role Leadership Structure</h1>
                <p className={styles.tabDesc}>
                  Strict 9-slot executive governance tier. Update names, biographies, photos, convictions, and responsibilities.
                </p>
              </div>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Slot</th>
                    <th>Official Role</th>
                    <th>Leader Name</th>
                    <th>Profile Photo</th>
                    <th>Quote / Conviction</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaders.map((leader, i) => (
                    <tr key={leader.id}>
                      <td>
                        <span className={styles.codeBadge}>Slot 0{i + 1}</span>
                      </td>
                      <td>
                        <strong>{leader.role}</strong>
                      </td>
                      <td>{leader.name}</td>
                      <td>
                        {leader.photo ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img
                              src={leader.photo}
                              alt={leader.name}
                              style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ fontSize: '0.8rem', color: '#22c55e' }}>Custom</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            ○ Geometric Placeholder
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={styles.subtext} style={{ maxWidth: '240px' }}>
                          {leader.quote || leader.bio?.slice(0, 50)}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setActiveEditLeader(leader);
                            setIsLeaderEditorOpen(true);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                        >
                          Edit Profile →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            04 — TAB: DOMAINS & CAPABILITIES
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'domains' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Organizational Domains & Member Rosters</h1>
                <p className={styles.tabDesc}>
                  Manage GWD&apos;s 6 working divisions, leads, deliverables, and member rosters.
                </p>
              </div>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Domain Name</th>
                    <th>Domain Lead</th>
                    <th>Lead Role</th>
                    <th>Verified Members</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map((domain) => (
                    <tr key={domain.id}>
                      <td>
                        <span className={styles.codeBadge}>{domain.code}</span>
                      </td>
                      <td>
                        <strong>{domain.name}</strong>
                      </td>
                      <td>{domain.leadName}</td>
                      <td>{domain.leadRole}</td>
                      <td>{domain.members?.length || 0} members</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles.badgeSuccess}`}>{domain.status}</span>
                      </td>
                      <td>
                        <button onClick={() => setSelectedDomain(domain)} className={styles.textBtn}>
                          Manage Domain →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected Domain Editor Drawer */}
            {selectedDomain && (
              <div className={styles.tableCard} style={{ marginTop: '2rem', padding: '1.75rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontWeight: 800, fontSize: '1.35rem', margin: 0 }}>
                        Editing Domain: {selectedDomain.name} ({selectedDomain.code})
                      </h3>
                      <span className={`${styles.statusBadge} ${selectedDomain.status === 'Published' ? styles.badgeSuccess : styles.badgeDraft}`}>
                        {selectedDomain.status}
                      </span>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                      Update division scope, assigned lead, deliverables, and verified member roster.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => {
                        updateDomain(selectedDomain.id, selectedDomain);
                        showToast(`Saved changes for ${selectedDomain.name} Domain!`);
                      }}
                      className="btn btn-primary"
                    >
                      Save Domain Changes
                    </button>
                    <button onClick={() => setSelectedDomain(null)} className="btn btn-secondary">
                      Close Editor
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  {/* Left Column: Domain Scope & Identity */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label">Domain Name</label>
                        <input
                          type="text"
                          className="input"
                          value={selectedDomain.name}
                          onChange={(e) => setSelectedDomain({ ...selectedDomain, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label">Code</label>
                        <input
                          type="text"
                          className="input"
                          value={selectedDomain.code}
                          onChange={(e) => setSelectedDomain({ ...selectedDomain, code: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label">Status</label>
                        <select
                          className="input"
                          value={selectedDomain.status}
                          onChange={(e) => setSelectedDomain({ ...selectedDomain, status: e.target.value as 'Published' | 'Draft' })}
                        >
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Short Description</label>
                      <input
                        type="text"
                        className="input"
                        value={selectedDomain.shortDesc}
                        onChange={(e) => setSelectedDomain({ ...selectedDomain, shortDesc: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Full Division Scope</label>
                      <textarea
                        className="input"
                        rows={4}
                        value={selectedDomain.fullDesc}
                        onChange={(e) => setSelectedDomain({ ...selectedDomain, fullDesc: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Right Column: Domain Lead Management */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--color-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                      Domain Lead Profile
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                        background: 'var(--color-bg-secondary)',
                        border: '2px solid var(--color-border)',
                        flexShrink: 0,
                      }}>
                        {selectedDomain.leadPhoto ? (
                          <img
                            src={selectedDomain.leadPhoto}
                            alt={selectedDomain.leadName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>👤</div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => domainLeadFileInputRef.current?.click()}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          Upload Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsDomainLeadMediaPickerOpen(true)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          Media Library
                        </button>
                        {selectedDomain.leadPhoto && (
                          <button
                            type="button"
                            onClick={() => setSelectedDomain({ ...selectedDomain, leadPhoto: '' })}
                            className="btn btn-ghost"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#ef4444' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label">Lead Full Name</label>
                        <input
                          type="text"
                          className="input"
                          value={selectedDomain.leadName}
                          onChange={(e) => setSelectedDomain({ ...selectedDomain, leadName: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label">Lead Role Title</label>
                        <input
                          type="text"
                          className="input"
                          value={selectedDomain.leadRole}
                          onChange={(e) => setSelectedDomain({ ...selectedDomain, leadRole: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Lead Quote / Conviction</label>
                      <input
                        type="text"
                        className="input"
                        value={selectedDomain.leadQuote || ''}
                        onChange={(e) => setSelectedDomain({ ...selectedDomain, leadQuote: e.target.value })}
                        placeholder="Quote representing domain ethos..."
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Lead Biography</label>
                      <textarea
                        className="input"
                        rows={2}
                        value={selectedDomain.leadBio || ''}
                        onChange={(e) => setSelectedDomain({ ...selectedDomain, leadBio: e.target.value })}
                        placeholder="Short biography of domain lead..."
                      />
                    </div>
                  </div>
                </div>

                {/* Domain Members Management */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ fontWeight: 700, margin: 0, fontSize: '1.1rem' }}>
                        Domain Members Roster ({selectedDomain.members?.length || 0})
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        Manage builder profiles, order of display on /explore, and active participation.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDomainMember(null);
                        setIsNewDomainMember(true);
                        setIsDomainMemberModalOpen(true);
                      }}
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                    >
                      + Add Member
                    </button>
                  </div>

                  <table className={styles.dataTable} style={{ marginBottom: '1.5rem' }}>
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Photo</th>
                        <th>Member Name</th>
                        <th>Role Title</th>
                        <th>Bio / Focus</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedDomain.members || []).map((m, idx) => (
                        <tr key={m.id}>
                          <td>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <button
                                type="button"
                                onClick={() => handleMoveMember(selectedDomain, idx, 'up')}
                                disabled={idx === 0}
                                style={{
                                  padding: '0.2rem 0.4rem',
                                  fontSize: '0.7rem',
                                  border: '1px solid var(--color-border)',
                                  background: 'var(--color-bg)',
                                  color: idx === 0 ? 'var(--color-text-muted)' : 'var(--color-text)',
                                  borderRadius: 'var(--radius-sm)',
                                  cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                }}
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveMember(selectedDomain, idx, 'down')}
                                disabled={idx === (selectedDomain.members?.length || 0) - 1}
                                style={{
                                  padding: '0.2rem 0.4rem',
                                  fontSize: '0.7rem',
                                  border: '1px solid var(--color-border)',
                                  background: 'var(--color-bg)',
                                  color: idx === (selectedDomain.members?.length || 0) - 1 ? 'var(--color-text-muted)' : 'var(--color-text)',
                                  borderRadius: 'var(--radius-sm)',
                                  cursor: idx === (selectedDomain.members?.length || 0) - 1 ? 'not-allowed' : 'pointer',
                                }}
                                title="Move Down"
                              >
                                ▼
                              </button>
                            </div>
                          </td>
                          <td>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: 'var(--radius-full)',
                              overflow: 'hidden',
                              background: 'var(--color-bg)',
                              border: '1px solid var(--color-border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              {m.photo ? (
                                <img src={m.photo} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>👤</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <strong>{m.name}</strong>
                          </td>
                          <td>
                            <span className={styles.codeBadge}>{m.role}</span>
                          </td>
                          <td>
                            <span className={styles.subtext}>{m.bio}</span>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleToggleMemberActive(selectedDomain, m.id)}
                              style={{
                                padding: '0.2rem 0.6rem',
                                fontSize: '0.75rem',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                fontWeight: 700,
                                cursor: 'pointer',
                                background: m.active !== false ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                                color: m.active !== false ? '#10b981' : '#9ca3af',
                              }}
                            >
                              {m.active !== false ? 'ACTIVE' : 'INACTIVE'}
                            </button>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDomainMember(m);
                                  setIsNewDomainMember(false);
                                  setIsDomainMemberModalOpen(true);
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDomainMember(selectedDomain, m.id, m.name)}
                                className={styles.deleteBtn}
                                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            05 — TAB: WORKS & PLATFORMS
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'work' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Works & Platform Ventures ({projects.length})</h1>
                <p className={styles.tabDesc}>
                  Manage shipped production systems, client case studies, and live deliverables showcased on /work.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveEditProject(null);
                  setIsProjectEditorOpen(true);
                }}
                className="btn btn-primary"
              >
                + New Project
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Category</th>
                    <th>Year</th>
                    <th>Measured Impact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.title}</strong>
                        {p.featured && (
                          <span className={styles.codeBadge} style={{ marginLeft: '0.4rem' }}>
                            Featured
                          </span>
                        )}
                        <span className={styles.subtext}>{p.shortDescription?.slice(0, 60)}...</span>
                      </td>
                      <td>
                        <span className={styles.domainBadge}>{p.category}</span>
                      </td>
                      <td>{p.year}</td>
                      <td>{p.outcome}</td>
                      <td>
                        <button
                          onClick={() => {
                            setActiveEditProject(p);
                            setIsProjectEditorOpen(true);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                        >
                          Edit Project →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            06 — TAB: EVENTS & SPRINTS
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'events' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Events & Sprints Lifecycle</h1>
                <p className={styles.tabDesc}>
                  Full operations panel for summits, hackathons, and builder sprints. Manage capacity, open/close registrations, and export attendee lists.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveEditEvent(null);
                  setIsEventEditorOpen(true);
                }}
                className="btn btn-primary"
              >
                + Add Event
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Schedule</th>
                    <th>Venue</th>
                    <th>Registrations</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allEvents.map((e) => {
                    const count = registrations.filter((r) => r.eventId === e.id).length;
                    const isUpcoming = upcomingEvents.some((u) => u.id === e.id);
                    return (
                      <tr key={e.id}>
                        <td>
                          <strong>{e.title}</strong>
                          <span className={styles.subtext}>{e.category}</span>
                        </td>
                        <td>
                          {e.date} · {e.time}
                        </td>
                        <td>{e.location}</td>
                        <td>
                          <strong>{count}</strong> / {e.capacity || 200}
                        </td>
                        <td>
                          {isUpcoming ? (
                            <span className={`${styles.statusBadge} ${e.registrationOpen ? styles.badgeSuccess : styles.badgePending}`}>
                              {e.registrationOpen ? 'Open' : 'Closed'}
                            </span>
                          ) : (
                            <span className={`${styles.statusBadge} ${styles.badgePending}`}>Archived / Past</span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => setActiveDetailEvent(e)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                          >
                            Manage Event & Attendees →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            07 — TAB: TIMELINE & JOURNEY
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'timeline' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Timeline & Milestones</h1>
                <p className={styles.tabDesc}>
                  Milestones and photographic captures chronicling GWD from inception to international deployment.
                </p>
              </div>
              <button onClick={handleOpenCreateStoryline} className="btn btn-primary">
                + Add Milestone
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Year & Month</th>
                    <th>Headline</th>
                    <th>Story Content</th>
                    <th>Photo Asset</th>
                    <th>Track</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {storylineMilestones.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.year}</strong> · {item.month}
                      </td>
                      <td>{item.headline || '—'}</td>
                      <td style={{ maxWidth: '300px' }}>
                        <span className={styles.subtext}>{item.content}</span>
                      </td>
                      <td>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt="Milestone preview"
                            style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>None</span>
                        )}
                      </td>
                      <td>
                        <span className={styles.codeBadge}>{item.track}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleOpenEditStoryline(item)} className={styles.textBtn}>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteStoryline(item.id)} className={styles.textBtn} style={{ color: '#ef4444' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            08 — TAB: GALLERY
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'gallery' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Public Photo Gallery ({store.gallery?.length || 0})</h1>
                <p className={styles.tabDesc}>
                  High-resolution photo captures and behind-the-scenes moments displayed on /gallery.
                </p>
              </div>
              <button onClick={handleOpenCreateGallery} className="btn btn-primary">
                + Add Gallery Image
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {(store.gallery || []).map((g) => {
                const assetKey = g.id || g.src;
                return (
                  <div key={assetKey} className={styles.tableCard} style={{ padding: '0.75rem' }}>
                    <img
                      src={g.src}
                      alt={g.caption}
                      style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ marginTop: '0.5rem' }}>
                      <span className={styles.domainBadge} style={{ fontSize: '0.7rem' }}>
                        {g.category}
                      </span>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '4px' }}>{g.caption}</p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
                        <button onClick={() => handleOpenEditGallery(g)} className={styles.textBtn} style={{ fontSize: '0.78rem' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteGallery(assetKey, g.caption)} className={styles.textBtn} style={{ color: '#ef4444', fontSize: '0.78rem' }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            09 — TAB: MEDIA LIBRARY
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'media' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Central Media Library ({mediaList.length})</h1>
                <p className={styles.tabDesc}>
                  Upload, organize, and copy verified image assets to reuse across events, galleries, and project case studies.
                </p>
              </div>
              <button onClick={() => mediaFileInputRef.current?.click()} className="btn btn-primary">
                + Upload Media
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Search assets by filename or category..."
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                className="input"
                style={{ maxWidth: '320px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {filteredMedia.map((m) => (
                <div key={m.id} className={styles.tableCard} style={{ padding: '0.75rem' }}>
                  <img
                    src={m.url}
                    alt={m.name}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>{m.name}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span className={styles.domainBadge} style={{ fontSize: '0.7rem' }}>
                        {m.category}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>{m.size || 'WebP'}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(m.url);
                          showToast('Asset URL copied to clipboard');
                        }}
                        className={styles.textBtn}
                        style={{ fontSize: '0.75rem' }}
                      >
                        Copy URL
                      </button>
                      <button
                        onClick={() => {
                          setConfirmConfig({
                            isOpen: true,
                            title: `Delete Media "${m.name}"?`,
                            message: 'This will remove the file from the media library.',
                            confirmLabel: 'Delete Media',
                            isDestructive: true,
                            onConfirm: () => {
                              deleteMedia(m.id);
                              setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
                              showToast('Media asset removed');
                            },
                          });
                        }}
                        className={styles.textBtn}
                        style={{ color: '#ef4444', fontSize: '0.75rem', marginLeft: 'auto' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            10 — TAB: ALLIANCES & COLLABORATIONS
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'collaborations' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Institutional Alliances & Partners ({collaborations.length})</h1>
                <p className={styles.tabDesc}>
                  Government innovation cells, university entrepreneurship hubs, and commercial partners on /collaborations.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveEditPartner(null);
                  setIsPartnerEditorOpen(true);
                }}
                className="btn btn-primary"
              >
                + Add Partner
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Type</th>
                    <th>Year</th>
                    <th>Outcome</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {collaborations.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.name}</strong>
                        {p.featured && (
                          <span className={styles.codeBadge} style={{ marginLeft: '0.4rem' }}>
                            Featured
                          </span>
                        )}
                        <span className={styles.subtext}>{p.description?.slice(0, 60)}...</span>
                      </td>
                      <td>
                        <span className={styles.domainBadge}>{p.type}</span>
                      </td>
                      <td>{p.year}</td>
                      <td>{p.outcome}</td>
                      <td>
                        <button
                          onClick={() => {
                            setActiveEditPartner(p);
                            setIsPartnerEditorOpen(true);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                        >
                          Edit Alliance →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            11 — TAB: WORKFLOW ENGINE
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'workflow' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Production Delivery Workflow</h1>
                <p className={styles.tabDesc}>
                  Manage the 6-stage engineering and pre-deployment QA lifecycle showcased to clients and incoming student builders on /workflow.
                </p>
              </div>
              <button onClick={handleOpenCreateWorkflow} className="btn btn-primary">
                + Add Workflow Step
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Phase</th>
                    <th>Title</th>
                    <th>Duration</th>
                    <th>Key Deliverables</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workflowSteps.map((w) => (
                    <tr key={w.id || w.stepNumber}>
                      <td>
                        <span className={styles.codeBadge}>{w.stepNumber}</span>
                      </td>
                      <td>
                        <span className={styles.domainBadge}>{w.phase}</span>
                      </td>
                      <td>
                        <strong>{w.title}</strong>
                      </td>
                      <td>{w.duration}</td>
                      <td style={{ maxWidth: '300px' }}>
                        {Array.isArray(w.deliverables) ? w.deliverables.join(', ') : w.deliverables}
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${w.status === 'Published' ? styles.badgeSuccess : styles.badgePending}`}>
                          {w.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleOpenEditWorkflow(w)} className={styles.textBtn}>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteWorkflow(w.id || w.stepNumber, w.title)} className={styles.textBtn} style={{ color: '#ef4444' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            12 — TAB: APPLICATIONS (JOIN GWD)
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'applications' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Join GWD Candidate Applications ({applications.length})</h1>
                <p className={styles.tabDesc}>
                  Screen, evaluate, and update status for incoming student builder recruits from /join.
                </p>
              </div>
              <button onClick={handleExportApplications} className="btn btn-secondary">
                Export Applications (Excel)
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search candidates by name, email, department..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="input"
                style={{ maxWidth: '280px' }}
              />
              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="input"
                style={{ maxWidth: '180px' }}
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Target Domain</th>
                    <th>Department & Year</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <strong>{a.name}</strong>
                        <span className={styles.subtext}>{a.email}</span>
                      </td>
                      <td>
                        <span className={styles.domainBadge}>{a.domain}</span>
                      </td>
                      <td>
                        {a.department} · Year {a.year}
                      </td>
                      <td>{a.appliedAt?.split('T')[0]}</td>
                      <td>
                        <select
                          value={a.status}
                          onChange={(e) => handleUpdateAppStatus(a.id, e.target.value as ApplicationRecord['status'])}
                          className={styles.statusSelect}
                        >
                          <option value="New">New</option>
                          <option value="Reviewing">Reviewing</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={() => setSelectedApp(a)} className={styles.textBtn}>
                          Inspect Dossier →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Candidate Dossier Detail Drawer */}
            {selectedApp && (
              <div className={styles.tableCard} style={{ marginTop: '2rem', padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  <div>
                    <span className={styles.codeBadge}>{selectedApp.id}</span>
                    <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginTop: '0.25rem' }}>
                      Candidate: {selectedApp.name}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedApp(null)} className="btn btn-secondary">
                    Close Dossier
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span className={styles.subtext}>Email Address</span>
                    <p style={{ fontWeight: 600 }}>{selectedApp.email}</p>
                  </div>
                  <div>
                    <span className={styles.subtext}>Phone Number</span>
                    <p style={{ fontWeight: 600 }}>{selectedApp.phone || '—'}</p>
                  </div>
                  <div>
                    <span className={styles.subtext}>Portfolio / GitHub</span>
                    <p>
                      {selectedApp.portfolio ? (
                        <a href={selectedApp.portfolio} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                          {selectedApp.portfolio} ↗
                        </a>
                      ) : (
                        '—'
                      )}
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Why GWD & Conviction Statement</label>
                  <div style={{ background: 'var(--color-bg)', padding: '1rem', borderRadius: '4px', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {selectedApp.why}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <button
                    onClick={() => {
                      setConfirmConfig({
                        isOpen: true,
                        title: `Delete Application for ${selectedApp.name}?`,
                        message: 'This application record will be permanently purged.',
                        confirmLabel: 'Delete Application',
                        isDestructive: true,
                        onConfirm: () => {
                          deleteApplication(selectedApp.id);
                          setSelectedApp(null);
                          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
                          showToast('Application deleted');
                        },
                      });
                    }}
                    className={styles.deleteBtn}
                  >
                    Delete Record
                  </button>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Update Status:</span>
                    <select
                      value={selectedApp.status}
                      onChange={(e) => handleUpdateAppStatus(selectedApp.id, e.target.value as ApplicationRecord['status'])}
                      className={styles.statusSelect}
                    >
                      <option value="New">New</option>
                      <option value="Reviewing">Reviewing</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            13 — TAB: MASTER REGISTRATIONS & ATTENDANCE
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'registrations' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Event Registrations & Summit Check-In ({registrations.length})</h1>
                <p className={styles.tabDesc}>
                  Real-time attendee pass verification, attendance check-ins, and master spreadsheet export.
                </p>
              </div>
              <button onClick={handleExportAllRegistrations} className="btn btn-secondary">
                Export Registrations (Excel)
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search attendee by name, email, or pass ID..."
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
                className="input"
                style={{ maxWidth: '320px' }}
              />
              <select
                value={regEventFilter}
                onChange={(e) => setRegEventFilter(e.target.value)}
                className="input"
                style={{ maxWidth: '260px' }}
              >
                <option value="all">All Events ({allEvents.length})</option>
                {allEvents.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Pass ID</th>
                    <th>Participant</th>
                    <th>Institution</th>
                    <th>Event</th>
                    <th>Attendance Check</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <span className={styles.codeBadge}>{r.id}</span>
                      </td>
                      <td>
                        <strong>{r.name}</strong>
                        <span className={styles.subtext}>{r.email}</span>
                      </td>
                      <td>{r.college}</td>
                      <td>{r.eventTitle}</td>
                      <td>
                        <button
                          onClick={() => handleToggleAttendance(r.id)}
                          className={styles.statusBadge}
                          style={{
                            background: r.attendance ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                            color: r.attendance ? '#22c55e' : '#ef4444',
                            border: `1px solid ${r.attendance ? '#22c55e' : '#ef4444'}`,
                            cursor: 'pointer',
                          }}
                        >
                          {r.attendance ? '✓ Checked In' : '○ Not Checked In'}
                        </button>
                      </td>
                      <td>
                        <button onClick={() => setSelectedReg(r)} className={styles.textBtn}>
                          Inspect Pass →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected Registration Detail Drawer */}
            {selectedReg && (
              <div className={styles.tableCard} style={{ marginTop: '2rem', padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  <div>
                    <span className={styles.codeBadge}>{selectedReg.id}</span>
                    <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginTop: '0.25rem' }}>
                      Attendee: {selectedReg.name}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedReg(null)} className="btn btn-secondary">
                    Close Pass
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span className={styles.subtext}>Event</span>
                    <p style={{ fontWeight: 600 }}>{selectedReg.eventTitle}</p>
                  </div>
                  <div>
                    <span className={styles.subtext}>Institution</span>
                    <p style={{ fontWeight: 600 }}>{selectedReg.college}</p>
                  </div>
                  <div>
                    <span className={styles.subtext}>Department & Year</span>
                    <p style={{ fontWeight: 600 }}>{selectedReg.department} · Year {selectedReg.year}</p>
                  </div>
                  <div>
                    <span className={styles.subtext}>Phone Number</span>
                    <p style={{ fontWeight: 600 }}>{selectedReg.phone || '—'}</p>
                  </div>
                </div>

                {selectedReg.message && (
                  <div className="form-group">
                    <label className="label">Registered Track / Project Interest</label>
                    <div style={{ background: 'var(--color-bg)', padding: '0.75rem', borderRadius: '4px' }}>
                      {selectedReg.message}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <button
                    onClick={() => {
                      setConfirmConfig({
                        isOpen: true,
                        title: `Delete Registration for ${selectedReg.name}?`,
                        message: 'This registration pass will be permanently revoked.',
                        confirmLabel: 'Delete Pass',
                        isDestructive: true,
                        onConfirm: () => {
                          deleteRegistration(selectedReg.id);
                          setSelectedReg(null);
                          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
                          showToast('Registration deleted');
                        },
                      });
                    }}
                    className={styles.deleteBtn}
                  >
                    Delete Registration
                  </button>
                  <button
                    onClick={() => handleToggleAttendance(selectedReg.id)}
                    className="btn btn-primary"
                  >
                    Toggle Attendance Check-In
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            14 — TAB: MESSAGES & CONTACT INQUIRIES
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'messages' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Inbound Inquiries & Messages ({messages.length})</h1>
                <p className={styles.tabDesc}>
                  Submissions from /contact and /collaborations inbound pipelines.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search messages by sender, email, subject..."
                value={msgSearch}
                onChange={(e) => setMsgSearch(e.target.value)}
                className="input"
                style={{ maxWidth: '300px' }}
              />
              <select
                value={msgStatusFilter}
                onChange={(e) => setMsgStatusFilter(e.target.value)}
                className="input"
                style={{ maxWidth: '180px' }}
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Opened">Opened</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Received Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <strong>{m.name}</strong>
                        <span className={styles.subtext}>{m.email}</span>
                      </td>
                      <td>
                        <strong>{m.subject}</strong>
                        <span className={styles.subtext}>{m.message?.slice(0, 50)}...</span>
                      </td>
                      <td>{m.receivedAt?.split('T')[0]}</td>
                      <td>
                        <select
                          value={m.status}
                          onChange={(e) => handleUpdateMsgStatus(m.id, e.target.value as ContactMessage['status'])}
                          className={styles.statusSelect}
                        >
                          <option value="New">New</option>
                          <option value="Opened">Opened</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={() => setSelectedMsg(m)} className={styles.textBtn}>
                          Read Message →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Read Message Drawer */}
            {selectedMsg && (
              <div className={styles.tableCard} style={{ marginTop: '2rem', padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  <div>
                    <span className={styles.codeBadge}>{selectedMsg.id}</span>
                    <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginTop: '0.25rem' }}>
                      {selectedMsg.subject}
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                      From: {selectedMsg.name} ({selectedMsg.email}) · {new Date(selectedMsg.receivedAt).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => setSelectedMsg(null)} className="btn btn-secondary">
                    Close Message
                  </button>
                </div>

                <div style={{ background: 'var(--color-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {selectedMsg.message}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <button
                    onClick={() => {
                      setConfirmConfig({
                        isOpen: true,
                        title: `Delete Message from ${selectedMsg.name}?`,
                        message: 'This message will be permanently deleted.',
                        confirmLabel: 'Delete Message',
                        isDestructive: true,
                        onConfirm: () => {
                          deleteMessage(selectedMsg.id);
                          setSelectedMsg(null);
                          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
                          showToast('Message deleted');
                        },
                      });
                    }}
                    className={styles.deleteBtn}
                  >
                    Delete Message
                  </button>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</span>
                    <select
                      value={selectedMsg.status}
                      onChange={(e) => handleUpdateMsgStatus(selectedMsg.id, e.target.value as ContactMessage['status'])}
                      className={styles.statusSelect}
                    >
                      <option value="New">New</option>
                      <option value="Opened">Opened</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB: PARTNERSHIPS & CONNECT REQUESTS
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'partnerships' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>
                  Institutional Partnerships & Connect Requests ({connectRequests.length})
                </h1>
                <p className={styles.tabDesc}>
                  Manage inbound college builder sprints, collaborative software initiatives, co-hosted hackathons, and keynote invitations.
                </p>
              </div>
              <button onClick={handleExportAllConnectRequests} className="btn btn-secondary">
                📊 Export Partnerships (.xlsx)
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search by requester, institution, city, pass ID..."
                value={connectSearch}
                onChange={(e) => setConnectSearch(e.target.value)}
                className="input"
                style={{ maxWidth: '320px' }}
              />

              <select
                value={connectTypeFilter}
                onChange={(e) => setConnectTypeFilter(e.target.value)}
                className="input"
                style={{ maxWidth: '240px' }}
              >
                <option value="all">All Engagement Tracks</option>
                <option value="bring_to_college">🏛️ Bring to College</option>
                <option value="collaborate">🤝 Collaborate With GWD</option>
                <option value="host_event">⚡ Host an Event</option>
                <option value="community_partnership">🌐 Club / Community Partnership</option>
                <option value="invite_gwd">🎙️ Invite GWD (Speaker/Jury)</option>
              </select>

              <select
                value={connectStatusFilter}
                onChange={(e) => setConnectStatusFilter(e.target.value)}
                className="input"
                style={{ maxWidth: '180px' }}
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Contacted">Contacted</option>
                <option value="In Discussion">In Discussion</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Declined">Declined</option>
                <option value="Archived">Archived</option>
              </select>

              {uniqueConnectInstitutions.length > 0 && (
                <select
                  value={connectInstitutionFilter}
                  onChange={(e) => setConnectInstitutionFilter(e.target.value)}
                  className="input"
                  style={{ maxWidth: '240px' }}
                >
                  <option value="all">All Institutions ({uniqueConnectInstitutions.length})</option>
                  {uniqueConnectInstitutions.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
              )}

              {(connectSearch || connectTypeFilter !== 'all' || connectStatusFilter !== 'all' || connectInstitutionFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setConnectSearch('');
                    setConnectTypeFilter('all');
                    setConnectStatusFilter('all');
                    setConnectInstitutionFilter('all');
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Requests Table */}
            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Reference & Date</th>
                    <th>Requester Profile</th>
                    <th>Institution / Community</th>
                    <th>Track & Scope</th>
                    <th>Assigned Lead</th>
                    <th>Lifecycle Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConnectRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                        No partnership requests found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredConnectRequests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <span className={styles.codeBadge}>{req.id}</span>
                          <span className={styles.subtext}>
                            {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—'}
                          </span>
                        </td>
                        <td>
                          <strong>{req.fullName}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'block' }}>
                            {req.roleDesignation}
                          </span>
                          <span className={styles.subtext}>{req.email}</span>
                        </td>
                        <td>
                          <strong>{req.institutionName}</strong>
                          <span className={styles.subtext}>
                            {req.city}, {req.state}
                          </span>
                        </td>
                        <td>
                          <span
                            className={styles.domainBadge}
                            style={{
                              background: 'rgba(229, 62, 62, 0.12)',
                              color: '#ff5252',
                              border: '1px solid rgba(229, 62, 62, 0.25)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              marginBottom: '0.25rem',
                            }}
                          >
                            <span>{CONNECT_REQUEST_TYPE_LABELS[req.requestType]?.icon || '🏛️'}</span>
                            <span>{CONNECT_REQUEST_TYPE_LABELS[req.requestType]?.title || req.requestType}</span>
                          </span>
                          {req.proposedEventName && (
                            <span
                              style={{
                                display: 'block',
                                fontSize: '0.78rem',
                                color: '#ffffff',
                                maxWidth: '240px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {req.proposedEventName}
                            </span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: req.assignedPoc ? '#60a5fa' : '#64748b' }}>
                            {req.assignedPoc || '— Unassigned —'}
                          </span>
                        </td>
                        <td>
                          <select
                            value={req.status}
                            onChange={(e) => {
                              updateConnectRequestStatus(req.id, e.target.value as ConnectRequestStatus);
                              showToast(`Updated ${req.id} status to ${e.target.value}`);
                            }}
                            className={styles.statusSelect}
                            style={{
                              background:
                                req.status === 'Approved'
                                  ? 'rgba(16, 185, 129, 0.2)'
                                  : req.status === 'In Discussion'
                                  ? 'rgba(59, 130, 246, 0.2)'
                                  : req.status === 'Contacted'
                                  ? 'rgba(245, 158, 11, 0.2)'
                                  : req.status === 'Completed'
                                  ? 'rgba(139, 92, 246, 0.2)'
                                  : req.status === 'Declined'
                                  ? 'rgba(239, 68, 68, 0.2)'
                                  : 'rgba(255, 255, 255, 0.08)',
                              color:
                                req.status === 'Approved'
                                  ? '#34d399'
                                  : req.status === 'In Discussion'
                                  ? '#60a5fa'
                                  : req.status === 'Contacted'
                                  ? '#fbbf24'
                                  : req.status === 'Completed'
                                  ? '#a78bfa'
                                  : req.status === 'Declined'
                                  ? '#f87171'
                                  : '#e2e8f0',
                            }}
                          >
                            <option value="New">New</option>
                            <option value="Reviewing">Reviewing</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="Approved">Approved</option>
                            <option value="Completed">Completed</option>
                            <option value="Declined">Declined</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setActiveConnectModalReq(req);
                              setIsConnectModalOpen(true);
                            }}
                            className={styles.textBtn}
                          >
                            Inspect Dossier →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            14.5 — TAB: SEARCH ENGINE OPTIMIZATION & SOCIAL SHARING
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'seo' && <SeoManager />}

        {/* ═══════════════════════════════════════════════════════════════
            15 — TAB: SETTINGS & DYEWHORL CONTROLS
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Platform Configuration & Governance</h1>
                <p className={styles.tabDesc}>
                  Manage GWD legal entity records, social profiles, SEO meta tags, and public-site DyeWhorl settings.
                </p>
              </div>
            </div>

            <div className={styles.tableCard} style={{ padding: '1.75rem' }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('System configuration saved successfully!');
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                {/* Legal Entity */}
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>GWD Legal & Entity Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Collective Name</label>
                      <input
                        type="text"
                        className="input"
                        value={store.settings.clubName}
                        onChange={(e) => updateSettings({ clubName: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Registered Company Name</label>
                      <input
                        type="text"
                        className="input"
                        value={store.settings.companyName}
                        onChange={(e) => updateSettings({ companyName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">CIN (Corporate Identity Number)</label>
                      <input
                        type="text"
                        className="input"
                        value={store.settings.cin}
                        onChange={(e) => updateSettings({ cin: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">GSTIN</label>
                      <input
                        type="text"
                        className="input"
                        value={store.settings.gstin}
                        onChange={(e) => updateSettings({ gstin: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* CMS-Managed GWD Partnerships & Connect Desk */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.4rem' }}>
                    🏛️ Public Connect / Institutional Partnerships Desk
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                    These contact and desk details are displayed directly on the public /connect gateway so external colleges and communities know their authoritative GWD liaison.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Partnership Lead Name(s)</label>
                      <input
                        type="text"
                        className="input"
                        value={store.settings.partnershipLead?.name || ''}
                        onChange={(e) =>
                          updateSettings({
                            partnershipLead: {
                              ...(store.settings.partnershipLead || {
                                name: '',
                                role: '',
                                email: '',
                                phone: '',
                                deskLocation: '',
                                responseWindow: '',
                              }),
                              name: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Executive Role / Title</label>
                      <input
                        type="text"
                        className="input"
                        value={store.settings.partnershipLead?.role || ''}
                        onChange={(e) =>
                          updateSettings({
                            partnershipLead: {
                              ...(store.settings.partnershipLead || {
                                name: '',
                                role: '',
                                email: '',
                                phone: '',
                                deskLocation: '',
                                responseWindow: '',
                              }),
                              role: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Official Email</label>
                      <input
                        type="email"
                        className="input"
                        value={store.settings.partnershipLead?.email || ''}
                        onChange={(e) =>
                          updateSettings({
                            partnershipLead: {
                              ...(store.settings.partnershipLead || {
                                name: '',
                                role: '',
                                email: '',
                                phone: '',
                                deskLocation: '',
                                responseWindow: '',
                              }),
                              email: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Phone / WhatsApp</label>
                      <input
                        type="text"
                        className="input"
                        value={store.settings.partnershipLead?.phone || ''}
                        onChange={(e) =>
                          updateSettings({
                            partnershipLead: {
                              ...(store.settings.partnershipLead || {
                                name: '',
                                role: '',
                                email: '',
                                phone: '',
                                deskLocation: '',
                                responseWindow: '',
                              }),
                              phone: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">Physical Desk Location</label>
                      <input
                        type="text"
                        className="input"
                        value={store.settings.partnershipLead?.deskLocation || ''}
                        onChange={(e) =>
                          updateSettings({
                            partnershipLead: {
                              ...(store.settings.partnershipLead || {
                                name: '',
                                role: '',
                                email: '',
                                phone: '',
                                deskLocation: '',
                                responseWindow: '',
                              }),
                              deskLocation: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label">SLA Response Window</label>
                      <input
                        type="text"
                        className="input"
                        value={store.settings.partnershipLead?.responseWindow || ''}
                        onChange={(e) =>
                          updateSettings({
                            partnershipLead: {
                              ...(store.settings.partnershipLead || {
                                name: '',
                                role: '',
                                email: '',
                                phone: '',
                                deskLocation: '',
                                responseWindow: '',
                              }),
                              responseWindow: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* DyeWhorl Public Controls */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.4rem' }}>Public Website DyeWhorl Visual Controls</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                    DyeWhorl runs exclusively behind the public website, tracking cursor position without owning pointer events. It is never active inside the CMS workspace.
                  </p>

                  <div style={{ display: 'flex', gap: '2rem', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <input
                        type="checkbox"
                        id="dyewhorl-toggle"
                        checked={store.settings.dyeWhorlEnabled}
                        onChange={(e) => updateSettings({ dyeWhorlEnabled: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                      />
                      <label htmlFor="dyewhorl-toggle" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                        DyeWhorl Enabled on Public Website
                      </label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <label htmlFor="dyewhorl-intensity" style={{ fontSize: '0.85rem' }}>
                        Visual Fluid Intensity:
                      </label>
                      <select
                        id="dyewhorl-intensity"
                        value={store.settings.dyeWhorlIntensity || 'normal'}
                        onChange={(e) => updateSettings({ dyeWhorlIntensity: e.target.value as 'subtle' | 'normal' | 'vivid' })}
                        className="input"
                        style={{ width: '140px', padding: '0.35rem' }}
                      >
                        <option value="subtle">Subtle</option>
                        <option value="normal">Normal (Default)</option>
                        <option value="vivid">Vivid</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Factory Reset */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontWeight: 700, color: '#ef4444' }}>Danger Zone: Reset All CMS Data</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      Revert all events, registrations, leaders, and projects to the verified GWD presentation baseline.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmConfig({
                        isOpen: true,
                        title: 'Reset CMS to Verified Defaults?',
                        message: 'This will reset all events, leaders, projects, applications, and settings to the verified baseline. Any unsaved custom records will be overwritten.',
                        confirmLabel: 'Yes, Factory Reset CMS',
                        isDestructive: true,
                        onConfirm: () => {
                          resetToDefaults();
                          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
                          showToast('CMS successfully reset to verified defaults!');
                        },
                      });
                    }}
                    className={styles.deleteBtn}
                  >
                    Factory Reset CMS
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            16 — TAB: AUDIT TRAIL
            ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'auditLog' && (
          <div className={styles.tabPane}>
            <div className={styles.tabHeader}>
              <div>
                <h1 className={styles.tabTitle}>Administrative Audit Trail ({auditLogs.length})</h1>
                <p className={styles.tabDesc}>
                  Immutable record of content mutations, event registrations, application updates, and security logs.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Search audit trail by action, details, user..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="input"
                style={{ maxWidth: '320px' }}
              />
            </div>

            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Actor</th>
                    <th>Details</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td>
                        <span className={styles.codeBadge}>{log.action}</span>
                      </td>
                      <td>{log.user || log.actor || 'admin'}</td>
                      <td>{log.details}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            log.status === 'success' || log.status === 'SUCCESS'
                              ? styles.badgeSuccess
                              : log.status === 'warning'
                              ? styles.badgePending
                              : styles.badgeInfo
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════════
          ACTIVE OPERATIONAL MODALS
          ═══════════════════════════════════════════════════════════════ */}

      {/* Dedicated Event Operations Modal */}
      {activeDetailEvent && (
        <EventDetailModal
          isOpen={Boolean(activeDetailEvent)}
          event={allEvents.find((e) => e.id === activeDetailEvent.id) || activeDetailEvent}
          onClose={() => setActiveDetailEvent(null)}
          onEdit={(evt) => {
            setActiveDetailEvent(null);
            setActiveEditEvent(evt);
            setIsEventEditorOpen(true);
          }}
        />
      )}

      {/* Dedicated Institutional Connect & Partnerships Modal */}
      {activeConnectModalReq && (
        <ConnectRequestModal
          isOpen={isConnectModalOpen}
          request={activeConnectModalReq}
          onClose={() => {
            setIsConnectModalOpen(false);
            setActiveConnectModalReq(null);
          }}
          onToast={showToast}
        />
      )}

      {/* Domain Member Editor Modal */}
      <DomainMemberModal
        isOpen={isDomainMemberModalOpen}
        member={editingDomainMember}
        isNew={isNewDomainMember}
        domainName={selectedDomain?.name || 'Domain'}
        onClose={() => {
          setIsDomainMemberModalOpen(false);
          setEditingDomainMember(null);
        }}
        onSave={handleSaveDomainMember}
      />

      {/* Domain Lead Media Picker Modal */}
      <MediaPickerModal
        isOpen={isDomainLeadMediaPickerOpen}
        onClose={() => setIsDomainLeadMediaPickerOpen(false)}
        onSelect={(url) => {
          if (selectedDomain) {
            const updated = { ...selectedDomain, leadPhoto: url };
            setSelectedDomain(updated);
            updateDomain(selectedDomain.id, updated);
            showToast(`Updated lead photo for ${selectedDomain.name}`);
          }
          setIsDomainLeadMediaPickerOpen(false);
        }}
      />

      {/* Event Creator / Editor Modal */}
      <EventEditorModal
        isOpen={isEventEditorOpen}
        event={activeEditEvent}
        onClose={() => {
          setIsEventEditorOpen(false);
          setActiveEditEvent(null);
        }}
        onSaved={(savedEvt) => {
          showToast(`Event "${savedEvt.title}" saved successfully!`);
        }}
      />

      {/* Leader Dossier Editor Modal */}
      <LeaderEditorModal
        isOpen={isLeaderEditorOpen}
        leader={activeEditLeader}
        onClose={() => {
          setIsLeaderEditorOpen(false);
          setActiveEditLeader(null);
        }}
        onSaved={(savedLeader) => {
          showToast(`Leader "${savedLeader.name}" updated!`);
        }}
      />

      {/* Project Case Study Editor Modal */}
      <ProjectEditorModal
        isOpen={isProjectEditorOpen}
        project={activeEditProject}
        onClose={() => {
          setIsProjectEditorOpen(false);
          setActiveEditProject(null);
        }}
        onSaved={(savedProject) => {
          showToast(`Project "${savedProject.title}" saved!`);
        }}
      />

      {/* Partner / Alliance Editor Modal */}
      <PartnerEditorModal
        isOpen={isPartnerEditorOpen}
        partner={activeEditPartner}
        onClose={() => {
          setIsPartnerEditorOpen(false);
          setActiveEditPartner(null);
        }}
        onSaved={(savedPartner) => {
          showToast(`Alliance "${savedPartner.name}" saved!`);
        }}
      />

      {/* Reusable Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        isDestructive={confirmConfig.isDestructive}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Storyline Modal */}
      {isStorylineModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsStorylineModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingStorylineItem ? 'Edit Milestone' : 'Add Storyline Milestone'}
              </h3>
              <button className={styles.modalClose} onClick={() => setIsStorylineModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveStoryline} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Year *</label>
                  <input
                    type="text"
                    className="input"
                    value={storylineForm.year}
                    onChange={(e) => setStorylineForm({ ...storylineForm, year: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Month</label>
                  <input
                    type="text"
                    className="input"
                    value={storylineForm.month}
                    onChange={(e) => setStorylineForm({ ...storylineForm, month: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Headline</label>
                <input
                  type="text"
                  className="input"
                  value={storylineForm.headline}
                  onChange={(e) => setStorylineForm({ ...storylineForm, headline: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Narrative Story *</label>
                <textarea
                  className="input"
                  rows={3}
                  value={storylineForm.content}
                  onChange={(e) => setStorylineForm({ ...storylineForm, content: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Photo Asset URL</label>
                <input
                  type="text"
                  className="input"
                  value={storylineForm.image}
                  onChange={(e) => setStorylineForm({ ...storylineForm, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsStorylineModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsGalleryModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingGalleryItem ? 'Edit Gallery Photo' : 'Add Photo to Gallery'}
              </h3>
              <button className={styles.modalClose} onClick={() => setIsGalleryModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveGallery} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Photo URL *</label>
                <input
                  type="text"
                  className="input"
                  value={galleryForm.src}
                  onChange={(e) => setGalleryForm({ ...galleryForm, src: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Caption / Description *</label>
                <input
                  type="text"
                  className="input"
                  value={galleryForm.caption}
                  onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                >
                  <option value="Showcase">Showcase</option>
                  <option value="Sprint">Sprint</option>
                  <option value="Behind the Scenes">Behind the Scenes</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workflow Step Modal */}
      {isWorkflowModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsWorkflowModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingWorkflowStep ? 'Edit Workflow Phase' : 'Add Workflow Phase'}
              </h3>
              <button className={styles.modalClose} onClick={() => setIsWorkflowModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveWorkflow} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Step Number *</label>
                  <input
                    type="text"
                    className="input"
                    value={workflowForm.stepNumber}
                    onChange={(e) => setWorkflowForm({ ...workflowForm, stepNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Phase Keyword *</label>
                  <input
                    type="text"
                    className="input"
                    value={workflowForm.phase}
                    onChange={(e) => setWorkflowForm({ ...workflowForm, phase: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Phase Title *</label>
                <input
                  type="text"
                  className="input"
                  value={workflowForm.title}
                  onChange={(e) => setWorkflowForm({ ...workflowForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Expected Duration</label>
                <input
                  type="text"
                  className="input"
                  value={workflowForm.duration}
                  onChange={(e) => setWorkflowForm({ ...workflowForm, duration: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Key Deliverables (comma-separated)</label>
                <input
                  type="text"
                  className="input"
                  value={workflowForm.deliverables}
                  onChange={(e) => setWorkflowForm({ ...workflowForm, deliverables: e.target.value })}
                  placeholder="PRD, Architecture Deck, Figma Wireframes"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsWorkflowModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Phase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
