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

    // Analytics
    private double approvalRate;      // approved / total * 100
    private double claimSuccessRate;   // confirmed / claimed * 100
    private double expiryRate;         // expired / total * 100
    private long activeProviders;
    private long activeReceivers;
    private long activeCheckers;
    private long activeCompostReceivers;
    private long rejectedListings;
    private long restrictedUsers;

    // Getters and Setters
    public long getTotalListings() { return totalListings; }
    public void setTotalListings(long totalListings) { this.totalListings = totalListings; }

    public long getApprovedListings() { return approvedListings; }
    public void setApprovedListings(long approvedListings) { this.approvedListings = approvedListings; }

    public long getClaimedListings() { return claimedListings; }
    public void setClaimedListings(long claimedListings) { this.claimedListings = claimedListings; }

    public long getConfirmedPickups() { return confirmedPickups; }
    public void setConfirmedPickups(long confirmedPickups) { this.confirmedPickups = confirmedPickups; }

    public long getExpiredListings() { return expiredListings; }
    public void setExpiredListings(long expiredListings) { this.expiredListings = expiredListings; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getPendingUsers() { return pendingUsers; }
    public void setPendingUsers(long pendingUsers) { this.pendingUsers = pendingUsers; }

    public long getTotalFoodSaved() { return totalFoodSaved; }
    public void setTotalFoodSaved(long totalFoodSaved) { this.totalFoodSaved = totalFoodSaved; }

    public Map<String, Long> getListingsByStatus() { return listingsByStatus; }
    public void setListingsByStatus(Map<String, Long> listingsByStatus) { this.listingsByStatus = listingsByStatus; }

    public double getApprovalRate() { return approvalRate; }
    public void setApprovalRate(double approvalRate) { this.approvalRate = approvalRate; }

    public double getClaimSuccessRate() { return claimSuccessRate; }
    public void setClaimSuccessRate(double claimSuccessRate) { this.claimSuccessRate = claimSuccessRate; }

    public double getExpiryRate() { return expiryRate; }
    public void setExpiryRate(double expiryRate) { this.expiryRate = expiryRate; }

    public long getActiveProviders() { return activeProviders; }
    public void setActiveProviders(long activeProviders) { this.activeProviders = activeProviders; }

    public long getActiveReceivers() { return activeReceivers; }
    public void setActiveReceivers(long activeReceivers) { this.activeReceivers = activeReceivers; }

    public long getActiveCheckers() { return activeCheckers; }
    public void setActiveCheckers(long activeCheckers) { this.activeCheckers = activeCheckers; }

    public long getActiveCompostReceivers() { return activeCompostReceivers; }
    public void setActiveCompostReceivers(long activeCompostReceivers) { this.activeCompostReceivers = activeCompostReceivers; }

    public long getRejectedListings() { return rejectedListings; }
    public void setRejectedListings(long rejectedListings) { this.rejectedListings = rejectedListings; }

    public long getRestrictedUsers() { return restrictedUsers; }
    public void setRestrictedUsers(long restrictedUsers) { this.restrictedUsers = restrictedUsers; }
}
