package com.foodbridge.service;

import com.foodbridge.dto.AuthResponse;
import com.foodbridge.dto.LoginRequest;
import com.foodbridge.dto.RegisterRequest;
import com.foodbridge.model.User;
import com.foodbridge.model.enums.Role;
import com.foodbridge.repository.UserRepository;
import com.foodbridge.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Register a new user. Admin role is auto-approved; all others need admin
     * approval.
     */
    public String register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered!";
        }

        // Create user
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        user.setOrganization(request.getOrganization());
        user.setAddress(request.getAddress());
        user.setPincode(request.getPincode());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setAadhaarNumber(request.getAadhaarNumber());
        user.setPurpose(request.getPurpose());
        user.setLatitude(request.getLatitude());
        user.setLongitude(request.getLongitude());

        // Admin is auto-approved; others need approval
        if (user.getRole() == Role.ADMIN) {
            user.setApproved(true);
        }

        userRepository.save(user);
        return "Registration successful! Please wait for admin approval.";
    }

    /**
     * Login and return a JWT token.
     */
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isApproved()) {
            throw new RuntimeException("Your account is pending admin approval");
        }

        if (user.isRestricted()) {
            throw new RuntimeException("Your account has been restricted. Contact admin.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token, user.getRole().name(), user.getFullName(), user.getId());
    }
}
