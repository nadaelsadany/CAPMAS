import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdministrationService } from '../../core/services/administration.service';

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      <!-- Administrative Header -->
      <div class="bg-white rounded-[2rem] p-10 shadow-xl shadow-gray-100/50 border border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div class="absolute left-0 top-0 w-32 h-full bg-capmas-primary/5 -skew-x-12 transform origin-top"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-4">
            <span class="bg-capmas-primary text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md">لوحة التحكم المركزية</span>
            <span class="text-xs font-bold text-gray-400">إشراف وتنظيم تنفيذي</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-arabic font-black mb-4 text-gray-800 leading-tight">الإدارة العامة للنظام</h1>
          <p class="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">
            تم تخصيص هذه الواجهة للتحكم التنظيمي والإداري فقط. يمكنك إدارة الهيكل الوظيفي، الكيانات، المستخدمين، والصلاحيات أو استخدام الإجراءات السريعة أدناه لإضافة محتوى جديد.
          </p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100/50 border border-gray-50 flex flex-col md:flex-row items-center gap-4">
        <h2 class="text-xl font-bold text-gray-800 font-arabic ml-4 min-w-max">إجراءات سريعة:</h2>
        
        <div class="flex flex-wrap items-center gap-3 w-full">
          <!-- Create Sector -->
          <a routerLink="/super-admin/administrations/create" class="flex-1 bg-capmas-primary hover:bg-opacity-90 text-white px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold flex items-center justify-center gap-2 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 group-hover:rotate-90 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            إنشاء إدارة / قطاع
          </a>

          <!-- Create Entity -->
          <a [routerLink]="['/super-admin/external-entities']" [queryParams]="{create: true}" class="flex-1 bg-blue-50 text-capmas-primary hover:bg-blue-100 px-6 py-3.5 rounded-2xl shadow-sm hover:-translate-y-0.5 transition-all font-bold flex items-center justify-center gap-2 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 group-hover:rotate-90 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            إضافة جهة خارجية
          </a>

          <!-- Add User -->
          <a routerLink="/super-admin/users" [queryParams]="{create: true}" class="flex-1 bg-blue-50 text-capmas-primary hover:bg-blue-100 px-6 py-3.5 rounded-2xl shadow-sm hover:-translate-y-0.5 transition-all font-bold flex items-center justify-center gap-2 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 group-hover:rotate-90 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>
            إضافة مستخدم
          </a>

          <!-- Create Report -->
          <a routerLink="/administration-admin/builder" class="flex-1 bg-capmas-accent text-white hover:bg-opacity-90 px-6 py-3.5 rounded-2xl shadow-sm hover:-translate-y-0.5 transition-all font-bold flex items-center justify-center gap-2 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 group-hover:rotate-90 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            تكوين تقرير
          </a>
        </div>
      </div>

      <!-- High-Level Context Counts (Static Snapshot Only) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Total Sectors -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
          <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" /></svg>
          </div>
          <p class="text-gray-500 font-bold mb-2">إجمالي القطاعات والإدارات</p>
          <p class="text-5xl font-black text-gray-800">{{ (adminService.administrations$ | async)?.length || 0 }}</p>
        </div>

        <!-- Total Entities -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
          <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6.75h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18" /></svg>
          </div>
          <p class="text-gray-500 font-bold mb-2">إجمالي الجهات الخارجية</p>
          <p class="text-5xl font-black text-gray-800">{{ (adminService.entities$ | async)?.length || 0 }}</p>
        </div>

        <!-- Total Reports -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
          <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
          </div>
          <p class="text-gray-500 font-bold mb-2">إجمالي التقارير المُعرفة</p>
          <p class="text-5xl font-black text-gray-800">{{ (adminService.reports$ | async)?.length || 0 }}</p>
        </div>

        <!-- Total Users -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
          <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
          </div>
          <p class="text-gray-500 font-bold mb-2">إجمالي حسابات المستخدمين</p>
          <p class="text-5xl font-black text-gray-800">{{ (adminService.users$ | async)?.length || 0 }}</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SuperAdminComponent {
  adminService = inject(AdministrationService);
}
