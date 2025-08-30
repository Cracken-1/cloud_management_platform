'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  UserIcon, 
  LockClosedIcon, 
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CloudIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/loading-spinner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminLogin() {
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
        const { data: profile } = await supabase
          .from('users')
          .select('role, status, organization_id')
          .eq('id', data.user.id)
          .single();

        if (!profile) {
          await supabase.auth.signOut();
          setError('User profile not found. Please contact support.');
          return;
        }

        if (profile.status !== 'active') {
          await supabase.auth.signOut();
          setError('Account is inactive. Please contact your administrator.');
          return;
        }

        if (!['ORG_ADMIN', 'USER'].includes(profile.role)) {
          await supabase.auth.signOut();
          setError('Invalid access level for this portal.');
          return;
        }

        router.push('/admin/dashboard');
      }
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-20 w-32 h-32 bg-emerald-200/30 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-40 h-40 bg-teal-200/30 rounded-full blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-200/20 rounded-full blur-lg"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div 
        className="max-w-md w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="mx-auto h-20 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <CloudIcon className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600">Access your organization dashboard</p>
        </motion.div>

        {/* Login Form */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 rounded-xl p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <motion.input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <LockClosedIcon className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white/70 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <motion.div 
            className="mt-8 space-y-4"
            variants={itemVariants}
          >
            <div className="text-center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/access/request" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  Don&apos;t have access? Request an account
                </Link>
              </motion.div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 text-center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center">
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Homepage
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}