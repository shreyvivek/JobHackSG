import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatSalary } from "../utils/salaryFormatter";

interface JobPosting {
  jobId: number;
  title: string;
  company: string;
  location: string;
  description: string;
  postedAt: string;
  isActive: boolean;
  salary?: string;
  jobType?: string;
  requiredSkills?: string;
  requirements?: string;
  applyUrl?: string;
}

const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user skills from localStorage
    const savedUser = localStorage.getItem("user");
    let skills: string[] = [];
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        if (Array.isArray(userObj.skills)) {
          skills = userObj.skills.map((s: any) =>
            typeof s === "string" ? s : s.name
          );
        }
      } catch {}
    }
    setUserSkills(skills);

    if (!jobId) return;
    setLoading(true);
    fetch(`http://localhost:8080/api/jobs/${jobId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch job details");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.job) {
          setJob(data.job);
          // Compute missing skills
          const required = data.job.requiredSkills
            ? data.job.requiredSkills.split(",").map((s: string) => s.trim())
            : [];
          const missing = required.filter(
            (skill: string) =>
              !skills.some(
                (userSkill: string) =>
                  userSkill.toLowerCase() === skill.toLowerCase()
              )
          );
          setMissingSkills(missing);
        } else {
          setError(data.error || "Job not found");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [jobId]);

  const onBack = () => {
    navigate(-1);
  };

  if (loading) return <div className="job-details-container">Loading...</div>;
  if (error)
    return (
      <div className="job-details-container" style={{ color: "red" }}>
        {error}
      </div>
    );
  if (!job) return <div className="job-details-container">Job not found.</div>;

  return (
    <div
      className="job-details-container"
      style={{
        background: "#242424ff",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#303030ff",
          borderRadius: "18px",
          boxShadow: "0 4px 24px rgba(60,80,180,0.12)",
          padding: "36px 40px",
          maxWidth: "480px",
          width: "100%",
          color: "white",
        }}
      >
        <button
          onClick={onBack}
          style={{
            marginBottom: "18px",
            background: "#4a7cff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1rem",
            padding: "8px 20px",
            display: "block",
          }}
        >
          &larr; Back
        </button>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "white",
            marginBottom: "8px",
          }}
        >
          {job.title}
        </h1>
        <div
          style={{
            marginBottom: "10px",
            color: "white",
            fontSize: "1.1rem",
          }}
        >
          {job.company} &mdash; {job.location}
        </div>
        <div
          style={{
            marginBottom: "18px",
            color: "#b3b3b3",
            fontSize: "1rem",
          }}
        >
          Posted at: {new Date(job.postedAt).toLocaleString()}
        </div>
        <div
          style={{
            marginBottom: "22px",
            fontSize: "1.08rem",
            color: "#ffffff99",
          }}
        >
          {job.description}
        </div>
        {job.salary && (
          <div
            style={{
              marginBottom: "10px",
              color: "#4a7cff",
              fontSize: "1.1rem",
            }}
          >
            Salary: {formatSalary(job.salary)}
          </div>
        )}
        {job.jobType && (
          <div
            style={{
              marginBottom: "18px",
              color: "#abababff",
              fontSize: "1rem",
            }}
          >
            Type: {job.jobType}
          </div>
        )}
        {job.requiredSkills && (
          <div style={{ marginBottom: "18px" }}>
            <div style={{ fontWeight: 600, marginBottom: "6px" }}>
              Required Skills
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {job.requiredSkills.split(",").map((skill: string) => (
                <span
                  key={skill}
                  style={{
                    background: "#d1f7e7",
                    color: "#2a7a5a",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontSize: "0.98rem",
                  }}
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills & Suggested Courses */}
        {missingSkills.length > 0 && (
          <div style={{ marginBottom: "18px" }}>
            <div
              style={{ fontWeight: 600, marginBottom: "6px", color: "#dc2626" }}
            >
              Missing Skills
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "#fee2e2",
                    color: "#991b1b",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontSize: "0.98rem",
                    border: "1px solid #fecaca",
                  }}
                >
                  {skill}
                  {/* Suggest a course for each missing skill */}
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "0.9em",
                      color: "#2563eb",
                    }}
                  >
                    Suggested:{" "}
                    <a
                      href={`https://www.coursera.org/search?query=${encodeURIComponent(
                        skill
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Course for {skill}
                    </a>
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
        <div style={{ marginTop: "32px", fontSize: "0.95rem", color: "#666" }}>
          <div>
            <strong>Job ID:</strong> {job.jobId}
          </div>
          {/* <div>
            <strong>Active:</strong> {String(job.isActive)}
          </div> */}
          <div>
            <strong>Apply URL:</strong>{" "}
            {job.applyUrl ? (
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                {job.applyUrl}
              </a>
            ) : (
              "N/A"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
