package sc2006.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sc2006.dao.JobPostingDAO;
import sc2006.dao.UserSkillDAO;
import sc2006.dao.SkillDAO;
import sc2006.entity.JobPosting;
import sc2006.entity.UserSkill;
import sc2006.entity.Skill;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobRecommendationService {

    @Autowired
    private JobPostingDAO jobPostingDAO;

    @Autowired
    private UserSkillDAO userSkillDAO;

    @Autowired
    private SkillDAO skillDAO;

    public List<JobRecommendation> getJobRecommendations(Long userId) {
        // Get user skills
        List<UserSkill> userSkills = userSkillDAO.getUserSkillsByUserId(userId);
        Set<String> userSkillNames = userSkills.stream()
                .map(us -> skillDAO.getSkillById(us.getSkillId()))
                .filter(Objects::nonNull)
                .map(Skill::getName)
                .collect(Collectors.toSet());

        // Get all active jobs
        List<JobPosting> allJobs = jobPostingDAO.getAllJobPostings();
        List<JobPosting> activeJobs = allJobs.stream()
                .filter(JobPosting::isActive)
                .collect(Collectors.toList());

        // Calculate match scores for each job
        List<JobRecommendation> recommendations = new ArrayList<>();
        
        for (JobPosting job : activeJobs) {
            JobRecommendation rec = calculateJobMatch(job, userSkillNames);
            if (rec.getMatchPercentage() > 30) { // Only show jobs with >30% match
                recommendations.add(rec);
            }
        }

        // Sort by match percentage (highest first)
        recommendations.sort((a, b) -> Double.compare(b.getMatchPercentage(), a.getMatchPercentage()));

        // Return top 10 recommendations
        return recommendations.stream().limit(10).collect(Collectors.toList());
    }

    private JobRecommendation calculateJobMatch(JobPosting job, Set<String> userSkills) {
        // Extract skills from job title and description
        Set<String> jobSkills = extractSkillsFromJob(job);
        
        // Calculate matched skills
        Set<String> matchedSkills = new HashSet<>(userSkills);
        matchedSkills.retainAll(jobSkills);
        
        // Calculate missing skills
        Set<String> missingSkills = new HashSet<>(jobSkills);
        missingSkills.removeAll(userSkills);
        
        // Calculate match percentage
        double matchPercentage = 0.0;
        if (!jobSkills.isEmpty()) {
            matchPercentage = (double) matchedSkills.size() / jobSkills.size() * 100;
        }
        
        // Boost score for exact title matches
        String jobTitle = job.getTitle().toLowerCase();
        for (String skill : userSkills) {
            if (jobTitle.contains(skill.toLowerCase())) {
                matchPercentage += 20; // Boost for title matches
            }
        }
        
        // Cap at 100%
        matchPercentage = Math.min(matchPercentage, 100.0);

        return new JobRecommendation(
            job.getJobId(),
            job.getTitle(),
            job.getCompany(),
            job.getLocation(),
            job.getDescription(),
            (int) Math.round(matchPercentage),
            new ArrayList<>(matchedSkills),
            new ArrayList<>(missingSkills),
            job.getPostedAt()
        );
    }

    private Set<String> extractSkillsFromJob(JobPosting job) {
        Set<String> skills = new HashSet<>();
        
        // Common tech skills to look for
        String[] commonSkills = {
            "JavaScript", "Python", "Java", "C++", "C#", "React", "Angular", "Vue",
            "Node.js", "Express", "Spring", "Django", "Flask", "SQL", "MongoDB",
            "PostgreSQL", "MySQL", "Redis", "Docker", "Kubernetes", "AWS", "Azure",
            "GCP", "Git", "GitHub", "GitLab", "Jenkins", "CI/CD", "REST", "GraphQL",
            "Microservices", "Machine Learning", "AI", "Data Science", "Analytics",
            "Agile", "Scrum", "Project Management", "Leadership", "Communication",
            "UI/UX", "Design", "Figma", "Photoshop", "Illustrator", "TypeScript",
            "HTML", "CSS", "SASS", "LESS", "Webpack", "Babel", "Jest", "Testing",
            "Unit Testing", "Integration Testing", "TDD", "BDD", "DevOps", "Linux",
            "Windows", "macOS", "iOS", "Android", "React Native", "Flutter",
            "Swift", "Kotlin", "PHP", "Ruby", "Go", "Rust", "Scala", "Haskell"
        };
        
        String jobText = (job.getTitle() + " " + job.getDescription()).toLowerCase();
        
        for (String skill : commonSkills) {
            if (jobText.contains(skill.toLowerCase())) {
                skills.add(skill);
            }
        }
        
        return skills;
    }

    public static class JobRecommendation {
        private final Long jobId;
        private final String title;
        private final String company;
        private final String location;
        private final String description;
        private final int matchPercentage;
        private final List<String> matchedSkills;
        private final List<String> missingSkills;
        private final java.time.LocalDateTime postedAt;

        public JobRecommendation(Long jobId, String title, String company, String location,
                               String description, int matchPercentage, List<String> matchedSkills,
                               List<String> missingSkills, java.time.LocalDateTime postedAt) {
            this.jobId = jobId;
            this.title = title;
            this.company = company;
            this.location = location;
            this.description = description;
            this.matchPercentage = matchPercentage;
            this.matchedSkills = matchedSkills;
            this.missingSkills = missingSkills;
            this.postedAt = postedAt;
        }

        // Getters
        public Long getJobId() { return jobId; }
        public String getTitle() { return title; }
        public String getCompany() { return company; }
        public String getLocation() { return location; }
        public String getDescription() { return description; }
        public int getMatchPercentage() { return matchPercentage; }
        public List<String> getMatchedSkills() { return matchedSkills; }
        public List<String> getMissingSkills() { return missingSkills; }
        public java.time.LocalDateTime getPostedAt() { return postedAt; }
    }
}
