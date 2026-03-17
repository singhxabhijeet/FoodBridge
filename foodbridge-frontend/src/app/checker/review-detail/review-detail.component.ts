import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-review-detail',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-container">
      <div class="review-card card" *ngIf="listing">
        <h1>Review: {{ listing.foodName }}</h1>

        <div class="review-content">
          <div class="photo-section" *ngIf="listing.photoUrl">
            <img [src]="'http://localhost:8080' + listing.photoUrl" alt="Food Photo" class="review-photo">
          </div>

          <div class="info-section">
            <div class="detail-grid">
              <div class="detail-item"><label>Provider</label><p>{{ listing.provider?.fullName }}</p></div>
              <div class="detail-item"><label>Quantity</label><p>{{ listing.quantity }} {{ listing.unit }}</p></div>
              <div class="detail-item"><label>Type</label><p>{{ listing.foodType }}</p></div>
              <div class="detail-item"><label>Perishability</label><p>{{ listing.perishLevel }}</p></div>
              <div class="detail-item"><label>Pickup Address</label><p>{{ listing.pickupAddress }}</p></div>
              <div class="detail-item"><label>Pickup Window</label><p>{{ listing.pickupWindowStart | date:'short' }} — {{ listing.pickupWindowEnd | date:'short' }}</p></div>
            </div>

            <div *ngIf="listing.safetyChecklist" class="checklist-section">
              <label>Safety Checklist</label>
              <div class="checklist-items">
                <span class="checklist-badge" *ngFor="let item of listing.safetyChecklist.split(',')">
                  <i class="fas fa-check"></i> {{ item.trim() }}
                </span>
              </div>
            </div>

            <div *ngIf="listing.description" class="description-section">
              <label>Description</label>
              <p>{{ listing.description }}</p>
            </div>
          </div>
        </div>

        <div class="review-actions" *ngIf="!submitted">
          <div class="form-group">
            <label>Reason / Comments</label>
            <textarea class="form-control" [(ngModel)]="reason" placeholder="Add comments or rejection reason..."></textarea>
          </div>
          <div class="action-buttons">
            <button class="btn btn-primary btn-lg" (click)="review(true)" [disabled]="loading">
              <i class="fas fa-check"></i> Approve
            </button>
            <button class="btn btn-danger btn-lg" (click)="review(false)" [disabled]="loading">
              <i class="fas fa-times"></i> Reject
            </button>
          </div>
        </div>

        <div class="alert alert-success" *ngIf="submitted">
          Review submitted successfully! Redirecting...
        </div>
      </div>
    </div>
  `,
    styles: [`
    .review-card { max-width: 800px; margin: 0 auto; padding: 40px; }
    .review-card h1 { font-size: 24px; margin-bottom: 24px; }
    .review-content { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
    .review-photo { width: 100%; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .detail-item label { font-size: 11px; color: #999; text-transform: uppercase; font-weight: 600; }
    .detail-item p { font-size: 14px; font-weight: 500; margin-top: 2px; }
    .checklist-section { margin-top: 16px; }
    .checklist-section label { font-size: 11px; color: #999; text-transform: uppercase; font-weight: 600; }
    .checklist-items { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .checklist-badge { background: #d4edda; color: #155724; padding: 4px 12px; border-radius: 20px; font-size: 12px; display: flex; align-items: center; gap: 4px; }
    .description-section { margin-top: 16px; }
    .description-section label { font-size: 11px; color: #999; text-transform: uppercase; font-weight: 600; }
    .action-buttons { display: flex; gap: 16px; }
    @media (max-width: 700px) { .review-content { grid-template-columns: 1fr; } }
  `]
})
export class ReviewDetailComponent implements OnInit {
    listing: any = null;
    reason = '';
    loading = false;
    submitted = false;

    constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        const id = +this.route.snapshot.params['id'];
        this.api.getListingById(id).subscribe({ next: (data) => this.listing = data });
    }

    review(approved: boolean) {
        this.loading = true;
        this.api.reviewListing(this.listing.id, approved, this.reason).subscribe({
            next: () => {
                this.loading = false;
                this.submitted = true;
                setTimeout(() => this.router.navigate(['/checker/review-queue']), 2000);
            },
            error: () => { this.loading = false; }
        });
    }
}
