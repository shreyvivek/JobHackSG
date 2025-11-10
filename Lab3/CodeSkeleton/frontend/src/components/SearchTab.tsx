import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, Building, Sparkles, DollarSign, Briefcase, X } from 'lucide-react';
import { useSavedJobs } from "./SavedJobsContext";
import { useSector } from "./SectorContext";


interface SearchFilters {
  location: string;
  sector: string;
  jobTypes: string[];
  salaryRange: [number, number];
  recency: string;
  sortBy: string;
}

interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  type: string;
  sector: string;
  postedDays: number;
  description: string;
  companyLogo: string;
  blueShade: string;
}

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  sector: string;
}

const jobResults: JobResult[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'InnovateTech',
    location: 'Austin, TX',
    salary: '$95k - $125k',
    salaryMin: 95000,
    salaryMax: 125000,
    type: 'Full-time',
    sector: 'Technology',
    postedDays: 1,
    description: 'Build scalable web applications using React and modern JavaScript...',
    companyLogo: '🚀',
    blueShade: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    id: '2',
    title: 'Python Backend Engineer',
    company: 'DataFlow Systems',
    location: 'Remote',
    salary: '$85k - $115k',
    salaryMin: 85000,
    salaryMax: 115000,
    type: 'Full-time',
    sector: 'Technology',
    postedDays: 3,
    description: 'Develop high-performance APIs and microservices...',
    companyLogo: '🐍',
    blueShade: 'bg-gradient-to-br from-blue-400 to-blue-500'
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'CloudFirst',
    location: 'Denver, CO',
    salary: '$100k - $130k',
    salaryMin: 100000,
    salaryMax: 130000,
    type: 'Contract',
    sector: 'Technology',
    postedDays: 2,
    description: 'Manage cloud infrastructure and CI/CD pipelines...',
    companyLogo: '☁️',
    blueShade: 'bg-gradient-to-br from-blue-600 to-blue-700'
  },
  {
    id: '4',
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    location: 'Los Angeles, CA',
    salary: '$70k - $90k',
    salaryMin: 70000,
    salaryMax: 90000,
    type: 'Full-time',
    sector: 'Design',
    postedDays: 5,
    description: 'Create beautiful and intuitive user experiences...',
    companyLogo: '🎨',
    blueShade: 'bg-gradient-to-br from-blue-700 to-blue-800'
  },
  {
    id: '5',
    title: 'Marketing Manager',
    company: 'GrowthCorp',
    location: 'New York, NY',
    salary: '$75k - $95k',
    salaryMin: 75000,
    salaryMax: 95000,
    type: 'Full-time',
    sector: 'Marketing',
    postedDays: 1,
    description: 'Lead digital marketing campaigns and brand strategy...',
    companyLogo: '📈',
    blueShade: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    id: '6',
    title: 'Financial Analyst',
    company: 'FinanceHub',
    location: 'Chicago, IL',
    salary: '$65k - $85k',
    salaryMin: 65000,
    salaryMax: 85000,
    type: 'Part-time',
    sector: 'Finance',
    postedDays: 4,
    description: 'Analyze financial data and create investment reports...',
    companyLogo: '💰',
    blueShade: 'bg-gradient-to-br from-blue-400 to-blue-500'
  },
  {
    id: '7',
    title: 'Data Scientist',
    company: 'AI Innovations',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    salaryMin: 120000,
    salaryMax: 150000,
    type: 'Full-time',
    sector: 'Technology',
    postedDays: 2,
    description: 'Build machine learning models and analyze big data...',
    companyLogo: '🤖',
    blueShade: 'bg-gradient-to-br from-blue-600 to-blue-700'
  },
  {
    id: '8',
    title: 'Project Manager',
    company: 'BuildRight',
    location: 'Seattle, WA',
    salary: '$80k - $100k',
    salaryMin: 80000,
    salaryMax: 100000,
    type: 'Contract',
    sector: 'Construction',
    postedDays: 6,
    description: 'Manage construction projects from planning to completion...',
    companyLogo: '🏗️',
    blueShade: 'bg-gradient-to-br from-blue-700 to-blue-800'
  }
];

interface SearchTabProps {
  onJobClick: (jobId: string) => void;
  onSaveJob?: (job: SavedJob) => void;
}

