import Link from 'next/link';
import { 
  ShieldCheckIcon, 
  CloudIcon, 
  ChartBarIcon, 
  UsersIcon,
  ServerIcon,
  CpuChipIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/logo.png" alt="InfinityStack" className="h-8 w-8 mr-3" />
              <span className="text-white text-xl font-bold">InfinityStack</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/admin/login" className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Admin Login
              </Link>
              <Link href="/superadmin/login" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Platform Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Enterprise Cloud
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Management Platform
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Scalable, secure, and intelligent cloud infrastructure management designed for enterprise operations. 
              Multi-tenant architecture with advanced analytics and enterprise-grade security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/access/request" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium flex items-center justify-center">
                Request Access
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/admin/login" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-medium backdrop-blur-sm border border-white/20">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Features</h2>
          <p className="text-white/70 text-lg">Built for scale, security, and performance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <CloudIcon className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Multi-Tenant Architecture</h3>
            <p className="text-white/70">Secure tenant isolation with customizable branding and role-based access control.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <ShieldCheckIcon className="h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
            <p className="text-white/70">SOC 2 compliant with comprehensive audit logging and advanced threat protection.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <ChartBarIcon className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Analytics</h3>
            <p className="text-white/70">Advanced analytics and reporting with machine learning insights.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <UsersIcon className="h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">User Management</h3>
            <p className="text-white/70">Comprehensive user lifecycle management with automated provisioning.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <ServerIcon className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Infrastructure Control</h3>
            <p className="text-white/70">Complete infrastructure management with automated scaling and monitoring.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <CpuChipIcon className="h-12 w-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">API Integration</h3>
            <p className="text-white/70">RESTful APIs with comprehensive documentation and SDK support.</p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white/5 backdrop-blur-sm border-y border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Trusted by Enterprise Leaders</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-white/70">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">SOC 2</div>
              <div className="text-white/70">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-white/70">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">Global</div>
              <div className="text-white/70">Infrastructure</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/90 text-lg mb-8">Join thousands of enterprises managing their cloud infrastructure with InfinityStack.</p>
          <Link href="/access/request" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-medium inline-flex items-center">
            Request Enterprise Access
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/logo.png" alt="InfinityStack" className="h-8 w-8 mr-3" />
              <span className="text-white text-xl font-bold">InfinityStack</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-white/70 hover:text-white">Privacy</Link>
              <Link href="/terms" className="text-white/70 hover:text-white">Terms</Link>
              <Link href="/superadmin/login" className="text-white/70 hover:text-white">Platform Admin</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-center">
            <p className="text-white/60">© 2024 InfinityStack. All rights reserved. Enterprise Cloud Management Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}