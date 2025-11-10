package sc2006.dao;
import org.springframework.stereotype.Repository;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import sc2006.entity.UserSkill;


@Repository
public class UserSkillDAO {
    private final String url = "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require";
    private final String user = "postgres.rqdwuevgibwhmknxcyzi";
    private final String password = "SWE_JOBHACK";

    public void addUserSkill(UserSkill us) {
        String sql = "INSERT INTO user_skills (user_id, skill_id, level, source) VALUES (?, ?, ?, ?)";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, us.getUserId());
            stmt.setLong(2, us.getSkillId());
            stmt.setInt(3, us.getLevel());
            stmt.setString(4, us.getSource());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error inserting user skill: " + e.getMessage(), e);
        }
    }

    // Add user skill with default values
    public void addUserSkill(Long userId, Long skillId) {
        String sql = "INSERT INTO user_skills (user_id, skill_id, source) VALUES (?, ?, ?)";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            stmt.setLong(2, skillId);
            stmt.setString(3, "manual"); // Default source
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error inserting user skill: " + e.getMessage(), e);
        }
    }

    // Check if a user already has a skill
    public boolean userHasSkill(Long userId, Long skillId) {
        String sql = "SELECT COUNT(*) FROM user_skills WHERE user_id = ? AND skill_id = ?";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            stmt.setLong(2, skillId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error checking user skill: " + e.getMessage(), e);
        }
        return false;
    }


    public void deleteUserSkillsBySource(Long userId, String source) {
        String sql = "DELETE FROM user_skills WHERE user_id = ? AND LOWER(source) = LOWER(?)";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            stmt.setString(2, source);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error deleting user skills: " + e.getMessage(), e);
        }
    }
    public List<UserSkill> getUserSkillsByUserId(Long userId) {
        List<UserSkill> list = new ArrayList<>();
        String sql = "SELECT * FROM user_skills WHERE user_id = ?";

        try (Connection conn = DriverManager.getConnection(url, user, password);
            PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                UserSkill us = new UserSkill(
                    rs.getLong("user_id"),
                    rs.getLong("skill_id"),
                    rs.getInt("level"),
                    rs.getString("source")
                );
                list.add(us);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving user skills: " + e.getMessage(), e);
        }

        return list;
    }
        // === Get all skills for a user ===
    public List<UserSkill> getUserSkills(Long userId) {
        List<UserSkill> skills = new ArrayList<>();
        String sql = "SELECT * FROM user_skills WHERE user_id = ?";

        try (Connection conn = DriverManager.getConnection(url, user, password);
            PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                skills.add(new UserSkill(
                    rs.getLong("user_id"),
                    rs.getLong("skill_id"),
                    rs.getInt("level"),
                    rs.getString("source")
                ));
            }

        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving user skills: " + e.getMessage(), e);
        }
        return skills;
    }

    // === Delete a user skill ===
    public void deleteUserSkill(Long userId, Long skillId) {
        String sql = "DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?";

        try (Connection conn = DriverManager.getConnection(url, user, password);
            PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, userId);
            stmt.setLong(2, skillId);
            stmt.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Error deleting user skill: " + e.getMessage(), e);
        }
    }


}
