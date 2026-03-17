package com.foodbridge.controller;

import com.foodbridge.dto.ApiResponse;
import com.foodbridge.model.Claim;
import com.foodbridge.model.User;
import com.foodbridge.service.ClaimService;
import com.foodbridge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @Autowired
    private UserService userService;

    /**
     * Claim a food listing (Receiver only).
     */
    @PostMapping("/{listingId}")
    public ResponseEntity<?> claimListing(
            @PathVariable Long listingId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        try {
            User receiver = userService.getUserByEmail(authentication.getName());
            LocalDateTime pickupTime = LocalDateTime.parse(body.get("scheduledPickupTime"));

            Claim claim = claimService.claimListing(listingId, receiver, pickupTime);
            return ResponseEntity.ok(new ApiResponse(true, "Listing claimed successfully", claim));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Provider confirms pickup.
     */
    @PutMapping("/{claimId}/confirm-provider")
    public ResponseEntity<?> providerConfirm(@PathVariable Long claimId) {
        try {
            Claim claim = claimService.providerConfirm(claimId);
            return ResponseEntity.ok(new ApiResponse(true, "Pickup confirmed by provider", claim));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Receiver confirms pickup.
     */
    @PutMapping("/{claimId}/confirm-receiver")
    public ResponseEntity<?> receiverConfirm(@PathVariable Long claimId) {
        try {
            Claim claim = claimService.receiverConfirm(claimId);
            return ResponseEntity.ok(new ApiResponse(true, "Pickup confirmed by receiver", claim));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Mark receiver as no-show.
     */
    @PutMapping("/{claimId}/no-show")
    public ResponseEntity<?> markNoShow(@PathVariable Long claimId) {
        try {
            claimService.markNoShow(claimId);
            return ResponseEntity.ok(new ApiResponse(true, "Receiver marked as no-show"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Get my claims (Receiver).
     */
    @GetMapping("/my")
    public ResponseEntity<?> getMyClaims(Authentication authentication) {
        User receiver = userService.getUserByEmail(authentication.getName());
        List<Claim> claims = claimService.getReceiverClaims(receiver);
        return ResponseEntity.ok(claims);
    }

    /**
     * Get claim by listing ID.
     */
    @GetMapping("/listing/{listingId}")
    public ResponseEntity<?> getClaimByListing(@PathVariable Long listingId) {
        try {
            Claim claim = claimService.getClaimByListingId(listingId);
            return ResponseEntity.ok(claim);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
