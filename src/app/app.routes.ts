import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },

  {
    path: 'dashboards/:id',
    loadComponent: () =>
      import('./pages/dashboards/dashboards.component').then((m) => m.DashboardsComponent),
  },

  {
    path: 'coming-soon',
    loadComponent: () =>
      import('./pages/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
  },

  { path: '**', redirectTo: 'home' },
];
