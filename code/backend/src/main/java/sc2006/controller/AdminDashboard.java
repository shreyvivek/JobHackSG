package sc2006.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import sc2006.entity.Course;

import java.util.*;

/**
 * Admin dashboard controller — provides UI endpoints for data ingestion
 * monitoring and manual refresh actions.
 */
@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminDashboard {

    private final AdminIngestionController ingestionController;

    @Autowired
    public AdminDashboard(AdminIngestionController ingestionController) {
        this.ingestionController = ingestionController;
    }

    /**
     * View overall ingestion summary (courses + sector trends)
     */
    @GetMapping("/overview")
    public Map<String, Object> viewOverview() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Course> courses = ingestionController.fetchCourses();
            List<Map<String, Object>> trends = ingestionController.fetchSectorTrends();

            result.put("coursesCount", courses.size());
            result.put("trendsCount", trends.size());
            result.put("status", "Overview fetched successfully");

        } catch (Exception e) {
            result.put("status", "Failed to load overview: " + e.getMessage());
        }
        return result;
    }

    /**
     * Manually refresh both courses and sector trends data.
     */
    @PostMapping("/refresh")
    public Map<String, Object> refreshData() {
        return ingestionController.refreshAllData();
    }

    /**
     * Test endpoint to verify backend connectivity.
     */
    @GetMapping("/ping")
    public Map<String, String> ping() {
        return Map.of("status", "Admin Dashboard is live");
    }
}
