'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import {
    UsersIcon,
    ServerIcon,
    ShieldCheckIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function SuperadminDashboard() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ email?: string } | null>(null);
    const [stats, setStats] = useState({
        totalTenants: 0,
        activeTenants: 0,
        totalUsers: 0,
        systemHealth: 'healthy'
    });

    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    router.push('/superadmin/login');
                    return;
                }

                // Verify superadmin role
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('role, is_active')
                    .eq('id', session.user.id)
                    .single();

                if (!profile || profile.role !== 'SUPERADMIN' || !profile.is_active) {
                    router.push('/auth/login');
                    return;
                }

                setUser(session.user);
                // Load dashboard stats here
                setStats({
                    totalTenants: 12,
                    activeTenants: 10,
                    totalUsers: 156,
                    systemHealth: 'healthy'
                });
            } catch (error) {
                console.error('Auth check error:', error);
                router.push('/superadmin/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router, supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                                <ShieldCheckIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">InfinityStack</h1>
                                <p className="text-sm text-gray-400">Superadmin Portal</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-300">
                                Welcome, {user?.email}
                            </span>
                            <button
                                onClick={handleSignOut}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center">
                            <UsersIcon className="h-8 w-8 text-blue-400" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Total Tenants</p>
                                <p className="text-2xl font-bold text-white">{stats.totalTenants}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center">
                            <CheckCircleIcon className="h-8 w-8 text-green-400" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Active Tenants</p>
                                <p className="text-2xl font-bold text-white">{stats.activeTenants}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center">
                            <UsersIcon className="h-8 w-8 text-purple-400" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Total Users</p>
                                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center">
                            <ServerIcon className="h-8 w-8 text-green-400" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">System Health</p>
                                <p className="text-2xl font-bold text-green-400 capitalize">{stats.systemHealth}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Tenant Management</h3>
                        <p className="text-gray-400 mb-4">Manage multi-tenant organizations and their configurations.</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Manage Tenants
                        </button>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">System Configuration</h3>
                        <p className="text-gray-400 mb-4">Configure platform-wide settings and features.</p>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                            System Settings
                        </button>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Analytics & Monitoring</h3>
                        <p className="text-gray-400 mb-4">View platform analytics and system monitoring.</p>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            View Analytics
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}