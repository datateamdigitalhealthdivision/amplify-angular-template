import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type CatItem = { title: string; route: string; iconPath: string; };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">

      <div class="card">
        <div class="welcome-row">
          <div class="welcome-left">
            <h1 style="margin:0 0 6px 0;">Welcome to MOH Command Centre — {{ displayName }}</h1>
            <p class="muted" style="margin:0;">
              This command centre provides MOH top management with a single, secure view of key dashboards to track
              health system performance, programme delivery, facility readiness, workforce capacity, and priority outcomes —
              supporting timely decisions and consistent progress monitoring.
            </p>
          </div>

          <div class="welcome-right">
            <img
              *ngIf="pictureUrl; else initials"
              class="hero-avatar"
              [src]="pictureUrl"
              alt="Profile"
              referrerpolicy="no-referrer"
              (error)="onAvatarError()"
            />
            <ng-template #initials>
              <div class="hero-avatar hero-initials">{{ initialsText }}</div>
            </ng-template>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 style="margin:0 0 12px 0;">Dashboard Catalogue</h2>

        <div class="grid">
          <a *ngFor="let d of catalogue" class="dash-btn" [routerLink]="d.route">
            <span class="icon">
              <svg class="cat-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path [attr.d]="d.iconPath"></path>
              </svg>
            </span>
            <span class="label">{{ d.title }}</span>
          </a>
        </div>
      </div>

    </div>
  `,
})
export class HomeComponent {
  displayName = localStorage.getItem('mohcc_displayName') || 'User';
  initialsText = localStorage.getItem('mohcc_initials') || 'U';

  // You put images in src/assets/, so default to assets/<emailLocalPart>.png
  pictureUrl: string | null =
    localStorage.getItem('mohcc_pictureUrl') || 'assets/vivekjason.j.png';

  catalogue: CatItem[] = [
    { title: 'Health Facilities Tracker', route: '/dashboards/hf', iconPath: 'M4 10.5V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9.5L12 3 4 10.5Zm7 10.5v-5h2v5h-2Zm-2-7v-2h2v2H9Zm4 0v-2h2v2h-2Z' },
    { title: 'Human Resources Tracker', route: '/dashboards/hr', iconPath: 'M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm-12 10a6 6 0 0 1 12 0v1H4v-1Zm13.5-7.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM20 22v-1a7.9 7.9 0 0 0-2.2-5.4A5.9 5.9 0 0 1 22 21v1h-2Z' },
    { title: 'Digitalisation Initiatives Tracker', route: '/dashboards/dig', iconPath: 'M7 2h10a2 2 0 0 1 2 2v3H5V4a2 2 0 0 1 2-2Zm-2 7h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9Zm5 2v2h4v-2H10Zm-1 4v2h6v-2H9Z' },
    { title: 'Communicable Disease Tracker', route: '/dashboards/cd', iconPath: 'M12 2a2 2 0 0 1 2 2v1.1a7.1 7.1 0 0 1 2.5 1.1l.8-.8a2 2 0 1 1 2.8 2.8l-.8.8A7.1 7.1 0 0 1 19.9 12H21a2 2 0 1 1 0 4h-1.1a7.1 7.1 0 0 1-1.1 2.5l.8.8a2 2 0 1 1-2.8 2.8l-.8-.8A7.1 7.1 0 0 1 14 18.9V20a2 2 0 1 1-4 0v-1.1a7.1 7.1 0 0 1-2.5-1.1l-.8.8a2 2 0 1 1-2.8-2.8l.8-.8A7.1 7.1 0 0 1 4.1 16H3a2 2 0 1 1 0-4h1.1a7.1 7.1 0 0 1 1.1-2.5l-.8-.8a2 2 0 1 1 2.8-2.8l.8.8A7.1 7.1 0 0 1 10 5.1V4a2 2 0 0 1 2-2Zm0 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z' },
    { title: 'Non-Communicable Disease Tracker', route: '/dashboards/ncd', iconPath: 'M12 21s-6.7-4.3-9.3-8.4C.7 9.1 2.3 6 5.6 6c1.9 0 3.1 1 3.9 2 .8-1 2-2 3.9-2 3.3 0 4.9 3.1 2.9 6.6C18.7 16.7 12 21 12 21Z' },
  ];

  onAvatarError() {
    this.pictureUrl = null;
  }
}
