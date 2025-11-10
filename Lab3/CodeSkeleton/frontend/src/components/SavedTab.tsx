import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Building, MapPin, Clock } from 'lucide-react';
import { useSavedJobs } from './SavedJobsContext';

export default function SavedTab() {
  const { savedJobs, removeJob } = useSavedJobs();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4 pb-20">
      <h1 className="mb-4">Saved Jobs</h1>
      {savedJobs.length === 0 ? (
        <p className="text-muted-foreground">You haven’t saved any jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <Card key={job.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-1">{job.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Building className="w-4 h-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Clock className="w-3 h-3" />
                  <span>
                    Saved on {job.savedDate ? formatDate(job.savedDate) : "Unknown date"}
                  </span>
                  </div>
                </div>

                {job.sector && (
                  <Badge variant="outline" className="ml-3">
                    {job.sector}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button className="flex-1">View Details</Button>
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => removeJob(job.id)}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
