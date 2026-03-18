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

      <!-- Analytics Section -->
      <div class="analytics-grid" *ngIf="stats">
        <div class="card analytics-card fade-in-up" style="animation-delay: 0.45s">
          <div class="analytics-icon" style="background: linear-gradient(135deg, #2ecc71, #27ae60)">
            <i class="fas fa-chart-pie"></i>
          </div>
          <div class="analytics-body">
            <div class="analytics-value">{{ stats.approvalRate }}%</div>
            <div class="analytics-label">Approval Rate</div>
            <div class="analytics-sub">Listings approved out of total processed</div>
          </div>
        </div>

        <div class="card analytics-card fade-in-up" style="animation-delay: 0.5s">
          <div class="analytics-icon" style="background: linear-gradient(135deg, #3498db, #2980b9)">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="analytics-body">
            <div class="analytics-value">{{ stats.claimSuccessRate }}%</div>
            <div class="analytics-label">Claim Success Rate</div>
            <div class="analytics-sub">Confirmed pickups out of total claims</div>
          </div>
        </div>

        <div class="card analytics-card fade-in-up" style="animation-delay: 0.55s">
          <div class="analytics-icon" style="background: linear-gradient(135deg, #e74c3c, #c0392b)">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="analytics-body">
            <div class="analytics-value">{{ stats.expiryRate }}%</div>
            <div class="analytics-label">Expiry Rate</div>
            <div class="analytics-sub">Listings expired without being claimed</div>
          </div>
        </div>

        <div class="card analytics-card fade-in-up" style="animation-delay: 0.6s">
          <div class="analytics-icon" style="background: linear-gradient(135deg, #9b59b6, #8e44ad)">
            <i class="fas fa-user-friends"></i>
          </div>
          <div class="analytics-body">
            <div class="analytics-value">{{ stats.activeProviders }} / {{ stats.activeReceivers }}</div>
            <div class="analytics-label">Active Providers / Receivers</div>
            <div class="analytics-sub">Approved and active users by role</div>
          </div>
        </div>
      </div>

      <div class="spinner" *ngIf="!stats"></div>
    </div>
  `,
    styles: [`
    .analytics-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 28px;
    }
    .analytics-card {
      display: flex; align-items: center; gap: 20px; padding: 28px;
    }
    .analytics-icon {
      width: 56px; height: 56px; border-radius: 16px; display: flex;
      align-items: center; justify-content: center; font-size: 22px; color: white; flex-shrink: 0;
    }
    .analytics-body { flex: 1; }
    .analytics-value { font-size: 28px; font-weight: 800; color: #1a1a2e; }
    .analytics-label { font-size: 14px; font-weight: 600; color: #555; margin-top: 2px; }
    .analytics-sub { font-size: 11px; color: #999; margin-top: 4px; }
  `]
})
export class AdminDashboardComponent implements OnInit {
    stats: DashboardStats | null = null;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getDashboardStats().subscribe({
            next: (data) => {
                this.stats = data;
            }
        });
    }
}
