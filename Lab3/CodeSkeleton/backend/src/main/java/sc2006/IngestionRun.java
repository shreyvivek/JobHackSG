package sc2006;

import java.time.LocalDateTime;

public class IngestionRun {
    private int runId;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private String status; // "RUNNING","OK","ERROR"
    private int inserted;
    private int updated;
    private int failed;

    public IngestionRun(){}

    public IngestionRun(int runId, LocalDateTime startedAt, String status) {
        this.runId = runId;
        this.startedAt = startedAt;
        this.status = status;
    }

    public int getRunId(){ return runId; }
    public LocalDateTime getStartedAt(){ return startedAt; }
    public LocalDateTime getEndedAt(){ return endedAt; }
    public String getStatus(){ return status; }
    public int getInserted(){ return inserted; }
    public int getUpdated(){ return updated; }
    public int getFailed(){ return failed; }

    public void finish(String status, int ins, int upd, int fail){
        this.status = status;
        this.inserted = ins; this.updated = upd; this.failed = fail;
        this.endedAt = LocalDateTime.now();
    }
}
