'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  orders: {
    current: number;
    previous: number;
    change: number;
  };
  customers: {
    current: number;
    previous: number;
    change: number;
  };
  conversionRate: {
    current: number;
    previous: number;
    change: number;
  };
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  salesByMonth: Array<{
    month: string;
    sales: number;
    orders: number;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // Mock analytics data
    const mockData: AnalyticsData = {
      revenue: {
        current: 125430,
        previous: 98750,
        change: 27.0
      },
      orders: {
        current: 1247,
        previous: 1089,
        change: 14.5
      },
      customers: {
        current: 3456,
        previous: 3201,
        change: 8.0
      },
      conversionRate: {
        current: 3.2,
        previous: 2.8,
        change: 14.3
      },
      topProducts: [
        { name: 'Maize Flour 2kg', sales: 450, revenue: 67500 },
        { name: 'Cooking Oil 1L', sales: 320, revenue: 89600 },
        { name: 'Rice 5kg', sales: 280, revenue: 126000 },
        { name: 'Sugar 2kg', sales: 210, revenue: 42000 },
        { name: 'Wheat Flour 2kg', sales: 180, revenue: 32400 }
      ],
      salesByMonth: [
        { month: 'Jan', sales: 125430, orders: 1247 },
        { month: 'Dec', sales: 98750, orders: 1089 },
        { month: 'Nov', sales: 87650, orders: 956 },
        { month: 'Oct', sales: 92340, orders: 1023 },
        { month: 'Sep', sales: 78900, orders: 876 },
        { month: 'Aug', sales: 85670, orders: 945 }
      ]
    };

    setData(mockData);
    setLoading(false);
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change > 0 ? (
          <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
        )} <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.revenue.current)}</p>
              {formatChange(data.revenue.change)}
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{data.orders.current.toLocaleString()}</p>
              {formatChange(data.orders.change)}
            </div>
            <ShoppingCartIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{data.customers.current.toLocaleString()}</p>
              {formatChange(data.customers.change)}
            </div>
            <UsersIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.conversionRate.current}%</p>
              {formatChange(data.conversionRate.change)}
            </div>
            <ChartBarIcon className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <div className="space-y-4">
            {data.salesByMonth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">{item.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(item.sales / Math.max(...data.salesByMonth.map(d => d.sales))) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.sales)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-4">
            {data.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.sales} units sold</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(product.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">KES 1,247</div>
            <div className="text-sm text-gray-600">Average Order Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="text-sm text-gray-600">Customer Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">2.3 days</div>
            <div className="text-sm text-gray-600">Average Delivery Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
