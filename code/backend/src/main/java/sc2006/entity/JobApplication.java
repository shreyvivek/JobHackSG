package sc2006.entity;

import java.time.LocalDateTime;

/**
 * Represents a user's job application record.
 */
public class JobApplication {

    private Long id;             // application ID
    private Long userId;         // foreign key -> users.user_id
    private Long jobId;          // foreign key -> job_postings.job_id
    private String status;       // Applied, Interviewing, Rejected, etc.
    private String note;         // optional notes by the user
    private LocalDateTime appliedAt; // time of submission
    private LocalDateTime updatedAt; // last modification time

    // === Constructors ===
    public JobApplication() {
        // Required by frameworks and DAO mapping
    }

    public JobApplication(Long id, Long userId, Long jobId,
                          String status, String note,
                          LocalDateTime appliedAt) {
        this.id = id;
        this.userId = userId;
        this.jobId = jobId;
        this.status = status;
        this.note = note;
        this.appliedAt = appliedAt;
    }

    public JobApplication(Long userId, Long jobId, String status, String note) {
        this.userId = userId;
        this.jobId = jobId;
        this.status = status;
        this.note = note;
        this.appliedAt = LocalDateTime.now();
    }

    // === Getters and Setters ===
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // === Utility ===
    @Override
    public String toString() {
        return String.format(
            "JobApplication{id=%d, userId=%d, jobId=%d, status='%s', appliedAt=%s}",
            id, userId, jobId, status, appliedAt
        );
    }
}
