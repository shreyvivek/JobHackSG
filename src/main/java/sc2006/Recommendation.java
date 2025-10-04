package sc2006;

public class Recommendation {
    private int userId;
    private int jobId;
    public int matchScore; // 0..100

    public Recommendation(){}

    public Recommendation(int userId, int jobId, int matchScore) {
        this.userId = userId;
        this.jobId = jobId;
        this.matchScore = matchScore;
    }

    public int getUserId(){ return userId; }
    public int getJobId(){ return jobId; }
    public int getMatchScore(){ return matchScore; }
}
