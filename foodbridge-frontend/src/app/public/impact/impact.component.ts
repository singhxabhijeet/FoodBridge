import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ImpactStats } from '../../core/models/models';

@Component({
    selector: 'app-impact',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="impact-page">
      <!-- Hero Section with Split Layout -->
      <section class="hero">
        <div class="hero-inner">
          <div class="hero-text fade-in-up">
            <h1>Bridging the Gap Between <span class="highlight">Food Waste</span> and <span class="highlight">Hunger</span></h1>
            <p class="hero-subtitle">FoodBridge connects food providers with communities in need, reducing waste and feeding people across India.</p>
            <div class="hero-cta">
              <a routerLink="/register" class="btn btn-primary btn-lg"><i class="fas fa-user-plus"></i> Get Started</a>
              <a href="#how" class="btn btn-outline btn-lg"><i class="fas fa-play-circle"></i> How It Works</a>
            </div>
          </div>
          <div class="hero-image fade-in-up" style="animation-delay: 0.3s">
            <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop" alt="Food sharing community" loading="lazy">
          </div>
        </div>
      </section>

      <!-- Animated Stats -->
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

      <!-- Our Mission -->
      <section class="mission-section">
        <div class="page-container">
          <div class="mission-grid">
            <div class="mission-image fade-in-up">
              <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&h=400&fit=crop" alt="Volunteers distributing food" loading="lazy">
            </div>
            <div class="mission-text fade-in-up" style="animation-delay: 0.2s">
              <h2>Our Mission</h2>
              <p>Every day, millions of tons of food go to waste while countless people sleep hungry. FoodBridge was built to solve this paradox.</p>
              <p>We created a platform where restaurants, hotels, corporates, and caterers can easily share surplus food with NGOs, shelters, and community kitchens — all verified through a built-in quality check system.</p>
              <div class="mission-stats">
                <div><strong>{{ stats?.mealsProvided || 0 }}</strong><br><small>Meals Provided</small></div>
                <div><strong>{{ (stats?.co2Saved || 0) | number:'1.0-0' }} kg</strong><br><small>CO&#8322; Saved</small></div>
                <div><strong>{{ stats?.totalFoodSaved || 0 }}</strong><br><small>Food Units Saved</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-section" id="how">
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
              <p>Receivers browse, claim food in any quantity, and schedule a convenient pickup time.</p>
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

      <!-- Photo Gallery -->
      <section class="gallery-section">
        <div class="page-container">
          <h2 class="section-title">Making a Difference</h2>
          <div class="gallery-grid">
            <img src="https://images.unsplash.com/photo-1504159506876-f8338247a14a?w=400&h=300&fit=crop" alt="Food donation" loading="lazy">
            <img src="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=300&fit=crop" alt="Community kitchen" loading="lazy">
            <img src="https://images.unsplash.com/photo-1509099836639-18ba4637cd7b?w=400&h=300&fit=crop" alt="Volunteers packing food" loading="lazy">
            <img src="https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=400&h=300&fit=crop" alt="Food preparation" loading="lazy">
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="testimonials-section">
        <div class="page-container">
          <h2 class="section-title">What People Say</h2>
          <div class="testimonials-grid">
            <div class="testimonial-card card fade-in-up" style="animation-delay: 0.1s">
              <div class="testimonial-stars">
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
              </div>
              <p>"FoodBridge has transformed how we handle surplus food. Instead of throwing it away, we now feed over 200 people every week!"</p>
              <div class="testimonial-author">
                <div class="author-avatar">R</div>
                <div><strong>Rajesh Sharma</strong><br><small>Hotel Manager, Mumbai</small></div>
              </div>
            </div>
            <div class="testimonial-card card fade-in-up" style="animation-delay: 0.2s">
              <div class="testimonial-stars">
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
              </div>
              <p>"As an NGO, finding quality food for our shelter was always a challenge. FoodBridge made it seamless and reliable."</p>
              <div class="testimonial-author">
                <div class="author-avatar">P</div>
                <div><strong>Priya Mehta</strong><br><small>Director, Sunrise Welfare Trust</small></div>
              </div>
            </div>
            <div class="testimonial-card card fade-in-up" style="animation-delay: 0.3s">
              <div class="testimonial-stars">
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
              </div>
              <p>"The quality check system gives us confidence that the food is safe. Fantastic initiative for reducing waste!"</p>
              <div class="testimonial-author">
                <div class="author-avatar">A</div>
                <div><strong>Amit Kumar</strong><br><small>Community Kitchen, Delhi</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-col brand-col">
            <h3><i class="fas fa-leaf"></i> FoodBridge</h3>
            <p>Connecting surplus food with those who need it most. Together, we can end food waste and hunger.</p>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <a routerLink="/impact">Home</a>
            <a routerLink="/register">Get Started</a>
            <a routerLink="/login">Login</a>
          </div>
          <div class="footer-col">
            <h4>Contact Us</h4>
            <p><i class="fas fa-envelope"></i> help&#64;foodbridge.org</p>
            <p><i class="fas fa-phone"></i> +91-98765-43210</p>
            <p><i class="fas fa-map-marker-alt"></i> Mumbai, India</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 FoodBridge. Built with &#x2764; to fight food waste.</p>
        </div>
      </footer>
    </div>
  `,
    styles: [`
    /* Hero Split Layout */
    .hero {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white; padding: 100px 24px 80px; position: relative; overflow: hidden;
    }
    .hero::before {
      content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
      background: radial-gradient(circle at 30% 50%, rgba(46, 204, 113, 0.08) 0%, transparent 50%),
                  radial-gradient(circle at 70% 50%, rgba(52, 152, 219, 0.08) 0%, transparent 50%);
      animation: pulse 8s ease-in-out infinite;
    }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    .hero-inner {
      max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr;
      gap: 60px; align-items: center; position: relative;
    }
    .hero h1 { font-size: 44px; font-weight: 800; line-height: 1.2; margin-bottom: 20px; }
    .highlight {
      background: linear-gradient(135deg, #2ecc71, #3498db);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .hero-subtitle { font-size: 17px; color: rgba(255, 255, 255, 0.7); line-height: 1.7; margin-bottom: 32px; }
    .hero-cta { display: flex; gap: 16px; }
    .btn-outline { border: 2px solid rgba(255,255,255,0.3); color: white; background: transparent; }
    .btn-outline:hover { border-color: #2ecc71; background: rgba(46,204,113,0.1); }
    .hero-image img {
      width: 100%; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    /* Stats */
    .stats-section { padding: 80px 0; background: white; }
    .section-title { text-align: center; font-size: 32px; font-weight: 800; margin-bottom: 48px; color: #1a1a2e; }
    .impact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
    .impact-card { text-align: center; padding: 32px 24px; }
    .impact-icon {
      width: 60px; height: 60px; border-radius: 16px; display: flex;
      align-items: center; justify-content: center; margin: 0 auto 16px; color: white; font-size: 24px;
    }
    .impact-number { font-size: 36px; font-weight: 800; color: #1a1a2e; margin-bottom: 4px; }
    .impact-label { font-size: 14px; color: #7f8c8d; font-weight: 500; }

    /* Mission */
    .mission-section { padding: 80px 0; background: #f8f9fa; }
    .mission-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .mission-image img { width: 100%; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .mission-text h2 { font-size: 32px; font-weight: 800; margin-bottom: 20px; }
    .mission-text p { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 16px; }
    .mission-stats { display: flex; gap: 32px; margin-top: 24px; }
    .mission-stats div { text-align: center; }
    .mission-stats strong { font-size: 28px; font-weight: 800; color: #2ecc71; }
    .mission-stats small { font-size: 12px; color: #888; }

    /* How It Works */
    .how-section { padding: 80px 0; background: white; }
    .steps-grid { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; }
    .step-card {
      background: white; border-radius: 20px; padding: 32px 24px; text-align: center;
      width: 200px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: transform 0.3s;
    }
    .step-card:hover { transform: translateY(-4px); }
    .step-number {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, #2ecc71, #27ae60); color: white;
      display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; margin: 0 auto 12px;
    }
    .step-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
    .step-card p { font-size: 13px; color: #7f8c8d; line-height: 1.5; }
    .step-arrow { color: #2ecc71; font-size: 20px; }

    /* Gallery */
    .gallery-section { padding: 80px 0; background: #f8f9fa; }
    .gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .gallery-grid img {
      width: 100%; height: 200px; object-fit: cover; border-radius: 16px;
      transition: transform 0.3s; cursor: pointer;
    }
    .gallery-grid img:hover { transform: scale(1.03); }

    /* Testimonials */
    .testimonials-section { padding: 80px 0; background: white; }
    .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .testimonial-card { padding: 32px; }
    .testimonial-stars { color: #f1c40f; margin-bottom: 16px; font-size: 16px; display: flex; gap: 2px; }
    .testimonial-card p { font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 20px; font-style: italic; }
    .testimonial-author { display: flex; align-items: center; gap: 12px; }
    .author-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, #2ecc71, #3498db); color: white;
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;
    }
    .testimonial-author strong { font-size: 14px; }
    .testimonial-author small { color: #888; font-size: 12px; }

    /* Footer */
    .site-footer { background: #1a1a2e; color: white; padding: 60px 24px 0; }
    .footer-inner {
      max-width: 1100px; margin: 0 auto; display: grid;
      grid-template-columns: 2fr 1fr 1fr; gap: 40px; padding-bottom: 40px;
    }
    .brand-col h3 { font-size: 22px; display: flex; align-items: center; gap: 8px; color: #2ecc71; margin-bottom: 12px; }
    .brand-col p { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.7; }
    .footer-col h4 { font-size: 14px; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
    .footer-col a { display: block; font-size: 14px; color: rgba(255,255,255,0.5); padding: 4px 0; transition: color 0.2s; }
    .footer-col a:hover { color: #2ecc71; }
    .footer-col p { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.1); padding: 20px 0; text-align: center;
      font-size: 13px; color: rgba(255,255,255,0.3);
    }

    @media (max-width: 768px) {
      .hero-inner { grid-template-columns: 1fr; text-align: center; }
      .hero-cta { justify-content: center; }
      .hero-image { display: none; }
      .hero h1 { font-size: 32px; }
      .mission-grid { grid-template-columns: 1fr; }
      .mission-image { display: none; }
      .step-arrow { display: none; }
      .steps-grid { flex-direction: column; }
      .step-card { width: 100%; max-width: 300px; }
      .gallery-grid { grid-template-columns: 1fr 1fr; }
      .testimonials-grid { grid-template-columns: 1fr; }
      .footer-inner { grid-template-columns: 1fr; }
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
