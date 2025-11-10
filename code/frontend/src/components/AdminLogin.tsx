import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false,
  });

  // Floating particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
    }

    const colors = [
      "rgba(59,130,246,0.3)",
      "rgba(147,51,234,0.3)",
      "rgba(236,72,153,0.3)",
      "rgba(34,197,94,0.3)",
    ];

    const particles: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)]!;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle login/register
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !company) {
      setError("Please fill in all fields.");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, include 1 uppercase letter, 1 number, and 1 symbol."
      );
      return;
    }

    try {
      if (isLogin) {
        // LOGIN endpoint
        const res = await fetch("http://localhost:8080/api/admin/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const message = await res.text();
        if (message.includes("successful")) {
          // store the company or token for session management
          localStorage.setItem("loggedInAdmin", company);
          navigate("/admin/addjob");
        } else {
          setError("Invalid credentials. Try again.");
        }
      } else {
        // REGISTER endpoint
        const res = await fetch("http://localhost:8080/api/admin/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, company }),
        });

        const message = await res.text();
        if (message.includes("success")) {
          alert("Account created successfully! You can now log in.");
          setIsLogin(true);
        } else {
          setError(message);
        }
      }
    } catch (err) {
      console.error("Admin auth error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0f0f0f 100%)",
      }}
    >
      {/* Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0, pointerEvents: "none" }}
      />

      {/* Glow orbs */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ zIndex: 1, pointerEvents: "none" }}
      >
        <div
          className="absolute rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
            top: "-300px",
            left: "-300px",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(147,51,234,0.4) 0%, transparent 70%)",
            bottom: "-250px",
            right: "-250px",
          }}
        />
      </div>

      {/* Form container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md mx-auto bg-[#1d1d1d]/60 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-100">
            {isLogin ? "Admin Login" : "Create Admin Account"}
          </h2>

          {/* Company */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-blue-200 mb-2 block">
              Company Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter your company name"
              className="w-full bg-gray-800/60 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-blue-200 mb-2 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-gray-800/60 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-blue-200 mb-2 block">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  setPasswordChecks({
                    length: val.length >= 8,
                    uppercase: /[A-Z]/.test(val),
                    number: /\d/.test(val),
                    symbol: /[!@#$%^&*(),.?\":{}|<>]/.test(val),
                  });
                }}
                placeholder="Enter your password"
                className="w-full bg-gray-800/60 border border-gray-600 rounded-lg py-2 px-3 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-400 hover:text-blue-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password strength indicators (for registration only) */}
            {!isLogin && (
              <ul className="mt-3 text-xs space-y-1">
                <li
                  className={`transition ${
                    passwordChecks.length ? "text-green-400" : "text-red-400"
                  }`}
                >
                  • At least 8 characters
                </li>
                <li
                  className={`transition ${
                    passwordChecks.uppercase
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  • At least one uppercase letter
                </li>
                <li
                  className={`transition ${
                    passwordChecks.number ? "text-green-400" : "text-red-400"
                  }`}
                >
                  • At least one number
                </li>
                <li
                  className={`transition ${
                    passwordChecks.symbol ? "text-green-400" : "text-red-400"
                  }`}
                >
                  • At least one special symbol (!@#$%^&*...)
                </li>
              </ul>
            )}
          </div>

          {error && <p className="text-red-400 text-center mb-3">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 font-medium rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:opacity-90 transition duration-300 shadow-md"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <p
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-sm text-center mt-4 text-blue-400 hover:underline cursor-pointer"
          >
            {isLogin
              ? "New admin? Create an account"
              : "Already have an account? Login here"}
          </p>

          <p
            onClick={() => navigate("/")}
            className="text-sm text-center mt-2 text-gray-400 hover:underline cursor-pointer"
          >
            ← Back to landing page
          </p>
        </form>
      </div>
    </div>
  );
}
