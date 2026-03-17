package com.foodbridge.service;

import com.foodbridge.model.Claim;
import com.foodbridge.model.FoodListing;
import com.foodbridge.model.User;
import com.foodbridge.model.enums.ListingStatus;
import com.foodbridge.repository.ClaimRepository;
import com.foodbridge.repository.FoodListingRepository;
import com.foodbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private FoodListingRepository foodListingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    private static final int MAX_NO_SHOWS = 3;

    /**
     * Receiver claims a food listing.
     */
    public Claim claimListing(Long listingId, User receiver, LocalDateTime scheduledPickupTime) {
        // Check if receiver is restricted
        if (receiver.isRestricted()) {
            throw new RuntimeException("Your account is restricted due to excessive no-shows.");
        }

        FoodListing listing = foodListingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (listing.getStatus() != ListingStatus.APPROVED) {
            throw new RuntimeException("This listing is not available for claiming.");
        }

        // Create claim
        Claim claim = new Claim();
        claim.setListing(listing);
        claim.setReceiver(receiver);
        claim.setScheduledPickupTime(scheduledPickupTime);
        claim.setClaimedAt(LocalDateTime.now());
        claimRepository.save(claim);

        // Update listing status
        listing.setStatus(ListingStatus.CLAIMED);
        foodListingRepository.save(listing);

        // Notify provider
        notificationService.createNotification(listing.getProvider(),
                "Your listing '" + listing.getFoodName() + "' has been claimed by " + receiver.getFullName(),
                "CLAIM_UPDATE");

        return claim;
    }

    /**
     * Provider confirms pickup.
     */
    public Claim providerConfirm(Long claimId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claim.setProviderConfirmed(true);

        // If both confirmed, mark listing as confirmed
        if (claim.isReceiverConfirmed()) {
            claim.getListing().setStatus(ListingStatus.CONFIRMED);
            foodListingRepository.save(claim.getListing());
        } else {
            claim.getListing().setStatus(ListingStatus.PICKED_UP);
            foodListingRepository.save(claim.getListing());
        }

        return claimRepository.save(claim);
    }

    /**
     * Receiver confirms pickup.
     */
    public Claim receiverConfirm(Long claimId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claim.setReceiverConfirmed(true);

        // If both confirmed, mark listing as confirmed
        if (claim.isProviderConfirmed()) {
            claim.getListing().setStatus(ListingStatus.CONFIRMED);
            foodListingRepository.save(claim.getListing());
        } else {
            claim.getListing().setStatus(ListingStatus.PICKED_UP);
            foodListingRepository.save(claim.getListing());
        }

        return claimRepository.save(claim);
    }

    /**
     * Mark a receiver as a no-show and restrict if exceeded threshold.
     */
    public void markNoShow(Long claimId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claim.setNoShow(true);
        claimRepository.save(claim);

        // Increment receiver's no-show count
        User receiver = claim.getReceiver();
        receiver.setNoShowCount(receiver.getNoShowCount() + 1);

        // Restrict if too many no-shows
        if (receiver.getNoShowCount() >= MAX_NO_SHOWS) {
            receiver.setRestricted(true);
            notificationService.createNotification(receiver,
                    "Your account has been restricted due to " + MAX_NO_SHOWS + " no-shows.",
                    "RESTRICTION");
        }

        userRepository.save(receiver);

        // Reset listing to APPROVED so others can claim it
        FoodListing listing = claim.getListing();
        listing.setStatus(ListingStatus.APPROVED);
        foodListingRepository.save(listing);
    }

    /**
     * Get all claims by a receiver.
     */
    public List<Claim> getReceiverClaims(User receiver) {
        return claimRepository.findByReceiver(receiver);
    }

    /**
     * Get claim by listing ID.
     */
    public Claim getClaimByListingId(Long listingId) {
        return claimRepository.findByListingId(listingId)
                .orElseThrow(() -> new RuntimeException("Claim not found for this listing"));
    }
}
