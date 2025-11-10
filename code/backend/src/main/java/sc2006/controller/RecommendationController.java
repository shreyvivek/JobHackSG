package sc2006.controller;

import java.util.ArrayList;
import java.util.List;

import sc2006.dao.JobPostingDAO;
import sc2006.entity.JobPosting;
import sc2006.entity.Recommendation;

/**
 * Controller for job recommendations shown on the "For You" page.
 * Now database-backed (via JobPostingDAO), no InMemoryStore dependency.
 */
public class RecommendationController {

    private final JobPostingDAO jobPostingDAO;

    public RecommendationController() {
        this.jobPostingDAO = new JobPostingDAO();
    }

    /**
     * Generate simple job recommendations for a given user.
     * 
     * In production, you might use machine learning or skill-matching logic.
     * For now, this fetches all active job postings and assigns a placeholder score.
     *
     * @param userId the user's ID
     * @return list of Recommendation objects
     */
    public List<Recommendation> getRecommendations(Long userId) {
        List<JobPosting> allJobs = jobPostingDAO.getAllJobPostings();
        List<Recommendation> recs = new ArrayList<>();

        for (JobPosting job : allJobs) {
            if (job == null || !job.isActive()) continue;

            // Simple scoring logic — could later be replaced with skill-matching
            double score = Math.random() * 100;
            recs.add(new Recommendation(job.getJobId(), userId, score, job.getTitle(), job.getDescription()));
        }

        return recs;
    }

    // Overload for compatibility with int-based calls
    public List<Recommendation> getRecommendations(int userId) {
        return getRecommendations((long) userId);
    }
}
