import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-listing-detail',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <div class="detail-card card" *ngIf="listing">
        <div class="detail-header">
          <div>
            <h1>{{ listing.foodName }}</h1>
            <span class="badge badge-{{ listing.status.toLowerCase().replace('_', '-') }}">{{ listing.status.replace('_', ' ') }}</span>
          </div>
          <img *ngIf="listing.photoUrl" [src]="'http://localhost:8080' + listing.photoUrl" class="food-photo" alt="Food photo">
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <label>Quantity</label>
            <p>{{ listing.quantity }} {{ listing.unit }}</p>
          </div>
          <div class="detail-item">
            <label>Food Type</label>
            <p>{{ listing.foodType }}</p>
          </div>
          <div class="detail-item">
            <label>Perishability</label>
            <p>{{ listing.perishLevel }}</p>
          </div>
          <div class="detail-item">
            <label>Pickup Address</label>
            <p>{{ listing.pickupAddress }}</p>
          </div>
          <div class="detail-item">
            <label>Pickup Window</label>
            <p>{{ listing.pickupWindowStart | date:'short' }} — {{ listing.pickupWindowEnd | date:'short' }}</p>
          </div>
          <div class="detail-item" *ngIf="listing.description">
            <label>Description</label>
            <p>{{ listing.description }}</p>
          </div>
          <div class="detail-item" *ngIf="listing.safetyChecklist">
            <label>Safety Checklist</label>
            <p>{{ listing.safetyChecklist }}</p>
          </div>
          <div class="detail-item" *ngIf="listing.rejectionReason">
            <label>Rejection Reason</label>
            <p class="text-danger">{{ listing.rejectionReason }}</p>
          </div>
        </div>

        <!-- Confirm pickup if claimed -->
        <div class="actions" *ngIf="listing.status === 'CLAIMED' || listing.status === 'PICKED_UP'">
          <button class="btn btn-primary" (click)="confirmPickup()" [disabled]="confirming">
            <i class="fas fa-check"></i> Confirm Pickup (Provider)
          </button>
        </div>

        <div class="alert alert-success" *ngIf="confirmMsg">{{ confirmMsg }}</div>
      </div>
    </div>
  `,
    styles: [`
    .detail-card { max-width: 700px; margin: 0 auto; padding: 40px; }
    .detail-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 32px; flex-wrap: wrap; }
    .detail-header h1 { font-size: 28px; margin-bottom: 8px; }
    .food-photo { width: 200px; height: 150px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .detail-item label { font-size: 12px; color: #999; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
    .detail-item p { font-size: 15px; font-weight: 500; margin-top: 4px; }
    .text-danger { color: #e74c3c; }
    .actions { margin-top: 20px; }
    @media (max-width: 600px) { .detail-grid { grid-template-columns: 1fr; } }
  `]
})
export class ListingDetailComponent implements OnInit {
    listing: any = null;
    claim: any = null;
    confirming = false;
    confirmMsg = '';

    constructor(private api: ApiService, private route: ActivatedRoute, private auth: AuthService) { }

    ngOnInit() {
        const id = +this.route.snapshot.params['id'];
        this.api.getListingById(id).subscribe({
            next: (data) => {
                this.listing = data;
                if (data.status === 'CLAIMED' || data.status === 'PICKED_UP') {
                    this.api.getClaimsByListing(id).subscribe({
                        next: (claims: any[]) => {
                            if (claims && claims.length > 0) {
                                this.claim = claims[0];
                            }
                        },
                        error: () => { }
                    });
                }
            }
        });
    }

    confirmPickup() {
        if (!this.claim) return;
        this.confirming = true;
        this.api.providerConfirm(this.claim.id).subscribe({
            next: () => {
                this.confirming = false;
                this.confirmMsg = 'Pickup confirmed!';
                this.ngOnInit();
            },
            error: () => { this.confirming = false; }
        });
    }
}
