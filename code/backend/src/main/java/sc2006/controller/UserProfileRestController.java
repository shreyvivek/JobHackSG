package sc2006.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import sc2006.entity.User;
import sc2006.service.UserProfileService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class UserProfileRestController {
    @Autowired
    private UserProfileService userProfileService;

    @GetMapping("/{userId}/skills")
    public Map<String, Object> getUserSkills(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            java.util.List<String> skills = userProfileService.getUserSkillNames(userId);
            response.put("success", true);
            response.put("skills", skills);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return response;
    }

    @GetMapping("/{userId}")
    public Map<String, Object> getUserProfile(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = userProfileService.getUserProfile(userId);
            if (user != null) {
                response.put("success", true);
                response.put("user", user);
            } else {
                response.put("success", false);
                response.put("error", "User not found");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }

    @PutMapping("/{userId}")
    public Map<String, Object> updateUserProfile(@PathVariable Long userId, @RequestBody Map<String, Object> profileData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            User updatedUser = userProfileService.updateUserProfile(userId, profileData);
            response.put("success", true);
            response.put("user", updatedUser);
            response.put("message", "Profile updated successfully");
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }

    @PostMapping("/{userId}/skills")
    public Map<String, Object> updateUserSkills(@PathVariable Long userId, @RequestBody Map<String, Object> skillsData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            @SuppressWarnings("unchecked")
            java.util.List<String> skills = (java.util.List<String>) skillsData.get("skills");
            userProfileService.updateUserSkills(userId, skills);
            response.put("success", true);
            response.put("message", "Skills updated successfully");
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }
}
