import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fetchUserAttributes } from 'aws-amplify/auth';

function normaliseDisplayName(name?: string, email?: string) {
  const raw = (name || '').trim();
  if (raw) {
    return /^dr\b/i.test(raw) ? raw : `Dr ${raw}`;
  }

  if (!email) return 'User';
  const local = email.split('@')[0] || email;
  const cleaned = local.replace(/\.[a-z]$/i, '').replace(/[._-]+/g, ' ');
  const nice = cleaned
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return nice ? `Dr ${nice}` : 'User';
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
  <header class="hdr">
    <div class="hdr-left">
      <img class="logo" src="assets/moh-logo.png" alt="MOH" />
      <div class="title">MOH Command Centre</div>
    </div>

    <div class="hdr-right">
      <button class="iconbtn" type="button" (click)="toggleTheme.emit()" aria-label="Toggle theme">
        <svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true" *ngIf="isDark; else moon">
          <!-- Sun -->
          <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM3 11a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm16 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1ZM5.64 4.22a1 1 0 0 1 1.41 0l.7.7A1 1 0 1 1 6.34 6.34l-.7-.7a1 1 0 0 1 0-1.42Zm10.61 10.61a1 1 0 0 1 1.41 0l.7.7a1 1 0 1 1-1.41 1.41l-.7-.7a1 1 0 0 1 0-1.41ZM18.36 5.64a1 1 0 0 1 0 1.41l-.7.7a1 1 0 1 1-1.41-1.41l.7-.7a1 1 0 0 1 1.41 0ZM7.75 16.25a1 1 0 0 1 0 1.41l-.7.7a1 1 0 1 1-1.41-1.41l.7-.7a1 1 0 0 1 1.41 0Z"/>
        </svg>
        <ng-template #moon>
          <svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true">
            <!-- Moon -->
            <path d="M21 15.5A8.5 8.5 0 0 1 8.5 3a7 7 0 1 0 12.5 12.5Z"/>
          </svg>
        </ng-template>
      </button>

      <div class="userchip" *ngIf="displayName">
        <img
          *ngIf="pictureUrl; else initials"
          class="avatar"
          [src]="pictureUrl"
          alt="Profile"
          referrerpolicy="no-referrer"
          crossorigin="anonymous"
          (error)="onAvatarError()"
        />
        <ng-template #initials>
          <div class="avatar initials">{{ initialsText }}</div>
        </ng-template>

        <div class="username">{{ displayName }}</div>
      </div>

      <button class="ghost" type="button" (click)="signOutRequested.emit()">Sign out</button>
    </div>
  </header>
  `,
})
export class HeaderComponent implements OnInit {
  @Input() isDark = false;
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() signOutRequested = new EventEmitter<void>();

  displayName = '';
  initialsText = 'U';
  pictureUrl: string | null = null;

  async ngOnInit() {
    try {
      const attrs = await fetchUserAttributes();
      const email = (attrs['email'] || '').trim();
      const name = (attrs['name'] || '').trim();

      // Picture fallbacks (standard + common custom naming)
      const pic =
        (attrs['picture'] || '').trim() ||
        (attrs['custom:picture'] || '').trim() ||
        (attrs['custom:avatar'] || '').trim() ||
        (attrs['custom:photo'] || '').trim();

      this.displayName = normaliseDisplayName(name, email);
      this.pictureUrl = pic ? pic : null;

      const base = this.displayName.replace(/^Dr\s+/i, '').trim();
      const parts = base.split(/\s+/).filter(Boolean);
      const a = (parts[0]?.[0] || '').toUpperCase();
      const b = (parts[1]?.[0] || '').toUpperCase();
      this.initialsText = (a + b) || 'U';
    } catch {
      this.displayName = '';
      this.pictureUrl = null;
      this.initialsText = 'U';
    }
  }

  onAvatarError() {
    this.pictureUrl = null;
  }
}
