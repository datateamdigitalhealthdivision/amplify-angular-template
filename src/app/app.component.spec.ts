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
    // theme from storage
    const saved = localStorage.getItem('mohcc_theme');
    if (saved === 'dark') document.body.classList.add('dark');
    if (saved === 'light') document.body.classList.remove('dark');
    this.isDark = document.body.classList.contains('dark');

    // user profile
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

    // If no remote pic, try local asset named by email local-part
    this.pictureUrl = pic ? pic : (local ? `assets/profiles/${local}.png` : null);

    // Initials fallback
    const base = this.displayName.replace(/^Dr\s+/i, '').trim();
    const parts = base.split(/\s+/).filter(Boolean);
    const a = (parts[0]?.[0] || '').toUpperCase();
    const b = (parts[1]?.[0] || '').toUpperCase();
    this.initialsText = (a + b) || 'U';

    // Store for Home page to read (keeps Home simple/stable)
    localStorage.setItem('mohcc_displayName', this.displayName);
    localStorage.setItem('mohcc_initials', this.initialsText);
    if (this.pictureUrl) localStorage.setItem('mohcc_pictureUrl', this.pictureUrl);
    else localStorage.removeItem('mohcc_pictureUrl');
  }

  onAvatarError() {
    this.pictureUrl = null;
    localStorage.removeItem('mohcc_pictureUrl');
  }
}
