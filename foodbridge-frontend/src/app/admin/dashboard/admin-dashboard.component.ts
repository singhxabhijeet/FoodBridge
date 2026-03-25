import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardStats } from '../../core/models/models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="admin-wrapper" *ngIf="stats">
      <div class="admin-header">
        <h1>Dashboard</h1>
        <small>FoodBridge Admin Control Panel</small>
      </div>

      <!-- Stat Cards Row -->
      <div class="stat-row">
        <div class="stat-tile clickable" (click)="goTo('/admin/listings')">
          <div class="tile-icon bg-info"><i class="fas fa-clipboard-list"></i></div>
          <div class="tile-body">
            <h2>{{ stats.totalListings }}</h2>
            <span>Total Listings</span>
          </div>
        </div>
        <div class="stat-tile clickable" (click)="goTo('/admin/listings', 'CONFIRMED')">
          <div class="tile-icon bg-success"><i class="fas fa-handshake"></i></div>
          <div class="tile-body">
            <h2>{{ stats.confirmedPickups }}</h2>
            <span>Confirmed Pickups</span>
          </div>
        </div>
        <div class="stat-tile clickable" (click)="goTo('/admin/users')">
          <div class="tile-icon bg-warning"><i class="fas fa-users"></i></div>
          <div class="tile-body">
            <h2>{{ stats.totalUsers }}</h2>
            <span>Total Users</span>
          </div>
        </div>
        <div class="stat-tile clickable" (click)="goTo('/admin/users', 'pending')">
          <div class="tile-icon bg-danger"><i class="fas fa-user-clock"></i></div>
          <div class="tile-body">
            <h2>{{ stats.pendingUsers }}</h2>
            <span>Pending Approvals</span>
          </div>
        </div>
        <div class="stat-tile clickable" (click)="goTo('/admin/users', 'restricted')">
          <div class="tile-icon bg-red"><i class="fas fa-user-lock"></i></div>
          <div class="tile-body">
            <h2>{{ stats.restrictedUsers }}</h2>
            <span>Restricted Users</span>
          </div>
        </div>
        <div class="stat-tile">
          <div class="tile-icon bg-teal"><i class="fas fa-leaf"></i></div>
          <div class="tile-body">
            <h2>{{ stats.totalFoodSaved }}</h2>
            <span>Food Saved (units)</span>
          </div>
        </div>
        <div class="stat-tile clickable" (click)="goTo('/admin/listings', 'EXPIRED')">
          <div class="tile-icon bg-purple"><i class="fas fa-clock"></i></div>
          <div class="tile-body">
            <h2>{{ stats.expiredListings }}</h2>
            <span>Expired</span>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <div class="chart-card wide">
          <div class="chart-card-header">
            <h3><i class="fas fa-stream"></i> Listing Pipeline Overview</h3>
          </div>
          <div class="chart-card-body">
            <canvas #pipelineChart></canvas>
          </div>
        </div>

        <div class="chart-card narrow">
          <div class="chart-card-header">
            <h3><i class="fas fa-user-friends"></i> Active Users by Role</h3>
          </div>
          <div class="chart-card-body">
            <canvas #barChart></canvas>
          </div>
        </div>
      </div>
    </div>

    <div class="spinner" *ngIf="!stats"></div>
  `,
    styles: [`
    .admin-wrapper { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .admin-header { margin-bottom: 28px; }
    .admin-header h1 { font-size: 26px; font-weight: 700; margin-bottom: 2px; }
    .admin-header small { color: #888; font-size: 14px; }

    .stat-row {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 20px; margin-bottom: 28px;
    }
    .stat-tile {
      background: white; border-radius: 12px; padding: 20px;
      display: flex; align-items: center; gap: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06); transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-tile.clickable { cursor: pointer; }
    .stat-tile.clickable:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
    .tile-icon {
      width: 52px; height: 52px; border-radius: 14px; display: flex;
      align-items: center; justify-content: center; font-size: 20px; color: white; flex-shrink: 0;
    }
    .tile-body h2 { font-size: 26px; font-weight: 800; color: #1a1a2e; margin: 0; line-height: 1; }
    .tile-body span { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .bg-info { background: linear-gradient(135deg, #00c0ef, #17a2b8); }
    .bg-success { background: linear-gradient(135deg, #00a65a, #28a745); }
    .bg-warning { background: linear-gradient(135deg, #f39c12, #fd7e14); }
    .bg-danger { background: linear-gradient(135deg, #dd4b39, #e74c3c); }
    .bg-red { background: linear-gradient(135deg, #c0392b, #e74c3c); }
    .bg-teal { background: linear-gradient(135deg, #20c997, #0dcaf0); }
    .bg-purple { background: linear-gradient(135deg, #605ca8, #9b59b6); }

    .charts-row { display: flex; gap: 20px; }
    .chart-card {
      background: white; border-radius: 12px; overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    .chart-card.wide { flex: 3; }
    .chart-card.narrow { flex: 2; }
    .chart-card-header { padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
    .chart-card-header h3 {
      font-size: 15px; font-weight: 700; color: #333; margin: 0;
      display: flex; align-items: center; gap: 8px;
    }
    .chart-card-body { padding: 20px; }

    @media (max-width: 992px) {
      .stat-row { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .charts-row { flex-direction: column; }
    }
    @media (max-width: 576px) {
      .stat-row { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
    stats: DashboardStats | null = null;
    isFullAdmin = false;

    @ViewChild('pipelineChart') pipelineCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('barChart') barCanvas!: ElementRef<HTMLCanvasElement>;

    constructor(private api: ApiService, private auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.isFullAdmin = this.auth.getRole() === 'ADMIN';
        this.api.getDashboardStats().subscribe({
            next: (data) => {
                this.stats = data;
                setTimeout(() => this.renderCharts(), 0);
            }
        });
    }

    goTo(path: string, filter?: string) {
        if (filter) {
            this.router.navigate([path], { queryParams: { filter } });
        } else {
            this.router.navigate([path]);
        }
    }

    renderCharts() {
        if (!this.stats) return;

        new Chart(this.pipelineCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: ['Posted', 'Under Review', 'Approved', 'Claimed', 'Picked Up', 'Confirmed', 'Expired', 'Rejected'],
                datasets: [{
                    label: 'Listings',
                    data: [
                        this.stats.listingsByStatus?.['POSTED'] || 0,
                        this.stats.listingsByStatus?.['UNDER_REVIEW'] || 0,
                        this.stats.approvedListings,
                        this.stats.claimedListings,
                        this.stats.listingsByStatus?.['PICKED_UP'] || 0,
                        this.stats.confirmedPickups,
                        this.stats.expiredListings,
                        this.stats.rejectedListings || 0
                    ],
                    backgroundColor: [
                        'rgba(210, 214, 222, 0.85)', 'rgba(243, 156, 18, 0.85)', 'rgba(0, 166, 90, 0.85)',
                        'rgba(162, 155, 254, 0.85)', 'rgba(253, 121, 168, 0.85)', 'rgba(0, 192, 239, 0.85)',
                        'rgba(99, 110, 114, 0.85)', 'rgba(221, 75, 57, 0.85)'
                    ],
                    borderWidth: 0,
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 12 } }, grid: { color: '#f5f5f5' } },
                    y: { ticks: { font: { size: 13, weight: 'bold' } }, grid: { display: false } }
                }
            }
        });

        new Chart(this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: ['Providers', 'Receivers', 'Checkers', 'Composters'],
                datasets: [{
                    label: 'Active Users',
                    data: [
                        this.stats.activeProviders,
                        this.stats.activeReceivers,
                        this.stats.activeCheckers,
                        this.stats.activeCompostReceivers
                    ],
                    backgroundColor: [
                        'rgba(0, 166, 90, 0.8)', 'rgba(60, 141, 188, 0.8)',
                        'rgba(243, 156, 18, 0.8)', 'rgba(32, 201, 151, 0.8)'
                    ],
                    borderColor: ['#00a65a', '#3c8dbc', '#f39c12', '#20c997'],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 12 } }, grid: { color: '#f0f0f0' } },
                    x: { ticks: { font: { size: 13, weight: 'bold' } }, grid: { display: false } }
                }
            }
        });
    }
}
