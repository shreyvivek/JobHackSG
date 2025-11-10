package sc2006.controller;

import java.util.List;
import sc2006.entity.JobPosting;
import sc2006.entity.Recommendation;

/**
 * ForYouPage Controller
 * Handles job recommendations and user interactions on the personalized feed.
 */
public class ForYouPage {

    public ForYouPage() {}

    /** Display recommended jobs (for debugging or CLI output) */
    public void displayRecommendations(List<Recommendation> recommendations) {
        if (recommendations == null || recommendations.isEmpty()) {
            System.out.println("No recommendations available.");
            return;
        }
        for (Recommendation r : recommendations) {
            System.out.println("Job #" + r.getJobId() + " — match score: " + r.getMatchScore());
        }
    }

    /** Select a job by ID (integrates with JobDetailsController) */
    public JobPosting selectJob(Long jobId) {
        return new JobDetailsController().getJob(jobId);
    }

    /** Overload kept for compatibility with old int-based calls */
    public JobPosting selectJob(int jobId) {
        return selectJob((long) jobId);
    }

    /** Load recommended jobs for a given user */
    public List<Recommendation> load(Long userId) {
        return new RecommendationController().getRecommendations(userId);
    }

    /** Overload for compatibility with old int-based calls */
    public List<Recommendation> load(int userId) {
        return load((long) userId);
    }
}
