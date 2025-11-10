import React, { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Sparkles, Rocket, TrendingUp, Briefcase, Target, Zap } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Main heading with animation */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4" style={{ animation: "fadeInUp 1s ease-out" }}>
            <Rocket className="w-16 h-16 md:w-20 md:h-20 text-blue-400" style={{ animation: "floatCard 3s ease-in-out infinite" }} />
            <h1
              className="font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              style={{
                fontSize: "clamp(4.5rem, 10vw, 8.5rem)",
                textShadow: "0 0 40px rgba(59, 130, 246, 0.3)",
                lineHeight: "1.1",
              }}
            >
              JobHackSG
            </h1>
            <Rocket className="w-16 h-16 md:w-20 md:h-20 text-purple-400" style={{ animation: "floatCard 3s ease-in-out infinite", animationDelay: "0.5s" }} />
          </div>
          <p
            className="text-xl md:text-2xl text-gray-300 mt-4"
            style={{
              animation: "fadeInUp 1.2s ease-out",
            }}
          >
            Your Gateway to Career Success in Singapore
          </p>
        </div>

        {/* Feature cards with floating animation */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12 max-w-4xl w-full px-4"
          style={{
            animation: "fadeInUp 1.4s ease-out",
            marginTop: "3rem",
          }}
        >
          {[
            { icon: Sparkles, text: "Skill Matching" },
            { icon: Rocket, text: "Career Launch" },
            { icon: TrendingUp, text: "Market Insights" },
            { icon: Briefcase, text: "Job Discovery" },
            { icon: Target, text: "Skill Gaps" },
            { icon: Zap, text: "Quick Apply" },
          ].map((feature, index) => (
            <div
              key={index}
              className="relative group"
              style={{
                animation: `floatCard ${3 + index * 0.2}s ease-in-out infinite`,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div
                className="p-4 md:p-6 rounded-2xl backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
                }}
              >
                <feature.icon
                  className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 text-blue-400 group-hover:text-purple-400 transition-colors"
                />
                <p className="text-xs md:text-sm text-center text-gray-300 group-hover:text-white transition-colors">
                  {feature.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div
          className="text-center relative"
          style={{
            animation: "fadeInUp 1.6s ease-out",
            zIndex: 1000,
            marginTop: "10rem",
          }}
        >
          <Link
            to="/onboarding"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Link clicked, navigating to /onboarding");
            }}
            className="inline-block"
            style={{
              textDecoration: "none",
            }}
          >
            <button
              type="button"
              className="px-10 py-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center mx-auto relative"
              style={{
                background: "linear-gradient(135deg, rgba(96, 165, 250, 0.8) 0%, rgba(167, 139, 250, 0.8) 100%)",
                border: "2px solid rgba(139, 92, 246, 0.3)",
                boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.1)",
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                zIndex: 1000,
                position: "relative",
              }}
            >
              <span>GET STARTED</span>
            </button>
          </Link>
          <p className="text-sm text-gray-400 mt-6">
            Join thousands of students and graduates finding their dream careers
          </p>
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

