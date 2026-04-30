import { Component } from '@angular/core';

@Component({
  selector: 'app-activity-timeline',
  standalone: true,
  template: `
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <h3 class="text-xl font-bold text-capmas-primary mb-6">النشاط الأخير</h3>
      
      <div class="relative border-r-2 border-gray-200 pr-6 mr-3 space-y-6">
        
        <!-- Activity 1 -->
        <div class="relative">
          <span class="absolute -right-8 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow"></span>
          <div class="mb-1 text-sm text-gray-500">منذ 10 دقائق</div>
          <div class="font-bold text-gray-800">تم اعتماد التقرير السنوي</div>
          <div class="text-sm text-gray-600">إدارة تقنية المعلومات - جهة خارجية أ</div>
        </div>

        <!-- Activity 2 -->
        <div class="relative">
          <span class="absolute -right-8 w-4 h-4 bg-capmas-accent rounded-full border-4 border-white shadow"></span>
          <div class="mb-1 text-sm text-gray-500">منذ ساعتين</div>
          <div class="font-bold text-gray-800">إرسال بيانات الربع الثالث</div>
          <div class="text-sm text-gray-600">إدارة العمليات - جهة خارجية ب</div>
        </div>

        <!-- Activity 3 -->
        <div class="relative">
          <span class="absolute -right-8 w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow"></span>
          <div class="mb-1 text-sm text-gray-500">أمس، 02:30 م</div>
          <div class="font-bold text-gray-800">تم إرجاع التقرير الشهري للمراجعة</div>
          <div class="text-sm text-gray-600">إدارة الشؤون المالية - جهة خارجية ج</div>
        </div>

        <!-- Activity 4 -->
        <div class="relative">
          <span class="absolute -right-8 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow"></span>
          <div class="mb-1 text-sm text-gray-500">أمس، 09:15 ص</div>
          <div class="font-bold text-gray-800">تم اعتماد تقرير الإنجاز</div>
          <div class="text-sm text-gray-600">إدارة التخطيط - جهة خارجية د</div>
        </div>

      </div>
    </div>
  `
})
export class ActivityTimelineComponent {}
