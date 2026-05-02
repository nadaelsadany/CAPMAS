import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout.component';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'super-admin', // Default redirect for testing
        pathMatch: 'full'
      },
      {
        path: 'super-admin',
        canActivate: [roleGuard(['SUPER_ADMIN'])],
        loadChildren: () => import('./features/super-admin/super-admin.routes').then(m => m.routes)
      },
      {
        path: 'administration-admin',
        canActivate: [roleGuard(['ADMINISTRATION_ADMIN', 'ADMINISTRATION_REVIEWER'])],
        loadChildren: () => import('./features/administration-admin/administration-admin.routes').then(m => m.routes)
      },
      {
        path: 'external-entity-admin',
        canActivate: [roleGuard(['EXTERNAL_ENTITY_ADMIN'])],
        loadChildren: () => import('./features/external-entity-admin/external-entity-admin.routes').then(m => m.routes)
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/settings/pages/settings-layout.component').then(m => m.SettingsLayoutComponent)
          },
          {
            path: 'all-notifications',
            loadComponent: () => import('./features/settings/pages/notifications-page.component').then(m => m.NotificationsPageComponent)
          }
        ]
      }
    ]
  },
  {
    path: 'unauthorized',
    component: MainLayoutComponent, // Simple mock for unauthorized state
    children: [
      {
        path: '',
        loadComponent: () => import('@angular/core').then(m => {
          @m.Component({
            standalone: true,
            template: '<div class="p-10 text-center"><h1 class="text-4xl text-red-500 font-bold mb-4">غير مصرح لك بالوصول</h1><p>ليس لديك الصلاحيات الكافية لعرض هذه الصفحة.</p></div>'
          })
          class UnauthorizedComponent {}
          return UnauthorizedComponent;
        })
      }
    ]
  }
];
