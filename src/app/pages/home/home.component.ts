import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="max-width: 900px; margin: 40px auto; padding: 0 16px;">
      <h1>MOH Management Portal</h1>
      <p>Sign in to view dashboards.</p>

      <a routerLink="/dashboards">Go to dashboards</a>
    </div>
  `,
})
export class HomeComponent {}
