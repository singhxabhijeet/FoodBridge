package com.foodbridge.service;

import com.foodbridge.model.FoodListing;
import com.foodbridge.model.QualityCheck;
import com.foodbridge.model.User;
import com.foodbridge.model.enums.ListingStatus;
import com.foodbridge.repository.FoodListingRepository;
import com.foodbridge.repository.QualityCheckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QualityCheckService {

    @Autowired
    private QualityCheckRepository qualityCheckRepository;

    @Autowired
    private FoodListingRepository foodListingRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Approve or reject a listing after quality check.
     */
    public QualityCheck reviewListing(Long listingId, User checker, boolean approved, String reason) {
        FoodListing listing = foodListingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        // Create quality check record
        QualityCheck check = new QualityCheck();
        check.setListing(listing);
        check.setChecker(checker);
        check.setApproved(approved);
        check.setReason(reason);
        check.setCheckedAt(LocalDateTime.now());
        qualityCheckRepository.save(check);

        // Update listing status
        if (approved) {
            listing.setStatus(ListingStatus.APPROVED);
            notificationService.createNotification(listing.getProvider(),
                    "Your listing '" + listing.getFoodName() + "' has been approved and is now live!",
                    "LISTING_APPROVED");
        } else {
            listing.setStatus(ListingStatus.REJECTED);
            listing.setRejectionReason(reason);
            notificationService.createNotification(listing.getProvider(),
                    "Your listing '" + listing.getFoodName() + "' was rejected. Reason: " + reason,
                    "LISTING_REJECTED");
        }
        foodListingRepository.save(listing);

        return check;
    }

    /**
     * Get a checker's review history.
     */
    public List<QualityCheck> getCheckerHistory(User checker) {
        return qualityCheckRepository.findByChecker(checker);
    }

    /**
     * Update an existing quality check (re-review).
     */
    public QualityCheck updateReview(Long checkId, User checker, boolean approved, String reason) {
        QualityCheck check = qualityCheckRepository.findById(checkId)
                .orElseThrow(() -> new RuntimeException("Quality check not found"));

        // Verify the checker owns this review
        if (!check.getChecker().getId().equals(checker.getId())) {
            throw new RuntimeException("You can only update your own reviews");
        }

        check.setApproved(approved);
        check.setReason(reason);
        check.setCheckedAt(LocalDateTime.now());
        qualityCheckRepository.save(check);

        // Update listing status
        FoodListing listing = check.getListing();
        if (approved) {
            listing.setStatus(ListingStatus.APPROVED);
            listing.setRejectionReason(null);
            notificationService.createNotification(listing.getProvider(),
                    "Your listing '" + listing.getFoodName() + "' review has been updated to APPROVED!",
                    "REVIEW_UPDATED");
        } else {
            listing.setStatus(ListingStatus.REJECTED);
            listing.setRejectionReason(reason);
            notificationService.createNotification(listing.getProvider(),
                    "Your listing '" + listing.getFoodName() + "' review updated to REJECTED. Reason: " + reason,
                    "REVIEW_UPDATED");
        }
        foodListingRepository.save(listing);

        return check;
    }
}
