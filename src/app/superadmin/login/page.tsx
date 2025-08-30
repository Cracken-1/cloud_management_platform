'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  ShieldCheckIcon, 
  LockClosedIcon, 
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/loading-spinner';

const AUTHORIZED_SUPERADMIN_EMAILS = [
  'admin@infinitystack.com',
  'superadmin@infinitystack.com',
  'alphoncewekesamukaisi@gmail.com'
];

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

    if (!AUTHORIZED_SUPERADMIN_EMAILS.includes(email.toLowerCase())) {
      setError('Access denied. This email is not authorized for platform administration.');
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
        const { data: profile } = await supabase
          .from('users')
          .select('role, status')
          .eq('id', data.user.id)
          .single();

        if (!profile || profile.role !== 'SUPERADMIN' || profile.status !== 'active') {
          await supabase.auth.signOut();
          setError('Access denied. Superadmin privileges required.');
          return;
        }

        router.push('/superadmin/dashboard');
      }
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      {/* Subtle Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
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
            className="mx-auto h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <ShieldCheckIcon className="h-6 w-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-light text-white mb-2">
            Platform Administration
          </h1>
          <p className="text-gray-400 text-sm">Restricted Access - Authorized Personnel Only</p>
        </motion.div>

        {/* Warning Banner */}
        <motion.div 
          className="bg-red-900/20 border border-red-600/30 rounded-lg p-3 mb-6"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center">
            <LockClosedIcon className="h-4 w-4 text-red-400 mr-2" />
            <p className="text-sm text-red-200">
              All activities are monitored and logged
            </p>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div 
          className="bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                className="bg-red-900/30 border border-red-600/50 rounded-lg p-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 text-red-400 mr-2" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Administrator Email
              </label>
              <motion.input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="admin@company.com"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              {loading ? 'Authenticating...' : 'Access Platform'}
            </motion.button>
          </form>

          <motion.div 
            className="mt-6 text-center"
            variants={itemVariants}
          >
            <Link href="/" className="text-gray-400 hover:text-white text-sm flex items-center justify-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Homepage
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}