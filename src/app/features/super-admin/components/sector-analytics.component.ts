import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-sector-analytics',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      <!-- Bar Chart: External Entities per Entity -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-bold text-capmas-primary mb-4">توزيع الجهات الخارجية على الإدارات العامة</h3>
        <div class="h-64">
          <canvas baseChart
                  [data]="barChartData"
                  [options]="barChartOptions"
                  [type]="'bar'">
          </canvas>
        </div>
      </div>

      <!-- Stacked Chart: Report Statuses -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-bold text-capmas-primary mb-4">حالة التقارير داخل الإدارات العامة</h3>
        <div class="h-64">
          <canvas baseChart
                  [data]="stackedChartData"
                  [options]="stackedChartOptions"
                  [type]="'bar'">
          </canvas>
        </div>
      </div>

    </div>
  `
})
export class SectorAnalyticsComponent {
  // Chart 1: Bar Chart (Institutions per sector)
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    }
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['إدارة تقنية المعلومات', 'إدارة الشؤون المالية', 'إدارة التخطيط', 'إدارة الموارد', 'إدارة العمليات'],
    datasets: [
      { 
        data: [45, 30, 25, 20, 25], 
        label: 'الجهات الخارجية التابعة',
        backgroundColor: '#0986ED',
        borderRadius: 4
      }
    ]
  };

  // Chart 2: Stacked Chart (Report Statuses)
  public stackedChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, beginAtZero: true }
    }
  };

  public stackedChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['إدارة تقنية المعلومات', 'إدارة الشؤون المالية', 'إدارة التخطيط', 'إدارة الموارد', 'إدارة العمليات'],
    datasets: [
      { data: [120, 90, 60, 45, 50], label: 'معتمدة', backgroundColor: '#10B981' },
      { data: [30, 20, 15, 10, 5], label: 'قيد المراجعة', backgroundColor: '#F59E0B' },
      { data: [10, 5, 2, 1, 3], label: 'متأخرة', backgroundColor: '#EF4444' }
    ]
  };
}
