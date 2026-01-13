import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { fetchUserAttributes } from 'aws-amplify/auth';

function titleCase(s: string) {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function displayNameFromAttrs(attrs: Record<string, string>) {
  const name = (attrs['name'] || '').trim();
  const email = (attrs['email'] || '').trim();

  if (name) {
    // If name already starts with Dr, keep it; otherwise prefix Dr
    return /^dr\b/i.test(name) ? name : `Dr ${name}`;
  }

  if (email) {
    const local = email.split('@')[0];
    const cleaned = local.replace(/[._-]+/g, ' ');
    return `Dr ${titleCase(cleaned)}`;
  }

  return 'User';
}

function initialsFromName(display: string) {
  const base = display.replace(/^Dr\s+/i, '').trim();
  const parts = base.split(/\s+/).filter(Boolean);
  const a = (parts[0]?.[0] || '').toUpperCase();
  const b = (parts[1]?.[0] || '').toUpperCase();
  return (a + b) || 'U';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="card">
        <div class="welcome-row">
          <div class="welcome-left">
            <h1 style="margin:0;">{{ welcomeTitle }}</h1>
            <p class="muted" style="margin-top:10px; line-height:1.5;">
              The MOH Command Centre provides secure access for top management to track health system performance,
              programme delivery, workforce capacity, facility readiness, and priority outcomes — enabling timely decisions
              and consistent progress monitoring.
            </p>
          </div>

          <div class="welcome-right">
            <img
              *ngIf="pictureUrl; else initials"
              class="hero-avatar"
              [src]="pictureUrl"
              alt="Profile"
              (error)="onAvatarError()"
            />
            <ng-template #initials>
              <div class="hero-avatar hero-initials">{{ initials }}</div>
            </ng-template>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 style="margin:0 0 12px 0;">Dashboard Catalogue</h2>
        <div class="grid">
          <a class="dash-btn" routerLink="/dashboards/hf">
            <span class="label">Health Facilities Tracker</span>
          </a>

          <a class="dash-btn" routerLink="/dashboards/hr">
            <span class="label">Human Resources Tracker</span>
          </a>

          <a class="dash-btn" routerLink="/dashboards/dig">
            <span class="label">Digitalisation Initiatives Tracker</span>
          </a>

          <a class="dash-btn" routerLink="/dashboards/cd">
            <span class="label">Communicable Disease Tracker</span>
          </a>

          <a class="dash-btn" routerLink="/dashboards/ncd">
            <span class="label">Non-Communicable Disease Tracker</span>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  welcomeTitle = 'Welcome to MOH Command Centre';
  pictureUrl: string | null = null;
  initials = 'U';

  async ngOnInit() {
    try {
      const raw = await fetchUserAttributes();

      // Convert to simple string map (avoids TS typing pain)
      const attrs: Record<string, string> = {};
      Object.entries(raw).forEach(([k, v]) => {
        if (typeof v === 'string' && v.trim()) attrs[k] = v.trim();
      });

      const display = displayNameFromAttrs(attrs);
      this.welcomeTitle = `Welcome to MOH Command Centre — ${display}`;
      this.initials = initialsFromName(display);

      const email = attrs['email'] || '';
      if (email) {
        const local = email.split('@')[0];
        this.pictureUrl = `assets/profiles/${local}.png`;
      } else {
        this.pictureUrl = null;
      }
    } catch {
      this.welcomeTitle = 'Welcome to MOH Command Centre';
      this.pictureUrl = null;
      this.initials = 'U';
    }
  }

  onAvatarError() {
    this.pictureUrl = null; // fallback to initials
  }
}
