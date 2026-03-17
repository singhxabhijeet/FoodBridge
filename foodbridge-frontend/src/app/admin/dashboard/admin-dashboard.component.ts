import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { DashboardStats } from '../../core/models/models';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1><i class="fas fa-shield-alt"></i> Admin Dashboard</h1>
        <p>Monitor platform activity and manage operations</p>
      </div>

      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card fade-in-up" style="animation-delay: 0.05s">
          <div class="stat-icon" style="color: #3498db"><i class="fas fa-clipboard-list"></i></div>
          <div class="stat-number">{{ stats.totalListings }}</div>
          <div class="stat-label">Total Listings</div>
        </div>
        <div class="stat-card fade-in-up" style="animation-delay: 0.1s">
          <div class="stat-icon" style="color: #2ecc71"><i class="fas fa-check-circle"></i></div>
          <div class="stat-number">{{ stats.approvedListings }}</div>
          <div class="stat-label">Approved</div>
        </div>
        <div class="stat-card fade-in-up" style="animation-delay: 0.15s">
          <div class="stat-icon" style="color: #9b59b6"><i class="fas fa-hand-holding-heart"></i></div>
          <div class="stat-number">{{ stats.claimedListings }}</div>
          <div class="stat-label">Claimed</div>
        </div>
        <div class="stat-card fade-in-up" style="animation-delay: 0.2s">
          <div class="stat-icon" style="color: #e67e22"><i class="fas fa-handshake"></i></div>
          <div class="stat-number">{{ stats.confirmedPickups }}</div>
          <div class="stat-label">Confirmed Pickups</div>
        </div>
        <div class="stat-card fade-in-up" style="animation-delay: 0.25s">
          <div class="stat-icon" style="color: #e74c3c"><i class="fas fa-clock"></i></div>
          <div class="stat-number">{{ stats.expiredListings }}</div>
          <div class="stat-label">Expired</div>
        </div>
        <div class="stat-card fade-in-up" style="animation-delay: 0.3s">
          <div class="stat-icon" style="color: #1abc9c"><i class="fas fa-users"></i></div>
          <div class="stat-number">{{ stats.totalUsers }}</div>
          <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-card fade-in-up" style="animation-delay: 0.35s">
          <div class="stat-icon" style="color: #f39c12"><i class="fas fa-user-clock"></i></div>
          <div class="stat-number">{{ stats.pendingUsers }}</div>
          <div class="stat-label">Pending Approval</div>
        </div>
        <div class="stat-card fade-in-up" style="animation-delay: 0.4s">
          <div class="stat-icon" style="color: #2ecc71"><i class="fas fa-leaf"></i></div>
          <div class="stat-number">{{ stats.totalFoodSaved }}</div>
          <div class="stat-label">Food Saved (units)</div>
        </div>
      </div>

      <!-- Status Breakdown -->
      <div class="card" style="padding: 32px" *ngIf="stats?.listingsByStatus">
        <h2 style="margin-bottom: 20px; font-size: 20px;"><i class="fas fa-chart-bar"></i> Listings by Status</h2>
        <div class="status-bars">
          <div class="status-bar" *ngFor="let entry of statusEntries">
            <div class="status-label">{{ entry[0].replace('_', ' ') }}</div>
            <div class="bar-container">
              <div class="bar-fill" [style.width]="getBarWidth(entry[1])" [style.background]="getBarColor(entry[0])"></div>
            </div>
            <div class="status-count">{{ entry[1] }}</div>
          </div>
        </div>
      </div>

      <div class="spinner" *ngIf="!stats"></div>
    </div>
  `,
    styles: [`
    .status-bars { display: flex; flex-direction: column; gap: 12px; }
    .status-bar { display: flex; align-items: center; gap: 16px; }
    .status-label { width: 120px; font-size: 13px; font-weight: 600; color: #555; text-transform: capitalize; }
    .bar-container { flex: 1; height: 28px; background: #f0f0f0; border-radius: 14px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 14px; transition: width 0.8s ease; min-width: 4px; }
    .status-count { font-size: 14px; font-weight: 700; width: 40px; text-align: right; }
  `]
})
export class AdminDashboardComponent implements OnInit {
    stats: DashboardStats | null = null;
    statusEntries: [string, number][] = [];

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getDashboardStats().subscribe({
            next: (data) => {
                this.stats = data;
                if (data.listingsByStatus) {
                    this.statusEntries = Object.entries(data.listingsByStatus);
                }
            }
        });
    }

    getBarWidth(count: number): string {
        const max = Math.max(...this.statusEntries.map(e => e[1]), 1);
        return (count / max * 100) + '%';
    }

    getBarColor(status: string): string {
        const colors: any = {
            'POSTED': '#bdc3c7', 'UNDER_REVIEW': '#f39c12', 'APPROVED': '#2ecc71',
            'CLAIMED': '#9b59b6', 'PICKED_UP': '#e84393', 'CONFIRMED': '#00b894',
            'EXPIRED': '#636e72', 'REJECTED': '#e74c3c'
        };
        return colors[status] || '#3498db';
    }
}
