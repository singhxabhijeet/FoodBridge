package com.foodbridge.scheduler;

import com.foodbridge.service.FoodListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ListingExpiryScheduler {

    @Autowired
    private FoodListingService foodListingService;

    /**
     * Run every 15 minutes to expire unclaimed listings past their pickup window.
     */
    @Scheduled(fixedRate = 900000) // 15 minutes in milliseconds
    public void expireListings() {
        foodListingService.expireOldListings();
    }
}
