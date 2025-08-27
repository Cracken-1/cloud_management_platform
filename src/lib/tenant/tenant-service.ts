// Tenant Management Service
import { supabaseAdmin } from '../database/supabase';
import { websiteAnalyzer, type TenantConfiguration, type WebsiteAnalysis } from './website-analyzer';

export interface TenantSetupRequest {
  adminUserId: string;
  companyName: string;
  websiteUrl: string;
  contactEmail: string;
  industry?: string;
}

export interface TenantSetupResult {
  success: boolean;
  tenantId?: string;
  configuration?: TenantConfiguration;
  error?: string;
}

export class TenantService {
  async setupTenant(request: TenantSetupRequest): Promise<TenantSetupResult> {
    try {
      // 1. Analyze the website
      const analysis = await websiteAnalyzer.analyzeWebsite(request.websiteUrl);
      
      // 2. Generate tenant configuration
      const domain = this.generateTenantDomain(request.companyName);
      const config = websiteAnalyzer.generateTenantConfig(analysis, domain);
      
      // 3. Create tenant in database
      const { data: tenant, error: tenantError } = await supabaseAdmin
        .from('tenants')
        .insert({
          name: config.companyName,
          domain: config.domain,
          subscription_plan: 'starter',
          is_active: true,
          settings: {
            branding: config.branding,
            features: config.features,
            industry: config.industry,
            dashboardLayout: config.dashboardLayout,
            customization: config.customization,
            websiteUrl: request.websiteUrl,
            contactEmail: request.contactEmail
          }
        })
        .select()
        .single();

      if (tenantError) {
        throw new Error(`Failed to create tenant: ${tenantError.message}`);
      }

      // 4. Update admin user with tenant association
      const { error: userError } = await supabaseAdmin
        .from('user_profiles')
        .update({ 
          tenant_id: tenant.id,
          is_verified: true,
          is_active: true 
        })
        .eq('id', request.adminUserId);

      if (userError) {
        throw new Error(`Failed to associate user with tenant: ${userError.message}`);
      }

      // 5. Create default dashboard widgets for the tenant
      await this.createDefaultDashboardWidgets(tenant.id, config.dashboardLayout);

      return {
        success: true,
        tenantId: tenant.id,
        configuration: { ...config, id: tenant.id }
      };

    } catch (error) {
      console.error('Tenant setup failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getTenantConfiguration(tenantId: string): Promise<TenantConfiguration | null> {
    try {
      const { data: tenant, error } = await supabaseAdmin
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (error || !tenant) {
        return null;
      }

      return {
        id: tenant.id,
        companyName: tenant.name,
        domain: tenant.domain,
        websiteUrl: tenant.settings?.websiteUrl || '',
        branding: tenant.settings?.branding || this.getDefaultBranding(),
        features: tenant.settings?.features || this.getDefaultFeatures(),
        industry: tenant.settings?.industry || 'generic',
        dashboardLayout: tenant.settings?.dashboardLayout || 'generic',
        customization: tenant.settings?.customization || {}
      };
    } catch (error) {
      console.error('Failed to get tenant configuration:', error);
      return null;
    }
  }

  async updateTenantBranding(tenantId: string, branding: Partial<TenantConfiguration['branding']>): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('tenants')
        .update({
          settings: {
            branding: branding
          }
        })
        .eq('id', tenantId);

      return !error;
    } catch (error) {
      console.error('Failed to update tenant branding:', error);
      return false;
    }
  }

