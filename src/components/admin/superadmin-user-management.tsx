'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  tenant_id?: string;
  tenant_name?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
}

interface NewAdminForm {
  email: string;
  full_name: string;
  role: 'ADMIN' | 'STORE_MANAGER' | 'INVENTORY_MANAGER';
  send_invitation: boolean;
}

export default function SuperadminUserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState<NewAdminForm>({
    email: '',
    full_name: '',
    role: 'ADMIN',
    send_invitation: true
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/superadmin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/superadmin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAdmin, send_invitation: true })
      });

      if (response.ok) {
        const result = await response.json();
        setUsers([...users, result.user]);
        setShowAddForm(false);
        setNewAdmin({ email: '', full_name: '', role: 'ADMIN', send_invitation: true });
        alert('User created successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error: unknown) {
      console.error('Failed to add admin:', error);
      alert('Failed to add admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/superadmin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, is_active: !currentStatus } : user
        ));
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/superadmin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(prev => prev.filter(user => user.id !== userId));
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
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
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage admin users and their access to the platform</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Admin
        </button>
      </div>

      {/* Add Admin Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Admin</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={newAdmin.full_name}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, full_name: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, role: e.target.value as 'ADMIN' | 'STORE_MANAGER' | 'INVENTORY_MANAGER' }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_MANAGER">Store Manager</option>
                  <option value="INVENTORY_MANAGER">Inventory Manager</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="send_invitation"
                  checked={newAdmin.send_invitation}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, send_invitation: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="send_invitation" className="ml-2 block text-sm text-gray-900">
                  Send invitation email
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.tenant_name || 'Not assigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.is_active ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className={`text-sm ${user.is_active ? 'text-green-800' : 'text-red-800'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                      className={`p-1 rounded ${user.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                      title={user.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {user.is_active ? <XCircleIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete User"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12">
            <PlusIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first admin user.</p>
          </div>
        )}
      </div>
    </div>
  );
}
