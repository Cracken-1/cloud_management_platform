'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  UserIcon, 
  BuildingOfficeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/loading-spinner';

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

const stepVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
};

export default function AccessRequest() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    organizationName: '',
    organizationDomain: '',
    organizationSize: '',
    industry: '',
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
    } catch {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-12 px-4">
        <motion.div 
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <CheckCircleIcon className="h-20 w-20 text-emerald-500 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Request Submitted!
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your access request has been submitted successfully. Our team will review your request and contact you within 2-3 business days.
          </p>
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200 mb-8"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">What happens next?</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                Initial review (1-2 business days)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                Technical assessment
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                Business validation
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Account setup and credentials
              </li>
            </ul>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
              ← Return to Homepage
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-20 w-32 h-32 bg-emerald-200/30 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-40 h-40 bg-teal-200/30 rounded-full blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Request Enterprise Access
          </h1>
          <p className="text-gray-600 text-lg">Get started with InfinityStack Cloud Management Platform</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <motion.div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                    step >= stepNumber 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  animate={{ 
                    scale: step === stepNumber ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: step === stepNumber ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                >
                  {stepNumber}
                </motion.div>
                {stepNumber < 3 && (
                  <motion.div 
                    className={`w-16 h-1 mx-2 rounded ${
                      step > stepNumber ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gray-200'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: step > stepNumber ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <form onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center mb-6">
                    <UserIcon className="h-6 w-6 text-emerald-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                      <input
                        type="text"
                        name="jobTitle"
                        required
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </motion.div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Organization Details
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Organization Information */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center mb-6">
                    <BuildingOfficeIcon className="h-6 w-6 text-emerald-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Organization Information</h2>
                  </div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name *</label>
                    <input
                      type="text"
                      name="organizationName"
                      required
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Domain</label>
                      <input
                        type="text"
                        name="organizationDomain"
                        placeholder="company.com"
                        value={formData.organizationDomain}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Size *</label>
                      <select
                        name="organizationSize"
                        required
                        value={formData.organizationSize}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Industry *</label>
                    <input
                      type="text"
                      name="industry"
                      required
                      placeholder="e.g., Technology, Healthcare, Finance"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </motion.div>

                  <div className="flex space-x-4">
                    <motion.button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeftIcon className="mr-2 h-5 w-5" />
                      Back
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue to Requirements
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Business Requirements */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center mb-6">
                    <DocumentTextIcon className="h-6 w-6 text-emerald-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Business Requirements</h2>
                  </div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Use Case Description *</label>
                    <textarea
                      name="useCase"
                      required
                      rows={4}
                      placeholder="Describe how you plan to use the platform..."
                      value={formData.useCase}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Users</label>
                      <input
                        type="number"
                        name="expectedUsers"
                        placeholder="Number of users"
                        value={formData.expectedUsers}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Requested Plan</label>
                      <select
                        name="requestedPlan"
                        value={formData.requestedPlan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      >
                        <option value="starter">Starter</option>
                        <option value="professional">Professional</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Technical Requirements</label>
                    <textarea
                      name="technicalRequirements"
                      rows={3}
                      placeholder="Any specific technical requirements or integrations needed..."
                      value={formData.technicalRequirements}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </motion.div>

                  <div className="flex space-x-4">
                    <motion.button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeftIcon className="mr-2 h-5 w-5" />
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : null}
                      {loading ? 'Submitting...' : 'Submit Request'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center justify-center">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Homepage
          </Link>
        </motion.div>
      </div>
    </div>
  );
}