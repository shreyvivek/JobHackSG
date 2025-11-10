package sc2006.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import sc2006.entity.Admin;
import sc2006.repository.AdminRepository;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminAuthController {

    @Autowired
    private AdminRepository adminRepository;

    // Register new admin
    @PostMapping("/register")
    public String registerAdmin(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        String company = payload.get("company");

        if (email == null || password == null || company == null) {
            return "Missing required fields.";
        }

        if (adminRepository.findByEmail(email).isPresent()) {
            return "Email already registered.";
        }

        Admin admin = new Admin(email, password, company);
        adminRepository.save(admin);
        return "Admin registered successfully!";
    }

    // Login existing admin
    @PostMapping("/login")
    public String loginAdmin(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        Optional<Admin> admin = adminRepository.findByEmailAndPassword(email, password);
        return admin.map(a -> "Login successful for company: " + a.getCompany())
                    .orElse("Invalid credentials");
    }
}
