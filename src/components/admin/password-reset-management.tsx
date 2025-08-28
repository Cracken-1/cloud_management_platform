'use client';

import { useState, useEffect } from 'react';
import {
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface PasswordResetRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  requestedAt: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  temporaryPassword?: string;
  expiresAt?: string;
}

export default function PasswordResetManagement() {
  const [requests, setRequests] = useState<PasswordResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PasswordResetRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPasswordResetRequests();
  }, []);

  const fetchPasswordResetRequests = async () => {
    try {
      const response = await fetch('/api/admin/password-reset-requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Failed to fetch password reset requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      const response = await fetch(`/api/admin/password-reset-requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'APPROVED', temporaryPassword: result.temporaryPassword, expiresAt: result.expiresAt }
            : req
        ));
        setShowModal(false);
        alert(`Password reset approved. Temporary password: ${result.temporaryPassword}`);
      }
    } catch (error) {
      console.error('Failed to approve request:', error);
      alert('Failed to approve request');
    }
  };

  const handleReject = async (requestId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      const response = await fetch(`/api/admin/password-reset-requests/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason })
      });

      if (response.ok) {
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'REJECTED', rejectionReason }
            : req
        ));
        setShowModal(false);
        setRejectionReason('');
        alert('Password reset request rejected');
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      alert('Failed to reject request');
    }
  };

  const openModal = (request: PasswordResetRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'APPROVED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      case 'COMPLETED': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <ClockIcon className="h-5 w-5" />;
      case 'APPROVED': return <CheckCircleIcon className="h-5 w-5" />;
      case 'REJECTED': return <XCircleIcon className="h-5 w-5" />;
      case 'COMPLETED': return <CheckCircleIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Password Reset Management</h2>
          <p className="text-gray-600">Review and approve password reset requests from users</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {requests.filter(r => r.status === 'PENDING').length} pending requests
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requested
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserIcon className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                      <div className="text-sm text-gray-500">{request.userEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {request.reason}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(request.requestedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status}</span>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {request.status === 'PENDING' && (
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openModal(request, 'approve')}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Approve Request"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openModal(request, 'reject')}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Reject Request"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  {request.status === 'APPROVED' && request.temporaryPassword && (
                    <button
                      onClick={() => alert(`Temporary Password: ${request.temporaryPassword}`)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="View Temporary Password"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {requests.length === 0 && (
          <div className="text-center py-12">
            <KeyIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No password reset requests</h3>
            <p className="mt-1 text-sm text-gray-500">All password reset requests will appear here.</p>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {actionType === 'approve' ? 'Approve' : 'Reject'} Password Reset Request
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>User:</strong> {selectedRequest.userName} ({selectedRequest.userEmail})
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Reason:</strong> {selectedRequest.reason}
              </p>
            </div>

            {actionType === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Explain why this request is being rejected..."
                  required
                />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => actionType === 'approve' 
                  ? handleApprove(selectedRequest.id)
                  : handleReject(selectedRequest.id)
                }
                className={`px-4 py-2 rounded-md text-white ${
                  actionType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
