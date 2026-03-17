import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="auth-page">
      <div class="auth-card fade-in-up" style="max-width: 520px">
        <div class="auth-header">
          <i class="fas fa-user-plus auth-icon"></i>
          <h1>Create Account</h1>
          <p>Join FoodBridge and start making a difference</p>
        </div>

        <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
        <div class="alert alert-danger" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="onRegister()" *ngIf="!successMessage">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" class="form-control" [(ngModel)]="form.fullName" name="fullName" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" class="form-control" [(ngModel)]="form.email" name="email" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Password</label>
              <input type="password" class="form-control" [(ngModel)]="form.password" name="password" required>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" class="form-control" [(ngModel)]="form.phone" name="phone">
            </div>
          </div>

          <div class="form-group">
            <label>Role</label>
            <select class="form-control" [(ngModel)]="form.role" name="role" required>
              <option value="">Select your role</option>
              <option value="PROVIDER">Food Provider (Restaurant, Corporate, etc.)</option>
              <option value="RECEIVER">Food Receiver (NGO, Shelter, etc.)</option>
              <option value="CHECKER">Quality Checker</option>
            </select>
          </div>

          <div class="form-group">
            <label>Organization</label>
            <input type="text" class="form-control" [(ngModel)]="form.organization" name="organization"
                   placeholder="Your organization name">
          </div>

          <div class="form-group">
            <label>Address</label>
            <input type="text" class="form-control" [(ngModel)]="form.address" name="address"
                   placeholder="Your address">
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width:100%" [disabled]="loading">
            <i class="fas fa-user-plus"></i>
            {{ loading ? 'Registering...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
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
      margin-bottom: 8px;
    }
    .auth-header p {
      color: #7f8c8d;
      font-size: 15px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
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
    @media (max-width: 500px) {
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class RegisterComponent {
    form = {
        fullName: '',
        email: '',
        password: '',
        phone: '',
        role: '',
        organization: '',
        address: ''
    };
    error = '';
    successMessage = '';
    loading = false;

    constructor(private auth: AuthService, private router: Router) { }

    onRegister() {
        this.loading = true;
        this.error = '';
        this.successMessage = '';

        this.auth.register(this.form).subscribe({
            next: (res: any) => {
                this.loading = false;
                this.successMessage = res.message || 'Registration successful! Please wait for admin approval.';
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.message || 'Registration failed. Please try again.';
            }
        });
    }
}
