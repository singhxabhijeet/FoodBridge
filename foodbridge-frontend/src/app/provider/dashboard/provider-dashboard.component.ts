import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { FoodListing } from '../../core/models/models';

@Component({
    selector: 'app-provider-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-row">
          <div>
            <h1><i class="fas fa-store"></i> Provider Dashboard</h1>
            <p>Manage your food listings and track your feedback</p>
          </div>
          <a routerLink="/provider/create-listing" class="btn btn-primary">
            <i class="fas fa-plus"></i> Post New Food
          </a>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="color: #3498db"><i class="fas fa-clipboard-list"></i></div>
          <div class="stat-number">{{ listings.length }}</div>
          <div class="stat-label">Total Listings</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color: #f1c40f"><i class="fas fa-hourglass-half"></i></div>
          <div class="stat-number">{{ countByStatus('UNDER_REVIEW') }}</div>
          <div class="stat-label">Under Review</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color: #2ecc71"><i class="fas fa-check-circle"></i></div>
          <div class="stat-number">{{ countByStatus('APPROVED') }}</div>
          <div class="stat-label">Approved</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color: #e67e22"><i class="fas fa-star"></i></div>
          <div class="stat-number">{{ averageScore > 0 ? (averageScore | number:'1.1-1') : '-' }} <small style="font-size:14px;color:#999" *ngIf="averageScore > 0">/ 5</small></div>
          <div class="stat-label">Avg Rating ({{ ratings.length }})</div>
        </div>
      </div>

      <div class="content-grid">
        <!-- Listings Table -->
        <div class="main-column">
          <h3 class="section-title"><i class="fas fa-list"></i> Your Listings</h3>
          <div class="table-container" *ngIf="listings.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Quantity</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let l of listings" class="fade-in-up">
                  <td><strong>{{ l.foodName }}</strong></td>
                  <td>{{ l.quantity }} {{ l.unit }}</td>
                  <td><span class="badge badge-{{ l.foodType === 'EDIBLE' ? 'approved' : 'posted' }}">{{ l.foodType }}</span></td>
                  <td><span class="badge badge-{{ l.status.toLowerCase().replace('_', '-') }}">{{ l.status.replace('_', ' ') }}</span></td>
                  <td>
                    <a [routerLink]="['/provider/listing', l.id]" class="btn btn-sm btn-secondary">
                      <i class="fas fa-eye"></i> View
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="empty-state" *ngIf="listings.length === 0">
            <i class="fas fa-utensils"></i>
            <p>No food listings yet. Start by posting surplus food!</p>
            <a routerLink="/provider/create-listing" class="btn btn-primary" style="margin-top: 16px">
              <i class="fas fa-plus"></i> Post Food
            </a>
          </div>
        </div>

        <!-- Feedback & Ratings -->
        <div class="side-column">
          <h3 class="section-title"><i class="fas fa-comments"></i> Recent Feedback</h3>
          <div class="feedback-list" *ngIf="ratings.length > 0">
            <div class="feedback-card fade-in-up" *ngFor="let r of ratings; let i = index" [style.animation-delay]="(i * 0.1) + 's'">
              <div class="feedback-stars">
                <i class="fas fa-star" *ngFor="let s of [1,2,3,4,5]" [class.text-warning]="s <= r.score" [class.text-muted]="s > r.score"></i>
              </div>
              <p class="feedback-comment" *ngIf="r.comment">"{{ r.comment }}"</p>
              <div class="feedback-meta">
                <span class="rater"><i class="fas fa-user"></i> {{ r.rater?.fullName }}</span>
                <span class="food" *ngIf="r.listing?.foodName"><i class="fas fa-utensils"></i> {{ r.listing.foodName }}</span>
              </div>
            </div>
          </div>
          <div class="empty-feedback" *ngIf="ratings.length === 0">
            <i class="fas fa-comment-slash"></i>
            <p>No feedback received yet.</p>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .header-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    
    .content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-top: 32px; }
    .section-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; color: #333; display: flex; align-items: center; gap: 8px; }
    
    .main-column { min-width: 0; }
    .side-column { min-width: 0; }
    
    /* Feedback Cards */
    .feedback-list { display: flex; flex-direction: column; gap: 12px; }
    .feedback-card { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #f1c40f; }
    .feedback-stars { margin-bottom: 8px; font-size: 13px; }
    .text-warning { color: #f1c40f; }
    .text-muted { color: #e0e0e0; }
    .feedback-comment { font-size: 14px; color: #444; font-style: italic; margin-bottom: 12px; line-height: 1.4; }
    .feedback-meta { display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: #888; }
    .feedback-meta span { display: flex; align-items: center; gap: 4px; }
    
    .empty-feedback { background: white; border-radius: 12px; padding: 32px; text-align: center; color: #999; }
    .empty-feedback i { font-size: 32px; margin-bottom: 12px; opacity: 0.5; }
    
    @media (max-width: 992px) {
      .content-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProviderDashboardComponent implements OnInit {
    listings: FoodListing[] = [];
    ratings: any[] = [];
    averageScore: number = 0;

    constructor(private api: ApiService, private auth: AuthService) { }

    ngOnInit() {
        this.api.getMyListings().subscribe({
            next: (data) => this.listings = data,
            error: (err) => console.error(err)
        });

        const userId = this.auth.currentUserValue?.id;
        if (userId) {
            this.api.getUserRatings(userId).subscribe({
                next: (res) => {
                    this.ratings = res.ratings || [];
                    this.averageScore = res.averageScore || 0;
                },
                error: (err) => console.error(err)
            });
        }
    }

    countByStatus(status: string): number {
        return this.listings.filter(l => l.status === status).length;
    }
}
