import { Component } from '@angular/core';

@Component({
  selector: 'app-kpi-overview',
  standalone: true,
  template: `
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <!-- KPI 1 -->
      <div class="bg-white p-4 rounded shadow border-t-4 border-capmas-primary flex flex-col justify-center items-center text-center">
        <h3 class="text-sm text-gray-500 font-semibold mb-2">الإدارات العامة</h3>
        <p class="text-3xl font-bold text-capmas-primary">12</p>
      </div>
      <!-- KPI 2 -->
      <div class="bg-white p-4 rounded shadow border-t-4 border-capmas-primary flex flex-col justify-center items-center text-center">
        <h3 class="text-sm text-gray-500 font-semibold mb-2">الجهات الخارجية</h3>
        <p class="text-3xl font-bold text-capmas-primary">145</p>
      </div>
      <!-- KPI 3 -->
      <div class="bg-white p-4 rounded shadow border-t-4 border-gray-400 flex flex-col justify-center items-center text-center">
        <h3 class="text-sm text-gray-500 font-semibold mb-2">إجمالي التقارير</h3>
        <p class="text-3xl font-bold text-gray-700">1,250</p>
      </div>
      <!-- KPI 4 -->
      <div class="bg-white p-4 rounded shadow border-t-4 border-green-500 flex flex-col justify-center items-center text-center">
        <h3 class="text-sm text-gray-500 font-semibold mb-2">التقارير المعتمدة</h3>
        <p class="text-3xl font-bold text-green-600">980</p>
      </div>
      <!-- KPI 5 -->
      <div class="bg-white p-4 rounded shadow border-t-4 border-yellow-500 flex flex-col justify-center items-center text-center">
        <h3 class="text-sm text-gray-500 font-semibold mb-2">قيد المراجعة</h3>
        <p class="text-3xl font-bold text-yellow-600">220</p>
      </div>
      <!-- KPI 6 -->
      <div class="bg-white p-4 rounded shadow border-t-4 border-red-500 flex flex-col justify-center items-center text-center">
        <h3 class="text-sm text-gray-500 font-semibold mb-2">التقارير المتأخرة</h3>
        <p class="text-3xl font-bold text-red-600">50</p>
      </div>
    </div>
  `
})
export class KpiOverviewComponent {}