  private generateTenantDomain(companyName: string): string {
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${slug}.cloudmanager.app`;
  }

  private async createDefaultDashboardWidgets(tenantId: string, layout: string): Promise<void> {
    const widgets = this.getDefaultWidgets(layout);
    
    for (const widget of widgets) {
      await supabaseAdmin
        .from('dashboard_widgets')
        .insert({
          tenant_id: tenantId,
          widget_type: widget.type,
          title: widget.title,
          position: widget.position,
          size: widget.size,
          configuration: widget.config,
          is_active: true
        });
    }
  }

  private getDefaultWidgets(layout: string) {
    const baseWidgets = [
      {
        type: 'analytics_overview',
        title: 'Analytics Overview',
        position: { x: 0, y: 0 },
        size: { width: 6, height: 4 },
        config: { showRevenue: true, showUsers: true, showOrders: true }
      },
      {
        type: 'recent_activity',
        title: 'Recent Activity',
        position: { x: 6, y: 0 },
        size: { width: 6, height: 4 },
        config: { limit: 10 }
      }
    ];

    switch (layout) {
      case 'retail':
        return [
          ...baseWidgets,
          {
            type: 'inventory_alerts',
            title: 'Inventory Alerts',
            position: { x: 0, y: 4 },
            size: { width: 4, height: 3 },
            config: { threshold: 10 }
          },
          {
            type: 'top_products',
            title: 'Top Selling Products',
            position: { x: 4, y: 4 },
            size: { width: 4, height: 3 },
            config: { limit: 5 }
          },
          {
            type: 'sales_chart',
            title: 'Sales Trends',
            position: { x: 8, y: 4 },
            size: { width: 4, height: 3 },
            config: { period: '30d' }
          }
        ];

      case 'restaurant':
        return [
          ...baseWidgets,
          {
            type: 'order_queue',
            title: 'Order Queue',
            position: { x: 0, y: 4 },
            size: { width: 4, height: 3 },
            config: { showPending: true }
          },
          {
            type: 'menu_performance',
            title: 'Menu Performance',
            position: { x: 4, y: 4 },
            size: { width: 4, height: 3 },
            config: { limit: 5 }
          },
          {
            type: 'delivery_status',
            title: 'Delivery Status',
            position: { x: 8, y: 4 },
            size: { width: 4, height: 3 },
            config: { showActive: true }
          }
        ];

      case 'logistics':
        return [
          ...baseWidgets,
          {
            type: 'fleet_status',
            title: 'Fleet Status',
            position: { x: 0, y: 4 },
            size: { width: 4, height: 3 },
            config: { showActive: true }
          },
          {
            type: 'route_optimization',
            title: 'Route Optimization',
            position: { x: 4, y: 4 },
            size: { width: 4, height: 3 },
            config: { showSavings: true }
          },
          {
            type: 'shipment_tracking',
            title: 'Shipment Tracking',
            position: { x: 8, y: 4 },
            size: { width: 4, height: 3 },
            config: { showInTransit: true }
          }
        ];

      default:
        return baseWidgets;
    }
  }

  private getDefaultBranding() {
    return {
      primaryColor: '#374151',
      secondaryColor: '#6B7280',
      accentColor: '#10B981',
      fontFamily: 'Inter, sans-serif'
    };
  }

  private getDefaultFeatures() {
    return {
      inventory: true,
      payments: true,
      analytics: true,
      crm: true,
      ecommerce: false,
      delivery: false
    };
  }

  // Mock data for testing different company types
  async createMockTenants(): Promise<void> {
    const mockCompanies = [
      {
        name: 'Fresh Foods Restaurant',
        domain: 'freshfoods.cloudmanager.app',
        websiteUrl: 'https://freshfoodsrestaurant.com',
        industry: 'restaurant',
        adminEmail: 'admin@freshfoods.com'
      },
      {
        name: 'TechMart Electronics',
        domain: 'techmart.cloudmanager.app',
        websiteUrl: 'https://techmartstore.com',
        industry: 'retail',
        adminEmail: 'admin@techmart.com'
      },
      {
        name: 'Swift Logistics',
        domain: 'swiftlogistics.cloudmanager.app',
        websiteUrl: 'https://swiftdelivery.com',
        industry: 'logistics',
        adminEmail: 'admin@swiftlogistics.com'
      },
      {
        name: 'Digital Solutions Inc',
        domain: 'digitalsolutions.cloudmanager.app',
        websiteUrl: 'https://digitalsoftware.com',
        industry: 'technology',
        adminEmail: 'admin@digitalsolutions.com'
      }
    ];

    for (const company of mockCompanies) {
      const analysis = await websiteAnalyzer.analyzeWebsite(company.websiteUrl);
      const config = websiteAnalyzer.generateTenantConfig(analysis, company.domain);

      await supabaseAdmin
        .from('tenants')
        .insert({
          name: company.name,
          domain: company.domain,
          subscription_plan: 'starter',
          is_active: true,
          settings: {
            branding: config.branding,
            features: config.features,
            industry: company.industry,
            dashboardLayout: config.dashboardLayout,
            customization: config.customization,
            websiteUrl: company.websiteUrl,
            contactEmail: company.adminEmail
          }
        });
    }
  }
}

export const tenantService = new TenantService();