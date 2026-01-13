import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { fetchAuthSession } from 'aws-amplify/auth';

@Component({
  selector: 'app-dashboards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="card">
        <a routerLink="/home" style="text-decoration:none;">← Back</a>
        <h1 style="margin:10px 0 6px 0;">{{ title }}</h1>
        <p class="muted" style="margin:0;">MOH Command Centre</p>
      </div>

      <div class="card" *ngIf="loading">
        <p style="margin:0;">Loading dashboard…</p>
      </div>

      <div class="card" *ngIf="error">
        <p style="margin:0; color:#b42318;"><b>Error:</b> {{ error }}</p>
      </div>

      <div class="card" *ngIf="safeUrl && !loading && !error" style="padding:0; overflow:hidden;">
        <iframe
          [src]="safeUrl"
          width="100%"
          height="760"
          style="border:0; display:block;"
          allowfullscreen
        ></iframe>
      </div>

      <div class="card" *ngIf="!safeUrl && !loading && !error">
        <p>Dashboard not configured yet.</p>
      </div>
    </div>
  `,
})
export class DashboardsComponent {
  // Your API Gateway invoke URL (no trailing slash)
  private readonly API_BASE = 'https://9mnr352qka.execute-api.ap-southeast-1.amazonaws.com';

  title = '';
  safeUrl: SafeResourceUrl | null = null;
  loading = false;
  error: string | null = null;

  constructor(route: ActivatedRoute, private sanitizer: DomSanitizer) {
    const id = route.snapshot.paramMap.get('id') || '';

    // IMPORTANT: store dashboard UUIDs only (not the share link)
    const map: Record<string, { title: string; dashboardId?: string }> = {
      hf:  { title: 'Health Facilities Tracker', dashboardId: 'f3244991-af8f-4afd-a34d-b070938957bb' },
      hr:  { title: 'Human Resources Tracker',  dashboardId: 'e86cd204-72bf-4734-bd52-0fb40cc23240' },
      dig: { title: 'Digitalisation Initiatives Tracker', dashboardId: '743f9b6d-a5b4-4dc6-92e5-992e9e37024a' },
      cd:  { title: 'Communicable Disease Tracker', dashboardId: '086ca3a9-65a1-4297-8b78-1ce933bc4f8b' },
      ncd: { title: 'Non-Communicable Disease Tracker', dashboardId: '0c71a62b-9891-487f-8866-e1c8491664bc' },
    };

    const entry = map[id];
    this.title = entry?.title || 'Dashboard';

    if (entry?.dashboardId) {
      // fire and forget (constructor can't be async)
      this.loadEmbed(entry.dashboardId);
    }
  }

  private async loadEmbed(dashboardId: string) {
    this.loading = true;
    this.error = null;
    this.safeUrl = null;

    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      if (!idToken) throw new Error('No Cognito idToken found. Please sign in again.');

      const res = await fetch(`${this.API_BASE}/embed/${dashboardId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message ? `${data.message}: ${data.detail || ''}` : 'Embed API call failed');
      }
      if (!data?.embedUrl) throw new Error('Embed API did not return embedUrl');

      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.embedUrl);
    } catch (e: any) {
      this.error = e?.message || String(e);
    } finally {
      this.loading = false;
    }
  }
}
