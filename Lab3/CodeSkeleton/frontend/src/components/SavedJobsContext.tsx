import React, { createContext, useContext, useState, ReactNode } from "react";

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

export const SavedJobsProvider = ({ children }: { children: ReactNode }) => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

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
