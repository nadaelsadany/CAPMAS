import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-administration-admin',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      
      <!-- Top Actions -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold font-arabic text-capmas-dark">لوحة القيادة Dashboard</h1>
        <div class="flex gap-4">
          <button class="bg-capmas-primary text-white px-6 py-2 rounded-lg shadow-sm font-semibold hover:bg-opacity-90 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            تكوين تقرير جديد
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <!-- KPI 1 -->
        <div class="bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
          <div class="absolute top-4 right-4 text-capmas-secondary">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
          </div>
          <h3 class="text-sm font-bold text-gray-800 mb-2 mt-4">التقارير المعلقة</h3>
          <p class="text-4xl font-bold text-capmas-primary mb-2">28</p>
          <p class="text-sm text-gray-500 font-semibold">يحتاج للمراجعة</p>
        </div>

        <!-- KPI 2 -->
        <div class="bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
          <div class="absolute top-4 right-4 text-capmas-secondary">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
          </div>
          <h3 class="text-sm font-bold text-gray-800 mb-2 mt-4">نسبة الالتزام</h3>
          <p class="text-4xl font-bold text-capmas-dark mb-2">92%</p>
          <p class="text-sm text-green-500 font-bold">تحسن بنسبة 5%</p>
        </div>

        <!-- KPI 3 -->
        <div class="bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
          <div class="absolute top-4 right-4 text-capmas-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
          </div>
          <h3 class="text-sm font-bold text-gray-800 mb-2 mt-4">الجهات النشطة</h3>
          <p class="text-4xl font-bold text-capmas-dark mb-2">45</p>
          <p class="text-sm text-green-500 font-bold">+8% YoY</p>
        </div>

        <!-- KPI 4 -->
        <div class="bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
          <div class="absolute top-4 right-4 text-capmas-secondary">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          </div>
          <h3 class="text-sm font-bold text-gray-800 mb-2 mt-4">تقارير متأخرة</h3>
          <p class="text-4xl font-bold text-capmas-dark mb-2">12</p>
          <p class="text-sm text-red-500 font-bold">+15% YoY</p>
        </div>

      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        <!-- Line Chart -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-center mb-6">اتجاهات تقديم التقارير</h3>
          <div class="h-64">
             <canvas baseChart
                     [data]="lineChartData"
                     [options]="lineChartOptions"
                     [type]="'line'">
             </canvas>
          </div>
        </div>

        <!-- Bar Chart -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-center mb-6">مقارنة التقارير حسب الجهة</h3>
          <div class="h-64">
             <canvas baseChart
                     [data]="barChartData"
                     [options]="barChartOptions"
                     [type]="'bar'">
             </canvas>
          </div>
        </div>

      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-xl font-bold text-gray-800">قائمة التقارير المعلقة للمراجعة</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-right">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="p-4 font-bold text-gray-700">عنوان التقرير</th>
                <th class="p-4 font-bold text-gray-700 text-center">تاريخ الإصدار</th>
                <th class="p-4 font-bold text-gray-700 text-center">الجهة المسؤولة</th>
                <th class="p-4 font-bold text-gray-700 text-center">الأولوية</th>
                <th class="p-4 font-bold text-gray-700 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-bold text-gray-800">تقرير التجارة الخارجية - الربع الثالث</td>
                <td class="p-4 text-center text-gray-600 font-semibold" dir="ltr">2023/3/21</td>
                <td class="p-4 text-center font-bold text-gray-700">هيئة الجمارك</td>
                <td class="p-4 text-center">
                  <span class="text-red-500 font-bold">عالية</span>
                </td>
                <td class="p-4 text-center flex justify-center gap-2">
                  <button class="border border-gray-300 text-gray-600 font-bold px-4 py-1.5 rounded hover:bg-gray-100">تنزيل</button>
                  <button class="bg-capmas-primary text-white font-bold px-4 py-1.5 rounded hover:bg-opacity-90">مراجعة</button>
                </td>
              </tr>

              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-bold text-gray-800">تقرير التبادل التجاري مع دول أفريقيا</td>
                <td class="p-4 text-center text-gray-600 font-semibold" dir="ltr">2023/2/21</td>
                <td class="p-4 text-center font-bold text-gray-700">التمثيل التجاري</td>
                <td class="p-4 text-center">
                  <span class="text-yellow-500 font-bold">متوسطة</span>
                </td>
                <td class="p-4 text-center flex justify-center gap-2">
                  <button class="border border-gray-300 text-gray-600 font-bold px-4 py-1.5 rounded hover:bg-gray-100">تنزيل</button>
                  <button class="bg-capmas-primary text-white font-bold px-4 py-1.5 rounded hover:bg-opacity-90">مراجعة</button>
                </td>
              </tr>

              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-bold text-gray-800">تقرير واردات السلع الرأسمالية</td>
                <td class="p-4 text-center text-gray-600 font-semibold" dir="ltr">2023/3/21</td>
                <td class="p-4 text-center font-bold text-gray-700">وزارة التخطيط</td>
                <td class="p-4 text-center">
                  <span class="text-red-500 font-bold">عالية</span>
                </td>
                <td class="p-4 text-center flex justify-center gap-2">
                  <button class="border border-gray-300 text-gray-600 font-bold px-4 py-1.5 rounded hover:bg-gray-100">تنزيل</button>
                  <button class="bg-capmas-primary text-white font-bold px-4 py-1.5 rounded hover:bg-opacity-90">مراجعة</button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class AdministrationAdminComponent {
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4 },
      point: { radius: 0 }
    },
    scales: {
      y: { border: { display: false }, grid: { color: '#f3f4f6' } },
      x: { border: { display: false }, grid: { display: false } }
    },
    plugins: { legend: { position: 'bottom', rtl: true } }
  };

  public lineChartData: ChartConfiguration['data'] = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        data: [2.5, 2.8, 2.4, 3.2, 3.8, 3.5],
        label: 'التقارير المعتمدة',
        borderColor: '#1e3a8a',
        backgroundColor: 'rgba(30, 58, 138, 0.1)',
        fill: true
      },
      {
        data: [1.5, 1.9, 1.4, 2.1, 2.8, 2.2],
        label: 'التقارير المرفوضة',
        borderColor: '#7dd3fc',
        backgroundColor: 'transparent',
        fill: false
      }
    ]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { border: { display: false }, grid: { color: '#f3f4f6' } },
      x: { border: { display: false }, grid: { display: false } }
    },
    plugins: { legend: { position: 'bottom', rtl: true } }
  };

  public barChartData: ChartConfiguration['data'] = {
    labels: ['الجهة أ', 'الجهة ب', 'الجهة ج', 'الجهة د'],
    datasets: [
      { data: [8000, 5500, 3200, 2400], label: 'معتمدة', backgroundColor: '#1e3a8a' },
      { data: [6200, 7200, 4800, 1500], label: 'متأخرة', backgroundColor: '#94a3b8' }
    ]
  };
}
