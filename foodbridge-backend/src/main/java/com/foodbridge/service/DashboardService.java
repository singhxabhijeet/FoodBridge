package com.foodbridge.service;

import com.foodbridge.dto.DashboardStats;
import com.foodbridge.model.enums.ListingStatus;
import com.foodbridge.model.enums.Role;
import com.foodbridge.repository.FoodListingRepository;
import com.foodbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private FoodListingRepository listingRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get aggregated dashboard stats for admin.
     */
    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();

        long total = listingRepository.count();
        long approved = listingRepository.countByStatus(ListingStatus.APPROVED);
        long claimed = listingRepository.countByStatus(ListingStatus.CLAIMED);
        long confirmed = listingRepository.countByStatus(ListingStatus.CONFIRMED);
        long expired = listingRepository.countByStatus(ListingStatus.EXPIRED);
        long rejected = listingRepository.countByStatus(ListingStatus.REJECTED);

        stats.setTotalListings(total);
        stats.setApprovedListings(approved);
        stats.setClaimedListings(claimed);
        stats.setConfirmedPickups(confirmed);
        stats.setExpiredListings(expired);
        stats.setRejectedListings(rejected);
        stats.setTotalUsers(userRepository.count());
        stats.setPendingUsers(userRepository.findByApprovedFalse().size());
        stats.setRestrictedUsers(userRepository.findByRestrictedTrue().size());

        // Total food saved = sum of quantity of CONFIRMED listings
        long totalSaved = listingRepository.findByStatus(ListingStatus.CONFIRMED)
                .stream()
                .mapToLong(l -> l.getQuantity())
                .sum();
        stats.setTotalFoodSaved(totalSaved);

        // Analytics rates
        long totalProcessed = approved + confirmed + claimed + expired + rejected;
        stats.setApprovalRate(totalProcessed > 0 ? Math.round((double)(approved + confirmed + claimed) / totalProcessed * 1000.0) / 10.0 : 0);
        stats.setClaimSuccessRate(claimed + confirmed > 0 ? Math.round((double) confirmed / (claimed + confirmed) * 1000.0) / 10.0 : 0);
        stats.setExpiryRate(totalProcessed > 0 ? Math.round((double) expired / totalProcessed * 1000.0) / 10.0 : 0);

        // Active users by role
        stats.setActiveProviders(userRepository.findByRoleAndApprovedTrue(Role.PROVIDER).size());
        stats.setActiveReceivers(userRepository.findByRoleAndApprovedTrue(Role.RECEIVER).size());
        stats.setActiveCheckers(userRepository.findByRoleAndApprovedTrue(Role.CHECKER).size());
        stats.setActiveCompostReceivers(userRepository.findByRoleAndApprovedTrue(Role.COMPOST_RECEIVER).size());

        // Listings by status breakdown
        Map<String, Long> byStatus = new HashMap<>();
        for (ListingStatus s : ListingStatus.values()) {
            byStatus.put(s.name(), listingRepository.countByStatus(s));
        }
        stats.setListingsByStatus(byStatus);

        return stats;
    }
}
