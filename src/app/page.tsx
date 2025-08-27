'use client';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PandaMart</h1>
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Cloud Management
              </span>
            </div>
            <Link
              href="/admin"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              Access Admin Panel
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Advanced E-commerce
            <span className="text-blue-600 block">Management Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive administrative system for PandaMart Kenya with AI-powered inventory forecasting, 
            dynamic pricing, M-Pesa integration, and advanced analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Launch Admin Dashboard
            </Link>
            <Link
              href="/admin/inventory"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium"
            >
              View Inventory AI
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features for Kenya Market
          </h2>
          <p className="text-lg text-gray-600">
            Built specifically for the Kenyan e-commerce landscape with local integrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI Inventory Forecasting */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI Inventory Forecasting
            </h3>
            <p className="text-gray-600 mb-4">
              Machine learning-powered demand prediction with Kenya-specific seasonal patterns, 
              holiday adjustments, and local market factors.
            </p>
            <Link href="/admin/inventory" className="text-blue-600 hover:text-blue-800 font-medium">
              Explore Forecasting →
            </Link>
          </div>

          {/* Dynamic Pricing */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Dynamic Pricing Engine
            </h3>
            <p className="text-gray-600 mb-4">
              Intelligent pricing optimization based on competitor analysis, demand patterns, 
              and Kenya market psychology with M-Pesa friendly pricing.
            </p>
            <Link href="/admin/pricing" className="text-blue-600 hover:text-blue-800 font-medium">
              View Pricing AI →
            </Link>
          </div>

          {/* M-Pesa Integration */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <ShoppingBagIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Enhanced M-Pesa Integration
            </h3>
            <p className="text-gray-600 mb-4">
              Complete M-Pesa payment processing with STK Push, bulk payments, 
              transaction reconciliation, and daily limit monitoring.
            </p>
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
              View Payments →
            </Link>
          </div>

          {/* Supplier Management */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BuildingStorefrontIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Local Supplier Network
            </h3>
            <p className="text-gray-600 mb-4">
              Comprehensive supplier relationship management with performance tracking, 
              local farmer integration, and quality scorecards.
            </p>
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
              Manage Suppliers →
            </Link>
          </div>

          {/* Multi-tenant Architecture */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <UserGroupIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Multi-tenant Platform
            </h3>
            <p className="text-gray-600 mb-4">
              Scalable architecture supporting multiple businesses with isolated data, 
              custom branding, and flexible subscription models.
            </p>
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
              Platform Management →
            </Link>
          </div>

          {/* Advanced Analytics */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <ChartBarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Business Intelligence
            </h3>
            <p className="text-gray-600 mb-4">
              Real-time analytics dashboard with sales insights, customer behavior analysis, 
              and market trend identification for Kenya market.
            </p>
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
              View Analytics →
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your E-commerce Operations?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Experience the power of AI-driven inventory management and dynamic pricing 
            tailored for the Kenya market.
          </p>
          <Link
            href="/admin"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium inline-flex items-center"
          >
            Access Admin Dashboard
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 PandaMart Cloud Management Platform. Built for Kenya&apos;s e-commerce future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
