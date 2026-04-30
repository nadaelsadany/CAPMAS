import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-arabic font-bold text-gray-800 mb-2">إدارة المستخدمين</h1>
        </div>
        
        <button class="bg-capmas-primary hover:bg-opacity-90 text-white px-6 py-2.5 rounded shadow-sm font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          مستخدم جديد
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white p-4 rounded-t-xl border-b border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        <h2 class="text-lg font-bold text-gray-700">نظام إدارة المستخدمين</h2>
        
        <div class="relative w-full md:w-96">
          <input type="text" placeholder="بحث بالاسم أو البريد..." class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-capmas-primary focus:ring-1 focus:ring-capmas-primary text-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-b-xl shadow-sm overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
          <table class="w-full text-center">
            <thead class="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm">
              <tr>
                <th class="p-4 font-bold">الاسم</th>
                <th class="p-4 font-bold">الدور</th>
                <th class="p-4 font-bold">الإدارة العامة</th>
                <th class="p-4 font-bold">الجهة الخارجية</th>
                <th class="p-4 font-bold">تاريخ الانضمام</th>
                <th class="p-4 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm">
              
              <!-- User Row 1 -->
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-bold text-gray-800">أحمد محمود</td>
                <td class="p-4"><span class="bg-[#e0f2fe] text-[#0369a1] px-3 py-1 rounded-full font-bold">مدير نظام</span></td>
                <td class="p-4 text-gray-500">-</td>
                <td class="p-4 text-gray-500">-</td>
                <td class="p-4 text-gray-800 font-semibold" dir="ltr">2024/10/26</td>
                <td class="p-4 flex justify-center">
                  <span class="bg-[#dcfce7] text-[#15803d] px-3 py-1 rounded-full font-bold flex items-center gap-1 w-max">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                    نشط
                  </span>
                </td>
              </tr>

              <!-- User Row 2 -->
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-bold text-gray-800">سارة علي</td>
                <td class="p-4"><span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-bold">مدير إدارة</span></td>
                <td class="p-4 text-gray-800 font-semibold">إدارة تقنية المعلومات</td>
                <td class="p-4 text-gray-500">-</td>
                <td class="p-4 text-gray-800 font-semibold" dir="ltr">2024/10/26</td>
                <td class="p-4 flex justify-center">
                  <span class="bg-[#dcfce7] text-[#15803d] px-3 py-1 rounded-full font-bold flex items-center gap-1 w-max">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                    نشط
                  </span>
                </td>
              </tr>

              <!-- User Row 3 -->
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-bold text-gray-800">خالد حسن</td>
                <td class="p-4"><span class="bg-[#fef3c7] text-[#d97706] px-3 py-1 rounded-full font-bold">مراجع جهة خارجية</span></td>
                <td class="p-4 text-gray-800 font-semibold">إدارة التخطيط</td>
                <td class="p-4 text-gray-800 font-semibold">جهة خارجية أ</td>
                <td class="p-4 text-gray-800 font-semibold" dir="ltr">2024/10/26</td>
                <td class="p-4 flex justify-center">
                  <span class="bg-[#fee2e2] text-[#b91c1c] px-3 py-1 rounded-full font-bold flex items-center gap-1 w-max">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" /></svg>
                    موقوف
                  </span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class UsersManagementComponent {}
