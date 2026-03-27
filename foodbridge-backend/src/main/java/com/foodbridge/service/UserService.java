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
        return user;
    }

    /**
     * Admin restricts a user (typically a receiver with too many no-shows).
     */
    public User restrictUser(Long userId) {
        User user = getUserById(userId);
        user.setRestricted(true);
        userRepository.save(user);
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

    /**
     * Admin deletes a user permanently.
     */
    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
    }

    /**
     * Promote a user to SUB_ADMIN — ADMIN only.
     */
    public User promoteToSubAdmin(Long userId) {
        User user = getUserById(userId);
        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Cannot promote an ADMIN");
        }
        if (user.getRole() == Role.SUB_ADMIN) {
            throw new RuntimeException("User is already a Sub-Admin");
        }
        user.setRole(Role.SUB_ADMIN);
        user.setApproved(true);
        userRepository.save(user);
        return user;
    }

    /**
     * Demote a SUB_ADMIN back to their previous role — ADMIN only.
     * Requires the target role to demote to.
     */
    public User demoteFromSubAdmin(Long userId, Role targetRole) {
        User user = getUserById(userId);
        if (user.getRole() != Role.SUB_ADMIN) {
            throw new RuntimeException("User is not a Sub-Admin");
        }
        user.setRole(targetRole);
        userRepository.save(user);
        return user;
    }
}
