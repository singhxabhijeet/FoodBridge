package com.foodbridge.controller;

import com.foodbridge.dto.ApiResponse;
import com.foodbridge.model.FoodListing;
import com.foodbridge.model.User;
import com.foodbridge.model.enums.FoodType;
import com.foodbridge.model.enums.ListingStatus;
import com.foodbridge.model.enums.PerishLevel;
import com.foodbridge.service.FoodListingService;
import com.foodbridge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/listings")
public class FoodListingController {

    @Autowired
    private FoodListingService listingService;

    @Autowired
    private UserService userService;

    /**
     * Create a new food listing (Provider only).
     */
    @PostMapping("/create")
    public ResponseEntity<?> createListing(
            @RequestParam String foodName,
            @RequestParam int quantity,
            @RequestParam(required = false) String unit,
            @RequestParam String foodType,
            @RequestParam String perishLevel,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile photo,
            @RequestParam(required = false) String safetyChecklist,
            @RequestParam String pickupAddress,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam String pickupWindowStart,
            @RequestParam String pickupWindowEnd,
            Authentication authentication) {
        try {
            User provider = userService.getUserByEmail(authentication.getName());

            FoodListing listing = new FoodListing();
            listing.setFoodName(foodName);
            listing.setQuantity(quantity);
            listing.setUnit(unit);
            listing.setFoodType(FoodType.valueOf(foodType));
            listing.setPerishLevel(PerishLevel.valueOf(perishLevel));
            listing.setDescription(description);
            listing.setSafetyChecklist(safetyChecklist);
            listing.setPickupAddress(pickupAddress);
            listing.setLatitude(latitude);
            listing.setLongitude(longitude);
            listing.setPickupWindowStart(LocalDateTime.parse(pickupWindowStart));
            listing.setPickupWindowEnd(LocalDateTime.parse(pickupWindowEnd));

            // Upload photo if provided
            if (photo != null && !photo.isEmpty()) {
                String photoUrl = listingService.uploadPhoto(photo);
                listing.setPhotoUrl(photoUrl);
            }

            FoodListing created = listingService.createListing(listing, provider);
            return ResponseEntity.ok(new ApiResponse(true, "Listing created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Get current provider's listings.
     */
    @GetMapping("/my")
    public ResponseEntity<?> getMyListings(Authentication authentication) {
        User provider = userService.getUserByEmail(authentication.getName());
        List<FoodListing> listings = listingService.getProviderListings(provider);
        return ResponseEntity.ok(listings);
    }

    /**
     * Get all approved listings (for receivers to browse).
     */
    @GetMapping("/approved")
    public ResponseEntity<?> getApprovedListings(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false, defaultValue = "50") double radiusKm) {

        List<FoodListing> listings;
        if (lat != null && lng != null) {
            listings = listingService.getNearbyApprovedListings(lat, lng, radiusKm);
        } else {
            listings = listingService.getApprovedListings();
        }
        return ResponseEntity.ok(listings);
    }

    /**
     * Get listings pending quality review (for checkers).
     */
    @GetMapping("/pending-review")
    public ResponseEntity<?> getPendingReview() {
        List<FoodListing> listings = listingService.getPendingReviewListings();
        return ResponseEntity.ok(listings);
    }

    /**
     * Get a specific listing by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getListingById(@PathVariable Long id) {
        try {
            FoodListing listing = listingService.getListingById(id);
            return ResponseEntity.ok(listing);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Admin: Update listing status.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            FoodListing listing = listingService.updateStatus(id, ListingStatus.valueOf(status));
            return ResponseEntity.ok(new ApiResponse(true, "Status updated", listing));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Provider: Update listing quantity.
     */
    @PutMapping("/{id}/quantity")
    public ResponseEntity<?> updateQuantity(@PathVariable Long id, @RequestParam int quantity, Authentication authentication) {
        try {
            User provider = userService.getUserByEmail(authentication.getName());
            FoodListing listing = listingService.updateQuantity(id, quantity, provider);
            return ResponseEntity.ok(new ApiResponse(true, "Quantity updated", listing));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
