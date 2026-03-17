import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
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
            <p>Manage your food listings and track their status</p>
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
          <div class="stat-icon" style="color: #9b59b6"><i class="fas fa-handshake"></i></div>
          <div class="stat-number">{{ countByStatus('CONFIRMED') }}</div>
          <div class="stat-label">Confirmed</div>
        </div>
      </div>

      <!-- Listings Table -->
      <div class="table-container" *ngIf="listings.length > 0">
        <table>
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let l of listings" class="fade-in-up">
              <td><strong>{{ l.foodName }}</strong></td>
              <td>{{ l.quantity }} {{ l.unit }}</td>
              <td><span class="badge badge-{{ l.foodType === 'EDIBLE' ? 'approved' : 'posted' }}">{{ l.foodType }}</span></td>
              <td><span class="badge badge-{{ l.status.toLowerCase().replace('_', '-') }}">{{ l.status.replace('_', ' ') }}</span></td>
              <td>{{ l.createdAt | date:'mediumDate' }}</td>
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
  `,
    styles: [`
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
  `]
})
export class ProviderDashboardComponent implements OnInit {
    listings: FoodListing[] = [];

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getMyListings().subscribe({
            next: (data) => this.listings = data,
            error: (err) => console.error(err)
        });
    }

    countByStatus(status: string): number {
        return this.listings.filter(l => l.status === status).length;
    }
}
