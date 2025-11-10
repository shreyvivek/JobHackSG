import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { RefreshCw, Database, Users, Briefcase, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SystemStats {
  totalJobs: number;
  activeUsers: number;
  lastSync: string;
  syncStatus: 'success' | 'error' | 'syncing';
  errorCount: number;
  apiCalls: number;
  storageUsed: number;
}

const mockStats: SystemStats = {
  totalJobs: 2450,
  activeUsers: 156,
  lastSync: '2024-08-26T14:30:00Z',
  syncStatus: 'success',
  errorCount: 3,
  apiCalls: 1240,
  storageUsed: 67
};

export default function AdminTab() {
  const [isReingesting, setIsReingesting] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  // Add Job form state
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [desc, setDesc] = useState('');

  // Logs state
  const [logs, setLogs] = useState<{ id: string; timestamp: string; status: string; message: string }[]>([]);

  const formatLastSync = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const handleReIngest = async () => {
    setIsReingesting(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReingesting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !desc) return;

    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      status: 'success',
      message: `New job posted: ${title} @ ${company}`
    };

    setLogs([newLog, ...logs]);
    setTitle('');
    setCompany('');
    setDesc('');
  };

  const handleSync = () => {
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      status: 'info',
      message: 'Ingestion run started'
    };
    setLogs([newLog, ...logs]);
  };

  const getSeverityColor = (status: string) => {
    switch (status) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="text-center mb-6">
        <h1 className="mb-2">System Administration</h1>
        <p className="text-muted-foreground">Monitor and manage the job search platform</p>
      </div>

      {/* System Overview */}
      <Card className="p-4">
        <h3 className="mb-4">System Overview</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span className="text-2xl">{mockStats.totalJobs.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Jobs</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-2xl">{mockStats.activeUsers}</span>
            </div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>
        </div>
      </Card>

      {/* Sync Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3>Data Synchronization</h3>
          <div className="flex items-center gap-2">
            {mockStats.syncStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
            {mockStats.syncStatus === 'error' && <AlertTriangle className="w-4 h-4 text-red-600" />}
            {mockStats.syncStatus === 'syncing' && <Clock className="w-4 h-4 text-blue-600" />}
            <Badge className={
              mockStats.syncStatus === 'success' ? 'bg-green-100 text-green-800' :
              mockStats.syncStatus === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }>
              {mockStats.syncStatus === 'success' ? 'Healthy' :
               mockStats.syncStatus === 'error' ? 'Error' : 'Syncing'}
            </Badge>
          </div>
        </div>

        {isReingesting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Re-ingesting data...</span>
              <span>{syncProgress}%</span>
            </div>
            <Progress value={syncProgress} className="w-full" />
          </div>
        )}

        <Separator className="my-4" />

        <Button 
          className="w-full" 
          onClick={handleReIngest}
          disabled={isReingesting}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isReingesting ? 'animate-spin' : ''}`} />
          {isReingesting ? 'Re-ingesting...' : 'Re-ingest Now'}
        </Button>
      </Card>

      {/* Add Job Form */}
      <Card className="p-4">
        <h2 className="font-bold mb-2">Add Job Posting</h2>
        <form onSubmit={handleAddJob} className="space-y-2">
          <input className="border p-1 w-full" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="border p-1 w-full" placeholder="Company" value={company} onChange={e=>setCompany(e.target.value)} />
          <textarea className="border p-1 w-full" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Submit</button>
        </form>
      </Card>

      {/* Ingestion Logs */}
      <Card className="p-4">
        <h2 className="font-bold mb-2">Ingestion Logs</h2>
        <Button onClick={handleSync} className="mb-3">Run Ingestion</Button>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No logs yet.</p>
        ) : (
          <ul>
            {logs.map(l => (
              <li key={l.id} className="border p-2 mb-2 rounded">
                <span className={`px-2 py-1 text-xs rounded ${getSeverityColor(l.status)}`}>
                  {l.status}
                </span>{' '}
                {l.timestamp} – {l.message}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
