package sc2006.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import sc2006.service.CourseService;
import sc2006.service.SectorTrendService;
import sc2006.dao.JobPostingDAO;
import sc2006.entity.Course;
import sc2006.entity.JobPosting;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Handles admin-triggered ingestion from external data sources (Data.gov.sg APIs)
 * and persists them to Supabase instead of using in-memory storage.
 */
@RestController
@RequestMapping("/api/admin/ingest")
@CrossOrigin(origins = "http://localhost:5173") // frontend dev
public class AdminIngestionController {

    private final CourseService courseService;
    private final SectorTrendService sectorTrendService;
    private final JobPostingDAO jobPostingDAO;

    @Autowired
    public AdminIngestionController(CourseService courseService, SectorTrendService sectorTrendService, JobPostingDAO jobPostingDAO) {
        this.courseService = courseService;
        this.sectorTrendService = sectorTrendService;
        this.jobPostingDAO = jobPostingDAO;
    }

    /**
     * Fetches and returns all courses from the Data.gov.sg dataset.
     */
    @GetMapping("/courses")
    public List<Course> fetchCourses() {
        try {
            List<Course> courses = courseService.fetchCourses();
            System.out.println("Successfully fetched " + courses.size() + " courses.");
            return courses;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch courses: " + e.getMessage());
        }
    }

    /**
     * Fetches and returns sector trend data from Data.gov.sg.
     */
    @GetMapping("/sector-trends")
    public List<Map<String, Object>> fetchSectorTrends() {
        try {
            List<Map<String, Object>> trends = sectorTrendService.fetchAndTransformTrends();
            System.out.println("Successfully fetched " + trends.size() + " sector trends.");
            return trends;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch sector trends: " + e.getMessage());
        }
    }

    /**
     * Endpoint for manual verification or forced refresh.
     */
    @PostMapping("/refresh")
    public Map<String, Object> refreshAllData() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Course> courses = courseService.fetchCourses();
            List<Map<String, Object>> trends = sectorTrendService.fetchAndTransformTrends();

            result.put("coursesFetched", courses.size());
            result.put("sectorTrendsFetched", trends.size());
            result.put("status", "Refresh successful");

        } catch (Exception e) {
            result.put("status", "Refresh failed: " + e.getMessage());
        }
        return result;
    }
    @PostMapping("/jobs")
    public ResponseEntity<String> addJob(@RequestBody JobPosting jobPosting) {
        try {
            if (jobPosting.getPostedAt() == null) {
                jobPosting.setPostedAt(LocalDateTime.now());
            }
            jobPosting.setActive(true);
            jobPostingDAO.addJob(jobPosting);  // ✅ instance call

            return ResponseEntity.ok("✅ Job added successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("❌ Failed to add job: " + e.getMessage());
        }
    }

}
