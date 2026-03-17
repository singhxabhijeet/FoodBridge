package com.foodbridge.dto;

import java.util.Map;

public class DashboardStats {
    private long totalListings;
    private long approvedListings;
    private long claimedListings;
    private long confirmedPickups;
    private long expiredListings;
    private long totalUsers;
    private long pendingUsers;
    private long totalFoodSaved; // quantity sum of confirmed listings
    private Map<String, Long> listingsByStatus;

    // Getters and Setters
    public long getTotalListings() {
        return totalListings;
    }

    public void setTotalListings(long totalListings) {
        this.totalListings = totalListings;
    }

    public long getApprovedListings() {
        return approvedListings;
    }

    public void setApprovedListings(long approvedListings) {
        this.approvedListings = approvedListings;
    }

    public long getClaimedListings() {
        return claimedListings;
    }

    public void setClaimedListings(long claimedListings) {
        this.claimedListings = claimedListings;
    }

    public long getConfirmedPickups() {
        return confirmedPickups;
    }

    public void setConfirmedPickups(long confirmedPickups) {
        this.confirmedPickups = confirmedPickups;
    }

    public long getExpiredListings() {
        return expiredListings;
    }

    public void setExpiredListings(long expiredListings) {
        this.expiredListings = expiredListings;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getPendingUsers() {
        return pendingUsers;
    }

    public void setPendingUsers(long pendingUsers) {
        this.pendingUsers = pendingUsers;
    }

    public long getTotalFoodSaved() {
        return totalFoodSaved;
    }

    public void setTotalFoodSaved(long totalFoodSaved) {
        this.totalFoodSaved = totalFoodSaved;
    }

    public Map<String, Long> getListingsByStatus() {
        return listingsByStatus;
    }

    public void setListingsByStatus(Map<String, Long> listingsByStatus) {
        this.listingsByStatus = listingsByStatus;
    }
}
