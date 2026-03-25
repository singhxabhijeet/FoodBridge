package com.foodbridge.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "listing_id", nullable = false)
    private FoodListing listing;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    private LocalDateTime scheduledPickupTime;

    private int requestedQuantity;

    private boolean providerConfirmed = false;

    private boolean receiverConfirmed = false;

    private boolean noShow = false;

    private LocalDateTime claimedAt = LocalDateTime.now();

    public Claim() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FoodListing getListing() { return listing; }
    public void setListing(FoodListing listing) { this.listing = listing; }

    public User getReceiver() { return receiver; }
    public void setReceiver(User receiver) { this.receiver = receiver; }

    public LocalDateTime getScheduledPickupTime() { return scheduledPickupTime; }
    public void setScheduledPickupTime(LocalDateTime scheduledPickupTime) { this.scheduledPickupTime = scheduledPickupTime; }

    public int getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(int requestedQuantity) { this.requestedQuantity = requestedQuantity; }

    public boolean isProviderConfirmed() { return providerConfirmed; }
    public void setProviderConfirmed(boolean providerConfirmed) { this.providerConfirmed = providerConfirmed; }

    public boolean isReceiverConfirmed() { return receiverConfirmed; }
    public void setReceiverConfirmed(boolean receiverConfirmed) { this.receiverConfirmed = receiverConfirmed; }

    public boolean isNoShow() { return noShow; }
    public void setNoShow(boolean noShow) { this.noShow = noShow; }

    public LocalDateTime getClaimedAt() { return claimedAt; }
    public void setClaimedAt(LocalDateTime claimedAt) { this.claimedAt = claimedAt; }
}
