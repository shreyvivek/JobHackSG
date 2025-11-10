package sc2006.controller;

import java.util.List;
import java.util.Map;

import sc2006.entity.User;
import sc2006.entity.Skill;

public class ProfilePage {

    private final ProfileController profileController;

    public ProfilePage() {
        this.profileController = new ProfileController();
    }

    /** 
     * UC-12: Display user profile summary 
     */
    public void displayProfile(Long userId) {
        try {
            User user = profileController.getProfile(userId);
            System.out.println("=== User Profile ===");
            System.out.println("Name: " + user.getName());
            System.out.println("Email: " + user.getEmail());
            System.out.println("School: " + user.getSchool());
            System.out.println("Graduation Year: " + user.getGradYear());

            System.out.println("\nSkills:");
            List<Skill> skills = profileController.listUserSkills(userId);
            if (skills.isEmpty()) {
                System.out.println("No skills added yet.");
            } else {
                for (Skill s : skills) {
                    System.out.println("• " + s.getName());
                }
            }
        } catch (Exception e) {
            System.err.println("Error displaying profile: " + e.getMessage());
        }
    }

    /** 
     * UC-13: Display editable fields (for UI input)
     */
    public void displayEditableFields(Long userId) {
        try {
            User user = profileController.getProfile(userId);
            System.out.println("\n=== Edit Profile ===");
            System.out.println("Current name: " + user.getName());
            System.out.println("Current school: " + user.getSchool());
            System.out.println("Current graduation year: " + user.getGradYear());
            System.out.println("Enter new values to update...");
        } catch (Exception e) {
            System.err.println("Error loading editable fields: " + e.getMessage());
        }
    }

    /** 
     * UC-13: Update user profile from a map of inputs (used by UI layer)
     */
    public void updateProfile(Long userId, Map<String, Object> updates) {
        try {
            String newName = (String) updates.getOrDefault("name", "");
            String newSchool = (String) updates.getOrDefault("school", "");
            int newGradYear = (int) updates.getOrDefault("gradYear", 2025);

            profileController.updateProfile(userId, newName, newSchool, newGradYear);
            System.out.println("Profile updated successfully.");
        } catch (Exception e) {
            System.err.println("Error updating profile: " + e.getMessage());
        }
    }
}
