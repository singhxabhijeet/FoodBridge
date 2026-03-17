import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1><i class="fas fa-plus-circle"></i> Post Food Listing</h1>
        <p>Share surplus food with those in need</p>
      </div>

      <div class="form-card card">
        <div class="alert alert-success" *ngIf="success">{{ success }}</div>
        <div class="alert alert-danger" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label>Food Name *</label>
              <input type="text" class="form-control" [(ngModel)]="form.foodName" name="foodName" required
                     placeholder="e.g., Cooked Rice, Sandwiches">
            </div>
            <div class="form-group">
              <label>Quantity *</label>
              <div class="input-with-unit">
                <input type="number" class="form-control" [(ngModel)]="form.quantity" name="quantity" required min="1">
                <select class="form-control unit-select" [(ngModel)]="form.unit" name="unit">
                  <option value="servings">Servings</option>
                  <option value="kg">Kilograms</option>
                  <option value="plates">Plates</option>
                  <option value="packets">Packets</option>
                  <option value="boxes">Boxes</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Food Type *</label>
              <select class="form-control" [(ngModel)]="form.foodType" name="foodType" required>
                <option value="EDIBLE">Edible</option>
                <option value="NON_EDIBLE">Non-Edible (Compost/Animal Feed)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Perishability Level *</label>
              <select class="form-control" [(ngModel)]="form.perishLevel" name="perishLevel" required>
                <option value="LOW">Low (shelf-stable)</option>
                <option value="MEDIUM">Medium (1-2 days)</option>
                <option value="HIGH">High (within hours)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" [(ngModel)]="form.description" name="description"
                      placeholder="Describe the food items, preparation time, allergens, etc."></textarea>
          </div>

          <div class="form-group">
            <label><i class="fas fa-camera"></i> Food Photo</label>
            <input type="file" class="form-control" (change)="onFileChange($event)" accept="image/*">
            <small class="form-hint">Upload a clear photo of the food for quality review</small>
          </div>

          <div class="form-group">
            <label><i class="fas fa-clipboard-check"></i> Safety Checklist</label>
            <div class="checklist-grid">
              <label class="checkbox-item" *ngFor="let item of safetyItems">
                <input type="checkbox" [(ngModel)]="item.checked" [name]="'check_' + item.label">
                <span>{{ item.label }}</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label><i class="fas fa-map-marker-alt"></i> Pickup Address *</label>
            <input type="text" class="form-control" [(ngModel)]="form.pickupAddress" name="pickupAddress" required
                   placeholder="Full pickup address">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Pickup Start Date *</label>
              <input type="date" class="form-control" [(ngModel)]="form.pickupStartDate" name="pickupStartDate" required [min]="todayDate">
            </div>
            <div class="form-group">
              <label>Pickup Start Time *</label>
              <div class="time-select-row">
                <select class="form-control" [(ngModel)]="form.startHour" name="startHour" required>
                  <option value="" disabled>HH</option>
                  <option *ngFor="let h of hours" [value]="h">{{ h }}</option>
                </select>
                <span class="time-colon">:</span>
                <select class="form-control" [(ngModel)]="form.startMinute" name="startMinute" required>
                  <option value="" disabled>MM</option>
                  <option *ngFor="let m of minutes" [value]="m">{{ m }}</option>
                </select>
                <select class="form-control" [(ngModel)]="form.startPeriod" name="startPeriod">
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Pickup End Date *</label>
              <input type="date" class="form-control" [(ngModel)]="form.pickupEndDate" name="pickupEndDate" required [min]="todayDate">
            </div>
            <div class="form-group">
              <label>Pickup End Time *</label>
              <div class="time-select-row">
                <select class="form-control" [(ngModel)]="form.endHour" name="endHour" required>
                  <option value="" disabled>HH</option>
                  <option *ngFor="let h of hours" [value]="h">{{ h }}</option>
                </select>
                <span class="time-colon">:</span>
                <select class="form-control" [(ngModel)]="form.endMinute" name="endMinute" required>
                  <option value="" disabled>MM</option>
                  <option *ngFor="let m of minutes" [value]="m">{{ m }}</option>
                </select>
                <select class="form-control" [(ngModel)]="form.endPeriod" name="endPeriod">
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" [disabled]="loading" style="width:100%">
            <i class="fas fa-paper-plane"></i>
            {{ loading ? 'Posting...' : 'Post Food Listing' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-card { max-width: 700px; margin: 0 auto; padding: 40px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .input-with-unit { display: flex; gap: 8px; }
    .unit-select { max-width: 130px; }
    .form-hint { color: #999; font-size: 12px; margin-top: 4px; display: block; }
    .time-select-row { display: flex; align-items: center; gap: 6px; }
    .time-select-row select { flex: 1; min-width: 0; }
    .time-colon { font-size: 18px; font-weight: 700; color: #555; }
    .checklist-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .checkbox-item {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; background: #f8f9fa; border-radius: 8px;
      cursor: pointer; font-size: 13px; transition: background 0.2s;
    }
    .checkbox-item:hover { background: #e8f5e9; }
    .checkbox-item input[type="checkbox"] { accent-color: #2ecc71; }
    @media (max-width: 600px) {
      .form-row { grid-template-columns: 1fr; }
      .checklist-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CreateListingComponent {
  hours = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
  minutes = ['00', '15', '30', '45'];
  todayDate = new Date().toISOString().split('T')[0];

  form = {
    foodName: '',
    quantity: 1,
    unit: 'servings',
    foodType: 'EDIBLE',
    perishLevel: 'MEDIUM',
    description: '',
    pickupAddress: '',
    pickupStartDate: '',
    startHour: '',
    startMinute: '',
    startPeriod: 'AM',
    pickupEndDate: '',
    endHour: '',
    endMinute: '',
    endPeriod: 'AM'
  };

  photo: File | null = null;
  success = '';
  error = '';
  loading = false;

  safetyItems = [
    { label: 'Prepared in hygienic conditions', checked: false },
    { label: 'Stored at proper temperature', checked: false },
    { label: 'Within expiry/use-by date', checked: false },
    { label: 'No signs of spoilage', checked: false },
    { label: 'Properly packaged/covered', checked: false },
    { label: 'Allergen info available', checked: false }
  ];

  constructor(private api: ApiService, private router: Router) { }

  onFileChange(event: any) {
    this.photo = event.target.files[0];
  }

  to24h(hour: string, minute: string, period: string): string {
    let h = parseInt(hour, 10);
    if (period === 'PM' && h !== 12) {
      h += 12;
    } else if (period === 'AM' && h === 12) {
      h = 0;
    }
    const hStr = h < 10 ? '0' + h : h.toString();
    return `${hStr}:${minute}`;
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.success = '';

    const pickupWindowStart = `${this.form.pickupStartDate}T${this.to24h(this.form.startHour, this.form.startMinute, this.form.startPeriod)}`;
    const pickupWindowEnd = `${this.form.pickupEndDate}T${this.to24h(this.form.endHour, this.form.endMinute, this.form.endPeriod)}`;

    // Validate: cannot be in the past
    const now = new Date();
    if (new Date(pickupWindowStart) < now) {
      this.error = 'Pickup start date/time cannot be in the past.';
      this.loading = false;
      return;
    }
    if (new Date(pickupWindowEnd) < now) {
      this.error = 'Pickup end date/time cannot be in the past.';
      this.loading = false;
      return;
    }
    if (new Date(pickupWindowEnd) <= new Date(pickupWindowStart)) {
      this.error = 'Pickup end must be after the start.';
      this.loading = false;
      return;
    }

    const formData = new FormData();
    formData.append('foodName', this.form.foodName);
    formData.append('quantity', this.form.quantity.toString());
    formData.append('unit', this.form.unit);
    formData.append('foodType', this.form.foodType);
    formData.append('perishLevel', this.form.perishLevel);
    formData.append('description', this.form.description);
    formData.append('pickupAddress', this.form.pickupAddress);
    formData.append('pickupWindowStart', pickupWindowStart);
    formData.append('pickupWindowEnd', pickupWindowEnd);

    const checklist = this.safetyItems.filter(i => i.checked).map(i => i.label).join(', ');
    formData.append('safetyChecklist', checklist);

    if (this.photo) {
      formData.append('photo', this.photo);
    }

    this.api.createListing(formData).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Food listing posted successfully! It will be reviewed by a quality checker.';
        setTimeout(() => this.router.navigate(['/provider/dashboard']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to create listing.';
      }
    });
  }
}
