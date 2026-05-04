import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, UserRole } from '../auth/auth.service';
import { PermissionDirective } from '../auth/permission.directive';
import { NotificationDropdownComponent } from './components/notification-dropdown.component';
import { AdministrationService } from '../services/administration.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, PermissionDirective, NotificationDropdownComponent, FormsModule],
  template: `
    <div class="flex h-screen bg-[#f8fafc] text-gray-800 rtl font-arabic overflow-hidden" dir="rtl">
      
      <!-- Sidebar -->
      <aside class="w-72 bg-white flex flex-col shadow-xl z-20 border-l border-gray-100 h-full">
        <!-- Logo Area -->
        <div class="h-24 flex items-center justify-center border-b border-gray-50 bg-white px-6">
           <div class="flex items-center gap-3">
             <div class="w-12 h-12 bg-capmas-primary rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100">
               Logo
             </div>
             <div class="flex flex-col">
               <span class="font-black text-gray-800 text-lg leading-tight">منصة تبادل البيانات</span>
               <span class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Data Exchange</span>
             </div>
           </div>
        </div>

        <!-- Navigation Scrollable -->
        <div class="flex-1 overflow-y-auto py-8 px-4 custom-scrollbar">
          <!-- Super Admin Links -->
          <ng-container *appHasRole="['SUPER_ADMIN']">
            <p class="text-[10px] text-gray-400 uppercase mb-4 mt-2 px-2 tracking-[0.2em] font-black">التحكم العام</p>
            <a routerLink="/super-admin" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="bg-capmas-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-100 border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3.5 mb-2 rounded-2xl hover:bg-gray-50 transition-all text-gray-600 group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
              <span>الرئيسية</span>
            </a>
            <a routerLink="/super-admin/administrations" routerLinkActive="bg-capmas-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-100 border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3.5 mb-2 rounded-2xl hover:bg-gray-50 transition-all text-gray-600 group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" /></svg>
              <span>الإدارات العامة</span>
            </a>
            <a routerLink="/super-admin/external-entities" routerLinkActive="bg-capmas-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-100 border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3.5 mb-2 rounded-2xl hover:bg-gray-50 transition-all text-gray-600 group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6.75h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18" /></svg>
              <span>الجهات الخارجية</span>
            </a>
            <a routerLink="/super-admin/users" routerLinkActive="bg-capmas-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-100 border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3.5 mb-2 rounded-2xl hover:bg-gray-50 transition-all text-gray-600 group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
              <span>المستخدمون</span>
            </a>
            <a routerLink="/super-admin/logs" routerLinkActive="bg-capmas-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-100 border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3.5 mb-2 rounded-2xl hover:bg-gray-100 transition-all text-gray-600 group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span>سجل النشاط</span>
            </a>
          </ng-container>
          
          <!-- Administration Admin / Reviewer Links -->
          <ng-container *appHasRole="['ADMINISTRATION_ADMIN', 'ADMINISTRATION_REVIEWER']">
            <p class="text-[10px] text-gray-400 uppercase mb-4 mt-2 px-2 tracking-[0.2em] font-black">إدارة عامة</p>
            <a routerLink="/administration-admin" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="bg-capmas-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-100 border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3.5 mb-2 rounded-2xl hover:bg-gray-50 transition-all text-gray-600 group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
              <span>نظرة عامة</span>
            </a>
            <a routerLink="/administration-admin/reports" routerLinkActive="bg-capmas-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-100 border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3.5 mb-2 rounded-2xl hover:bg-gray-100 transition-all text-gray-600 group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span>مراجعة التقارير</span>
            </a>
            <a routerLink="/administration-admin/builder" routerLinkActive="bg-capmas-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-100 border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3.5 mb-2 rounded-2xl hover:bg-gray-100 transition-all text-gray-600 group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              <span>منشئ التقارير</span>
            </a>
          </ng-container>

          <!-- External Entity Admin Links -->
          <ng-container *appHasRole="['EXTERNAL_ENTITY_ADMIN']">
            <p class="text-[10px] text-gray-400 uppercase mb-4 mt-2 px-2 tracking-[0.2em] font-black">بوابة الجهة الخارجية</p>
            <a routerLink="/external-entity-admin" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="bg-capmas-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-100 border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3.5 mb-2 rounded-2xl hover:bg-gray-50 transition-all text-gray-600 group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
              <span>لوحة التحكم</span>
            </a>
          </ng-container>
        </div>
        
        <!-- Footer / Role Switcher -->
        <div class="p-6 border-t border-gray-100 bg-gray-50/50">
          <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">تبديل الحساب (ديمو)</p>
          <div class="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            <button *ngFor="let user of adminService.getUsers()" 
                    (click)="auth.impersonate(user)"
                    class="w-full text-right p-3 bg-white border border-gray-100 rounded-2xl hover:border-capmas-primary hover:bg-blue-50 transition-all shadow-sm group">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:bg-capmas-primary group-hover:text-white transition-colors">
                  {{ user.name.charAt(0) }}
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] font-bold text-gray-700 leading-tight">{{ user.name }}</span>
                  <span class="text-[9px] text-gray-400 font-bold">{{ getRoleLabel(user.role) }}</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 bg-[#f8fafc] h-full overflow-hidden">
        
        <header class="h-24 bg-white/80 backdrop-blur-md flex items-center px-10 w-full z-10 border-b border-gray-100/50 sticky top-0">
          
          <div class="flex-1"></div>

          <!-- User Profile & Notifications -->
          <div class="flex items-center gap-8">
            <app-notification-dropdown></app-notification-dropdown>
            
            <a routerLink="/settings" class="text-gray-400 hover:text-capmas-primary transition-colors p-2 hover:bg-blue-50 rounded-xl">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.99l1.003.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
            </a>
            
            <div class="h-10 w-px bg-gray-100"></div>

            <div class="flex items-center gap-4">
              <div class="flex flex-col text-left items-end">
                <span class="text-sm font-black text-gray-800 leading-none mb-1">{{ auth.currentUser()?.name }}</span>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ getRoleLabel(auth.currentUser()?.role || '') }}</span>
              </div>
              <div class="relative">
                <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" class="w-12 h-12 rounded-2xl border-2 border-white shadow-md object-cover ring-4 ring-gray-50">
                <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </div>
          </div>

        </header>
        
        <!-- Router Outlet -->
        <div class="flex-1 overflow-y-auto bg-[#f8fafc] custom-scrollbar relative">
          <router-outlet></router-outlet>
        </div>
      </main>
      
    </div>
  `
})
export class MainLayoutComponent {
  auth = inject(AuthService);
  adminService = inject(AdministrationService);

  getRoleLabel(role: string) {
    const labels: any = {
      SUPER_ADMIN: 'مدير نظام',
      ADMINISTRATION_ADMIN: 'مدير إدارة',
      ADMINISTRATION_REVIEWER: 'مراجع إدارة',
      EXTERNAL_ENTITY_ADMIN: 'موظف جهة'
    };
    return labels[role] || role;
  }

  availableAdmins = computed(() => {
    const user = this.auth.currentUser();
    if (!user || !user.administrationIds || user.administrationIds.length === 0) return [];
    return this.adminService.getAdministrationsSync().filter(a => user.administrationIds?.includes(a.id));
  });

  activeAdminId = this.auth.activeAdministrationId;

  switchAdmin(id: string) {
    this.auth.activeAdministrationId.set(id);
  }
}
