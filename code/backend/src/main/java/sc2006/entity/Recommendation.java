package sc2006.entity;

public class Recommendation {
    private Long jobId;
    private Long userId;
    private double matchScore;
    private String jobTitle;
    private String jobDescription;

    public Recommendation(Long jobId, Long userId, double matchScore, String jobTitle, String jobDescription) {
        this.jobId = jobId;
        this.userId = userId;
        this.matchScore = matchScore;
        this.jobTitle = jobTitle;
        this.jobDescription = jobDescription;
    }

    // Getters
    public Long getJobId() { return jobId; }
    public Long getUserId() { return userId; }
    public double getMatchScore() { return matchScore; }
    public String getJobTitle() { return jobTitle; }
    public String getJobDescription() { return jobDescription; }

    // Setters
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setMatchScore(double matchScore) { this.matchScore = matchScore; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
}
