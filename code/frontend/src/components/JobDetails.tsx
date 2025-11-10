import React, { useState, useEffect } from "react";
import "./JobDetails.css";

interface JobDetailsProps {
  jobId: string;
  onBack: () => void;
}

interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDays: number;
  description: string;
  requirements: string[];
  benefits: string[];
  matchedSkills?: string[];
  missingSkills?: string[];
  suggestedCourses?: any[];
}

export default function JobDetails({ jobId, onBack }: JobDetailsProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/api/jobs/${jobId}`);
        const data = await response.json();
        if (data.success && data.job) {
          setJob(data.job);
        } else {
          setError(data.error || "Job not found");
        }
      } catch (err) {
        setError("Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return <div className="job-details-container">Loading job details...</div>;
  }
  if (error || !job) {
    return (
      <div className="job-details-container">
        <p>{error || "Job not found"}</p>
        <button
          onClick={onBack}
          style={{
            marginTop: "16px",
            padding: "8px 20px",
            background: "#4a7cff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      className="job-details-container"
      style={{ background: "#f5f7fa", color: "#222", minHeight: "100vh" }}
    >
      <button
        onClick={onBack}
        style={{
          marginBottom: "18px",
          background: "none",
          border: "none",
          color: "#4a7cff",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        &larr; Back
      </button>
      <div className="job-title" style={{ color: "#2a3a5a" }}>
        {job.title}
      </div>
      <div className="job-meta" style={{ color: "#4a4a6a" }}>
        <span>{job.company}</span>
        <span>{job.location}</span>
        <span>Posted {job.postedDays} days ago</span>
      </div>
      <div className="job-salary" style={{ color: "#4a7cff" }}>
        {job.salary}
      </div>
      <div className="job-type" style={{ color: "#7a7a9a" }}>
        {job.type}
      </div>
      <div
        className="job-description"
        style={{ color: "#222", marginBottom: "22px" }}
      >
        {job.description}
      </div>
      <div className="job-section">
        <div className="job-section-title">Requirements</div>
        <div className="job-list">
          {job.requirements.map((req: string) => (
            <span className="job-list-item" key={req}>
              {req}
            </span>
          ))}
        </div>
      </div>
      <div className="job-section">
        <div className="job-section-title">Benefits</div>
        <div className="job-benefits">
          {job.benefits.map((ben: string) => (
            <span className="job-benefit-item" key={ben}>
              {ben}
            </span>
          ))}
        </div>
      </div>
      {job.matchedSkills && (
        <div className="job-section">
          <div className="job-section-title">Matched Skills</div>
          <div className="job-list">
            {job.matchedSkills.map((skill: string) => (
              <span className="job-list-item" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      {job.missingSkills && (
        <div className="job-section">
          <div className="job-section-title">Missing Skills</div>
          <div className="job-list">
            {job.missingSkills.map((skill: string) => (
              <span className="job-list-item" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      <button className="job-apply-btn">Apply Now</button>
    </div>
  );
}
