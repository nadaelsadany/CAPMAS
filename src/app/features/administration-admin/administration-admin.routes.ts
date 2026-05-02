import { Routes } from '@angular/router';
import { AdministrationAdminComponent } from './administration-admin.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard.component').then(m => m.AdministrationDashboardComponent)
  },
  {
    path: 'builder',
    loadComponent: () => import('./pages/report-builder.component').then(m => m.ReportBuilderComponent)
  },
  {
    path: 'review/:id',
    loadComponent: () => import('./pages/report-review.component').then(m => m.ReportReviewComponent)
  }
];
