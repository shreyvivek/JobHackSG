package sc2006.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import sc2006.entity.User;
import sc2006.service.AuthService;
import sc2006.util.Exceptions;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class AuthenticationController {

    @Autowired
    private AuthService authService;

    // === Register new user ===
    @PostMapping("/register")
    public org.springframework.http.ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> userData) {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("[Register] Received userData: " + userData);
            String name = (String) userData.get("name");
            String email = (String) userData.get("email");
            String passwordHash = (String) userData.get("passwordHash");
            String role = (String) userData.get("role");
            String school = (String) userData.getOrDefault("school", "");
            Object gradYearObj = userData.getOrDefault("gradYear", 0);
            int gradYear;
            if (gradYearObj instanceof Integer) {
                gradYear = (Integer) gradYearObj;
            } else if (gradYearObj instanceof String) {
                try {
                    gradYear = Integer.parseInt((String) gradYearObj);
                } catch (NumberFormatException e) {
                    gradYear = 0;
                }
            } else {
                gradYear = 0;
            }
            String passwordSalt = ""; // You may want to generate a salt here

            @SuppressWarnings("unchecked")
            List<String> skills = (List<String>) userData.get("skills");

            User newUser = new User(null, name, email, passwordHash, passwordSalt, school, gradYear, role);
            System.out.println("[Register] Creating user: " + newUser);
            User savedUser = null;
            try {
                savedUser = authService.register(newUser);
            } catch (Exception e) {
                System.out.println("[Register] DB error: " + e.getMessage());
                response.put("error", "Registration failed: " + e.getMessage());
                return org.springframework.http.ResponseEntity.status(400).body(response);
            }
            if (savedUser == null || savedUser.getUserId() == null) {
                System.out.println("[Register] User not saved, aborting response.");
                response.put("error", "Registration failed: Could not save user.");
                return org.springframework.http.ResponseEntity.status(400).body(response);
            }
            System.out.println("[Register] User saved: " + savedUser);

            // Add skills if provided
            if (skills != null && !skills.isEmpty()) {
                try {
                    authService.addSkillsToUser(savedUser.getUserId(), skills);
                    System.out.println("[Register] Added skills: " + skills);
                } catch (Exception e) {
                    System.out.println("[Register] Skill add error: " + e.getMessage());
                    response.put("error", "Registration failed: Could not add skills. " + e.getMessage());
                    return org.springframework.http.ResponseEntity.status(400).body(response);
                }
            }

            response.put("id", savedUser.getUserId());
            response.put("userId", savedUser.getUserId());
            response.put("name", savedUser.getName());
            response.put("email", savedUser.getEmail());
            response.put("role", role);
            response.put("skills", skills != null ? skills : List.of());
            response.put("message", "Registration successful");
            System.out.println("[Register] Registration successful for userId: " + savedUser.getUserId());
            return org.springframework.http.ResponseEntity.ok(response);

        } catch (Exceptions.Validation e) {
            System.out.println("[Register] Validation error: " + e.getMessage());
            response.put("error", "Registration failed: " + e.getMessage());
            return org.springframework.http.ResponseEntity.status(400).body(response);
        } catch (Exception e) {
            System.out.println("[Register] Unexpected error: " + e.getMessage());
            response.put("error", "Registration failed: " + e.getMessage());
            return org.springframework.http.ResponseEntity.status(400).body(response);
        }
    }


    // === Login user ===
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("passwordHash");

        Map<String, Object> response = new HashMap<>();
        
        // Validate input fields
        if (email == null || email.trim().isEmpty()) {
            response.put("error", "Email is required");
            return response;
        }
        if (password == null || password.trim().isEmpty()) {
            response.put("error", "Password is required");
            return response;
        }
        
        try {
            User user = authService.loginAndReturnUser(email, password);
            if (user == null) {
                response.put("error", "User not found! Sign up!");
                return response;
            }
            response.put("id", user.getUserId());
            response.put("userId", user.getUserId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            // Fetch skills for user
            List<String> skills = authService.getUserSkills(user.getUserId());
            response.put("skills", skills);
            response.put("message", "Welcome back! Login successful");
            return response;
        } catch (Exceptions.Validation e) {
            // Handle specific validation errors from AuthService
            String errorMsg = e.getMessage();
            if (errorMsg.contains("User not found")) {
                response.put("error", "User not found! Sign up!");
            } else if (errorMsg.contains("Invalid password")) {
                response.put("error", "Password incorrect! Try again");
            } else {
                response.put("error", errorMsg);
            }
            return response;
        } catch (Exception e) {
            response.put("error", "Something went wrong during login. Please try again later.");
            return response;
        }
    }

    // === Get user details ===
    @GetMapping("/{email}")
    public User getUser(@PathVariable String email) {
        return authService.getUser(email);
    }
}
