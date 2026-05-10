import { Routes } from '@angular/router';
import { SuperAdminComponent } from './super-admin.component';

export const routes: Routes = [
  {
    path: '',
    component: SuperAdminComponent
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users-management.component').then(m => m.UsersManagementComponent)
  },
  {
    path: 'administrations',
    loadComponent: () => import('./pages/administrations-management.component').then(m => m.AdministrationsManagementComponent)
  },
  {
    path: 'administrations/create',
    loadComponent: () => import('./pages/create-administration.component').then(m => m.CreateAdministrationComponent)
  },
  {
    path: 'administrations/:id',
    loadComponent: () => import('./pages/administration-details.component').then(m => m.AdministrationDetailsComponent)
  },
  {
    path: 'administrations/:id/entities/:entityId',
    loadComponent: () => import('./pages/external-entity-details.component').then(m => m.ExternalEntityDetailsComponent)
  },
  {
    path: 'external-entities',
    loadComponent: () => import('./pages/external-entities-management.component').then(m => m.ExternalEntitiesManagementComponent)
  },
  {
    path: 'external-entities/:entityId',
    loadComponent: () => import('./pages/external-entity-details.component').then(m => m.ExternalEntityDetailsComponent)
  },
  {
    path: 'external-entities/:entityId/reports/:reportId/config',
    loadComponent: () => import('../administration-admin/pages/report-builder.component').then(m => m.ReportBuilderComponent)
  },
  {
    path: 'roles',
    loadComponent: () => import('./pages/roles-permissions.component').then(m => m.RolesPermissionsComponent)
  },
  {
    path: 'audit-log',
    loadComponent: () => import('./pages/audit-log.component').then(m => m.AuditLogComponent)
  }
];
