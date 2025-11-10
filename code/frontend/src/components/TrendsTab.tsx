import React, { useEffect, useState, useRef } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { fetchSectorTrends } from "../apiSectorTrends";
import { useSector } from "../components/SectorContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface TrendRecord {
  sector: string;
  year: number;
  quarter: string;
  value: number;
}

interface TrendsTabProps {
  onSectorClick: (sectorId: string) => void;
}

export default function TrendsTab({ onSectorClick }: TrendsTabProps) {
  const [trends, setTrends] = useState<TrendRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedSector } = useSector();
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
    fetchSectorTrends().then((data) => {
      setTrends(data);
      setLoading(false);
    });
  }, []);

  const sectorStats = React.useMemo(() => {
    if (!trends.length) return [];

    const grouped: Record<string, TrendRecord[]> = {};
    for (const t of trends) {
      const sectorName = t.sector.trim();
      if (!grouped[sectorName]) grouped[sectorName] = [];
      grouped[sectorName].push(t);
    }

    return Object.entries(grouped).map(([sector, records]) => {
      records.sort((a, b) =>
        a.year === b.year ? a.quarter.localeCompare(b.quarter) : a.year - b.year
      );
      const latest = records[records.length - 1]?.value ?? 0;
      const earlier = records[Math.max(records.length - 5, 0)]?.value ?? latest;
      const growth = ((latest - earlier) / (earlier || 1)) * 100;

      return {
        id: sector.toLowerCase().replace(/\s+/g, "-"),
        name: sector,
        growth: Math.round(growth * 10) / 10,
        value: latest,
      };
    });
  }, [trends]);

  const getGrowthDisplay = (growth: number) => {
    const isPositive = growth >= 0;
    return {
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? "text-blue-dark" : "text-red-600",
      bgColor: isPositive ? "bg-blue-100" : "bg-red-100",
      text: `${isPositive ? "+" : ""}${growth.toFixed(1)}%`,
    };
  };

  if (loading)
    return (
      <div
        style={{
          background: "#1c1e1c",
          color: "white",
        }}
        className="p-8 text-center text-blue-900 font-semibold"
      >
        Loading sector trends...
      </div>
    );

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
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h1 className="mb-2 text-4xl font-bold text-blue-900">Market Trends</h1>
        <p className="text-lg text-blue-700">
          Discover growing sectors based on live data
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          justifyContent: "center",
        }}
      >
        {sectorStats.map((sector) => {
          const growth = getGrowthDisplay(sector.growth);

          return (
            <Card
              key={sector.id}
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
                cursor: "pointer",
              }}
              className="bg-[#1A1C1E] border-2 border-[#b3b3b3] shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out hover:-translate-y-4 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-[1.02] hover:border-blue-400 hover:bg-[#1f2631] sector-card"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-blue-900">
                    {sector.name}
                  </h3>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg ${growth.bgColor}`}
                  >
                    <growth.icon className={`w-4 h-4 ${growth.color}`} />
                    <span className={`text-sm font-bold ${growth.color}`}>
                      {growth.text}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-blue-700">
                  Latest Employment Count:{" "}
                  <Badge
                    style={{
                      background: "#e0f0ff",
                      color: "#003366",
                      border: "1px solid #99ccff",
                    }}
                    className="bg-blue-100 text-blue-900 border-blue-200 font-bold"
                  >
                    {sector.value.toFixed(0)}
                  </Badge>
                </div>

                <div className="text-sm text-blue-700">
                  <p className="mb-2">
                    This sector shows{" "}
                    {sector.growth >= 0 ? "positive" : "negative"} growth
                    trends.
                  </p>
                </div>

                {/* === Line Graph for last 5 years === */}
                <div style={{ marginTop: "12px", height: "200px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trends
                        .filter(
                          (t) =>
                            t.sector.trim() === sector.name &&
                            t.year >= 2020 &&
                            t.year <= 2025
                        )
                        .sort((a, b) =>
                          a.year === b.year
                            ? a.quarter.localeCompare(b.quarter)
                            : a.year - b.year
                        )}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis
                        dataKey={(d) => `${d.year} ${d.quarter}`}
                        tick={{ fill: "#ccc", fontSize: 10 }}
                        interval={2}
                      />
                      <YAxis tick={{ fill: "#ccc", fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#222",
                          color: "#fff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        dot={{ fill: "#60a5fa" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          );
        })}
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

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 4px 24px rgba(60,80,180,0.12), 0 0 20px rgba(96, 165, 250, 0.3);
          }
          50% {
            box-shadow: 0 4px 24px rgba(60,80,180,0.12), 0 0 30px rgba(96, 165, 250, 0.6);
          }
        }

        .sector-card:hover {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
