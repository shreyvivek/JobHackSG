import React, { useState, useEffect, useRef } from "react";
import { Rocket, LogOut } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom"; // ✅ NEW

export default function AdminAddJob() {
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: "",
    jobType: "",
    requiredSkills: "",
    requirements: "",
    applyUrl: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number; y: number; radius: number; vx: number; vy: number; color: string; opacity: number;
    }[] = [];
    const colors = [
      "rgba(59, 130, 246, 0.3)",
      "rgba(147, 51, 234, 0.3)",
      "rgba(236, 72, 153, 0.3)",
      "rgba(34, 197, 94, 0.3)",
    ];

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
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingField = Object.entries(jobData).find(([_, v]) => !v.trim());
    if (missingField) {
      setError(`Please fill up the ${missingField[0]} field.`);
      setSuccess(null);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/admin/ingest/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        setSuccess("✅ Job added successfully!");
        setError(null);
        setJobData({
          title: "",
          company: "",
          location: "",
          description: "",
          salary: "",
          jobType: "",
          requiredSkills: "",
          requirements: "",
          applyUrl: "",
        });
      } else {
        const message = await response.text();
        setError(`❌ Failed to add job: ${message}`);
        setSuccess(null);
      }
    } catch {
      setError("❌ Network error. Please check backend connection.");
      setSuccess(null);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <div
        className="relative min-h-screen overflow-hidden text-white"
        style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0f0f0f 100%)" }}
      >
        {/* Animated background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0, pointerEvents: "none" }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1, pointerEvents: "none" }}>
          <div
            className="absolute rounded-full blur-3xl opacity-20 animate-pulse"
            style={{
              width: "600px",
              height: "600px",
              background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
              top: "-300px",
              left: "-300px",
            }}
          />
          <div
            className="absolute rounded-full blur-3xl opacity-20 animate-pulse"
            style={{
              width: "500px",
              height: "500px",
              background: "radial-gradient(circle, rgba(147,51,234,0.4) 0%, transparent 70%)",
              bottom: "-250px",
              right: "-250px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 py-16">
          <div className="flex items-center justify-center mb-10 mt-24">
            <Rocket className="w-10 h-10 text-blue-400 mr-3 animate-pulse" />
            <h1 className="text-8xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Job Posting Portal
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl"
          >
            <div className="grid grid-cols-1 gap-5">
              {[
                { name: "title", label: "Job Title" },
                { name: "company", label: "Company" },
                { name: "location", label: "Location" },
                { name: "salary", label: "Salary Range" },
                { name: "jobType", label: "Job Type" },
                { name: "requiredSkills", label: "Required Skills" },
                { name: "requirements", label: "Requirements" },
                { name: "applyUrl", label: "Apply URL" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold mt-4 mb-2 text-gray-300">
                    {field.label}
                  </label>
                  {field.name === "requirements" ? (
                    <Textarea
                      name={field.name}
                      value={jobData[field.name as keyof typeof jobData]}
                      onChange={handleChange}
                      className="w-full bg-gray-900 text-white border-gray-700 focus:border-blue-500 rounded-lg"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  ) : (
                    <Input
                      type="text"
                      name={field.name}
                      value={jobData[field.name as keyof typeof jobData]}
                      onChange={handleChange}
                      className="w-full bg-gray-900 text-white border-gray-700 focus:border-blue-500 rounded-lg"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold mt-4 mb-2 text-gray-300">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={jobData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-900 text-white border-gray-700 focus:border-blue-500 rounded-lg"
                  placeholder="Enter job description..."
                />
              </div>
            </div>

            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            {success && <p className="text-green-400 mt-4 text-center">{success}</p>}

            <button
              type="submit"
              className="w-full mt-6 py-3 font-semibold rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/40"
            >
              Add Job Listing
            </button>
          </form>
        </div>
      </div>

      {/* ✅ Always bottom-right regardless of parents/transforms (portal into document.body) */}
      {createPortal(
        <div
          style={{
            position: "fixed",
            right: "24px",
            bottom: "24px",
            zIndex: 1000,
            pointerEvents: "auto",
          }}
        >
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-md transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>,
        document.body
      )}
    </>
  );
}
