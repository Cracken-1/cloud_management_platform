'use client';

import { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  hireDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  salary: number;
  manager: string;
  permissions: string[];
  lastLogin: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockStaff: StaffMember[] = [
      {
        id: 'STAFF-001',
        name: 'John Kamau',
        email: 'john.kamau@company.com',
        phone: '+254712345678',
        role: 'Store Manager',
        department: 'Operations',
        hireDate: '2024-03-15T00:00:00Z',
        status: 'ACTIVE',
        salary: 85000,
        manager: 'Admin',
        permissions: ['inventory_read', 'inventory_write', 'orders_read', 'staff_read'],
        lastLogin: '2025-01-19T08:30:00Z'
      },
      {
        id: 'STAFF-002',
        name: 'Mary Wanjiku',
        email: 'mary.wanjiku@company.com',
        phone: '+254723456789',
        role: 'Inventory Clerk',
        department: 'Warehouse',
        hireDate: '2024-06-20T00:00:00Z',
        status: 'ACTIVE',
        salary: 45000,
        manager: 'John Kamau',
        permissions: ['inventory_read', 'inventory_write'],
        lastLogin: '2025-01-18T16:45:00Z'
      },
      {
        id: 'STAFF-003',
        name: 'Peter Ochieng',
        email: 'peter.ochieng@company.com',
        phone: '+254734567890',
        role: 'Sales Associate',
        department: 'Sales',
        hireDate: '2024-08-10T00:00:00Z',
        status: 'ON_LEAVE',
        salary: 38000,
        manager: 'John Kamau',
        permissions: ['orders_read', 'customers_read'],
        lastLogin: '2025-01-15T12:20:00Z'
      }
    ];

    setStaff(mockStaff);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100';
      case 'INACTIVE': return 'text-red-600 bg-red-100';
      case 'ON_LEAVE': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleStaffStatus = (staffId: string) => {
    setStaff(prev => prev.map(member => 
      member.id === staffId 
        ? { ...member, status: member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
        : member
    ));
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
          <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
          <p className="text-gray-600">Manage team members and their access permissions</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Staff
        </button>
      </div>

      {/* Staff Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Staff</p>
              <p className="text-2xl font-bold text-gray-900">
                {staff.filter(s => s.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">On Leave</p>
              <p className="text-2xl font-bold text-gray-900">
                {staff.filter(s => s.status === 'ON_LEAVE').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Departments</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(staff.map(s => s.department)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role & Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hire Date
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
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserIcon className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{member.role}</div>
                  <div className="text-sm text-gray-500">{member.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    {member.email}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    {member.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(member.hireDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedStaff(member);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="View Details"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-800 p-1"
                      title="Edit Staff"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => toggleStaffStatus(member.id)}
                      className={`p-1 ${member.status === 'ACTIVE' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                      title={member.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    >
                      {member.status === 'ACTIVE' ? <XCircleIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Staff Details Modal */}
      {showModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Staff Details - {selectedStaff.name}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedStaff.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedStaff.phone}
                    </div>
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      Hired: {new Date(selectedStaff.hireDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Work Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>Role: {selectedStaff.role}</div>
                    <div>Department: {selectedStaff.department}</div>
                    <div>Manager: {selectedStaff.manager}</div>
                    <div>Salary: KES {selectedStaff.salary.toLocaleString()}</div>
                    <div>Status: {selectedStaff.status.replace('_', ' ')}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStaff.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {permission.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Activity</h4>
                <div className="text-sm text-gray-600">
                  Last Login: {new Date(selectedStaff.lastLogin).toLocaleString()}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
