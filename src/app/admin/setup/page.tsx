'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { tenantService } from '@/lib/tenant/tenant-service';
import { useAuth } from '@/lib/auth/auth-context';

interface SetupFormData {
  companyName: string;
  websiteUrl: string;
  contactEmail: string;
  industry: string;
}

export default function TenantSetupPage() {
  const [formData, setFormData] = useState<SetupFormData>({
    companyName: '',
    websiteUrl: '',
    contactEmail: '',
    industry: 'auto-detect'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  
  const { user } = useAuth();
  const router = useRouter();

  const handleAnalyzeWebsite = async () => {
    if (!formData.websiteUrl) return;
    
    setAnalyzing(true);
    setError('');
    
    try {
      // Simulate website analysis
      const mockAnalysis = {
        companyName: formData.companyName || 'Your Company',
        industry: 'retail',
        services: ['Inventory Management', 'E-commerce', 'Analytics'],
        colors: {
          primary: '#2E86AB',
          secondary: '#A23B72',
          accent: '#F18F01'
        },
        description: 'Retail management platform'
      };
      
      setPreview(mockAnalysis);
    } catch (err) {
      setError('Failed to analyze website. Please check the URL and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/tenant/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          websiteUrl: formData.websiteUrl,
          contactEmail: formData.contactEmail,
          industry: formData.industry === 'auto-detect' ? undefined : formData.industry
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        router.push('/admin?setup=complete');
      } else {
        setError(result.error || 'Setup failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SetupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'websiteUrl' && preview) {
      setPreview(null); // Clear preview when URL changes
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome to Cloud Management Platform
              </h1>
              <p className="mt-2 text-gray-600">
                Let&apos;s set up your personalized dashboard by analyzing your company website
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Company Name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="admin@yourcompany.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
                  Company Website URL
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="url"
                    id="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                    className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://yourcompany.com"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleAnalyzeWebsite}
                    disabled={!formData.websiteUrl || analyzing}
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  We&apos;ll analyze your website to customize your dashboard
                </p>
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                  Industry (Optional)
                </label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="auto-detect">Auto-detect from website</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="restaurant">Restaurant & Food Service</option>
                  <option value="logistics">Logistics & Delivery</option>
                  <option value="technology">Technology & Software</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="finance">Finance & Banking</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="generic">Other/Generic</option>
                </select>
              </div>

              {preview && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">
                    Dashboard Preview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Company Details</h4>
                      <p className="text-sm text-gray-600">Name: {preview.companyName}</p>
                      <p className="text-sm text-gray-600">Industry: {preview.industry}</p>
                      <p className="text-sm text-gray-600">Description: {preview.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Color Scheme</h4>
                      <div className="flex space-x-2 mt-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: preview.colors.primary }}
                          title="Primary Color"
                        />
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: preview.colors.secondary }}
                          title="Secondary Color"
                        />
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: preview.colors.accent }}
                          title="Accent Color"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900">Suggested Features</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {preview.services.map((service: string, index: number) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Complete Setup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}