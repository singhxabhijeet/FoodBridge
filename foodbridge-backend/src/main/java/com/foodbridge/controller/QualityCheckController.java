package com.foodbridge.controller;

import com.foodbridge.dto.ApiResponse;
import com.foodbridge.model.QualityCheck;
import com.foodbridge.model.User;
import com.foodbridge.service.QualityCheckService;
import com.foodbridge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quality-checks")
public class QualityCheckController {

    @Autowired
    private QualityCheckService qualityCheckService;

    @Autowired
    private UserService userService;

    /**
     * Approve or reject a listing (Checker only).
     */
    @PostMapping("/{listingId}/review")
    public ResponseEntity<?> reviewListing(
            @PathVariable Long listingId,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        try {
            User checker = userService.getUserByEmail(authentication.getName());
            boolean approved = (Boolean) body.get("approved");
            String reason = (String) body.getOrDefault("reason", "");

            QualityCheck check = qualityCheckService.reviewListing(listingId, checker, approved, reason);
            return ResponseEntity.ok(new ApiResponse(true, approved ? "Listing approved" : "Listing rejected", check));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Get checker's review history.
     */
    @GetMapping("/history")
    public ResponseEntity<?> getHistory(Authentication authentication) {
        User checker = userService.getUserByEmail(authentication.getName());
        List<QualityCheck> history = qualityCheckService.getCheckerHistory(checker);
        return ResponseEntity.ok(history);
    }

    /**
     * Update an existing review.
     */
    @PutMapping("/{checkId}/update")
    public ResponseEntity<?> updateReview(
            @PathVariable Long checkId,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        try {
            User checker = userService.getUserByEmail(authentication.getName());
            boolean approved = (Boolean) body.get("approved");
            String reason = (String) body.getOrDefault("reason", "");

            QualityCheck check = qualityCheckService.updateReview(checkId, checker, approved, reason);
            return ResponseEntity.ok(new ApiResponse(true, "Review updated successfully", check));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
