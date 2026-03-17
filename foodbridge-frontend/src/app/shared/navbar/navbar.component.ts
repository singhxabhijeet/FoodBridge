import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <nav class="navbar" [class.scrolled]="scrolled">
      <div class="nav-container">
        <a class="nav-brand" routerLink="/impact">
          <i class="fas fa-leaf"></i>
          <span>FoodBridge</span>
        </a>

        <div class="nav-links" [class.open]="menuOpen">
          <!-- Public Links -->
          <a routerLink="/impact" routerLinkActive="active" class="nav-link">
            <i class="fas fa-chart-line"></i> Impact
          </a>

          <!-- Not logged in -->
          <ng-container *ngIf="!auth.isLoggedIn()">
            <a routerLink="/login" routerLinkActive="active" class="nav-link">
              <i class="fas fa-sign-in-alt"></i> Login
            </a>
            <a routerLink="/register" class="btn btn-primary btn-sm nav-cta">
              <i class="fas fa-user-plus"></i> Register
            </a>
          </ng-container>

          <!-- Provider Links -->
          <ng-container *ngIf="auth.hasRole('PROVIDER')">
            <a routerLink="/provider/dashboard" routerLinkActive="active" class="nav-link">
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
            <a routerLink="/provider/create-listing" routerLinkActive="active" class="nav-link">
              <i class="fas fa-plus-circle"></i> Post Food
            </a>
            <a routerLink="/provider/reports" routerLinkActive="active" class="nav-link">
              <i class="fas fa-file-alt"></i> Reports
            </a>
          </ng-container>

          <!-- Checker Links -->
          <ng-container *ngIf="auth.hasRole('CHECKER')">
            <a routerLink="/checker/review-queue" routerLinkActive="active" class="nav-link">
              <i class="fas fa-clipboard-check"></i> Review Queue
            </a>
          </ng-container>

          <!-- Receiver Links -->
          <ng-container *ngIf="auth.hasRole('RECEIVER')">
            <a routerLink="/receiver/browse" routerLinkActive="active" class="nav-link">
              <i class="fas fa-search"></i> Browse Food
            </a>
            <a routerLink="/receiver/my-claims" routerLinkActive="active" class="nav-link">
              <i class="fas fa-hand-holding-heart"></i> My Claims
            </a>
          </ng-container>

          <!-- Admin Links -->
          <ng-container *ngIf="auth.hasRole('ADMIN')">
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
            <a routerLink="/admin/users" routerLinkActive="active" class="nav-link">
              <i class="fas fa-users"></i> Users
            </a>
            <a routerLink="/admin/listings" routerLinkActive="active" class="nav-link">
              <i class="fas fa-list"></i> Listings
            </a>
          </ng-container>

          <!-- Notification Bell -->
          <div class="notification-bell" *ngIf="auth.isLoggedIn()" (click)="toggleNotifications()">
            <i class="fas fa-bell"></i>
            <span class="badge-count" *ngIf="unreadCount > 0">{{ unreadCount }}</span>

            <div class="notification-dropdown" *ngIf="showNotifications" (click)="$event.stopPropagation()">
              <div class="notification-header">
                <h4>Notifications</h4>
              </div>
              <div class="notification-list">
                <div *ngIf="notifications.length === 0" class="notification-empty">
                  No notifications
                </div>
                <div *ngFor="let n of notifications" class="notification-item" [class.unread]="!n.read"
                     (click)="markAsRead(n)">
                  <p>{{ n.message }}</p>
                  <small>{{ n.createdAt | date:'short' }}</small>
                </div>
              </div>
            </div>
          </div>

          <!-- User Menu -->
          <div class="user-menu" *ngIf="auth.isLoggedIn()">
            <span class="user-name">
              <i class="fas fa-user-circle"></i>
              {{ auth.getFullName() }}
            </span>
            <span class="badge badge-{{ auth.getRole()?.toLowerCase() }}">{{ auth.getRole() }}</span>
            <button class="btn btn-sm btn-outline" (click)="auth.logout()">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        <button class="hamburger" (click)="menuOpen = !menuOpen">
          <i class="fas" [class.fa-bars]="!menuOpen" [class.fa-times]="menuOpen"></i>
        </button>
      </div>
    </nav>
  `,
    styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 70px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      z-index: 999;
      transition: all 0.3s ease;
    }
    .navbar.scrolled {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    .nav-container {
      max-width: 1300px;
      margin: 0 auto;
      padding: 0 24px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 22px;
      font-weight: 800;
      color: #2ecc71;
    }
    .nav-brand i {
      font-size: 26px;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-link {
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #555;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .nav-link:hover, .nav-link.active {
      background: rgba(46, 204, 113, 0.1);
      color: #2ecc71;
    }
    .nav-cta {
      margin-left: 8px;
    }
    .notification-bell {
      position: relative;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 10px;
      transition: all 0.2s;
    }
    .notification-bell:hover {
      background: rgba(46, 204, 113, 0.1);
    }
    .notification-bell i {
      font-size: 18px;
      color: #555;
    }
    .badge-count {
      position: absolute;
      top: 2px;
      right: 4px;
      background: #e74c3c;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
    .notification-dropdown {
      position: absolute;
      top: 45px;
      right: 0;
      width: 340px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      overflow: hidden;
      z-index: 1000;
      animation: slideDown 0.2s ease;
    }
    .notification-header {
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
    }
    .notification-header h4 {
      font-size: 15px;
      font-weight: 700;
    }
    .notification-list {
      max-height: 300px;
      overflow-y: auto;
    }
    .notification-item {
      padding: 14px 20px;
      border-bottom: 1px solid #f8f8f8;
      cursor: pointer;
      transition: background 0.2s;
    }
    .notification-item:hover {
      background: #f8f9fa;
    }
    .notification-item.unread {
      background: #f0faf4;
      border-left: 3px solid #2ecc71;
    }
    .notification-item p {
      font-size: 13px;
      margin-bottom: 4px;
      color: #333;
    }
    .notification-item small {
      font-size: 11px;
      color: #999;
    }
    .notification-empty {
      padding: 30px;
      text-align: center;
      color: #999;
      font-size: 14px;
    }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: 12px;
      padding-left: 12px;
      border-left: 1px solid #eee;
    }
    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .hamburger {
      display: none;
      background: none;
      border: none;
      font-size: 22px;
      cursor: pointer;
      color: #555;
    }
    @media (max-width: 900px) {
      .hamburger { display: block; }
      .nav-links {
        display: none;
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }
      .nav-links.open { display: flex; }
      .user-menu {
        border-left: none;
        padding-left: 0;
        margin-left: 0;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #eee;
      }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class NavbarComponent implements OnInit {
    scrolled = false;
    menuOpen = false;
    showNotifications = false;
    notifications: any[] = [];
    unreadCount = 0;

    constructor(public auth: AuthService, private api: ApiService) { }

    ngOnInit() {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', () => {
                this.scrolled = window.scrollY > 10;
            });
        }

        if (this.auth.isLoggedIn()) {
            this.loadNotifications();
            // Poll every 30 seconds
            setInterval(() => {
                if (this.auth.isLoggedIn()) this.loadNotifications();
            }, 30000);
        }
    }

    loadNotifications() {
        this.api.getNotifications().subscribe({
            next: (res: any) => {
                this.notifications = res.notifications || [];
                this.unreadCount = res.unreadCount || 0;
            },
            error: () => { }
        });
    }

    toggleNotifications() {
        this.showNotifications = !this.showNotifications;
    }

    markAsRead(notification: any) {
        if (!notification.read) {
            this.api.markNotificationRead(notification.id).subscribe(() => {
                notification.read = true;
                this.unreadCount = Math.max(0, this.unreadCount - 1);
            });
        }
    }
}
