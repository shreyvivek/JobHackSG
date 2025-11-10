import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ArrowLeft, MapPin, Clock, Building, Bookmark, ExternalLink, GraduationCap, CheckCircle } from 'lucide-react';

interface JobDetailsProps {
  jobId: string;
  onBack: () => void;
}

const jobData = {
  '1': {
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$90k - $120k',
    type: 'Full-time',
    postedDays: 2,
    description: `We are looking for a passionate Frontend Developer to join our growing team. You will be responsible for building user-facing features and ensuring the technical feasibility of UI/UX designs.

Key Responsibilities:
• Develop new user-facing features using React and modern JavaScript
• Build reusable components and front-end libraries for future use
• Ensure the technical feasibility of UI/UX designs
• Optimize application for maximum speed and scalability
• Collaborate with back-end developers and web designers to improve usability

Requirements:
• Bachelor's degree in Computer Science or related field
• 3+ years of experience with React and JavaScript
• Experience with RESTful APIs and state management
• Strong understanding of web markup, including HTML5 and CSS3
• Proficient understanding of client-side scripting and JavaScript frameworks`,
    requirements: ['JavaScript', 'React', 'TypeScript', 'HTML/CSS', 'Git'],
    benefits: ['Health insurance', 'Remote work options', '401k matching', 'Professional development budget'],
    skillGaps: ['Vue.js', 'GraphQL'],
    matchedSkills: ['JavaScript', 'React', 'HTML/CSS'],
    missingSkills: ['Vue.js', 'GraphQL']
  }
};

export default function JobDetails({ jobId, onBack }: JobDetailsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [showCoursesDialog, setShowCoursesDialog] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const job = jobData[jobId as keyof typeof jobData];
  
  if (!job) {
    return (
      <div className="p-4 text-center">
        <p>Job not found</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const suggestedCourses = [
    {
      skill: 'Vue.js',
      title: 'Vue.js Fundamentals',
      provider: 'Tech Academy',
      duration: '12 hours',
      rating: 4.8,
      price: 'Free'
    },
    {
      skill: 'GraphQL',
      title: 'GraphQL Complete Guide',
      provider: 'Dev Institute',
      duration: '8 hours',
      rating: 4.9,
      price: '$49'
    },
    {
      skill: 'Vue.js',
      title: 'Vue.js Fundamentals',
      provider: 'Tech Academy',
      duration: '12 hours',
      rating: 4.8,
      price: 'Free',
      url: 'https://example.com/vue-course'
    },
    {
      skill: 'GraphQL',
      title: 'GraphQL Complete Guide',
      provider: 'Dev Institute',
      duration: '8 hours',
      rating: 4.9,
      price: '$49',
      url: 'https://example.com/graphql-course'
    }
];

  ;

  const filteredCourses = selectedSkill 
    ? suggestedCourses.filter(c => c.skill === selectedSkill)
    : suggestedCourses;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="flex-1">Job Details</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSaved(!isSaved)}
          className={isSaved ? 'text-blue-600' : ''}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Job Info */}
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <h2 className="mb-2">{job.title}</h2>
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Building className="w-4 h-4" />
                <span>{job.company}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
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
                <span className="text-lg">{job.salary}</span>
                <Badge variant="outline">{job.type}</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-4">
          <h3 className="mb-3">Job Description</h3>
          <div className="text-sm whitespace-pre-line text-muted-foreground">
            {job.description}
          </div>

          {/* Matched / Missing Skills */}
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Matched Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.matchedSkills.map(s => (
                <span key={s} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">
                  {s}
                </span>
              ))}
            </div>

            <h3 className="font-semibold mt-3 mb-1">Missing Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.missingSkills.map(s => (
                <button
                  key={s}
                  className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-sm hover:bg-red-300"
                  onClick={() => {
                    setSelectedSkill(s);
                    setShowCoursesDialog(true);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Suggested Courses (inline, always visible) */}
          <h3 className="font-semibold mt-4 mb-2">Suggested Courses</h3>
          <ul className="space-y-2">
            {suggestedCourses.map(c => (
              <li key={c.title} className="border p-2 rounded">
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-gray-600">{c.provider}</div>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  View Course
                </a>
              </li>
            ))}
          </ul>


        {/* Requirements */}
        <Card className="p-4">
          <h3 className="mb-3">Requirements</h3>
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req) => (
              <Badge key={req} variant="outline">{req}</Badge>
            ))}
          </div>
        </Card>

        {/* Benefits */}
        <Card className="p-4">
          <h3 className="mb-3">Benefits</h3>
          <div className="space-y-2">
            {job.benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Skill Gaps */}
        {job.skillGaps.length > 0 && (
          <Card className="p-4 border-orange-200 bg-orange-50">
            <h3 className="mb-3 text-orange-800">Skills to Improve</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {job.skillGaps.map((skill) => (
                <Badge key={skill} variant="outline" className="border-orange-300 text-orange-700">
                  {skill}
                </Badge>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
              onClick={() => {
                setSelectedSkill(null);
                setShowCoursesDialog(true);
              }}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              View Courses for Gaps
            </Button>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full" size="lg">
            <ExternalLink className="w-4 h-4 mr-2" />
            Apply on Company Site
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowApplicationDialog(true)}
          >
            Log Application
          </Button>
        </div>
      </div>

      {/* Courses Dialog */}
      <Dialog open={showCoursesDialog} onOpenChange={setShowCoursesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Recommended Courses {selectedSkill ? `for ${selectedSkill}` : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {filteredCourses.map((course, index) => (
              <Card key={index} className="p-3">
                <h4 className="mb-1">{course.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{course.provider}</p>
                <div className="flex items-center justify-between text-sm">
                  <span>{course.duration}</span>
                  <div className="flex items-center gap-2">
                    <span>★ {course.rating}</span>
                    <Badge variant="outline">{course.price}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
