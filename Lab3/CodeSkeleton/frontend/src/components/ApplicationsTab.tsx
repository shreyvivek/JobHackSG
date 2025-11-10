import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Calendar, Edit3, Plus, Building, Clock } from 'lucide-react';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'applied' | 'reviewing' | 'interview' | 'rejected' | 'offer';
  notes: string;
  nextStep?: string;
  interviewDate?: string;
}

export default function ApplicationsTab() {
  const [notes, setNotes] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      jobTitle: 'Frontend Developer',
      company: 'TechCorp',
      appliedDate: '2024-08-24',
      status: 'interview',
      notes: 'Great team culture, remote-friendly. Technical interview scheduled.',
      nextStep: 'Technical Interview',
      interviewDate: '2024-08-28'
    },
    {
      id: '2',
      jobTitle: 'Full Stack Engineer',
      company: 'StartupXYZ',
      appliedDate: '2024-08-22',
      status: 'reviewing',
      notes: 'Interesting product in fintech space. Waiting for response.',
    },
    {
      id: '3',
      jobTitle: 'React Developer',
      company: 'WebSolutions',
      appliedDate: '2024-08-20',
      status: 'rejected',
      notes: 'Feedback: Looking for more senior experience. Good learning opportunity.',
    },
    {
      id: '4',
      jobTitle: 'Software Engineer',
      company: 'BigTech Inc',
      appliedDate: '2024-08-18',
      status: 'applied',
      notes: 'Dream company! Applied through referral.',
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'offer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'applied': return 'Applied';
      case 'reviewing': return 'Under Review';
      case 'interview': return 'Interview';
      case 'rejected': return 'Rejected';
      case 'offer': return 'Offer';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const [newApp, setNewApp] = useState({
    jobTitle: '',
    company: '',
    appliedDate: '',
    notes: ''
  });

  const handleAddApplication = () => {
    const newApplication: Application = {
      id: Date.now().toString(),
      jobTitle: newApp.jobTitle,
      company: newApp.company,
      appliedDate: newApp.appliedDate,
      status: 'applied',
      notes: newApp.notes,
    };
    setApplications([...applications, newApplication]);
    setNewApp({ jobTitle: '', company: '', appliedDate: '', notes: '' });
    setShowAddDialog(false);
  };

  const handleSaveNotes = (id: string, updatedNotes: string) => {
    setApplications(applications.map(app =>
      app.id === id ? { ...app, notes: updatedNotes } : app
    ));
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mb-2">My Applications</h1>
          <p className="text-sm text-muted-foreground">{applications.length} applications tracked</p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log New Application</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input 
                placeholder="Job Title" 
                value={newApp.jobTitle}
                onChange={(e) => setNewApp({ ...newApp, jobTitle: e.target.value })}
              />
              <Input 
                placeholder="Company" 
                value={newApp.company}
                onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
              />
              <Input 
                type="date"
                value={newApp.appliedDate}
                onChange={(e) => setNewApp({ ...newApp, appliedDate: e.target.value })}
              />
              <Textarea 
                placeholder="Notes (optional)"
                value={newApp.notes}
                onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
              />
              <Button className="w-full" onClick={handleAddApplication}>
                Save Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-1">{app.jobTitle}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Building className="w-4 h-4" />
                    <span>{app.company}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Applied {formatDate(app.appliedDate)}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(app.status)}>
                  {getStatusLabel(app.status)}
                </Badge>
              </div>

              {app.interviewDate && (
                <div className="bg-purple-50 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-purple-800">
                    <Clock className="w-4 h-4" />
                    <span>
                      {app.nextStep} on {formatDate(app.interviewDate)}
                    </span>
                  </div>
                </div>
              )}

              {app.notes && (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">{app.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Notes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Application Notes</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {app.jobTitle} at {app.company}
                        </p>
                      </div>
                      <Textarea 
                        defaultValue={app.notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about this application..."
                        rows={4}
                      />
                      <Button className="w-full" onClick={() => handleSaveNotes(app.id, notes)}>
                        Save Notes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
