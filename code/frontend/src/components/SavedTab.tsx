import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Building, MapPin, Clock, Sparkles, BookmarkCheck } from "lucide-react";
import { useSavedJobs } from "./SavedJobsContext";
import { getCompanyLogoUrl } from "../utils/companyLogos";

export default function SavedTab() {
  const { savedJobs, removeJob } = useSavedJobs();
  const navigate = useNavigate();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
      <div className="relative z-10 min-h-screen p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">Saved Jobs</h1>
          <p className="text-gray-300">Your bookmarked opportunities</p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-blue-500/40 animate-pulse">
              <BookmarkCheck className="w-16 h-16 text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your saved jobs collection is empty
            </h3>
            <p className="text-gray-300 mb-2 max-w-lg mx-auto text-lg leading-relaxed">
              📌 Start building your personalized job collection!
            </p>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto text-base">
              Save jobs that catch your eye and come back to them anytime. Your dream opportunity is just a click away!
            </p>
            <Button
              onClick={() => navigate("/search")}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold px-10 py-4 rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2 inline" />
              Discover Opportunities
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              justifyContent: "center",
            }}
          >
            {savedJobs.map((job, index) => {
              const companyLogo = getCompanyLogoUrl(job.company);
              return (
                <div
                  key={job.id}
                  style={{
                    flex: "1 1 calc(33.333% - 24px)",
                    maxWidth: "calc(33.333% - 24px)",
                    minWidth: "300px",
                    boxSizing: "border-box",
                    background: "linear-gradient(135deg, #1a1c1e 0%, #252729 100%)",
                    color: "white",
                    borderRadius: "16px",
                    border: "1px solid rgba(77, 147, 244, 0.2)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(77, 147, 244, 0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                    cursor: "pointer",
                  }}
                  className="group hover:scale-[1.02]"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 20px 60px rgba(77, 147, 244, 0.4), 0 0 0 1px rgba(77, 147, 244, 0.3), 0 0 30px rgba(77, 147, 244, 0.2)";
                    e.currentTarget.style.borderColor = "rgba(77, 147, 244, 0.5)";
                    e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(77, 147, 244, 0.1)";
                    e.currentTarget.style.borderColor = "rgba(77, 147, 244, 0.2)";
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                  }}
                >
                  <div className="p-6 space-y-4">
                    {/* Header with logo and bookmark icon */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg overflow-hidden ${
                            companyLogo 
                              ? 'bg-white p-1' 
                              : 'bg-gradient-to-br from-blue-500 to-purple-600'
                          }`}
                        >
                          {companyLogo ? (
                            <img
                              src={companyLogo}
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
                                fallback.className = 'text-xl text-white font-bold';
                                fallback.textContent = job.company.charAt(0).toUpperCase();
                                target.parentElement?.appendChild(fallback);
                              }}
                            />
                          ) : (
                            <Building className="w-7 h-7 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-blue-300">
                              {job.company}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-500/20 rounded-lg p-2">
                        <BookmarkCheck className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>

                    {/* Job details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-purple-400" />
                          <span>
                            {job.savedDate ? formatDate(job.savedDate) : "Recently saved"}
                          </span>
                        </div>
                      </div>
                      {job.sector && (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
                            {job.sector}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        style={{
                          background: "linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)",
                          color: "white",
                          border: "none",
                        }}
                        className="flex-1 cursor-pointer font-semibold py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/50 hover:scale-[1.02]"
                        onClick={() => navigate(`/job/${job.id}`)}
                      >
                        View Details
                      </button>
                      <button
                        style={{
                          background: "rgba(239, 68, 68, 0.2)",
                          color: "#fca5a5",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                        }}
                        className="flex-1 cursor-pointer font-semibold py-2.5 rounded-lg transition-all duration-300 hover:bg-red-500/30 hover:border-red-500/50 hover:scale-[1.02]"
                        onClick={() => removeJob(job.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
