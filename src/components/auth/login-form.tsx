'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ExclamationCircleIcon,
  UserIcon,
  LockClosedIcon,
  ArrowRightIcon,
  SparklesIcon,
  CloudIcon,
  CpuChipIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

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
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-blue-300/50 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-1/3 left-2/3 w-3 h-3 bg-purple-300/40 rounded-full animate-ping delay-1000"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform hover:scale-110 transition-transform duration-300">
            <SparklesIcon className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-lg text-blue-200 mb-6">
            Sign in to your cloud management platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-200">
            <CloudIcon className="h-6 w-6 text-blue-400 mb-2" />
            <p className="text-xs text-gray-300">Cloud Infrastructure</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-200">
            <ShieldCheckIcon className="h-6 w-6 text-green-400 mb-2" />
            <p className="text-xs text-gray-300">Secure Access</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-200">
            <CpuChipIcon className="h-6 w-6 text-purple-400 mb-2" />
            <p className="text-xs text-gray-300">AI-Powered</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-200">
            <UserIcon className="h-6 w-6 text-yellow-400 mb-2" />
            <p className="text-xs text-gray-300">Multi-Tenant</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-300">
          {/* Google Sign-in */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-white/20 rounded-xl text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
            >
              {googleLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-300">or sign in with email</span>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4">
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-3" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
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
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
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
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/10"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/auth/forgot-password"
                  className="text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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
            <div className="border-t border-white/20 pt-4">
              <p className="text-center text-sm text-gray-400">
                Don&apos;t have an account?{' '}
                <a
                  href="/auth/request-access"
                  className="text-blue-300 hover:text-blue-200 font-medium transition-colors"
                >
                  Request Access
                </a>
              </p>
              <p className="text-center text-sm text-gray-400 mt-2">
                Platform Administrator?{' '}
                <a
                  href="/superadmin/login"
                  className="text-purple-300 hover:text-purple-200 font-medium transition-colors"
                >
                  Superadmin Login
                </a>
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