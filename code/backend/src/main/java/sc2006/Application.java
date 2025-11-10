package sc2006;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import javax.sql.DataSource;
import com.zaxxer.hikari.HikariDataSource;

/**
 * Main entry point for the SC2006 backend.
 * Handles clean startup and graceful shutdown of database connections.
 */
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        // Start the Spring Boot context
        ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);
        System.out.println("Backend started successfully (Supabase-connected)");

        // Register a JVM shutdown hook to close HikariCP connections gracefully
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("\n Cleaning up before shutdown...");

            try {
                DataSource dataSource = context.getBean(DataSource.class);

                if (dataSource instanceof HikariDataSource) {
                    HikariDataSource hikariDataSource = (HikariDataSource) dataSource;

                    if (!hikariDataSource.isClosed()) {
                        hikariDataSource.close();
                        System.out.println("All database connections closed via HikariCP.");
                    } else {
                        System.out.println("HikariCP was already closed.");
                    }

                } else if (dataSource != null) {
                    // Fallback for non-Hikari datasource
                    dataSource.getConnection().close();
                    System.out.println("Database connection closed cleanly (non-Hikari).");
                }

            } catch (Exception e) {
                System.err.println("Error during shutdown cleanup: " + e.getMessage());
            } finally {
                System.out.println("Backend shutdown complete. Goodbye!");
            }
        }));
    }
}
