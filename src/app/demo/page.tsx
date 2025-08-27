'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MockCompany {
  id: string;
  name: string;
  industry: string;
  description: string;
  websiteUrl: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  credentials: {
    email: string;
    password: string;
  };
  features: string[];
}

const mockCompanies: MockCompany[] = [
  {
    id: 'freshfoods',
    name: 'Fresh Foods Restaurant',
    industry: 'Restaurant',
    description: 'A modern restaurant chain specializing in fresh, locally-sourced ingredients',
    websiteUrl: 'https://freshfoodsrestaurant.com',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      accent: '#FFD23F'
    },
    credentials: {
      email: 'admin@freshfoods.com',
      password: 'demo123'
    },
    features: ['Order Management', 'Kitchen Display', 'Delivery Tracking', 'Menu Analytics']
  },
  {
    id: 'techmart',
    name: 'TechMart Electronics',
    industry: 'Retail',
    description: 'Leading electronics retailer with both online and physical stores',
    websiteUrl: 'https://techmartstore.com',
    colors: {
      primary: '#2E86AB',
      secondary: '#A23B72',
      accent: '#F18F01'
    },
    credentials: {
      email: 'admin@techmart.com',
      password: 'demo123'
    },
    features: ['Inventory Management', 'E-commerce', 'POS Integration', 'Sales Analytics']
  },
  {
    id: 'swiftlogistics',
    name: 'Swift Logistics',
    industry: 'Logistics',
    description: 'Fast and reliable delivery services across Kenya',
    websiteUrl: 'https://swiftdelivery.com',
    colors: {
      primary: '#1B4332',
      secondary: '#40916C',
      accent: '#95D5B2'
    },
    credentials: {
      email: 'admin@swiftlogistics.com',
      password: 'demo123'
    },
    features: ['Fleet Management', 'Route Optimization', 'Shipment Tracking', 'Driver Management']
  },
  {
    id: 'digitalsolutions',
    name: 'Digital Solutions Inc',
    industry: 'Technology',
    description: 'Software development and digital transformation consultancy',
    websiteUrl: 'https://digitalsoftware.com',
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#06B6D4'
    },
    credentials: {
      email: 'admin@digitalsolutions.com',
      password: 'demo123'
    },
    features: ['Project Management', 'Team Collaboration', 'Client Portal', 'Time Tracking']
  },
  {
    id: 'pandamart',
    name: 'PandaMart Kenya (Original)',
    industry: 'E-commerce',
    description: 'The original PandaMart platform - comprehensive e-commerce solution',
    websiteUrl: 'https://pandamart.co.ke',
    colors: {
      primary: '#059669',
      secondary: '#0D9488',
      accent: '#F59E0B'
    },
    credentials: {
      email: 'admin@pandamart.co.ke',
      password: 'demo123'
    },
    features: ['Multi-vendor Marketplace', 'M-Pesa Integration', 'AI Pricing', 'Inventory Forecasting']
  }
];

export default function DemoPage() {
  const [selectedCompany, setSelectedCompany] = useState<MockCompany | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const router = useRouter();

  const handleCompanySelect = (company: MockCompany) => {
    setSelectedCompany(company);
    setShowCredentials(true);
  };

  const handleLoginRedirect = (company: MockCompany) => {
    // Store demo company info in localStorage for the login process
    localStorage.setItem('demoCompany', JSON.stringify(company));
    router.push(`/auth/login?demo=${company.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cloud Management Platform Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience how our platform adapts to different industries. 
            Choose a demo company below to see their customized dashboard.
          </p>
        </div>

        {/* Company Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {mockCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105 transition-transform"
              onClick={() => handleCompanySelect(company)}
            >
              {/* Company Header with Brand Colors */}
              <div 
                className="h-24 flex items-center justify-center text-white font-bold text-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${company.colors.primary}, ${company.colors.secondary})` 
                }}
              >
                {company.name}
              </div>
              
              {/* Company Details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: company.colors.accent }}
                  >
                    {company.industry}
                  </span>
                  <span className="text-sm text-gray-500">Demo Available</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {company.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {company.features.slice(0, 2).map((feature, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                    {company.features.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                        +{company.features.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                
                <button 
                  className="w-full py-2 px-4 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: company.colors.primary }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCompanySelect(company);
                  }}
                >
                  Try {company.name} Demo
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Credentials Modal */}
        {showCredentials && selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedCompany.name} Demo
                </h3>
                <p className="text-gray-600">
                  Use these credentials to log in and explore the customized dashboard
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="flex items-center justify-between bg-white rounded border px-3 py-2">
                      <span className="text-gray-900 font-mono text-sm">
                        {selectedCompany.credentials.email}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedCompany.credentials.email)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="flex items-center justify-between bg-white rounded border px-3 py-2">
                      <span className="text-gray-900 font-mono text-sm">
                        {selectedCompany.credentials.password}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedCompany.credentials.password)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleLoginRedirect(selectedCompany)}
                  className="w-full py-3 px-4 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: selectedCompany.colors.primary }}
                >
                  Go to Login Page
                </button>
                
                <button
                  onClick={() => {
                    setShowCredentials(false);
                    setSelectedCompany(null);
                  }}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  This is a demo environment. No real data will be processed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Want to Set Up Your Own Company?
          </h2>
          <p className="text-gray-600 mb-6">
            As a superadmin, you can create new tenant configurations by analyzing any company website.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login as Superadmin
            </button>
            <button
              onClick={() => router.push('/admin/setup')}
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Set Up New Company
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}