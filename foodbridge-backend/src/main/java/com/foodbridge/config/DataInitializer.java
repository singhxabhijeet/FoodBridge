package com.foodbridge.config;

import com.foodbridge.model.User;
import com.foodbridge.model.enums.Role;
import com.foodbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates a default admin user on first startup.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!userRepository.existsByEmail("admin@foodbridge.com")) {
            User admin = new User();
            admin.setFullName("Admin");
            admin.setEmail("admin@foodbridge.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setApproved(true);
            admin.setOrganization("FoodBridge");
            admin.setAddress("System");
            userRepository.save(admin);
            System.out.println("✅ Default admin created: admin@foodbridge.com / admin123");
        }
    }
}
