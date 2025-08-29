'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Building2, 
  Mail, 
  Phone, 
  UserIcon, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Shield,
  Users,
  Zap,
  Globe,
  ChevronRight,
  Star
} from 'lucide-react';
import type { User } from '@supabase/auth-helpers-nextjs';

interface AccessRequestData {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  businessType: string;
  phoneNumber: string;
  businessRegistrationNumber: string;
  businessDescription: string;
  estimatedMonthlyVolume: string;
  referralSource: string;
}

export default function RequestAccess() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AccessRequestData>({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    businessType: '',
    phoneNumber: '',
    businessRegistrationNumber: '',
    businessDescription: '',
    estimatedMonthlyVolume: '',
    referralSource: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Check if user came from Google OAuth
    const checkGoogleAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && session.user.app_metadata.provider === 'google') {
        setGoogleUser(session.user);
        // Pre-fill form with Google data
        setFormData(prev => ({
          ...prev,
          email: session.user.email || '',
          firstName: session.user.user_metadata.given_name || session.user.user_metadata.full_name?.split(' ')[0] || '',
          lastName: session.user.user_metadata.family_name || session.user.user_metadata.full_name?.split(' ').slice(1).join(' ') || ''
        }));
      }
    };

    checkGoogleAuth();
  }, [supabase]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrors({});
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/request-access`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            hd: '', // Allow any domain, but we will validate corporate emails
          }
        }
      });
      
      if (error) throw error;
    } catch (error) {
      setErrors({ google: error instanceof Error ? error.message : 'Google sign-in failed' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      } else if (formData.email.includes('@gmail.com') || formData.email.includes('@yahoo.com') || formData.email.includes('@hotmail.com')) {
        newErrors.email = 'Please use your corporate/work email address';
      }
      
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
    }
    
    if (step === 2) {
      if (!formData.company) newErrors.company = 'Company name is required';
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
      if (!formData.businessDescription) newErrors.businessDescription = 'Business description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/request-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isGoogleAuth: !!googleUser,
          googleUserId: googleUser?.id
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
        setCurrentStep(3);
      } else {
        setErrors({ submit: result.message || 'Request failed' });
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Tell us about yourself' },
    { number: 2, title: 'Business Details', description: 'Your company information' },
    { number: 3, title: 'Confirmation', description: 'Review and submit' }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Request Submitted Successfully!
            </h1>
            
            <p className="text-gray-200 mb-6">
              Thank you for your interest in our platform. We have received your access request and will review it within 24-48 hours.
            </p>
            
            <div className="bg-blue-500/20 rounded-xl p-4 mb-6 border border-blue-400/30">
              <p className="text-sm text-blue-200">
                <strong>What&apos;s next?</strong><br />
                Our team will review your application and contact you at <strong>{formData.email}</strong> with further instructions.
              </p>
            </div>
            
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-purple-300/50 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-1/3 left-2/3 w-3 h-3 bg-blue-300/40 rounded-full animate-ping delay-1000"></div>
      </div>

      <div className="relative max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 transform hover:scale-110 transition-transform duration-300">
            <Sparkles className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Join Our Platform
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            Request access to our advanced cloud management platform
          </p>
          
          {/* Features showcase */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-200">
              <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300 font-medium">Enterprise Security</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-200">
              <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300 font-medium">Multi-Tenant</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-200">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300 font-medium">High Performance</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-200">
              <Globe className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300 font-medium">Global Scale</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.number 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-500 text-white' 
                    : 'border-gray-400 text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-bold">{step.number}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <h3 className="text-lg font-semibold text-white">{steps[currentStep - 1].title}</h3>
            <p className="text-sm text-purple-200">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                {/* Google Sign-in Option */}
                {!googleUser && (
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={googleLoading}
                      className="w-full flex items-center justify-center px-4 py-3 border border-white/20 rounded-xl text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
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
                        <span className="px-2 bg-transparent text-gray-300">or continue with email</span>
                      </div>
                    </div>
                  </div>
                )}

                {googleUser && (
                  <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <div>
                        <p className="text-sm text-green-300 font-medium">Google Account Connected</p>
                        <p className="text-xs text-green-200">{googleUser.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {errors.google && (
                  <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                      <p className="text-sm text-red-300">{errors.google}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      <UserIcon className="w-4 h-4 inline mr-1" />
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      <UserIcon className="w-4 h-4 inline mr-1" />
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!!googleUser}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                    placeholder="your.email@company.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                  <p className="mt-1 text-xs text-gray-400">Please use your work email address</p>
                </div>
              </div>
            )}

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your company name"
                  />
                  {errors.company && <p className="mt-1 text-sm text-red-400">{errors.company}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Business Type *
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="" className="bg-gray-800">Select business type</option>
                      <option value="TECHNOLOGY" className="bg-gray-800">Technology</option>
                      <option value="FINANCE" className="bg-gray-800">Finance</option>
                      <option value="HEALTHCARE" className="bg-gray-800">Healthcare</option>
                      <option value="RETAIL" className="bg-gray-800">Retail</option>
                      <option value="MANUFACTURING" className="bg-gray-800">Manufacturing</option>
                      <option value="EDUCATION" className="bg-gray-800">Education</option>
                      <option value="OTHER" className="bg-gray-800">Other</option>
                    </select>
                    {errors.businessType && <p className="mt-1 text-sm text-red-400">{errors.businessType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phoneNumber && <p className="mt-1 text-sm text-red-400">{errors.phoneNumber}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Business Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.businessRegistrationNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessRegistrationNumber: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Optional: Your business registration number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Business Description *
                  </label>
                  <textarea
                    value={formData.businessDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Briefly describe your business and how you plan to use our platform..."
                  />
                  {errors.businessDescription && <p className="mt-1 text-sm text-red-400">{errors.businessDescription}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Estimated Monthly Volume
                    </label>
                    <select
                      value={formData.estimatedMonthlyVolume}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedMonthlyVolume: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="" className="bg-gray-800">Select volume</option>
                      <option value="LOW" className="bg-gray-800">Low (&lt; 1,000 transactions)</option>
                      <option value="MEDIUM" className="bg-gray-800">Medium (1,000 - 10,000)</option>
                      <option value="HIGH" className="bg-gray-800">High (10,000 - 100,000)</option>
                      <option value="ENTERPRISE" className="bg-gray-800">Enterprise (&gt; 100,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      How did you hear about us?
                    </label>
                    <select
                      value={formData.referralSource}
                      onChange={(e) => setFormData(prev => ({ ...prev, referralSource: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="" className="bg-gray-800">Select source</option>
                      <option value="SEARCH" className="bg-gray-800">Search Engine</option>
                      <option value="SOCIAL" className="bg-gray-800">Social Media</option>
                      <option value="REFERRAL" className="bg-gray-800">Referral</option>
                      <option value="ADVERTISEMENT" className="bg-gray-800">Advertisement</option>
                      <option value="OTHER" className="bg-gray-800">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
              )}
              
              <div className="flex-1"></div>
              
              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </button>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mt-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                  <p className="text-sm text-red-300">{errors.submit}</p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="text-purple-300 hover:text-purple-200 font-medium transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}