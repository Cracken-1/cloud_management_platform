'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ExclamationCircleIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  ServerIcon,
  UsersIcon,
  ChartBarIcon,
  LockClosedIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function SuperadminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        // Get user profile to verify superadmin role
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role, is_active')
          .eq('id', data.user.id)
          .single();

        if (!profile) {
          setError('User profile not found. Please contact support.');
          await supabase.auth.signOut();
          return;
        }

        if (!profile.is_active) {
          setError('Your account has been deactivated. Please contact support.');
          await supabase.auth.signOut();
          return;
        }

        if (profile.role !== 'SUPERADMIN') {
          setError('Access denied. This portal is for superadministrators only.');
          await supabase.auth.signOut();
          return;
        }

        // Redirect to superadmin dashboard
        router.push('/superadmin/dashboard');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-600 rounded-lg flex items-center justify-center mb-6">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Superadmin Portal
          </h2>
          <p className="text-gray-300 mb-6">
            Platform Administration Access
          </p>
          
          {/* Warning Banner */}
          <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center">
              <LockClosedIcon className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-200 font-medium">
                Restricted Access - Authorized Personnel Only
              </p>
            </div>
          </div>
        </div>

        {/* Administrative Features */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <UsersIcon className="h-6 w-6 text-blue-400 mb-2" />
            <p className="text-xs font-medium text-gray-300">Multi-Tenant Management</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <ServerIcon className="h-6 w-6 text-green-400 mb-2" />
            <p className="text-xs font-medium text-gray-300">System Administration</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <ChartBarIcon className="h-6 w-6 text-purple-400 mb-2" />
            <p className="text-xs font-medium text-gray-300">Analytics & Monitoring</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <CpuChipIcon className="h-6 w-6 text-yellow-400 mb-2" />
            <p className="text-xs font-medium text-gray-300">Platform Configuration</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-3" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                <UserIcon className="w-4 h-4 inline mr-1" />
                Superadmin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your superadmin email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                <LockClosedIcon className="w-4 h-4 inline mr-1" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="h-5 w-5 mr-2" />
                    Access Superadmin Portal
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Additional Links */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-gray-400 hover:text-gray-300"
              >
                Forgot your password?
              </Link>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <p className="text-center text-sm text-gray-400">
                Not a superadmin?{' '}
                <Link
                  href="/auth/login"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Regular Login
                </Link>
                {' | '}
                <Link
                  href="/auth/request-access"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Request Access
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            This is a secure area. All activities are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
}