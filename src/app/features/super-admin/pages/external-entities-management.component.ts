import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-external-entities-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-arabic font-bold text-capmas-primary mb-2">الجهات الخارجية</h1>
          <p class="text-gray-500">إدارة الجهات الخارجية، ربطها بالإدارات، ومتابعة تقاريرها المرفوعة.</p>
        </div>
        
        <button class="bg-capmas-primary hover:bg-opacity-90 text-white px-6 py-2 rounded shadow transition-colors font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إنشاء جهة خارجية جديدة
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow mb-6 flex gap-4 border border-gray-100">
        <input type="text" placeholder="بحث باسم الجهة..." class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-capmas-primary">
        <select class="p-2 border border-gray-300 rounded focus:outline-none focus:border-capmas-primary min-w-[200px]">
          <option>جميع الإدارات العامة</option>
          <option>إدارة تقنية المعلومات</option>
          <option>إدارة التخطيط</option>
        </select>
        <button class="bg-gray-100 px-4 py-2 rounded border border-gray-300 hover:bg-gray-200">تصفية</button>
      </div>

      <!-- Entities Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
          <table class="w-full text-right">
            <thead class="bg-gray-50 border-b border-gray-200 text-capmas-primary">
              <tr>
                <th class="p-4 font-semibold">اسم الجهة الخارجية</th>
                <th class="p-4 font-semibold">الإدارة العامة المرتبطة</th>
                <th class="p-4 font-semibold text-center">المستخدمين</th>
                <th class="p-4 font-semibold text-center">التقارير المرسلة</th>
                <th class="p-4 font-semibold">آخر نشاط</th>
                <th class="p-4 font-semibold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-bold text-gray-800">مستشفى الأمل العام</td>
                <td class="p-4"><span class="bg-blue-50 text-capmas-primary px-2 py-1 rounded text-sm">إدارة تقنية المعلومات</span></td>
                <td class="p-4 text-center font-semibold">3</td>
                <td class="p-4 text-center">
                   <div class="font-bold text-lg">24</div>
                   <div class="text-xs text-green-600">20 معتمدة</div>
                </td>
                <td class="p-4 text-sm text-gray-600">أمس، 02:00 م<br><span class="text-xs text-gray-400">إرسال تقرير شهري</span></td>
                <td class="p-4 text-center">
                  <button class="text-capmas-primary hover:underline text-sm font-semibold">التفاصيل</button>
                </td>
              </tr>

              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-bold text-gray-800">مديرية التعليم الأساسي</td>
                <td class="p-4"><span class="bg-blue-50 text-capmas-primary px-2 py-1 rounded text-sm">إدارة التخطيط</span></td>
                <td class="p-4 text-center font-semibold">5</td>
                <td class="p-4 text-center">
                   <div class="font-bold text-lg">12</div>
                   <div class="text-xs text-yellow-600">5 قيد المراجعة</div>
                </td>
                <td class="p-4 text-sm text-gray-600">منذ 3 أيام<br><span class="text-xs text-gray-400">تعديل بيانات الربع الأول</span></td>
                <td class="p-4 text-center">
                  <button class="text-capmas-primary hover:underline text-sm font-semibold">التفاصيل</button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ExternalEntitiesManagementComponent {}
