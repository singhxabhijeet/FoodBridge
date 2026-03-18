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
     * Get dashboard statistics.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    /**
     * Get all users.
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Get pending (unapproved) users.
     */
    @GetMapping("/users/pending")
    public ResponseEntity<List<User>> getPendingUsers() {
        return ResponseEntity.ok(userService.getPendingUsers());
    }

    /**
     * Approve a user.
     */
    @PutMapping("/users/{id}/approve")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        try {
            User user = userService.approveUser(id);
            return ResponseEntity.ok(new ApiResponse(true, "User approved", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Restrict a user.
     */
    @PutMapping("/users/{id}/restrict")
    public ResponseEntity<?> restrictUser(@PathVariable Long id) {
        try {
            User user = userService.restrictUser(id);
            return ResponseEntity.ok(new ApiResponse(true, "User restricted", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Unrestrict a user.
     */
    @PutMapping("/users/{id}/unrestrict")
    public ResponseEntity<?> unrestrictUser(@PathVariable Long id) {
        try {
            User user = userService.unrestrictUser(id);
            return ResponseEntity.ok(new ApiResponse(true, "User unrestricted", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Get all listings (admin view).
     */
    @GetMapping("/listings")
    public ResponseEntity<List<FoodListing>> getAllListings() {
        return ResponseEntity.ok(listingService.getAllListings());
    }

    /**
     * Delete a user permanently.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
