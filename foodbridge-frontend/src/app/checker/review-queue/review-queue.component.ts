import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-review-queue',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1><i class="fas fa-clipboard-check"></i> Quality Review Queue</h1>
        <p>Review food listings for quality and safety compliance</p>
      </div>

      <div class="listings-grid" *ngIf="listings.length > 0">
        <div class="card listing-card fade-in-up" *ngFor="let l of listings; let i = index" [style.animation-delay]="(i * 0.1) + 's'">
          <img *ngIf="l.photoUrl" [src]="'http://localhost:8080' + l.photoUrl" class="listing-photo" alt="Food photo">
          <div class="listing-body">
            <h3>{{ l.foodName }}</h3>
            <div class="listing-meta">
              <span><i class="fas fa-weight-hanging"></i> {{ l.quantity }} {{ l.unit }}</span>
              <span><i class="fas fa-tag"></i> {{ l.foodType }}</span>
              <span><i class="fas fa-fire"></i> {{ l.perishLevel }}</span>
            </div>
            <p class="listing-address"><i class="fas fa-map-marker-alt"></i> {{ l.pickupAddress }}</p>
            <p class="listing-provider"><i class="fas fa-user"></i> {{ l.provider?.fullName }}</p>
            <a [routerLink]="['/checker/review', l.id]" class="btn btn-primary btn-sm" style="width:100%; margin-top: 12px">
              <i class="fas fa-search"></i> Review Listing
            </a>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="listings.length === 0">
        <i class="fas fa-check-double"></i>
        <p>No listings pending review. All caught up! 🎉</p>
      </div>
    </div>
  `,
    styles: [`
    .listing-card { overflow: hidden; padding: 0; }
    .listing-photo { width: 100%; height: 180px; object-fit: cover; }
    .listing-body { padding: 20px; }
    .listing-body h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
    .listing-meta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; font-size: 13px; color: #666; }
    .listing-meta span { display: flex; align-items: center; gap: 4px; }
    .listing-address { font-size: 13px; color: #888; margin-bottom: 4px; }
    .listing-provider { font-size: 13px; color: #555; font-weight: 500; }
  `]
})
export class ReviewQueueComponent implements OnInit {
    listings: any[] = [];

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getPendingReviewListings().subscribe({
            next: (data) => this.listings = data,
            error: () => { }
        });
    }
}
