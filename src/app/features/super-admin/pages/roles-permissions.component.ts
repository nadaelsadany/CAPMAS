import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles-permissions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-arabic font-bold text-capmas-primary mb-2">الصلاحيات والأدوار</h1>
          <p class="text-gray-500">إدارة الأدوار وصلاحيات الوصول على مستوى المنصة بأكملها.</p>
        </div>
        <button class="bg-capmas-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-2xl shadow-lg transition-all font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إنشاء دور جديد
        </button>
      </div>

      <div class="bg-white rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden border border-gray-50">
        <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">الأدوار الحالية</h2>
        </div>
        <div class="p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div class="w-20 h-20 bg-blue-50 text-capmas-primary rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800">جاري تطوير هذه الصفحة</h3>
          <p class="text-gray-500 max-w-md">ستتيح لك هذه الصفحة إدارة الأدوار وتحديد الصلاحيات المخصصة لكل دور في النظام بدقة.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class RolesPermissionsComponent {}
