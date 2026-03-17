package com.foodbridge.controller;

import com.foodbridge.model.enums.ListingStatus;
import com.foodbridge.repository.FoodListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private FoodListingRepository listingRepository;

    /**
     * Public impact page stats — no authentication needed.
     */
    @GetMapping("/impact")
    public ResponseEntity<?> getImpactStats() {
        long totalPosted = listingRepository.count();
        long totalConfirmed = listingRepository.countByStatus(ListingStatus.CONFIRMED);
        long totalApproved = listingRepository.countByStatus(ListingStatus.APPROVED);
        long totalClaimed = listingRepository.countByStatus(ListingStatus.CLAIMED);

        // Calculate total food saved (sum of quantities of confirmed listings)
        long totalFoodSaved = listingRepository.findByStatus(ListingStatus.CONFIRMED)
                .stream()
                .mapToLong(l -> l.getQuantity())
                .sum();

        Map<String, Object> stats = Map.of(
                "totalListingsPosted", totalPosted,
                "totalFoodConfirmed", totalConfirmed,
                "totalFoodApproved", totalApproved,
                "totalFoodClaimed", totalClaimed,
                "totalFoodSaved", totalFoodSaved,
                "mealsProvided", totalFoodSaved,
                "co2Saved", totalFoodSaved * 2.5 // rough estimate: 2.5 kg CO2 per unit food saved
        );

        return ResponseEntity.ok(stats);
    }
}
