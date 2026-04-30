import { Routes } from '@angular/router';
import { AdministrationAdminComponent } from './administration-admin.component';

export const routes: Routes = [
  {
    path: '',
    component: AdministrationAdminComponent
  },
  {
    path: 'builder',
    loadComponent: () => import('./pages/report-builder.component').then(m => m.ReportBuilderComponent)
  }
];
