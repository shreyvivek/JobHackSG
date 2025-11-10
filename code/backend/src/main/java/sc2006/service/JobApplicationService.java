package sc2006.service;

import java.util.List;

import org.springframework.stereotype.Service;
import sc2006.dao.JobApplicationDAO;
import sc2006.entity.JobApplication;

@Service
public class JobApplicationService {

    private final JobApplicationDAO dao = new JobApplicationDAO();

    /** Get all job applications */
    public List<JobApplication> getAllApplications() {
        return dao.getAllApplications();
    }

    /** Get all applications for a specific user */
    public List<JobApplication> getApplicationsByUser(Long userId) {
        return dao.getApplicationsByUser(userId);
    }

    /** Create a new job application */
    public JobApplication createApplication(Long userId, Long jobId, String status, String note) {
        return dao.addAndReturnApplication(userId, jobId, status, note);
    }

    /** Update an existing application */
    public JobApplication updateApplication(Long appId, String status, String note) {
        return dao.updateApplication(appId, status, note);
    }

    /** Delete an application */
    public void deleteApplication(Long appId) {
        dao.deleteApplication(appId);
    }
}
