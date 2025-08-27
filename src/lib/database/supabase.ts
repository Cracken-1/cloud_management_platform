import { createClient } from '@supabase/supabase-js';

// Enhanced Database Types for Cloud Management Platform
export interface Database {
  public: {
    Tables: {
      // Core E-commerce Tables (from main PandaMart platform)
      users: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
          updated_at: string;
          tenant_id?: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: string;
          tenant_id?: string;
        };
        Update: {
          email?: string;
          role?: string;
          updated_at?: string;
        };
      };
      
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category_id: string;
          inventory_count: number;
          supplier_id?: string;
          ai_demand_score?: number;
          dynamic_price?: number;
          created_at: string;
          updated_at: string;
          tenant_id: string;
        };
        Insert: {
          name: string;
          description: string;
          price: number;
          category_id: string;
          inventory_count?: number;
          supplier_id?: string;
          tenant_id: string;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          inventory_count?: number;
          ai_demand_score?: number;
          dynamic_price?: number;
          updated_at?: string;
        };
      };
      
      // Enhanced Admin Tables
      inventory_forecasts: {
        Row: {
          id: string;
          product_id: string;
          predicted_demand: number;
          confidence_score: number;
          forecast_period: string;
          created_at: string;
          tenant_id: string;
        };
        Insert: {
          product_id: string;
          predicted_demand: number;
          confidence_score: number;
          forecast_period: string;
          tenant_id: string;
        };
        Update: {
          predicted_demand?: number;
          confidence_score?: number;
        };
      };
      
      suppliers: {
        Row: {
          id: string;
          name: string;
          contact_email: string;
          contact_phone: string;
          performance_score: number;
          delivery_reliability: number;
          quality_score: number;
          is_local_farmer: boolean;
          created_at: string;
          tenant_id: string;
        };
        Insert: {
          name: string;
          contact_email: string;
          contact_phone: string;
          is_local_farmer?: boolean;
          tenant_id: string;
        };
        Update: {
          name?: string;
          contact_email?: string;
          contact_phone?: string;
          performance_score?: number;
          delivery_reliability?: number;
          quality_score?: number;
        };
      };
      
      // Kenya-specific Tables
      mpesa_transactions: {
        Row: {
          id: string;
          transaction_id: string;
          phone_number: string;
          amount: number;
          status: string;
          order_id?: string;
          created_at: string;
          tenant_id: string;
        };
        Insert: {
          transaction_id: string;
          phone_number: string;
          amount: number;
          status: string;
          order_id?: string;
          tenant_id: string;
        };
        Update: {
          status?: string;
        };
      };
      
      delivery_routes: {
        Row: {
          id: string;
          route_name: string;
          optimized_path: Record<string, unknown>; // JSON
          estimated_time: number;
          delivery_cost: number;
          created_at: string;
          tenant_id: string;
        };
        Insert: {
          route_name: string;
          optimized_path: Record<string, unknown>;
          estimated_time: number;
          delivery_cost: number;
          tenant_id: string;
        };
        Update: {
          optimized_path?: Record<string, unknown>;
          estimated_time?: number;
          delivery_cost?: number;
        };
      };
      
      // Multi-tenant Management
      tenants: {
        Row: {
          id: string;
          name: string;
          domain: string;
          subscription_plan: string;
          is_active: boolean;
          created_at: string;
          settings: Record<string, unknown>; // JSON
        };
        Insert: {
          name: string;
          domain: string;
          subscription_plan: string;
          settings?: Record<string, unknown>;
        };
        Update: {
          name?: string;
          domain?: string;
          subscription_plan?: string;
          is_active?: boolean;
          settings?: Record<string, unknown>;
        };
      };
      
      // AI & Analytics Tables
      ai_models: {
        Row: {
          id: string;
          name: string;
          type: string;
          version: string;
          accuracy_score: number;
          is_active: boolean;
          configuration: Record<string, unknown>; // JSON
          created_at: string;
          tenant_id: string;
        };
        Insert: {
          name: string;
          type: string;
          version: string;
          configuration: Record<string, unknown>;
          tenant_id: string;
        };
        Update: {
          accuracy_score?: number;
          is_active?: boolean;
          configuration?: Record<string, unknown>;
        };
      };
      
      fraud_alerts: {
        Row: {
          id: string;
          transaction_id: string;
          risk_score: number;
          alert_type: string;
          status: string;
          created_at: string;
          tenant_id: string;
        };
        Insert: {
          transaction_id: string;
          risk_score: number;
          alert_type: string;
          tenant_id: string;
        };
        Update: {
          status?: string;
        };
      };
    };
  };
}

// Client-side Supabase client
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side Supabase client - moved to separate server file

// Admin Supabase client with service role
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Multi-tenant helper functions
export async function getTenantId(domain?: string): Promise<string | null> {
  if (!domain) return null;
  
  const { data, error } = await supabase
    .from('tenants')
    .select('id')
    .eq('domain', domain)
    .eq('is_active', true)
    .single();
    
  if (error || !data) return null;
  return data.id;
}

export async function getTenantSettings(tenantId: string) {
  const { data, error } = await supabase
    .from('tenants')
    .select('settings')
    .eq('id', tenantId)
    .single();
    
  if (error || !data) return {};
  return data.settings || {};
}

// Enhanced query helpers with tenant isolation
export function createTenantQuery(tenantId: string) {
  return {
    products: () => supabase.from('products').select('*').eq('tenant_id', tenantId),
    suppliers: () => supabase.from('suppliers').select('*').eq('tenant_id', tenantId),
    forecasts: () => supabase.from('inventory_forecasts').select('*').eq('tenant_id', tenantId),
    mpesaTransactions: () => supabase.from('mpesa_transactions').select('*').eq('tenant_id', tenantId),
    aiModels: () => supabase.from('ai_models').select('*').eq('tenant_id', tenantId),
    fraudAlerts: () => supabase.from('fraud_alerts').select('*').eq('tenant_id', tenantId)
  };
}