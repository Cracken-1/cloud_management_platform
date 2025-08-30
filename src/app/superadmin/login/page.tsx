'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { isAuthorizedSuperadmin } from '@/lib/auth/superadmin-access';
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
  UserIcon
} from '@heroicons/react/24/outline';

export default function SuperadminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Check for error in URL params (from OAuth redirect)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam === 'unauthorized') {
      setError('Access denied. Your Google account is not authorized for superadmin access.');
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/google/callback?from=superadmin`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            hd: 'infinitystack.com', // Optional: restrict to your domain
          },
          scopes: 'openid email profile'
        }
      });
      
      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if email is authorized for superadmin access
    if (!isAuthorizedSuperadmin(email)) {
      setError('Access denied. This email is not authorized for superadmin access.');
      setLoading(false);
      return;
    }

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
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('role, is_active')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          setError('Failed to verify user profile. Please try again.');
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        if (!profile) {
          setError('User profile not found. Please contact support.');
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        if (!profile.is_active) {
          setError('Your account has been deactivated. Please contact support.');
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        if (profile.role !== 'SUPERADMIN') {
          setError('Access denied. This portal is for superadministrators only.');
          await supabase.auth.signOut();
          setLoading(false);
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
          {/* Google Sign-in */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              {googleLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-300 mr-2"></div>
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">or sign in with email</span>
              </div>
            </div>
          </div>

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