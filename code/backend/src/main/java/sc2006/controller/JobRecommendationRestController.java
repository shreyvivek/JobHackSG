package sc2006.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import sc2006.service.JobRecommendationService;
import sc2006.service.JobRecommendationService.JobRecommendation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:5173")
public class JobRecommendationRestController {

    @Autowired
    private JobRecommendationService recommendationService;

    @GetMapping("/{userId}")
    public Map<String, Object> getJobRecommendations(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<JobRecommendation> recommendations = recommendationService.getJobRecommendations(userId);
            
            response.put("success", true);
            response.put("recommendations", recommendations);
            response.put("count", recommendations.size());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("recommendations", List.of());
            response.put("count", 0);
        }
        
        return response;
    }
}
