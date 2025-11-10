package sc2006.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sc2006.dao.JobPostingDAO;
import sc2006.entity.JobPosting;

@Service
public class JobDataService {
    @Autowired
    private JobPostingDAO jobPostingDAO;

    public JobPosting getJobById(Long jobId) {
        if (jobId == null) {
            return null;
        }
        // Fetch from Supabase via DAO
        return jobPostingDAO.getJobPostingById(jobId);
    }
}
