package sc2006;

import java.util.ArrayList;
import java.util.List;

public class SavedPage {

    public SavedPage() {}

    public void unsaveJob(int jobId) {
        // in real flow we need userId; keeping simple here
    }

    public void displaySavedJobs(JobPosting[] savedJobs) {
        for(var j : savedJobs){
            System.out.println("%s @ %s".formatted(j.getTitle(), j.getCompany()));
        }
    }

    public List<JobPosting> getSavedJobs(int userId){
        var ids = InMemoryStore.SAVED_BY_USER.getOrDefault(userId, List.of());
        List<JobPosting> out = new ArrayList<>();
        for(int id: ids){
            var j = InMemoryStore.JOBS.get(id);
            if(j!=null) out.add(j);
        }
        return out;
    }
}
