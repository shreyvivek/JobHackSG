package sc2006.dao;

import org.springframework.stereotype.Repository;
import sc2006.entity.Skill;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class SkillDAO {

    private final String url = "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require";
    private final String user = "postgres.rqdwuevgibwhmknxcyzi";
    private final String password = "SWE_JOBHACK";

    public SkillDAO() {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("PostgreSQL driver not found!", e);
        }
    }

    // Retrieve all skills
    public List<Skill> getAllSkills() {
        List<Skill> skills = new ArrayList<>();
        String sql = "SELECT * FROM skills";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                skills.add(new Skill(
                    rs.getLong("skill_id"),
                    rs.getString("name")
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching skills: " + e.getMessage(), e);
        }
        return skills;
    }

    // Retrieve one skill by ID
    public Skill getSkillById(Long id) {
        String sql = "SELECT * FROM skills WHERE skill_id = ?";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Skill(rs.getLong("skill_id"), rs.getString("name"));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving skill by ID: " + e.getMessage(), e);
        }
        return null;
    }

    // Retrieve one skill by name
    public Skill getSkillByName(String name) {
        String sql = "SELECT * FROM skills WHERE name = ?";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, name);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Skill(rs.getLong("skill_id"), rs.getString("name"));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving skill by name: " + e.getMessage(), e);
        }
        return null;
    }

    // Create a new skill
    public Skill createSkill(Skill skill) {
        String sql = "INSERT INTO skills (name) VALUES (?) RETURNING skill_id";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, skill.getName());
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                skill.setSkillId(rs.getLong("skill_id"));
                return skill;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error creating skill: " + e.getMessage(), e);
        }
        return null;
    }

    // Save a skill (alias for createSkill)
    public Skill saveSkill(Skill skill) {
        return createSkill(skill);
    }
}
