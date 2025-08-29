'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
// import { useAuth } from '@/lib/auth/auth-context';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface DemoCompany {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  credentials: {
    email: string;
    password: string;
  };
}

const demoCompanies: DemoCompany[] = [
  {
    id: 'fresh-foods',
    name: 'Fresh Foods Restaurant',
    colors: { primary: '#ea580c', secondary: '#fed7aa', accent: '#f97316' },
    credentials: { email: 'admin@freshfoods.com', password: 'demo123' }
  },
  {
    id: 'techmart',
    name: 'TechMart Electronics',
    colors: { primary: '#2563eb', secondary: '#dbeafe', accent: '#3b82f6' },
    credentials: { email: 'admin@techmart.com', password: 'demo123' }
  },
  {
    id: 'swift-logistics',
    name: 'Swift Logistics',
    colors: { primary: '#16a34a', secondary: '#dcfce7', accent: '#22c55e' },
    credentials: { email: 'admin@swiftlogistics.com', password: 'demo123' }
  },
  {
    id: 'digital-solutions',
    name: 'Digital Solutions Inc',
    colors: { primary: '#7c3aed', secondary: '#ede9fe', accent: '#8b5cf6' },
    credentials: { email: 'admin@digitalsolutions.com', password: 'demo123' }
  },
  {
    id: 'cloudflow',
    name: 'CloudFlow E-commerce',
    colors: { primary: '#059669', secondary: '#d1fae5', accent: '#10b981' },
    credentials: { email: 'admin@cloudflow.com', password: 'demo123' }
  }
];

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [demoCompany, setDemoCompany] = useState<DemoCompany | null>(null);
  const [showDemoOptions, setShowDemoOptions] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  
  // const router = useRouter(); // Commented out as not used
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if demo company info is stored in localStorage
    const storedDemo = localStorage.getItem('demoCompany');
    if (storedDemo) {
      const company = JSON.parse(storedDemo);
      setDemoCompany(company);
      setEmail(company.credentials.email);
      setPassword(company.credentials.password);
      localStorage.removeItem('demoCompany');
    }

    // Check URL params for demo mode
    const demo = searchParams.get('demo');
    if (demo) {
      const company = demoCompanies.find(c => c.id === demo);
      if (company) {
        setDemoCompany(company);
        setEmail(company.credentials.email);
        setPassword(company.credentials.password);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRequiresVerification(false);

    try {
      // Check if this is a demo login
      if (demoCompany) {
        const response = await fetch('/api/auth/mock-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyId: demoCompany.id })
        });

        const result = await response.json();
        
        if (result.success && result.loginUrl) {
          window.location.href = result.loginUrl;
          return;
        } else {
          setError(result.error || 'Demo login failed');
        }
      } else {
        // Regular login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        
        if (result.success && result.loginUrl) {
          window.location.href = result.loginUrl;
          return;
        } else {
          setError(result.error || 'Login failed');
          if (result.requiresVerification) {
            setRequiresVerification(true);
          }
        }
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (company: DemoCompany) => {
    setDemoCompany(company);
    setEmail(company.credentials.email);
    setPassword(company.credentials.password);
    setShowDemoOptions(false);
    setError('');
  };

  const clearDemo = () => {
    setDemoCompany(null);
    setEmail('');
    setPassword('');
    setShowDemoOptions(false);
  };

  const dynamicStyles = demoCompany ? {
    '--primary-color': demoCompany.colors.primary,
    '--secondary-color': demoCompany.colors.secondary,
    '--accent-color': demoCompany.colors.accent,
  } as React.CSSProperties : {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8" style={dynamicStyles}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div 
            className="mx-auto h-12 w-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: demoCompany?.colors.primary || '#2563eb' }}
          >
            <span className="text-white font-bold text-xl">
              {demoCompany?.name.charAt(0) || 'P'}
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {demoCompany ? `${demoCompany.name} Portal` : 'Cloud Management Portal'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {demoCompany ? 'Demo Login - Experience the Platform' : 'Sign in to your administrative account'}
          </p>
          {demoCompany && (
            <button
              onClick={clearDemo}
              className="mt-2 text-xs text-blue-600 hover:text-blue-500 underline"
            >
              Switch to Regular Login
            </button>
          )}
        </div>

        {/* Demo Company Banner */}
        {demoCompany && (
          <div 
            className="bg-white rounded-xl shadow-lg p-4 border-l-4"
            style={{ borderLeftColor: demoCompany.colors.primary }}
          >
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: demoCompany.colors.primary }}
              ></div>
              <p className="text-sm font-medium text-gray-900">
                Demo Mode: {demoCompany.name}
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Credentials have been auto-filled for your convenience
            </p>
          </div>
        )}

        {/* Demo Options */}
        {!demoCompany && showDemoOptions && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Demo Company</h3>
            <div className="space-y-3">
              {demoCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleDemoLogin(company)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: company.colors.primary }}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{company.name}</p>
                      <p className="text-xs text-gray-500">{company.credentials.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowDemoOptions(false)}
              className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Login Form */}
        {!showDemoOptions && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`rounded-lg p-4 ${requiresVerification ? 'bg-yellow-50' : 'bg-red-50'}`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {requiresVerification ? (
                        <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm ${requiresVerification ? 'text-yellow-800' : 'text-red-800'}`}>
                        {error}
                      </p>
                      {requiresVerification && (
                        <p className="text-sm text-yellow-700 mt-1">
                          Your account is pending admin approval. You will receive an email once approved.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={demoCompany ? { backgroundColor: demoCompany.colors.primary } : {}}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : demoCompany ? (
                    'Access Demo Dashboard'
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              {/* Demo/Regular Toggle */}
              {!demoCompany && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowDemoOptions(true)}
                    className="text-sm text-blue-600 hover:text-blue-500 underline"
                  >
                    Try Demo Login
                  </button>
                </div>
              )}

              {/* Superadmin Login Hint */}
              {!demoCompany && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Superadmin: superadmin@cloudmanager.app / superadmin123
                  </p>
                </div>
              )}

              {/* Forgot Password Link */}
              {!demoCompany && (
                <div className="text-center">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Registration Link */}
        {!demoCompany && !showDemoOptions && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Need access to the platform?
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            >
              Request Admin Access
            </Link>
            <p className="text-xs text-gray-500 mt-2">
              Registration requires admin approval
            </p>
          </div>
        )}

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            This is a secure administrative portal. All access is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
}