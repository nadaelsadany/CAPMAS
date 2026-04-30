import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-arabic font-bold text-capmas-primary mb-2">سجل النشاط (Audit Log)</h1>
          <p class="text-gray-500">متابعة دقيقة لجميع الإجراءات والتغييرات التي تمت داخل منصة تبادل البيانات.</p>
        </div>
        <button class="bg-gray-100 px-4 py-2 rounded border border-gray-300 hover:bg-gray-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          تصدير السجل
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-100">
        <input type="date" class="p-2 border border-gray-300 rounded focus:outline-none focus:border-capmas-primary">
        <select class="p-2 border border-gray-300 rounded focus:outline-none focus:border-capmas-primary">
          <option>جميع الإجراءات</option>
          <option>إنشاء</option>
          <option>تعديل</option>
          <option>ربط</option>
          <option>اعتماد</option>
        </select>
        <input type="text" placeholder="بحث باسم المستخدم..." class="p-2 border border-gray-300 rounded focus:outline-none focus:border-capmas-primary md:col-span-2">
      </div>

      <!-- Audit Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
          <table class="w-full text-right">
            <thead class="bg-gray-50 border-b border-gray-200 text-capmas-primary">
              <tr>
                <th class="p-4 font-semibold">التاريخ والوقت</th>
                <th class="p-4 font-semibold">المستخدم</th>
                <th class="p-4 font-semibold">نوع الإجراء</th>
                <th class="p-4 font-semibold">الجهة / الإدارة المرتبطة</th>
                <th class="p-4 font-semibold">التفاصيل</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              
              <!-- Log Row 1 -->
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 text-sm text-gray-600" dir="ltr" style="text-align: right;">28 Apr 2026, 14:30</td>
                <td class="p-4">
                  <div class="font-bold text-gray-800">أحمد محمود</div>
                  <div class="text-xs text-gray-500">Super Admin</div>
                </td>
                <td class="p-4"><span class="bg-blue-100 text-capmas-primary text-xs px-2 py-1 rounded-full font-bold">ربط</span></td>
                <td class="p-4 text-gray-800 font-semibold">مستشفى الأمل العام</td>
                <td class="p-4 text-sm text-gray-600">تم ربط الجهة الخارجية بـ "إدارة تقنية المعلومات".</td>
              </tr>

              <!-- Log Row 2 -->
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 text-sm text-gray-600" dir="ltr" style="text-align: right;">28 Apr 2026, 11:15</td>
                <td class="p-4">
                  <div class="font-bold text-gray-800">سارة علي</div>
                  <div class="text-xs text-gray-500">Sector Admin</div>
                </td>
                <td class="p-4"><span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">اعتماد</span></td>
                <td class="p-4 text-gray-800 font-semibold">مديرية التعليم الأساسي</td>
                <td class="p-4 text-sm text-gray-600">تم اعتماد التقرير المالي للربع الأول بنجاح.</td>
              </tr>

              <!-- Log Row 3 -->
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 text-sm text-gray-600" dir="ltr" style="text-align: right;">27 Apr 2026, 09:00</td>
                <td class="p-4">
                  <div class="font-bold text-gray-800">أحمد محمود</div>
                  <div class="text-xs text-gray-500">Super Admin</div>
                </td>
                <td class="p-4"><span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-bold">إنشاء</span></td>
                <td class="p-4 text-gray-800 font-semibold">إدارة الموارد البشرية</td>
                <td class="p-4 text-sm text-gray-600">تم إنشاء إدارة عامة جديدة وإضافتها للنظام.</td>
              </tr>
              
              <!-- Log Row 4 -->
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 text-sm text-gray-600" dir="ltr" style="text-align: right;">26 Apr 2026, 16:45</td>
                <td class="p-4">
                  <div class="font-bold text-gray-800">سارة علي</div>
                  <div class="text-xs text-gray-500">Sector Admin</div>
                </td>
                <td class="p-4"><span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">تعديل</span></td>
                <td class="p-4 text-gray-800 font-semibold">جهة خارجية ج</td>
                <td class="p-4 text-sm text-gray-600">تم إرجاع التقرير الإحصائي لوجود نواقص في البيانات.</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  `
})
export class AuditLogComponent {}
