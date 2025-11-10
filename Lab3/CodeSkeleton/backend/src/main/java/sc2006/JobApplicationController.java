package sc2006;

import java.time.LocalDateTime;
import java.util.*;
import static sc2006.Exceptions.*;
import org.springframework.stereotype.Service;

@Service
public class JobApplicationController {

    public JobApplicationController() {}

    /** UC-10: create/log application */
    public JobApplication createApplication(int userId, int jobId, String status) {
        if(!InMemoryStore.USERS.containsKey(userId)) throw new NotFound("User not found");
        var job = InMemoryStore.JOBS.get(jobId);
        if(job == null || !job.isActive()) throw new Validation("Job inactive or missing");

        boolean dup = InMemoryStore.APPS.values().stream()
                .anyMatch(a -> a.getUserId()==userId && a.getJobId()==jobId);
        if(dup) throw new Conflict("Already logged. Update existing entry instead."); // AF-S1

        int id = InMemoryStore.nextAppId();
        var app = new JobApplication(id, userId, jobId, status==null?"Applied":status, "", LocalDateTime.now());
        InMemoryStore.APPS.put(id, app);
        return app;
    }

    /** UC-10: update app */
    public JobApplication updateJobApplication(int appId, String status, String note) {
        var app = InMemoryStore.APPS.get(appId);
        if(app == null) throw new NotFound("Application not found");
        if(status != null && !status.isBlank()) app.setStatus(status);
        if(note != null) app.setNote(note);
        app.touch();
        return app;
    }

    /** UC-10: list “Apps” */
    public List<JobApplication> listJobApplications(int userId) {
        List<JobApplication> out = new ArrayList<>();
        for(var a : InMemoryStore.APPS.values()) if(a.getUserId()==userId) out.add(a);
        out.sort(Comparator.comparing(JobApplication::getUpdatedAt).reversed());
        return out;
    }
}
