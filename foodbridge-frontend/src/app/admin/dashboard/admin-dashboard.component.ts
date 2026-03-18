import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { DashboardStats } from '../../core/models/models';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="admin-wrapper" *ngIf="stats">
      <!-- Top Header -->
      <div class="admin-header">
        <div>
          <h1>Dashboard</h1>
          <small>FoodBridge Admin Control Panel</small>
        </div>
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
          <div class="info-box-icon" style="background: #00a65a"><i class="fas fa-check-circle"></i></div>
          <div class="info-box-content">
            <span class="info-box-text">Approved</span>
            <span class="info-box-number">{{ stats.approvedListings }}</span>
          </div>
        </div>
        <div class="info-box" style="border-left: 4px solid #f39c12">
          <div class="info-box-icon" style="background: #f39c12"><i class="fas fa-hand-holding-heart"></i></div>
          <div class="info-box-content">
            <span class="info-box-text">Claimed</span>
            <span class="info-box-number">{{ stats.claimedListings }}</span>
          </div>
        </div>
        <div class="info-box" style="border-left: 4px solid #dd4b39">
          <div class="info-box-icon" style="background: #dd4b39"><i class="fas fa-clock"></i></div>
          <div class="info-box-content">
            <span class="info-box-text">Expired</span>
            <span class="info-box-number">{{ stats.expiredListings }}</span>
          </div>
        </div>
      </div>

      <!-- Small Boxes Row -->
      <div class="small-boxes">
        <div class="small-box bg-teal">
          <div class="inner">
            <h3>{{ stats.confirmedPickups }}</h3>
            <p>Successful Pickups</p>
          </div>
          <div class="icon"><i class="fas fa-handshake"></i></div>
        </div>
        <div class="small-box bg-green">
          <div class="inner">
            <h3>{{ stats.totalFoodSaved }}</h3>
            <p>Food Saved (units)</p>
          </div>
          <div class="icon"><i class="fas fa-leaf"></i></div>
        </div>
        <div class="small-box bg-blue">
          <div class="inner">
            <h3>{{ stats.totalUsers }}</h3>
            <p>Registered Users</p>
          </div>
          <div class="icon"><i class="fas fa-users"></i></div>
        </div>
        <div class="small-box bg-orange">
          <div class="inner">
            <h3>{{ stats.pendingUsers }}</h3>
            <p>Pending Approvals</p>
          </div>
          <div class="icon"><i class="fas fa-user-clock"></i></div>
        </div>
      </div>

      <!-- Analytics Cards Row -->
      <div class="analytics-row">
        <div class="analytics-panel">
          <div class="panel-heading" style="background: linear-gradient(135deg, #00a65a, #00c853)">
            <i class="fas fa-chart-pie"></i> Approval Rate
          </div>
          <div class="panel-body">
            <div class="big-number">{{ stats.approvalRate }}%</div>
            <div class="panel-label">Listings approved out of processed</div>
            <div class="progress-bar-wrap">
              <div class="progress-fill" [style.width]="stats.approvalRate + '%'" style="background: #00a65a"></div>
            </div>
          </div>
        </div>

        <div class="analytics-panel">
          <div class="panel-heading" style="background: linear-gradient(135deg, #3c8dbc, #2196f3)">
            <i class="fas fa-trophy"></i> Claim Success
          </div>
          <div class="panel-body">
            <div class="big-number">{{ stats.claimSuccessRate }}%</div>
            <div class="panel-label">Confirmed pickups vs total claims</div>
            <div class="progress-bar-wrap">
              <div class="progress-fill" [style.width]="stats.claimSuccessRate + '%'" style="background: #3c8dbc"></div>
            </div>
          </div>
        </div>

        <div class="analytics-panel">
          <div class="panel-heading" style="background: linear-gradient(135deg, #dd4b39, #e74c3c)">
            <i class="fas fa-exclamation-triangle"></i> Expiry Rate
          </div>
          <div class="panel-body">
            <div class="big-number">{{ stats.expiryRate }}%</div>
            <div class="panel-label">Listings expired without being claimed</div>
            <div class="progress-bar-wrap">
              <div class="progress-fill" [style.width]="stats.expiryRate + '%'" style="background: #dd4b39"></div>
            </div>
          </div>
        </div>

        <div class="analytics-panel">
          <div class="panel-heading" style="background: linear-gradient(135deg, #605ca8, #9b59b6)">
            <i class="fas fa-user-friends"></i> Active Users
          </div>
          <div class="panel-body">
            <div class="user-split">
              <div>
                <div class="split-number">{{ stats.activeProviders }}</div>
                <div class="split-label">Providers</div>
              </div>
              <div class="split-divider"></div>
              <div>
                <div class="split-number">{{ stats.activeReceivers }}</div>
                <div class="split-label">Receivers</div>
              </div>
            </div>
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

    /* Info Boxes */
    .info-boxes { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .info-box {
      background: white; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      display: flex; align-items: center; padding: 0; min-height: 78px; overflow: hidden;
    }
    .info-box-icon {
      width: 70px; height: 78px; display: flex; align-items: center; justify-content: center;
      font-size: 24px; color: white;
    }
    .info-box-content { padding: 10px 14px; }
    .info-box-text { font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; display: block; }
    .info-box-number { font-size: 28px; font-weight: 700; color: #333; }

    /* Small Boxes */
    .small-boxes { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
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

    /* Analytics Panels */
    .analytics-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
    .analytics-panel {
      background: white; border-radius: 4px; overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .panel-heading {
      padding: 12px 16px; color: white; font-size: 14px; font-weight: 600;
      display: flex; align-items: center; gap: 8px;
    }
    .panel-body { padding: 20px; text-align: center; }
    .big-number { font-size: 36px; font-weight: 800; color: #333; }
    .panel-label { font-size: 12px; color: #999; margin: 6px 0 12px; }
    .progress-bar-wrap {
      width: 100%; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden;
    }
    .progress-fill { height: 100%; border-radius: 4px; transition: width 0.8s ease; }

    /* User Split */
    .user-split { display: flex; align-items: center; justify-content: center; gap: 24px; padding: 8px 0; }
    .split-number { font-size: 32px; font-weight: 800; color: #333; }
    .split-label { font-size: 12px; color: #999; text-transform: uppercase; }
    .split-divider { width: 1px; height: 50px; background: #e0e0e0; }
  `]
})
export class AdminDashboardComponent implements OnInit {
    stats: DashboardStats | null = null;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getDashboardStats().subscribe({
            next: (data) => this.stats = data
        });
    }
}
