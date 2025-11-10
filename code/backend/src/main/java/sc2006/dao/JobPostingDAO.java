package sc2006.dao;

import org.springframework.stereotype.Repository;
import sc2006.entity.JobPosting;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for Job Postings.
 * Handles CRUD operations for the 'job_postings' table in Supabase.
 */
@Repository
public class JobPostingDAO {

    // === Supabase Connection ===
    private final String url = "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require";
    private final String user = "postgres.rqdwuevgibwhmknxcyzi";
    private final String password = "SWE_JOBHACK"; // ensure this matches your Supabase DB password

    public JobPostingDAO() {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("PostgreSQL driver not found!", e);
        }
    }

    // === 1️⃣ Create a new job posting ===
    public void addJob(JobPosting job) {
        String sql = "INSERT INTO job_postings (title, company, location, description, salary, job_type, required_skills, requirements, apply_url, posted_at, is_active) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
    
            stmt.setString(1, job.getTitle());
            stmt.setString(2, job.getCompany());
            stmt.setString(3, job.getLocation());
            stmt.setString(4, job.getDescription());
            stmt.setString(5, job.getSalary());
            stmt.setString(6, job.getJobType());
            stmt.setString(7, job.getRequiredSkills());
            stmt.setString(8, job.getRequirements());
            stmt.setString(9, job.getApplyUrl() != null ? job.getApplyUrl().toString() : null);
            stmt.setTimestamp(10, java.sql.Timestamp.valueOf(
                    job.getPostedAt() != null ? job.getPostedAt() : java.time.LocalDateTime.now()));
            stmt.setBoolean(11, job.isActive());
    
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error adding job: " + e.getMessage(), e);
        }
    }
    

    // === 2️⃣ Retrieve a single job by ID ===
    public JobPosting getJobById(Long jobId) {
        String sql = "SELECT * FROM job_postings WHERE id = ?";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, jobId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return new JobPosting(
                    rs.getLong("id"),
                    rs.getString("title"),
                    rs.getString("company"),
                    rs.getString("location"),
                    rs.getString("description"),
                    rs.getTimestamp("posted_at").toLocalDateTime(),
                    rs.getBoolean("is_active")
                );
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving job posting: " + e.getMessage(), e);
        }
        return null;
    }
    public JobPosting getJobPostingById(Long jobId) {
        String sql = "SELECT * FROM job_postings WHERE job_id = ?";
    
        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
    
            stmt.setLong(1, jobId);
            ResultSet rs = stmt.executeQuery();
    
            if (rs.next()) {
                JobPosting job = new JobPosting();
                job.setJobId(rs.getLong("job_id"));
                job.setTitle(rs.getString("title"));
                job.setCompany(rs.getString("company"));
                job.setLocation(rs.getString("location"));
                job.setDescription(rs.getString("description"));
                job.setPostedAt(rs.getTimestamp("posted_at") != null ? rs.getTimestamp("posted_at").toLocalDateTime() : null);
                job.setActive(rs.getBoolean("is_active"));
                job.setSalary(rs.getString("salary"));
                job.setJobType(rs.getString("job_type"));
                job.setRequiredSkills(rs.getString("required_skills"));
                
                // Parse apply_url as URL if present, else set null
                String applyUrlStr = rs.getString("apply_url");
                if (applyUrlStr != null && !applyUrlStr.isEmpty()) {
                    try {
                        job.setApplyUrl(new java.net.URL(applyUrlStr));
                    } catch (java.net.MalformedURLException e) {
                        job.setApplyUrl(null);
                    }
                } else {
                    job.setApplyUrl(null);
                }
                
                // Add requirements field if present in table
                if (hasColumn(rs, "requirements")) {
                    job.setDescription(job.getDescription() + "\nRequirements: " + rs.getString("requirements"));
                }
                return job;
            }
    
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving job posting by ID: " + e.getMessage(), e);
        }
    
        return null;
    }

    // Helper to check if column exists in ResultSet
    private boolean hasColumn(ResultSet rs, String columnName) {
        try {
            rs.findColumn(columnName);
            return true;
        } catch (SQLException e) {
            return false;
        }
    }
    

    // === 3️⃣ Retrieve all active jobs ===
    public List<JobPosting> getAllActiveJobs() {
        List<JobPosting> jobs = new ArrayList<>();
        String sql = "SELECT * FROM job_postings WHERE is_active = TRUE ORDER BY posted_at DESC";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                jobs.add(new JobPosting(
                    rs.getLong("id"),
                    rs.getString("title"),
                    rs.getString("company"),
                    rs.getString("location"),
                    rs.getString("description"),
                    rs.getTimestamp("posted_at").toLocalDateTime(),
                    rs.getBoolean("is_active")
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving all jobs: " + e.getMessage(), e);
        }
        return jobs;
    }

    // === 4️⃣ Save job for a user (requires saved_jobs table) ===
    public void saveJobForUser(Long userId, Long jobId) {
        String sql = "INSERT INTO saved_jobs (user_id, job_id, saved_at) VALUES (?, ?, NOW()) " +
                     "ON CONFLICT (user_id, job_id) DO NOTHING";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, userId);
            stmt.setLong(2, jobId);
            stmt.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Error saving job for user: " + e.getMessage(), e);
        }
    }

    // === 5️⃣ Unsave job for a user ===
    public void unsaveJobForUser(Long userId, Long jobId) {
        String sql = "DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, userId);
            stmt.setLong(2, jobId);
            stmt.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Error unsaving job for user: " + e.getMessage(), e);
        }
    }
    // === Retrieve all job postings ===
    public List<JobPosting> getAllJobPostings() {
        List<JobPosting> jobs = new ArrayList<>();
        String sql = "SELECT * FROM job_postings ORDER BY posted_at DESC";

        try (Connection conn = DriverManager.getConnection(url, user, password);
         PreparedStatement stmt = conn.prepareStatement(sql);
         ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                JobPosting job = new JobPosting();
                job.setJobId(rs.getLong("job_id"));
                job.setTitle(rs.getString("title"));
                job.setCompany(rs.getString("company"));
                job.setLocation(rs.getString("location"));
                job.setDescription(rs.getString("description"));
                job.setPostedAt(rs.getTimestamp("posted_at") != null ? rs.getTimestamp("posted_at").toLocalDateTime() : null);
                job.setActive(rs.getBoolean("is_active"));
                job.setSalary(rs.getString("salary"));
                job.setJobType(rs.getString("job_type"));
                job.setRequiredSkills(rs.getString("required_skills"));
                job.setApplyUrl(null); // If you want to support applyUrl, parse as needed
                jobs.add(job);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving job postings: " + e.getMessage(), e);
        }

        return jobs;
    }


    // === 6️⃣ Get all saved jobs for a user ===
    public List<JobPosting> getSavedJobsForUser(Long userId) {
        List<JobPosting> saved = new ArrayList<>();
        String sql = """
            SELECT j.*
            FROM job_postings j
            JOIN saved_jobs s ON j.id = s.job_id
            WHERE s.user_id = ?
            ORDER BY s.saved_at DESC
        """;

        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                saved.add(new JobPosting(
                    rs.getLong("id"),
                    rs.getString("title"),
                    rs.getString("company"),
                    rs.getString("location"),
                    rs.getString("description"),
                    rs.getTimestamp("posted_at").toLocalDateTime(),
                    rs.getBoolean("is_active")
                ));
            }

        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving saved jobs: " + e.getMessage(), e);
        }
        return saved;
    }
    
}
