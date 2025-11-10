package sc2006.controller;

import sc2006.entity.JobApplication;
import java.util.*;
import org.springframework.web.client.RestTemplate;

/**
 * Local page-layer helper for interacting with JobApplicationController (via REST).
 * This is NOT a Spring Controller — it simulates UI logic calling the backend API.
 */
public class ApplicationsPage {

    private static final String BASE_URL = "http://localhost:8080/api/applications";
    private final RestTemplate restTemplate = new RestTemplate();

    /** Fetch all job applications for a specific user */
    public List<JobApplication> listJobApplications(Long userId) {
        String url = BASE_URL + "/user/" + userId;
        JobApplication[] apps = restTemplate.getForObject(url, JobApplication[].class);
        return apps != null ? Arrays.asList(apps) : new ArrayList<>();
    }

    /** Update a job application's status (e.g., "Withdrawn", "Accepted") */
    public JobApplication updateJobApplication(Long appId, String newStatus, String note) {
        String url = BASE_URL + "/" + appId;
        Map<String, String> body = new HashMap<>();
        body.put("status", newStatus);
        if (note != null) body.put("note", note);
        return restTemplate.postForObject(url, body, JobApplication.class);
    }

    /** Display all applications neatly */
    public void renderApplications(Long userId) {
        List<JobApplication> apps = listJobApplications(userId);
        if (apps.isEmpty()) {
            System.out.println("You have no job applications yet.");
            return;
        }

        System.out.println("=== Your Applications ===");
        for (JobApplication app : apps) {
            System.out.printf("Application #%d — Job ID: %d — Status: %s — Note: %s%n",
                    app.getId(), app.getJobId(), app.getStatus(), app.getNote());
        }
    }
}
