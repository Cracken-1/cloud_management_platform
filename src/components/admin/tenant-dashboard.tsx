'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  TruckIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface TenantConfiguration {
  id: string;
  companyName: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo?: string;
  };
  industry: string;
  dashboardLayout: 'retail' | 'restaurant' | 'logistics' | 'generic';
  features: {
    inventory: boolean;
    payments: boolean;
    analytics: boolean;
    crm: boolean;
    ecommerce: boolean;
    delivery: boolean;
  };
}

interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface TenantDashboardProps {
  tenantId: string;
}

export default function TenantDashboard({ tenantId }: TenantDashboardProps) {
  const [tenantConfig, setTenantConfig] = useState<TenantConfiguration | null>(null);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantConfig = async () => {
      try {
        const response = await fetch('/api/tenant/config');
        if (response.ok) {
          const data = await response.json();
          setTenantConfig(data.config);
          generateWidgets(data.config);
        }
      } catch (error) {
        console.error('Failed to load tenant config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantConfig();
  }, [tenantId]);

  const generateWidgets = (tenantConfig: TenantConfiguration) => {
    const baseWidgets: DashboardWidget[] = [
      {
        id: 'revenue',
        type: 'analytics',
        title: 'Total Revenue',
        value: '$25,430',
        change: '+12%',
        icon: CurrencyDollarIcon,
        color: tenantConfig.branding.primaryColor
      },
      {
        id: 'users',
        type: 'users',
        title: 'Active Users',
        value: '1,234',
        change: '+5%',
        icon: UserGroupIcon,
        color: tenantConfig.branding.secondaryColor
      }
    ];

    // Add industry-specific widgets
    switch (tenantConfig.dashboardLayout) {
      case 'retail':
        baseWidgets.push(
          {
            id: 'orders',
            type: 'orders',
            title: 'Orders Today',
            value: '156',
            change: '+8%',
            icon: ShoppingBagIcon,
            color: tenantConfig.branding.accentColor
          },
          {
            id: 'inventory',
            type: 'inventory',
            title: 'Low Stock Items',
            value: '23',
            change: '-2',
            icon: ChartBarIcon,
            color: '#EF4444'
          }
        );
        break;

      case 'restaurant':
        baseWidgets.push(
          {
            id: 'orders',
            type: 'orders',
            title: 'Orders in Queue',
            value: '12',
            change: '+3',
            icon: ClipboardDocumentListIcon,
            color: tenantConfig.branding.accentColor
          },
          {
            id: 'delivery',
            type: 'delivery',
            title: 'Active Deliveries',
            value: '8',
            change: '+2',
            icon: TruckIcon,
            color: '#10B981'
          }
        );
        break;

      case 'logistics':
        baseWidgets.push(
          {
            id: 'shipments',
            type: 'shipments',
            title: 'Active Shipments',
            value: '45',
            change: '+7',
            icon: TruckIcon,
            color: tenantConfig.branding.accentColor
          },
          {
            id: 'routes',
            type: 'routes',
            title: 'Optimized Routes',
            value: '12',
            change: '+15%',
            icon: ChartBarIcon,
            color: '#10B981'
          }
        );
        break;

      default:
        baseWidgets.push(
          {
            id: 'analytics',
            type: 'analytics',
            title: 'Data Points',
            value: '2,456',
            change: '+18%',
            icon: ChartBarIcon,
            color: tenantConfig.branding.accentColor
          }
        );
    }

    setWidgets(baseWidgets);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tenantConfig) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Configuration Not Found</h3>
        <p className="text-gray-500">Please complete your tenant setup first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Header with Company Branding */}
      <div 
        className="rounded-lg p-6 text-white"
        style={{ backgroundColor: tenantConfig.branding.primaryColor }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{tenantConfig.companyName} Dashboard</h1>
            <p className="text-sm opacity-90 capitalize">
              {tenantConfig.industry} Management Platform
            </p>
          </div>
          {tenantConfig.branding.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={tenantConfig.branding.logo} 
              alt={`${tenantConfig.companyName} Logo`}
              className="h-12 w-12 rounded"
            />
          )}
        </div>
      </div>

      {/* Dynamic Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map((widget) => (
          <div key={widget.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{widget.title}</p>
                <p className="text-2xl font-bold text-gray-900">{widget.value}</p>
                {widget.change && (
                  <p className={`text-sm ${widget.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {widget.change} from last month
                  </p>
                )}
              </div>
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${widget.color}20` }}
              >
                <widget.icon 
                  className="h-6 w-6" 
                  style={{ color: widget.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Industry-Specific Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {getIndustrySpecificActivity(tenantConfig.industry).map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tenantConfig.branding.accentColor }}
                />
                <span className="text-sm text-gray-600">{activity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {getIndustrySpecificActions(tenantConfig.industry).map((action, index) => (
              <button
                key={index}
                className="p-3 text-left rounded-lg border-2 border-gray-200 hover:border-current transition-colors"
                style={{ borderColor: `${tenantConfig.branding.primaryColor}40` }}
              >
                <div className="text-sm font-medium text-gray-900">{action.title}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getIndustrySpecificActivity(industry: string): string[] {
  switch (industry) {
    case 'retail':
      return [
        'New order #1234 received',
        'Inventory alert: Low stock on Product A',
        'Customer review submitted',
        'Payment processed for Order #1230'
      ];
    case 'restaurant':
      return [
        'Order #45 ready for pickup',
        'New table reservation for 6 PM',
        'Kitchen alert: Running low on ingredients',
        'Delivery completed for Order #42'
      ];
    case 'logistics':
      return [
        'Shipment #789 out for delivery',
        'Route optimization completed',
        'Vehicle maintenance scheduled',
        'New pickup request received'
      ];
    default:
      return [
        'System backup completed',
        'New user registered',
        'Data sync completed',
        'Report generated successfully'
      ];
  }
}

function getIndustrySpecificActions(industry: string) {
  const baseActions = [
    { title: 'View Reports', description: 'Generate analytics' },
    { title: 'Manage Users', description: 'User administration' }
  ];

  switch (industry) {
    case 'retail':
      return [
        ...baseActions,
        { title: 'Add Product', description: 'New inventory item' },
        { title: 'Process Order', description: 'Handle new orders' }
      ];
    case 'restaurant':
      return [
        ...baseActions,
        { title: 'Update Menu', description: 'Modify menu items' },
        { title: 'View Orders', description: 'Kitchen queue' }
      ];
    case 'logistics':
      return [
        ...baseActions,
        { title: 'Track Shipment', description: 'Monitor deliveries' },
        { title: 'Optimize Routes', description: 'Plan efficient routes' }
      ];
    default:
      return [
        ...baseActions,
        { title: 'System Settings', description: 'Configure platform' },
        { title: 'Data Export', description: 'Export information' }
      ];
  }
}
