'use client';

import { useState, useEffect } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  joinedDate: string;
  loyaltyPoints: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCustomers: Customer[] = [
      {
        id: 'CUST-001',
        name: 'John Kamau',
        email: 'john.kamau@email.com',
        phone: '+254712345678',
        address: 'Nairobi, Kenya',
        totalOrders: 15,
        totalSpent: 8750,
        lastOrderDate: '2025-01-19T10:30:00Z',
        status: 'ACTIVE',
        joinedDate: '2024-06-15T00:00:00Z',
        loyaltyPoints: 875
      },
      {
        id: 'CUST-002',
        name: 'Mary Wanjiku',
        email: 'mary.wanjiku@email.com',
        phone: '+254723456789',
        address: 'Mombasa, Kenya',
        totalOrders: 8,
        totalSpent: 4200,
        lastOrderDate: '2025-01-18T14:15:00Z',
        status: 'ACTIVE',
        joinedDate: '2024-08-20T00:00:00Z',
        loyaltyPoints: 420
      },
      {
        id: 'CUST-003',
        name: 'Peter Ochieng',
        email: 'peter.ochieng@email.com',
        phone: '+254734567890',
        address: 'Kisumu, Kenya',
        totalOrders: 3,
        totalSpent: 1650,
        lastOrderDate: '2025-01-10T08:45:00Z',
        status: 'INACTIVE',
        joinedDate: '2024-11-05T00:00:00Z',
        loyaltyPoints: 165
      }
    ];

    setCustomers(mockCustomers);
    setLoading(false);
  }, []);

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 10000) return { tier: 'Platinum', color: 'text-purple-600 bg-purple-100' };
    if (totalSpent >= 5000) return { tier: 'Gold', color: 'text-yellow-600 bg-yellow-100' };
    if (totalSpent >= 2000) return { tier: 'Silver', color: 'text-gray-600 bg-gray-100' };
    return { tier: 'Bronze', color: 'text-orange-600 bg-orange-100' };
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
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600">Manage customer relationships and data</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {customers.filter(c => c.status === 'ACTIVE').length} active customers
          </div>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                KES {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                KES {Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tier
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
            {customers.map((customer) => {
              const tierInfo = getCustomerTier(customer.totalSpent);
              return (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserIcon className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {customer.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.totalOrders} orders</div>
                    <div className="text-sm text-gray-500">
                      Last: {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    KES {customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tierInfo.color}`}>
                      {tierInfo.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === 'ACTIVE' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800 p-1"
                        title="Edit Customer"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Customer Details - {selectedCustomer.name}</h3>
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
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedCustomer.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedCustomer.phone}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedCustomer.address}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Account Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div>Joined: {new Date(selectedCustomer.joinedDate).toLocaleDateString()}</div>
                    <div>Total Orders: {selectedCustomer.totalOrders}</div>
                    <div>Total Spent: KES {selectedCustomer.totalSpent.toLocaleString()}</div>
                    <div>Loyalty Points: {selectedCustomer.loyaltyPoints}</div>
                    <div>Status: {selectedCustomer.status}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Customer Tier</h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCustomerTier(selectedCustomer.totalSpent).color}`}>
                  {getCustomerTier(selectedCustomer.totalSpent).tier} Customer
                </span>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
