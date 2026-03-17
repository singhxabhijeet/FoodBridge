package com.foodbridge.service;

import com.foodbridge.dto.DashboardStats;
import com.foodbridge.model.enums.ListingStatus;
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

        stats.setTotalListings(listingRepository.count());
        stats.setApprovedListings(listingRepository.countByStatus(ListingStatus.APPROVED));
        stats.setClaimedListings(listingRepository.countByStatus(ListingStatus.CLAIMED));
        stats.setConfirmedPickups(listingRepository.countByStatus(ListingStatus.CONFIRMED));
        stats.setExpiredListings(listingRepository.countByStatus(ListingStatus.EXPIRED));
        stats.setTotalUsers(userRepository.count());
        stats.setPendingUsers(userRepository.findByApprovedFalse().size());

        // Total food saved = sum of quantity of CONFIRMED listings
        long totalSaved = listingRepository.findByStatus(ListingStatus.CONFIRMED)
                .stream()
                .mapToLong(l -> l.getQuantity())
                .sum();
        stats.setTotalFoodSaved(totalSaved);

        // Listings by status breakdown
        Map<String, Long> byStatus = new HashMap<>();
        for (ListingStatus s : ListingStatus.values()) {
            byStatus.put(s.name(), listingRepository.countByStatus(s));
        }
        stats.setListingsByStatus(byStatus);

        return stats;
    }
}
