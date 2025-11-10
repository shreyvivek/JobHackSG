package sc2006.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import sc2006.dao.JobPostingDAO;
import sc2006.dao.SavedJobDAO;
import sc2006.entity.JobPosting;

@Controller
public class SavedPage {

    private final JobPostingDAO jobPostingDAO;
    private final SavedJobDAO savedJobDAO;

    public SavedPage() {
        this.jobPostingDAO = new JobPostingDAO();
        this.savedJobDAO = new SavedJobDAO();
    }

    /**
     * Retrieves only the user's saved jobs from the DB.
     */
    public List<JobPosting> getSavedJobs(Long userId) {
        List<Long> savedJobIds = savedJobDAO.getSavedJobIds(userId);
        List<JobPosting> savedJobs = new ArrayList<>();

        for (Long jobId : savedJobIds) {
            JobPosting job = jobPostingDAO.getJobPostingById(jobId);
            if (job != null && job.isActive()) {
                savedJobs.add(job);
            }
        }

        return savedJobs;
    }

    /**
     * Adds a job to saved list for a user.
     */
    public void saveJob(Long userId, Long jobId) {
        savedJobDAO.addSavedJob(userId, jobId);
    }

    /**
     * Removes a saved job.
     */
    public void unsaveJob(Long userId, Long jobId) {
        savedJobDAO.removeSavedJob(userId, jobId);
    }

    /**
     * Displays saved jobs to console (for CLI testing/demo).
     */
    public void displaySavedJobs(Long userId) {
        List<JobPosting> jobs = getSavedJobs(userId);

        if (jobs.isEmpty()) {
            System.out.println("No saved jobs found for user " + userId);
            return;
        }

        System.out.println("=== Saved Jobs for User " + userId + " ===");
        for (JobPosting j : jobs) {
            System.out.printf(
                "Job ID: %d | %s at %s (%s)%n",
                j.getJobId(), j.getTitle(), j.getCompany(), j.getLocation()
            );
        }
    }
}
