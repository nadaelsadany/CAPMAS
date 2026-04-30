import { Component } from '@angular/core';

@Component({
  selector: 'app-institution-mapping',
  standalone: true,
  template: `
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <h3 class="text-xl font-bold text-capmas-primary mb-6">خريطة العلاقات الهيكلية</h3>
      
      <div class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 relative py-4">
        
        <!-- Background Connecting Line -->
        <div class="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
        <div class="md:hidden absolute top-0 bottom-0 left-1/2 w-1 bg-gray-200 -z-10 transform -translate-x-1/2"></div>

        <!-- General Administration Node -->
        <div class="flex flex-col items-center bg-white z-10">
          <div class="w-32 h-20 bg-capmas-primary text-white rounded-lg shadow-md flex flex-col justify-center items-center border-b-4 border-capmas-secondary">
            <span class="text-sm opacity-80">الإدارة العامة</span>
            <span class="font-bold text-center leading-tight">إدارة تقنية المعلومات</span>
          </div>
        </div>

        <!-- External Entities Node (Multiple) -->
        <div class="flex flex-col gap-4 bg-white z-10 p-2">
          <div class="w-48 h-12 bg-gray-50 border border-gray-300 rounded shadow-sm flex items-center justify-center relative">
            <span class="absolute -right-8 w-8 h-px bg-gray-300 hidden md:block"></span>
            <span class="text-capmas-primary font-semibold">جهة خارجية أ</span>
          </div>
          <div class="w-48 h-12 bg-gray-50 border border-gray-300 rounded shadow-sm flex items-center justify-center relative">
            <span class="absolute -right-8 w-8 h-px bg-gray-300 hidden md:block"></span>
            <span class="absolute -left-8 w-8 h-px bg-gray-300 hidden md:block"></span>
            <span class="text-capmas-primary font-semibold">جهة خارجية ب</span>
          </div>
          <div class="w-48 h-12 bg-gray-50 border border-gray-300 rounded shadow-sm flex items-center justify-center relative">
            <span class="absolute -right-8 w-8 h-px bg-gray-300 hidden md:block"></span>
            <span class="text-capmas-primary font-semibold">جهة خارجية ج</span>
          </div>
        </div>

        <!-- Reviewers Node -->
        <div class="flex flex-col gap-4 bg-white z-10">
          <div class="w-32 h-16 bg-capmas-light border-l-4 border-capmas-accent rounded shadow flex flex-col items-center justify-center">
            <span class="text-xs text-gray-500">المراجع</span>
            <span class="font-bold text-capmas-dark">أحمد محمود</span>
          </div>
          <div class="w-32 h-16 bg-capmas-light border-l-4 border-capmas-accent rounded shadow flex flex-col items-center justify-center">
             <span class="text-xs text-gray-500">المراجع</span>
             <span class="font-bold text-capmas-dark">سارة علي</span>
          </div>
        </div>

      </div>
      <p class="text-sm text-gray-400 text-center mt-4">عينة توضيحية لتدفق البيانات ومسار المراجعة داخل الإدارة العامة الواحدة.</p>
    </div>
  `
})
export class InstitutionMappingComponent {}
