import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Camera, 
  Linkedin, 
  Upload, 
  Edit3, 
  Plus, 
  X, 
  User, 
  Mail, 
  MapPin, 
  Briefcase,
  GraduationCap,
  FileText
} from 'lucide-react';

const popularSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
  'Git', 'TypeScript', 'Java', 'C++', 'Machine Learning', 'Data Analysis',
  'Project Management', 'Agile', 'Communication', 'Leadership', 'UI/UX Design'
];

interface UserProfile {
  name: string;
  email: string;
  location: string;
  title: string;
  bio: string;
  skills: string[];
  linkedinConnected: boolean;
  profilePhoto?: string;
  resumeUploaded: boolean;
}

export default function ProfileTab() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    location: 'San Francisco, CA',
    title: 'Frontend Developer',
    bio: 'Passionate frontend developer with 3+ years of experience building modern web applications.',
    skills: ['JavaScript', 'React', 'TypeScript', 'Git'],
    linkedinConnected: false,
    resumeUploaded: true
  });

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditSkills, setShowEditSkills] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [tempSkills, setTempSkills] = useState(profile.skills);
  const [customSkill, setCustomSkill] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);


  const handleProfileSave = () => {
    setProfile(tempProfile);
    setShowEditProfile(false);
  };

  const handleSkillsSave = () => {
    setProfile({ ...profile, skills: tempSkills });
    setShowEditSkills(false);
  };

  const addSkill = (skill: string) => {
    if (!tempSkills.includes(skill)) {
      setTempSkills([...tempSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setTempSkills(tempSkills.filter(s => s !== skill));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !tempSkills.includes(customSkill.trim())) {
      setTempSkills([...tempSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    setProfile({ ...profile, profilePhoto: 'uploaded' });
  };

  const connectLinkedIn = () => {
    // Simulate LinkedIn connection
    setProfile({ ...profile, linkedinConnected: true });
  };

  const handleResumeUpload = async (file: File) => {
    if (file.size > 5_000_000) {
      setUploadError("File too large. Maximum allowed size is 5 MB.");
      return;
    }
    if (!file.name.endsWith(".pdf")) {
      setUploadError("Invalid file type. Only PDF resumes are supported.");
      return;
    }

    try {
      setUploadError(null);

      // TODO: replace with real backend upload API
      // const formData = new FormData();
      // formData.append("resume", file);
      // const res = await fetch("/api/uploadResume", { method: "POST", body: formData });
      // if (!res.ok) throw new Error("Server error");

      setProfile({ ...profile, resumeUploaded: true });
    } catch {
      setUploadError("Upload failed. Please try again later.");
    }
  };


  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="text-center mb-6">
        <h1 className="mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your professional profile</p>
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.profilePhoto} />
              <AvatarFallback className="text-lg">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              onClick={handlePhotoUpload}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <h2>{profile.name}</h2>
            <p className="text-muted-foreground">{profile.title}</p>
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
          </div>

          <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
            <DialogTrigger asChild>

              <div className="flex flex-col items-end">
                <input 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  id="resume-upload"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleResumeUpload(e.target.files[0]);
                  }}
                />
                <label htmlFor="resume-upload">
                  <Button asChild variant="outline" size="sm">
                    <span className="flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      {profile.resumeUploaded ? 'Update' : 'Upload'}
                    </span>
                  </Button>
                </label>
                {uploadError && (
                  <p className="text-red-600 text-sm mt-2">{uploadError}</p>
                )}
              </div>

            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm mb-1 block">Full Name</label>
                  <Input
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1 block">Job Title</label>
                  <Input
                    value={tempProfile.title}
                    onChange={(e) => setTempProfile({ ...tempProfile, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1 block">Location</label>
                  <Input
                    value={tempProfile.location}
                    onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1 block">Bio</label>
                  <Textarea
                    value={tempProfile.bio}
                    onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button onClick={handleProfileSave} className="w-full">
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Bio */}
      <Card className="p-4">
        <h3 className="mb-3">About</h3>
        <p className="text-sm text-muted-foreground">{profile.bio}</p>
      </Card>

      {/* LinkedIn Connection */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="mb-1">LinkedIn</h3>
              <p className="text-sm text-muted-foreground">
                {profile.linkedinConnected ? 'Connected' : 'Connect your LinkedIn profile'}
              </p>
            </div>
          </div>
          
          {profile.linkedinConnected ? (
            <Badge className="bg-green-100 text-green-800">Connected</Badge>
          ) : (
            <Button variant="outline" size="sm" onClick={connectLinkedIn}>
              Connect
            </Button>
          )}
        </div>
      </Card>

      {/* Skills Section */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3>Skills</h3>
          <Dialog open={showEditSkills} onOpenChange={setShowEditSkills}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Skills</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-3">Your Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {tempSkills.map((skill) => (
                      <Badge
                        key={skill}
                        className="cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill}
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
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                    />
                    <Button size="sm" onClick={addCustomSkill}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Popular Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {popularSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={tempSkills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => tempSkills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                      >
                        {skill}
                        {tempSkills.includes(skill) && <X className="w-3 h-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={handleSkillsSave} className="w-full">
                  Save Skills
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <Badge key={skill} variant="outline">{skill}</Badge>
          ))}
        </div>
      </Card>

      {/* Resume Section */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="mb-1">Resume</h3>
              <p className="text-sm text-muted-foreground">
                {profile.resumeUploaded ? 'Resume uploaded' : 'Upload your resume'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <input 
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              id="resume-upload"
              onChange={(e) => {
                if (e.target.files?.[0]) handleResumeUpload(e.target.files[0]);
              }}
            />
            <label htmlFor="resume-upload">
              <Button asChild variant="outline" size="sm">
                <span className="flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  {profile.resumeUploaded ? 'Update' : 'Upload'}
                </span>
              </Button>
            </label>
            {uploadError && (
              <p className="text-red-600 text-sm mt-2">{uploadError}</p>
            )}
          </div>


        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-4">
        <h3 className="mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{profile.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{profile.location}</span>
          </div>
        </div>
      </Card>

      {/* Profile Completion */}
      <Card className="p-4">
        <h3 className="mb-3">Profile Completion</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Profile Progress</span>
            <span>85%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-xs text-muted-foreground">
            Connect LinkedIn and add more skills to reach 100%
          </p>
        </div>
      </Card>
    </div>
  );
}