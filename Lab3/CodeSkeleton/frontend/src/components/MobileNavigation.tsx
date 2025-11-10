import React from 'react';
import { User, TrendingUp, Search, Bookmark, FileText, UserCircle } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  const tabs = [
    { id: 'foryou', label: 'For You', icon: User, blueShade: 'gradient-blue-medium' },
    { id: 'trends', label: 'Trends', icon: TrendingUp, blueShade: 'gradient-blue-light' },
    { id: 'search', label: 'Search', icon: Search, blueShade: 'gradient-blue-dark' },
    { id: 'saved', label: 'Saved', icon: Bookmark, blueShade: 'bg-blue-200' },
    { id: 'applications', label: 'Apps', icon: FileText, blueShade: 'gradient-blue-darker' },
    { id: 'profile', label: 'Profile', icon: UserCircle, blueShade: 'bg-blue-300' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-blue-200 z-50 shadow-blue">
      <div className="flex items-center justify-around py-3 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-2 rounded-xl transition-all duration-300 ${
              activeTab === tab.id
                ? 'transform scale-105'
                : 'hover:bg-blue-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-all duration-300 ${
              activeTab === tab.id 
                ? `${tab.blueShade} shadow-lg scale-110` 
                : 'bg-blue-100'
            }`}>
              <tab.icon className={`w-4 h-4 transition-colors duration-300 ${
                activeTab === tab.id ? 'text-white' : 'text-blue-medium'
              }`} />
            </div>
            <span className={`text-xs font-semibold transition-colors duration-300 ${
              activeTab === tab.id
                ? 'text-blue-darker'
                : 'text-blue-medium'
            }`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}