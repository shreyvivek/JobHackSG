package sc2006.dao;

import sc2006.entity.JobApplication;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO for handling job applications in Supabase.
 */
public class JobApplicationDAO {

    private final String url = "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require";
    private final String user = "postgres.rqdwuevgibwhmknxcyzi";
    private final String password = "SWE_JOBHACK";

    public JobApplicationDAO() {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("PostgreSQL driver not found!", e);
        }
    }

    // ===  Add new application ===
    public void addApplication(JobApplication app) {
        String sql = "INSERT INTO job_applications (user_id, job_id, status, note, applied_at) VALUES (?, ?, ?, ?, NOW())";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, app.getUserId());
            stmt.setLong(2, app.getJobId());
            stmt.setString(3, app.getStatus());
            stmt.setString(4, app.getNote());
            stmt.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Error adding job application: " + e.getMessage(), e);
        }
    }

    // ===  Add and return newly created application ===
    public JobApplication addAndReturnApplication(Long userId, Long jobId, String status, String note) {
        String sql = "INSERT INTO job_applications (user_id, job_id, status, note, applied_at) VALUES (?, ?, ?, ?, NOW()) RETURNING *";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, userId);
            stmt.setLong(2, jobId);
            stmt.setString(3, status);
            stmt.setString(4, note);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return mapRow(rs);
            }

        } catch (SQLException e) {
            throw new RuntimeException("Error creating application: " + e.getMessage(), e);
        }
        return null;
    }

    // === Get all job applications ===
    public List<JobApplication> getAllApplications() {
        List<JobApplication> apps = new ArrayList<>();
        String sql = "SELECT * FROM job_applications ORDER BY applied_at DESC";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                apps.add(mapRow(rs));
            }

        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving applications: " + e.getMessage(), e);
        }
        return apps;
    }

    // === Get applications by user ===
    public List<JobApplication> getApplicationsByUser(Long userId) {
        List<JobApplication> apps = new ArrayList<>();
        String sql = "SELECT * FROM job_applications WHERE user_id = ? ORDER BY applied_at DESC";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                apps.add(mapRow(rs));
            }

        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving user applications: " + e.getMessage(), e);
        }
        return apps;
    }

    // === Update application status and note ===
    public JobApplication updateApplication(Long appId, String status, String note) {
        String sql = "UPDATE job_applications SET status = ?, note = ?, updated_at = NOW() WHERE id = ? RETURNING *";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, status);
            stmt.setString(2, note);
            stmt.setLong(3, appId);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return mapRow(rs);
            }

        } catch (SQLException e) {
            throw new RuntimeException("Error updating application: " + e.getMessage(), e);
        }
        return null;
    }
    // === Retrieve a single applicatioon by ID ==
    // Retrieve a single application by ID
public JobApplication getApplicationById(Long appId) {
    String sql = "SELECT * FROM job_applications WHERE id = ?";
    try (Connection conn = DriverManager.getConnection(url, user, password);
         PreparedStatement stmt = conn.prepareStatement(sql)) {

        stmt.setLong(1, appId);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            JobApplication app = new JobApplication();
            app.setId(rs.getLong("id"));
            app.setUserId(rs.getLong("user_id"));
            app.setJobId(rs.getLong("job_id"));
            app.setStatus(rs.getString("status"));
            app.setNote(rs.getString("note"));
            app.setAppliedAt(rs.getTimestamp("applied_at").toLocalDateTime());
            return app;
        }
    } catch (Exception e) {
        throw new RuntimeException("Error fetching job application by ID: " + e.getMessage(), e);
    }
    return null;
}


    // === Delete application ===
    public void deleteApplication(Long appId) {
        String sql = "DELETE FROM job_applications WHERE id = ?";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, appId);
            stmt.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Error deleting application: " + e.getMessage(), e);
        }
    }

    // === Helper: Map SQL result to JobApplication entity ===
    private JobApplication mapRow(ResultSet rs) throws SQLException {
        JobApplication app = new JobApplication();
        app.setId(rs.getLong("id"));
        app.setUserId(rs.getLong("user_id"));
        app.setJobId(rs.getLong("job_id"));
        app.setStatus(rs.getString("status"));
        app.setNote(rs.getString("note"));
        app.setAppliedAt(rs.getTimestamp("applied_at").toLocalDateTime());
        return app;
    }
}
