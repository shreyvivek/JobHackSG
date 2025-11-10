package sc2006;

import java.util.List;

public class ForYouPage {

    public ForYouPage() {}

    public void displayRecommendations(Recommendation[] recommendations) {
        for(var r : recommendations){
            System.out.println("Job #" + r.getJobId() + " score=" + r.getMatchScore());
        }
    }

    public JobPosting selectJob(int jobId) {
        return new JobDetailsController().getJob(jobId);
    }

    public List<Recommendation> load(int userId){
        return new RecommendationController().getRecommendations(userId);
    }
}
