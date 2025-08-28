'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/password-reset-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-' + Date.now(), // In real app, would get from session
          reason: reason || 'Password reset requested via forgot password form'
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to submit password reset request');
      }
    } catch (error) {
      console.error('Password reset request failed:', error);
      alert('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <KeyIcon className="mx-auto h-12 w-12 text-green-600" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Request Submitted
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Your password reset request has been submitted to the administrators. 
                You will receive an email notification once your request is reviewed.
              </p>
              <div className="mt-6">
                <Link
                  href="/auth/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <KeyIcon className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Submit a password reset request for admin approval
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason for password reset
              </label>
              <div className="mt-1">
                <textarea
                  id="reason"
                  name="reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please explain why you need a password reset (optional)"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Providing a reason helps administrators process your request faster.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Enterprise Security Notice
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Password reset requests require administrator approval for security. 
                      You will be notified via email once your request is processed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Reset Request'}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
