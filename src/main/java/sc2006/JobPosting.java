package sc2006;

import java.net.URL;
import java.time.LocalDateTime;

public class JobPosting {
    private int jobId;
    private String title;
    private String company;
    private String location;
    private String description;
    private LocalDateTime postedAt;
    private URL applyUrl;
    private boolean active;

    public JobPosting(){}

    public JobPosting(int jobId, String title, String company, String location, String description,
                      LocalDateTime postedAt, URL applyUrl, boolean active) {
        this.jobId = jobId;
        this.title = title;
        this.company = company;
        this.location = location;
        this.description = description;
        this.postedAt = postedAt;
        this.applyUrl = applyUrl;
        this.active = active;
    }

    public int getJobId(){ return jobId; }
    public String getTitle(){ return title; }
    public String getCompany(){ return company; }
    public String getLocation(){ return location; }
    public String getDescription(){ return description; }
    public LocalDateTime getPostedAt(){ return postedAt; }
    public URL getApplyUrl(){ return applyUrl; }
    public boolean isActive(){ return active; }
    public void setActive(boolean active){ this.active = active; }
}
