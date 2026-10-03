/**
 * GWD — GET WORK DONE: Database Types
 *
 * NOTE FOR FUTURE PHASES:
 * These are hand-written data types matching the schema in `supabase/migrations/001_initial_schema.sql`.
 * Once a live Supabase project is connected, run:
 *   npx supabase gen types typescript --project-id <project-id> > src/lib/supabase/types.ts
 * to replace these with auto-generated schema types.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'superadmin' | 'admin' | 'editor';
export type EventStatus = 'draft' | 'published' | 'archived' | 'cancelled';
export type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected';
export type CollaboratorStatus = 'new' | 'contacted' | 'partnered' | 'archived';
export type TeamTier = 'core' | 'lead' | 'faculty';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
      audit_log: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          table_name: string;
          record_id: string | null;
          old_data: Json | null;
          new_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          table_name: string;
          record_id?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          table_name?: string;
          record_id?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          created_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          sort_order: number;
          role_title: string;
          name: string;
          photo_url: string | null;
          bio: string | null;
          quote: string | null;
          social_links: Record<string, string>;
          active: boolean;
          tier: TeamTier;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sort_order: number;
          role_title: string;
          name?: string;
          photo_url?: string | null;
          bio?: string | null;
          quote?: string | null;
          social_links?: Record<string, string>;
          active?: boolean;
          tier?: TeamTier;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sort_order?: number;
          role_title?: string;
          name?: string;
          photo_url?: string | null;
          bio?: string | null;
          quote?: string | null;
          social_links?: Record<string, string>;
          active?: boolean;
          tier?: TeamTier;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          cover_image: string | null;
          event_date: string;
          location: string;
          status: EventStatus;
          registration_deadline: string | null;
          capacity: number | null;
          is_registration_open: boolean;
          custom_fields: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          cover_image?: string | null;
          event_date: string;
          location: string;
          status?: EventStatus;
          registration_deadline?: string | null;
          capacity?: number | null;
          is_registration_open?: boolean;
          custom_fields?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          cover_image?: string | null;
          event_date?: string;
          location?: string;
          status?: EventStatus;
          registration_deadline?: string | null;
          capacity?: number | null;
          is_registration_open?: boolean;
          custom_fields?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      registrations: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          email: string;
          phone: string | null;
          college: string | null;
          answers: Json;
          attended: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          email: string;
          phone?: string | null;
          college?: string | null;
          answers?: Json;
          attended?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          college?: string | null;
          answers?: Json;
          attended?: boolean;
          created_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          department: string | null;
          year_of_study: string | null;
          role_interests: string[];
          portfolio_url: string | null;
          why_join: string | null;
          status: ApplicationStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          department?: string | null;
          year_of_study?: string | null;
          role_interests?: string[];
          portfolio_url?: string | null;
          why_join?: string | null;
          status?: ApplicationStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          department?: string | null;
          year_of_study?: string | null;
          role_interests?: string[];
          portfolio_url?: string | null;
          why_join?: string | null;
          status?: ApplicationStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      collaborators: {
        Row: {
          id: string;
          name: string;
          organization: string;
          email: string;
          proposal: string;
          status: CollaboratorStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          organization: string;
          email: string;
          proposal: string;
          status?: CollaboratorStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          organization?: string;
          email?: string;
          proposal?: string;
          status?: CollaboratorStatus;
          created_at?: string;
        };
      };
      works: {
        Row: {
          id: string;
          title: string;
          slug: string;
          year: number;
          category: string;
          summary: string;
          cover_image: string | null;
          gallery: string[];
          case_study: Json;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          year: number;
          category: string;
          summary: string;
          cover_image?: string | null;
          gallery?: string[];
          case_study?: Json;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          year?: number;
          category?: string;
          summary?: string;
          cover_image?: string | null;
          gallery?: string[];
          case_study?: Json;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      timeline_milestones: {
        Row: {
          id: string;
          year: number;
          title: string;
          description: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          year: number;
          title: string;
          description: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          year?: number;
          title?: string;
          description?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          path: string;
          url: string;
          alt_text: string | null;
          album: string | null;
          width: number | null;
          height: number | null;
          file_size: number | null;
          mime_type: string | null;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          path: string;
          url: string;
          alt_text?: string | null;
          album?: string | null;
          width?: number | null;
          height?: number | null;
          file_size?: number | null;
          mime_type?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          path?: string;
          url?: string;
          alt_text?: string | null;
          album?: string | null;
          width?: number | null;
          height?: number | null;
          file_size?: number | null;
          mime_type?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
      };
      gallery_items: {
        Row: {
          id: string;
          src: string;
          caption: string | null;
          category: string;
          is_featured: boolean;
          sort_order: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          src: string;
          caption?: string | null;
          category?: string;
          is_featured?: boolean;
          sort_order?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          src?: string;
          caption?: string | null;
          category?: string;
          is_featured?: boolean;
          sort_order?: number;
          status?: string;
          created_at?: string;
        };
      };
      collaboration_showcases: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          collab_type?: string | null;
          year?: string | null;
          description?: string | null;
          outcome?: string | null;
          logo?: string | null;
          image?: string | null;
          is_featured?: boolean;
          sort_order?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          collab_type?: string | null;
          year?: string | null;
          description?: string | null;
          outcome?: string | null;
          logo?: string | null;
          image?: string | null;
          is_featured?: boolean;
          sort_order?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      connect_requests: {
        Row: {
          id: string;
          request_type: string;
          status: string;
          full_name: string;
          role_designation: string | null;
          email: string;
          phone: string | null;
          requester_type: string | null;
          institution_name: string;
          institution_website: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          proposal: string | null;
          internal_notes: string | null;
          assigned_poc: string | null;
          custom_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_type: string;
          status?: string;
          full_name: string;
          role_designation?: string | null;
          email: string;
          phone?: string | null;
          requester_type?: string | null;
          institution_name: string;
          institution_website?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          proposal?: string | null;
          internal_notes?: string | null;
          assigned_poc?: string | null;
          custom_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_type?: string;
          status?: string;
          full_name?: string;
          role_designation?: string | null;
          email?: string;
          phone?: string | null;
          requester_type?: string | null;
          institution_name?: string;
          institution_website?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          proposal?: string | null;
          internal_notes?: string | null;
          assigned_poc?: string | null;
          custom_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_superadmin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      register_for_event: {
        Args: {
          p_event_id: string;
          p_name: string;
          p_email: string;
          p_phone?: string | null;
          p_college?: string | null;
          p_answers?: Json;
        };
        Returns: Json;
      };
    };
  };
}
