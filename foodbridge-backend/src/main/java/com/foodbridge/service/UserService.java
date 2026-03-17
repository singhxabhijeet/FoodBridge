package com.foodbridge.service;

import com.foodbridge.model.User;
import com.foodbridge.model.enums.Role;
import com.foodbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getPendingUsers() {
        return userRepository.findByApprovedFalse();
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    /**
     * Admin approves a user registration.
     */
    public User approveUser(Long userId) {
        User user = getUserById(userId);
        user.setApproved(true);
        userRepository.save(user);
        notificationService.createNotification(user, "Your account has been approved! You can now log in.", "APPROVAL");
        return user;
    }

    /**
     * Admin restricts a user (typically a receiver with too many no-shows).
     */
    public User restrictUser(Long userId) {
        User user = getUserById(userId);
        user.setRestricted(true);
        userRepository.save(user);
        notificationService.createNotification(user, "Your account has been restricted due to policy violations.",
                "RESTRICTION");
        return user;
    }

    /**
     * Unrestrict a user.
     */
    public User unrestrictUser(Long userId) {
        User user = getUserById(userId);
        user.setRestricted(false);
        user.setNoShowCount(0);
        userRepository.save(user);
        return user;
    }
}