export default function SearchTab({ onJobClick, onSaveJob }: SearchTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    sector: 'all',
    jobTypes: [],
    salaryRange: [30000, 200000],
    recency: 'any',
    sortBy: 'relevance'
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<JobResult[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const { addJob } = useSavedJobs();
  const { selectedSector } = useSector();


  const sectors = [
    'Technology',
    'Finance',
    'Healthcare',
    'Marketing',
    'Design',
    'Sales',
    'Education',
    'Construction',
    'Retail',
    'Manufacturing'
  ];

  const jobTypeOptions = [
    { id: 'Full-time', label: 'Full-time' },
    { id: 'Part-time', label: 'Part-time' },
    { id: 'Contract', label: 'Contract' },
    { id: 'Freelance', label: 'Freelance' },
    { id: 'Internship', label: 'Internship' }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Part-time': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Contract': return 'bg-blue-200 text-blue-800 border-blue-300';
      case 'Remote': return 'bg-blue-150 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    if (checked) {
      setFilters({ ...filters, jobTypes: [...filters.jobTypes, jobType] });
    } else {
      setFilters({ ...filters, jobTypes: filters.jobTypes.filter(type => type !== jobType) });
    }
  };

  const formatSalary = (amount: number) => {
    return `$${(amount / 1000).toFixed(0)}k`;
  };

  // const addJob = (job: SavedJob) => {
  //  if (!savedJobs.find(j => j.id === job.id)) {
  //    setSavedJobs([...savedJobs, job]);
  //  }
  // };

  

useEffect(() => {
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Start from your hardcoded list or fetched dataset
      let filtered = jobResults.filter((job) => {
        const matchesQuery =
          !searchQuery ||
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.sector.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocation =
          !filters.location ||
          job.location.toLowerCase().includes(filters.location.toLowerCase());

        const matchesSector =
          filters.sector === "all" || job.sector === filters.sector;

        const matchesType =
          filters.jobTypes.length === 0 ||
          filters.jobTypes.includes(job.type);

        const matchesSalary =
          job.salaryMin >= filters.salaryRange[0] &&
          job.salaryMax <= filters.salaryRange[1];

        const matchesRecency =
          filters.recency === "any" ||
          (filters.recency === "1day" && job.postedDays <= 1) ||
          (filters.recency === "3days" && job.postedDays <= 3) ||
          (filters.recency === "7days" && job.postedDays <= 7);

        return (
          matchesQuery &&
          matchesLocation &&
          matchesSector &&
          matchesType &&
          matchesSalary &&
          matchesRecency
        );
      });

      // ✅ Auto-filter if user came from TrendsTab (selectedSector)
      if (selectedSector && selectedSector.trim().toLowerCase() !== "all") {
        filtered = filtered.filter(
          (job) =>
            job.sector.trim().toLowerCase() ===
            selectedSector.trim().toLowerCase()
        );
      }

      // ✅ Sorting logic
      filtered = filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case "date":
            return a.postedDays - b.postedDays;
          case "salary":
            return (
              (b.salaryMin + b.salaryMax) / 2 -
              (a.salaryMin + a.salaryMax) / 2
            );
          default:
            return 0;
        }
      });

      setResults(filtered);
    } catch {
      setError("Job search service is unavailable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, [searchQuery, filters, selectedSector]); // ✅ include selectedSector dependency



   
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-blue-900">Find Your Dream Job</h1>
          <p className="text-blue-600">Search through thousands of opportunities</p>
        </div>

        {/* Search and filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-white shadow-lg border-0 rounded-xl text-gray-800 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full h-12 bg-white shadow-lg border border-blue-200 rounded-xl hover:bg-blue-50 text-blue-700 font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters & Sort
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg border-0 p-6 space-y-6">
            {/* Location and Sector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block text-blue-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, State, or Remote"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold mb-2 block text-blue-900 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Sector
                </label>
                <select 
                  value={filters.sector} 
                  onChange={(e) => setFilters({...filters, sector: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All sectors</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="text-sm font-semibold mb-3 block text-blue-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Salary Range: {formatSalary(filters.salaryRange[0])} - {formatSalary(filters.salaryRange[1])}
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min={30000}
                  max={200000}
                  step={5000}
                  value={filters.salaryRange[1]}
                  onChange={(e) => setFilters({...filters, salaryRange: [filters.salaryRange[0], parseInt(e.target.value)]})}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-blue-600 mt-2">
                  <span>$30k</span>
                  <span>$200k</span>
                </div>
              </div>
            </div>

            {/* Job Types */}
            <div>
              <label className="text-sm font-semibold mb-3 block text-blue-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Job Types
              </label>
              <div className="grid grid-cols-2 gap-3">
                {jobTypeOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={filters.jobTypes.includes(option.id)}
                      onChange={(e) => handleJobTypeChange(option.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={option.id}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Posted Date and Sort */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block text-blue-900 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Posted
                </label>
                <select 
                  value={filters.recency} 
                  onChange={(e) => setFilters({...filters, recency: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="any">Any time</option>
                  <option value="1day">Last 24 hours</option>
                  <option value="3days">Last 3 days</option>
                  <option value="7days">Last week</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-semibold mb-2 block text-blue-900 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Sort by
                </label>
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Most recent</option>
                  <option value="salary">Highest salary</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <button 
              onClick={() => setFilters({
                location: '',
                sector: 'all',
                jobTypes: [],
                salaryRange: [30000, 200000],
                recency: 'any',
                sortBy: 'relevance'
              })}
              className="w-full py-2 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-50 font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Active filters display */}
        {(filters.location || (filters.sector !== 'all') || filters.jobTypes.length > 0 || filters.salaryRange[0] > 30000 || filters.salaryRange[1] < 200000 || (filters.recency !== 'any')) && (
          <div className="bg-white rounded-xl shadow-lg border-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-blue-700" />
              <span className="text-sm font-semibold text-blue-900">Active Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.location && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm">
                  📍 {filters.location}
                </span>
              )}
              {filters.sector !== 'all' && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm">
                  🏢 {filters.sector}
                </span>
              )}
              {filters.jobTypes.map(type => (
                <span key={type} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm">
                  💼 {type}
                </span>
              ))}
              {(filters.salaryRange[0] > 30000 || filters.salaryRange[1] < 200000) && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm">
                  💰 {formatSalary(filters.salaryRange[0])} - {formatSalary(filters.salaryRange[1])}
                </span>
              )}
              {filters.recency !== 'any' && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm">
                  ⏰ {filters.recency === '1day' ? 'Last 24h' : filters.recency === '3days' ? 'Last 3 days' : 'Last week'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-semibold text-blue-900">
              {results.length} jobs found
            </span>
          </div>
        </div>

        {/* Job results */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center text-blue-600 py-8">Loading jobs...</div>
          )}

          {error && (
            <div className="bg-white rounded-xl shadow-lg border-0 p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg border-0 p-8 text-center">
              <h3 className="text-xl font-semibold mb-2 text-blue-900">No jobs found</h3>
              <p className="text-blue-600 mb-4">
                Try adjusting your filters or search terms to find more results.
              </p>
              <button 
                onClick={() => setFilters({
                  location: '',
                  sector: 'all',
                  jobTypes: [],
                  salaryRange: [30000, 200000],
                  recency: 'any',
                  sortBy: 'relevance'
                })}
                className="px-4 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 text-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {!loading && !error && results.map(job => (
            <div key={job.id} className="bg-white rounded-xl shadow-lg p-6 space-y-4 hover:shadow-xl transition-shadow">
              {/* job header */}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${job.blueShade} flex items-center justify-center text-white shadow-md`}>
                  <span className="text-xl">{job.companyLogo}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{job.company}</span>
                  </div>
                </div>
              </div>

              {/* details */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
                <Clock className="w-4 h-4" />
                <span>{job.postedDays}d ago</span>
                <span className="px-2 py-1 border border-gray-300 rounded-md text-xs">{job.sector}</span>
              </div>

              {/* salary + type */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-gray-900">{job.salary}</span>
                <span className={`px-3 py-1 border rounded-md text-sm ${getTypeColor(job.type)}`}>{job.type}</span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>

              <div className="flex gap-3">
                <button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
                  onClick={() => setSelectedJob(job.id)}
                >
                  View Details
                </button>
                <button
                  className="flex-1 border border-blue-300 text-blue-700 hover:bg-blue-50 font-medium py-2 rounded-lg transition-colors"
                  onClick={() =>
                    addJob({
                      id: job.id,
                      title: job.title,
                      company: job.company,
                      location: job.location,
                      sector: job.sector,
                    })
                  }
                >
                  Save Job
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}