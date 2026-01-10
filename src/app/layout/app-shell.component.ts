import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="hdr">
      <div class="hdr-left">
        <a routerLink="/home" style="display:flex; align-items:center; gap:10px; text-decoration:none; color:inherit;">
          <img class="logo" src="assets/moh-logo.png" alt="MOH" />

          <!-- Home icon next to title -->
          <svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true" style="width:18px;height:18px;">
            <path d="M12 3 3 10.5V21a1 1 0 0 0 1 1h6v-7h4v7h6a1 1 0 0 0 1-1V10.5L12 3z"/>
          </svg>

          <div class="title">MOH Command Centre</div>
        </a>
      </div>

      <div class="hdr-right">
        <button class="iconbtn" type="button" (click)="toggleTheme.emit()" aria-label="Toggle theme">
          <!-- if dark -> show sun, else show moon -->
          <svg *ngIf="isDark; else moon" class="svg-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-16a1 1 0 0 1 1 1v1.2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1 1 1v1.2a1 1 0 1 1-2 0V21a1 1 0 0 1 1-1ZM3 11a1 1 0 0 1 1-1h1.2a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm16.8 0a1 1 0 0 1 1-1H22a1 1 0 1 1 0 2h-1.2a1 1 0 0 1-1-1ZM5.2 5.2a1 1 0 0 1 1.4 0l.9.9a1 1 0 1 1-1.4 1.4l-.9-.9a1 1 0 0 1 0-1.4Zm11.3 11.3a1 1 0 0 1 1.4 0l.9.9a1 1 0 1 1-1.4 1.4l-.9-.9a1 1 0 0 1 0-1.4ZM18.8 5.2a1 1 0 0 1 0 1.4l-.9.9a1 1 0 1 1-1.4-1.4l.9-.9a1 1 0 0 1 1.4 0ZM7.5 16.5a1 1 0 0 1 0 1.4l-.9.9a1 1 0 1 1-1.4-1.4l.9-.9a1 1 0 0 1 1.4 0Z"/>
          </svg>

          <ng-template #moon>
            <svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 14.5A7.5 7.5 0 0 1 9.5 3a.8.8 0 0 1 .9 1.1A6 6 0 0 0 18.8 12.6a.8.8 0 0 1 1.1.9Z"/>
            </svg>
          </ng-template>
        </button>

        <button class="ghost" type="button" (click)="signOutRequested.emit()">Sign out</button>
      </div>
    </header>

    <main>
      <ng-content></ng-content>
    </main>

    <!-- Smaller footer, pushed down -->
    <footer class="ftr" style="margin-top:28px; font-size:12px; line-height:1.35;">
      <!-- LEFT: MOH + logo -->
      <div style="display:flex; gap:10px; align-items:flex-start;">
        <img class="logo" src="assets/moh-logo.png" alt="MOH" />
        <div>
          <div style="font-weight:900;">Ministry of Health Malaysia</div>
          <div style="opacity:.9;">© 2026 Ministry of Health Malaysia</div>
        </div>
      </div>

      <!-- RIGHT: Open source metadata -->
      <div style="text-align:right;">
        <div style="font-weight:900;">Open Source</div>
        <div style="opacity:.9;">Frontend Repo: Angular</div>
        <div style="opacity:.9;">Backend: AWS Amplify</div>
        <div style="opacity:.9;">UI + UX Design: Figma</div>
        <div style="opacity:.9;">Developer: Digital Health Division</div>
      </div>
    </footer>
  `,
})
export class AppShellComponent {
  @Input() isDark = false;
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() signOutRequested = new EventEmitter<void>();
}
