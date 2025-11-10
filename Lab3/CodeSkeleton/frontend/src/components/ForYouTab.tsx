import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Clock, Building, Star, Zap, Target } from 'lucide-react';

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  postedDays: number;
  type: string;
  companyLogo: string;
  blueShade: string;
}

const recommendations: JobRecommendation[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$90k - $120k',
    matchPercentage: 95,
    matchedSkills: ['JavaScript', 'React', 'TypeScript'],
    missingSkills: ['Vue.js'],
    postedDays: 2,
    type: 'Full-time',
    companyLogo: '🚀',
    blueShade: 'gradient-blue-medium'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$80k - $110k',
    matchPercentage: 87,
    matchedSkills: ['JavaScript', 'Node.js', 'Python'],
    missingSkills: ['GraphQL', 'Kubernetes'],
    postedDays: 1,
    type: 'Full-time',
    companyLogo: '⚡',
    blueShade: 'gradient-blue-dark'
  },
  {
    id: '3',
    title: 'React Developer',
    company: 'WebSolutions',
    location: 'New York, NY',
    salary: '$75k - $95k',
    matchPercentage: 92,
    matchedSkills: ['React', 'JavaScript', 'Git'],
    missingSkills: ['Next.js'],
    postedDays: 4,
    type: 'Contract',
    companyLogo: '🎯',
    blueShade: 'gradient-blue-light'
  },
  {
    id: '4',
    title: 'Software Engineer',
    company: 'BigTech Inc',
    location: 'Seattle, WA',
    salary: '$110k - $140k',
    matchPercentage: 78,
    matchedSkills: ['Python', 'SQL'],
    missingSkills: ['Java', 'Spring Boot', 'Microservices'],
    postedDays: 3,
    type: 'Full-time',
    companyLogo: '🏢',
    blueShade: 'gradient-blue-darker'
  }
];

interface ForYouTabProps {
  onJobClick: (jobId: string) => void;
}

export default function ForYouTab({ onJobClick }: ForYouTabProps) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-blue-dark text-white';
    if (percentage >= 80) return 'bg-blue-medium text-white';
    if (percentage >= 70) return 'bg-blue-light text-blue-darker';
    return 'bg-blue-100 text-blue-darker';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time': return 'bg-blue-100 text-blue-darker border-blue-200';
      case 'Part-time': return 'bg-blue-50 text-blue-dark border-blue-100';
      case 'Contract': return 'bg-blue-200 text-blue-darker border-blue-300';
      case 'Remote': return 'bg-blue-150 text-blue-darker border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20 space-y-6">
      {/* Header with blue theme */}
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-dark rounded-2xl flex items-center justify-center shadow-blue">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-blue-darker mb-2">Perfect Matches</h1>
        <p className="text-blue-medium">Jobs tailored specifically for your skills</p>
      </div>

      <div className="space-y-4">
        {recommendations.map((job, index) => (
          <Card key={job.id} className="card-blue shadow-blue border-0 overflow-hidden">
            <div className="p-6 space-y-4">
              {/* Header with company logo and match */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-12 h-12 rounded-xl ${job.blueShade} flex items-center justify-center text-white shadow-lg`}>
                    <span className="text-xl">{job.companyLogo}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-1 text-blue-darker font-semibold">{job.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-blue-medium">
                      <Building className="w-4 h-4" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(job.matchPercentage)} shadow-lg`}>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>{job.matchPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Job details */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-blue-medium">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{job.postedDays}d ago</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-blue-darker">{job.salary}</span>
                  <Badge className={`${getTypeColor(job.type)} border font-semibold`}>
                    {job.type}
                  </Badge>
                </div>
              </div>

              {/* Skills section */}
              <div className="space-y-3">
                {job.matchedSkills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-dark" />
                      <span className="text-sm font-semibold text-blue-dark">Matched Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.matchedSkills.map((skill) => (
                        <Badge key={skill} className="bg-blue-100 text-blue-darker border-blue-200 font-semibold">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {job.missingSkills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-blue-medium" />
                      <span className="text-sm font-semibold text-blue-medium">Skills to Learn</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.missingSkills.map((skill) => (
                        <Badge key={skill} className="bg-blue-50 text-blue-dark border-blue-200 font-semibold">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action button */}
              <Button 
                className="w-full bg-blue-dark text-white shadow-blue hover:bg-blue-darker transition-all duration-300 border-0 font-semibold"
                onClick={() => onJobClick(job.id)}
              >
                View Details & Apply
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center py-8">
        <div className="bg-blue-darker text-white p-6 rounded-2xl shadow-blue">
          <h3 className="mb-2 font-semibold">Want More Matches?</h3>
          <p className="text-sm text-blue-100 mb-4">Update your skills to discover even better opportunities</p>
          <Button className="bg-white text-blue-darker hover:bg-blue-50 font-semibold">
            Update Profile
          </Button>
        </div>
      </div>
    </div>
  );
}