// Specific interfaces for structured data
export interface TenantBranding {
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  theme?: 'light' | 'dark';
}

export interface TenantFeatures {
  analytics?: boolean;
  api_access?: boolean;
  custom_domains?: boolean;
  sso?: boolean;
}

export interface TenantSettings {
  timezone?: string;
  date_format?: string;
  currency?: string;
  notifications?: boolean;
}

export interface UserPermissions {
  read?: boolean;
  write?: boolean;
  delete?: boolean;
  admin?: boolean;
}

export interface UserPreferences {
  theme?: 'light' | 'dark';
  language?: string;
  notifications?: boolean;
  dashboard_layout?: string;
}

export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          domain: string;
          company_name: string;
          industry: string | null;
          website_url: string | null;
          subscription_tier: string;
          status: string;
          created_at: string;
          updated_at: string;
          branding: TenantBranding;
          features: TenantFeatures;
          dashboard_layout: string;
          settings: TenantSettings;
          billing_email: string | null;
          billing_address: BillingAddress | null;
          user_limit: number;
          storage_limit_gb: number;
          api_calls_limit: number;
        };
        Insert: {
          id?: string;
          domain: string;
          company_name: string;
          industry?: string | null;
          website_url?: string | null;
          subscription_tier?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          branding?: TenantBranding;
          features?: TenantFeatures;
          dashboard_layout?: string;
          settings?: TenantSettings;
          billing_email?: string | null;
          billing_address?: BillingAddress | null;
          user_limit?: number;
          storage_limit_gb?: number;
          api_calls_limit?: number;
        };
        Update: {
          id?: string;
          domain?: string;
          company_name?: string;
          industry?: string | null;
          website_url?: string | null;
          subscription_tier?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          branding?: TenantBranding;
          features?: TenantFeatures;
          dashboard_layout?: string;
          settings?: TenantSettings;
          billing_email?: string | null;
          billing_address?: BillingAddress | null;
          user_limit?: number;
          storage_limit_gb?: number;
          api_calls_limit?: number;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          role: string;
          avatar_url: string | null;
          phone_number: string | null;
          timezone: string;
          language: string;
          is_active: boolean;
          is_verified: boolean;
          email_verified_at: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          last_login_at: string | null;
          permissions: UserPermissions;
          preferences: UserPreferences;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: string;
          avatar_url?: string | null;
          phone_number?: string | null;
          timezone?: string;
          language?: string;
          is_active?: boolean;
          is_verified?: boolean;
          email_verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          last_login_at?: string | null;
          permissions?: UserPermissions;
          preferences?: UserPreferences;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: string;
          avatar_url?: string | null;
          phone_number?: string | null;
          timezone?: string;
          language?: string;
          is_active?: boolean;
          is_verified?: boolean;
          email_verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          last_login_at?: string | null;
          permissions?: UserPermissions;
          preferences?: UserPreferences;
        };
      };
      user_tenant_roles: {
        Row: {
          id: string;
          user_id: string;
          tenant_id: string;
          role: string;
          permissions: UserPermissions;
          granted_by: string | null;
          granted_at: string;
          revoked_at: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          tenant_id: string;
          role?: string;
          permissions?: UserPermissions;
          granted_by?: string | null;
          granted_at?: string;
          revoked_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          tenant_id?: string;
          role?: string;
          permissions?: UserPermissions;
          granted_by?: string | null;
          granted_at?: string;
          revoked_at?: string | null;
          is_active?: boolean;
        };
      };
      platform_settings: {
        Row: {
          id: string;
          settings: Record<string, unknown>;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          settings: Record<string, unknown>;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          settings?: Record<string, unknown>;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      registration_requests: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          company: string;
          business_type: string | null;
          phone_number: string | null;
          business_registration_number: string | null;
          tax_id: string | null;
          business_address: string | null;
          requested_role: string;
          business_description: string | null;
          estimated_monthly_volume: string | null;
          referral_source: string | null;
          status: string;
          submitted_at: string;
          reviewed_at: string | null;
          approved_by: string | null;
          approved_at: string | null;
          rejection_reason: string | null;
          assigned_tenant_id: string | null;
          assigned_role: string | null;
          metadata: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          company: string;
          business_type?: string | null;
          phone_number?: string | null;
          business_registration_number?: string | null;
          tax_id?: string | null;
          business_address?: string | null;
          requested_role?: string;
          business_description?: string | null;
          estimated_monthly_volume?: string | null;
          referral_source?: string | null;
          status?: string;
          submitted_at?: string;
          reviewed_at?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          rejection_reason?: string | null;
          assigned_tenant_id?: string | null;
          assigned_role?: string | null;
          metadata?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          company?: string;
          business_type?: string | null;
          phone_number?: string | null;
          business_registration_number?: string | null;
          tax_id?: string | null;
          business_address?: string | null;
          requested_role?: string;
          business_description?: string | null;
          estimated_monthly_volume?: string | null;
          referral_source?: string | null;
          status?: string;
          submitted_at?: string;
          reviewed_at?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          rejection_reason?: string | null;
          assigned_tenant_id?: string | null;
          assigned_role?: string | null;
          metadata?: Record<string, unknown>;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          tenant_id: string | null;
          user_id: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          old_values: Record<string, unknown> | null;
          new_values: Record<string, unknown> | null;
          details: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string | null;
          user_id?: string | null;
          action: string;
          resource_type: string;
          resource_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          old_values?: Record<string, unknown> | null;
          new_values?: Record<string, unknown> | null;
          details?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string | null;
          user_id?: string | null;
          action?: string;
          resource_type?: string;
          resource_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          old_values?: Record<string, unknown> | null;
          new_values?: Record<string, unknown> | null;
          details?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}