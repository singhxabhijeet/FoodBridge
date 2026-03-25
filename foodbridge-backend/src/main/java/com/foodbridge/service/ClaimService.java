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

    private static final int MAX_NO_SHOWS = 3;

    /**
     * Receiver claims a food listing with a specific quantity.
     */
    public Claim claimListing(Long listingId, User receiver, LocalDateTime scheduledPickupTime, int requestedQuantity) {
        if (receiver.isRestricted()) {
            throw new RuntimeException("Your account is restricted due to excessive no-shows.");
        }

        FoodListing listing = foodListingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (listing.getStatus() != ListingStatus.APPROVED) {
            throw new RuntimeException("This listing is not available for claiming.");
        }

        // Validate pickup time within provider's window
        if (scheduledPickupTime.isBefore(listing.getPickupWindowStart()) ||
                scheduledPickupTime.isAfter(listing.getPickupWindowEnd())) {
            throw new RuntimeException("Pickup time must be within the provider's pickup window (" +
                    listing.getPickupWindowStart() + " to " + listing.getPickupWindowEnd() + ").");
        }

        // Validate requested quantity
        if (requestedQuantity <= 0 || requestedQuantity > listing.getQuantity()) {
            throw new RuntimeException("Requested quantity must be between 1 and " + listing.getQuantity() + ".");
        }

        Claim claim = new Claim();
        claim.setListing(listing);
        claim.setReceiver(receiver);
        claim.setScheduledPickupTime(scheduledPickupTime);
        claim.setRequestedQuantity(requestedQuantity);
        claim.setClaimedAt(LocalDateTime.now());
        claimRepository.save(claim);

        // Decrement available quantity
        listing.setQuantity(listing.getQuantity() - requestedQuantity);
        if (listing.getQuantity() == 0) {
            listing.setStatus(ListingStatus.CLAIMED);
        }
        foodListingRepository.save(listing);

        return claim;
    }

    /**
     * Provider confirms pickup.
     */
    public Claim providerConfirm(Long claimId, User provider) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        if (!claim.getListing().getProvider().getId().equals(provider.getId())) {
            throw new RuntimeException("You can only confirm pickups for your own food listings");
        }

        claim.setProviderConfirmed(true);

        if (claim.getListing().getQuantity() == 0) {
            if (claim.isReceiverConfirmed()) {
                claim.getListing().setStatus(ListingStatus.CONFIRMED);
            } else {
                claim.getListing().setStatus(ListingStatus.PICKED_UP);
            }
            foodListingRepository.save(claim.getListing());
        }

        return claimRepository.save(claim);
    }

    /**
     * Receiver confirms pickup.
     */
    public Claim receiverConfirm(Long claimId, User receiver) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        if (!claim.getReceiver().getId().equals(receiver.getId())) {
            throw new RuntimeException("You can only confirm your own claims");
        }

        claim.setReceiverConfirmed(true);

        if (claim.getListing().getQuantity() == 0) {
            if (claim.isProviderConfirmed()) {
                claim.getListing().setStatus(ListingStatus.CONFIRMED);
            } else {
                claim.getListing().setStatus(ListingStatus.PICKED_UP);
            }
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

        User receiver = claim.getReceiver();
        receiver.setNoShowCount(receiver.getNoShowCount() + 1);

        if (receiver.getNoShowCount() >= MAX_NO_SHOWS) {
            receiver.setRestricted(true);
        }

        userRepository.save(receiver);

        // Restore quantity and re-approve listing
        FoodListing listing = claim.getListing();
        listing.setQuantity(listing.getQuantity() + claim.getRequestedQuantity());
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
     * Get claims by listing ID (returns list for partial claims).
     */
    public List<Claim> getClaimsByListingId(Long listingId) {
        return claimRepository.findByListingId(listingId);
    }

    /**
     * Cancel a claim (receiver can cancel before confirmation).
     */
    public void cancelClaim(Long claimId, User receiver) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        if (!claim.getReceiver().getId().equals(receiver.getId())) {
            throw new RuntimeException("You can only cancel your own claims");
        }

        if (claim.isProviderConfirmed() || claim.isReceiverConfirmed()) {
            throw new RuntimeException("Cannot cancel a claim that has already been confirmed");
        }

        FoodListing listing = claim.getListing();
        listing.setQuantity(listing.getQuantity() + claim.getRequestedQuantity());

        claimRepository.delete(claim);

        // Only reset status to APPROVED if no other claims remain
        List<Claim> remainingClaims = claimRepository.findByListingId(listing.getId());
        if (remainingClaims.isEmpty()) {
            listing.setStatus(ListingStatus.APPROVED);
        }
        foodListingRepository.save(listing);
    }
}
