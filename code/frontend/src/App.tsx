import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Onboarding from "./components/Onboarding";
import MobileNavigation from "./components/MobileNavigation";
import TrendsTab from "./components/TrendsTab";
import ForYouTab from "./components/ForYouTab";
import SearchTab from "./components/SearchTab";
import ApplicationsTab from "./components/ApplicationsTab";
import ProfileTab from "./components/ProfileTab";
import JobDetailsPage from "./components/JobDetailsPage";
import SavedTab from "./components/SavedTab";
import { SavedJobsProvider } from "./components/SavedJobsContext";
import { SectorProvider } from "./components/SectorContext";
import AdminAddJob from "./components/AdminAddJob";
import AdminLogin from "./components/AdminLogin";


function RequireAuth({ children }: { children: React.ReactNode }) {
  // Check if user exists in localStorage
  const user = localStorage.getItem("user");
  const location = useLocation();
  if (!user) {
    // Redirect to onboarding if not authenticated
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("foryou");
  const navigate = useNavigate();

  // Sync activeTab with current route
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/profile")) {
      setActiveTab("profile");
    } else if (path === "/foryou") {
      setActiveTab("foryou");
    } else if (path === "/trends") {
      setActiveTab("trends");
    } else if (path === "/search") {
      setActiveTab("search");
    } else if (path === "/saved") {
      setActiveTab("saved");
    }
  }, [location.pathname]);

  // Handle tab change by navigating to the correct route
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <div
      style={{
        background: "#171717ff",
        color: "white",
      }}
      className="min-h-screen"
    >
      <SavedJobsProvider>
        <SectorProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/onboarding"
              element={<Onboarding onComplete={() => navigate("/foryou")} />}
            />
            <Route
              path="/job/:jobId"
              element={
                <RequireAuth>
                  <JobDetailsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/foryou"
              element={
                <RequireAuth>
                  <>
                    <ForYouTab
                      onJobClick={(jobId: string) => navigate(`/job/${jobId}`)}
                    />
                    <MobileNavigation
                      activeTab={activeTab}
                      onTabChange={handleTabChange}
                    />
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/trends"
              element={
                <RequireAuth>
                  <>
                    <TrendsTab onSectorClick={() => setActiveTab("search")} />
                    <MobileNavigation
                      activeTab={activeTab}
                      onTabChange={handleTabChange}
                    />
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/search"
              element={
                <RequireAuth>
                  <>
                    <SearchTab
                      onJobClick={(jobId: string) => navigate(`/job/${jobId}`)}
                    />
                    <MobileNavigation
                      activeTab={activeTab}
                      onTabChange={handleTabChange}
                    />
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/saved"
              element={
                <RequireAuth>
                  <>
                    <SavedTab />
                    <MobileNavigation
                      activeTab={activeTab}
                      onTabChange={handleTabChange}
                    />
                  </>
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <>
                    <ProfileTab />
                    <MobileNavigation
                      activeTab={activeTab}
                      onTabChange={handleTabChange}
                    />
                  </>
                </RequireAuth>
              }
            />
            <Route path="/admin/addjob" element={<AdminAddJob />} />
            <Route path="/AdminAddJob" element={<Navigate to="/admin/addjob" replace />} />
            <Route
              path="/profile/:id"
              element={
                <RequireAuth>
                  <>
                    <ProfileTab />
                    <MobileNavigation
                      activeTab={activeTab}
                      onTabChange={handleTabChange}
                    />
                  </>
                </RequireAuth>
              }
            />
            <Route path="/admin-login" element={<AdminLogin />} />
          </Routes>
        </SectorProvider>
      </SavedJobsProvider>
    </div>
  );
}
