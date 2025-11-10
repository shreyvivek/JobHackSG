import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Upload, Plus, X } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const popularSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
  'Git', 'TypeScript', 'Java', 'C++', 'Machine Learning', 'Data Analysis',
  'Project Management', 'Agile', 'Communication', 'Leadership'
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  // ✅ Email format regex validator
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill) && selectedSkills.length < 5) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const addCustomSkill = () => {
    if (
      customSkill.trim() && 
      !selectedSkills.includes(customSkill.trim()) && 
      selectedSkills.length < 5
    ) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleSubmit = async () => {
    // ✅ Step 1: Check for empty fields
    if (!name.trim() || !email.trim()) {
      setError("Name and Email are required!");
      return;
    }

    // ✅ Step 2: Validate email format
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address (e.g. user@example.com).");
      return;
    }

    try {
      // TODO: Replace with backend API call
      // const res = await api.registerOrLogin({ name, email, skills: selectedSkills });
      // if (!res.ok) throw new Error("Server Error");

      setError(null);
      setStep(2);  // Move to skills page
    } catch {
      setError("Service unavailable. Please try again later!");
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-background p-4 flex flex-col">
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="mb-2">Welcome to Job Hack SG</h1>
            <p className="text-muted-foreground">Let's create your account to get started</p>
          </div>
          
          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm mt-2">
              {error}
            </div>
          )}
          
          <Button 
            className="mt-6 w-full" 
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <div className="flex-1 max-w-sm mx-auto w-full">
        <div className="text-center mb-6">
          <h2 className="mb-2">Add Your Skills</h2>
          <p className="text-muted-foreground">Select 3-5 skills that match your expertise</p>
          <p className="text-sm text-muted-foreground mt-1">{selectedSkills.length}/5 selected</p>
        </div>

        <Card className="p-4 mb-6">
          <h3 className="mb-3">Popular Skills</h3>
          <div className="flex flex-wrap gap-2">
            {popularSkills.map((skill) => (
              <Badge
                key={skill}
                variant={selectedSkills.includes(skill) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => selectedSkills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
              >
                {skill}
                {selectedSkills.includes(skill) && <X className="w-3 h-3 ml-1" />}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-4 mb-6">
          <h3 className="mb-3">Add Custom Skill</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter skill"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
            />
            <Button size="sm" onClick={addCustomSkill} disabled={selectedSkills.length >= 5}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {selectedSkills.length > 0 && (
          <Card className="p-4 mb-6">
            <h3 className="mb-3">Your Skills</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge key={skill} className="cursor-pointer" onClick={() => removeSkill(skill)}>
                  {skill}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {error && (
            <div className="text-red-600 text-sm mb-2">
              {error}
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={() => {
              if (selectedSkills.length < 3) {
                setError("Please select at least 3 skills");
                return;
              }
              onComplete();
            }}
          >
            Complete Setup
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Or</p>
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload Resume
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
