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
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-gray-50/50" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#000" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200/50"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                <CloudIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-900 text-xl font-semibold">
                InfinityStack
              </span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/admin/login" className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors">
                  Sign In
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/superadmin/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Admin Console
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            className="text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6 leading-tight">
                Enterprise Cloud Platform
                <span className="block text-3xl md:text-5xl font-normal text-blue-600 mt-2">
                  Built for Scale
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Secure, scalable, and intelligent cloud infrastructure management. 
              Trusted by enterprises worldwide for mission-critical workloads.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/access/request" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-medium flex items-center transition-colors">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/admin/login" className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-3 rounded-lg text-base font-medium transition-colors">
                  Sign In
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div 
        className="relative bg-gray-50/50 border-y border-gray-200/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
              >
                <stat.icon className="h-6 w-6 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-semibold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            Enterprise-Grade Capabilities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive cloud infrastructure management with advanced security, 
            scalability, and intelligent automation.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {[
            {
              icon: CloudIcon,
              title: "Multi-Tenant Architecture",
              description: "Secure tenant isolation with customizable branding and role-based access control."
            },
            {
              icon: ShieldCheckIcon,
              title: "Enterprise Security",
              description: "SOC 2 compliance, comprehensive audit logging, and advanced threat protection."
            },
            {
              icon: ChartBarIcon,
              title: "Advanced Analytics",
              description: "Machine learning insights, predictive scaling, and performance optimization."
            },
            {
              icon: UsersIcon,
              title: "Identity Management",
              description: "Automated provisioning, SSO integration, and compliance reporting."
            },
            {
              icon: ServerIcon,
              title: "Infrastructure Automation",
              description: "Automated scaling, monitoring, disaster recovery, and cost optimization."
            },
            {
              icon: CpuChipIcon,
              title: "API-First Platform",
              description: "RESTful APIs with comprehensive documentation and real-time event streaming."
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="group"
              variants={fadeInUp}
            >
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow h-full">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Testimonials */}
      <motion.div 
        className="relative bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-light text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-600">Join thousands of enterprises transforming their infrastructure</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                quote: "InfinityStack transformed our cloud operations. 99.99% uptime and incredible scalability.",
                author: "Sarah Chen",
                role: "CTO, TechCorp Global"
              },
              {
                quote: "The security features and compliance tools are exactly what we needed for our enterprise.",
                author: "Michael Rodriguez",
                role: "CISO, SecureFinance"
              },
              {
                quote: "Best-in-class platform with exceptional support. Our deployment time reduced by 80%.",
                author: "Emily Johnson",
                role: "VP Engineering, CloudScale"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6"
                variants={fadeInUp}
              >
                <p className="text-gray-700 mb-4 text-sm italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{testimonial.author}</div>
                  <div className="text-gray-500 text-xs">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="bg-blue-600 rounded-lg p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-light text-white mb-4">
            Ready to Transform Your Infrastructure?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join the next generation of cloud management with enterprise-grade infrastructure.
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/access/request" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-lg text-base font-medium inline-flex items-center transition-colors">
              Get Started
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <CloudIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-900 text-xl font-semibold">InfinityStack</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-md text-sm">
                Enterprise cloud management platform designed for scale, security, and performance.
              </p>
              <div className="flex space-x-3">
                {['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA'].map((cert) => (
                  <div key={cert} className="bg-gray-100 px-2 py-1 rounded text-gray-700 text-xs">
                    {cert}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-gray-900 font-medium mb-3 text-sm">Platform</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/admin/login" className="hover:text-gray-900 transition-colors">Sign In</Link></li>
                <li><Link href="/access/request" className="hover:text-gray-900 transition-colors">Request Access</Link></li>
                <li><Link href="/superadmin/login" className="hover:text-gray-900 transition-colors">Admin Console</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-900 font-medium mb-3 text-sm">Legal</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-gray-500 text-xs">
              © 2024 InfinityStack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}