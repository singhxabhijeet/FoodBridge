package com.foodbridge.service;

import com.foodbridge.model.FoodListing;
import com.foodbridge.model.User;
import com.foodbridge.model.enums.FoodType;
import com.foodbridge.model.enums.ListingStatus;
import com.foodbridge.repository.FoodListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    @Value("${app.upload.dir}")
    private String uploadDir;

    /**
     * Create a new food listing (Provider).
     * NON_EDIBLE food is auto-approved (skips quality check).
     */
    public FoodListing createListing(FoodListing listing, User provider) {
        listing.setProvider(provider);
        listing.setCreatedAt(LocalDateTime.now());

        if (listing.getFoodType() == FoodType.NON_EDIBLE) {
            // Non-edible food skips quality check, goes directly to APPROVED
            listing.setStatus(ListingStatus.APPROVED);
        } else {
            listing.setStatus(ListingStatus.UNDER_REVIEW);
        }

        return listingRepository.save(listing);
    }

    /**
     * Upload photo for a listing and return the file URL.
     */
    public String uploadPhoto(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

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
     * Get nearby approved listings within a radius.
     */
    public List<FoodListing> getNearbyApprovedListings(double lat, double lng, double radiusKm) {
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
     * Update listing quantity (provider can edit).
     */
    public FoodListing updateQuantity(Long listingId, int newQuantity, User provider) {
        FoodListing listing = getListingById(listingId);
        if (!listing.getProvider().getId().equals(provider.getId())) {
            throw new RuntimeException("You can only edit your own listings");
        }
        if (newQuantity < 1) {
            throw new RuntimeException("Quantity must be at least 1");
        }
        listing.setQuantity(newQuantity);
        return listingRepository.save(listing);
    }

    /**
     * Get provider's listings between dates.
     */
    public List<FoodListing> getProviderListingsBetween(User provider, LocalDateTime start, LocalDateTime end) {
        return listingRepository.findByProviderAndCreatedAtBetween(provider, start, end);
    }

    /**
     * Count listings by status.
     */
    public long countByStatus(ListingStatus status) {
        return listingRepository.countByStatus(status);
    }

    /**
     * Expire listings past their pickup window.
     * Expired edible listings are converted to NON_EDIBLE and re-approved for composters.
     */
    public void expireOldListings() {
        List<FoodListing> expired = listingRepository
                .findByStatusAndPickupWindowEndBefore(ListingStatus.APPROVED, LocalDateTime.now());

        for (FoodListing listing : expired) {
            // Convert to NON_EDIBLE for composters instead of marking as EXPIRED
            listing.setFoodType(FoodType.NON_EDIBLE);
            listing.setStatus(ListingStatus.APPROVED);
            listingRepository.save(listing);
        }
    }
}
