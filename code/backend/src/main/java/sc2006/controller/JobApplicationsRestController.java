package sc2006.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sc2006.entity.JobApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "http://localhost:5173") // frontend port (adjust if needed)
public class JobApplicationsRestController {

    private static final Logger logger = LoggerFactory.getLogger(JobApplicationsRestController.class);
    private final JobApplicationController controller;

    // Constructor injection (preferred in Spring)
    public JobApplicationsRestController(JobApplicationController controller) {
        this.controller = controller;
    }

    /** 
     * List all applications for a user 
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<JobApplication>> listApps(@PathVariable Long userId) {
        logger.info("Fetching job applications for userId={}", userId);
        List<JobApplication> apps = controller.listJobApplications(userId);
        if (apps.isEmpty()) {
            logger.info("No applications found for userId={}", userId);
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        return ResponseEntity.ok(apps); // 200 OK
    }

    /** 
     * Create a new application 
     */
    @PostMapping
    public ResponseEntity<JobApplication> createApp(@RequestBody JobApplication app) {
        try {
            logger.info("Creating job application for userId={}, jobId={}", app.getUserId(), app.getJobId());
            JobApplication created = controller.createApplication(
                app.getUserId(),
                app.getJobId(),
                app.getNote() // use note, not status
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(created); // 201 Created
        } catch (IllegalArgumentException e) {
            logger.warn("Failed to create application: {}", e.getMessage());
            return ResponseEntity.badRequest().build(); // 400 Bad Request
        } catch (Exception e) {
            logger.error("Unexpected error creating application", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500
        }
    }

    /** 
     * Update an existing application 
     */
    @PutMapping("/{appId}")
    public ResponseEntity<JobApplication> updateApp(@PathVariable Long appId, @RequestBody JobApplication app) {
        try {
            logger.info("Updating job application appId={}", appId);
            JobApplication updated = controller.updateJobApplication(appId, app.getStatus(), app.getNote());
            if (updated == null) {
                logger.warn("Application appId={} not found", appId);
                return ResponseEntity.notFound().build(); // 404 Not Found
            }
            return ResponseEntity.ok(updated); // 200 OK
        } catch (Exception e) {
            logger.error("Error updating application appId={}", appId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500
        }
    }

    /** 
     * Global exception handler 
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        logger.error("Unhandled exception occurred: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
}
