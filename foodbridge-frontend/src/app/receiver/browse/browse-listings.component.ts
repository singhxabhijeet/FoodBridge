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
              <label class="section-label">Schedule Pickup</label>
              
              <div class="pickup-form">
                <div class="form-group pickup-group">
                  <label>Date</label>
                  <input type="date" class="form-control" [(ngModel)]="l.pickupDate" [name]="'pdate_' + l.id" [min]="todayDate">
                </div>
                
                <div class="form-group pickup-group">
                  <label>Time</label>
                  <div class="time-inputs">
                    <select class="form-control" [(ngModel)]="l.pickupHour" [name]="'phour_' + l.id">
                      <option value="" disabled>HH</option>
                      <option *ngFor="let h of hours" [value]="h">{{ h }}</option>
                    </select>
                    <span class="colon">:</span>
                    <select class="form-control" [(ngModel)]="l.pickupMinute" [name]="'pmin_' + l.id">
                      <option value="" disabled>MM</option>
                      <option *ngFor="let m of minutes" [value]="m">{{ m }}</option>
                    </select>
                    <select class="form-control" [(ngModel)]="l.pickupPeriod" [name]="'pper_' + l.id">
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <button class="btn btn-primary btn-sm" style="width:100%" (click)="claim(l)" [disabled]="l.claiming">
                <i class="fas fa-hand-holding-heart"></i> {{ l.claiming ? 'Claiming...' : 'Claim This Food' }}
              </button>
            </div>
            <div class="alert alert-success" *ngIf="l.claimed" style="margin-top: 16px; padding: 12px; font-size: 13px">
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
    .claim-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0f0f0; }
    .section-label { font-size: 13px; font-weight: 700; margin-bottom: 12px; display: block; color: #333; }
    .pickup-form { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .pickup-group { margin-bottom: 0; }
    .pickup-group label { font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 6px; }
    .pickup-group .form-control { padding: 8px 10px; font-size: 13px; height: 38px; }
    .time-inputs { display: flex; align-items: center; gap: 6px; }
    .time-inputs select { flex: 1; min-width: 0; padding-left: 6px; padding-right: 6px; }
    .colon { font-weight: 700; color: #555; }
    @media (max-width: 400px) { .pickup-form { grid-template-columns: 1fr; } }
  `]
})
export class BrowseListingsComponent implements OnInit {
    listings: any[] = [];
    hours = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
    minutes = ['00', '15', '30', '45'];
    todayDate = new Date().toISOString().split('T')[0];

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getApprovedListings().subscribe({
            next: (data) => {
                this.listings = data.map((l: any) => ({
                    ...l,
                    pickupDate: '', pickupHour: '', pickupMinute: '', pickupPeriod: 'AM',
                    claiming: false, claimed: false
                }));
            },
            error: () => { }
        });
    }

    to24h(hour: string, minute: string, period: string): string {
        let h = parseInt(hour, 10);
        if (period === 'PM' && h !== 12) { h += 12; }
        else if (period === 'AM' && h === 12) { h = 0; }
        const hStr = h < 10 ? '0' + h : h.toString();
        return `${hStr}:${minute}`;
    }

    claim(listing: any) {
        if (!listing.pickupDate || !listing.pickupHour || !listing.pickupMinute) {
            alert('Please select a complete pickup date and time');
            return;
        }
        const timeStr = this.to24h(listing.pickupHour, listing.pickupMinute, listing.pickupPeriod);
        const pickupTime = `${listing.pickupDate}T${timeStr}`;

        listing.claiming = true;
        this.api.claimListing(listing.id, pickupTime).subscribe({
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
