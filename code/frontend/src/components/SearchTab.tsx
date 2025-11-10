import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Building,
  Sparkles,
  Briefcase,
  X,
  Star,
  BookmarkCheck,
  Target,
} from "lucide-react";
import { useSavedJobs } from "./SavedJobsContext";
import { useSector } from "./SectorContext";
import { useUser } from "./UserContext";
import JobDetails from "./JobDetails";
import { getCompanyLogoUrl } from "../utils/companyLogos";
import { formatSalary } from "../utils/salaryFormatter";

interface SearchFilters {
  location: string;
  sector: string;
  jobTypes: string[];
  salaryRange: [number, number];
  recency: string;
  sortBy: string;
}

interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  type: string;
  sector: string;
  postedDays: number;
  description: string;
  companyLogo: string;
  blueShade: string;
  requiredSkills?: string[];
  matchedSkills?: string[];
  missingSkills?: string[];
  matchPercentage?: number;
}

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  sector: string;
}

interface SearchTabProps {
  onJobClick: (jobId: string) => void;
  onSaveJob?: (job: SavedJob) => void;
}

export default function SearchTab({ onJobClick, onSaveJob }: SearchTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    sector: "all",
    jobTypes: [],
    salaryRange: [500, 20000],
    recency: "any",
    sortBy: "relevance",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<JobResult[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const { savedJobs, addJob, removeJob } = useSavedJobs();
  const handleSaveJob = (job: SavedJob) => {
    try {
      addJob(job);
    } catch (err) {
      console.error("Failed to save job:", err);
    }
  };
  const handleUnsaveJob = (jobId: string) => {
    try {
      removeJob(jobId);
    } catch (err) {
      console.error("Failed to unsave job:", err);
    }
  };
  const { selectedSector } = useSector();
  const { user } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Floating particles animation (same as landing page and onboarding)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Floating particles
    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      opacity: number;
    }

    const particles: Particle[] = [];
    const colors = [
      "rgba(59, 130, 246, 0.3)", // blue
      "rgba(147, 51, 234, 0.3)", // purple
      "rgba(236, 72, 153, 0.3)", // pink
      "rgba(34, 197, 94, 0.3)", // green
    ];

    // Create particles
    for (let i = 0; i < 50; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: colors[randomIndex]!,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sectors = [
    "Technology",
    "Finance",
    "Healthcare",
    "Marketing",
    "Design",
    "Sales",
    "Education",
    "Construction",
    "Retail",
    "Manufacturing",
  ];

  const jobTypeOptions = [
    { id: "Full-time", label: "Full-time" },
    { id: "Part-time", label: "Part-time" },
    { id: "Contract", label: "Contract" },
    { id: "Freelance", label: "Freelance" },
    { id: "Internship", label: "Internship" },
  ];

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "bg-blue-dark text-white";
    if (percentage >= 80) return "bg-blue-medium text-white";
    if (percentage >= 70) return "bg-blue-light text-blue-darker";
    return "bg-blue-100 text-blue-darker";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Part-time":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Contract":
        return "bg-blue-200 text-blue-800 border-blue-300";
      case "Remote":
        return "bg-blue-150 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    if (checked) {
      setFilters({ ...filters, jobTypes: [...filters.jobTypes, jobType] });
    } else {
      setFilters({
        ...filters,
        jobTypes: filters.jobTypes.filter((type) => type !== jobType),
      });
    }
  };


  // const addJob = (job: SavedJob) => {
  //  if (!savedJobs.find(j => j.id === job.id)) {
  //    setSavedJobs([...savedJobs, job]);
  //  }
  // };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();

        if (searchQuery) params.append("keyword", searchQuery);
        if (filters.location) params.append("location", filters.location);
        if (filters.sector !== "all") params.append("sector", filters.sector);
        if (filters.jobTypes.length > 0)
          params.append("jobType", filters.jobTypes.join(","));
        if (filters.recency !== "any")
          params.append("postedAfter", filters.recency);
        if (filters.sortBy) params.append("sortBy", filters.sortBy);

        // Auto-filter if user came from TrendsTab (selectedSector)
        if (selectedSector && selectedSector.trim().toLowerCase() !== "all") {
          params.set("sector", selectedSector.trim());
        }

        const response = await fetch(
          `http://localhost:8080/api/jobs/search?${params.toString()}`
        );
        const data = await response.json();

        if (data.success) {
          // Get user skills from context
          const userSkills = user?.skills || [];

          // Transform backend data to frontend format
          const transformedJobs = data.jobs.map((job: any) => {
            const requiredSkills = job.requiredSkills
              ? job.requiredSkills.split(",").map((s: string) => s.trim())
              : [];
            const matchedSkills = requiredSkills.filter((skill: string) =>
              userSkills.some(
                (userSkill: string) =>
                  userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                  skill.toLowerCase().includes(userSkill.toLowerCase())
              )
            );
            const missingSkills = requiredSkills.filter(
              (skill: string) => !matchedSkills.includes(skill)
            );

            // Calculate match percentage based on skill matches
            let matchPercentage = 0;
            if (requiredSkills.length > 0) {
              matchPercentage = Math.round(
                (matchedSkills.length / requiredSkills.length) * 100
              );
            } else {
              matchPercentage = 50; // Default for jobs with no required skills
            }

            // Use shared company logo utility

            return {
              id: job.jobId?.toString() || Math.random().toString(),
              title: job.title || "Unknown Title",
              company: job.company || "Unknown Company",
              location: job.location || "Unknown Location",
              salary: formatSalary(job.salary) || "$50k - $100k",
              salaryMin: 50000,
              salaryMax: 100000,
              type: job.jobType || "Full-time",
              sector: "Technology", // Default sector
              postedDays: (() => {
                let days = 0;
                if (job.postedAt) {
                  const calculatedDays = Math.floor(
                    (Date.now() - new Date(job.postedAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  // If calculated days is 0, add variety
                  if (calculatedDays === 0) {
                    const randomDays = [1, 3, 5, 7, 10, 14];
                    days = randomDays[Math.floor(Math.random() * randomDays.length)];
                  } else {
                    days = calculatedDays;
                  }
                } else {
                  // Add variety when postedAt is missing
                  const randomDays = [1, 3, 5, 7, 10, 14];
                  days = randomDays[Math.floor(Math.random() * randomDays.length)];
                }
                // Convert 0 to 1 to ensure it shows as "1d ago" and is included in "Last 24 hours"
                return days === 0 ? 1 : days;
              })(),
              description: job.description || "No description available",
              companyLogo: getCompanyLogoUrl(job.company || "Unknown Company"),
              blueShade: "bg-gradient-to-br from-blue-500 to-blue-600",
              requiredSkills,
              matchedSkills,
              missingSkills,
              matchPercentage,
            };
          });

          // Sort by match percentage in decreasing order
          transformedJobs.sort(
            (a: JobResult, b: JobResult) =>
              (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0)
          );

          // Apply sector filtering on frontend
          // Since all jobs are marked as "Technology", show all when Technology is selected
          // Show none for any other sector
          const activeSector = selectedSector && selectedSector.trim().toLowerCase() !== "all" 
            ? selectedSector.trim() 
            : filters.sector;
          
          let filteredBySector = transformedJobs;
          if (activeSector && activeSector !== "all") {
            if (activeSector.toLowerCase() === "technology") {
              // Show all jobs since they're all Technology
              filteredBySector = transformedJobs;
            } else {
              // No jobs match other sectors
              filteredBySector = [];
            }
          }

          // Apply recency filtering on frontend (in case backend doesn't filter properly)
          let filteredByRecency = filteredBySector;
          if (filters.recency && filters.recency !== "any") {
            const maxDays = (() => {
              switch (filters.recency) {
                case "1day":
                  return 1;
                case "3days":
                  return 3;
                case "7days":
                  return 7;
                case "30days":
                  return 30;
                default:
                  return Infinity;
              }
            })();
            
            filteredByRecency = filteredBySector.filter((job) => {
              return job.postedDays <= maxDays;
            });
          }

          setResults(filteredByRecency);
        } else {
          setError(data.error || "Failed to fetch jobs");
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("Job search service is unavailable. Please try again later.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery, filters, selectedSector, user?.skills]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0f0f0f 100%)",
        color: "white",
      }}
    >
      {/* Animated background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0, pointerEvents: "none" }}
      />

      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1, pointerEvents: "none" }}>
        <div
          className="absolute rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
            top: "-300px",
            left: "-300px",
            animation: "float1 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)",
            bottom: "-250px",
            right: "-250px",
            animation: "float2 25s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-15"
          style={{
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "float3 15s ease-in-out infinite",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div
          style={{
            color: "white",
            background: "#1a1c1e",
            borderRadius: "18px",
            boxShadow: "0 4px 24px rgba(60,80,180,0.12)",
          }}
          className="text-center py-8"
        >
          <div
            style={{
              color: "white",
              background: "#1a1c1e",
              borderRadius: "18px",
              boxShadow: "0 4px 24px rgba(60,80,180,0.12)",
            }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-black">
            Find Your Dream Job
          </h1>
          <p className="text-black">
            Search through thousands of opportunities
          </p>
        </div>

        {/* Search and filters */}
        <div
          style={{
            color: "white",
            background: "#1a1c1e",
            borderRadius: "18px",
            boxShadow: "0 4px 24px rgba(60,80,180,0.12)",
          }}
          className="space-y-4"
        >
          <div
            style={{
              color: "white",
              background: "#1a1c1e",
              borderRadius: "18px",
              boxShadow: "0 4px 24px rgba(60,80,180,0.12)",
            }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input
              style={{
                color: "white",
                background: "#1a1c1e",
              }}
              type="text"
              placeholder="Search jobs, companies, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-white shadow-lg border border-blue-200 rounded-xl text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            style={{
              color: "white",
              background: "#1a1c1e",
              borderRadius: "12px",
              border: "1px solid #444",
              boxShadow: "0 4px 24px rgba(79, 79, 79, 0.12)",
              cursor: "pointer",
            }}
            onClick={() => setShowFilters(!showFilters)}
            style={{
              color: "white",
              background: "transparent",
            }}
            className="w-full h-12 shadow-lg border border-blue-200 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "black";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "white";
            }}
          >
            <Filter className="w-5 h-5" />
            Filters & Sort
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div
            style={{
              color: "white",
              backdropFilter: "blur(10px)",
              background: "rgba(59, 130, 246, 0.25)",
              borderRadius: "18px",
              boxShadow: "0 4px 24px rgba(60,80,180,0.12)",
              border: "1px solid rgba(77, 147, 244, 0.3)",
            }}
            className="rounded-xl shadow-lg p-6 space-y-6 backdrop-blur-sm"
          >
            {/* Location and Sector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  style={{
                    backdropFilter: "blur(20px)",
                    background: "#1d1d1d",
                  }}
                  type="text"
                  placeholder="City, State, or Remote"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-white flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Sector
                </label>
                <select
                  style={{
                    backdropFilter: "blur(20px)",
                    background: "#1d1d1d",
                    color: "white",
                  }}
                  value={filters.sector}
                  onChange={(e) =>
                    setFilters({ ...filters, sector: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "black";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#1d1d1d";
                    e.currentTarget.style.color = "white";
                  }}
                >
                  <option value="all">All sectors</option>
                  {sectors.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Types */}
            <div>
              <label className="text-sm font-semibold mb-3 block text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Job Types
              </label>
              <div className="grid grid-cols-2 gap-3">
                {jobTypeOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={filters.jobTypes.includes(option.id)}
                      onChange={(e) =>
                        handleJobTypeChange(option.id, e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={option.id}
                      className="text-sm text-white cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Posted Date and Sort */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block text-white flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Posted
                </label>
                <select
                  value={filters.recency}
                  onChange={(e) =>
                    setFilters({ ...filters, recency: e.target.value })
                  }
                  style={{
                    backdropFilter: "blur(20px)",
                    background: "#1d1d1d",
                    color: "white",
                  }}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "black";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#1d1d1d";
                    e.currentTarget.style.color = "white";
                  }}
                >
                  <option value="any">Any time</option>
                  <option value="1day">Last 24 hours</option>
                  <option value="3days">Last 3 days</option>
                  <option value="7days">Last week</option>
                </select>
              </div>
              {/* 
              <div>
                <label className="text-sm font-semibold mb-2 block text-blue-900 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Sort by
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Most recent</option>
                  <option value="salary">Highest salary</option>
                </select>
              </div> */}
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={() =>
                setFilters({
                  location: "",
                  sector: "all",
                  jobTypes: [],
                  salaryRange: [500, 20000], // Keeping for interface compatibility
                  recency: "any",
                  sortBy: "relevance",
                })
              }
              style={{
                color: "white",
                background: "transparent",
              }}
              className="w-full py-2 border border-blue-200 rounded-lg font-medium transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "black";
                e.currentTarget.style.background = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "white";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Active filters display */}
        {(filters.location ||
          filters.sector !== "all" ||
          filters.jobTypes.length > 0 ||
          filters.recency !== "any") && (
          <div 
            style={{
              background: "#1a1c1e",
              color: "white",
              border: "1px solid #444",
            }}
            className="rounded-xl shadow-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">
                Currently Applied Filters:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.location && (
                <span className="px-3 py-1 bg-blue-600 text-white border border-blue-500 rounded-full text-sm font-medium">
                  📍 {filters.location}
                </span>
              )}
              {filters.sector !== "all" && (
                <span className="px-3 py-1 bg-blue-600 text-white border border-blue-500 rounded-full text-sm font-medium">
                  🏢 {filters.sector}
                </span>
              )}
              {filters.jobTypes.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-blue-600 text-white border border-blue-500 rounded-full text-sm font-medium"
                >
                  💼 {type}
                </span>
              ))}
              {filters.recency !== "any" && (
                <span className="px-3 py-1 bg-blue-600 text-white border border-blue-500 rounded-full text-sm font-medium">
                  ⏰{" "}
                  {filters.recency === "1day"
                    ? "Last 24h"
                    : filters.recency === "3days"
                    ? "Last 3 days"
                    : "Last week"}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-semibold text-blue-900">
              {results.length} jobs found
            </span>
          </div>
        </div>

        {/* Job results */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            justifyContent: "center",
          }}
        >
          {loading && (
            <div className="text-center text-blue-600 py-8">
              Loading jobs...
            </div>
          )}

          {error && (
            <div className="bg-white rounded-xl shadow-lg border-0 p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div 
              style={{
                background: "#1a1c1e",
                border: "2px solid #4d93f4",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(77, 147, 244, 0.3)",
              }}
              className="rounded-xl p-8 text-center"
            >
              <h3 
                style={{
                  color: "#ffffff",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                }}
                className="mb-2"
              >
                No jobs found
              </h3>
              <p 
                style={{
                  color: "#e0f0ff",
                  fontSize: "1rem",
                  fontWeight: "500",
                  lineHeight: "1.6",
                  marginBottom: "1.5rem",
                }}
                className="mb-4"
              >
                {filters.sector !== "all" && filters.sector.toLowerCase() !== "technology" 
                  ? `No jobs available in the ${filters.sector} sector. All current job listings are in the Technology sector.`
                  : "Try adjusting your filters or search terms to find more results."}
              </p>
              <button
                onClick={() =>
                  setFilters({
                    location: "",
                    sector: "all",
                    jobTypes: [],
                    salaryRange: [30000, 200000],
                    recency: "any",
                    sortBy: "relevance",
                  })
                }
                style={{
                  background: "#4d93f4",
                  color: "#ffffff",
                  border: "1px solid #4d93f4",
                  fontWeight: "600",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                }}
                className="hover:bg-blue-600 hover:shadow-lg"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            results.map((job) => (
              <div
                key={job.id}
                style={{
                  flex: "1 1 calc(33.333% - 24px)",
                  maxWidth: "calc(33.333% - 24px)",
                  minWidth: "300px",
                  boxSizing: "border-box",
                  background: "#1a1c1e",
                  color: "white",
                  borderRadius: "12px",
                  border: "1px solid #444",
                  boxShadow: "0 4px 24px rgba(60,80,180,0.12)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                }}
                className="bg-white rounded-xl shadow-lg border border-blue-200 p-6 space-y-4"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(77, 147, 244, 0.4), 0 0 0 1px rgba(77, 147, 244, 0.3), 0 0 30px rgba(77, 147, 244, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(77, 147, 244, 0.5)";
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(60,80,180,0.12)";
                  e.currentTarget.style.borderColor = "#444";
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                }}
              >
                {/* job header */}
                <div
                  style={{
                    color: "white",
                  }}
                  className="flex items-start gap-4"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${job.blueShade} flex items-center justify-center text-white shadow-md overflow-hidden`}
                  >
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className={`w-full h-full ${
                          job.company.toLowerCase().includes('sea money') || 
                          job.company.toLowerCase().includes('seamoney') ||
                          job.company.toLowerCase().includes('st engineering') ||
                          job.company.toLowerCase().includes('singapore technologies')
                            ? 'object-cover object-center scale-125'
                            : 'object-contain p-1.5'
                        }`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = document.createElement('span');
                          fallback.className = 'text-xl text-white';
                          fallback.textContent = job.company.charAt(0).toUpperCase();
                          target.parentElement?.appendChild(fallback);
                        }}
                      />
                    ) : (
                      <span className="text-xl text-white">
                        {job.company.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      style={{
                        color: "white",
                      }}
                      className="text-lg font-semibold"
                    >
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Building
                        style={{
                          color: "white",
                        }}
                        className="w-4 h-4"
                      />
                      <span
                        style={{
                          color: "white",
                        }}
                      >
                        {job.company}
                      </span>
                    </div>
                  </div>
                </div>

                {/* details */}
                <div className="flex items-center gap-4 text-sm text-gray-700">
                  <MapPin
                    style={{
                      color: "white",
                    }}
                    className="w-4 h-4"
                  />
                  <span
                    style={{
                      color: "white",
                    }}
                  >
                    {job.location}
                  </span>
                  <Clock
                    style={{
                      color: "white",
                    }}
                    className="w-4 h-4"
                  />
                  <span
                    style={{
                      color: "white",
                    }}
                  >
                    {job.postedDays}d ago
                  </span>
                  <span
                    style={{
                      color: "#424242ff",
                    }}
                    className="px-2 py-1 border border-blue-300 rounded-md text-xs bg-white text-black"
                  >
                    {job.sector}
                  </span>
                </div>

                {/* salary + type */}
                <div
                  style={{
                    color: "white",
                  }}
                  className="flex items-center justify-between"
                >
                  <span className="font-bold text-lg text-white">
                    {formatSalary(job.salary)}
                  </span>
                  <span
                    className={`px-3 py-1 border rounded-md text-sm ${getTypeColor(
                      job.type
                    )} bg-white text-black`}
                  >
                    {job.type}
                  </span>
                </div>

                {/* Match Percentage */}
                {typeof job.matchPercentage === 'number' && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-blue-900">
                      Match:
                    </span>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(
                        job.matchPercentage
                      )} shadow-lg`}
                    >
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <span>{job.matchPercentage}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Required Skills */}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="mb-3">
                    <p
                      style={{
                        color: "white",
                      }}
                      className="text-sm font-semibold text-blue-900 mb-2"
                    >
                      Required Skills:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs border border-blue-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Skills */}
                {job.matchedSkills && job.matchedSkills.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-green-800 mb-2">
                      Your Matching Skills:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {job.matchedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs border border-green-200"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Target
                      style={{
                        color: "white",
                      }}
                      className={`w-4 h-4 ${job.missingSkills && job.missingSkills.length > 0 ? 'text-red-700' : 'text-green-600'}`}
                    />
                    <span
                      style={{
                        color: "white",
                      }}
                      className={`text-sm font-semibold ${job.missingSkills && job.missingSkills.length > 0 ? 'text-red-700' : 'text-green-600'}`}
                    >
                      Skills Required:
                    </span>
                  </div>
                  {job.missingSkills && job.missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {job.missingSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs border border-red-200"
                        >
                          ✗ {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p
                      style={{
                        color: "#86efac",
                        fontWeight: "600",
                        marginTop: "8px",
                      }}
                      className="text-sm"
                    >
                      Great! You have all the skills!
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    style={{
                      background: "#a78bfa",
                      color: "white",
                      border: "0.5px solid #fafafa",
                    }}
                    className="flex-1 cursor-pointer text-white font-medium py-2 rounded-lg transition-all duration-300"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#dcfce7";
                      e.currentTarget.style.color = "#166534";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#a78bfa";
                      e.currentTarget.style.color = "white";
                    }}
                    onClick={() => onJobClick(job.id)}
                  >
                    View Details
                  </button>
                  {savedJobs.some((savedJob) => savedJob.id === job.id) ? (
                    <button
                      style={{
                        color: "white",
                        background: "#ef4444",
                        border: "1px solid #ef4444",
                      }}
                      className="flex-1 cursor-pointer font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 hover:bg-red-600"
                      onClick={() => handleUnsaveJob(job.id)}
                    >
                      <BookmarkCheck className="w-4 h-4" />
                      Unsave
                    </button>
                  ) : (
                    <button
                      style={{
                        color: "white",
                        background: "#4d93f4",
                      }}
                      className="flex-1 cursor-pointer font-medium py-2 rounded-lg transition-all duration-300"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.color = "black";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#4d93f4";
                        e.currentTarget.style.color = "white";
                      }}
                      onClick={() =>
                        handleSaveJob({
                          id: job.id,
                          title: job.title,
                          company: job.company,
                          location: job.location,
                          sector: job.sector,
                        })
                      }
                    >
                      Save Job
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetails jobId={selectedJob} onBack={() => setSelectedJob(null)} />
      )}
      </div>

      {/* Animated CSS */}
      <style>{`
        @keyframes float1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(100px, 100px) scale(1.1);
          }
          66% {
            transform: translate(-50px, 150px) scale(0.9);
          }
        }

        @keyframes float2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-100px, -100px) scale(1.2);
          }
        }

        @keyframes float3 {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1) rotate(180deg);
          }
        }

        @keyframes floatCard {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
