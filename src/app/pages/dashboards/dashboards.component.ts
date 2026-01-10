import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

      <div class="card" *ngIf="safeUrl; else missing" style="padding:0; overflow:hidden;">
        <iframe
          [src]="safeUrl"
          width="100%"
          height="760"
          style="border:0; display:block;"
          allowfullscreen
        ></iframe>
      </div>

      <ng-template #missing>
        <div class="card">
          <p>Dashboard not configured yet.</p>
        </div>
      </ng-template>
    </div>
  `,
})
export class DashboardsComponent {
  title = '';
  safeUrl: SafeResourceUrl | null = null;

  constructor(route: ActivatedRoute, sanitizer: DomSanitizer) {
    const id = route.snapshot.paramMap.get('id') || '';

    const map: Record<string, { title: string; url?: string }> = {
      hf: {
        title: 'Health Facilities Tracker',
        url: 'https://us-east-1.quicksight.aws.amazon.com/sn/embed/share/accounts/405062307026/dashboards/f3244991-af8f-4afd-a34d-b070938957bb?directory_alias=atikahnasir',
      },
      dig: {
        title: 'Digitalisation Initiatives Tracker',
        url: 'https://us-east-1.quicksight.aws.amazon.com/sn/embed/share/accounts/405062307026/dashboards/743f9b6d-a5b4-4dc6-92e5-992e9e37024a?directory_alias=atikahnasir',
      },
      cd: {
        title: 'Communicable Disease Tracker',
        url: 'https://us-east-1.quicksight.aws.amazon.com/sn/embed/share/accounts/405062307026/dashboards/086ca3a9-65a1-4297-8b78-1ce933bc4f8b?directory_alias=atikahnasir',
      },
      ncd: {
        title: 'Non-Communicable Disease Tracker',
        url: 'https://us-east-1.quicksight.aws.amazon.com/sn/embed/share/accounts/405062307026/dashboards/0c71a62b-9891-487f-8866-e1c8491664bc?directory_alias=atikahnasir',
      },
    };

    const entry = map[id];
    this.title = entry?.title || 'Dashboard';

    if (entry?.url) {
      this.safeUrl = sanitizer.bypassSecurityTrustResourceUrl(entry.url);
    }
  }
}
