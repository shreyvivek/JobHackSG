package sc2006.controller;

import java.util.ArrayList;
import java.util.Map;
import java.util.List;

import sc2006.dao.JobPostingDAO;
import sc2006.entity.JobPosting;
import sc2006.util.Exceptions.NotFound;
import sc2006.util.Exceptions.Validation;

public class JobSearchController {

    private final JobPostingDAO jobPostingDAO;

    public JobSearchController() {
        this.jobPostingDAO = new JobPostingDAO();
    }

    /**
     * UC-7: Search job postings by keyword (title, company, or description).
     */
    public List<JobPosting> searchJobs(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            throw new Validation("Search keyword cannot be empty.");
        }

        List<JobPosting> allJobs = jobPostingDAO.getAllJobPostings();
        List<JobPosting> results = new ArrayList<>();

        String kw = keyword.toLowerCase();
        for (JobPosting job : allJobs) {
            if (job.getTitle().toLowerCase().contains(kw)
                    || job.getCompany().toLowerCase().contains(kw)
                    || job.getDescription().toLowerCase().contains(kw)) {
                results.add(job);
            }
        }

        if (results.isEmpty()) {
            throw new NotFound("No job postings match the keyword: " + keyword);
        }

        return results;
    }
    /**
     * UC-7 (extended): Filter job postings by multiple criteria.
     * Accepts a map of filters such as {"keyword": "engineer", "location": "Singapore"}.
     */
    public List<JobPosting> filterJobs(Map<String, Object> filters) {
        List<JobPosting> allJobs = jobPostingDAO.getAllJobPostings();
        List<JobPosting> results = new ArrayList<>();

        String keyword = filters.getOrDefault("keyword", "").toString().toLowerCase();
        String location = filters.getOrDefault("location", "").toString().toLowerCase();
        String company = filters.getOrDefault("company", "").toString().toLowerCase();
        Boolean activeOnly = Boolean.parseBoolean(filters.getOrDefault("activeOnly", "true").toString());

        for (JobPosting job : allJobs) {
            boolean match = true;

            // Filter by keyword (title or description)
            if (!keyword.isEmpty() && !(job.getTitle().toLowerCase().contains(keyword)
                    || job.getDescription().toLowerCase().contains(keyword))) {
                match = false;
            }

            // Filter by location
            if (!location.isEmpty() && !job.getLocation().toLowerCase().contains(location)) {
                match = false;
            }

            // Filter by company
            if (!company.isEmpty() && !job.getCompany().toLowerCase().contains(company)) {
                match = false;
            }

            // Filter by active status
            if (activeOnly && !job.isActive()) {
                match = false;
            }

            if (match) results.add(job);
        }

        return results;
    }


    /**
     * UC-8: Fetch a specific job posting by ID.
     */
    public JobPosting getJobById(Long jobId) {
        JobPosting job = jobPostingDAO.getJobPostingById(jobId);
        if (job == null) {
            throw new NotFound("Job posting not found for ID: " + jobId);
        }
        return job;
    }
    

    /**
     * List all active job postings.
     */
    public List<JobPosting> listAllActiveJobs() {
        List<JobPosting> allJobs = jobPostingDAO.getAllJobPostings();
        List<JobPosting> activeJobs = new ArrayList<>();

        for (JobPosting job : allJobs) {
            if (job.isActive()) {
                activeJobs.add(job);
            }
        }

        return activeJobs;
    }

    
}
