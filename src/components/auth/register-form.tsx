'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ExclamationCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { authService, RegistrationRequest } from '@/lib/auth/auth-service';

const BUSINESS_TYPES = [
  'Retail Store',
  'Wholesale Business',
  'Restaurant/Food Service',
  'Online Marketplace',
  'Franchise Operation',
  'Distribution Center',
  'Other'
];

const MONTHLY_VOLUMES = [
  'Less than KES 100,000',
  'KES 100,000 - 500,000',
  'KES 500,000 - 1,000,000',
  'KES 1,000,000 - 5,000,000',
  'KES 5,000,000 - 10,000,000',
  'More than KES 10,000,000'
];

const REFERRAL_SOURCES = [
  'Google Search',
  'Social Media',
  'Business Partner',
  'Industry Event',
  'Word of Mouth',
  'Sales Representative',
  'Other'
];

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegistrationRequest>({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    businessType: '',
    phoneNumber: '',
    businessRegistrationNumber: '',
    taxId: '',
    businessAddress: '',
    requestedRole: 'ADMIN',
    businessDescription: '',
    estimatedMonthlyVolume: '',
    referralSource: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.submitRegistrationRequest(formData);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Registration request failed');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegistrationRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phoneNumber);
      case 2:
        return !!(formData.company && formData.businessType && formData.businessAddress);
      case 3:
        return !!(formData.businessDescription && formData.estimatedMonthlyVolume && formData.referralSource);
      default:
        return false;
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Registration Request Submitted
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in Cloud Admin Portal. Your registration request has been submitted successfully.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex">
                <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ul className="text-left space-y-1">
                    <li>• Our admin team will review your application</li>
                    <li>• We may contact you for additional information</li>
                    <li>• You&apos;ll receive an email once your account is approved</li>
                    <li>• Approval typically takes 1-3 business days</li>
                  </ul>
                </div>
              </div>
            </div>
            <Link
              href="/auth/login"
              className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Request Admin Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Apply for administrative access to Adaptive Cloud Management Platform
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <UserIcon className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                  <p className="text-sm text-gray-600">Tell us about yourself</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+254 700 000 000"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requested Role *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.requestedRole}
                    onChange={(e) => handleInputChange('requestedRole', e.target.value as 'ADMIN' | 'STORE_MANAGER')}
                  >
                    <option value="ADMIN">Admin (Full Access)</option>
                    <option value="STORE_MANAGER">Store Manager (Limited Access)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <BuildingOfficeIcon className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
                  <p className="text-sm text-gray-600">Tell us about your business</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                  >
                    <option value="">Select business type</option>
                    {BUSINESS_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Registration Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., C.123456"
                      value={formData.businessRegistrationNumber}
                      onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax ID (KRA PIN)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., P051234567A"
                      value={formData.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full business address including city and postal code"
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Additional Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <InformationCircleIcon className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>
                  <p className="text-sm text-gray-600">Help us understand your needs</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your business, products/services, and how you plan to use the platform"
                    value={formData.businessDescription}
                    onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Monthly Volume *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.estimatedMonthlyVolume}
                    onChange={(e) => handleInputChange('estimatedMonthlyVolume', e.target.value)}
                  >
                    <option value="">Select estimated monthly volume</option>
                    {MONTHLY_VOLUMES.map(volume => (
                      <option key={volume} value={volume}>{volume}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How did you hear about us? *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.referralSource}
                    onChange={(e) => handleInputChange('referralSource', e.target.value)}
                  >
                    <option value="">Select referral source</option>
                    {REFERRAL_SOURCES.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4">
                <div className="flex">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={prevStep}
                className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                  currentStep === 1 
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                disabled={currentStep === 1}
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !isStepValid(3)}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ← Back to Login
          </Link>
        </div>

        {/* Enterprise Notice */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex">
            <InformationCircleIcon className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Enterprise Registration Policy</p>
              <p>
                Cloud Admin Portal is an enterprise platform. All registration requests require 
                manual approval by our administrative team. Self-registration is not permitted to 
                ensure security and proper access control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}