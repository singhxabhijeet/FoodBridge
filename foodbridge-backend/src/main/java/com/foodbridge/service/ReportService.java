package com.foodbridge.service;

import com.foodbridge.model.FoodListing;
import com.foodbridge.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private FoodListingService listingService;

    /**
     * Generate a CSV report string for a provider's monthly listings.
     */
    public String generateMonthlyReport(User provider, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime start = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime end = yearMonth.atEndOfMonth().atTime(23, 59, 59);

        List<FoodListing> listings = listingService.getProviderListingsBetween(provider, start, end);

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Food Name,Quantity,Unit,Type,Perish Level,Status,Created At,Pickup Address\n");

        for (FoodListing l : listings) {
            csv.append(l.getId()).append(",");
            csv.append("\"").append(l.getFoodName()).append("\",");
            csv.append(l.getQuantity()).append(",");
            csv.append(l.getUnit()).append(",");
            csv.append(l.getFoodType()).append(",");
            csv.append(l.getPerishLevel()).append(",");
            csv.append(l.getStatus()).append(",");
            csv.append(l.getCreatedAt()).append(",");
            csv.append("\"").append(l.getPickupAddress()).append("\"");
            csv.append("\n");
        }

        return csv.toString();
    }
}
