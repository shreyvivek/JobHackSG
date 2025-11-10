package sc2006.controller;

import sc2006.entity.JobApplication;
import sc2006.entity.JobPosting;
import sc2006.dao.JobPostingDAO;
import sc2006.dao.SavedJobDAO;
import sc2006.util.Exceptions.NotFound;
import sc2006.util.Exceptions.Validation;

public class JobDetailsController {

    private final JobPostingDAO jobPostingDAO;
    private final JobApplicationController jobAppController;
    private final SavedJobDAO savedJobDAO = new SavedJobDAO();

    public JobDetailsController() {
        this.jobPostingDAO = new JobPostingDAO();
        this.jobAppController = new JobApplicationController();
    }

    /** UC-8: Get job details by jobId */
    public JobPosting getJob(Long jobId) {
        JobPosting job = jobPostingDAO.getJobById(jobId);
        if (job == null) throw new NotFound("Job not found");
        if (!job.isActive()) throw new Validation("Job has been removed!");
        return job;
    }

    // Overload for compatibility (int-based calls)
    public JobPosting getJob(int jobId) {
        return getJob((long) jobId);
    }

    /** UC-9: Save job (bookmarking) */
    // Save job (bookmark)
    public void saveJob(Long userId, Long jobId) {
        savedJobDAO.addSavedJob(userId, jobId);
    }

    

    /** Overload for legacy code (int args) */
    public void saveJob(int userId, int jobId) {
        saveJob((long) userId, (long) jobId);
    }

    /** UC-10: Log application from job details page */
    public JobApplication logApplication(Long userId, Long jobId, String status, String note) {
        return jobAppController.createApplication(userId, jobId, status == null ? "Applied" : status);
    }

    /** Overload for legacy int-based calls */
    public JobApplication logApplication(int userId, int jobId, String status, String note) {
        return logApplication((long) userId, (long) jobId, status, note);
    }

    /** UC-9: Unsave job */
    // Unsave job (remove bookmark)
    public void unsaveJob(Long userId, Long jobId) {
        savedJobDAO.removeSavedJob(userId, jobId);
    }

    public void unsaveJob(int userId, int jobId) {
        unsaveJob((long) userId, (long) jobId);
    }
}
