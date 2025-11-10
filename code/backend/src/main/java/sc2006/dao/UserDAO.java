package sc2006.dao;

import org.springframework.stereotype.Repository;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import sc2006.entity.User;

@Repository
public class UserDAO {

    // === Database Config ===
    private final String url = "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require";
    private final String username = "postgres.rqdwuevgibwhmknxcyzi";
    private final String password = "SWE_JOBHACK";

    public UserDAO() {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("PostgreSQL driver not found!", e);
        }
    }

    // === INSERT: Add a new user ===
    public void addUser(User u) {
        String sql = "INSERT INTO users (name, email, password_hash, password_salt, school, grad_year) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            System.out.println("Adding user: " + u);
            stmt.setString(1, u.getName());
            stmt.setString(2, u.getEmail());
            stmt.setString(3, u.getPasswordHash());
            stmt.setString(4, u.getPasswordSalt());
            stmt.setString(5, u.getSchool());
            stmt.setInt(6, u.getGradYear());

            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error inserting user: " + e.getMessage(), e);
        }
    }

    // === SELECT: Get user by email ===
    public User getUserByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return new User(
                    rs.getLong("user_id"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("password_hash"),
                    rs.getString("password_salt"),
                    rs.getString("school"),
                    rs.getInt("grad_year"),
                    rs.getString("role")
                );
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving user by email: " + e.getMessage(), e);
        }
        return null;
    }

    public User getUserById(Long id) {
        String sql = "SELECT * FROM users WHERE user_id = ?";
        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
    
            stmt.setLong(1, id);
            ResultSet rs = stmt.executeQuery();
    
            if (rs.next()) {
                User fetchedUser = new User(
                    rs.getLong("user_id"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("password_hash"),
                    rs.getString("password_salt"),
                    rs.getString("school"),
                    rs.getInt("grad_year"),
                    rs.getString("role")
                );
                return fetchedUser;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving user by ID: " + e.getMessage(), e);
        }
        return null;
    }
    
    
    // === SELECT: Get all users ===
    public List<User> getAllUsers() {
        List<User> list = new ArrayList<>();
        String sql = "SELECT * FROM users";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                list.add(new User(
                    rs.getLong("user_id"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("password_hash"),
                    rs.getString("password_salt"),
                    rs.getString("school"),
                    rs.getInt("grad_year"),
                    rs.getString("role")
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving all users: " + e.getMessage(), e);
        }
        return list;
    }
    // === Update user details ===
    public void updateUser(User user) {
        String sql = "UPDATE users SET name = ?, school = ?, grad_year = ? WHERE user_id = ?";

        try (Connection conn = DriverManager.getConnection(url, username, password);
            PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, user.getName());
            stmt.setString(2, user.getSchool());
            stmt.setInt(3, user.getGradYear());
            stmt.setLong(4, user.getUserId());
            stmt.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Error updating user: " + e.getMessage(), e);
        }
    }


}
