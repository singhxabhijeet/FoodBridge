import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-review-queue',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1><i class="fas fa-clipboard-check"></i> Quality Review</h1>
        <p>Review food listings and manage your review history</p>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'queue'" (click)="activeTab = 'queue'">
          <i class="fas fa-inbox"></i> Pending Review
        </button>
        <button class="tab" [class.active]="activeTab === 'history'" (click)="activeTab = 'history'; loadHistory()">
          <i class="fas fa-history"></i> My Review History
        </button>
      </div>

      <!-- Pending Queue -->
      <div *ngIf="activeTab === 'queue'">
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

      <!-- Review History -->
      <div *ngIf="activeTab === 'history'">
        <div class="history-list" *ngIf="history.length > 0">
          <div class="card history-card fade-in-up" *ngFor="let h of history; let i = index" [style.animation-delay]="(i * 0.08) + 's'">
            <div class="history-header">
              <h3>{{ h.listing?.foodName }}</h3>
              <span class="badge" [class.badge-approved]="h.approved" [class.badge-rejected]="!h.approved">
                {{ h.approved ? 'Approved' : 'Rejected (→ Non-Edible)' }}
              </span>
            </div>
            <div class="history-meta">
              <span><i class="fas fa-user"></i> {{ h.listing?.provider?.fullName }}</span>
              <span><i class="fas fa-calendar"></i> Reviewed: {{ h.checkedAt | date:'short' }}</span>
              <span *ngIf="h.reason"><i class="fas fa-comment"></i> {{ h.reason }}</span>
            </div>
            <div style="margin-top: 12px; font-size: 12px; color: #999">
              <i class="fas fa-lock"></i> Review is final and cannot be edited
            </div>
          </div>
        </div>
        <div class="empty-state" *ngIf="history.length === 0">
          <i class="fas fa-clipboard"></i>
          <p>No reviews yet. Start by reviewing pending listings.</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .tabs { display: flex; gap: 8px; margin-bottom: 24px; }
    .tab {
      padding: 10px 20px; border: 2px solid #e0e0e0; border-radius: 12px;
      background: white; cursor: pointer; font-weight: 600; font-size: 14px;
      display: flex; align-items: center; gap: 8px; transition: all 0.2s;
    }
    .tab.active { border-color: #2ecc71; background: #e8f5e9; color: #27ae60; }
    .tab:hover { border-color: #2ecc71; }
    .listing-card { overflow: hidden; padding: 0; }
    .listing-photo { width: 100%; height: 180px; object-fit: cover; }
    .listing-body { padding: 20px; }
    .listing-body h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
    .listing-meta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; font-size: 13px; color: #666; }
    .listing-meta span { display: flex; align-items: center; gap: 4px; }
    .listing-address { font-size: 13px; color: #888; margin-bottom: 4px; }
    .listing-provider { font-size: 13px; color: #555; font-weight: 500; }
    .history-list { display: flex; flex-direction: column; gap: 16px; }
    .history-card { padding: 24px; }
    .history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .history-header h3 { font-size: 17px; font-weight: 700; }
    .history-meta { display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px; color: #666; }
    .history-meta span { display: flex; align-items: center; gap: 4px; }
  `]
})
export class ReviewQueueComponent implements OnInit {
    listings: any[] = [];
    history: any[] = [];
    activeTab = 'queue';

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getPendingReviewListings().subscribe({
            next: (data) => this.listings = data,
            error: () => { }
        });
    }

    loadHistory() {
        this.api.getCheckerHistory().subscribe({
            next: (data) => {
                this.history = data;
            }
        });
    }
}
