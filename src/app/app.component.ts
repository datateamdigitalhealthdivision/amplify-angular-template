import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { fetchUserAttributes } from 'aws-amplify/auth';

import { AppShellComponent } from './layout/app-shell.component';

type Attrs = Partial<Record<string, string>>;

function s(v: string | undefined) {
  return (v ?? '').trim();
}

function toDisplayName(attrs: Attrs) {
  const explicit = s(attrs['name']);
  if (explicit) return /^dr\b/i.test(explicit) ? explicit : `Dr ${explicit}`;

  const email = s(attrs['email']);
  if (!email) return 'User';

  const local = email.split('@')[0] || email; // vivekjason.j
  const cleaned = local
    .replace(/\.[a-z]$/i, '')     // drop trailing ".j"
    .replace(/[._-]+/g, ' ')
    .trim();

  const nice = cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return nice ? `Dr ${nice}` : 'User';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AmplifyAuthenticatorModule, AppShellComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  isDark = false;

  displayName = 'User';
  pictureUrl: string | null = null;
  initialsText = 'U';

  ngOnInit() {
    const saved = localStorage.getItem('mohcc_theme');
    if (saved === 'dark') document.body.classList.add('dark');
    if (saved === 'light') document.body.classList.remove('dark');
    this.isDark = document.body.classList.contains('dark');

    this.loadProfile().catch(() => {});
  }

  toggleTheme() {
    document.body.classList.toggle('dark');
    this.isDark = document.body.classList.contains('dark');
    localStorage.setItem('mohcc_theme', this.isDark ? 'dark' : 'light');
  }

  async loadProfile() {
    const attrs = await fetchUserAttributes();

    this.displayName = toDisplayName(attrs);

    const pic =
      s(attrs['picture']) ||
      s(attrs['custom:picture']) ||
      s(attrs['custom:photo']) ||
      s(attrs['custom:avatar']);

    const email = s(attrs['email']);
    const local = email ? (email.split('@')[0] || '') : '';

    // If Cognito provides a usable URL, use it. Otherwise try local assets.
    // You placed images in src/assets/, so we try BOTH:
    // 1) assets/profiles/<local>.png
    // 2) assets/<local>.png
    this.pictureUrl = pic
      ? pic
      : (local ? `assets/profiles/${local}.png` : null);

    // store + set fallback
    this.persistProfile();

    // Initials fallback
    const base = this.displayName.replace(/^Dr\s+/i, '').trim();
    const parts = base.split(/\s+/).filter(Boolean);
    const a = (parts[0]?.[0] || '').toUpperCase();
    const b = (parts[1]?.[0] || '').toUpperCase();
    this.initialsText = (a + b) || 'U';

    this.persistProfile();
  }

  // Called by <img (error)=...> when an image path fails
  onAvatarError() {
    // If we were trying /profiles/, fallback to /assets/<local>.png
    const email = localStorage.getItem('mohcc_email') || '';
    const local = email ? (email.split('@')[0] || '') : '';

    if (this.pictureUrl?.includes('assets/profiles/') && local) {
      this.pictureUrl = `assets/${local}.png`;
      this.persistProfile();
      return;
    }

    // Otherwise hide avatar and show initials
    this.pictureUrl = null;
    localStorage.removeItem('mohcc_pictureUrl');
  }

  private persistProfile() {
    localStorage.setItem('mohcc_displayName', this.displayName);

    // keep email around for fallback switching
    // (we only use it to choose local asset filenames)
    // safe even if missing
    fetchUserAttributes()
      .then(a => localStorage.setItem('mohcc_email', (a['email'] ?? '').trim()))
      .catch(() => {});

    if (this.pictureUrl) localStorage.setItem('mohcc_pictureUrl', this.pictureUrl);
    else localStorage.removeItem('mohcc_pictureUrl');
  }
}
