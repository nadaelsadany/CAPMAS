import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, UserRole } from '../auth/auth.service';
import { PermissionDirective } from '../auth/permission.directive';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, PermissionDirective],
  template: `
    <div class="flex h-screen bg-[#eef2f6] text-gray-800 rtl font-arabic" dir="rtl">
      
      <!-- Sidebar -->
      <aside class="w-64 bg-white text-gray-700 flex flex-col shadow-lg z-20 border-l border-gray-200">
        <!-- Logo Area -->
        <div class="h-20 flex items-center justify-center border-b border-gray-100 bg-white px-4">
           <!-- Placeholder for Logo -->
           <div class="flex items-center gap-2">
             <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
               <img src="" alt="Logo" class="hidden">
               Logo
             </div>
             <div class="flex flex-col">
               <span class="font-bold text-capmas-primary text-lg leading-tight">منصة تبادل البيانات</span>
               <span class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Data Exchange</span>
             </div>
           </div>
        </div>

        <!-- Navigation -->
        <div class="flex-1 overflow-y-auto py-6 px-3">
          <!-- Super Admin Links -->
          <ng-container *appHasRole="['SUPER_ADMIN']">
            <a routerLink="/super-admin" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="bg-capmas-primary text-white font-bold rounded shadow-md border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3 mb-2 rounded hover:bg-gray-100 transition-colors text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
              الرئيسية
            </a>
            <a routerLink="/super-admin/administrations" routerLinkActive="bg-capmas-primary text-white font-bold rounded shadow-md border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3 mb-2 rounded hover:bg-gray-100 transition-colors text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" /></svg>
              الإدارات العامة
            </a>
            <a routerLink="/super-admin/external-entities" routerLinkActive="bg-capmas-primary text-white font-bold rounded shadow-md border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3 mb-2 rounded hover:bg-gray-100 transition-colors text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
              الجهات الخارجية
            </a>
            <a routerLink="/super-admin/users" routerLinkActive="bg-capmas-primary text-white font-bold rounded shadow-md border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3 mb-2 rounded hover:bg-gray-100 transition-colors text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
              المستخدمون
            </a>
            <a routerLink="/super-admin/audit-log" routerLinkActive="bg-capmas-primary text-white font-bold rounded shadow-md border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3 mb-2 rounded hover:bg-gray-100 transition-colors text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>
              سجل النشاط
            </a>
          </ng-container>

          <!-- Administration Admin Links -->
          <ng-container *appHasRole="['ADMINISTRATION_ADMIN']">
            <p class="text-xs text-gray-400 uppercase mb-2 mt-4 px-2 tracking-wider font-semibold">إدارة عامة</p>
            <a routerLink="/administration-admin" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="bg-capmas-primary text-white font-bold rounded shadow-md border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3 mb-2 rounded hover:bg-gray-100 transition-colors text-gray-600">
              نظرة عامة
            </a>
            <a routerLink="/administration-admin/reports" routerLinkActive="bg-capmas-primary text-white font-bold rounded shadow-md border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3 mb-2 rounded hover:bg-gray-100 transition-colors text-gray-600">مراجعة التقارير</a>
            <a routerLink="/administration-admin/builder" routerLinkActive="bg-capmas-primary text-white font-bold rounded shadow-md border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3 mb-2 rounded hover:bg-gray-100 transition-colors text-gray-600">إعدادات التقارير</a>
          </ng-container>

          <!-- External Entity Admin Links -->
          <ng-container *appHasRole="['EXTERNAL_ENTITY_ADMIN']">
            <p class="text-xs text-gray-400 uppercase mb-2 mt-4 px-2 tracking-wider font-semibold">جهة خارجية</p>
            <a routerLink="/external-entity-admin" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="bg-capmas-primary text-white font-bold rounded shadow-md border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3 mb-2 rounded hover:bg-gray-100 transition-colors text-gray-600">
              نظرة عامة
            </a>
            <a routerLink="/external-entity-admin/submit" routerLinkActive="bg-capmas-primary text-white font-bold rounded shadow-md border-r-4 border-capmas-accent" class="flex items-center gap-3 px-4 py-3 mb-2 rounded hover:bg-gray-100 transition-colors text-gray-600">تقديم تقرير</a>
          </ng-container>
        </div>
        
        <!-- Footer / Settings -->
        <div class="p-4 border-t border-gray-100 bg-gray-50">
          <div class="mt-2 flex flex-col gap-2">
            <!-- Mock Role Switcher for Testing -->
            <button (click)="auth.loginAs('SUPER_ADMIN')" class="text-xs bg-gray-200 text-gray-700 font-semibold p-2 rounded hover:bg-gray-300">Login as Super</button>
            <button (click)="auth.loginAs('ADMINISTRATION_ADMIN')" class="text-xs bg-gray-200 text-gray-700 font-semibold p-2 rounded hover:bg-gray-300">Login as Administration</button>
            <button (click)="auth.loginAs('EXTERNAL_ENTITY_ADMIN')" class="text-xs bg-gray-200 text-gray-700 font-semibold p-2 rounded hover:bg-gray-300">Login as External Entity</button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 bg-[#eef2f6]">
        
        <header class="h-20 bg-transparent flex items-center px-8 w-full z-10">
          
          <div class="flex-1"></div>

          <!-- User Profile & Notifications -->
          <div class="flex items-center gap-6">
            <button class="relative text-gray-500 hover:text-capmas-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
              <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button class="text-gray-500 hover:text-capmas-primary transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.99l1.003.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
            </button>
            
            <div class="h-8 w-px bg-gray-300"></div>

            <div class="flex items-center gap-3">
              <div class="flex flex-col text-left items-end">
                <span class="text-sm font-bold text-gray-800">{{ auth.currentUser()?.name }}</span>
                <span class="text-xs text-gray-500">{{ auth.currentUser()?.role === 'SUPER_ADMIN' ? 'مدير نظام' : auth.currentUser()?.role === 'ADMINISTRATION_ADMIN' ? 'إدارة عامة' : 'موظف جهة' }}</span>
              </div>
              <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" class="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover">
            </div>
          </div>

        </header>
        
        <!-- Router Outlet -->
        <div class="flex-1 overflow-auto bg-gray-50">
          <router-outlet></router-outlet>
        </div>
      </main>
      
    </div>
  `
})
export class MainLayoutComponent {
  auth = inject(AuthService);
}
