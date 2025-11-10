import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  sector: string;
  savedDate: string;
}

interface SavedJobsContextType {
  savedJobs: SavedJob[];
  addJob: (job: Omit<SavedJob, "savedDate">) => void;
  removeJob: (id: string) => void;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

// Load saved jobs from localStorage
const loadSavedJobs = (): SavedJob[] => {
  const saved = localStorage.getItem('savedJobs');
  return saved ? JSON.parse(saved) : [];
};

export const SavedJobsProvider = ({ children }: { children: ReactNode }) => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(loadSavedJobs());

  // Save to localStorage whenever savedJobs changes
  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    
    // Also save to backend if available
    const saveToBackend = async () => {
      try {
        // Assuming user ID 1 for now - in a real app, you'd get this from auth
        const userId = 1;
        
        // For each job, send a request to the backend
        savedJobs.forEach(async (job) => {
          await fetch(`http://localhost:8080/api/jobs/save`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userId,
              jobId: job.id
            }),
          });
        });
      } catch (error) {
        console.error('Failed to save jobs to backend:', error);
        // Continue with local storage even if backend fails
      }
    };
    
    saveToBackend();
  }, [savedJobs]);

  const addJob = (job: Omit<SavedJob, "savedDate">) => {
    setSavedJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) return prev; // no duplicates
      return [...prev, { ...job, savedDate: new Date().toISOString() }];
    });
  };

  const removeJob = (id: string) => {
    setSavedJobs((prev) => prev.filter((job) => job.id !== id));
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, addJob, removeJob }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) throw new Error("useSavedJobs must be used inside SavedJobsProvider");
  return context;
};
