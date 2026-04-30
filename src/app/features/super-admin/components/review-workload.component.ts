import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-review-workload',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      <!-- Horizontal Bar Chart -->
      <div class="bg-white p-6 rounded-lg shadow lg:col-span-2">
        <h3 class="text-xl font-bold text-capmas-primary mb-4">عبء المراجعة حسب الإدارة العامة</h3>
        <div class="h-64">
          <canvas baseChart
                  [data]="workloadChartData"
                  [options]="workloadChartOptions"
                  [type]="'bar'">
          </canvas>
        </div>
      </div>

      <!-- Heat Indicators (Pressure) -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-bold text-capmas-primary mb-6">مؤشرات الضغط</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-red-50 rounded border border-red-100">
            <span class="font-semibold text-gray-700">إدارة التخطيط</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-red-600">عالي</span>
              <span class="w-3 h-3 rounded-full bg-red-500 shadow animate-pulse"></span>
            </div>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-100">
            <span class="font-semibold text-gray-700">إدارة العمليات</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-yellow-600">متوسط</span>
              <span class="w-3 h-3 rounded-full bg-yellow-500 shadow"></span>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-green-50 rounded border border-green-100">
            <span class="font-semibold text-gray-700">إدارة تقنية المعلومات</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-green-600">طبيعي</span>
              <span class="w-3 h-3 rounded-full bg-green-500 shadow"></span>
            </div>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-green-50 rounded border border-green-100">
            <span class="font-semibold text-gray-700">إدارة الشؤون المالية</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-green-600">طبيعي</span>
              <span class="w-3 h-3 rounded-full bg-green-500 shadow"></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class ReviewWorkloadComponent {
  public workloadChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y', // Makes the bar chart horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { beginAtZero: true },
      y: { grid: { display: false } }
    }
  };

  public workloadChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['التخطيط', 'العمليات', 'تقنية المعلومات', 'المالية', 'الموارد'],
    datasets: [
      { 
        data: [450, 320, 150, 110, 80], 
        label: 'عدد التقارير لكل إدارة عامة',
        backgroundColor: [
          '#EF4444', // High pressure
          '#F59E0B', // Medium
          '#10B981', // Normal
          '#10B981', 
          '#10B981'
        ],
        borderRadius: 4
      }
    ]
  };
}
