import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'dashboards',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboards/dashboards.component').then((m) => m.DashboardsComponent),
  },
  { path: '**', redirectTo: '' },
];
