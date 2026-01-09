import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

type DashboardLink = {
  id: string;
  title: string;
  embedUrl: string;
};

@Component({
  selector: 'app-dashboards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="max-width: 1200px; margin: 24px auto; padding: 0 16px;">
      <h1>Dashboards</h1>

      <div style="display:flex; flex-wrap:wrap; gap:12px; margin: 12px 0 16px;">
        <button
          *ngFor="let d of dashboards"
          (click)="select(d)"
          [disabled]="!d.embedUrl"
          [style.opacity]="d.embedUrl ? '1' : '0.5'"
          [style.cursor]="d.embedUrl ? 'pointer' : 'not-allowed'"
          [style.border]="selected?.id === d.id ? '2px solid #111' : '1px solid #ccc'"
          style="padding:10px 12px; border-radius:10px; background:#fff;">
          {{ d.title }}
        </button>
      </div>

      <div *ngIf="safeUrl; else chooseOne"
           style="border:1px solid #ddd; border-radius:14px; overflow:hidden;">
        <iframe
          [src]="safeUrl"
          width="100%"
          height="760"
          style="border:0; display:block;"
          allowfullscreen
        ></iframe>
      </div>

      <ng-template #chooseOne>
        <p>Select a dashboard above.</p>
      </ng-template>
    </div>
  `,
})
export class DashboardsComponent {
  dashboards: DashboardLink[] = [
    {
      id: 'ncd',
      title: 'Non-Communicable Disease Tracker',
      embedUrl:
        'https://us-east-1.quicksight.aws.amazon.com/sn/embed/share/accounts/405062307026/dashboards/0c71a62b-9891-487f-8866-e1c8491664bc?directory_alias=atikahnasir',
    },
    { id: 'ceo', title: 'CEO Overview (coming soon)', embedUrl: '' },
    { id: 'ops', title: 'Ops & Throughput (coming soon)', embedUrl: '' },
    { id: 'quality', title: 'Clinical Quality (coming soon)', embedUrl: '' },
    { id: 'finance', title: 'Finance (coming soon)', embedUrl: '' },
    { id: 'workforce', title: 'Workforce (coming soon)', embedUrl: '' },
  ];

  selected: DashboardLink | null = null;
  safeUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  select(d: DashboardLink) {
    if (!d.embedUrl) return;
    this.selected = d;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(d.embedUrl);
  }
}
