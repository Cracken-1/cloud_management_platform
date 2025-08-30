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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-20 w-32 h-32 bg-red-500/20 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/20 rounded-full blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-24 h-24 bg-yellow-500/10 rounded-full blur-lg"
          animate={{ 
            y: [0, -50, 0],
            x: [0, 30, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
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
            className="mx-auto h-20 w-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(239, 68, 68, 0.3)",
                "0 0 40px rgba(239, 68, 68, 0.5)",
                "0 0 20px rgba(239, 68, 68, 0.3)"
              ]
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          >
            <ShieldCheckIcon className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Platform Administration
          </h1>
          <p className="text-red-200">Restricted Access - Authorized Personnel Only</p>
        </motion.div>

        {/* Warning Banner */}
        <motion.div 
          className="bg-red-900/30 border border-red-600/50 rounded-xl p-4 mb-6 backdrop-blur-sm"
          variants={itemVariants}
          animate={{ 
            borderColor: [
              "rgba(220, 38, 38, 0.5)",
              "rgba(220, 38, 38, 0.8)",
              "rgba(220, 38, 38, 0.5)"
            ]
          }}
          transition={{ 
            borderColor: { duration: 2, repeat: Infinity }
          }}
        >
          <div className="flex items-center justify-center">
            <LockClosedIcon className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-200 font-medium">
              All activities are monitored and logged
            </p>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div 
          className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-red-500/30"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                className="bg-red-900/50 border border-red-600/50 rounded-xl p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-3" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Administrator Email
              </label>
              <motion.input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-red-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Enter your authorized email"
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <LockClosedIcon className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-red-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/" className="text-gray-400 hover:text-white text-sm flex items-center justify-center">
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Homepage
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}