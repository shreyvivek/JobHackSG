import React from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  TrendingUp,
  Search,
  Bookmark,
  FileText,
  UserCircle,
} from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileNavigation({
  activeTab,
  onTabChange,
}: MobileNavigationProps) {
  const tabs = [
    {
      id: "foryou",
      label: "For You",
      icon: User,
      blueShade: "gradient-blue-medium",
    },
    {
      id: "trends",
      label: "Trends",
      icon: TrendingUp,
      blueShade: "gradient-blue-light",
    },
    {
      id: "search",
      label: "Search",
      icon: Search,
      blueShade: "gradient-blue-dark",
    },
    { id: "saved", label: "Saved", icon: Bookmark, blueShade: "bg-blue-200" },
    {
      id: "profile",
      label: "Profile",
      icon: UserCircle,
      blueShade: "bg-blue-300",
    },
  ];

  const { user, setUser } = useUser();
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/onboarding");
  };
  const navigate = useNavigate();

  const handleTabClick = (tabId: string) => {
    console.log("Tab clicked:", user);
    if (tabId === "profile" && user?.id) {
      onTabChange("profile");
      navigate(`/profile/${user.id}`);
    } else {
      onTabChange(tabId);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#383838ff",
      }}
      className="fixed bottom-0 left-0 right-0 !bg-red-500 z-50 border-t-2 border-gray-700 shadow-lg z-50"
    >
      <div className="flex !bg-red-500 items-center justify-around py-4 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-2 rounded-xl transition-all duration-300 ${
              activeTab === tab.id ? "transform scale-105" : "hover:bg-white/10"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-blue-600 shadow-lg scale-110"
                  : "bg-black"
              }`}
            >
              <tab.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold text-white">
              {tab.label}
            </span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-2 rounded-xl transition-all duration-300 hover:bg-white/10"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1 bg-red-600 shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
          </div>
          <span className="text-xs font-semibold text-white">Logout</span>
        </button>
      </div>
    </div>
  );
}
