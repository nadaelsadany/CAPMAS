import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard.component').then(m => m.EntityDashboardComponent)
  },
  {
    path: 'portal/:adminId',
    loadComponent: () => import('./pages/portal.component').then(m => m.EntityPortalComponent)
  },
  {
    path: 'submit/:reportId',
    loadComponent: () => import('./pages/data-entry.component').then(m => m.EntityDataEntryComponent)
  }
];
