package sc2006.entity;

import java.net.URL;
import java.time.LocalDateTime;

/**
 * Represents a job listing.
 */
public class JobPosting {

    private Long jobId;
    private String title;
    private String company;
    private String location;
    private String description;
    private LocalDateTime postedAt;
    private boolean active;
    private URL applyUrl; // optional (if you use external links)
    private String salary; // e.g., "$50k - $80k"
    private String jobType; // "Full-time", "Part-time", "Contract", "Internship"
    private String requiredSkills; // comma-separated skills
    private String requirements; 

    // === Constructors ===
    public JobPosting() {}

    // Minimal constructor (used by DAO)
    public JobPosting(Long jobId, String title, String company, String location,
                      String description, LocalDateTime postedAt, boolean active) {
        this.jobId = jobId;
        this.title = title;
        this.company = company;
        this.location = location;
        this.description = description;
        this.postedAt = postedAt;
        this.active = active;
    }

    // Extended constructor with URL (optional)
    public JobPosting(Long jobId, String title, String company, String location,
                      String description, LocalDateTime postedAt, URL applyUrl, boolean active) {
        this.jobId = jobId;
        this.title = title;
        this.company = company;
        this.location = location;
        this.description = description;
        this.postedAt = postedAt;
        this.applyUrl = applyUrl;
        this.active = active;
    }

    // Constructor with salary, jobType, and requiredSkills
    public JobPosting(Long jobId, String title, String company, String location,
                      String description, LocalDateTime postedAt, boolean active, 
                      String salary, String jobType, String requiredSkills) {
        this.jobId = jobId;
        this.title = title;
        this.company = company;
        this.location = location;
        this.description = description;
        this.postedAt = postedAt;
        this.active = active;
        this.salary = salary;
        this.jobType = jobType;
        this.requiredSkills = requiredSkills;
    }

    // === Getters and Setters ===
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getPostedAt() { return postedAt; }
    public void setPostedAt(LocalDateTime postedAt) { this.postedAt = postedAt; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public URL getApplyUrl() { return applyUrl; }
    public void setApplyUrl(URL applyUrl) { this.applyUrl = applyUrl; }

    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    // === Convenience toString() ===
    @Override
    public String toString() {
        return String.format("JobPosting{id=%d, title='%s', company='%s', active=%b}", jobId, title, company, active);
    }
}
