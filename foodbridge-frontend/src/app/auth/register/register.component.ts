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
                     placeholder="e.g., Ravi Kumar" maxlength="50"
                     [class.field-valid]="touched.fullName && isFieldValid('fullName')"
                     [class.field-invalid]="touched.fullName && !isFieldValid('fullName')"
                     (blur)="touched.fullName = true">
              <small class="field-error" *ngIf="touched.fullName && !isFieldValid('fullName')">{{ getError('fullName') }}</small>
              <small class="char-count" *ngIf="form.fullName.length > 0">{{ form.fullName.length }}/50</small>
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" class="form-control" [(ngModel)]="form.email" name="email"
                     placeholder="e.g., ravi.kumar&#64;gmail.com" maxlength="100"
                     [class.field-valid]="touched.email && isFieldValid('email')"
                     [class.field-invalid]="touched.email && !isFieldValid('email')"
                     (blur)="touched.email = true">
              <small class="field-error" *ngIf="touched.email && !isFieldValid('email')">{{ getError('email') }}</small>
            </div>
          </div>

          <!-- Password & Phone -->
          <div class="form-row">
            <div class="form-group">
              <label>Password *</label>
              <input type="password" class="form-control" [(ngModel)]="form.password" name="password"
                     placeholder="Create a strong password"
                     [class.field-valid]="touched.password && isFieldValid('password')"
                     [class.field-invalid]="touched.password && !isFieldValid('password')"
                     (blur)="touched.password = true">
              <small class="form-hint">Min 8 chars, 1 uppercase, 1 digit, 1 special char (!&#64;#$%^&*)</small>
              <small class="field-error" *ngIf="touched.password && !isFieldValid('password')">Password does not meet the requirements above</small>
            </div>
            <div class="form-group">
              <label>Phone *</label>
              <input type="tel" class="form-control" [(ngModel)]="form.phone" name="phone"
                     placeholder="e.g., 9876543210" maxlength="10"
                     [class.field-valid]="touched.phone && isFieldValid('phone')"
                     [class.field-invalid]="touched.phone && !isFieldValid('phone')"
                     (blur)="touched.phone = true">
              <small class="field-error" *ngIf="touched.phone && !isFieldValid('phone')">{{ getError('phone') }}</small>
            </div>
          </div>

          <!-- Role -->
          <div class="form-group">
            <label>Role *</label>
            <select class="form-control" [(ngModel)]="form.role" name="role"
                    [class.field-valid]="touched.role && isFieldValid('role')"
                    [class.field-invalid]="touched.role && !isFieldValid('role')"
                    (blur)="touched.role = true" (ngModelChange)="onRoleChange()">
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
                    [disabled]="!form.role"
                    [class.field-valid]="touched.organization && isFieldValid('organization')"
                    [class.field-invalid]="touched.organization && !isFieldValid('organization')"
                    (blur)="touched.organization = true">
              <option value="">{{ form.role ? 'Select organization type' : 'Choose a role first' }}</option>
              <option *ngFor="let opt of orgOptions" [value]="opt">{{ opt }}</option>
              <option value="Other">Other (please specify)</option>
            </select>
          </div>
          <div class="form-group" *ngIf="form.organizationType === 'Other'">
            <label>Custom Organization Name *</label>
            <input type="text" class="form-control" [(ngModel)]="form.customOrganization" name="customOrganization"
                   placeholder="e.g., Sunrise Welfare Trust" maxlength="100">
          </div>

          <!-- Aadhaar -->
          <div class="form-group">
            <label>Aadhaar Number *</label>
            <input type="text" class="form-control" [(ngModel)]="form.aadhaarNumber" name="aadhaarNumber"
                   placeholder="e.g., 234567891234" maxlength="12"
                   [class.field-valid]="touched.aadhaar && isFieldValid('aadhaar')"
                   [class.field-invalid]="touched.aadhaar && !isFieldValid('aadhaar')"
                   (blur)="touched.aadhaar = true">
            <small class="field-error" *ngIf="touched.aadhaar && !isFieldValid('aadhaar')">{{ getError('aadhaar') }}</small>
          </div>

          <!-- Address Fields (Manual) -->
          <div class="form-row" style="grid-template-columns: 1fr 1fr 1fr">
            <div class="form-group">
              <label>Pincode *</label>
              <input type="text" class="form-control" [(ngModel)]="form.pincode" name="pincode"
                     placeholder="e.g., 560001" maxlength="6"
                     [class.field-valid]="touched.pincode && isFieldValid('pincode')"
                     [class.field-invalid]="touched.pincode && !isFieldValid('pincode')"
                     (blur)="touched.pincode = true">
              <small class="field-error" *ngIf="touched.pincode && !isFieldValid('pincode')">6-digit pincode required</small>
            </div>
            <div class="form-group">
              <label>City *</label>
              <input type="text" class="form-control" [(ngModel)]="form.city" name="city"
                     placeholder="e.g., Bangalore" maxlength="50">
            </div>
            <div class="form-group">
              <label>State *</label>
              <input type="text" class="form-control" [(ngModel)]="form.state" name="state"
                     placeholder="e.g., Karnataka" maxlength="50">
            </div>
          </div>

          <!-- Street Address -->
          <div class="form-group">
            <label>Street Address *</label>
            <input type="text" class="form-control" [(ngModel)]="form.address" name="address"
                   placeholder="e.g., 42, MG Road, Near Central Mall" maxlength="200"
                   [class.field-valid]="touched.address && isFieldValid('address')"
                   [class.field-invalid]="touched.address && !isFieldValid('address')"
                   (blur)="touched.address = true">
          </div>

          <!-- Purpose -->
          <div class="form-group">
            <label>Purpose / Reason for Joining *</label>
            <textarea class="form-control" [(ngModel)]="form.purpose" name="purpose" rows="3"
                      placeholder="e.g., Our NGO distributes food to slums in Mumbai. We serve 200+ people daily."
                      maxlength="500"
                      [class.field-valid]="touched.purpose && isFieldValid('purpose')"
                      [class.field-invalid]="touched.purpose && !isFieldValid('purpose')"
                      (blur)="touched.purpose = true"></textarea>
            <small class="char-count">{{ form.purpose.length }}/500</small>
          </div>

          <button type="submit" class="btn btn-success btn-lg" style="width:100%"
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
      min-height: calc(100vh - 70px); display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 50%, #f0f9ff 100%); padding: 40px 20px;
    }
    .auth-card { background: white; border-radius: 24px; padding: 48px 40px; width: 100%; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08); }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-icon { font-size: 42px; color: #2ecc71; margin-bottom: 16px; }
    .auth-header h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    .auth-header p { color: #7f8c8d; font-size: 15px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field-valid { border-color: #2ecc71 !important; box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.15) !important; }
    .field-invalid { border-color: #e74c3c !important; box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.15) !important; }
    .field-error { color: #e74c3c; font-size: 11px; margin-top: 4px; display: block; }
    .form-hint { color: #999; font-size: 11px; margin-top: 4px; display: block; }
    .char-count { color: #bbb; font-size: 11px; text-align: right; display: block; margin-top: 2px; }
    .form-note { text-align: center; color: #e67e22; font-size: 13px; margin-top: 12px; }
    .btn-disabled { opacity: 0.5; cursor: not-allowed !important; }
    .btn-success { background: linear-gradient(135deg, #2ecc71, #27ae60); color: white; border: none; }
    .btn-success:hover { background: linear-gradient(135deg, #27ae60, #219a52); }
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
    orgOptions: string[] = [];

    constructor(private auth: AuthService, private router: Router) { }

    onRoleChange() {
        this.form.organizationType = '';
        switch (this.form.role) {
            case 'PROVIDER':
                this.orgOptions = ['Restaurant', 'Hotel', 'Corporate Office', 'University/College', 'Catering Service'];
                break;
            case 'RECEIVER':
                this.orgOptions = ['NGO/Shelter', 'Community Kitchen'];
                break;
            case 'COMPOST_RECEIVER':
                this.orgOptions = ['Composting Facility', 'Animal Shelter'];
                break;
            case 'CHECKER':
                this.orgOptions = ['Government/Health Agency', 'Independent'];
                break;
            default:
                this.orgOptions = [];
        }
    }

    getError(field: string): string {
        switch (field) {
            case 'fullName':
                if (!this.form.fullName.trim()) return 'Name cannot be blank';
                return 'Only letters and spaces are allowed';
            case 'email':
                if (!this.form.email.trim()) return 'Email cannot be blank';
                return 'Enter a valid email address';
            case 'phone':
                if (!this.form.phone) return 'Phone number cannot be blank';
                if (this.form.phone.length > 0 && /^[0-5]/.test(this.form.phone)) return 'Phone number must start with 6-9';
                return 'Phone number must be exactly 10 digits';
            case 'aadhaar':
                if (!this.form.aadhaarNumber) return 'Aadhaar number cannot be blank';
                if (this.form.aadhaarNumber.length !== 12) return 'Aadhaar number must be exactly 12 digits';
                if (/^(\d)\1{11}$/.test(this.form.aadhaarNumber)) return 'Aadhaar number cannot be all same digits';
                if (/^(0|1)\d{11}$/.test(this.form.aadhaarNumber)) return 'Aadhaar number cannot start with 0 or 1';
                return 'Enter a valid 12-digit Aadhaar number';
            default: return '';
        }
    }

    isFieldValid(field: string): boolean {
        switch (field) {
            case 'fullName': return /^[A-Za-z\s]{2,50}$/.test(this.form.fullName.trim());
            case 'email': {
                const e = this.form.email;
                return /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/.test(e)
                    && !/\.\./.test(e) && e.length <= 100;
            }
            case 'password': return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{8,}$/.test(this.form.password);
            case 'phone': return /^[6-9]\d{9}$/.test(this.form.phone);
            case 'role': return this.form.role !== '';
            case 'organization': return this.form.organizationType !== '' &&
                (this.form.organizationType !== 'Other' || this.form.customOrganization.trim() !== '');
            case 'aadhaar': {
                const a = this.form.aadhaarNumber;
                return /^\d{12}$/.test(a) && !/^(\d)\1{11}$/.test(a) && !/^(0|1)/.test(a);
            }
            case 'address': return this.form.address.trim().length > 0;
            case 'pincode': return /^\d{6}$/.test(this.form.pincode);
            case 'purpose': return this.form.purpose.trim().length > 0;
            default: return true;
        }
    }

    isFormValid(): boolean {
        return ['fullName', 'email', 'password', 'phone', 'role', 'organization', 'aadhaar', 'address', 'pincode', 'purpose']
            .every(f => this.isFieldValid(f))
            && this.form.city.trim().length > 0
            && this.form.state.trim().length > 0;
    }

    onRegister() {
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
