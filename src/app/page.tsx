'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CloudIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  ChartBarIcon,
  UsersIcon,
  ServerIcon,
  ArrowRightIcon,
  CheckIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

export default function Home() {

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/logo.png" alt="InfinityStack" className="h-10 w-10 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">InfinityStack</h1>
                <p className="text-sm text-gray-600">Enterprise Cloud Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/request-access"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Request Access
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-20"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Enterprise Cloud
              <motion.span 
                className="text-blue-600 block"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                Infrastructure
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              Scalable, secure, and intelligent cloud management platform designed for enterprise operations. 
              Multi-tenant architecture with advanced analytics, AI-powered insights, and enterprise-grade security.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/request-access"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold inline-flex items-center justify-center"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="#features"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-lg font-semibold"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            >
              {[
                { icon: ShieldCheckIcon, text: "Enterprise Security", color: "text-green-600" },
                { icon: CloudIcon, text: "99.9% Uptime SLA", color: "text-blue-600" },
                { icon: LockClosedIcon, text: "SOC 2 Compliant", color: "text-purple-600" },
                { icon: GlobeAltIcon, text: "Global Infrastructure", color: "text-indigo-600" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                >
                  <item.icon className={`h-5 w-5 ${item.color} mr-2`} />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for scale, security, and performance. Our platform provides everything you need 
              to manage complex enterprise operations with confidence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Multi-Tenant Architecture */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <BuildingOfficeIcon className="h-7 w-7 text-blue-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Multi-Tenant Architecture
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Scalable multi-tenant infrastructure with complete data isolation, 
                custom branding, and flexible subscription management for enterprise clients.
              </p>
            </motion.div>

            {/* Advanced Security */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ShieldCheckIcon className="h-7 w-7 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Enterprise Security
              </h3>
              <p className="text-gray-600 leading-relaxed">
                SOC 2 compliant infrastructure with end-to-end encryption, 
                role-based access control, and comprehensive audit logging.
              </p>
            </motion.div>

            {/* Cloud Infrastructure */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <CloudIcon className="h-7 w-7 text-purple-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Global Cloud Infrastructure
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Distributed cloud architecture with automatic scaling, 
                global CDN, and 99.9% uptime SLA for mission-critical operations.
              </p>
            </motion.div>

            {/* AI & Analytics */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <CpuChipIcon className="h-7 w-7 text-indigo-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI-Powered Analytics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Machine learning algorithms for predictive analytics, 
                automated insights, and intelligent decision support systems.
              </p>
            </motion.div>

            {/* Real-time Monitoring */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ChartBarIcon className="h-7 w-7 text-orange-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Real-time Monitoring
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive monitoring dashboards with real-time metrics, 
                alerting systems, and performance optimization recommendations.
              </p>
            </motion.div>

            {/* User Management */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <UsersIcon className="h-7 w-7 text-red-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Advanced User Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sophisticated user management with SSO integration, 
                granular permissions, and automated provisioning workflows.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enterprise Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Built for Enterprise Scale
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                InfinityStack provides the robust infrastructure and advanced features 
                that enterprise organizations need to operate at scale.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Scalable Architecture</h4>
                    <p className="text-gray-600">Auto-scaling infrastructure that grows with your business</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Enterprise Integration</h4>
                    <p className="text-gray-600">Seamless integration with existing enterprise systems</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                    <p className="text-gray-600">Dedicated enterprise support with SLA guarantees</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Compliance Ready</h4>
                    <p className="text-gray-600">SOC 2, GDPR, and industry-specific compliance</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime SLA</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">SOC 2</div>
                  <div className="text-sm text-gray-600">Compliant</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">Global</div>
                  <div className="text-sm text-gray-600">Infrastructure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Scale Your Enterprise Operations?
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-3xl mx-auto">
            Join leading enterprises who trust InfinityStack for their critical infrastructure. 
            Get started with our enterprise-grade platform today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/request-access"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold inline-flex items-center justify-center"
            >
              Request Enterprise Demo
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/auth/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-lg font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <img src="/logo.png" alt="InfinityStack" className="h-8 w-8 mr-3" />
                <h3 className="text-xl font-bold">InfinityStack</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Enterprise cloud platform providing scalable, secure, and intelligent 
                infrastructure solutions for modern businesses.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-sm text-gray-400">
                  <ShieldCheckIcon className="h-4 w-4 mr-1" />
                  SOC 2 Compliant
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <ServerIcon className="h-4 w-4 mr-1" />
                  99.9% Uptime
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/auth/request-access" className="hover:text-white transition-colors">Request Access</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal & Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 InfinityStack. Enterprise cloud infrastructure platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
