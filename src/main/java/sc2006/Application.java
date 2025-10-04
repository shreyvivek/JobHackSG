package sc2006;

import java.time.LocalDateTime;

public class Application {
    private int appId;
    private int userId;
    private int jobId;
    private String status;        // e.g., "Applied", "Interview", "Rejected", "Offer"
    private String note;
    private LocalDateTime updatedAt;

    public Application(){}

    public Application(int appId, int userId, int jobId, String status, String note, LocalDateTime updatedAt) {
        this.appId = appId;
        this.userId = userId;
        this.jobId = jobId;
        this.status = status;
        this.note = note;
        this.updatedAt = updatedAt;
    }

    public int getAppId(){ return appId; }
    public int getUserId(){ return userId; }
    public int getJobId(){ return jobId; }
    public String getStatus(){ return status; }
    public String getNote(){ return note; }
    public LocalDateTime getUpdatedAt(){ return updatedAt; }

    public void setStatus(String status){ this.status = status; }
    public void setNote(String note){ this.note = note; }
    public void touch(){ this.updatedAt = LocalDateTime.now(); }
}
