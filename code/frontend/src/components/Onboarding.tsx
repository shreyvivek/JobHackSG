import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Upload, Plus, X } from "lucide-react";
import { useUser } from "./UserContext";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";



const popularSkills = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "SQL",
  "AWS",
  "Docker",
  "Git",
  "REST API", "Tableau", "HTML", "CSS",  "TypeScript", "TensorFlow", "PyTorch", "DevOps", "Cloud Computing", "CyberSecurity",
  "Java",
  "C++",
  "Machine Learning",
  "Data Analysis",
  "Project Management",
  "Agile",
  "Communication",
  "Leadership",
];

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "fresh_graduate", label: "Fresh Graduate" },
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();



  const { user, setUser } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Floating particles animation (same as landing page)
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
    if (role && error === "Please select your current role") {
      setError(null);
    }
  }, [role, error]);

  const handleSkillClick = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      const newSkills = selectedSkills.filter((s) => s !== skill);
      setSelectedSkills(newSkills);
      // Clear error when at least one skill is selected (but only if it was about skills)
      if (newSkills.length > 0 && (error === "Please select at least one skill" || error === "Please select at least 2 skills")) {
        setError(null);
      }
    } else {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      // Clear error when skills are selected (for both "at least one" and "at least 2" errors)
      if (error === "Please select at least one skill" || error === "Please select at least 2 skills") {
        setError(null);
      }
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill)) {
      const newSkills = [...selectedSkills, customSkill.trim()];
      setSelectedSkills(newSkills);
      setCustomSkill("");
      // Clear error when skills are added (for both "at least one" and "at least 2" errors)
      if (error === "Please select at least one skill" || error === "Please select at least 2 skills") {
        setError(null);
      }
    }
  };

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    return null;
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    // Clear email errors when user types (for both login and registration)
    if (emailError && (emailError === "Email is required" || emailError === "User not found! Sign up!")) {
      setEmailError(null);
    }
    // Validate email format for both login and registration
    if (newEmail.trim()) {
      const error = validateEmail(newEmail);
      // If email is valid (error is null), clear any previous validation errors
      // If email is invalid, show the validation error
      setEmailError(error);
    } else {
      // When email field is empty, clear validation errors but keep "required" errors
      if (emailError && emailError !== "Email is required") {
        setEmailError(null);
      }
    }
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    
    // Clear password errors when user types (for both login and registration)
    if (passwordError && (passwordError === "Password is required" || passwordError === "Password incorrect! Try again")) {
      setPasswordError(null);
    }
    
    if (isLogin) {
      // For login, just clear errors when user types
      // Validation happens on submit
      return;
    }
    
    // Registration: validate password strength
    if (newPassword.trim()) {
      // Validate password and show validation error if needed
      const validationError = validatePassword(newPassword);
      setPasswordError(validationError);
    } else {
      // When password field is empty but user is typing, clear all password errors
      // The error will be shown again on validation if needed
      setPasswordError(null);
    }
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    // Clear error when name is entered
    if (newName.trim() && error === "Name is required") {
      setError(null);
    }
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    // Clear error when role is selected
    if (newRole && error === "Please select your current role") {
      setError(null);
    }
  };

  const handleAuth = async () => {
    // Prevent double submissions
    if (isSubmitting) {
      return;
    }

    setError(null);
    setPasswordError(null);
    setEmailError(null);
    setIsSubmitting(true);

    try {
      // Validate fields for login
      if (isLogin) {
        if (!email.trim()) {
          setIsSubmitting(false);
          setEmailError("Email is required");
          return;
        }
        if (!password.trim()) {
          setIsSubmitting(false);
          setPasswordError("Password is required");
          return;
        }
        // Validate email format for login
        const emailValidationError = validateEmail(email);
        if (emailValidationError) {
          setIsSubmitting(false);
          setEmailError(emailValidationError);
          return;
        }
      }
      
      // Validate fields for registration
      if (!isLogin) {
        if (!name.trim()) {
          setIsSubmitting(false);
          setError("Name is required");
          return;
        }
        if (!role) {
          setIsSubmitting(false);
          setError("Please select your current role");
          return;
        }
        if (selectedSkills.length === 0) {
          setIsSubmitting(false);
          setError("Please select at least one skill");
          return;
        }

        const emailValidationError = validateEmail(email);
        if (emailValidationError) {
          setIsSubmitting(false);
          setEmailError(emailValidationError);
          return;
        }

        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
          setIsSubmitting(false);
          setPasswordError(passwordValidationError);
          return;
        }
      }

      const endpoint = isLogin
        ? "http://localhost:8080/api/auth/login"
        : "http://localhost:8080/api/auth/register";

      // For login, only send email and passwordHash
      const payload = isLogin
        ? { email, passwordHash: password }
        : {
            name,
            email,
            passwordHash: password,
            role,
            skills: selectedSkills,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        // If response is not JSON, treat as error
        setIsSubmitting(false);
        const errorMsg = "Server error: Invalid response format";
        if (isLogin) {
          setError(errorMsg);
        } else {
          setError(errorMsg);
          window.alert(errorMsg);
        }
        return;
      }

      // Check for errors in response (backend may return error even with 200 status)
      if (!res.ok || (data && data.error)) {
        // Show error from backend if present
        setIsSubmitting(false);
        const errorMsg = (data && data.error) ? data.error : "Authentication failed";
        
        // Handle login-specific errors
        if (isLogin) {
          if (errorMsg === "Email is required" || errorMsg.toLowerCase().includes("email is required")) {
            setEmailError("Email is required");
          } else if (errorMsg === "Password is required" || errorMsg.toLowerCase().includes("password is required")) {
            setPasswordError("Password is required");
          } else if (errorMsg.includes("User not found") || errorMsg === "User not found! Sign up!") {
            setEmailError("User not found! Sign up!");
          } else if (errorMsg.includes("Password incorrect") || errorMsg.includes("Invalid password") || errorMsg === "Password incorrect! Try again") {
            setPasswordError("Password incorrect! Try again");
          } else {
            // For any other login errors, show generic incorrect credentials message
            setError("Incorrect email or password!");
          }
        } else {
          // Registration errors
          setError(errorMsg);
          // Only show alert for certain errors, not validation errors already displayed
          if (!errorMsg.includes("already") && !errorMsg.includes("Email")) {
            window.alert(errorMsg);
          }
        }
        return;
      }
      
      // Check if response doesn't have required fields
      if (!data || (!data.id && !data.userId)) {
        setIsSubmitting(false);
        const errorMsg = isLogin ? "Incorrect email or password!" : "Registration failed. Please try again.";
        setError(errorMsg);
        return;
      }

      // Get final skills list (from backend response or selectedSkills)
      const finalSkills = (data.skills && Array.isArray(data.skills) && data.skills.length > 0) 
        ? data.skills 
        : (selectedSkills.length > 0 ? selectedSkills : []);

      // update user globally
      const newUser = {
        id: data.userId || data.id,
        name: data.name || name,
        email: data.email || email,
        skills: finalSkills,
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      console.log("User saved to context:", newUser);

      // If skills were provided during registration and not already in backend response,
      // ensure they're saved to profile skills endpoint
      if (!isLogin && selectedSkills.length > 0 && (!data.skills || data.skills.length === 0)) {
        try {
          const skillsResponse = await fetch(
            `http://localhost:8080/api/profile/${newUser.id}/skills`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                skills: selectedSkills,
              }),
            }
          );
          const skillsData = await skillsResponse.json();
          if (skillsData.success) {
            console.log("Skills saved to profile endpoint:", selectedSkills);
          }
        } catch (skillsErr) {
          console.warn("Failed to save skills to profile endpoint:", skillsErr);
          // Don't block navigation - skills are in user context
        }
      }

      // Clear form state before navigation to prevent issues
      setIsSubmitting(false);
      onComplete(); // Move to main app
    } catch (err: any) {
      console.error("Auth error:", err);
      setIsSubmitting(false);
      
      // Handle network errors or other exceptions
      if (err.message && err.message.includes("fetch")) {
        if (isLogin) {
          setError("Incorrect email or password!");
        } else {
          setError("Network error. Please check your connection and try again.");
          window.alert("Network error. Please check your connection and try again.");
        }
      } else {
        const errorMessage = err.message || "Something went wrong. Please try again.";
        if (isLogin) {
          // For login, show generic incorrect credentials message
          setError("Incorrect email or password!");
        } else {
          // For registration
          setError(errorMessage);
          // Only show alert for actual errors, not validation errors that are already displayed
          if (!err.message || !err.message.includes("already")) {
            window.alert(errorMessage);
          }
        }
      }
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#111315] rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">JobHack</h1>
          <p className="text-blue-700">
            Find your dream job with robust skill matching, tailored to your needs!
          </p>
        </div>

        <Card
          style={{
            background: "#1d1d1d",
            color: "white",
          }}
          className="p-8 w-full card-modern"
        >
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-blue-900">
                {isLogin ? "Welcome back!" : "Create your account"}
              </h2>
              {!isLogin && (
                <>
                  <div className="mb-3">
                    <label className="text-sm font-semibold mb-2 block text-blue-900">
                      Full Name
                    </label>
                    <Input
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="text-blue-900 placeholder:text-blue-400"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="text-sm font-semibold mb-2 block text-blue-900">
                      Current Role
                    </label>
                    <select
                      style={{
                        background: "#1A1C1E",
                        color: "white",
                      }}
                      value={role}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg shadow-sm text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select your role</option>
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div className="mb-3">
                <label className="text-sm font-semibold mb-2 block text-blue-900">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className="text-blue-900 placeholder:text-blue-400"
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-sm mb-3">{emailError}</p>
              )}
              <div className="mb-3">
                <label className="text-sm font-semibold mb-2 block text-blue-900">
                  Password
                </label>
                <div className="relative w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="text-blue-900 placeholder:text-blue-400 pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-700 hover:text-blue-900"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mb-3">{passwordError}</p>
              )}
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <Button
                className="w-full mb-3 button-modern bg-purple-600 hover:bg-purple-700"
                onClick={
                  !isLogin
                    ? () => {
                        // Validate required fields before proceeding to skills step
                        if (!name.trim()) {
                          setError("Name is required");
                          return;
                        }
                        if (!role) {
                          setError("Please select your current role");
                          return;
                        }
                        // validate email
                        const emailValidationError = validateEmail(email);
                        if (emailValidationError) {
                          setEmailError(emailValidationError);
                          return;
                        }
                        // new: check for password presence and strength
                        if (!password.trim()) {
                          setPasswordError("Password is required");
                          return;
                        }
                        const passwordValidationError = validatePassword(password);
                        if (passwordValidationError) {
                          setPasswordError(passwordValidationError);
                          return;
                        }
                        // if all is good, then proceed to step 2
                        setStep(2);
                      }
                    : handleAuth
                }
                disabled={isSubmitting}
              >
                {isLogin ? (isSubmitting ? "Logging in..." : "Login") : "Continue to Skills"}
              </Button>
              <p
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-500 text-center cursor-pointer hover:underline"
              >
                {isLogin
                  ? "New user? Register here"
                  : "Already have an account? Login here"}
              </p>
              <div className="mt-2 text-center">
                <button
                  onClick={() => navigate("/admin-login")}
                  className="text-sm text-blue-500 cursor-pointer hover:underline transition"
                >
                  Admin Portal
                </button>
              </div>
            </>
          )}

          {!isLogin && step === 2 && (
            <>
              <h2 className="text-xl font-bold mb-6 text-blue-900">
                Select your skills
              </h2>
              <p className="text-sm text-blue-700 mb-4">
                Choose all skills that apply to you:
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {popularSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillClick(skill)}
                    style={{ background: "#343536ff" }}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                      selectedSkills.includes(skill)
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-blue-900 border-blue-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="flex mb-3">
                <Input
                  placeholder="Add custom skill"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  className="flex-1 text-blue-900 placeholder:text-blue-400"
                />
                <Button onClick={addCustomSkill} className="ml-2 button-modern">
                  <Plus size={16} />
                </Button>
              </div>

              {selectedSkills.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    Selected Skills ({selectedSkills.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200"
                      >
                        {skill}
                        <button
                          onClick={() => handleSkillClick(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  style={{
                    background: "#1A1C1E",
                    color: "white",
                  }}
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Back
                </Button>

                {/* Added explicit password check before calling handleAuth */}
                <Button
                  onClick={() => {
                    if (isSubmitting) return;
                    if (selectedSkills.length < 2) {
                      setError("Please select at least 2 skills");
                      return;
                    }
                    if (!password.trim()) {
                      setPasswordError("Password is required");
                      return;
                    }
                    handleAuth();
                  }}
                  className="button-modern bg-purple-600 hover:bg-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Complete Registration"}
                </Button>
              </div>

              {/*Display both skill errors and password errors */}
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              {passwordError && (
                <p className="text-red-500 text-sm mt-3">{passwordError}</p>
              )}
            </>
          )}
        </Card>
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
