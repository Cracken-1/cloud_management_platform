'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  UsersIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth/auth-context';
import { tenantService } from '@/lib/tenant/tenant-service';
import DynamicDashboard from '@/components/admin/dynamic-dashboard';

interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  inventoryAlerts: number;
  mpesaTransactions: number;
  mpesaAmount: number;
}

interface InventoryAlert {
  id: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  predictedDemand: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalCustomers: 0,
    customersChange: 0,
    inventoryAlerts: 0,
    mpesaTransactions: 0,
    mpesaAmount: 0
  });

  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantConfig, setTenantConfig] = useState<any>(null);
  const [needsSetup, setNeedsSetup] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    checkTenantSetup();
  }, [user]);

  const checkTenantSetup = async () => {
    if (!user) return;

    try {
      // Check if user has a tenant configured
      const userProfile = await fetch('/api/user/profile').then(res => res.json());
      
      if (!userProfile.tenant_id) {
        setNeedsSetup(true);
        setLoading(false);
        return;
      }

      // Load tenant configuration
      const config = await tenantService.getTenantConfiguration(userProfile.tenant_id);
      if (config) {
        setTenantConfig(config);
        loadDashboardData();
      } else {
        setNeedsSetup(true);
      }
    } catch (error) {
      console.error('Failed to check tenant setup:', error);
      setNeedsSetup(true);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Simulate API calls - replace with actual API endpoints
      const mockStats: DashboardStats = {
        totalRevenue: 2847500,
        revenueChange: 12.5,
        totalOrders: 1247,
        ordersChange: 8.2,
        totalCustomers: 3456,
        customersChange: 15.3,
        inventoryAlerts: 23,
        mpesaTransactions: 892,
        mpesaAmount: 1456780
      };

      const mockAlerts: InventoryAlert[] = [
        {
          id: '1',
          productName: 'Maize Flour 2kg',
          currentStock: 15,
          reorderPoint: 50,
          predictedDemand: 120,
          riskLevel: 'HIGH'
        },
        {
          id: '2',
          productName: 'Cooking Oil 1L',
          currentStock: 35,
          reorderPoint: 40,
          predictedDemand: 80,
          riskLevel: 'MEDIUM'
        },
        {
          id: '3',
          productName: 'Rice 5kg',
          currentStock: 8,
          reorderPoint: 25,
          predictedDemand: 60,
          riskLevel: 'HIGH'
        }
      ];

      const mockOrders: RecentOrder[] = [
        {
          id: 'ORD-001',
          customerName: 'John Kamau',
          amount: 2450,
          status: 'Completed',
          paymentMethod: 'M-Pesa',
          createdAt: '2025-01-19T10:30:00Z'
        },
        {
          id: 'ORD-002',
          customerName: 'Mary Wanjiku',
          amount: 1890,
          status: 'Processing',
          paymentMethod: 'M-Pesa',
          createdAt: '2025-01-19T09:15:00Z'
        },
        {
          id: 'ORD-003',
          customerName: 'Peter Ochieng',
          amount: 3200,
          status: 'Pending',
          paymentMethod: 'Cash',
          createdAt: '2025-01-19T08:45:00Z'
        }
      ];

      setStats(mockStats);
      setInventoryAlerts(mockAlerts);
      setRecentOrders(mockOrders);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'text-red-600 bg-red-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Cloud Management Platform
          </h2>
          <p className="text-gray-600 mb-6">
            Let&apos;s set up your personalized dashboard by analyzing your company website.
          </p>
          <button
            onClick={() => router.push('/admin/setup')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Setup
          </button>
        </div>
      </div>
    );
  }

  // If tenant is configured, show dynamic dashboard
  if (tenantConfig) {
    return <DynamicDashboard tenantId={tenantConfig.id} />;
  }

  // Fallback to original PandaMart dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              PandaMart Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">
                    +{stats.revenueChange}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCartIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">
                    +{stats.ordersChange}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customers Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">
                    +{stats.customersChange}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* M-Pesa Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TruckIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">M-Pesa Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.mpesaAmount)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.mpesaTransactions} transactions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inventory Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Inventory Alerts ({stats.inventoryAlerts})
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {inventoryAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{alert.productName}</h3>
                      <p className="text-sm text-gray-600">
                        Stock: {alert.currentStock} | Reorder: {alert.reorderPoint} | Demand: {alert.predictedDemand}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(alert.riskLevel)}`}>
                      {alert.riskLevel}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full text-center text-blue-600 hover:text-blue-800 font-medium">
                View All Alerts
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{order.customerName}</h3>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.amount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600">
                          {order.id} • {order.paymentMethod}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full text-center text-blue-600 hover:text-blue-800 font-medium">
                View All Orders
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">View Analytics</span>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingCartIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Manage Products</span>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <UsersIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Customer Support</span>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <TruckIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Delivery Routes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}