import { Component } from '@angular/core';
import { KpiOverviewComponent } from './components/kpi-overview.component';
import { SectorAnalyticsComponent } from './components/sector-analytics.component';
import { ReviewWorkloadComponent } from './components/review-workload.component';
import { ActivityTimelineComponent } from './components/activity-timeline.component';
import { AdminActionsComponent } from './components/admin-actions.component';

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [
    KpiOverviewComponent,
    SectorAnalyticsComponent,
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

      <!-- Recent Activity Timeline -->
      <div class="max-w-4xl">
        <app-activity-timeline></app-activity-timeline>
      </div>

    </div>
  `
})
export class SuperAdminComponent {}
