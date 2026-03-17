import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1><i class="fas fa-file-alt"></i> Monthly Reports</h1>
        <p>Download your monthly food listing reports</p>
      </div>

      <div class="card" style="max-width: 500px; margin: 0 auto; padding: 40px;">
        <div class="form-group">
          <label>Year</label>
          <select class="form-control" [(ngModel)]="year">
            <option *ngFor="let y of years" [value]="y">{{ y }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Month</label>
          <select class="form-control" [(ngModel)]="month">
            <option *ngFor="let m of months; let i = index" [value]="i + 1">{{ m }}</option>
          </select>
        </div>
        <button class="btn btn-primary btn-lg" style="width:100%" (click)="download()" [disabled]="downloading">
          <i class="fas fa-download"></i>
          {{ downloading ? 'Generating...' : 'Download Report' }}
        </button>
      </div>
    </div>
  `
})
export class ReportsComponent {
    year = new Date().getFullYear();
    month = new Date().getMonth() + 1;
    years = [2024, 2025, 2026];
    months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    downloading = false;

    constructor(private api: ApiService) { }

    download() {
        this.downloading = true;
        this.api.downloadMonthlyReport(this.year, this.month).subscribe({
            next: (blob) => {
                this.downloading = false;
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `FoodBridge_Report_${this.year}_${this.month}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: () => { this.downloading = false; }
        });
    }
}
