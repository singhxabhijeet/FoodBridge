import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/models';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1><i class="fas fa-users-cog"></i> User Management</h1>
        <p>Review registrations and manage user access</p>
      </div>

      <!-- Pending Users -->
      <div class="section" *ngIf="pendingUsers.length > 0">
        <h2 class="section-subtitle"><i class="fas fa-user-clock"></i> Pending Approval ({{ pendingUsers.length }})</h2>
        <div class="user-cards">
          <div class="user-card fade-in-up" *ngFor="let u of pendingUsers; let i = index" [style.animation-delay]="(i * 0.08) + 's'">
            <div class="user-card-header">
              <div class="user-avatar">{{ u.fullName?.charAt(0) }}</div>
              <div class="user-info">
                <h4>{{ u.fullName }}</h4>
                <span class="badge badge-{{ u.role.toLowerCase() }}">{{ u.role.replace('_', ' ') }}</span>
              </div>
            </div>
            <div class="user-card-body">
              <div class="user-detail"><i class="fas fa-envelope"></i> {{ u.email }}</div>
              <div class="user-detail"><i class="fas fa-phone"></i> {{ u.phone }}</div>
              <div class="user-detail"><i class="fas fa-building"></i> {{ u.organization }}</div>
              <div class="user-detail"><i class="fas fa-id-card"></i> {{ u.aadhaarNumber }}</div>
              <div class="user-detail" *ngIf="u.city"><i class="fas fa-map-marker-alt"></i> {{ u.city }}, {{ u.state }}</div>
              <div class="user-detail purpose" *ngIf="u.purpose"><i class="fas fa-comment"></i> {{ u.purpose }}</div>
            </div>
            <div class="user-card-actions">
              <button class="btn btn-primary btn-sm" (click)="approve(u.id)"><i class="fas fa-check"></i> Approve</button>
              <button class="btn btn-danger btn-sm" *ngIf="isFullAdmin" (click)="confirmDelete(u)"><i class="fas fa-trash"></i> Reject & Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Role Filter -->
      <div class="filter-row" style="margin-top: 32px; display:flex; gap:12px; align-items:center; margin-bottom: 16px">
        <h2 class="section-subtitle" style="margin:0"><i class="fas fa-list"></i> All Users ({{ filteredUsers.length }})</h2>
        <select class="form-control" [(ngModel)]="roleFilter" (ngModelChange)="applyFilter()" name="roleFilter" style="max-width:200px">
          <option value="ALL">All Roles</option>
          <option value="PROVIDER">Providers</option>
          <option value="RECEIVER">Receivers</option>
          <option value="CHECKER">Checkers</option>
          <option value="COMPOST_RECEIVER">Composters</option>
          <option value="SUB_ADMIN">Sub-Admins</option>
        </select>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Organization</th>
              <th>Location</th>
              <th>Status</th>
              <th>No-Shows</th>
              <th style="text-align:center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of filteredUsers">
              <td>
                <div style="font-weight:600">{{ u.fullName }}</div>
                <div style="font-size:12px; color:#888">{{ u.email }}</div>
              </td>
              <td><span class="badge badge-{{ u.role.toLowerCase() }}">{{ u.role.replace('_', ' ') }}</span></td>
              <td>{{ u.organization }}</td>
              <td style="font-size:12px">{{ u.city || '—' }}{{ u.state ? ', ' + u.state : '' }}</td>
              <td>
                <span class="status-dot" [class.active]="u.approved && !u.restricted"
                      [class.restricted]="u.restricted" [class.pending]="!u.approved"></span>
                {{ u.restricted ? 'Restricted' : (u.approved ? 'Active' : 'Pending') }}
              </td>
              <td>{{ u.noShowCount }}</td>
              <td style="text-align:center; position: relative">
                <button class="action-trigger" (click)="toggleMenu(u, $event)">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
                <div class="action-dropdown" *ngIf="u.menuOpen" [style.top]="u.menuPosition === 'below' ? '100%' : 'auto'" [style.bottom]="u.menuPosition === 'above' ? '100%' : 'auto'">
                  <button *ngIf="!u.approved" (click)="approve(u.id); u.menuOpen=false">
                    <i class="fas fa-check" style="color:#2ecc71"></i> Approve
                  </button>
                  <button *ngIf="u.approved && !u.restricted && isFullAdmin" (click)="restrict(u.id); u.menuOpen=false">
                    <i class="fas fa-ban" style="color:#e67e22"></i> Restrict
                  </button>
                  <button *ngIf="u.restricted && isFullAdmin" (click)="unrestrict(u.id); u.menuOpen=false">
                    <i class="fas fa-unlock" style="color:#3498db"></i> Unrestrict
                  </button>
                  <button *ngIf="isFullAdmin && u.approved && u.role !== 'SUB_ADMIN' && u.role !== 'ADMIN'" (click)="promote(u.id); u.menuOpen=false">
                    <i class="fas fa-arrow-up" style="color:#8e44ad"></i> Promote to Sub-Admin
                  </button>
                  <button *ngIf="isFullAdmin && u.role === 'SUB_ADMIN'" (click)="demote(u); u.menuOpen=false">
                    <i class="fas fa-arrow-down" style="color:#e67e22"></i> Demote from Sub-Admin
                  </button>
                  <button *ngIf="isFullAdmin" (click)="confirmDelete(u); u.menuOpen=false" class="danger-item">
                    <i class="fas fa-trash" style="color:#e74c3c"></i> Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-overlay" *ngIf="deleteTarget" (click)="deleteTarget = null">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3><i class="fas fa-exclamation-triangle" style="color:#e74c3c"></i> Delete User</h3>
          <p>Are you sure you want to permanently delete <strong>{{ deleteTarget.fullName }}</strong> ({{ deleteTarget.email }})?</p>
          <p style="color:#e74c3c; font-size:13px">This action cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn btn-secondary btn-sm" (click)="deleteTarget = null">Cancel</button>
            <button class="btn btn-danger btn-sm" (click)="deleteUser()">
              <i class="fas fa-trash"></i> Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .section-subtitle { font-size: 18px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .user-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .user-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden; }
    .user-card-header {
      display: flex; align-items: center; gap: 12px; padding: 16px 20px;
      background: linear-gradient(135deg, #f8f9fa, #e8f5e9); border-bottom: 1px solid #f0f0f0;
    }
    .user-avatar {
      width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #2ecc71, #27ae60);
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 18px; flex-shrink: 0;
    }
    .user-info h4 { font-size: 15px; font-weight: 700; margin-bottom: 2px; }
    .user-card-body { padding: 16px 20px; }
    .user-detail { font-size: 13px; color: #666; margin-bottom: 6px; display: flex; align-items: flex-start; gap: 8px; }
    .user-detail i { color: #aaa; width: 14px; margin-top: 2px; }
    .user-detail.purpose { font-style: italic; }
    .user-card-actions { padding: 12px 20px; border-top: 1px solid #f0f0f0; display: flex; gap: 8px; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
    .status-dot.active { background: #2ecc71; }
    .status-dot.restricted { background: #e74c3c; }
    .status-dot.pending { background: #f39c12; }
    .action-trigger {
      width: 32px; height: 32px; border: none; background: #f5f5f5; border-radius: 8px;
      cursor: pointer; font-size: 14px; color: #666; transition: all 0.2s;
    }
    .action-trigger:hover { background: #e0e0e0; }
    .action-dropdown {
      position: absolute; right: 44px; z-index: 100;
      background: white; border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,0.15);
      min-width: 170px; overflow: hidden; white-space: nowrap;
    }
    .action-dropdown button {
      display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 16px;
      border: none; background: white; font-size: 13px; cursor: pointer; text-align: left;
    }
    .action-dropdown button:hover { background: #f8f9fa; }
    .danger-item:hover { background: #fff5f5 !important; }
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.5); display: flex; align-items: center;
      justify-content: center; z-index: 1000;
    }
    .modal-card {
      background: white; border-radius: 16px; padding: 32px;
      max-width: 440px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .modal-card h3 { margin-bottom: 12px; font-size: 20px; }
    .modal-actions { display: flex; gap: 12px; margin-top: 20px; justify-content: flex-end; }
  `]
})
export class UserManagementComponent implements OnInit {
    allUsers: any[] = [];
    pendingUsers: User[] = [];
    filteredUsers: any[] = [];
    deleteTarget: User | null = null;
    roleFilter = 'ALL';
    isFullAdmin = false;

    constructor(private api: ApiService, private auth: AuthService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.isFullAdmin = this.auth.getRole() === 'ADMIN';

        this.route.queryParams.subscribe(params => {
            if (params['filter'] === 'pending') {
                // Pre-filter to show pending — handled by default pending section
            } else if (params['filter'] === 'restricted') {
                this.roleFilter = 'ALL'; // Will filter restricted after loading
            }
        });

        this.loadUsers();
    }

    loadUsers() {
        this.api.getAllUsers().subscribe({
            next: (data) => {
                this.allUsers = data.map((u: any) => ({ ...u, menuOpen: false }));
                this.applyFilter();
            }
        });
        this.api.getPendingUsers().subscribe({ next: (data) => this.pendingUsers = data });
    }

    applyFilter() {
        let users = this.allUsers.filter((u: any) => u.role !== 'ADMIN');

        // Check for restricted query param
        const qf = this.route.snapshot.queryParams['filter'];
        if (qf === 'restricted') {
            users = users.filter(u => u.restricted);
        }

        if (this.roleFilter !== 'ALL') {
            users = users.filter(u => u.role === this.roleFilter);
        }
        this.filteredUsers = users;
    }

    toggleMenu(user: any, event: MouseEvent) {
        const wasOpen = user.menuOpen;
        this.allUsers.forEach((u: any) => u.menuOpen = false);
        if (!wasOpen) {
            const btn = event.target as HTMLElement;
            const rect = btn.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            user.menuPosition = spaceBelow < 200 ? 'above' : 'below';
            user.menuOpen = true;
        }
    }

    /** Close menu when clicking outside */
    closeMenus = (e: Event) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.action-trigger') && !target.closest('.action-dropdown')) {
            this.allUsers.forEach((u: any) => u.menuOpen = false);
        }
    };

    ngAfterViewInit() {
        document.addEventListener('click', this.closeMenus);
    }

    ngOnDestroy() {
        document.removeEventListener('click', this.closeMenus);
    }

    approve(id: number) { this.api.approveUser(id).subscribe({ next: () => this.loadUsers() }); }
    restrict(id: number) { this.api.restrictUser(id).subscribe({ next: () => this.loadUsers() }); }
    unrestrict(id: number) { this.api.unrestrictUser(id).subscribe({ next: () => this.loadUsers() }); }
    promote(id: number) { this.api.promoteToSubAdmin(id).subscribe({ next: () => this.loadUsers() }); }
    demote(user: any) {
        const role = prompt('Demote to which role? (PROVIDER, RECEIVER, CHECKER, COMPOST_RECEIVER)', 'RECEIVER');
        if (role) {
            this.api.demoteFromSubAdmin(user.id, role.toUpperCase()).subscribe({ next: () => this.loadUsers() });
        }
    }

    confirmDelete(user: User) { this.deleteTarget = user; }
    deleteUser() {
        if (!this.deleteTarget) return;
        this.api.deleteUser(this.deleteTarget.id).subscribe({
            next: () => { this.deleteTarget = null; this.loadUsers(); },
            error: () => { this.deleteTarget = null; }
        });
    }
}
