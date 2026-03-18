// ===== TypeScript Models for FoodBridge =====

export interface User {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    organization: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
    aadhaarNumber: string;
    purpose: string;
    latitude: number;
    longitude: number;
    approved: boolean;
    restricted: boolean;
    noShowCount: number;
    createdAt: string;
}

export interface FoodListing {
    id: number;
    provider: User;
    foodName: string;
    quantity: number;
    unit: string;
    foodType: string;
    perishLevel: string;
    description: string;
    photoUrl: string;
    safetyChecklist: string;
    pickupAddress: string;
    latitude: number;
    longitude: number;
    pickupWindowStart: string;
    pickupWindowEnd: string;
    status: string;
    rejectionReason: string;
    createdAt: string;
}

export interface Claim {
    id: number;
    listing: FoodListing;
    receiver: User;
    scheduledPickupTime: string;
    providerConfirmed: boolean;
    receiverConfirmed: boolean;
    noShow: boolean;
    claimedAt: string;
}

export interface QualityCheck {
    id: number;
    listing: FoodListing;
    checker: User;
    approved: boolean;
    reason: string;
    checkedAt: string;
}

export interface Rating {
    id: number;
    listing: FoodListing;
    rater: User;
    rated: User;
    score: number;
    comment: string;
    createdAt: string;
}

export interface Notification {
    id: number;
    user: User;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

export interface DashboardStats {
    totalListings: number;
    approvedListings: number;
    claimedListings: number;
    confirmedPickups: number;
    expiredListings: number;
    totalUsers: number;
    pendingUsers: number;
    totalFoodSaved: number;
    listingsByStatus: { [key: string]: number };
    approvalRate: number;
    claimSuccessRate: number;
    expiryRate: number;
    activeProviders: number;
    activeReceivers: number;
    rejectedListings: number;
}

export interface AuthResponse {
    token: string;
    role: string;
    fullName: string;
    userId: number;
    message: string;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data: any;
}

export interface ImpactStats {
    totalListingsPosted: number;
    totalFoodConfirmed: number;
    totalFoodApproved: number;
    totalFoodClaimed: number;
    totalFoodSaved: number;
    mealsProvided: number;
    co2Saved: number;
}
