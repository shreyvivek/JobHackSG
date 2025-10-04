package sc2006;

import java.util.ArrayList;
import java.util.List;
import static sc2006.Exceptions.*;

public class JobDetailsController {

    public JobDetailsController() {}

    /** UC-8 get job details */
    public JobPosting getJob(int jobId) {
        var job = InMemoryStore.JOBS.get(jobId);
        if(job == null) throw new NotFound("Job not found");
        if(!job.isActive()) throw new Validation("Job has been removed!");
        return job;
    }

    public JobPosting findJob(int jobId){ return getJob(jobId); }
    public JobPosting fetchJob(int jobId){ return getJob(jobId); }

    /** UC-9 save/unsave */
    public void saveJob(int userId, int jobId) {
        var job = getJob(jobId);
        List<Integer> savedJobIds = InMemoryStore.SAVED_BY_USER.get(userId);
        if (savedJobIds == null) {
            savedJobIds = new ArrayList<>();
            InMemoryStore.SAVED_BY_USER.put(userId, savedJobIds);
        }
        if(!savedJobIds.contains(job.getJobId())) savedJobIds.add(job.getJobId());
    }

    /** overload kept for template compatibility (no userId) — not used */
    public void saveJob(int jobId) { throw new Validation("User id required"); }

    public void jobError(String message){ /* UI hook */ }
    public void jobMsg(String message){ /* UI hook */ }

    /** UC-10 log application from details page */
    public Application logApplication(int userId, int jobId, String status, String note) {
        return new ApplicationController().createApplication(userId, jobId, status==null?"Applied":status);
    }
}
