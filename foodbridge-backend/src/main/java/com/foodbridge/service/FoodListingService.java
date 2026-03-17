package com.foodbridge.service;

import com.foodbridge.model.FoodListing;
import com.foodbridge.model.User;
import com.foodbridge.model.enums.ListingStatus;
import com.foodbridge.model.enums.Role;
import com.foodbridge.repository.FoodListingRepository;
import com.foodbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FoodListingService {

    @Autowired
    private FoodListingRepository listingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    /**
     * Create a new food listing (Provider).
     */
    public FoodListing createListing(FoodListing listing, User provider) {
        listing.setProvider(provider);
        listing.setStatus(ListingStatus.POSTED);
        listing.setCreatedAt(LocalDateTime.now());

        FoodListing saved = listingRepository.save(listing);

        // Notify quality checkers that a new listing needs review
        List<User> checkers = userRepository.findByRoleAndApprovedTrue(Role.CHECKER);
        notificationService.notifyAllUsersWithRole(checkers,
                "New food listing '" + saved.getFoodName() + "' needs quality review.",
                "REVIEW_NEEDED");

        // Auto-set status to UNDER_REVIEW
        saved.setStatus(ListingStatus.UNDER_REVIEW);
        return listingRepository.save(saved);
    }

    /**
     * Upload photo for a listing and return the file URL.
     */
    public String uploadPhoto(MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        file.transferTo(filePath.toFile());

        return "/uploads/" + fileName;
    }

    /**
     * Get all listings by a provider.
     */
    public List<FoodListing> getProviderListings(User provider) {
        return listingRepository.findByProvider(provider);
    }

    /**
     * Get all listings pending quality review.
     */
    public List<FoodListing> getPendingReviewListings() {
        return listingRepository.findByStatus(ListingStatus.UNDER_REVIEW);
    }

    /**
     * Get all approved listings (for receivers to browse).
     */
    public List<FoodListing> getApprovedListings() {
        return listingRepository.findByStatus(ListingStatus.APPROVED);
    }

    /**
     * Get nearby approved listings within a radius (approximate bounding box).
     */
    public List<FoodListing> getNearbyApprovedListings(double lat, double lng, double radiusKm) {
        // Approximate: 1 degree latitude = 111 km
        double latRange = radiusKm / 111.0;
        double lngRange = radiusKm / (111.0 * Math.cos(Math.toRadians(lat)));

        return listingRepository.findNearbyApproved(
                ListingStatus.APPROVED,
                lat - latRange, lat + latRange,
                lng - lngRange, lng + lngRange);
    }

    /**
     * Get a listing by ID.
     */
    public FoodListing getListingById(Long id) {
        return listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
    }

    /**
     * Get all listings (for admin).
     */
    public List<FoodListing> getAllListings() {
        return listingRepository.findAll();
    }

    /**
     * Update listing status.
     */
    public FoodListing updateStatus(Long listingId, ListingStatus newStatus) {
        FoodListing listing = getListingById(listingId);
        listing.setStatus(newStatus);
        return listingRepository.save(listing);
    }

    /**
     * Get provider's listings between dates (for monthly report).
     */
    public List<FoodListing> getProviderListingsBetween(User provider, LocalDateTime start, LocalDateTime end) {
        return listingRepository.findByProviderAndCreatedAtBetween(provider, start, end);
    }

    /**
     * Count listings by status (for dashboard stats).
     */
    public long countByStatus(ListingStatus status) {
        return listingRepository.countByStatus(status);
    }

    /**
     * Expire listings past their pickup window that are still APPROVED.
     */
    public void expireOldListings() {
        List<FoodListing> expired = listingRepository
                .findByStatusAndPickupWindowEndBefore(ListingStatus.APPROVED, LocalDateTime.now());

        for (FoodListing listing : expired) {
            listing.setStatus(ListingStatus.EXPIRED);
            listingRepository.save(listing);

            // Notify provider
            notificationService.createNotification(listing.getProvider(),
                    "Your listing '" + listing.getFoodName() + "' has expired without being claimed.",
                    "LISTING_EXPIRED");
        }
    }
}
