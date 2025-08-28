'use client';

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  category: 'auth' | 'user_management' | 'inventory' | 'orders' | 'settings' | 'security';
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00Z',
    userId: 'admin-001',
    userName: 'John Admin',
    action: 'PASSWORD_RESET_APPROVED',
    resource: 'password_reset_request',
    resourceId: 'pr-123',
    details: 'Approved password reset request for user jane.doe@pandamart.co.ke',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'success',
    category: 'security'
  },
  {
    id: '2',
    timestamp: '2024-01-15T10:25:00Z',
    userId: 'admin-001',
    userName: 'John Admin',
    action: 'USER_STATUS_CHANGED',
    resource: 'user',
    resourceId: 'user-456',
    details: 'Deactivated user account for mike.wilson@pandamart.co.ke',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'warning',
    category: 'user_management'
  },
  {
    id: '3',
    timestamp: '2024-01-15T10:20:00Z',
    userId: 'system',
    userName: 'System',
    action: 'FAILED_LOGIN_ATTEMPT',
    resource: 'authentication',
    details: 'Multiple failed login attempts detected from IP 203.0.113.42',
    ipAddress: '203.0.113.42',
    userAgent: 'curl/7.68.0',
    severity: 'error',
    category: 'auth'
  },
  {
    id: '4',
    timestamp: '2024-01-15T10:15:00Z',
    userId: 'admin-002',
    userName: 'Sarah Manager',
    action: 'INVENTORY_UPDATED',
    resource: 'product',
    resourceId: 'prod-789',
    details: 'Updated stock quantity for "Premium Coffee Beans" from 150 to 200 units',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    severity: 'info',
    category: 'inventory'
  },
  {
    id: '5',
    timestamp: '2024-01-15T10:10:00Z',
    userId: 'admin-001',
    userName: 'John Admin',
    action: 'SETTINGS_UPDATED',
    resource: 'system_settings',
    details: 'Updated M-Pesa integration settings',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'info',
    category: 'settings'
  },
  {
    id: '6',
    timestamp: '2024-01-15T10:05:00Z',
    userId: 'admin-003',
    userName: 'David Staff',
    action: 'ORDER_STATUS_CHANGED',
    resource: 'order',
    resourceId: 'ord-321',
    details: 'Changed order #ORD-2024-001 status from "Processing" to "Shipped"',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'success',
    category: 'orders'
  }
];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    filterLogs();
  }, [searchTerm, selectedCategory, selectedSeverity, dateRange, logs]);

  const filterLogs = () => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    // Severity filter
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(log => log.severity === selectedSeverity);
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return logDate >= startDate && logDate <= endDate;
      });
    }

    setFilteredLogs(filtered);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (severity) {
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'success':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-800`;
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'Severity', 'Category', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.userName,
        log.action,
        log.resource,
        `"${log.details}"`,
        log.severity,
        log.category,
        log.ipAddress
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
          <p className="text-gray-600">Track all system activities and user actions</p>
        </div>
        <button
          onClick={exportLogs}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search actions, users, or details..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="auth">Authentication</option>
              <option value="user_management">User Management</option>
              <option value="inventory">Inventory</option>
              <option value="orders">Orders</option>
              <option value="settings">Settings</option>
              <option value="security">Security</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">
              Showing {filteredLogs.length} of {logs.length} audit logs
            </span>
          </div>
          {(searchTerm || selectedCategory !== 'all' || selectedSeverity !== 'all' || dateRange.start || dateRange.end) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedSeverity('all');
                setDateRange({ start: '', end: '' });
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                    <div className="text-sm text-gray-500">{log.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getSeverityIcon(log.severity)}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.resource}
                    {log.resourceId && (
                      <div className="text-xs text-gray-500">ID: {log.resourceId}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                    <div className="truncate" title={log.details}>
                      {log.details}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getSeverityBadge(log.severity)}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
