package com.foodbridge.service;

import com.foodbridge.model.FoodListing;
import com.foodbridge.model.QualityCheck;
import com.foodbridge.model.User;
import com.foodbridge.model.enums.FoodType;
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

    /**
     * Approve or reject a listing after quality check.
     * Reviews are FINAL and cannot be edited.
     */
    public QualityCheck reviewListing(Long listingId, User checker, boolean approved, String reason) {
        FoodListing listing = foodListingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        QualityCheck check = new QualityCheck();
        check.setListing(listing);
        check.setChecker(checker);
        check.setApproved(approved);
        check.setReason(reason);
        check.setCheckedAt(LocalDateTime.now());
        qualityCheckRepository.save(check);

        if (approved) {
            listing.setStatus(ListingStatus.APPROVED);
        } else {
            // Rejected listings are converted to NON_EDIBLE and auto-approved for composters
            listing.setFoodType(FoodType.NON_EDIBLE);
            listing.setStatus(ListingStatus.APPROVED);
            listing.setRejectionReason(reason);
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
}
