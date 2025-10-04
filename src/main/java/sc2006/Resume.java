package sc2006;

import java.time.LocalDateTime;

public class Resume {
    private int resumeId;
    private int userId;
    private String fileType;       // e.g., "pdf"
    private double fileSizeMB;
    private LocalDateTime uploadedAt;

    public Resume(){}

    public Resume(int resumeId, int userId, String fileType, double fileSizeMB, LocalDateTime uploadedAt) {
        this.resumeId = resumeId;
        this.userId = userId;
        this.fileType = fileType;
        this.fileSizeMB = fileSizeMB;
        this.uploadedAt = uploadedAt;
    }

    public int getResumeId(){ return resumeId; }
    public int getUserId(){ return userId; }
    public String getFileType(){ return fileType; }
    public double getFileSizeMB(){ return fileSizeMB; }
    public LocalDateTime getUploadedAt(){ return uploadedAt; }
}
