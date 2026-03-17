package com.foodbridge.repository;

import com.foodbridge.model.FoodListing;
import com.foodbridge.model.User;
import com.foodbridge.model.enums.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FoodListingRepository extends JpaRepository<FoodListing, Long> {

    List<FoodListing> findByProvider(User provider);

    List<FoodListing> findByStatus(ListingStatus status);

    List<FoodListing> findByStatusIn(List<ListingStatus> statuses);

    List<FoodListing> findByProviderAndCreatedAtBetween(User provider, LocalDateTime start, LocalDateTime end);

    // Find listings that have passed their pickup window and are still APPROVED
    // (unclaimed)
    List<FoodListing> findByStatusAndPickupWindowEndBefore(ListingStatus status, LocalDateTime time);

    // Count listings by status
    long countByStatus(ListingStatus status);

    // Simple geo-based query: approximate nearby listings within a lat/lng bounding
    // box
    @Query("SELECT f FROM FoodListing f WHERE f.status = :status " +
            "AND f.latitude BETWEEN :minLat AND :maxLat " +
            "AND f.longitude BETWEEN :minLng AND :maxLng")
    List<FoodListing> findNearbyApproved(
            @Param("status") ListingStatus status,
            @Param("minLat") double minLat,
            @Param("maxLat") double maxLat,
            @Param("minLng") double minLng,
            @Param("maxLng") double maxLng);
}
