package sc2006.controller;

import java.util.List;

import org.springframework.stereotype.Controller;

import sc2006.dao.JobApplicationDAO;
import sc2006.entity.JobApplication;

/**
 * Controller layer for managing job applications between UI/REST and DAO.
 * This handles user requests and delegates to the DAO for database operations.
 */
@Controller
public class JobApplicationController {

    private final JobApplicationDAO dao = new JobApplicationDAO();

    /** Retrieve all applications */
    public List<JobApplication> listAllApplications() {
        return dao.getAllApplications();
    }

    /** Retrieve all applications for a specific user */
    public List<JobApplication> listJobApplications(Long userId) {
        return dao.getApplicationsByUser(userId);
    }

    /** Retrieve a specific application by its ID */
    public JobApplication getApplicationById(Long appId) {
        return dao.getApplicationById(appId);
    }

    /** Create a new job application */
    public JobApplication createApplication(Long userId, Long jobId, String status) {
        String note = "Created from application controller";
        return dao.addAndReturnApplication(userId, jobId, status, note);
    }

    /** Update an existing job application */
    public JobApplication updateJobApplication(Long appId, String status, String note) {
        return dao.updateApplication(appId, status, note);
    }

    /** Delete a job application */
    public void deleteJobApplication(Long appId) {
        dao.deleteApplication(appId);
    }
}
