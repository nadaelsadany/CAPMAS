import { Component } from '@angular/core';
import { KpiOverviewComponent } from './components/kpi-overview.component';
import { SectorAnalyticsComponent } from './components/sector-analytics.component';
import { InstitutionMappingComponent } from './components/institution-mapping.component';
import { ReviewWorkloadComponent } from './components/review-workload.component';
import { ActivityTimelineComponent } from './components/activity-timeline.component';
import { AdminActionsComponent } from './components/admin-actions.component';

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [
    KpiOverviewComponent,
    SectorAnalyticsComponent,
    InstitutionMappingComponent,
    ReviewWorkloadComponent,
    ActivityTimelineComponent,
    AdminActionsComponent
  ],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-arabic font-bold text-capmas-primary mb-2">الرئيسية (الإشراف العام)</h1>
          <p class="text-gray-500">نظرة شاملة على الإدارات العامة، الجهات الخارجية، وسير عمل المنصة.</p>
        </div>
      </div>

      <!-- Admin Actions / Quick Actions -->
      <app-admin-actions></app-admin-actions>

      <!-- KPI Overview Section -->
      <app-kpi-overview></app-kpi-overview>

      <!-- Sector Analytics (Charts) -->
      <app-sector-analytics></app-sector-analytics>

      <!-- Review Workload (Horizontal Bar & Heatmap) -->
      <app-review-workload></app-review-workload>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Institution Mapping (Hierarchy) -->
        <div class="lg:col-span-1">
           <app-institution-mapping></app-institution-mapping>
        </div>

        <!-- Recent Activity Timeline -->
        <div class="lg:col-span-1">
           <app-activity-timeline></app-activity-timeline>
        </div>
      </div>

    </div>
  `
})
export class SuperAdminComponent {}
