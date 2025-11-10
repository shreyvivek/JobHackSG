import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Camera,
  Linkedin,
  Edit3,
  Plus,
  X,
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Save,
} from "lucide-react";
import { useUser } from "./UserContext";

const popularSkills = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "SQL",
  "AWS",
  "Docker",
  "Git",
  "TypeScript",
  "Java",
  "C++",
  "Machine Learning",
  "Data Analysis",
  "Project Management",
  "Agile",
  "Communication",
  "Leadership",
  "UI/UX Design",
];

interface UserProfile {
  userId: number;
  name: string;
  email: string;
  school: string;
  gradYear: number;
  role: string;
  skills: { name: string; level: number; source?: string }[];
  linkedinConnected: boolean;
  profilePhoto?: string | undefined;
}

export default function ProfileTab() {
  const { user, setUser } = useUser();
  const [profile, setProfile] = useState<UserProfile>({
    userId: 0,
    name: "",
    email: "",
    school: "",
    gradYear: new Date().getFullYear(),
    role: "",
    skills: [],
    linkedinConnected: false,
    profilePhoto: undefined,
  });

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditSkills, setShowEditSkills] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [tempSkills, setTempSkills] = useState<
    { name: string; level: number; source?: string }[]
  >(profile.skills);
  const [customSkill, setCustomSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load user profile on component mount or when user changes
  useEffect(() => {
    console.log("useEffect triggered for user.id:", user?.id);
    if (user?.id) {
      loadUserProfileAndSkills();
    }
  }, [user?.id]);

  const loadUserProfileAndSkills = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Fetch profile details
      const profileRes = await fetch(
        `http://localhost:8080/api/profile/${user.id}`
      );
      const profileData = await profileRes.json();
      let newProfile: UserProfile;
      if (profileData.success && profileData.user) {
        const userData = profileData.user;
        newProfile = {
          userId: userData.userId,
          name: userData.name || "",
          email: userData.email || "",
          school: userData.school || "",
          gradYear: userData.gradYear || new Date().getFullYear(),
          role: userData.role || "",
          skills: [], // will fill below
          linkedinConnected: false,
          profilePhoto: userData.profilePhoto || undefined,
        };
      } else {
        newProfile = {
          userId: user?.id || 0,
          name: user?.name || "User",
          email: user?.email || "user@example.com",
          school: "Your School",
          gradYear: new Date().getFullYear(),
          role: "",
          skills: [],
          linkedinConnected: false,
          profilePhoto: undefined,
        };
      }

      // PRIORITIZE user context skills first (most up-to-date)
      // Then fetch from backend to ensure consistency
      if (user?.skills && Array.isArray(user.skills) && user.skills.length > 0) {
        console.log("Using user context skills (most recent):", user.skills);
        newProfile.skills = user.skills.map((skill: string | { name: string }) => ({
          name: typeof skill === 'string' ? skill : skill.name,
          level: 3,
          source: "profile",
        }));
      }

      // Fetch skills from /skills endpoint to sync with backend
      try {
        const skillsRes = await fetch(
          `http://localhost:8080/api/profile/${user.id}/skills`
        );
        const skillsData = await skillsRes.json();
        console.log("Fetched skills data from backend:", skillsData);
        if (skillsData.success && Array.isArray(skillsData.skills)) {
          // If user context has skills, prefer them (they're more recent)
          // Only use backend if user context is empty or backend has significantly more skills
          // This prevents overriding recently saved skills with stale backend data
          if (!user?.skills || user.skills.length === 0) {
            // User context empty, use backend
            console.log("User context empty, using backend skills");
            newProfile.skills = skillsData.skills.map((name: string) => ({
              name,
              level: 3,
              source: "profile",
            }));
          } else if (skillsData.skills.length > user.skills.length + 2) {
            // Backend has significantly more skills (likely updated elsewhere)
            console.log("Backend has significantly more skills, using backend");
            newProfile.skills = skillsData.skills.map((name: string) => ({
              name,
              level: 3,
              source: "profile",
            }));
            // Also update user context with backend skills
            if (setUser && user) {
              const updatedUser = {
                ...user,
                skills: skillsData.skills,
              };
              setUser(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
            }
          } else {
            // User context has skills, merge with backend to ensure all skills are included
            // This ensures custom skills from user context are preserved
            const allSkills = Array.from(new Set([...user.skills, ...skillsData.skills]));
            console.log("Merging user context and backend skills:", allSkills);
            newProfile.skills = allSkills.map((name: string) => ({
              name,
              level: 3,
              source: "profile",
            }));
            // Update user context with merged skills
            if (setUser && user && allSkills.length > user.skills.length) {
              const updatedUser = {
                ...user,
                skills: allSkills,
              };
              setUser(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
            }
          }
        } else if (!user?.skills || (user.skills && user.skills.length === 0)) {
          // Backend returned empty, but user context also empty - try localStorage
          console.log("Backend returned empty, checking localStorage");
          try {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
              const userObj = JSON.parse(savedUser);
              if (userObj.skills && Array.isArray(userObj.skills) && userObj.skills.length > 0) {
                console.log("Using localStorage skills as final fallback");
                newProfile.skills = userObj.skills.map((skill: string | { name: string }) => ({
                  name: typeof skill === 'string' ? skill : skill.name,
                  level: 3,
                  source: "profile",
                }));
              }
            }
          } catch (localErr) {
            console.error("Error loading skills from localStorage:", localErr);
          }
        }
      } catch (skillsErr) {
        console.error("Skills fetch error:", skillsErr);
        // If user context has skills, we already set them above, so keep them
        // If not, try localStorage as final fallback
        if ((!user?.skills || user.skills.length === 0)) {
          try {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
              const userObj = JSON.parse(savedUser);
              if (userObj.skills && Array.isArray(userObj.skills) && userObj.skills.length > 0) {
                console.log("Using localStorage skills after API error");
                newProfile.skills = userObj.skills.map((skill: string | { name: string }) => ({
                  name: typeof skill === 'string' ? skill : skill.name,
                  level: 3,
                  source: "profile",
                }));
              }
            }
          } catch (localErr) {
            console.error("Error loading skills from localStorage:", localErr);
          }
        }
      }

      setProfile(newProfile);
      setTempProfile(newProfile);
      setTempSkills(newProfile.skills);
      console.log("Loaded profile:", newProfile);
    } catch (err) {
      console.error("Profile/skills load error:", err);
      // fallback to default
      const defaultProfile: UserProfile = {
        userId: user?.id || 0,
        name: user?.name || "User",
        email: user?.email || "user@example.com",
        school: "Your School",
        gradYear: new Date().getFullYear(),
        role: "",
        skills: [],
        linkedinConnected: false,
        profilePhoto: undefined,
      };
      setProfile(defaultProfile);
      setTempProfile(defaultProfile);
      setTempSkills(defaultProfile.skills);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:8080/api/profile/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: tempProfile.name,
            email: tempProfile.email,
            school: tempProfile.school,
            gradYear: tempProfile.gradYear,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setProfile(tempProfile);
        setShowEditProfile(false);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile save error:", err);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSkillsSave = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Update user context FIRST - this ensures ForYouTab and SearchTab update immediately
      const skillNames = tempSkills.map((s) => s.name);
      if (setUser && user) {
        const updatedUser = {
          ...user,
          skills: skillNames,
        };
        setUser(updatedUser);
        // Also update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      // Update the profile state - convert skill names back to objects for display
      const updatedSkills = skillNames.map((name: string) => ({
        name,
        level: 3,
        source: "profile",
      }));
      setProfile({ ...profile, skills: updatedSkills });
      setTempProfile({ ...profile, skills: updatedSkills });
      setShowEditSkills(false);
      setSuccess("Skills updated successfully!");
      setTimeout(() => setSuccess(null), 3000);

      // Then try to save to backend
      const response = await fetch(
        `http://localhost:8080/api/profile/${user.id}/skills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skills: skillNames,
          }),
        }
      );

      // If backend save fails, we've already updated the UI
      const data = await response.json();

      if (!data.success) {
        console.warn("Backend skills save warning:", data.error);
        // Even if backend save fails, we've updated user context and profile state
        // So the UI should still show the correct skills
      }
      // Don't reload immediately after save - the state is already updated
      // Reload will happen naturally when user navigates back to profile tab
    } catch (err) {
      console.error("Skills save error:", err);
      // Don't revert the UI - keep the skills visible even if backend save failed
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (skill: string) => {
    if (!tempSkills.some((s) => s.name === skill)) {
      setTempSkills([
        ...tempSkills,
        { name: skill, level: 3, source: "manual" },
      ]);
    }
  };

  const removeSkill = (skill: string) => {
    setTempSkills(tempSkills.filter((s) => s.name !== skill));
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !tempSkills.some((s) => s.name === trimmed)) {
      setTempSkills([
        ...tempSkills,
        { name: trimmed, level: 3, source: "manual" },
      ]);
      setCustomSkill("");
    }
  };

  // Remove handleResumeUpload and setUploadError (not used in UI)

  if (loading && !profile.name) {
    return (
      <div
        style={{
          background: "#1c1e1c",
          color: "white",
        }}
        className="p-4 pb-20 space-y-6"
      >
        <div
          style={{
            background: "#1c1e1c",
            color: "white",
          }}
          className="text-center py-8"
        >
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#1e1f20ff",
        color: "white",
      }}
      className="p-4 pb-20 space-y-6"
    >
      <div className="text-center mb-6">
        <h1 className="mb-2 text-4xl font-bold text-blue-900">Profile</h1>
        <p className="text-lg text-blue-700">
          Manage your professional profile
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      {/* Profile Header */}
      <Card
        style={{
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 50%, rgba(236, 72, 153, 0.1) 100%)",
          color: "white",
          border: "1px solid rgba(77, 147, 244, 0.3)",
        }}
        className="p-6 shadow-lg backdrop-blur-sm"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-blue-200">
              <AvatarImage src={profile.profilePhoto} />
              <AvatarFallback className="text-lg bg-blue-200 text-blue-800">
                {profile.name
                  ? profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                /* Photo upload functionality */
              }}
            >
              <Camera className="w-4 h-4 text-white" />
            </Button>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">
              {profile.name}
            </h2>
            <div className="flex items-center justify-center gap-1 text-sm text-gray-200">
              <Mail className="w-4 h-4" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-sm text-gray-200">
              <Briefcase className="w-4 h-4" />
              <span>
                {profile.role} • {profile.school} • {profile.gradYear}
              </span>
            </div>
            {/* Display skills here */}
            {profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {profile.skills.map((skillObj, idx) => (
                  <Badge
                    key={skillObj.name + idx}
                    className="bg-blue-100 text-blue-800 border-blue-200 font-semibold"
                  >
                    {skillObj.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Dialog
            style={{
              background: "#1a1c1e",
              color: "white",
            }}
            open={showEditProfile}
            onOpenChange={setShowEditProfile}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                style={{
                  background: "#1a1c1e",
                  color: "white",
                }}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent
              style={{
                background: "#1a1c1e",
                color: "white",
              }}
              className="max-h-[80vh] overflow-y-auto"
            >
              {/* <DialogHeader
                style={{
                  background: "#1a1c1e",
                  color: "white !important",
                }}
              >
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader> */}
              <div
                style={{
                  color: "white",
                }}
                className="space-y-4"
              >
                <div
                  style={{
                    color: "white",
                  }}
                >
                  <label className="text-sm mb-1 block font-semibold ">
                    Full Name
                  </label>
                  <Input
                    value={tempProfile.name}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm mb-1 block font-semibold ">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm mb-1 block font-semibold ">
                    School/University
                  </label>
                  <Input
                    value={tempProfile.school}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, school: e.target.value })
                    }
                    placeholder="Enter your school or university"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm mb-1 block font-semibold ">
                    Graduation Year
                  </label>
                  <Input
                    type="number"
                    value={tempProfile.gradYear}
                    onChange={(e) =>
                      setTempProfile({
                        ...tempProfile,
                        gradYear:
                          parseInt(e.target.value) || new Date().getFullYear(),
                      })
                    }
                    placeholder="Enter graduation year"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <Button
                  onClick={handleProfileSave}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Skills Section */}
      <Card
        style={{
          backdropFilter: "blur(10px)",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 50%, rgba(236, 72, 153, 0.1) 100%)",
          color: "white",
          border: "1px solid rgba(77, 147, 244, 0.3)",
        }}
        className="p-4 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Skills</h3>
          <Dialog
            style={{
              background: "#1a1c1e",
              color: "white",
            }}
            open={showEditSkills}
            onOpenChange={setShowEditSkills}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                style={{
                  backdropFilter: "blur(10px)",
                  background: "rgba(26, 28, 30, 0.6)",
                  color: "white",
                }}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Skills
              </Button>
            </DialogTrigger>
            <DialogContent
              style={{
                background: "#1a1c1e",
                color: "white",
              }}
              className="max-h-[80vh] overflow-y-auto"
            >
              {/* <DialogHeader>
                <DialogTitle>Edit Skills</DialogTitle>
              </DialogHeader> */}
              <div className="space-y-4">
                <div>
                  <h4 className="mb-3">Your Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {tempSkills.map((skillObj, idx) => (
                      <Badge
                        key={skillObj.name + idx}
                        className="cursor-pointer"
                        onClick={() => removeSkill(skillObj.name)}
                      >
                        {skillObj.name}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Add Custom Skill</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter skill"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
                    />
                    <Button size="sm" onClick={addCustomSkill}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Popular Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {popularSkills.map((skill) => {
                      const hasSkill = tempSkills.some((s) => s.name === skill);
                      return (
                        <Badge
                          key={skill}
                          variant={hasSkill ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() =>
                            hasSkill ? removeSkill(skill) : addSkill(skill)
                          }
                        >
                          {skill}
                          {hasSkill && <X className="w-3 h-3 ml-1" />}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={handleSkillsSave}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Skills"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.skills.length > 0 ? (
            profile.skills.map((skillObj, idx) => (
              <Badge
                key={skillObj.name + idx}
                className="bg-blue-100 text-blue-800 border-blue-200 font-semibold"
              >
                {skillObj.name}
              </Badge>
            ))
          ) : (
            <p className="text-blue-700 text-sm italic">
              No skills added yet. Click "Edit Skills" to add your skills!
            </p>
          )}
        </div>
      </Card>

      {/* Additional Profile Info Card - Fancy Design */}
      <Card
        style={{
          backdropFilter: "blur(10px)",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
          color: "white",
          border: "1px solid rgba(59, 130, 246, 0.3)",
        }}
        className="p-6 border-2 border-blue-200 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Profile Overview</h3>
              <p className="text-sm text-gray-300">Your professional identity</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Education</span>
            </div>
            <p className="text-white font-semibold">
              {profile.school || "Not set"}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
              <Briefcase className="w-4 h-4" />
              <span>Role</span>
            </div>
            <p className="text-white font-semibold">
              {profile.role || "Not set"}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
              <FileText className="w-4 h-4" />
              <span>Skills</span>
            </div>
            <p className="text-white font-semibold">
              {profile.skills.length} {profile.skills.length === 1 ? "skill" : "skills"}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </div>
            <p className="text-white font-semibold text-xs truncate">
              {profile.email || "Not set"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
