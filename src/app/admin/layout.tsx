'use client';

import { motion } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}