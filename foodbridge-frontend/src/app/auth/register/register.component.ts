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
      <div class="auth-card fade-in-up" style="max-width: 580px">
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
              <label>Full Name *</label>
              <input type="text" class="form-control" [(ngModel)]="form.fullName" name="fullName" required
                     placeholder="e.g., Ravi Kumar">
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" class="form-control" [(ngModel)]="form.email" name="email" required
                     placeholder="e.g., ravi.kumar&#64;gmail.com">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Password *</label>
              <input type="password" class="form-control" [(ngModel)]="form.password" name="password" required
                     placeholder="Min 6 characters">
            </div>
            <div class="form-group">
              <label>Phone *</label>
              <input type="tel" class="form-control" [(ngModel)]="form.phone" name="phone" required
                     placeholder="e.g., 9876543210">
            </div>
          </div>

          <div class="form-group">
            <label>Role *</label>
            <select class="form-control" [(ngModel)]="form.role" name="role" required>
              <option value="">Select your role</option>
              <option value="PROVIDER">Food Provider (Restaurant, Corporate, etc.)</option>
              <option value="RECEIVER">Food Receiver (NGO, Shelter, etc.)</option>
              <option value="COMPOST_RECEIVER">Compost Receiver (Composting, Animal Feed)</option>
              <option value="CHECKER">Quality Checker</option>
            </select>
          </div>

          <div class="form-group">
            <label>Organization Type *</label>
            <select class="form-control" [(ngModel)]="form.organizationType" name="organizationType" required>
              <option value="">Select organization type</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Hotel">Hotel</option>
              <option value="Corporate Office">Corporate Office</option>
              <option value="University/College">University / College</option>
              <option value="Catering Service">Catering Service</option>
              <option value="NGO/Shelter">NGO / Shelter</option>
              <option value="Community Kitchen">Community Kitchen</option>
              <option value="Composting Facility">Composting Facility</option>
              <option value="Animal Shelter">Animal Shelter</option>
              <option value="Other">Other (please specify)</option>
            </select>
          </div>

          <div class="form-group" *ngIf="form.organizationType === 'Other'">
            <label>Custom Organization Name *</label>
            <input type="text" class="form-control" [(ngModel)]="form.customOrganization" name="customOrganization"
                   placeholder="e.g., Sunrise Welfare Trust">
          </div>

          <div class="form-group">
            <label>Aadhaar Number *</label>
            <input type="text" class="form-control" [(ngModel)]="form.aadhaarNumber" name="aadhaarNumber" required
                   placeholder="e.g., 1234 5678 9012" maxlength="14">
            <small class="form-hint">Your 12-digit government ID for verification</small>
          </div>

          <div class="form-group">
            <label>Address *</label>
            <input type="text" class="form-control" [(ngModel)]="form.address" name="address" required
                   placeholder="e.g., 42, MG Road, Bangalore 560001">
          </div>

          <div class="form-group">
            <label>Purpose / Reason for Joining *</label>
            <textarea class="form-control" [(ngModel)]="form.purpose" name="purpose" required rows="3"
                      placeholder="e.g., Our NGO distributes food to slums in Mumbai. We serve 200+ people daily."></textarea>
            <small class="form-hint">Help the admin understand why you want to join. Be specific.</small>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width:100%"
                  [disabled]="!isFormValid() || loading"
                  [class.btn-disabled]="!isFormValid()">
            <i class="fas fa-user-plus"></i>
            {{ loading ? 'Registering...' : 'Create Account' }}
          </button>

          <p class="form-note" *ngIf="!isFormValid()">
            <i class="fas fa-info-circle"></i> Please fill all required fields to enable registration.
          </p>
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
    .form-hint {
      color: #999;
      font-size: 11px;
      margin-top: 4px;
      display: block;
    }
    .form-note {
      text-align: center;
      color: #e67e22;
      font-size: 13px;
      margin-top: 12px;
    }
    .btn-disabled {
      opacity: 0.5;
      cursor: not-allowed !important;
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
        organizationType: '',
        customOrganization: '',
        aadhaarNumber: '',
        address: '',
        purpose: ''
    };
    error = '';
    successMessage = '';
    loading = false;

    constructor(private auth: AuthService, private router: Router) { }

    isFormValid(): boolean {
        const f = this.form;
        const orgValid = f.organizationType !== '' &&
            (f.organizationType !== 'Other' || f.customOrganization.trim() !== '');
        return f.fullName.trim() !== '' &&
            f.email.trim() !== '' &&
            f.password.trim().length >= 6 &&
            f.phone.trim() !== '' &&
            f.role !== '' &&
            orgValid &&
            f.aadhaarNumber.trim() !== '' &&
            f.address.trim() !== '' &&
            f.purpose.trim() !== '';
    }

    onRegister() {
        this.loading = true;
        this.error = '';
        this.successMessage = '';

        const organization = this.form.organizationType === 'Other'
            ? this.form.customOrganization
            : this.form.organizationType;

        const payload = {
            fullName: this.form.fullName,
            email: this.form.email,
            password: this.form.password,
            phone: this.form.phone,
            role: this.form.role,
            organization: organization,
            address: this.form.address,
            aadhaarNumber: this.form.aadhaarNumber,
            purpose: this.form.purpose
        };

        this.auth.register(payload).subscribe({
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
