import React, { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Clock, Building, Star, Zap, Target, BookmarkCheck } from "lucide-react";
import { useUser } from "./UserContext";
import { useSavedJobs } from "./SavedJobsContext";
import { getCompanyLogoUrl } from "../utils/companyLogos";
import { formatSalary } from "../utils/salaryFormatter";

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  postedDays: number;
  type: string;
  companyLogo: string;
  blueShade: string;
}

interface ForYouTabProps {
  onJobClick: (jobId: string) => void;
}

export default function ForYouTab({ onJobClick }: ForYouTabProps) {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { savedJobs, addJob, removeJob } = useSavedJobs();
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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:8080/api/jobs/search");
        const data = await response.json();

        if (data.success) {
          const userSkills = user?.skills || [];

          // Transform backend data to frontend format with match calculations
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

            // Calculate match percentage based on skill matches - using same logic as SearchTab
            let matchPercentage = 0;
            if (requiredSkills.length > 0) {
              matchPercentage = Math.round(
                (matchedSkills.length / requiredSkills.length) * 100
              );
            } else {
              matchPercentage = 50; // Default for jobs with no required skills
            }

            return {
              id: job.jobId?.toString() || Math.random().toString(),
              title: job.title || "Unknown Title",
              company: job.company || "Unknown Company",
              location: job.location || "Unknown Location",
              salary: formatSalary(job.salary) || "$50k - $100k",
              matchPercentage: matchPercentage,
              matchedSkills: matchedSkills,
              missingSkills: missingSkills,
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
              type: job.jobType || "Full-time",
              companyLogo: getCompanyLogoUrl(job.company || "Unknown Company"),
              blueShade: "gradient-blue-medium",
            };
          });

          // Sort by match percentage (highest first)
          transformedJobs.sort(
            (a: any, b: any) => b.matchPercentage - a.matchPercentage
          );

          // Take only top 6 most matching jobs
          // If there are ties at the 6th position, randomly pick one
          let topJobs: JobRecommendation[] = [];
          if (transformedJobs.length <= 6) {
            topJobs = transformedJobs;
          } else {
            // Take first 5 jobs
            topJobs = transformedJobs.slice(0, 5);
            
            // Get the match percentage of what would be the 6th job
            const sixthMatchPercentage = transformedJobs[5].matchPercentage;
            
            // Find all jobs starting from position 5 that have the same match percentage
            const tiedJobs = transformedJobs.slice(5).filter(
              (job) => job.matchPercentage === sixthMatchPercentage
            );
            
            // Randomly pick one from the tied jobs (includes the 6th job itself)
            const randomTiedJob = tiedJobs[Math.floor(Math.random() * tiedJobs.length)];
            topJobs.push(randomTiedJob);
          }

          setRecommendations(topJobs);
        } else {
          setError(data.error || "Failed to fetch jobs");
        }
      } catch (err) {
        console.error("Job fetch error:", err);
        setError("Unable to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user?.skills]);

  const handleSaveJob = (job: { id: string; title: string; company: string; location: string; sector: string }) => {
    try {
      addJob(job);
    } catch (err) {
      window.alert("Failed to save job. Please try again.");
    }
  };

  const handleUnsaveJob = (jobId: string) => {
    try {
      removeJob(jobId);
    } catch (err) {
      window.alert("Failed to unsave job. Please try again.");
    }
  };
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "bg-blue-dark text-white";
    if (percentage >= 80) return "bg-blue-medium text-white";
    if (percentage >= 70) return "bg-blue-light text-blue-darker";
    return "bg-blue-100 text-blue-darker";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-blue-100 text-blue-darker border-blue-200";
      case "Part-time":
        return "bg-blue-50 text-blue-dark border-blue-100";
      case "Contract":
        return "bg-blue-200 text-blue-darker border-blue-300";
      case "Remote":
        return "bg-blue-150 text-blue-darker border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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
      <div className="relative z-10 min-h-screen p-4 pb-20 space-y-6">
      {/* Header with modern design */}
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-lg">
          <Target className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-blue-900 mb-3">For You</h1>
        <p className="text-lg text-blue-700">
          Jobs matched to your skills and preferences
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div className="text-blue-900 font-semibold text-lg">
            Loading personalized recommendations...
          </div>
          <div className="text-blue-700 mt-2">
            Finding the perfect matches for you
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="text-blue-900 mb-4 text-lg">{error}</div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🔍</span>
          </div>
          <div className="text-blue-900 font-semibold mb-2 text-lg">
            No recommendations available
          </div>
          <div className="text-blue-700">
            Try updating your skills in your profile to get better matches!
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          justifyContent: "center",
        }}
      >
        {recommendations.map((job, index) => (
          <div
            key={job.id}
            style={{
              flex: "1 1 calc(30.333% - 24px)",
              maxWidth: "calc(33.333% - 24px)",
              minWidth: "300px",
              boxSizing: "border-box",
              backgroundColor: "hsl(0deg 0% 12.2% / 1)",
              color: "white",
              borderRadius: "12px",
              border: "1px solid #444",
              boxShadow: "0 10px 24px rgba(60,80,180,0.12)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 20px 60px rgba(77, 147, 244, 0.4), 0 0 0 1px rgba(77, 147, 244, 0.3), 0 0 30px rgba(77, 147, 244, 0.2)";
              e.currentTarget.style.borderColor = "rgba(77, 147, 244, 0.5)";
              e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 10px 24px rgba(60,80,180,0.12)";
              e.currentTarget.style.borderColor = "#444";
              e.currentTarget.style.transform = "translateY(0) scale(1)";
            }}
          >
            <div className="p-4 space-y-4">
              {/* Header with company logo and match */}
              <div
                style={{
                  color: "white",
                }}
                className="flex items-start justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden ${
                      job.companyLogo 
                        ? 'bg-white' 
                        : `${job.blueShade} text-white`
                    }`}
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
                    <h3 className="text-lg mb-1 text-white font-semibold">
                      {job.title}
                    </h3>
                    <div
                      style={{
                        color: "white",
                      }}
                      className="flex items-center gap-2 text-sm text-blue-700"
                    >
                      <Building className="w-4 h-4" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                </div>

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

              {/* Job details */}
              <div
                style={{
                  color: "white",
                }}
                className="space-y-3"
              >
                <div className="flex items-center gap-4 text-sm text-blue-700">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{job.postedDays}d ago</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-blue-900">
                    {formatSalary(job.salary)}
                  </span>
                  <Badge
                    className={`${getTypeColor(job.type)} border font-semibold`}
                  >
                    {job.type}
                  </Badge>
                </div>
              </div>

              {/* Skills section */}
              <div
                style={{
                  color: "white",
                }}
                className="space-y-3"
              >
                {job.matchedSkills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap
                        style={{
                          color: "white",
                        }}
                        className="w-4 h-4 text-blue-800"
                      />
                      <span
                        style={{
                          color: "white",
                        }}
                        className="text-sm font-semibold text-blue-800"
                      >
                        Matched Skills
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.matchedSkills.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-green-100 text-green-800 border-green-200 font-semibold"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target
                      style={{
                        color: "white",
                      }}
                      className={`w-4 h-4 ${job.missingSkills.length > 0 ? 'text-red-700' : 'text-green-600'}`}
                    />
                    <span
                      style={{
                        color: "white",
                      }}
                      className={`text-sm font-semibold ${job.missingSkills.length > 0 ? 'text-red-700' : 'text-green-600'}`}
                    >
                      Skills Required:
                    </span>
                  </div>
                  {job.missingSkills.length > 0 ? (
                    <div
                      style={{
                        marginTop: "10px",
                      }}
                      className="flex flex-wrap gap-2"
                    >
                      {job.missingSkills.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-red-100 text-red-800 border-red-200 font-semibold"
                        >
                          {skill}
                        </Badge>
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
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  style={{
                    background: "#a78bfa",
                    color: "white",
                    border: "1px solid #a1a1a1ff",
                  }}
                  className="flex-1 cursor-pointer text-white transition-all duration-300 font-semibold py-2 rounded-lg"
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
                  View Details & Apply
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
                        sector: "Technology",
                      })
                    }
                  >
                    Save Job
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
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
