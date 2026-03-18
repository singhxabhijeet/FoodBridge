import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="auth-page">
      <div class="auth-card fade-in-up" style="max-width: 620px">
        <div class="auth-header">
          <i class="fas fa-user-plus auth-icon"></i>
          <h1>Create Account</h1>
          <p>Join FoodBridge and start making a difference</p>
        </div>

        <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
        <div class="alert alert-danger" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="onRegister()" *ngIf="!successMessage">
          <!-- Full Name & Email -->
          <div class="form-row">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" class="form-control" [(ngModel)]="form.fullName" name="fullName"
                     placeholder="e.g., Ravi Kumar"
                     [class.field-valid]="touched.fullName && isFieldValid('fullName')"
                     [class.field-invalid]="touched.fullName && !isFieldValid('fullName')"
                     (blur)="touched.fullName = true">
              <small class="field-error" *ngIf="touched.fullName && !isFieldValid('fullName')">Name is required</small>
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" class="form-control" [(ngModel)]="form.email" name="email"
                     placeholder="e.g., ravi.kumar&#64;gmail.com"
                     [class.field-valid]="touched.email && isFieldValid('email')"
                     [class.field-invalid]="touched.email && !isFieldValid('email')"
                     (blur)="touched.email = true">
              <small class="field-error" *ngIf="touched.email && !isFieldValid('email')">Enter a valid email address</small>
            </div>
          </div>

          <!-- Password & Phone -->
          <div class="form-row">
            <div class="form-group">
              <label>Password *</label>
              <input type="password" class="form-control" [(ngModel)]="form.password" name="password"
                     placeholder="Min 8 chars, 1 uppercase, 1 digit, 1 special"
                     [class.field-valid]="touched.password && isFieldValid('password')"
                     [class.field-invalid]="touched.password && !isFieldValid('password')"
                     (blur)="touched.password = true">
              <small class="field-error" *ngIf="touched.password && !isFieldValid('password')">Min 8 chars, 1 uppercase, 1 digit, 1 special char (!&#64;#$%^&*)</small>
            </div>
            <div class="form-group">
              <label>Phone *</label>
              <input type="tel" class="form-control" [(ngModel)]="form.phone" name="phone"
                     placeholder="e.g., 9876543210" maxlength="10"
                     [class.field-valid]="touched.phone && isFieldValid('phone')"
                     [class.field-invalid]="touched.phone && !isFieldValid('phone')"
                     (blur)="touched.phone = true">
              <small class="field-error" *ngIf="touched.phone && !isFieldValid('phone')">Must be exactly 10 digits</small>
            </div>
          </div>

          <!-- Role -->
          <div class="form-group">
            <label>Role *</label>
            <select class="form-control" [(ngModel)]="form.role" name="role"
                    [class.field-valid]="touched.role && isFieldValid('role')"
                    [class.field-invalid]="touched.role && !isFieldValid('role')"
                    (blur)="touched.role = true">
              <option value="">Select your role</option>
              <option value="PROVIDER">Food Provider (Restaurant, Corporate, etc.)</option>
              <option value="RECEIVER">Food Receiver (NGO, Shelter, etc.)</option>
              <option value="COMPOST_RECEIVER">Compost Receiver (Composting, Animal Feed)</option>
              <option value="CHECKER">Quality Checker</option>
            </select>
          </div>

          <!-- Organization -->
          <div class="form-group">
            <label>Organization Type *</label>
            <select class="form-control" [(ngModel)]="form.organizationType" name="organizationType"
                    [class.field-valid]="touched.organization && isFieldValid('organization')"
                    [class.field-invalid]="touched.organization && !isFieldValid('organization')"
                    (blur)="touched.organization = true">
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

          <!-- Aadhaar -->
          <div class="form-group">
            <label>Aadhaar Number *</label>
            <input type="text" class="form-control" [(ngModel)]="form.aadhaarNumber" name="aadhaarNumber"
                   placeholder="e.g., 123456789012" maxlength="12"
                   [class.field-valid]="touched.aadhaar && isFieldValid('aadhaar')"
                   [class.field-invalid]="touched.aadhaar && !isFieldValid('aadhaar')"
                   (blur)="touched.aadhaar = true">
            <small class="field-error" *ngIf="touched.aadhaar && !isFieldValid('aadhaar')">Must be exactly 12 digits</small>
          </div>

          <!-- Pincode + City/State auto-fill -->
          <div class="form-row" style="grid-template-columns: 1fr 1fr 1fr">
            <div class="form-group">
              <label>Pincode *</label>
              <input type="text" class="form-control" [(ngModel)]="form.pincode" name="pincode"
                     placeholder="e.g., 560001" maxlength="6"
                     [class.field-valid]="touched.pincode && isFieldValid('pincode')"
                     [class.field-invalid]="touched.pincode && !isFieldValid('pincode')"
                     (blur)="touched.pincode = true"
                     (ngModelChange)="onPincodeChange($event)">
              <small class="field-error" *ngIf="touched.pincode && !isFieldValid('pincode')">6-digit pincode required</small>
              <small class="form-hint" *ngIf="pincodeLoading">Fetching location...</small>
            </div>
            <div class="form-group">
              <label>City</label>
              <input type="text" class="form-control" [(ngModel)]="form.city" name="city" readonly
                     placeholder="Auto-filled" style="background:#f5f5f5">
            </div>
            <div class="form-group">
              <label>State</label>
              <input type="text" class="form-control" [(ngModel)]="form.state" name="state" readonly
                     placeholder="Auto-filled" style="background:#f5f5f5">
            </div>
          </div>

          <!-- Street Address -->
          <div class="form-group">
            <label>Street Address *</label>
            <input type="text" class="form-control" [(ngModel)]="form.address" name="address"
                   placeholder="e.g., 42, MG Road, Near Central Mall"
                   [class.field-valid]="touched.address && isFieldValid('address')"
                   [class.field-invalid]="touched.address && !isFieldValid('address')"
                   (blur)="touched.address = true">
          </div>

          <!-- Purpose -->
          <div class="form-group">
            <label>Purpose / Reason for Joining *</label>
            <textarea class="form-control" [(ngModel)]="form.purpose" name="purpose" rows="3"
                      placeholder="e.g., Our NGO distributes food to slums in Mumbai. We serve 200+ people daily."
                      [class.field-valid]="touched.purpose && isFieldValid('purpose')"
                      [class.field-invalid]="touched.purpose && !isFieldValid('purpose')"
                      (blur)="touched.purpose = true"></textarea>
            <small class="form-hint">Help the admin understand why you want to join.</small>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width:100%"
                  [disabled]="!isFormValid() || loading"
                  [class.btn-disabled]="!isFormValid()">
            <i class="fas fa-user-plus"></i>
            {{ loading ? 'Registering...' : 'Create Account' }}
          </button>

          <p class="form-note" *ngIf="!isFormValid()">
            <i class="fas fa-info-circle"></i> Please fill all required fields correctly to enable registration.
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
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 50%, #f0f9ff 100%);
      padding: 40px 20px;
    }
    .auth-card {
      background: white; border-radius: 24px; padding: 48px 40px;
      width: 100%; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
    }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-icon { font-size: 42px; color: #2ecc71; margin-bottom: 16px; }
    .auth-header h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    .auth-header p { color: #7f8c8d; font-size: 15px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    /* Validation border visuals */
    .field-valid { border-color: #2ecc71 !important; box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.15) !important; }
    .field-invalid { border-color: #e74c3c !important; box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.15) !important; }
    .field-error { color: #e74c3c; font-size: 11px; margin-top: 4px; display: block; }
    .form-hint { color: #999; font-size: 11px; margin-top: 4px; display: block; }

    .form-note { text-align: center; color: #e67e22; font-size: 13px; margin-top: 12px; }
    .btn-disabled { opacity: 0.5; cursor: not-allowed !important; }
    .auth-footer { text-align: center; margin-top: 24px; font-size: 14px; color: #7f8c8d; }
    .auth-footer a { color: #2ecc71; font-weight: 600; }
    @media (max-width: 500px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class RegisterComponent {
    form = {
        fullName: '', email: '', password: '', phone: '', role: '',
        organizationType: '', customOrganization: '',
        aadhaarNumber: '', address: '', pincode: '', city: '', state: '', purpose: ''
    };

    touched: any = {
        fullName: false, email: false, password: false, phone: false, role: false,
        organization: false, aadhaar: false, address: false, pincode: false, purpose: false
    };

    error = '';
    successMessage = '';
    loading = false;
    pincodeLoading = false;

    constructor(private auth: AuthService, private router: Router, private http: HttpClient) { }

    isFieldValid(field: string): boolean {
        switch (field) {
            case 'fullName': return this.form.fullName.trim().length > 0;
            case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email);
            case 'password': return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{8,}$/.test(this.form.password);
            case 'phone': return /^\d{10}$/.test(this.form.phone);
            case 'role': return this.form.role !== '';
            case 'organization': return this.form.organizationType !== '' &&
                (this.form.organizationType !== 'Other' || this.form.customOrganization.trim() !== '');
            case 'aadhaar': return /^\d{12}$/.test(this.form.aadhaarNumber);
            case 'address': return this.form.address.trim().length > 0;
            case 'pincode': return /^\d{6}$/.test(this.form.pincode);
            case 'purpose': return this.form.purpose.trim().length > 0;
            default: return true;
        }
    }

    isFormValid(): boolean {
        return ['fullName', 'email', 'password', 'phone', 'role', 'organization', 'aadhaar', 'address', 'pincode', 'purpose']
            .every(f => this.isFieldValid(f));
    }

    onPincodeChange(value: string) {
        if (/^\d{6}$/.test(value)) {
            this.pincodeLoading = true;
            this.http.get<any>(`https://api.postalpincode.in/pincode/${value}`).subscribe({
                next: (res) => {
                    this.pincodeLoading = false;
                    if (res && res[0] && res[0].Status === 'Success' && res[0].PostOffice?.length > 0) {
                        const po = res[0].PostOffice[0];
                        this.form.city = po.District || po.Name;
                        this.form.state = po.State;
                    } else {
                        this.form.city = '';
                        this.form.state = '';
                    }
                },
                error: () => {
                    this.pincodeLoading = false;
                    this.form.city = '';
                    this.form.state = '';
                }
            });
        } else {
            this.form.city = '';
            this.form.state = '';
        }
    }

    onRegister() {
        // Mark all as touched
        Object.keys(this.touched).forEach(k => this.touched[k] = true);
        if (!this.isFormValid()) return;

        this.loading = true;
        this.error = '';
        this.successMessage = '';

        const organization = this.form.organizationType === 'Other'
            ? this.form.customOrganization : this.form.organizationType;

        const payload = {
            fullName: this.form.fullName, email: this.form.email,
            password: this.form.password, phone: this.form.phone,
            role: this.form.role, organization: organization,
            address: this.form.address, pincode: this.form.pincode,
            city: this.form.city, state: this.form.state,
            aadhaarNumber: this.form.aadhaarNumber, purpose: this.form.purpose
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
