'use client';

import { useState, useEffect } from 'react';
import {
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: string;
  deliveryAddress: string;
  trackingNumber?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        customerName: 'John Kamau',
        customerEmail: 'john.kamau@email.com',
        items: [
          { name: 'Maize Flour 2kg', quantity: 2, price: 150 },
          { name: 'Cooking Oil 1L', quantity: 1, price: 280 }
        ],
        total: 580,
        status: 'PROCESSING',
        paymentMethod: 'M-Pesa',
        paymentStatus: 'PAID',
        createdAt: '2025-01-19T10:30:00Z',
        deliveryAddress: 'Nairobi, Kenya',
        trackingNumber: 'TRK001'
      },
      {
        id: 'ORD-002',
        customerName: 'Mary Wanjiku',
        customerEmail: 'mary.wanjiku@email.com',
        items: [
          { name: 'Rice 5kg', quantity: 1, price: 450 },
          { name: 'Sugar 2kg', quantity: 1, price: 200 }
        ],
        total: 650,
        status: 'SHIPPED',
        paymentMethod: 'M-Pesa',
        paymentStatus: 'PAID',
        createdAt: '2025-01-18T14:15:00Z',
        deliveryAddress: 'Mombasa, Kenya',
        trackingNumber: 'TRK002'
      },
      {
        id: 'ORD-003',
        customerName: 'Peter Ochieng',
        customerEmail: 'peter.ochieng@email.com',
        items: [
          { name: 'Wheat Flour 2kg', quantity: 3, price: 180 }
        ],
        total: 540,
        status: 'PENDING',
        paymentMethod: 'Cash',
        paymentStatus: 'PENDING',
        createdAt: '2025-01-19T08:45:00Z',
        deliveryAddress: 'Kisumu, Kenya'
      }
    ];

    setOrders(mockOrders);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'PROCESSING': return 'text-blue-600 bg-blue-100';
      case 'SHIPPED': return 'text-purple-600 bg-purple-100';
      case 'DELIVERED': return 'text-green-600 bg-green-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <ClockIcon className="h-4 w-4" />;
      case 'PROCESSING': return <ClockIcon className="h-4 w-4" />;
      case 'SHIPPED': return <TruckIcon className="h-4 w-4" />;
      case 'DELIVERED': return <CheckCircleIcon className="h-4 w-4" />;
      case 'CANCELLED': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
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
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {orders.filter(o => o.status === 'PENDING').length} pending orders
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  KES {order.total.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">{order.paymentMethod}</div>
                    <div className={`text-sm ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.paymentStatus}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="View Details"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="text-gray-600 hover:text-gray-800 p-1"
                      title="Print Order"
                    >
                      <PrinterIcon className="h-5 w-5" />
                    </button>
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Start Processing"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Details - {selectedOrder.id}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Customer Information</h4>
                  <p className="text-sm text-gray-600">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Delivery Address</h4>
                  <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2 text-sm">{item.name}</td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm">KES {item.price}</td>
                          <td className="px-4 py-2 text-sm">KES {item.quantity * item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-sm font-medium text-right">Total:</td>
                        <td className="px-4 py-2 text-sm font-medium">KES {selectedOrder.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {selectedOrder.trackingNumber && (
                <div>
                  <h4 className="font-medium text-gray-900">Tracking Information</h4>
                  <p className="text-sm text-gray-600">Tracking Number: {selectedOrder.trackingNumber}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Print Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
