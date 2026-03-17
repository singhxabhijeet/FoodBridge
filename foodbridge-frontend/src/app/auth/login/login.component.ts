import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="auth-page">
      <div class="auth-card fade-in-up">
        <div class="auth-header">
          <i class="fas fa-leaf auth-icon"></i>
          <h1>Welcome Back</h1>
          <p>Sign in to your FoodBridge account</p>
        </div>

        <div class="alert alert-danger" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label><i class="fas fa-envelope"></i> Email</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email"
                   placeholder="your@email.com" required>
          </div>

          <div class="form-group">
            <label><i class="fas fa-lock"></i> Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password"
                   placeholder="Enter your password" required>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width:100%" [disabled]="loading">
            <i class="fas fa-sign-in-alt"></i>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Register here</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-page {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 50%, #f0f9ff 100%);
      padding: 40px 20px;
    }
    .auth-card {
      background: white;
      border-radius: 24px;
      padding: 48px 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .auth-icon {
      font-size: 42px;
      color: #2ecc71;
      margin-bottom: 16px;
    }
    .auth-header h1 {
      font-size: 28px;
      font-weight: 800;
      color: #1a1a2e;
      margin-bottom: 8px;
    }
    .auth-header p {
      color: #7f8c8d;
      font-size: 15px;
    }
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: #7f8c8d;
    }
    .auth-footer a {
      color: #2ecc71;
      font-weight: 600;
    }
    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
    email = '';
    password = '';
    error = '';
    loading = false;

    constructor(private auth: AuthService, private router: Router) { }

    onLogin() {
        this.loading = true;
        this.error = '';

        this.auth.login(this.email, this.password).subscribe({
            next: (res) => {
                this.loading = false;
                // Navigate based on role
                switch (res.role) {
                    case 'PROVIDER': this.router.navigate(['/provider/dashboard']); break;
                    case 'RECEIVER': this.router.navigate(['/receiver/browse']); break;
                    case 'COMPOST_RECEIVER': this.router.navigate(['/receiver/browse']); break;
                    case 'CHECKER': this.router.navigate(['/checker/review-queue']); break;
                    case 'ADMIN': this.router.navigate(['/admin/dashboard']); break;
                    default: this.router.navigate(['/impact']);
                }
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.message || 'Login failed. Please check your credentials.';
            }
        });
    }
}
