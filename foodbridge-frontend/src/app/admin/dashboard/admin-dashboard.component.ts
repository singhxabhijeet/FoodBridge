import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { DashboardStats } from '../../core/models/models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="admin-wrapper" *ngIf="stats">
      <!-- Top Header -->
      <div class="admin-header">
        <h1>Dashboard</h1>
        <small>FoodBridge Admin Control Panel</small>
      </div>

      <!-- Info Boxes Row -->
      <div class="info-boxes">
        <div class="info-box" style="border-left: 4px solid #00c0ef">
          <div class="info-box-icon" style="background: #00c0ef"><i class="fas fa-clipboard-list"></i></div>
          <div class="info-box-content">
            <span class="info-box-text">Total Listings</span>
            <span class="info-box-number">{{ stats.totalListings }}</span>
          </div>
        </div>
        <div class="info-box" style="border-left: 4px solid #00a65a">
          <div class="info-box-icon" style="background: #00a65a"><i class="fas fa-handshake"></i></div>
          <div class="info-box-content">
            <span class="info-box-text">Confirmed Pickups</span>
            <span class="info-box-number">{{ stats.confirmedPickups }}</span>
          </div>
        </div>
        <div class="info-box" style="border-left: 4px solid #f39c12">
          <div class="info-box-icon" style="background: #f39c12"><i class="fas fa-users"></i></div>
          <div class="info-box-content">
            <span class="info-box-text">Total Users</span>
            <span class="info-box-number">{{ stats.totalUsers }}</span>
          </div>
        </div>
        <div class="info-box" style="border-left: 4px solid #dd4b39">
          <div class="info-box-icon" style="background: #dd4b39"><i class="fas fa-user-clock"></i></div>
          <div class="info-box-content">
            <span class="info-box-text">Pending Approvals</span>
            <span class="info-box-number">{{ stats.pendingUsers }}</span>
          </div>
        </div>
      </div>

      <!-- Small stat boxes -->
      <div class="small-boxes">
        <div class="small-box bg-teal">
          <div class="inner">
            <h3>{{ stats.totalFoodSaved }}</h3>
            <p>Food Saved (units)</p>
          </div>
          <div class="icon"><i class="fas fa-leaf"></i></div>
        </div>
        <div class="small-box bg-green">
          <div class="inner">
            <h3>{{ stats.approvalRate }}%</h3>
            <p>Approval Rate</p>
          </div>
          <div class="icon"><i class="fas fa-check-circle"></i></div>
        </div>
        <div class="small-box bg-blue">
          <div class="inner">
            <h3>{{ stats.claimSuccessRate }}%</h3>
            <p>Claim Success Rate</p>
          </div>
          <div class="icon"><i class="fas fa-trophy"></i></div>
        </div>
        <div class="small-box bg-orange">
          <div class="inner">
            <h3>{{ stats.expiryRate }}%</h3>
            <p>Expiry Rate</p>
          </div>
          <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <!-- Donut Chart: Listing Status -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3><i class="fas fa-chart-pie"></i> Listing Status Breakdown</h3>
          </div>
          <div class="chart-card-body">
            <canvas #donutChart></canvas>
          </div>
          <div class="chart-card-footer">
            <div class="footer-item">
              <span class="footer-dot" style="background:#00a65a"></span>
              Approved: {{ stats.approvedListings }}
            </div>
            <div class="footer-item">
              <span class="footer-dot" style="background:#f39c12"></span>
              Claimed: {{ stats.claimedListings }}
            </div>
            <div class="footer-item">
              <span class="footer-dot" style="background:#00c0ef"></span>
              Confirmed: {{ stats.confirmedPickups }}
            </div>
            <div class="footer-item">
              <span class="footer-dot" style="background:#dd4b39"></span>
              Expired: {{ stats.expiredListings }}
            </div>
          </div>
        </div>

        <!-- Bar Chart: User Roles -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3><i class="fas fa-chart-bar"></i> Active Users by Role</h3>
          </div>
          <div class="chart-card-body">
            <canvas #barChart></canvas>
          </div>
          <div class="chart-card-footer">
            <div class="footer-item">
              <strong>{{ stats.activeProviders }}</strong> Providers
            </div>
            <div class="footer-item">
              <strong>{{ stats.activeReceivers }}</strong> Receivers
            </div>
            <div class="footer-item">
              <strong>{{ stats.pendingUsers }}</strong> Pending
            </div>
          </div>
        </div>
      </div>

      <!-- Second Charts Row -->
      <div class="charts-row" style="margin-top: 20px">
        <!-- Horizontal Bar: Listing Pipeline -->
        <div class="chart-card" style="flex: 2">
          <div class="chart-card-header">
            <h3><i class="fas fa-stream"></i> Listing Pipeline Overview</h3>
          </div>
          <div class="chart-card-body">
            <canvas #pipelineChart></canvas>
          </div>
        </div>

        <!-- Polar Area: Performance Metrics -->
        <div class="chart-card" style="flex: 1">
          <div class="chart-card-header">
            <h3><i class="fas fa-bullseye"></i> Performance</h3>
          </div>
          <div class="chart-card-body">
            <canvas #polarChart></canvas>
          </div>
        </div>
      </div>
    </div>

    <div class="spinner" *ngIf="!stats"></div>
  `,
    styles: [`
    .admin-wrapper { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .admin-header { margin-bottom: 24px; }
    .admin-header h1 { font-size: 26px; font-weight: 700; margin-bottom: 2px; }
    .admin-header small { color: #888; font-size: 14px; }

    .info-boxes { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .info-box {
      background: white; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      display: flex; align-items: center; min-height: 78px; overflow: hidden;
    }
    .info-box-icon {
      width: 70px; height: 78px; display: flex; align-items: center; justify-content: center;
      font-size: 24px; color: white;
    }
    .info-box-content { padding: 10px 14px; }
    .info-box-text { font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; display: block; }
    .info-box-number { font-size: 28px; font-weight: 700; color: #333; }

    .small-boxes { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .small-box {
      border-radius: 4px; padding: 20px; color: white; position: relative; overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12); min-height: 100px;
    }
    .small-box .inner h3 { font-size: 32px; font-weight: 700; margin: 0 0 4px 0; }
    .small-box .inner p { font-size: 14px; margin: 0; opacity: 0.9; }
    .small-box .icon { position: absolute; top: 8px; right: 12px; font-size: 60px; opacity: 0.15; }
    .bg-teal { background: linear-gradient(135deg, #20c997, #17a2b8); }
    .bg-green { background: linear-gradient(135deg, #00a65a, #28a745); }
    .bg-blue { background: linear-gradient(135deg, #3c8dbc, #007bff); }
    .bg-orange { background: linear-gradient(135deg, #f39c12, #fd7e14); }

    .charts-row { display: flex; gap: 20px; }
    .chart-card {
      flex: 1; background: white; border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden;
    }
    .chart-card-header {
      padding: 14px 20px; border-bottom: 1px solid #f0f0f0;
    }
    .chart-card-header h3 { font-size: 15px; font-weight: 600; color: #444; display: flex; align-items: center; gap: 8px; margin: 0; }
    .chart-card-body { padding: 20px; position: relative; }
    .chart-card-footer {
      padding: 12px 20px; border-top: 1px solid #f0f0f0; display: flex; gap: 16px;
      flex-wrap: wrap; font-size: 13px; color: #666;
    }
    .footer-item { display: flex; align-items: center; gap: 6px; }
    .footer-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }

    @media (max-width: 768px) {
      .charts-row { flex-direction: column; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
    stats: DashboardStats | null = null;

    @ViewChild('donutChart') donutCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('barChart') barCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('pipelineChart') pipelineCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('polarChart') polarCanvas!: ElementRef<HTMLCanvasElement>;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getDashboardStats().subscribe({
            next: (data) => {
                this.stats = data;
                // Charts need DOM — setTimeout ensures ViewChild refs are ready
                setTimeout(() => this.renderCharts(), 0);
            }
        });
    }

    ngAfterViewInit() { }

    renderCharts() {
        if (!this.stats) return;

        // Donut Chart — Listing Status Breakdown
        new Chart(this.donutCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                labels: ['Approved', 'Claimed', 'Confirmed', 'Expired', 'Rejected', 'Under Review'],
                datasets: [{
                    data: [
                        this.stats.approvedListings,
                        this.stats.claimedListings,
                        this.stats.confirmedPickups,
                        this.stats.expiredListings,
                        this.stats.rejectedListings || 0,
                        (this.stats.listingsByStatus?.['UNDER_REVIEW'] || 0)
                    ],
                    backgroundColor: ['#00a65a', '#f39c12', '#00c0ef', '#dd4b39', '#605ca8', '#d2d6de'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '60%',
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, font: { size: 12 } } }
                }
            }
        });

        // Bar Chart — Active Users by Role
        new Chart(this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: ['Providers', 'Receivers', 'Pending'],
                datasets: [{
                    label: 'Users',
                    data: [this.stats.activeProviders, this.stats.activeReceivers, this.stats.pendingUsers],
                    backgroundColor: ['rgba(0, 166, 90, 0.8)', 'rgba(60, 141, 188, 0.8)', 'rgba(243, 156, 18, 0.8)'],
                    borderColor: ['#00a65a', '#3c8dbc', '#f39c12'],
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 12 } }, grid: { color: '#f0f0f0' } },
                    x: { ticks: { font: { size: 12 } }, grid: { display: false } }
                }
            }
        });

        // Horizontal Bar — Listing Pipeline
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
                        'rgba(210, 214, 222, 0.8)', 'rgba(243, 156, 18, 0.8)', 'rgba(0, 166, 90, 0.8)',
                        'rgba(162, 155, 254, 0.8)', 'rgba(253, 121, 168, 0.8)', 'rgba(0, 192, 239, 0.8)',
                        'rgba(99, 110, 114, 0.8)', 'rgba(221, 75, 57, 0.8)'
                    ],
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 12 } }, grid: { color: '#f5f5f5' } },
                    y: { ticks: { font: { size: 12 } }, grid: { display: false } }
                }
            }
        });

        // Polar Area — Performance Metrics
        new Chart(this.polarCanvas.nativeElement, {
            type: 'polarArea',
            data: {
                labels: ['Approval', 'Claims', 'Pickups', 'Waste'],
                datasets: [{
                    data: [
                        this.stats.approvalRate,
                        this.stats.claimSuccessRate,
                        this.stats.confirmedPickups > 0 ? 100 : 0,
                        this.stats.expiryRate
                    ],
                    backgroundColor: [
                        'rgba(0, 166, 90, 0.6)', 'rgba(60, 141, 188, 0.6)',
                        'rgba(0, 192, 239, 0.6)', 'rgba(221, 75, 57, 0.6)'
                    ],
                    borderColor: ['#00a65a', '#3c8dbc', '#00c0ef', '#dd4b39'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true, font: { size: 11 } } }
                },
                scales: { r: { ticks: { display: false }, grid: { color: '#f0f0f0' } } }
            }
        });
    }
}
