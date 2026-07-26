export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          image_url: string | null;
          body: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          image_url?: string | null;
          body: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blogs"]["Insert"]>;
        Relationships: [];
      };
      gallery: {
        Row: {
          id: string;
          url: string;
          alt: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          alt?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["gallery"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: { user_id: string; role: "admin"; created_at: string };
        Insert: { user_id: string; role?: "admin"; created_at?: string };
        Update: { role?: "admin" };
        Relationships: [];
      };
      reservations: {
        Row: {
          id: string;
          starts_at: string;
          ends_at: string;
          duration_minutes: number;
          court_id: number;
          package_id: string;
          price_amount: number;
          price_currency: string;
          name: string;
          phone: string;
          email: string;
          status: "active" | "cancelled";
          user_id: string | null;
          created_at: string;
          reminder_sent: boolean;
          date: string | null;
          time: string | null;
          terrain: Json | null;
          package_details: Json | null;
        };
        Insert: {
          id?: string;
          starts_at: string;
          duration_minutes: number;
          court_id: number;
          package_id: string;
          price_amount: number;
          price_currency?: string;
          name: string;
          phone: string;
          email: string;
          status?: "active" | "cancelled";
          user_id?: string | null;
          created_at?: string;
          reminder_sent?: boolean;
          date?: string | null;
          time?: string | null;
          terrain?: Json | null;
          package_details?: Json | null;
        };
        Update: {
          status?: "active" | "cancelled";
          name?: string;
          phone?: string;
          email?: string;
          reminder_sent?: boolean;
        };
        Relationships: [];
      };
    };
    Views: {
      reservation_availability: {
        Row: {
          id: string | null;
          court_id: number | null;
          starts_at: string | null;
          ends_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      create_reservation: {
        Args: {
          p_package_id: string;
          p_local_date: string;
          p_local_time: string;
          p_court_id: number;
          p_name: string;
          p_phone: string;
          p_email: string;
        };
        Returns: string;
      };
      cancel_own_reservation: {
        Args: { p_reservation_id: string };
        Returns: undefined;
      };
      get_busy_slots: {
        Args: { p_local_date: string; p_court_id: number };
        Returns: { starts_at: string; ends_at: string }[];
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<PropertyKey, never>;
    CompositeTypes: Record<PropertyKey, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
