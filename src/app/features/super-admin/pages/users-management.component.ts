import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService, SystemUser, Administration, ExternalEntity } from '../../../core/services/administration.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto font-arabic" dir="rtl">
      
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">إدارة المستخدمين</h1>
          <p class="text-sm text-gray-500 font-semibold">إدارة صلاحيات الوصول للأدوار المختلفة في المنصة</p>
        </div>
        
        <button (click)="openCreateModal()" class="bg-capmas-primary text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-opacity-90 transition-all flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إضافة مستخدم جديد
        </button>
      </div>

      <!-- Filters & Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
          </div>
          <div>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">إجمالي المستخدمين</p>
            <p class="text-2xl font-bold text-gray-800">{{ users.length }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-green-50 text-green-600 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">مستخدمين نشطين</p>
            <p class="text-2xl font-bold text-gray-800">{{ getActiveUsersCount() }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
          </div>
          <div>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">حسابات موقوفة</p>
            <p class="text-2xl font-bold text-gray-800">{{ getSuspendedUsersCount() }}</p>
          </div>
        </div>
      </div>

      <!-- Main Table Card -->
      <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-50 bg-white flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-800">قائمة مستخدمي النظام</h2>
          <div class="flex items-center gap-4">
            <button (click)="exportUsers()" class="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              تصدير Excel
            </button>
            <div class="relative w-72">
              <input type="text" [(ngModel)]="searchTerm" placeholder="بحث..." class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-capmas-primary/20 text-sm font-bold">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right border-collapse">
            <thead class="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th class="p-6">المستخدم</th>
                <th class="p-6">الدور الوظيفي</th>
                <th class="p-6">الارتباط</th>
                <th class="p-6 text-center">تاريخ الانضمام</th>
                <th class="p-6 text-center">الحالة</th>
                <th class="p-6 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let user of filteredUsers" class="hover:bg-gray-50 transition-colors group">
                <td class="p-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-50 text-capmas-primary flex items-center justify-center font-bold text-sm">
                      {{ user.name.charAt(0) }}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-gray-800">{{ user.name }}</span>
                      <span class="text-[10px] text-gray-400 font-bold" dir="ltr">{{ user.email }}</span>
                    </div>
                  </div>
                </td>
                <td class="p-6">
                  <span [class]="getRoleClass(user.role)" class="px-3 py-1 rounded-full text-[10px] font-bold border">
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td class="p-6">
                  <div class="flex flex-wrap gap-1">
                    <ng-container *ngIf="user.role === 'SUPER_ADMIN'">
                      <span class="text-[10px] text-gray-400 font-bold italic">صلاحيات كاملة</span>
                    </ng-container>
                    <ng-container *ngIf="user.role === 'ADMINISTRATION_ADMIN' || user.role === 'ADMINISTRATION_REVIEWER'">
                      <span *ngFor="let adminId of user.assignedAdminIds" class="px-2 py-0.5 bg-blue-50 text-capmas-primary rounded text-[10px] font-bold border border-blue-100">
                        {{ getAdminName(adminId) }}
                      </span>
                    </ng-container>
                    <ng-container *ngIf="user.role === 'EXTERNAL_ENTITY_ADMIN'">
                      <span class="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-bold border border-amber-100">
                        {{ getEntityName(user.assignedEntityId!) }}
                      </span>
                    </ng-container>
                  </div>
                </td>
                <td class="p-6 text-center text-xs font-bold text-gray-600" dir="ltr">{{ user.joinDate }}</td>
                <td class="p-6 text-center">
                  <span [class]="user.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'" class="px-3 py-1 rounded-full text-[10px] font-bold border">
                    {{ user.status === 'active' ? 'نشط' : 'موقوف' }}
                  </span>
                </td>
                <td class="p-6 text-center">
                  <div class="flex justify-center gap-2">
                    <button class="p-2 text-gray-400 hover:text-capmas-primary hover:bg-blue-50 rounded-lg transition-all" title="تعديل">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                    </button>
                    <button (click)="deleteUser(user.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="حذف">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modals -->
      <div *ngIf="isCreateModalOpen" class="fixed inset-0 bg-gray-900/50 z-[100] backdrop-blur-sm" (click)="closeModal()"></div>
      
      <!-- New User Slide-over Modal -->
      <div *ngIf="isCreateModalOpen" class="fixed inset-y-0 left-0 w-full max-w-md bg-white shadow-2xl z-[110] flex flex-col animate-slide-in">
        <div class="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-gray-800">إضافة مستخدم جديد</h2>
            <p class="text-[10px] text-gray-500 font-bold uppercase mt-1">NEW USER ONBOARDING</p>
          </div>
          <button (click)="closeModal()" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-8 flex-1 overflow-y-auto space-y-8">
          <!-- Basic Info -->
          <div class="space-y-4">
            <h3 class="text-xs font-bold text-capmas-primary uppercase tracking-widest border-r-4 border-capmas-primary pr-3 py-1">المعلومات الأساسية</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-400 mb-2 mr-2">الاسم الكامل</label>
                <input type="text" [(ngModel)]="newUser.name" placeholder="أدخل اسم المستخدم..." class="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-capmas-primary/20 outline-none font-bold transition-all">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-400 mb-2 mr-2">البريد الإلكتروني</label>
                <input type="email" [(ngModel)]="newUser.email" placeholder="email@example.com" class="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-capmas-primary/20 outline-none font-bold text-left transition-all" dir="ltr">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-400 mb-2 mr-2">كلمة المرور المؤقتة</label>
                <input type="password" [(ngModel)]="newUser.password" placeholder="••••••••" class="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-capmas-primary/20 outline-none font-bold text-left transition-all" dir="ltr">
              </div>
              <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <p class="text-xs text-blue-700 font-bold leading-relaxed">
                  * سيتم إرسال دعوة بالبريد الإلكتروني للمستخدم الجديد لتفعيل الحساب وتغيير كلمة المرور.
                </p>
              </div>
            </div>
          </div>

          <!-- Role Assignment -->
          <div class="space-y-4">
            <h3 class="text-xs font-bold text-capmas-primary uppercase tracking-widest border-r-4 border-capmas-primary pr-3 py-1">نوع الحساب والصلاحيات</h3>
            <div class="grid grid-cols-2 gap-3">
              <button (click)="setUserRole('ADMINISTRATION_ADMIN')" 
                      [class.border-capmas-primary]="newUser.role === 'ADMINISTRATION_ADMIN'"
                      [class.bg-blue-50]="newUser.role === 'ADMINISTRATION_ADMIN'"
                      class="p-4 border-2 border-gray-100 rounded-2xl flex flex-col items-center gap-2 transition-all hover:border-capmas-primary group">
                <div [class.bg-capmas-primary]="newUser.role === 'ADMINISTRATION_ADMIN'" class="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:text-capmas-primary transition-colors group-hover:bg-blue-50">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
                </div>
                <span class="text-xs font-bold" [class.text-capmas-primary]="newUser.role === 'ADMINISTRATION_ADMIN'">إدارة عامة</span>
              </button>
              <button (click)="setUserRole('EXTERNAL_ENTITY_ADMIN')" 
                      [class.border-capmas-primary]="newUser.role === 'EXTERNAL_ENTITY_ADMIN'"
                      [class.bg-blue-50]="newUser.role === 'EXTERNAL_ENTITY_ADMIN'"
                      class="p-4 border-2 border-gray-100 rounded-2xl flex flex-col items-center gap-2 transition-all hover:border-capmas-primary group text-gray-400">
                <div [class.bg-capmas-primary]="newUser.role === 'EXTERNAL_ENTITY_ADMIN'" class="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:text-capmas-primary transition-colors group-hover:bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 21h4.5V1.5h-4.5V21Z" /></svg>
                </div>
                <span class="text-xs font-bold" [class.text-capmas-primary]="newUser.role === 'EXTERNAL_ENTITY_ADMIN'">جهة خارجية</span>
              </button>
            </div>
          </div>

          <!-- Administration Selection (Multiple) -->
          <div *ngIf="newUser.role === 'ADMINISTRATION_ADMIN'" class="space-y-4 animate-fade-in">
            <h3 class="text-xs font-bold text-gray-400 mr-2">اختيار الإدارات المرتبطة</h3>
            <div class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              <div *ngFor="let admin of administrations" 
                   (click)="toggleAdminSelection(admin.id)"
                   class="p-4 border border-gray-100 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:bg-gray-50"
                   [class.border-capmas-primary]="isAdminSelected(admin.id)"
                   [class.bg-blue-50]="isAdminSelected(admin.id)">
                <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400" [class.text-capmas-primary]="isAdminSelected(admin.id)">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>
                   </div>
                   <span class="text-sm font-bold text-gray-700">{{ admin.name }}</span>
                </div>
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                     [class.bg-capmas-primary]="isAdminSelected(admin.id)"
                     [class.border-capmas-primary]="isAdminSelected(admin.id)"
                     [class.border-gray-200]="!isAdminSelected(admin.id)">
                  <svg *ngIf="isAdminSelected(admin.id)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3 h-3 text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Entity Selection (Single) -->
          <div *ngIf="newUser.role === 'EXTERNAL_ENTITY_ADMIN'" class="space-y-4 animate-fade-in">
            <h3 class="text-xs font-bold text-gray-400 mr-2">اختيار الجهة الخارجية</h3>
            <div class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              <div *ngFor="let entity of entities" 
                   (click)="setEntitySelection(entity.id)"
                   class="p-4 border border-gray-100 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:bg-gray-50"
                   [class.border-capmas-primary]="newUser.assignedEntityId === entity.id"
                   [class.bg-blue-50]="newUser.assignedEntityId === entity.id">
                <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400" [class.text-capmas-primary]="newUser.assignedEntityId === entity.id">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 21h4.5V1.5h-4.5V21Z" /></svg>
                   </div>
                   <span class="text-sm font-bold text-gray-700">{{ entity.name }}</span>
                </div>
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                     [class.bg-capmas-primary]="newUser.assignedEntityId === entity.id"
                     [class.border-capmas-primary]="newUser.assignedEntityId === entity.id"
                     [class.border-gray-200]="newUser.assignedEntityId !== entity.id">
                  <div *ngIf="newUser.assignedEntityId === entity.id" class="w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-100 flex gap-3">
          <button (click)="saveUser()" [disabled]="!isFormValid()" 
                  class="flex-1 bg-capmas-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-opacity-90 transition-all disabled:opacity-50">
            إنشاء الحساب
          </button>
          <button (click)="closeModal()" class="px-8 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all">إلغاء</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-slide-in { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f9fafb; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
  `]
})
export class UsersManagementComponent implements OnInit, OnDestroy {
  private adminService = inject(AdministrationService);
  private route = inject(ActivatedRoute);
  private sub = new Subscription();

  users: SystemUser[] = [];
  administrations: Administration[] = [];
  entities: ExternalEntity[] = [];
  searchTerm: string = '';
  
  isCreateModalOpen = false;
  newUser: Partial<SystemUser> = {
    name: '',
    email: '',
    role: 'ADMINISTRATION_ADMIN',
    assignedAdminIds: [],
    assignedEntityId: ''
  };

  ngOnInit() {
    this.sub.add(
      this.adminService.users$.subscribe(u => this.users = u)
    );
    this.sub.add(
      this.route.queryParams.subscribe(params => {
        if (params['create']) {
          this.openCreateModal();
        }
      })
    );
    this.administrations = this.adminService.getAdministrations();
    this.entities = this.adminService.getEntities();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get filteredUsers() {
    return this.users.filter(u => 
      u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getActiveUsersCount() {
    return this.users.filter(u => u.status === 'active').length;
  }

  getSuspendedUsersCount() {
    return this.users.filter(u => u.status === 'suspended').length;
  }

  getRoleLabel(role: string) {
    const labels: any = {
      SUPER_ADMIN: 'مدير نظام',
      ADMINISTRATION_ADMIN: 'مدير إدارة',
      EXTERNAL_ENTITY_ADMIN: 'مراجع جهة خارجية',
      ADMINISTRATION_REVIEWER: 'مراجع إدارة'
    };
    return labels[role] || role;
  }

  getRoleClass(role: string) {
    const classes: any = {
      SUPER_ADMIN: 'bg-blue-50 text-blue-700 border-blue-100',
      ADMINISTRATION_ADMIN: 'bg-gray-50 text-gray-700 border-gray-100',
      EXTERNAL_ENTITY_ADMIN: 'bg-amber-50 text-amber-600 border-amber-100',
      ADMINISTRATION_REVIEWER: 'bg-indigo-50 text-indigo-600 border-indigo-100'
    };
    return classes[role] || '';
  }

  getAdminName(id: string) {
    return this.administrations.find(a => a.id === id)?.name || id;
  }

  getEntityName(id: string) {
    return this.entities.find(e => e.id === id)?.name || id;
  }

  openCreateModal() {
    this.newUser = {
      name: '',
      email: '',
      password: '',
      role: 'ADMINISTRATION_ADMIN',
      assignedAdminIds: [],
      assignedEntityId: ''
    };
    this.isCreateModalOpen = true;
  }

  closeModal() {
    this.isCreateModalOpen = false;
  }

  setUserRole(role: any) {
    this.newUser.role = role;
    this.newUser.assignedAdminIds = [];
    this.newUser.assignedEntityId = '';
  }

  toggleAdminSelection(id: string) {
    const current = this.newUser.assignedAdminIds || [];
    const index = current.indexOf(id);
    if (index > -1) {
      this.newUser.assignedAdminIds = current.filter(cid => cid !== id);
    } else {
      this.newUser.assignedAdminIds = [...current, id];
    }
  }

  isAdminSelected(id: string) {
    return (this.newUser.assignedAdminIds || []).includes(id);
  }

  setEntitySelection(id: string) {
    this.newUser.assignedEntityId = id;
  }

  isFormValid() {
    const { name, email, role, assignedAdminIds, assignedEntityId } = this.newUser;
    if (!name || !email || !role) return false;
    
    if (role === 'ADMINISTRATION_ADMIN') return (assignedAdminIds || []).length > 0;
    if (role === 'EXTERNAL_ENTITY_ADMIN') return !!assignedEntityId;
    
    return true;
  }

  saveUser() {
    if (this.isFormValid()) {
      this.adminService.createUser(this.newUser as any);
      this.closeModal();
    }
  }

  exportUsers() {
    alert('جاري تصدير قائمة المستخدمين إلى Excel...');
  }

  deleteUser(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      this.adminService.deleteUser(id);
    }
  }
}
