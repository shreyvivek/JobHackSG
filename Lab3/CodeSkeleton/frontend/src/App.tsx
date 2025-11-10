import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import MobileNavigation from './components/MobileNavigation';
import TrendsTab from './components/TrendsTab';
import ForYouTab from './components/ForYouTab';
import SearchTab from './components/SearchTab';
import ApplicationsTab from './components/ApplicationsTab';
import ProfileTab from './components/ProfileTab';
import JobDetails from './components/JobDetails';
import SavedTab from './components/SavedTab'; // <-- import your real SavedTab
import { SavedJobsProvider } from './components/SavedJobsContext';
import { SectorProvider } from "./components/SectorContext";

type ViewState = 'onboarding' | 'home' | 'job-details' | 'sector-details';
type Tab = 'foryou' | 'trends' | 'search' | 'saved' | 'applications' | 'profile';



export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('onboarding');
  const [activeTab, setActiveTab] = useState<Tab>('foryou');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);

  const handleOnboardingComplete = () => setCurrentView('home');
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as Tab);
    if (currentView !== 'home') setCurrentView('home');
  };
  const handleJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setCurrentView('job-details');
  };
  const handleSectorClick = (sectorId: string) => {
    setSelectedSectorId(sectorId);
    setActiveTab('search'); // redirect to search tab with filter
  };
  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedJobId(null);
    setSelectedSectorId(null);
  };

  return (
    <SavedJobsProvider>
      <SectorProvider>
      {/* Onboarding */}
      {currentView === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {/* Job details */}
      {currentView === 'job-details' && selectedJobId && (
        <JobDetails jobId={selectedJobId} onBack={handleBackToHome} />
      )}

      {/* Main app */}
      {currentView === 'home' && (
        <div className="min-h-screen">
          {/* Tabs */}
          {activeTab === 'foryou' && <ForYouTab onJobClick={handleJobClick} />}
          {activeTab === 'trends' && <TrendsTab onSectorClick={handleSectorClick} />}
          {activeTab === 'search' && <SearchTab onJobClick={handleJobClick} />}
          {activeTab === 'saved' && <SavedTab />}
          {activeTab === 'applications' && <ApplicationsTab />}
          {activeTab === 'profile' && <ProfileTab />}

          {/* Bottom Nav */}
          <MobileNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}
      </SectorProvider>
    </SavedJobsProvider>
  );

}


