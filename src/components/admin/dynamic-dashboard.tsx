'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { TenantConfiguration } from '@/lib/tenant/website-analyzer';

interface DynamicDashboardProps {
  tenantId: string;
}

export default function DynamicDashboard({ }: DynamicDashboardProps) {
  const [config, setConfig] = useState<TenantConfiguration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTenantConfig = async () => {
      try {
        const response = await fetch('/api/tenant/config');
        if (response.ok) {
          const data = await response.json();
          setConfig(data.config);
        }
      } catch (error) {
        console.error('Failed to load tenant config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTenantConfig();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Unable to load dashboard configuration</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        '--primary-color': config.branding.primaryColor,
        '--secondary-color': config.branding.secondaryColor,
        '--accent-color': config.branding.accentColor,
      } as React.CSSProperties}
    >
      {/* Dynamic Header */}
      <header className="bg-white shadow-sm border-b" style={{ borderColor: config.branding.primaryColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {config.branding.logo && (
                <Image
                  src={config.branding.logo} 
                  alt={`${config.companyName} Logo`}
                  width={32}
                  height={32}
                  className="h-8 w-auto mr-3"
                />
              )}
              <h1 
                className="text-2xl font-bold"
                style={{ color: config.branding.primaryColor }}
              >
                {config.companyName}
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              {config.industry.charAt(0).toUpperCase() + config.industry.slice(1)} Dashboard
            </div>
          </div>
        </div>
      </header>

      {/* Dynamic Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to {config.companyName}
          </h2>
          <p className="text-gray-600">
{config.customization?.description || 'Manage your business operations efficiently'}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {config.features.inventory && (
            <FeatureCard
              title="Inventory Management"
              description="Track and manage your inventory in real-time"
              icon="📦"
              color={config.branding.primaryColor}
            />
          )}
          
          {config.features.analytics && (
            <FeatureCard
              title="Analytics & Reports"
              description="Get insights into your business performance"
              icon="📊"
              color={config.branding.secondaryColor}
            />
          )}
          
          {config.features.payments && (
            <FeatureCard
              title="Payment Management"
              description="Handle payments and financial transactions"
              icon="💳"
              color={config.branding.accentColor}
            />
          )}
          
          {config.features.crm && (
            <FeatureCard
              title="Customer Management"
              description="Manage customer relationships and data"
              icon="👥"
              color={config.branding.primaryColor}
            />
          )}
          
          {config.features.ecommerce && (
            <FeatureCard
              title="E-commerce"
              description="Manage your online store and products"
              icon="🛒"
              color={config.branding.secondaryColor}
            />
          )}
          
          {config.features.delivery && (
            <FeatureCard
              title="Delivery Management"
              description="Track and optimize delivery operations"
              icon="🚚"
              color={config.branding.accentColor}
            />
          )}
        </div>

        {/* Industry-Specific Dashboard Layout */}
        {config.dashboardLayout === 'retail' && <RetailDashboard config={config} />}
        {config.dashboardLayout === 'restaurant' && <RestaurantDashboard config={config} />}
        {config.dashboardLayout === 'logistics' && <LogisticsDashboard config={config} />}
        {config.dashboardLayout === 'generic' && <GenericDashboard config={config} />}
      </main>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
}

function FeatureCard({ title, description, icon, color }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <button 
        className="text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        style={{ backgroundColor: color }}
      >
        Open {title}
      </button>
    </div>
  );
}

function RetailDashboard({ config }: { config: TenantConfiguration }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: config.branding.primaryColor }}>
          Sales Overview
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Today&apos;s Sales</span>
            <span className="font-semibold">$2,450</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">This Month</span>
            <span className="font-semibold">$45,230</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Products</span>
            <span className="font-semibold">1,234</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: config.branding.primaryColor }}>
          Top Products
        </h3>
        <div className="space-y-3">
          {['Wireless Headphones', 'Smartphone Case', 'Laptop Stand'].map((product, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600">{product}</span>
              <span className="font-semibold">{150 - index * 20} sold</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RestaurantDashboard({ config }: { config: TenantConfiguration }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: config.branding.primaryColor }}>
          Today&apos;s Orders
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Pending Orders</span>
            <span className="font-semibold text-orange-600">8</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Completed Orders</span>
            <span className="font-semibold text-green-600">45</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Revenue Today</span>
            <span className="font-semibold">$1,250</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: config.branding.primaryColor }}>
          Popular Items
        </h3>
        <div className="space-y-3">
          {['Margherita Pizza', 'Caesar Salad', 'Grilled Chicken'].map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600">{item}</span>
              <span className="font-semibold">{25 - index * 5} orders</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogisticsDashboard({ config }: { config: TenantConfiguration }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: config.branding.primaryColor }}>
          Fleet Status
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Active Vehicles</span>
            <span className="font-semibold text-green-600">12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">In Maintenance</span>
            <span className="font-semibold text-orange-600">3</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Deliveries Today</span>
            <span className="font-semibold">89</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: config.branding.primaryColor }}>
          Route Efficiency
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Average Delivery Time</span>
            <span className="font-semibold">45 min</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Fuel Efficiency</span>
            <span className="font-semibold">12.5 km/L</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">On-Time Delivery</span>
            <span className="font-semibold text-green-600">94%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericDashboard({ config }: { config: TenantConfiguration }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: config.branding.primaryColor }}>
          Business Metrics
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Users</span>
            <span className="font-semibold">1,234</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Active Sessions</span>
            <span className="font-semibold">89</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Monthly Revenue</span>
            <span className="font-semibold">$12,450</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: config.branding.primaryColor }}>
          Recent Activity
        </h3>
        <div className="space-y-3">
          {['New user registration', 'Payment processed', 'Report generated'].map((activity, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600">{activity}</span>
              <span className="text-sm text-gray-400">{index + 1}h ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}