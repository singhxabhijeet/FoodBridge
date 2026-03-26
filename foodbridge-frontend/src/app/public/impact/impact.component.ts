import { Component, OnInit, OnDestroy } from '@angular/core';
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

      <!-- ===== HERO — Full-bleed teal with centered headline ===== -->
      <section class="hero">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1 class="hero-title fade-in-up">Save Good Food.<br><span class="hero-accent">Feed Real People.</span></h1>
          <p class="hero-sub fade-in-up" style="animation-delay:.15s">
            FoodBridge connects surplus food from restaurants, hotels & corporates with shelters,
            NGOs and community kitchens — verified for safety, delivered with dignity.
          </p>
          <div class="hero-btns fade-in-up" style="animation-delay:.3s">
            <a routerLink="/register" class="btn-hero-primary"><i class="fas fa-user-plus"></i> Join the Movement</a>
            <a href="#how" class="btn-hero-outline"><i class="fas fa-arrow-down"></i> See How It Works</a>
          </div>
        </div>
        <!-- Decorative food images floating -->
        <div class="hero-float hero-float-1">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop" alt="" loading="lazy">
        </div>
        <div class="hero-float hero-float-2">
          <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=250&h=250&fit=crop" alt="" loading="lazy">
        </div>
        <div class="hero-float hero-float-3">
          <img src="https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=200&h=200&fit=crop" alt="" loading="lazy">
        </div>
        <div class="hero-float hero-float-4">
          <img src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=220&h=220&fit=crop" alt="" loading="lazy">
        </div>
      </section>

      <!-- ===== IMPACT NUMBERS — Teal band with big bold stats ===== -->
      <section class="stats-band">
        <div class="stats-inner">
          <div class="stat-item fade-in-up" style="animation-delay:.1s">
            <div class="stat-icon"><i class="fas fa-utensils"></i></div>
            <div class="stat-num">{{ stats?.totalListingsPosted || 0 }}</div>
            <div class="stat-label">Listings Posted</div>
          </div>
          <div class="stat-item fade-in-up" style="animation-delay:.2s">
            <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
            <div class="stat-num">{{ stats?.totalFoodApproved || 0 }}</div>
            <div class="stat-label">Quality Approved</div>
          </div>
          <div class="stat-item fade-in-up" style="animation-delay:.3s">
            <div class="stat-icon"><i class="fas fa-hand-holding-heart"></i></div>
            <div class="stat-num">{{ stats?.totalFoodClaimed || 0 }}</div>
            <div class="stat-label">Meals Claimed</div>
          </div>
          <div class="stat-item fade-in-up" style="animation-delay:.4s">
            <div class="stat-icon"><i class="fas fa-handshake"></i></div>
            <div class="stat-num">{{ stats?.totalFoodConfirmed || 0 }}</div>
            <div class="stat-label">Pickups Confirmed</div>
          </div>
        </div>
      </section>

      <!-- ===== OUR MISSION — Split layout with image ===== -->
      <section class="mission">
        <div class="mission-inner">
          <div class="mission-img fade-in-up">
            <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=480&fit=crop" alt="Volunteers distributing food" loading="lazy">
            <div class="mission-img-badge">
              <span class="badge-num">{{ stats?.mealsProvided || 0 }}</span>
              <span class="badge-label">Meals Provided</span>
            </div>
          </div>
          <div class="mission-text fade-in-up" style="animation-delay:.15s">
            <span class="section-eyebrow">Our Mission</span>
            <h2>Every Meal Matters</h2>
            <p>Every day, tonnes of perfectly good food go to waste while families go hungry. FoodBridge was built to close that gap.</p>
            <p>We created a platform where restaurants, hotels, corporates and caterers can easily share surplus food with NGOs, shelters & community kitchens — all verified through a built-in quality check system.</p>
            <div class="mission-metrics">
              <div class="metric">
                <i class="fas fa-leaf"></i>
                <div>
                  <strong>{{ (stats?.co2Saved || 0) | number:'1.0-0' }} kg</strong>
                  <small>CO&#8322; Prevented</small>
                </div>
              </div>
              <div class="metric">
                <i class="fas fa-recycle"></i>
                <div>
                  <strong>{{ stats?.totalFoodSaved || 0 }}</strong>
                  <small>Food Units Rescued</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== HOW IT WORKS — Slider with arrows ===== -->
      <section class="how" id="how">
        <div class="how-inner">
          <span class="section-eyebrow center">How FoodBridge Works</span>
          <h2 class="section-heading">From Surplus to Served</h2>

          <div class="slider-container">
            <button class="slider-arrow slider-prev" (click)="prevStep()" [disabled]="currentStep === 0">
              <i class="fas fa-chevron-left"></i>
            </button>

            <div class="slider-viewport">
              <div class="slider-track" [style.transform]="'translateX(-' + (currentStep * 100) + '%)'">
                <div class="slide" *ngFor="let step of steps; let i = index">
                  <div class="slide-number">Step {{ i + 1 }} of {{ steps.length }}</div>
                  <div class="slide-body">
                    <div class="slide-visual">
                      <div class="slide-icon-circle">
                        <i [class]="step.icon"></i>
                      </div>
                      <img [src]="step.img" [alt]="step.title" class="slide-img" loading="lazy">
                    </div>
                    <div class="slide-text">
                      <h3>{{ step.title }}</h3>
                      <p>{{ step.desc }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button class="slider-arrow slider-next" (click)="nextStep()" [disabled]="currentStep === steps.length - 1">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>

          <div class="slider-dots">
            <span *ngFor="let step of steps; let i = index" class="dot" [class.active]="i === currentStep" (click)="currentStep = i"></span>
          </div>
        </div>
      </section>



      <!-- ===== TESTIMONIALS — Cards on light bg ===== -->
      <section class="testimonials">
        <div class="test-inner">
          <span class="section-eyebrow center">What People Say</span>
          <h2 class="section-heading">Trusted by Those Who Care</h2>

          <div class="test-grid">
            <div class="test-card fade-in-up" *ngFor="let t of testimonials; let i = index" [style.animation-delay]="(i * 0.12) + 's'">
              <div class="test-quote"><i class="fas fa-quote-left"></i></div>
              <p>{{ t.text }}</p>
              <div class="test-author">
                <div class="test-avatar" [style.background]="t.color">{{ t.name.charAt(0) }}</div>
                <div>
                  <strong>{{ t.name }}</strong>
                  <small>{{ t.role }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== CTA BAND ===== -->
      <section class="cta-band">
        <div class="cta-inner fade-in-up">
          <h2>Ready to Make a Difference?</h2>
          <p>Whether you have surplus food or know someone who needs it — join FoodBridge today.</p>
          <div class="cta-btns">
            <a routerLink="/register" class="btn-hero-primary"><i class="fas fa-user-plus"></i> Create Account</a>
            <a routerLink="/login" class="btn-cta-signin"><i class="fas fa-sign-in-alt"></i> Sign In</a>
          </div>
        </div>
      </section>

      <!-- ===== FOOTER ===== -->
      <footer class="site-footer">
        <div class="footer-brand">FoodBridge</div>
        <div class="footer-grid">
          <div class="footer-col">
            <p class="footer-tagline">Connecting surplus food with those who need it most. Together, we can end food waste and hunger.</p>
            <div class="footer-social">
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
              <a href="#"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Platform</h4>
            <a routerLink="/impact">Home</a>
            <a routerLink="/register">Get Started</a>
            <a routerLink="/login">Login</a>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <p><i class="fas fa-envelope"></i> help&#64;foodbridge.org</p>
            <p><i class="fas fa-phone"></i> +91-98765-43210</p>
            <p><i class="fas fa-map-marker-alt"></i> Pune, India</p>
          </div>
        </div>
        <div class="footer-bottom">
          &copy; 2026 FoodBridge. Built with &#x2764;&#xFE0F; to fight food waste.
        </div>
      </footer>
    </div>
  `,
    styles: [`
    /* ────── Variables ────── */
    :host { --teal: #006155; --teal-light: #008574; --teal-dark: #004a3f; --cream: #f8f4ef; --accent: #c8e6c9; }

    /* ────── HERO ────── */
    .hero {
      position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(160deg, var(--teal-dark) 0%, var(--teal) 40%, var(--teal-light) 100%);
      overflow: hidden; padding: 100px 24px 80px; text-align: center;
    }
    .hero-overlay {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 50% 120%, rgba(200,230,201,0.12) 0%, transparent 60%);
    }
    .hero-content { position: relative; z-index: 2; max-width: 720px; }
    .hero-title {
      font-size: clamp(36px, 6vw, 64px); font-weight: 900; color: white; line-height: 1.1;
      letter-spacing: -1px; margin-bottom: 24px;
    }
    .hero-accent { color: #a5d6a7; }
    .hero-sub { font-size: 17px; color: rgba(255,255,255,.75); line-height: 1.7; margin-bottom: 36px; max-width: 560px; margin-left: auto; margin-right: auto; }
    .hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .btn-hero-primary {
      padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 15px;
      background: white; color: var(--teal); text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
      transition: all .25s; box-shadow: 0 4px 20px rgba(0,0,0,.15);
    }
    .btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,.2); }
    .btn-hero-outline {
      padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 15px;
      background: transparent; color: white; border: 2px solid rgba(255,255,255,.35); text-decoration: none;
      display: inline-flex; align-items: center; gap: 8px; transition: all .25s;
    }
    .btn-hero-outline:hover { border-color: white; background: rgba(255,255,255,.1); }
    .btn-hero-outline.dark { color: var(--teal); border-color: var(--teal); }
    .btn-hero-outline.dark:hover { background: rgba(0,97,85,.08); }

    /* Floating food images */
    .hero-float {
      position: absolute; z-index: 1; border-radius: 50%; overflow: hidden;
      box-shadow: 0 20px 50px rgba(0,0,0,.25); animation: floatBob 6s ease-in-out infinite;
    }
    .hero-float img { width: 100%; height: 100%; object-fit: cover; }
    .hero-float-1 { width: 180px; height: 180px; top: 12%; left: 5%; animation-delay: 0s; }
    .hero-float-2 { width: 140px; height: 140px; top: 18%; right: 6%; animation-delay: 2s; }
    .hero-float-3 { width: 110px; height: 110px; bottom: 15%; left: 10%; animation-delay: 4s; }
    .hero-float-4 { width: 150px; height: 150px; bottom: 12%; right: 7%; animation-delay: 1.5s; }
    @keyframes floatBob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-18px); }
    }

    /* ────── STATS BAND ────── */
    .stats-band { background: var(--teal-dark); padding: 56px 24px; }
    .stats-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
    .stat-item { text-align: center; color: white; }
    .stat-icon { font-size: 28px; color: var(--accent); margin-bottom: 12px; }
    .stat-num { font-size: 42px; font-weight: 900; letter-spacing: -1px; line-height: 1; margin-bottom: 6px; }
    .stat-label { font-size: 13px; color: rgba(255,255,255,.6); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }

    /* ────── MISSION ────── */
    .mission { padding: 100px 24px; background: white; }
    .mission-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
    .mission-img { position: relative; }
    .mission-img img { width: 100%; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,.1); }
    .mission-img-badge {
      position: absolute; bottom: -20px; right: -20px; background: var(--teal); color: white;
      border-radius: 16px; padding: 16px 24px; text-align: center; box-shadow: 0 8px 30px rgba(0,97,85,.3);
    }
    .badge-num { display: block; font-size: 28px; font-weight: 900; }
    .badge-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: .8; }
    .section-eyebrow {
      display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;
      color: var(--teal); margin-bottom: 12px;
    }
    .section-eyebrow.center { text-align: center; }
    .mission-text h2 { font-size: 36px; font-weight: 800; color: #1a1a2e; margin-bottom: 20px; line-height: 1.2; }
    .mission-text p { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 16px; }
    .mission-metrics { display: flex; gap: 32px; margin-top: 28px; }
    .metric { display: flex; align-items: center; gap: 14px; }
    .metric i { font-size: 28px; color: var(--teal); }
    .metric strong { display: block; font-size: 22px; font-weight: 800; color: #1a1a2e; }
    .metric small { font-size: 12px; color: #888; }

    /* ────── HOW IT WORKS — SLIDER ────── */
    .how { padding: 100px 24px; background: var(--cream); }
    .how-inner { max-width: 900px; margin: 0 auto; }
    .section-heading { text-align: center; font-size: 32px; font-weight: 800; color: #1a1a2e; margin-bottom: 48px; }
    .slider-container { display: flex; align-items: center; gap: 16px; }
    .slider-viewport { flex: 1; overflow: hidden; border-radius: 24px; }
    .slider-track {
      display: flex; transition: transform .45s cubic-bezier(.4,0,.2,1);
    }
    .slide { min-width: 100%; box-sizing: border-box; }
    .slide-number {
      text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;
      font-weight: 700; color: var(--teal); margin-bottom: 20px;
    }
    .slide-body {
      display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center;
      background: white; border-radius: 24px; padding: 40px; box-shadow: 0 8px 30px rgba(0,0,0,.06);
    }
    .slide-visual { position: relative; text-align: center; }
    .slide-icon-circle {
      width: 64px; height: 64px; border-radius: 50%; background: var(--teal); color: white;
      display: flex; align-items: center; justify-content: center; font-size: 26px;
      position: absolute; top: -18px; left: -18px; z-index: 2; box-shadow: 0 6px 20px rgba(0,97,85,.35);
    }
    .slide-img { width: 100%; height: 240px; object-fit: cover; border-radius: 16px; }
    .slide-text h3 { font-size: 24px; font-weight: 800; color: #1a1a2e; margin-bottom: 14px; }
    .slide-text p { font-size: 15px; color: #666; line-height: 1.8; }
    .slider-arrow {
      width: 48px; height: 48px; border-radius: 50%; border: 2px solid #ccc; background: white;
      font-size: 18px; color: var(--teal); cursor: pointer; display: flex; align-items: center;
      justify-content: center; transition: all .25s; flex-shrink: 0;
    }
    .slider-arrow:hover:not(:disabled) { border-color: var(--teal); background: var(--teal); color: white; }
    .slider-arrow:disabled { opacity: .3; cursor: default; }
    .slider-dots { display: flex; justify-content: center; gap: 10px; margin-top: 24px; }
    .dot {
      width: 10px; height: 10px; border-radius: 50%; background: #ccc; cursor: pointer;
      transition: all .25s;
    }
    .dot.active { background: var(--teal); transform: scale(1.3); }

    /* ────── TESTIMONIALS ────── */
    .testimonials { padding: 100px 24px; background: white; }
    .test-inner { max-width: 1100px; margin: 0 auto; }
    .test-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
    .test-card {
      background: #f9fafb; border-radius: 20px; padding: 32px; position: relative;
      border: 1px solid #eee; transition: box-shadow .3s, transform .3s;
    }
    .test-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,.08); transform: translateY(-4px); }
    .test-quote { color: var(--teal); font-size: 24px; margin-bottom: 12px; opacity: .4; }
    .test-card p { font-size: 14px; color: #555; line-height: 1.75; margin-bottom: 24px; font-style: italic; }
    .test-author { display: flex; align-items: center; gap: 12px; }
    .test-avatar {
      width: 42px; height: 42px; border-radius: 50%; color: white;
      display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 17px; flex-shrink: 0;
    }
    .test-author strong { font-size: 14px; display: block; color: #1a1a2e; }
    .test-author small { font-size: 12px; color: #888; }

    /* ────── CTA BAND ────── */
    .cta-band { background: linear-gradient(135deg, var(--teal) 0%, var(--teal-light) 100%); padding: 80px 24px; }
    .cta-inner { max-width: 640px; margin: 0 auto; text-align: center; color: white; }
    .cta-inner h2 { font-size: 32px; font-weight: 800; margin-bottom: 16px; }
    .cta-inner p { font-size: 16px; opacity: .8; margin-bottom: 32px; line-height: 1.6; }
    .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .btn-cta-signin {
      padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 15px;
      background: white; color: var(--teal); text-decoration: none; display: inline-flex;
      align-items: center; gap: 8px; transition: all .25s; border: none;
    }
    .btn-cta-signin:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,.2); }

    /* ────── FOOTER ────── */
    .site-footer { background: #0a2e27; color: white; padding: 60px 24px 0; }
    .footer-brand {
      font-size: clamp(48px, 8vw, 80px); font-weight: 900; text-align: center;
      letter-spacing: -2px; margin-bottom: 48px; color: rgba(255,255,255,.12);
    }
    .footer-grid { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; padding-bottom: 40px; }
    .footer-tagline { font-size: 14px; color: rgba(255,255,255,.45); line-height: 1.7; margin-bottom: 20px; }
    .footer-social { display: flex; gap: 16px; }
    .footer-social a { color: rgba(255,255,255,.35); font-size: 18px; transition: color .2s; }
    .footer-social a:hover { color: var(--accent); }
    .footer-col h4 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; }
    .footer-col a { display: block; font-size: 14px; color: rgba(255,255,255,.45); padding: 4px 0; text-decoration: none; transition: color .2s; }
    .footer-col a:hover { color: var(--accent); }
    .footer-col p { font-size: 13px; color: rgba(255,255,255,.4); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,.08); padding: 20px 0; text-align: center;
      font-size: 13px; color: rgba(255,255,255,.25);
    }

    /* ────── RESPONSIVE ────── */
    @media (max-width: 900px) {
      .stats-inner { grid-template-columns: 2fr 2fr; }
      .mission-inner { grid-template-columns: 1fr; }
      .mission-img-badge { right: 12px; bottom: -12px; }
      .slide-body { grid-template-columns: 1fr; }
      .slide-visual { order: -1; }
      .test-grid { grid-template-columns: 1fr; }
      .footer-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .hero-float { display: none; }
      .stats-inner { grid-template-columns: 1fr 1fr; gap: 16px; }
      .stat-num { font-size: 32px; }
      .slider-arrow { width: 36px; height: 36px; font-size: 14px; }
      .hero-btns { flex-direction: column; align-items: center; }
    }
  `]
})
export class ImpactComponent implements OnInit {
    stats: ImpactStats | null = null;

    currentStep = 0;

    steps = [
        { icon: 'fas fa-user-plus', title: 'Register & Get Verified', desc: 'Sign up as a food provider, receiver, or quality checker. Submit your details and get approved by our admin team to ensure only genuine participants join the platform.', img: 'assets/steps/step1.png' },
        { icon: 'fas fa-camera', title: 'Post Surplus Food', desc: 'Restaurants, hotels, and corporates list their surplus food with photos, safety checklist, pickup address, and an expiry window based on perishability level (24h, 48h, or 72h).', img: 'assets/steps/step2.png' },
        { icon: 'fas fa-clipboard-check', title: 'Quality Check & Approval', desc: 'Trained quality checkers review each listing for safety. Approved listings go live for receivers. Rejected edible food is automatically reclassified as non-edible for composters — nothing gets wasted.', img: 'assets/steps/step3.png' },
        { icon: 'fas fa-hand-holding-heart', title: 'Browse & Claim', desc: 'Receivers browse available listings filtered by food type. They can claim any custom quantity they need — so if 10 kg is posted and you only need 5, you take 5 and leave the rest for others.', img: 'assets/steps/step4.png' },
        { icon: 'fas fa-truck', title: 'Pickup & Confirm', desc: 'The receiver picks up the food within the scheduled window. Both provider and receiver confirm the handover independently, ensuring a transparent and accountable process.', img: 'assets/steps/step5.png' },
        { icon: 'fas fa-star', title: 'Rate & Build Trust', desc: 'After every successful pickup, both parties rate each other. Consistent no-shows get flagged, and repeated offenders are restricted — keeping the community reliable and trustworthy.', img: 'assets/steps/step6.png' }
    ];

    prevStep() { if (this.currentStep > 0) this.currentStep--; }
    nextStep() { if (this.currentStep < this.steps.length - 1) this.currentStep++; }

    testimonials = [
        {
            text: 'FoodBridge has transformed how we handle surplus food. Instead of throwing it away, we now feed over 200 people every week through verified NGOs!',
            name: 'Rajesh Sharma', role: 'Hotel Manager, Mumbai', color: 'linear-gradient(135deg, #006155, #00897b)'
        },
        {
            text: 'As an NGO director, finding quality-verified food for our shelter was always a challenge. FoodBridge made it seamless, reliable, and dignified.',
            name: 'Priya Mehta', role: 'Director, Sunrise Welfare Trust', color: 'linear-gradient(135deg, #e67e22, #f39c12)'
        },
        {
            text: 'The quality check system gives us confidence that every meal is safe. The partial claim feature means we take only what we need — zero waste on our end too!',
            name: 'Amit Kumar', role: 'Community Kitchen, Delhi', color: 'linear-gradient(135deg, #3498db, #2980b9)'
        }
    ];

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
