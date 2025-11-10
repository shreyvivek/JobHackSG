package sc2006.dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SavedJobDAO {

    private final String url = "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require";
    private final String username = "postgres.rqdwuevgibwhmknxcyzi";
    private final String password = "SWE_JOBHACK";

    // Add a saved job
    public void addSavedJob(Long userId, Long jobId) {
        String sql = "INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?) ON CONFLICT DO NOTHING";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            stmt.setLong(2, jobId);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error saving job: " + e.getMessage(), e);
        }
    }

    // Remove a saved job
    public void removeSavedJob(Long userId, Long jobId) {
        String sql = "DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            stmt.setLong(2, jobId);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error removing saved job: " + e.getMessage(), e);
        }
    }

    // Fetch all saved job IDs for a user
    public List<Long> getSavedJobIds(Long userId) {
        List<Long> jobIds = new ArrayList<>();
        String sql = "SELECT job_id FROM saved_jobs WHERE user_id = ? ORDER BY saved_at DESC";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                jobIds.add(rs.getLong("job_id"));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error fetching saved job IDs: " + e.getMessage(), e);
        }

        return jobIds;
    }
}
