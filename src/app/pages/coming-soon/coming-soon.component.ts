import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="card">
        <h2>Coming Soon!</h2>
        <p class="muted">This dashboard is under development. Please check back later.</p>
        <a routerLink="/" class="ghost-link">Back to catalogue</a>
      </div>
    </div>
  `,
})
export class ComingSoonComponent {}
