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
              <th>Role</th>
              <th>Status</th>
              <th>No-Shows</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of allUsers">
              <td><strong>{{ u.fullName }}</strong></td>
              <td>{{ u.email }}</td>
              <td><span class="badge badge-{{ u.role.toLowerCase() }}">{{ u.role }}</span></td>
              <td>
                <span class="badge" [class.badge-approved]="u.approved && !u.restricted"
                      [class.badge-rejected]="u.restricted"
                      [class.badge-under-review]="!u.approved">
                  {{ u.restricted ? 'Restricted' : (u.approved ? 'Active' : 'Pending') }}
                </span>
              </td>
              <td>{{ u.noShowCount }}</td>
              <td>
                <button *ngIf="!u.approved" class="btn btn-primary btn-sm" (click)="approve(u.id)">Approve</button>
                <button *ngIf="u.approved && !u.restricted" class="btn btn-danger btn-sm" (click)="restrict(u.id)">Restrict</button>
                <button *ngIf="u.restricted" class="btn btn-secondary btn-sm" (click)="unrestrict(u.id)">Unrestrict</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
    styles: [`
    .section-subtitle { font-size: 18px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  `]
})
export class UserManagementComponent implements OnInit {
    allUsers: User[] = [];
    pendingUsers: User[] = [];

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadUsers();
    }

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
}
