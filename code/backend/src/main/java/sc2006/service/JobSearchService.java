package sc2006.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sc2006.dao.JobPostingDAO;
import sc2006.entity.JobPosting;
import sc2006.util.Exceptions.NotFound;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class JobSearchService {

    @Autowired
    private JobPostingDAO jobPostingDAO;

    public List<JobPosting> searchJobs(Map<String, Object> filters) {
        List<JobPosting> allJobs = jobPostingDAO.getAllJobPostings();
        List<JobPosting> results = new ArrayList<>();

        String keyword = filters.getOrDefault("keyword", "").toString().toLowerCase();
        String location = filters.getOrDefault("location", "").toString().toLowerCase();
        String company = filters.getOrDefault("company", "").toString().toLowerCase();
        String postedAfter = filters.getOrDefault("postedAfter", "").toString();
        String sortBy = filters.getOrDefault("sortBy", "relevance").toString();

        for (JobPosting job : allJobs) {
            if (!job.isActive()) continue;

            boolean match = true;

            // Filter by keyword (title, company, or description)
            if (!keyword.isEmpty() && !(job.getTitle().toLowerCase().contains(keyword)
                    || job.getCompany().toLowerCase().contains(keyword)
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

            // Filter by posted date
            if (!postedAfter.isEmpty()) {
                LocalDateTime cutoff = getCutoffDate(postedAfter);
                if (job.getPostedAt() != null && job.getPostedAt().isBefore(cutoff)) {
                    match = false;
                }
            }

            if (match) {
                results.add(job);
            }
        }

        // Sort results
        results.sort((a, b) -> switch (sortBy) {
            case "date" -> {
                if (a.getPostedAt() == null || b.getPostedAt() == null) yield 0;
                yield b.getPostedAt().compareTo(a.getPostedAt());
            }
            case "title" -> a.getTitle().compareToIgnoreCase(b.getTitle());
            case "company" -> a.getCompany().compareToIgnoreCase(b.getCompany());
            default -> 0; // relevance
        });

        return results;
    }

    public JobPosting getJobById(Long jobId) {
        JobPosting job = jobPostingDAO.getJobPostingById(jobId);
        if (job == null) {
            throw new NotFound("Job posting not found for ID: " + jobId);
        }
        return job;
    }

    public List<JobPosting> getAllJobs() {
        return jobPostingDAO.getAllJobPostings();
    }

    private LocalDateTime getCutoffDate(String postedAfter) {
        LocalDateTime now = LocalDateTime.now();
        return switch (postedAfter.toLowerCase()) {
            case "1day", "24h" -> now.minus(1, ChronoUnit.DAYS);
            case "3days" -> now.minus(3, ChronoUnit.DAYS);
            case "7days", "1week" -> now.minus(7, ChronoUnit.DAYS);
            case "30days", "1month" -> now.minus(30, ChronoUnit.DAYS);
            default -> now.minus(365, ChronoUnit.DAYS); // Default to 1 year
        };
    }
}
