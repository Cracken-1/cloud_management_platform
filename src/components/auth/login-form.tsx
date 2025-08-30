'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ExclamationCircleIcon,
  UserIcon,
  LockClosedIcon,
  ArrowRightIcon,
  CloudIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/google/callback`,
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
        // Get user profile to determine redirect
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('role, is_active')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          setError('Failed to verify user profile. Please try again.');
          await supabase.auth.signOut();
          return;
        }

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

        // Redirect based on role
        if (profile.role === 'SUPERADMIN') {
          router.push('/superadmin/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto mb-6">
            <img src="/logo.png" alt="InfinityStack" className="h-16 w-16 mx-auto mb-4" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to InfinityStack
          </h2>
          <p className="text-gray-600 mb-8">
            Sign in to your enterprise cloud platform
          </p>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 text-center">
            <CloudIcon className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-900">Enterprise Cloud</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 text-center">
            <ShieldCheckIcon className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-900">SOC 2 Compliant</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 text-center">
            <ChartBarIcon className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-900">AI Analytics</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 text-center">
            <UserIcon className="h-5 w-5 text-orange-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-900">Multi-Tenant</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {/* Google Sign-in */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {googleLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
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
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or sign in with email</span>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Additional Links */}
          <div className="mt-6 space-y-4">
            <div className="border-t border-gray-200 pt-4">
              <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/request-access"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Request Access
                </Link>
              </p>
              <p className="text-center text-sm text-gray-600 mt-2">
                Platform Administrator?{' '}
                <Link
                  href="/superadmin/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  prefetch={false}
                >
                  Superadmin Login
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Protected by enterprise-grade security. Your data is encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
}