'use client';

import { useState, useEffect } from 'react';
import {
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PlayIcon,
  StopIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

interface BackupJob {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  startTime: string;
  endTime?: string;
  size: string;
  location: string;
  progress?: number;
}

interface BackupSchedule {
  id: string;
  name: string;
  type: 'full' | 'incremental';
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  enabled: boolean;
  lastRun?: string;
  nextRun: string;
}

const mockBackupJobs: BackupJob[] = [
  {
    id: '1',
    name: 'Daily Full Backup',
    type: 'full',
    status: 'completed',
    startTime: '2024-01-15T02:00:00Z',
    endTime: '2024-01-15T03:45:00Z',
    size: '2.4 GB',
    location: 'AWS S3 - backup-bucket/daily/2024-01-15'
  },
  {
    id: '2',
    name: 'Incremental Backup',
    type: 'incremental',
    status: 'running',
    startTime: '2024-01-15T14:00:00Z',
    size: '156 MB',
    location: 'AWS S3 - backup-bucket/incremental/2024-01-15-14',
    progress: 65
  },
  {
    id: '3',
    name: 'Weekly Archive',
    type: 'full',
    status: 'failed',
    startTime: '2024-01-14T01:00:00Z',
    endTime: '2024-01-14T01:15:00Z',
    size: '0 MB',
    location: 'AWS S3 - backup-bucket/weekly/2024-01-14'
  }
];

const mockSchedules: BackupSchedule[] = [
  {
    id: '1',
    name: 'Daily Full Backup',
    type: 'full',
    frequency: 'daily',
    time: '02:00',
    enabled: true,
    lastRun: '2024-01-15T02:00:00Z',
    nextRun: '2024-01-16T02:00:00Z'
  },
  {
    id: '2',
    name: 'Hourly Incremental',
    type: 'incremental',
    frequency: 'daily',
    time: '00:00',
    enabled: true,
    lastRun: '2024-01-15T14:00:00Z',
    nextRun: '2024-01-15T15:00:00Z'
  },
  {
    id: '3',
    name: 'Weekly Archive',
    type: 'full',
    frequency: 'weekly',
    time: '01:00',
    enabled: false,
    nextRun: '2024-01-21T01:00:00Z'
  }
];

export default function BackupPage() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [backupJobs, setBackupJobs] = useState<BackupJob[]>(mockBackupJobs);
  const [schedules, setSchedules] = useState<BackupSchedule[]>(mockSchedules);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'running':
        return <PlayIcon className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'scheduled':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'running':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'scheduled':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const startManualBackup = async (type: 'full' | 'incremental') => {
    setIsCreatingBackup(true);
    
    const newJob: BackupJob = {
      id: Date.now().toString(),
      name: `Manual ${type} Backup`,
      type,
      status: 'running',
      startTime: new Date().toISOString(),
      size: '0 MB',
      location: `AWS S3 - backup-bucket/manual/${new Date().toISOString().split('T')[0]}`,
      progress: 0
    };

    setBackupJobs(prev => [newJob, ...prev]);
    
    // Simulate backup progress
    const progressInterval = setInterval(() => {
      setBackupJobs(prev => prev.map(job => {
        if (job.id === newJob.id && job.status === 'running') {
          const newProgress = (job.progress || 0) + Math.random() * 20;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return {
              ...job,
              status: 'completed',
              endTime: new Date().toISOString(),
              size: `${(Math.random() * 2 + 0.5).toFixed(1)} GB`,
              progress: 100
            };
          }
          return { ...job, progress: newProgress };
        }
        return job;
      }));
    }, 1000);

    setTimeout(() => {
      setIsCreatingBackup(false);
    }, 2000);
  };

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule
    ));
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (start: string, end?: string) => {
    if (!end) return 'In progress...';
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Backup & Recovery</h2>
          <p className="text-gray-600">Manage system backups and data recovery</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => startManualBackup('incremental')}
            disabled={isCreatingBackup}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            Incremental Backup
          </button>
          <button
            onClick={() => startManualBackup('full')}
            disabled={isCreatingBackup}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            Full Backup
          </button>
        </div>
      </div>

      {/* Backup Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Successful Backups</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <XCircleIcon className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed Backups</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <CloudArrowDownIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Storage</p>
              <p className="text-2xl font-bold text-gray-900">45.2 GB</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Backup</p>
              <p className="text-2xl font-bold text-gray-900">2h ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`${
                activeTab === 'jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Backup Jobs
            </button>
            <button
              onClick={() => setActiveTab('schedules')}
              className={`${
                activeTab === 'schedules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Schedules
            </button>
            <button
              onClick={() => setActiveTab('recovery')}
              className={`${
                activeTab === 'recovery'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Recovery
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Backup Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Backup Jobs</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {backupJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(job.status)}
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              {job.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {job.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(job.status)}>
                            {job.status}
                          </span>
                          {job.status === 'running' && job.progress && (
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${job.progress}%` }}
                              ></div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTimestamp(job.startTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {calculateDuration(job.startTime, job.endTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {job.size}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div className="truncate" title={job.location}>
                            {job.location}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Schedules Tab */}
          {activeTab === 'schedules' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Backup Schedules</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Add Schedule
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-medium text-gray-900">{schedule.name}</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={schedule.enabled}
                          onChange={() => toggleSchedule(schedule.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{schedule.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frequency:</span>
                        <span className="font-medium">{schedule.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{schedule.time}</span>
                      </div>
                      {schedule.lastRun && (
                        <div className="flex justify-between">
                          <span>Last Run:</span>
                          <span className="font-medium">{formatTimestamp(schedule.lastRun)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Next Run:</span>
                        <span className="font-medium">{formatTimestamp(schedule.nextRun)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recovery Tab */}
          {activeTab === 'recovery' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Data Recovery</h3>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Recovery Operations
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Data recovery operations should be performed with caution. Always verify backup integrity before proceeding with recovery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Point-in-Time Recovery</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recovery Point
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recovery Target
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option>Full Database</option>
                        <option>Specific Tables</option>
                        <option>User Data Only</option>
                      </select>
                    </div>
                    <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                      Start Recovery
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Backup Restore</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Backup
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option>Daily Full Backup - 2024-01-15</option>
                        <option>Weekly Archive - 2024-01-14</option>
                        <option>Monthly Backup - 2024-01-01</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Restore Location
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option>Production Database</option>
                        <option>Staging Environment</option>
                        <option>Development Environment</option>
                      </select>
                    </div>
                    <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Restore Backup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
