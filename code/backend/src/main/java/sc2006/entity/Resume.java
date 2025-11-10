package sc2006.entity;

import java.time.LocalDateTime;

public class Resume {
    private Long resumeId;
    private Long userId;
    private String fileType;
    private double fileSizeMB;
    private LocalDateTime uploadedAt;

    // === Constructors ===
    public Resume() {}

    // Used when creating a new resume (no ID yet)
    public Resume(Long userId, String fileType, double fileSizeMB, LocalDateTime uploadedAt) {
        this.userId = userId;
        this.fileType = fileType;
        this.fileSizeMB = fileSizeMB;
        this.uploadedAt = uploadedAt;
    }

    // Used when reading from database (includes ID)
    public Resume(Long resumeId, Long userId, String fileType, double fileSizeMB, LocalDateTime uploadedAt) {
        this.resumeId = resumeId;
        this.userId = userId;
        this.fileType = fileType;
        this.fileSizeMB = fileSizeMB;
        this.uploadedAt = uploadedAt;
    }

    // === Getters and Setters ===
    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public double getFileSizeMB() {
        return fileSizeMB;
    }

    public void setFileSizeMB(double fileSizeMB) {
        this.fileSizeMB = fileSizeMB;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    @Override
    public String toString() {
        return "Resume{" +
                "resumeId=" + resumeId +
                ", userId=" + userId +
                ", fileType='" + fileType + '\'' +
                ", fileSizeMB=" + fileSizeMB +
                ", uploadedAt=" + uploadedAt +
                '}';
    }
}
