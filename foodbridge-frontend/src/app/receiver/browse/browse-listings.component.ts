import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-browse-listings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1><i class="fas fa-search"></i> Browse Available Food</h1>
        <p>Find and claim food near you</p>
      </div>

      <div class="listings-grid" *ngIf="listings.length > 0">
        <div class="card listing-card fade-in-up" *ngFor="let l of listings; let i = index" [style.animation-delay]="(i * 0.08) + 's'">
          <img *ngIf="l.photoUrl" [src]="'http://localhost:8080' + l.photoUrl" class="listing-photo" alt="Food">
          <div class="no-photo" *ngIf="!l.photoUrl"><i class="fas fa-utensils"></i></div>
          <div class="listing-body">
            <div class="listing-top">
              <h3>{{ l.foodName }}</h3>
              <span class="badge badge-approved">Available</span>
            </div>
            <div class="listing-meta">
              <span><i class="fas fa-weight-hanging"></i> {{ l.quantity }} {{ l.unit }}</span>
              <span><i class="fas fa-tag"></i> {{ l.foodType }}</span>
              <span><i class="fas fa-fire"></i> {{ l.perishLevel }}</span>
            </div>
            <p class="listing-address"><i class="fas fa-map-marker-alt"></i> {{ l.pickupAddress }}</p>
            <p class="listing-window"><i class="fas fa-clock"></i> {{ l.pickupWindowStart | date:'short' }} — {{ l.pickupWindowEnd | date:'short' }}</p>
            <p class="listing-provider"><i class="fas fa-store"></i> {{ l.provider?.fullName }} ({{ l.provider?.organization }})</p>

            <div class="claim-section" *ngIf="!l.claimed">
              <div class="form-group" style="margin-bottom: 10px">
                <label style="font-size: 12px">Schedule Pickup Time</label>
                <input type="datetime-local" class="form-control" [(ngModel)]="l.pickupTime" [name]="'pickup_' + l.id" style="font-size: 13px">
              </div>
              <button class="btn btn-primary btn-sm" style="width:100%" (click)="claim(l)" [disabled]="l.claiming">
                <i class="fas fa-hand-holding-heart"></i> {{ l.claiming ? 'Claiming...' : 'Claim This Food' }}
              </button>
            </div>
            <div class="alert alert-success" *ngIf="l.claimed" style="margin-top: 12px; padding: 10px">
              <i class="fas fa-check-circle"></i> Claimed successfully!
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="listings.length === 0">
        <i class="fas fa-box-open"></i>
        <p>No food listings available at the moment. Check back soon!</p>
      </div>
    </div>
  `,
    styles: [`
    .listing-card { overflow: hidden; padding: 0; }
    .listing-photo { width: 100%; height: 180px; object-fit: cover; }
    .no-photo { width: 100%; height: 120px; background: linear-gradient(135deg, #e8f5e9, #f0f9ff); display: flex; align-items: center; justify-content: center; font-size: 36px; color: #ccc; }
    .listing-body { padding: 20px; }
    .listing-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .listing-top h3 { font-size: 17px; font-weight: 700; }
    .listing-meta { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; font-size: 12px; color: #666; }
    .listing-meta span { display: flex; align-items: center; gap: 4px; }
    .listing-address, .listing-window, .listing-provider { font-size: 12px; color: #888; margin-bottom: 4px; }
    .claim-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0; }
  `]
})
export class BrowseListingsComponent implements OnInit {
    listings: any[] = [];

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getApprovedListings().subscribe({
            next: (data) => {
                this.listings = data.map((l: any) => ({ ...l, pickupTime: '', claiming: false, claimed: false }));
            },
            error: () => { }
        });
    }

    claim(listing: any) {
        if (!listing.pickupTime) {
            alert('Please select a pickup time');
            return;
        }
        listing.claiming = true;
        this.api.claimListing(listing.id, listing.pickupTime).subscribe({
            next: () => {
                listing.claiming = false;
                listing.claimed = true;
            },
            error: (err: any) => {
                listing.claiming = false;
                alert(err.error?.message || 'Failed to claim');
            }
        });
    }
}
