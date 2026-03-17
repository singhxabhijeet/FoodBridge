import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ImpactStats } from '../../core/models/models';

@Component({
    selector: 'app-impact',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="impact-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content fade-in-up">
          <h1>Bridging the Gap Between <span class="highlight">Food Waste</span> and <span class="highlight">Hunger</span></h1>
          <p class="hero-subtitle">FoodBridge connects food providers with communities in need, reducing waste and feeding people.</p>
          <div class="hero-stats" *ngIf="stats">
            <div class="hero-stat">
              <div class="hero-stat-number">{{ stats.totalFoodSaved || 0 }}</div>
              <div class="hero-stat-label">Food Units Saved</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-number">{{ stats.mealsProvided || 0 }}</div>
              <div class="hero-stat-label">Meals Provided</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-number">{{ (stats.co2Saved || 0) | number:'1.0-0' }}</div>
              <div class="hero-stat-label">kg CO₂ Saved</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Cards -->
      <section class="stats-section">
        <div class="page-container">
          <h2 class="section-title">Our Impact in Numbers</h2>
          <div class="impact-grid">
            <div class="impact-card card fade-in-up" style="animation-delay: 0.1s">
              <div class="impact-icon" style="background: linear-gradient(135deg, #2ecc71, #27ae60)">
                <i class="fas fa-utensils"></i>
              </div>
              <div class="impact-number">{{ stats?.totalListingsPosted || 0 }}</div>
              <div class="impact-label">Total Listings Posted</div>
            </div>
            <div class="impact-card card fade-in-up" style="animation-delay: 0.2s">
              <div class="impact-icon" style="background: linear-gradient(135deg, #3498db, #2980b9)">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="impact-number">{{ stats?.totalFoodApproved || 0 }}</div>
              <div class="impact-label">Listings Approved</div>
            </div>
            <div class="impact-card card fade-in-up" style="animation-delay: 0.3s">
              <div class="impact-icon" style="background: linear-gradient(135deg, #e67e22, #f39c12)">
                <i class="fas fa-hand-holding-heart"></i>
              </div>
              <div class="impact-number">{{ stats?.totalFoodClaimed || 0 }}</div>
              <div class="impact-label">Food Items Claimed</div>
            </div>
            <div class="impact-card card fade-in-up" style="animation-delay: 0.4s">
              <div class="impact-icon" style="background: linear-gradient(135deg, #9b59b6, #8e44ad)">
                <i class="fas fa-handshake"></i>
              </div>
              <div class="impact-number">{{ stats?.totalFoodConfirmed || 0 }}</div>
              <div class="impact-label">Successful Pickups</div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-section">
        <div class="page-container">
          <h2 class="section-title">How FoodBridge Works</h2>
          <div class="steps-grid">
            <div class="step-card">
              <div class="step-number">1</div>
              <h3>Post Food</h3>
              <p>Restaurants and corporates list surplus food with photos and safety details.</p>
            </div>
            <div class="step-arrow"><i class="fas fa-arrow-right"></i></div>
            <div class="step-card">
              <div class="step-number">2</div>
              <h3>Quality Check</h3>
              <p>Trained quality checkers verify food safety before listings go live.</p>
            </div>
            <div class="step-arrow"><i class="fas fa-arrow-right"></i></div>
            <div class="step-card">
              <div class="step-number">3</div>
              <h3>Claim & Pickup</h3>
              <p>Receivers browse, claim food, and schedule a convenient pickup time.</p>
            </div>
            <div class="step-arrow"><i class="fas fa-arrow-right"></i></div>
            <div class="step-card">
              <div class="step-number">4</div>
              <h3>Confirm & Rate</h3>
              <p>Both parties confirm and rate each other for accountability.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
    styles: [`
    .hero {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white;
      padding: 100px 24px 80px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at 30% 50%, rgba(46, 204, 113, 0.08) 0%, transparent 50%),
                  radial-gradient(circle at 70% 50%, rgba(52, 152, 219, 0.08) 0%, transparent 50%);
      animation: pulse 8s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .hero-content {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
    }
    .hero h1 {
      font-size: 48px;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 20px;
    }
    .highlight {
      background: linear-gradient(135deg, #2ecc71, #3498db);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-subtitle {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.7);
      max-width: 600px;
      margin: 0 auto 40px;
      line-height: 1.6;
    }
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 60px;
      margin-top: 40px;
    }
    .hero-stat-number {
      font-size: 42px;
      font-weight: 800;
      color: #2ecc71;
    }
    .hero-stat-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 4px;
    }
    .stats-section {
      padding: 80px 0;
      background: white;
    }
    .section-title {
      text-align: center;
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 48px;
      color: #1a1a2e;
    }
    .impact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
    }
    .impact-card {
      text-align: center;
      padding: 32px 24px;
    }
    .impact-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      color: white;
      font-size: 24px;
    }
    .impact-number {
      font-size: 36px;
      font-weight: 800;
      color: #1a1a2e;
      margin-bottom: 4px;
    }
    .impact-label {
      font-size: 14px;
      color: #7f8c8d;
      font-weight: 500;
    }
    .how-section {
      padding: 80px 0;
      background: #f8f9fa;
    }
    .steps-grid {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .step-card {
      background: white;
      border-radius: 20px;
      padding: 32px 24px;
      text-align: center;
      width: 200px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      transition: transform 0.3s;
    }
    .step-card:hover {
      transform: translateY(-4px);
    }
    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2ecc71, #27ae60);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 18px;
      margin: 0 auto 12px;
    }
    .step-card h3 {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .step-card p {
      font-size: 13px;
      color: #7f8c8d;
      line-height: 1.5;
    }
    .step-arrow {
      color: #2ecc71;
      font-size: 20px;
    }
    @media (max-width: 768px) {
      .hero h1 { font-size: 32px; }
      .hero-stats { flex-direction: column; gap: 24px; }
      .step-arrow { display: none; }
      .steps-grid { flex-direction: column; }
      .step-card { width: 100%; max-width: 300px; }
    }
  `]
})
export class ImpactComponent implements OnInit {
    stats: ImpactStats | null = null;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getImpactStats().subscribe({
            next: (data) => this.stats = data,
            error: () => {
                this.stats = {
                    totalListingsPosted: 0, totalFoodConfirmed: 0, totalFoodApproved: 0,
                    totalFoodClaimed: 0, totalFoodSaved: 0, mealsProvided: 0, co2Saved: 0
                };
            }
        });
    }
}
