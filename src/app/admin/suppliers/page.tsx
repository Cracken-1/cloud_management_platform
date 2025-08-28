'use client';

import { useState, useEffect } from 'react';
import {
  BuildingStorefrontIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalValue: number;
  lastOrderDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  paymentTerms: string;
  deliveryTime: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockSuppliers: Supplier[] = [
      {
        id: 'SUP-001',
        name: 'Kenya Grain Suppliers Ltd',
        contactPerson: 'James Mwangi',
        email: 'james@kenyagrain.co.ke',
        phone: '+254712345678',
        address: 'Nakuru, Kenya',
        category: 'Grains & Cereals',
        rating: 4.8,
        totalOrders: 45,
        totalValue: 2340000,
        lastOrderDate: '2025-01-18T00:00:00Z',
        status: 'ACTIVE',
        paymentTerms: 'Net 30',
        deliveryTime: '2-3 days'
      },
      {
        id: 'SUP-002',
        name: 'Fresh Produce Kenya',
        contactPerson: 'Mary Njeri',
        email: 'mary@freshproduce.co.ke',
        phone: '+254723456789',
        address: 'Kiambu, Kenya',
        category: 'Fresh Produce',
        rating: 4.5,
        totalOrders: 32,
        totalValue: 1890000,
        lastOrderDate: '2025-01-17T00:00:00Z',
        status: 'ACTIVE',
        paymentTerms: 'Net 15',
        deliveryTime: '1-2 days'
      },
      {
        id: 'SUP-003',
        name: 'Coastal Oil Mills',
        contactPerson: 'Ahmed Hassan',
        email: 'ahmed@coastaloil.co.ke',
        phone: '+254734567890',
        address: 'Mombasa, Kenya',
        category: 'Oils & Fats',
        rating: 4.2,
        totalOrders: 28,
        totalValue: 1560000,
        lastOrderDate: '2025-01-15T00:00:00Z',
        status: 'ACTIVE',
        paymentTerms: 'Net 45',
        deliveryTime: '3-5 days'
      }
    ];

    setSuppliers(mockSuppliers);
    setLoading(false);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
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
          <h2 className="text-2xl font-bold text-gray-900">Supplier Management</h2>
          <p className="text-gray-600">Manage supplier relationships and performance</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Supplier
        </button>
      </div>

      {/* Supplier Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BuildingStorefrontIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BuildingStorefrontIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BuildingStorefrontIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.reduce((sum, s) => sum + s.totalOrders, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BuildingStorefrontIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                KES {suppliers.reduce((sum, s) => sum + s.totalValue, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
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
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <BuildingStorefrontIcon className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-sm text-gray-500">{supplier.contactPerson}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    {supplier.email}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    {supplier.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {supplier.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {renderStars(supplier.rating)}
                    <span className="ml-2 text-sm text-gray-600">{supplier.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{supplier.totalOrders} orders</div>
                  <div className="text-sm text-gray-500">
                    KES {supplier.totalValue.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    supplier.status === 'ACTIVE' ? 'text-green-600 bg-green-100' : 
                    supplier.status === 'INACTIVE' ? 'text-red-600 bg-red-100' :
                    'text-yellow-600 bg-yellow-100'
                  }`}>
                    {supplier.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="View Details"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-800 p-1"
                      title="Edit Supplier"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Supplier Details Modal */}
      {showModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Supplier Details - {selectedSupplier.name}</h3>
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
                      {selectedSupplier.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedSupplier.phone}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedSupplier.address}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Business Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>Category: {selectedSupplier.category}</div>
                    <div>Payment Terms: {selectedSupplier.paymentTerms}</div>
                    <div>Delivery Time: {selectedSupplier.deliveryTime}</div>
                    <div>Status: {selectedSupplier.status}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedSupplier.totalOrders}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    KES {selectedSupplier.totalValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    {renderStars(selectedSupplier.rating)}
                  </div>
                  <div className="text-sm text-gray-600">Rating: {selectedSupplier.rating}/5</div>
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
                  Edit Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
