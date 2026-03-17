import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { FoodListing } from '../../core/models/models';

@Component({
    selector: 'app-listing-management',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1><i class="fas fa-list-alt"></i> Listing Management</h1>
        <p>Monitor and manage all food listings on the platform</p>
      </div>

      <div class="table-container" *ngIf="listings.length > 0">
        <table>
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Provider</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let l of listings">
              <td><strong>{{ l.foodName }}</strong></td>
              <td>{{ l.provider?.fullName }}</td>
              <td>{{ l.quantity }} {{ l.unit }}</td>
              <td>{{ l.foodType }}</td>
              <td><span class="badge badge-{{ l.status.toLowerCase().replace('_', '-') }}">{{ l.status.replace('_', ' ') }}</span></td>
              <td>{{ l.createdAt | date:'mediumDate' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="listings.length === 0">
        <i class="fas fa-clipboard"></i>
        <p>No listings on the platform yet.</p>
      </div>
    </div>
  `
})
export class ListingManagementComponent implements OnInit {
    listings: FoodListing[] = [];

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getAllListings().subscribe({
            next: (data) => this.listings = data,
            error: () => { }
        });
    }
}
