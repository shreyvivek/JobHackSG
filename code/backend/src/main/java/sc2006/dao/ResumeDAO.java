package sc2006.dao;

import java.sql.*;
import java.util.*;
import sc2006.entity.Resume;

public class ResumeDAO {

    private final String url = "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require";
    private final String user = "postgres.rqdwuevgibwhmknxcyzi";
    private final String password = "SWE_JOBHACK";

    public void addResume(Resume resume) {
        String sql = "INSERT INTO resumes (user_id, file_type, file_size_mb, uploaded_at) VALUES (?, ?, ?, ?)";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, resume.getUserId());
            stmt.setString(2, resume.getFileType());
            stmt.setDouble(3, resume.getFileSizeMB());
            stmt.setTimestamp(4, Timestamp.valueOf(resume.getUploadedAt()));
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error inserting resume: " + e.getMessage(), e);
        }
    }

    public Optional<Resume> getResumeByUserId(Long userId) {
        String sql = "SELECT * FROM resumes WHERE user_id = ?";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                Resume resume = new Resume(
                    rs.getLong("resume_id"),
                    rs.getLong("user_id"),
                    rs.getString("file_type"),
                    rs.getDouble("file_size_mb"),
                    rs.getTimestamp("uploaded_at").toLocalDateTime()
                );
                return Optional.of(resume);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving resume: " + e.getMessage(), e);
        }
        return Optional.empty();
    }

    public void deleteResumeByUserId(Long userId) {
        String sql = "DELETE FROM resumes WHERE user_id = ?";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error deleting resume: " + e.getMessage(), e);
        }
    }
}
