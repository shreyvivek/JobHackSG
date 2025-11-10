package sc2006.controller;

import java.util.HashMap;
import java.util.Map;
import sc2006.util.Exceptions;
import sc2006.dao.UserDAO;

public class RegisterPage {

    public RegisterPage() {}

    public void enterRegistrationDetails(Map<String, Object> userData) {
        // Placeholder for UI capture logic (name, email, password, etc.)
    }

    public Map<String, Object> submitRegistration(Map<String, Object> userData) {
        try {
            // Build User object from registration data
            String name = (String) userData.getOrDefault("name", "");
            String email = (String) userData.getOrDefault("email", "");
            String passwordHash = (String) userData.getOrDefault("passwordHash", "");
            String passwordSalt = ""; // You may want to generate a salt here
            String school = (String) userData.getOrDefault("school", "");
            String role = (String) userData.getOrDefault("role", "student");
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

            sc2006.entity.User newUser = new sc2006.entity.User(
                null, // id will be auto-generated
                name,
                email,
                passwordHash,
                passwordSalt,
                school,
                gradYear,
                role
            );

            // Add user to DB using UserDAO
            UserDAO userDAO = new UserDAO();
            userDAO.addUser(newUser);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful");
            response.put("user", newUser);
            return response;

        } catch (Exceptions.Validation e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Registration failed: " + e.getMessage());
            return error;
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Unexpected error: " + e.getMessage());
            return error;
        }
    }

    public void showConfirmation() {
        // Placeholder for success message
        System.out.println("Registration complete!");
    }
}
