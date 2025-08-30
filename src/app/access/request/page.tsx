'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  UserIcon, 
  BuildingOfficeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function AccessRequest() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal info
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    
    // Organization info
    organizationName: '',
    organizationDomain: '',
    organizationSize: '',
    industry: '',
    
    // Business details
    businessDescription: '',
    useCase: '',
    expectedUsers: '',
    technicalRequirements: '',
    requestedPlan: 'starter',
    urgency: 'normal'
  });

  const supabase = createClientComponentClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('access_requests')
        .insert({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          job_title: formData.jobTitle,
          organization_name: formData.organizationName,
          organization_domain: formData.organizationDomain,
          organization_size: formData.organizationSize,
          industry: formData.industry,
          business_description: formData.businessDescription,
          use_case: formData.useCase,
          expected_users: parseInt(formData.expectedUsers) || 0,
          technical_requirements: formData.technicalRequirements,
          requested_plan: formData.requestedPlan,
          urgency: formData.urgency,
          stage: 'submitted',
          status: 'pending'
        });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setSuccess(true);
    } catch (error) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-slate-900 to-gray-900 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Request Submitted!</h1>
          <p className="text-gray-300 mb-8">
            Your access request has been submitted successfully. Our team will review your request and contact you within 2-3 business days.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">What happens next?</h3>
            <ul className="text-left text-gray-300 space-y-2">
              <li>• Initial review (1-2 business days)</li>
              <li>• Technical assessment</li>
              <li>• Business validation</li>
              <li>• Account setup and credentials</li>
            </ul>
          </div>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Request Enterprise Access</h1>
          <p className="text-gray-300">Get started with InfinityStack Cloud Management Platform</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
              3
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-3" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <UserIcon className="h-6 w-6 text-blue-400 mr-2" />
                  <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Job Title *</label>
                    <input
                      type="text"
                      name="jobTitle"
                      required
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
                >
                  Continue to Organization Details
                </button>
              </div>
            )}

            {/* Step 2: Organization Information */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-400 mr-2" />
                  <h2 className="text-xl font-semibold text-white">Organization Information</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Organization Name *</label>
                  <input
                    type="text"
                    name="organizationName"
                    required
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Organization Domain</label>
                    <input
                      type="text"
                      name="organizationDomain"
                      placeholder="company.com"
                      value={formData.organizationDomain}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Organization Size *</label>
                    <select
                      name="organizationSize"
                      required
                      value={formData.organizationSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Industry *</label>
                  <input
                    type="text"
                    name="industry"
                    required
                    placeholder="e.g., Technology, Healthcare, Finance"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
                  >
                    Continue to Requirements
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Business Requirements */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <DocumentTextIcon className="h-6 w-6 text-blue-400 mr-2" />
                  <h2 className="text-xl font-semibold text-white">Business Requirements</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Use Case Description *</label>
                  <textarea
                    name="useCase"
                    required
                    rows={4}
                    placeholder="Describe how you plan to use the platform..."
                    value={formData.useCase}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Expected Users</label>
                    <input
                      type="number"
                      name="expectedUsers"
                      placeholder="Number of users"
                      value={formData.expectedUsers}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Requested Plan</label>
                    <select
                      name="requestedPlan"
                      value={formData.requestedPlan}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="starter">Starter</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Technical Requirements</label>
                  <textarea
                    name="technicalRequirements"
                    rows={3}
                    placeholder="Any specific technical requirements or integrations needed..."
                    value={formData.technicalRequirements}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium"
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-400 hover:text-white">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}