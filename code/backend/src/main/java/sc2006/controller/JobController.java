package sc2006.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import sc2006.service.JobDataService;
import sc2006.service.JobRecommendationService;
import sc2006.entity.JobPosting;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class JobController {

    @Autowired
    private JobDataService jobDataService;

    @Autowired
    private sc2006.dao.JobPostingDAO jobPostingDAO;

    @Autowired
    private JobRecommendationService jobRecommendationService;

    @GetMapping("/search")
    public Map<String, Object> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String sector,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String postedAfter,
            @RequestParam(required = false) String sortBy) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<JobPosting> allJobs = jobPostingDAO.getAllJobPostings();
            List<JobPosting> filteredJobs = allJobs;
            
            // Apply filters
            if (keyword != null && !keyword.trim().isEmpty()) {
                String keywordLower = keyword.toLowerCase();
                filteredJobs = filteredJobs.stream()
                    .filter(job -> job.getTitle().toLowerCase().contains(keywordLower) ||
                                 job.getCompany().toLowerCase().contains(keywordLower) ||
                                 job.getDescription().toLowerCase().contains(keywordLower))
                    .collect(Collectors.toList());
            }
            
            if (location != null && !location.trim().isEmpty()) {
                String locationLower = location.toLowerCase();
                filteredJobs = filteredJobs.stream()
                    .filter(job -> job.getLocation().toLowerCase().contains(locationLower))
                    .collect(Collectors.toList());
            }
            
            if (jobType != null && !jobType.trim().isEmpty()) {
                filteredJobs = filteredJobs.stream()
                    .filter(job -> job.getJobType().equals(jobType))
                    .collect(Collectors.toList());
            }
            
            // Sort results
            if ("date".equals(sortBy)) {
                filteredJobs = filteredJobs.stream()
                    .sorted((a, b) -> b.getPostedAt().compareTo(a.getPostedAt()))
                    .collect(Collectors.toList());
            } else if ("salary".equals(sortBy)) {
                // Simple salary sorting based on first number in salary string
                filteredJobs = filteredJobs.stream()
                    .sorted((a, b) -> {
                        int salaryA = extractSalaryNumber(a.getSalary());
                        int salaryB = extractSalaryNumber(b.getSalary());
                        return Integer.compare(salaryB, salaryA);
                    })
                    .collect(Collectors.toList());
            }
            
            response.put("success", true);
            response.put("jobs", filteredJobs);
            response.put("total", filteredJobs.size());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to search jobs: " + e.getMessage());
        }
        
        return response;
    }
    
    @GetMapping("/recommendations/{userId}")
    public Map<String, Object> getJobRecommendations(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<JobRecommendationService.JobRecommendation> recommendations = 
                jobRecommendationService.getJobRecommendations(userId);
            
            response.put("success", true);
            response.put("recommendations", recommendations);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to get recommendations: " + e.getMessage());
        }
        
        return response;
    }
    
    private int extractSalaryNumber(String salary) {
        if (salary == null) return 0;
        try {
            // Extract first number from salary string like "$8000 - $12000"
            String[] parts = salary.replaceAll("[^0-9]", " ").trim().split("\\s+");
            if (parts.length > 0) {
                return Integer.parseInt(parts[0]);
            }
        } catch (NumberFormatException e) {
            // Ignore parsing errors
        }
        return 0;
    }
    
    @GetMapping("/{jobId}")
    public Map<String, Object> getJobById(@PathVariable String jobId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long jobIdLong = Long.parseLong(jobId);
            JobPosting job = jobDataService.getJobById(jobIdLong);
            
            if (job != null) {
                response.put("success", true);
                response.put("job", job);
            } else {
                response.put("success", false);
                response.put("error", "Job not found with ID: " + jobId);
            }
        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("error", "Invalid job ID format: " + jobId);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to get job details: " + e.getMessage());
        }
        
        return response;
    }
    
    @PostMapping("/save")
    public Map<String, Object> saveJob(@RequestBody Map<String, Object> requestBody) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long userId = Long.parseLong(requestBody.get("userId").toString());
            Long jobId = Long.parseLong(requestBody.get("jobId").toString());
            
            // Call the JobDetailsController to save the job
            new JobDetailsController().saveJob(userId, jobId);
            
            response.put("success", true);
            response.put("message", "Job saved successfully");
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to save job: " + e.getMessage());
        }
        
        return response;
    }
}
