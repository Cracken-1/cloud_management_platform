'use client';

import { useState } from 'react';
import SuperadminUserManagement from '@/components/admin/superadmin-user-management';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

type TabType = 'users' | 'tenants' | 'analytics' | 'settings';

export default function SuperadminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('users');

  const tabs = [
    { id: 'users' as TabType, name: 'User Management', icon: UsersIcon },
    { id: 'tenants' as TabType, name: 'Tenant Management', icon: BuildingOfficeIcon },
    { id: 'analytics' as TabType, name: 'Platform Analytics', icon: ChartBarIcon },
    { id: 'settings' as TabType, name: 'System Settings', icon: CogIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Superadmin Dashboard</h1>
        <p className="text-gray-600">Manage the entire cloud management platform</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon
                className={`-ml-0.5 mr-2 h-5 w-5 ${
                  activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'users' && <SuperadminUserManagement />}
        {activeTab === 'tenants' && <TenantManagement />}
        {activeTab === 'analytics' && <PlatformAnalytics />}
        {activeTab === 'settings' && <SystemSettings />}
      </div>
    </div>
  );
}

function TenantManagement() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Tenant Management</h3>
      <p className="text-gray-600">Manage all tenant organizations and their configurations.</p>
      <div className="mt-4 text-sm text-gray-500">
        Coming soon: Tenant overview, configuration management, and billing.
      </div>
    </div>
  );
}

function PlatformAnalytics() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Platform Analytics</h3>
      <p className="text-gray-600">Monitor platform usage, performance, and growth metrics.</p>
      <div className="mt-4 text-sm text-gray-500">
        Coming soon: Usage statistics, performance metrics, and growth analytics.
      </div>
    </div>
  );
}

function SystemSettings() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">System Settings</h3>
      <p className="text-gray-600">Configure platform-wide settings and integrations.</p>
      <div className="mt-4 text-sm text-gray-500">
        Coming soon: Global settings, API configurations, and system maintenance.
      </div>
    </div>
  );
}
