import { Routes } from '@angular/router';
import { DecisionMakerComponent } from './decision-maker.component';

export const routes: Routes = [
  {
    path: '',
    component: DecisionMakerComponent
  },
  {
    path: 'administrations',
    loadComponent: () => import('../super-admin/pages/administrations-management.component').then(m => m.AdministrationsManagementComponent)
  },
  {
    path: 'administrations/:id',
    loadComponent: () => import('../super-admin/pages/administration-details.component').then(m => m.AdministrationDetailsComponent)
  },
  {
    path: 'administrations/:id/entities/:entityId',
    loadComponent: () => import('../super-admin/pages/external-entity-details.component').then(m => m.ExternalEntityDetailsComponent)
  },
  {
    path: 'external-entities',
    loadComponent: () => import('../super-admin/pages/external-entities-management.component').then(m => m.ExternalEntitiesManagementComponent)
  },
  {
    path: 'external-entities/:entityId',
    loadComponent: () => import('../super-admin/pages/external-entity-details.component').then(m => m.ExternalEntityDetailsComponent)
  }
];
