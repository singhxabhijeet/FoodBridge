package com.foodbridge.controller;

import com.foodbridge.dto.ApiResponse;
import com.foodbridge.dto.DashboardStats;
import com.foodbridge.model.FoodListing;
import com.foodbridge.model.User;
import com.foodbridge.service.DashboardService;
import com.foodbridge.service.FoodListingService;
import com.foodbridge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserService userService;

    @Autowired
    private FoodListingService listingService;

    /**
     * Get dashboard statistics — both ADMIN and SUB_ADMIN.
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN','SUB_ADMIN')")
    public ResponseEntity<DashboardStats> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    /**
     * Get all users — both ADMIN and SUB_ADMIN.
     */
    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN','SUB_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Get pending users — both ADMIN and SUB_ADMIN.
     */
    @GetMapping("/users/pending")
    @PreAuthorize("hasAnyRole('ADMIN','SUB_ADMIN')")
    public ResponseEntity<List<User>> getPendingUsers() {
        return ResponseEntity.ok(userService.getPendingUsers());
    }

    /**
     * Approve a user — both ADMIN and SUB_ADMIN.
     */
    @PutMapping("/users/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','SUB_ADMIN')")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        try {
            User user = userService.approveUser(id);
            return ResponseEntity.ok(new ApiResponse(true, "User approved", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Restrict a user — ADMIN only.
     */
    @PutMapping("/users/{id}/restrict")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> restrictUser(@PathVariable Long id) {
        try {
            User user = userService.restrictUser(id);
            return ResponseEntity.ok(new ApiResponse(true, "User restricted", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Unrestrict a user — ADMIN only.
     */
    @PutMapping("/users/{id}/unrestrict")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> unrestrictUser(@PathVariable Long id) {
        try {
            User user = userService.unrestrictUser(id);
            return ResponseEntity.ok(new ApiResponse(true, "User unrestricted", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Get all listings — both ADMIN and SUB_ADMIN.
     */
    @GetMapping("/listings")
    @PreAuthorize("hasAnyRole('ADMIN','SUB_ADMIN')")
    public ResponseEntity<List<FoodListing>> getAllListings() {
        return ResponseEntity.ok(listingService.getAllListings());
    }

    /**
     * Delete a user — ADMIN only.
     */
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Promote a user to SUB_ADMIN — ADMIN only.
     */
    @PutMapping("/users/{id}/promote-sub-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> promoteToSubAdmin(@PathVariable Long id) {
        try {
            User user = userService.promoteToSubAdmin(id);
            return ResponseEntity.ok(new ApiResponse(true, "User promoted to Sub-Admin", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Demote a SUB_ADMIN back to a regular role — ADMIN only.
     */
    @PutMapping("/users/{id}/demote-sub-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> demoteFromSubAdmin(@PathVariable Long id, @RequestParam String role) {
        try {
            com.foodbridge.model.enums.Role targetRole = com.foodbridge.model.enums.Role.valueOf(role);
            User user = userService.demoteFromSubAdmin(id, targetRole);
            return ResponseEntity.ok(new ApiResponse(true, "User demoted from Sub-Admin", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
