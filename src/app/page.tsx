'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  CloudIcon, 
  ChartBarIcon, 
  UsersIcon,
  ServerIcon,
  CpuChipIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  BoltIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative bg-white/5 backdrop-blur-xl border-b border-white/10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-10 w-10 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center mr-3">
                <CloudIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-white text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                InfinityStack
              </span>
            </motion.div>
            <div className="flex space-x-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/admin/login" className="text-white/80 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Admin Portal
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/superadmin/login" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-lg transition-all">
                  Platform Admin
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div 
            className="text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
                Enterprise Cloud
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                  Infrastructure
                </span>
                <span className="block text-5xl md:text-7xl">Reimagined</span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Transform your business with our next-generation cloud management platform. 
              Built for enterprise scale, designed for simplicity, secured by design.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/access/request" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-10 py-4 rounded-xl text-lg font-semibold flex items-center shadow-2xl transition-all">
                  Start Your Journey
                  <ArrowRightIcon className="ml-3 h-5 w-5" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/admin/login" className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm border border-white/20 transition-all">
                  Access Portal
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div 
        className="relative bg-white/5 backdrop-blur-xl border-y border-white/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { number: "99.99%", label: "Uptime SLA", icon: ShieldCheckIcon },
              { number: "500K+", label: "API Calls/sec", icon: BoltIcon },
              { number: "150+", label: "Global Regions", icon: GlobeAltIcon },
              { number: "24/7", label: "Expert Support", icon: UsersIcon }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center group"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <stat.icon className="h-8 w-8 text-emerald-400 mx-auto mb-4 group-hover:text-teal-400 transition-colors" />
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/70 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            Enterprise-Grade
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Capabilities
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Comprehensive cloud infrastructure management with advanced security, 
            scalability, and intelligent automation.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {[
            {
              icon: CloudIcon,
              title: "Multi-Tenant Architecture",
              description: "Secure tenant isolation with customizable branding, role-based access control, and scalable infrastructure.",
              color: "from-emerald-500 to-teal-500"
            },
            {
              icon: ShieldCheckIcon,
              title: "Zero-Trust Security",
              description: "Enterprise-grade security with SOC 2 compliance, comprehensive audit logging, and advanced threat protection.",
              color: "from-teal-500 to-cyan-500"
            },
            {
              icon: ChartBarIcon,
              title: "AI-Powered Analytics",
              description: "Advanced analytics and reporting with machine learning insights, predictive scaling, and performance optimization.",
              color: "from-cyan-500 to-blue-500"
            },
            {
              icon: UsersIcon,
              title: "Identity Management",
              description: "Comprehensive user lifecycle management with automated provisioning, SSO integration, and compliance reporting.",
              color: "from-blue-500 to-indigo-500"
            },
            {
              icon: ServerIcon,
              title: "Infrastructure Automation",
              description: "Complete infrastructure management with automated scaling, monitoring, disaster recovery, and cost optimization.",
              color: "from-indigo-500 to-purple-500"
            },
            {
              icon: CpuChipIcon,
              title: "API-First Platform",
              description: "RESTful APIs with comprehensive documentation, SDK support, webhooks, and real-time event streaming.",
              color: "from-purple-500 to-pink-500"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="group relative"
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                <div className={`h-16 w-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Testimonials */}
      <motion.div 
        className="relative bg-gradient-to-r from-emerald-900/50 to-teal-900/50 backdrop-blur-xl border-y border-white/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Industry Leaders</h2>
            <p className="text-white/80 text-lg">Join thousands of enterprises transforming their infrastructure</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                quote: "InfinityStack transformed our cloud operations. 99.99% uptime and incredible scalability.",
                author: "Sarah Chen",
                role: "CTO, TechCorp Global",
                rating: 5
              },
              {
                quote: "The security features and compliance tools are exactly what we needed for our enterprise.",
                author: "Michael Rodriguez",
                role: "CISO, SecureFinance",
                rating: 5
              },
              {
                quote: "Best-in-class platform with exceptional support. Our deployment time reduced by 80%.",
                author: "Emily Johnson",
                role: "VP Engineering, CloudScale",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-white/70 text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div 
          className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-16 text-center relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-teal-600/90" />
          <div className="relative">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Transform Your Infrastructure?
            </h2>
            <p className="text-white/90 text-xl mb-10 max-w-3xl mx-auto">
              Join the next generation of cloud management. Get started with enterprise-grade 
              infrastructure that scales with your ambitions.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/access/request" className="bg-white text-emerald-600 hover:bg-gray-100 px-12 py-4 rounded-xl text-xl font-bold inline-flex items-center shadow-2xl transition-all">
                Get Enterprise Access
                <ArrowRightIcon className="ml-3 h-6 w-6" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative bg-black/20 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center mr-3">
                  <CloudIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-2xl font-bold">InfinityStack</span>
              </div>
              <p className="text-white/70 mb-6 max-w-md">
                Enterprise cloud management platform designed for scale, security, and performance. 
                Transform your infrastructure with intelligent automation.
              </p>
              <div className="flex space-x-4">
                {['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA'].map((cert) => (
                  <div key={cert} className="bg-white/10 px-3 py-1 rounded-lg text-white/80 text-sm">
                    {cert}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
                <li><Link href="/access/request" className="hover:text-white transition-colors">Request Access</Link></li>
                <li><Link href="/superadmin/login" className="hover:text-white transition-colors">Platform Admin</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/60">
              © 2024 InfinityStack. All rights reserved. Enterprise Cloud Management Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}