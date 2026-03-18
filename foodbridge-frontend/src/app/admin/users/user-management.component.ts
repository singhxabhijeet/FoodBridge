import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../core/models/models';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1><i class="fas fa-users-cog"></i> User Management</h1>
        <p>Review registrations and manage user access</p>
      </div>

      <!-- Pending Users -->
      <div class="section" *ngIf="pendingUsers.length > 0">
        <h2 class="section-subtitle"><i class="fas fa-user-clock"></i> Pending Approval ({{ pendingUsers.length }})</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Organization</th>
                <th>Aadhaar</th>
                <th>Purpose</th>
                <th>Location</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of pendingUsers">
                <td><strong>{{ u.fullName }}</strong></td>
                <td>{{ u.email }}</td>
                <td><span class="badge badge-{{ u.role.toLowerCase() }}">{{ u.role }}</span></td>
                <td>{{ u.organization }}</td>
                <td>{{ u.aadhaarNumber }}</td>
                <td style="max-width:200px; font-size:12px">{{ u.purpose }}</td>
                <td style="font-size:12px">{{ u.city }}, {{ u.state }}</td>
                <td>{{ u.createdAt | date:'mediumDate' }}</td>
                <td>
                  <button class="btn btn-primary btn-sm" (click)="approve(u.id)">
                    <i class="fas fa-check"></i> Approve
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- All Users -->
      <h2 class="section-subtitle" style="margin-top: 32px"><i class="fas fa-list"></i> All Users ({{ allUsers.length }})</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Organization</th>
              <th>Location</th>
              <th>Status</th>
              <th>No-Shows</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of allUsers">
              <td><strong>{{ u.fullName }}</strong></td>
              <td>{{ u.email }}</td>
              <td>{{ u.phone }}</td>
              <td><span class="badge badge-{{ u.role.toLowerCase() }}">{{ u.role }}</span></td>
              <td>{{ u.organization }}</td>
              <td style="font-size:12px">{{ u.city || '—' }}, {{ u.state || '—' }}</td>
              <td>
                <span class="badge" [class.badge-approved]="u.approved && !u.restricted"
                      [class.badge-rejected]="u.restricted"
                      [class.badge-under-review]="!u.approved">
                  {{ u.restricted ? 'Restricted' : (u.approved ? 'Active' : 'Pending') }}
                </span>
              </td>
              <td>{{ u.noShowCount }}</td>
              <td class="action-cell">
                <button *ngIf="!u.approved" class="btn btn-primary btn-sm" (click)="approve(u.id)">Approve</button>
                <button *ngIf="u.approved && !u.restricted" class="btn btn-danger btn-sm" (click)="restrict(u.id)">Restrict</button>
                <button *ngIf="u.restricted" class="btn btn-secondary btn-sm" (click)="unrestrict(u.id)">Unrestrict</button>
                <button class="btn btn-sm btn-delete" (click)="confirmDelete(u)" title="Delete user">
                  <i class="fas fa-trash"></i>
                </button>
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
    .action-cell { display: flex; gap: 6px; flex-wrap: wrap; }
    .btn-delete { background: transparent; color: #e74c3c; border: 1px solid #e74c3c; }
    .btn-delete:hover { background: #e74c3c; color: white; }
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
    allUsers: User[] = [];
    pendingUsers: User[] = [];
    deleteTarget: User | null = null;

    constructor(private api: ApiService) { }

    ngOnInit() { this.loadUsers(); }

    loadUsers() {
        this.api.getAllUsers().subscribe({ next: (data) => this.allUsers = data });
        this.api.getPendingUsers().subscribe({ next: (data) => this.pendingUsers = data });
    }

    approve(id: number) {
        this.api.approveUser(id).subscribe({ next: () => this.loadUsers() });
    }

    restrict(id: number) {
        this.api.restrictUser(id).subscribe({ next: () => this.loadUsers() });
    }

    unrestrict(id: number) {
        this.api.unrestrictUser(id).subscribe({ next: () => this.loadUsers() });
    }

    confirmDelete(user: User) {
        this.deleteTarget = user;
    }

    deleteUser() {
        if (!this.deleteTarget) return;
        this.api.deleteUser(this.deleteTarget.id).subscribe({
            next: () => {
                this.deleteTarget = null;
                this.loadUsers();
            },
            error: () => { this.deleteTarget = null; }
        });
    }
}
