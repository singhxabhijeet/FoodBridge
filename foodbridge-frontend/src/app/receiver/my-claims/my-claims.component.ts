import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-my-claims',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1><i class="fas fa-hand-holding-heart"></i> My Claims</h1>
        <p>Track your claimed food pickups</p>
      </div>

      <div class="claims-list" *ngIf="claims.length > 0">
        <div class="card claim-card fade-in-up" *ngFor="let c of claims; let i = index" [style.animation-delay]="(i * 0.1) + 's'">
          <div class="claim-header">
            <h3>{{ c.listing?.foodName }}</h3>
            <span class="badge badge-{{ c.listing.status.toLowerCase().replace('_', '-') }}">{{ c.listing.status.replace('_', ' ') }}</span>
          </div>
          <div class="claim-details">
            <div><i class="fas fa-store"></i> {{ c.listing?.provider?.fullName }}</div>
            <div><i class="fas fa-map-marker-alt"></i> {{ c.listing?.pickupAddress }}</div>
            <div><i class="fas fa-clock"></i> Scheduled: {{ c.scheduledPickupTime | date:'short' }}</div>
            <div><i class="fas fa-weight-hanging"></i> {{ c.listing?.quantity }} {{ c.listing?.unit }}</div>
          </div>

          <div class="claim-status">
            <div class="confirm-row">
              <span><i class="fas" [class.fa-check-circle]="c.providerConfirmed" [class.fa-circle]="!c.providerConfirmed"
                    [style.color]="c.providerConfirmed ? '#2ecc71' : '#ddd'"></i> Provider confirmed</span>
              <span><i class="fas" [class.fa-check-circle]="c.receiverConfirmed" [class.fa-circle]="!c.receiverConfirmed"
                    [style.color]="c.receiverConfirmed ? '#2ecc71' : '#ddd'"></i> You confirmed</span>
            </div>
          </div>

          <div class="claim-actions">
            <button class="btn btn-primary btn-sm" *ngIf="!c.receiverConfirmed && c.listing.status !== 'CONFIRMED'"
                    (click)="confirmPickup(c)">
              <i class="fas fa-check"></i> Confirm Pickup
            </button>

            <!-- Cancel Claim -->
            <button class="btn btn-danger btn-sm" *ngIf="c.listing.status === 'CLAIMED' && !c.receiverConfirmed && !c.providerConfirmed"
                    (click)="cancelClaim(c)">
              <i class="fas fa-times"></i> Cancel Claim
            </button>

            <!-- Rating -->
            <div class="rating-section" *ngIf="c.listing.status === 'CONFIRMED' && !c.rated">
              <h4>Rate Provider</h4>
              <div class="stars">
                <i *ngFor="let s of [1,2,3,4,5]" class="fas fa-star"
                   [class.active]="s <= c.ratingScore"
                   (click)="c.ratingScore = s"></i>
              </div>
              <input type="text" class="form-control" [(ngModel)]="c.ratingComment" [name]="'rcomment_' + c.id"
                     placeholder="Leave a comment..." style="margin: 8px 0;">
              <button class="btn btn-accent btn-sm" (click)="submitRating(c)">
                <i class="fas fa-star"></i> Submit Rating
              </button>
            </div>
            <div class="alert alert-success" *ngIf="c.rated" style="padding: 8px; margin-top: 8px">
              Rating submitted! ⭐
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="claims.length === 0">
        <i class="fas fa-inbox"></i>
        <p>No claims yet. Browse available food to get started!</p>
      </div>
    </div>
  `,
    styles: [`
    .claims-list { display: flex; flex-direction: column; gap: 16px; }
    .claim-card { padding: 24px; }
    .claim-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .claim-header h3 { font-size: 18px; font-weight: 700; }
    .claim-details { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; font-size: 14px; color: #555; }
    .claim-details div { display: flex; align-items: center; gap: 8px; }
    .confirm-row { display: flex; gap: 24px; font-size: 14px; }
    .claim-status { padding: 12px 0; border-top: 1px solid #f0f0f0; margin-bottom: 12px; }
    .rating-section { margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0f0; }
    .rating-section h4 { font-size: 14px; margin-bottom: 8px; }
    @media (max-width: 600px) { .claim-details { grid-template-columns: 1fr; } }
  `]
})
export class MyClaimsComponent implements OnInit {
    claims: any[] = [];

    constructor(private api: ApiService, private auth: AuthService) { }

    ngOnInit() {
        this.api.getMyClaims().subscribe({
            next: (data) => {
                this.claims = data.map((c: any) => ({ ...c, ratingScore: 0, ratingComment: '', rated: false }));
            },
            error: () => { }
        });
    }

    confirmPickup(claim: any) {
        this.api.receiverConfirm(claim.id).subscribe({
            next: () => {
                claim.receiverConfirmed = true;
                if (claim.providerConfirmed) {
                    claim.listing.status = 'CONFIRMED';
                } else {
                    claim.listing.status = 'PICKED_UP';
                }
            }
        });
    }

    submitRating(claim: any) {
        this.api.submitRating({
            ratedUserId: claim.listing.provider.id,
            listingId: claim.listing.id,
            score: claim.ratingScore,
            comment: claim.ratingComment
        }).subscribe({
            next: () => { claim.rated = true; }
        });
    }

    cancelClaim(claim: any) {
        if (confirm('Are you sure you want to cancel this claim?')) {
            this.api.cancelClaim(claim.id).subscribe({
                next: () => {
                    this.claims = this.claims.filter((c: any) => c.id !== claim.id);
                },
                error: (err: any) => {
                    alert(err.error?.message || 'Failed to cancel claim');
                }
            });
        }
    }
}
