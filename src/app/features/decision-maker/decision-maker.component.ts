import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiOverviewComponent } from '../super-admin/components/kpi-overview.component';
import { SectorAnalyticsComponent } from '../super-admin/components/sector-analytics.component';
import { ReviewWorkloadComponent } from '../super-admin/components/review-workload.component';
import { ActivityTimelineComponent } from '../super-admin/components/activity-timeline.component';

@Component({
  selector: 'app-decision-maker',
  standalone: true,
  imports: [
    CommonModule,
    KpiOverviewComponent,
    SectorAnalyticsComponent,
    ReviewWorkloadComponent,
    ActivityTimelineComponent
  ],
  template: `
    <div class="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      <!-- Executive Header -->
      <div class="bg-gradient-to-r from-capmas-primary to-blue-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-capmas-accent/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">Executive Portal</span>
              <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span class="text-xs font-bold text-blue-100">بث مباشر للبيانات</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-arabic font-black mb-4 leading-tight">لوحة القيادة التنفيذية</h1>
            <p class="text-blue-100 text-lg font-medium max-w-2xl leading-relaxed">
              مرحباً بك في منصة دعم القرار. توفر هذه اللوحة نظرة تحليلية شاملة لأداء الإدارات العامة ومعدلات امتثال الجهات الخارجية لتسهيل عملية المتابعة والتقييم.
            </p>
          </div>
          
          <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center min-w-[200px]">
             <span class="text-blue-100 text-sm font-bold mb-1">معدل الامتثال العام</span>
             <span class="text-5xl font-black text-capmas-accent">88%</span>
             <div class="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
                <div class="bg-capmas-accent h-full rounded-full w-[88%]"></div>
             </div>
          </div>
        </div>
      </div>

      <!-- View Only Notification -->
      <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 text-amber-800 shadow-sm">
        <div class="p-2 bg-amber-100 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12.a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
        </div>
        <div>
          <p class="font-bold">وضع العرض فقط</p>
          <p class="text-sm opacity-80">تم تسجيل دخولك بصلاحيات "صانع قرار". يمكنك الاطلاع على كافة التقارير والإحصائيات دون إمكانية التعديل.</p>
        </div>
      </div>

      <!-- Main Analytics Grid -->
      <div class="grid grid-cols-1 gap-8">
        
        <!-- KPI Row -->
        <section>
          <div class="flex items-center gap-3 mb-6">
            <div class="w-1 h-8 bg-capmas-primary rounded-full"></div>
            <h2 class="text-2xl font-arabic font-black text-gray-800">المؤشرات الرئيسية</h2>
          </div>
          <app-kpi-overview></app-kpi-overview>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Sector Analytics -->
          <section class="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-50">
            <div class="flex items-center justify-between mb-8">
               <h2 class="text-xl font-arabic font-black text-gray-800">تحليل القطاعات</h2>
               <button class="text-capmas-primary font-bold text-sm hover:underline">تحميل التقرير الكامل</button>
            </div>
            <app-sector-analytics></app-sector-analytics>
          </section>

          <!-- Review Workload -->
          <section class="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-50">
            <div class="flex items-center justify-between mb-8">
               <h2 class="text-xl font-arabic font-black text-gray-800">توزيع ضغط العمل</h2>
               <span class="bg-blue-50 text-capmas-primary px-3 py-1 rounded-lg text-xs font-bold uppercase">Workload Heatmap</span>
            </div>
            <app-review-workload></app-review-workload>
          </section>
        </div>

        <!-- Timeline & Trends -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div class="lg:col-span-2">
              <div class="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-50 h-full">
                 <div class="flex items-center gap-3 mb-8">
                    <h2 class="text-xl font-arabic font-black text-gray-800">أحدث الأنشطة والتنبيهات</h2>
                 </div>
                 <app-activity-timeline></app-activity-timeline>
              </div>
           </div>
           
           <div class="space-y-6">
              <div class="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-50">
                 <h3 class="text-lg font-black text-gray-800 mb-4 font-arabic">الإدارات الأكثر نشاطاً</h3>
                 <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                       <span class="font-bold text-sm">تقنية المعلومات</span>
                       <span class="text-green-600 font-black">98%</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                       <span class="font-bold text-sm">الإحصاءات الاقتصادية</span>
                       <span class="text-blue-600 font-black">85%</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                       <span class="font-bold text-sm">الموارد البشرية</span>
                       <span class="text-amber-600 font-black">72%</span>
                    </div>
                 </div>
              </div>

              <div class="bg-red-50 p-8 rounded-[2rem] shadow-xl shadow-red-50 border border-red-100">
                 <h3 class="text-lg font-black text-red-800 mb-4 font-arabic">تنبيهات التأخير الحرجة</h3>
                 <div class="space-y-4">
                    <div class="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-red-50">
                       <div class="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                       <span class="font-bold text-xs">مصلحة الضرائب - 15 تقرير متأخر</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DecisionMakerComponent {}
