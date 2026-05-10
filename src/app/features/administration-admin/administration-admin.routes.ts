import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'reports',
    pathMatch: 'full'
  },
  {
    path: 'builder',
    loadComponent: () => import('./pages/report-builder.component').then(m => m.ReportBuilderComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports-management.component').then(m => m.ReportsManagementComponent)
  },
  {
    path: 'review/:id',
    loadComponent: () => import('./pages/report-review.component').then(m => m.ReportReviewComponent)
  }
];
