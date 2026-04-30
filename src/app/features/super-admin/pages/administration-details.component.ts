import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-administration-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxEchartsModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto h-full flex flex-col">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <div class="flex items-center gap-2 text-gray-500 mb-2">
            <a routerLink="/super-admin/administrations" class="hover:text-capmas-primary transition-colors font-semibold">إدارة الإدارات العامة</a>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            <span class="text-gray-800 font-bold">{{ adminName }}</span>
          </div>
          <h1 class="text-3xl font-arabic font-bold text-gray-800">{{ adminName }}</h1>
        </div>
      </div>

      <!-- Main Layout with Tabs -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0 overflow-hidden">
        
        <!-- Tabs Header -->
        <div class="flex border-b border-gray-100 bg-gray-50 px-6 shrink-0 overflow-x-auto custom-scrollbar">
          <button *ngFor="let tab of tabs" 
                  (click)="activeTab = tab.id"
                  [class.text-capmas-primary]="activeTab === tab.id"
                  [class.border-capmas-primary]="activeTab === tab.id"
                  [class.text-gray-500]="activeTab !== tab.id"
                  [class.border-transparent]="activeTab !== tab.id"
                  class="px-6 py-4 font-bold text-sm border-b-2 whitespace-nowrap transition-colors hover:text-capmas-primary">
            {{ tab.title }}
          </button>
        </div>

        <!-- Tab Content Area -->
        <div class="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          
          <!-- Tab 0: Overview (Dashboard) -->
          <div *ngIf="activeTab === 'overview'" class="animate-fade-in-up space-y-6">
            
            <!-- Alerts Section -->
            <div *ngIf="lateReportsCount > 0" class="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between animate-pulse-subtle">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </div>
                <div>
                  <p class="text-red-800 font-bold text-sm">يوجد {{ lateReportsCount }} تقارير متأخرة من 3 جهات خارجية</p>
                  <p class="text-red-600 text-xs font-semibold">اضغط هنا للمتابعة وحث الجهات على التسليم</p>
                </div>
              </div>
              <button class="text-red-700 font-bold text-xs hover:underline transition-all">عرض التقارير المتأخرة</button>
            </div>

            <!-- KPI Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <p class="text-[10px] text-gray-400 font-bold mb-2">إجمالي التقارير</p>
                <div class="flex items-end justify-between">
                  <h3 class="text-2xl font-bold text-gray-800 group-hover:text-capmas-primary transition-colors">124</h3>
                  <span class="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
                </div>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <p class="text-[10px] text-gray-400 font-bold mb-2">قيد المراجعة</p>
                <div class="flex items-end justify-between">
                  <h3 class="text-2xl font-bold text-gray-800 group-hover:text-blue-500 transition-colors">18</h3>
                  <span class="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">نشط</span>
                </div>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group border-r-4 border-r-red-400">
                <p class="text-[10px] text-gray-400 font-bold mb-2">تقارير متأخرة</p>
                <div class="flex items-end justify-between">
                  <h3 class="text-2xl font-bold text-red-500">5</h3>
                  <span class="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">هام</span>
                </div>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <p class="text-[10px] text-gray-400 font-bold mb-2">مُعادة للتعديل</p>
                <div class="flex items-end justify-between">
                  <h3 class="text-2xl font-bold text-orange-500">3</h3>
                  <span class="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">تنبيه</span>
                </div>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-gradient-to-br from-capmas-primary/5 to-transparent">
                <p class="text-[10px] text-capmas-primary font-bold mb-2">نسبة الالتزام</p>
                <div class="flex items-end justify-between">
                  <h3 class="text-2xl font-bold text-capmas-primary">94%</h3>
                  <div class="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div class="bg-capmas-primary h-full" style="width: 94%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Performance Charts Row -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Bar Chart: External Entities -->
              <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div class="flex justify-between items-center mb-6">
                  <h4 class="font-bold text-gray-800 text-sm">أداء الجهات الخارجية</h4>
                  <select class="text-xs font-bold border-none bg-gray-50 rounded-lg px-2 py-1 focus:ring-0">
                    <option>آخر 30 يوم</option>
                    <option>الربع الحالي</option>
                  </select>
                </div>
                <div echarts [options]="entityPerformanceOptions" class="h-[300px]"></div>
              </div>

              <!-- Distribution Pie Chart -->
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="font-bold text-gray-800 text-sm mb-6">توزيع حالة التقارير</h4>
                <div echarts [options]="reportStatusOptions" class="h-[300px]"></div>
              </div>
            </div>

            <!-- Delayed Entities & Activity Row -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Most Delayed Widget -->
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="font-bold text-gray-800 text-sm mb-6 flex items-center justify-between">
                  أكثر الجهات تأخيرًا
                  <span class="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-1 rounded-lg">الأكثر احتياجاً للمتابعة</span>
                </h4>
                <div class="space-y-4">
                  <div *ngFor="let entity of delayedEntities" class="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-red-50/30 transition-all cursor-pointer group border border-transparent hover:border-red-100">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-red-500 font-bold text-xs">!</div>
                      <div>
                        <p class="text-xs font-bold text-gray-800 group-hover:text-red-600 transition-colors">{{ entity.name }}</p>
                        <p class="text-[10px] text-gray-500 font-semibold mt-0.5">{{ entity.type }}</p>
                      </div>
                    </div>
                    <div class="text-left">
                      <p class="text-xs font-bold text-red-600">{{ entity.count }} تقرير</p>
                      <p class="text-[10px] text-gray-400 font-bold">متأخر</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reviewer Performance -->
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div class="flex justify-between items-center mb-6">
                   <h4 class="font-bold text-gray-800 text-sm">أداء المراجعين</h4>
                   <div class="flex items-baseline gap-1">
                      <span class="text-xl font-bold text-capmas-primary">84</span>
                      <span class="text-[10px] text-gray-400 font-bold">مراجعة</span>
                   </div>
                </div>
                <div echarts [options]="reviewerPerformanceOptions" class="h-[200px] mb-6"></div>
                
                <h5 class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">أكثر المراجعين نشاطاً</h5>
                <div class="space-y-3">
                  <div *ngFor="let r of topReviewers" class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-blue-50 text-capmas-primary flex items-center justify-center text-[10px] font-bold">{{ r.name[0] }}</div>
                      <span class="text-xs font-bold text-gray-700 hover:text-capmas-primary cursor-pointer transition-colors">{{ r.name }}</span>
                    </div>
                    <span class="text-xs font-bold text-gray-500">{{ r.count }}</span>
                  </div>
                </div>
              </div>

              <!-- Latest Activity -->
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="font-bold text-gray-800 text-sm mb-6">آخر النشاط</h4>
                <div class="relative space-y-6 before:absolute before:right-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  <div *ngFor="let activity of latestActivities" class="relative pr-8">
                    <div class="absolute right-1.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white" 
                         [ngClass]="activity.type === 'approve' ? 'bg-green-500' : (activity.type === 'return' ? 'bg-orange-500' : 'bg-red-500')"></div>
                    <div>
                      <p class="text-xs font-bold text-gray-800">{{ activity.title }}</p>
                      <p class="text-[10px] text-gray-500 font-semibold mt-1">{{ activity.entity }} • {{ activity.time }}</p>
                    </div>
                  </div>
                </div>
                <button class="w-full mt-6 py-2 bg-gray-50 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-100 transition-all">عرض كافة الأنشطة</button>
              </div>
            </div>

          </div>

          <!-- Tab 1: Reviewers -->
          <div *ngIf="activeTab === 'reviewers'" class="animate-fade-in-up">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-bold text-gray-800">إدارة المراجعين</h2>
              <button (click)="openAddReviewerModal()" class="bg-capmas-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-opacity-90 flex items-center gap-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                إضافة مراجع جديد
              </button>
            </div>
            
            <div class="border border-gray-100 rounded-xl overflow-hidden bg-white">
              <table class="w-full text-center">
                <thead class="bg-gray-50 border-b border-gray-100 text-gray-700 text-sm">
                  <tr>
                    <th class="p-4 font-bold text-right">الاسم</th>
                    <th class="p-4 font-bold">البريد الإلكتروني</th>
                    <th class="p-4 font-bold">حالة الحساب</th>
                    <th class="p-4 font-bold">آخر تسجيل دخول</th>
                    <th class="p-4 font-bold">آخر نشاط</th>
                    <th class="p-4 font-bold">إجراءات</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 text-sm">
                  <tr *ngFor="let reviewer of reviewersList" class="hover:bg-gray-50 transition-colors">
                    <td class="p-4 font-bold text-gray-800 text-right">{{ reviewer.name }}</td>
                    <td class="p-4 text-gray-500 font-semibold">{{ reviewer.email }}</td>
                    <td class="p-4">
                      <span *ngIf="reviewer.status === 'active'" class="text-green-600 font-bold text-xs inline-flex items-center justify-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> نشط
                      </span>
                      <span *ngIf="reviewer.status === 'suspended'" class="text-red-600 font-bold text-xs inline-flex items-center justify-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                        <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> موقوف
                      </span>
                    </td>
                    <td class="p-4 text-gray-500 text-xs font-semibold" dir="ltr">{{ reviewer.lastLogin }}</td>
                    <td class="p-4 text-gray-500 text-xs font-semibold">{{ reviewer.lastActivity }}</td>
                    <td class="p-4 flex justify-center gap-2">
                      <button (click)="openEditReviewerModal(reviewer)" class="text-gray-400 hover:text-capmas-primary transition-colors p-1 rounded-md hover:bg-blue-50" title="تعديل">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                      </button>
                      <button *ngIf="reviewer.status === 'active'" (click)="openConfirmModal(reviewer, 'suspend')" class="text-gray-400 hover:text-yellow-600 transition-colors p-1 rounded-md hover:bg-yellow-50" title="إيقاف الحساب">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </button>
                      <button *ngIf="reviewer.status === 'suspended'" (click)="openConfirmModal(reviewer, 'activate')" class="text-gray-400 hover:text-green-600 transition-colors p-1 rounded-md hover:bg-green-50" title="إعادة تفعيل">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </button>
                      <button (click)="openConfirmModal(reviewer, 'delete')" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50" title="حذف نهائي">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab 2: External Entities -->
          <div *ngIf="activeTab === 'entities'" class="animate-fade-in-up">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-bold text-gray-800">الجهات الخارجية المرتبطة</h2>
              <button class="bg-capmas-secondary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-opacity-90 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                ربط جهة جديدة
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div [routerLink]="['entities', 'customs-authority']" class="border border-gray-100 rounded-xl p-5 hover:border-capmas-secondary transition-colors cursor-pointer group">
                <div class="flex items-start gap-3 mb-4">
                  <div class="w-10 h-10 rounded-lg bg-[#C89637]/10 text-capmas-secondary flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800 text-sm group-hover:text-capmas-primary transition-colors">هيئة الجمارك المصرية</h3>
                    <p class="text-xs text-gray-500 font-semibold mt-1">هيئة حكومية</p>
                  </div>
                </div>
                <div class="flex justify-between items-center text-xs font-bold border-t border-gray-50 pt-3">
                   <span class="text-gray-500">التقارير المطلوبة: <span class="text-gray-800">2</span></span>
                   <span class="text-green-600">تسليم منتظم</span>
                </div>
              </div>
              
              <div [routerLink]="['entities', 'central-bank']" class="border border-gray-100 rounded-xl p-5 hover:border-capmas-secondary transition-colors cursor-pointer group">
                <div class="flex items-start gap-3 mb-4">
                  <div class="w-10 h-10 rounded-lg bg-[#C89637]/10 text-capmas-secondary flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800 text-sm group-hover:text-capmas-primary transition-colors">البنك المركزي المصري</h3>
                    <p class="text-xs text-gray-500 font-semibold mt-1">قطاع مصرفي</p>
                  </div>
                </div>
                <div class="flex justify-between items-center text-xs font-bold border-t border-gray-50 pt-3">
                   <span class="text-gray-500">التقارير المطلوبة: <span class="text-gray-800">1</span></span>
                   <span class="text-yellow-600">تأخير في التسليم</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 4: Graph View -->
          <div *ngIf="activeTab === 'graph'" class="animate-fade-in-up h-[600px] bg-gray-50 rounded-2xl border border-gray-100 relative overflow-hidden flex flex-col">
            <div class="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur p-3 rounded-lg border border-gray-100 shadow-sm">
              <h3 class="text-sm font-bold text-gray-800 mb-2">مفتاح الرسم (Legend)</h3>
              <div class="flex items-center gap-2 mb-1"><span class="w-3 h-3 rounded-full bg-[#1e3a8a]"></span><span class="text-xs font-bold text-gray-600">الإدارة المركزية</span></div>
              <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-[#C89637]"></span><span class="text-xs font-bold text-gray-600">جهة خارجية</span></div>
            </div>
            
            <div echarts [options]="chartOptions" class="w-full h-full flex-1"></div>
          </div>

        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div *ngIf="isAddReviewerModalOpen || isEditReviewerModalOpen || isConfirmModalOpen" class="fixed inset-0 bg-gray-900/50 z-40 backdrop-blur-sm transition-opacity" (click)="closeModals()"></div>

    <!-- Add/Edit Reviewer Modal -->
    <div *ngIf="isAddReviewerModalOpen || isEditReviewerModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md pointer-events-auto overflow-hidden animate-fade-in-up">
        <div class="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 class="text-xl font-bold text-gray-800">{{ isEditReviewerModalOpen ? 'تعديل بيانات المراجع' : 'إضافة مراجع جديد' }}</h2>
          <button (click)="closeModals()" class="text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 border border-gray-200">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-bold text-gray-700 mb-2">اسم المراجع <span class="text-red-500">*</span></label>
            <input type="text" [value]="isEditReviewerModalOpen ? selectedReviewer?.name : ''" placeholder="الاسم كاملاً" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-capmas-primary text-sm bg-white font-semibold">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني <span class="text-red-500">*</span></label>
            <input type="email" [value]="isEditReviewerModalOpen ? selectedReviewer?.email : ''" placeholder="example@capmas.gov.eg" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-capmas-primary text-sm bg-white font-semibold" dir="ltr">
          </div>
          <div class="mb-6">
            <label class="block text-sm font-bold text-gray-700 mb-2">كلمة المرور <span *ngIf="!isEditReviewerModalOpen" class="text-red-500">*</span></label>
            <input type="password" placeholder="••••••••" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-capmas-primary text-sm bg-white font-semibold" dir="ltr">
            <p *ngIf="isEditReviewerModalOpen" class="text-xs text-gray-400 mt-1 font-bold">اتركه فارغاً إذا لم ترغب بتغيير كلمة المرور</p>
          </div>
          
          <div class="flex gap-3 justify-end border-t border-gray-100 pt-6">
            <button (click)="closeModals()" class="px-5 py-2.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">إلغاء</button>
            <button (click)="closeModals()" class="px-5 py-2.5 text-sm font-bold text-white bg-capmas-primary rounded-lg hover:bg-opacity-90 transition-colors">{{ isEditReviewerModalOpen ? 'حفظ التعديلات' : 'إنشاء الحساب' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div *ngIf="isConfirmModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm pointer-events-auto overflow-hidden animate-fade-in-up">
        <div class="p-6 text-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
               [ngClass]="{'bg-red-50 text-red-500': confirmActionType === 'delete', 'bg-yellow-50 text-yellow-600': confirmActionType === 'suspend', 'bg-green-50 text-green-600': confirmActionType === 'activate'}">
            <svg *ngIf="confirmActionType === 'delete'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            <svg *ngIf="confirmActionType === 'suspend'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <svg *ngIf="confirmActionType === 'activate'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 class="text-xl font-bold text-gray-800 mb-2">تأكيد الإجراء</h2>
          <p class="text-sm text-gray-500 font-semibold mb-6">
            <span *ngIf="confirmActionType === 'delete'">هل أنت متأكد من حذف الحساب بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.</span>
            <span *ngIf="confirmActionType === 'suspend'">هل أنت متأكد من إيقاف هذا الحساب؟ لن يتمكن من الدخول للمنصة.</span>
            <span *ngIf="confirmActionType === 'activate'">هل أنت متأكد من إعادة تفعيل هذا الحساب؟</span>
            <br>
            <strong class="text-gray-800 mt-2 inline-block">{{ selectedReviewer?.name }}</strong>
          </p>
          
          <div class="flex gap-3 justify-center">
            <button (click)="closeModals()" class="px-5 py-2.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full">إلغاء</button>
            <button (click)="closeModals()" class="px-5 py-2.5 text-sm font-bold text-white rounded-lg transition-colors w-full"
                    [ngClass]="{'bg-red-500 hover:bg-red-600': confirmActionType === 'delete', 'bg-yellow-500 hover:bg-yellow-600': confirmActionType === 'suspend', 'bg-green-500 hover:bg-green-600': confirmActionType === 'activate'}">
              <span *ngIf="confirmActionType === 'delete'">حذف نهائي</span>
              <span *ngIf="confirmActionType === 'suspend'">إيقاف الحساب</span>
              <span *ngIf="confirmActionType === 'activate'">تفعيل الحساب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out forwards;
    }
    .animate-pulse-subtle {
      animation: pulseSubtle 2s infinite ease-in-out;
    }
    @keyframes pulseSubtle {
      0% { opacity: 1; }
      50% { opacity: 0.85; }
      100% { opacity: 1; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .custom-scrollbar::-webkit-scrollbar {
      height: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #e5e7eb;
      border-radius: 4px;
    }
  `]
})
export class AdministrationDetailsComponent implements OnInit {
  
  adminId: string = '';
  adminName = 'إدارة تقنية المعلومات'; // Mock data based on route param later
  
  tabs = [
    { id: 'overview', title: 'نظرة عامة' },
    { id: 'reviewers', title: 'المراجعين' },
    { id: 'entities', title: 'الجهات الخارجية' },
    { id: 'graph', title: 'العرض البصري (Graph)' }
  ];
  
  activeTab = 'overview';
  lateReportsCount = 5;

  chartOptions: any = {};
  entityPerformanceOptions: any = {};
  reportStatusOptions: any = {};
  reviewerPerformanceOptions: any = {};

  // Dashboard Data
  delayedEntities = [
    { name: 'هيئة موانئ بورسعيد', type: 'هيئة حكومية', count: 3 },
    { name: 'مصلحة الضرائب', type: 'وزارة المالية', count: 1 },
    { name: 'جهاز تنظيم الاتصالات', type: 'هيئة حكومية', count: 1 }
  ];

  topReviewers = [
    { name: 'أحمد محمود', count: 32 },
    { name: 'سارة حسن', count: 28 },
    { name: 'خالد عبد الله', count: 24 }
  ];

  latestActivities = [
    { type: 'approve', title: 'اعتماد تقرير الواردات اليومي', entity: 'هيئة الجمارك', time: 'منذ 10 دقائق' },
    { type: 'return', title: 'إرجاع تقرير حركة الحاويات للتعديل', entity: 'ميناء الإسكندرية', time: 'منذ ساعة' },
    { type: 'late', title: 'تسليم متأخر (3 أيام)', entity: 'مصلحة الضرائب', time: 'منذ ساعتين' }
  ];

  // Reviewers State
  reviewersList = [
    { id: 1, name: 'أحمد محمود', email: 'ahmed.m@capmas.gov.eg', status: 'active', lastLogin: '2023-10-25 09:30 AM', lastActivity: 'إنشاء تقرير للبنك المركزي' },
    { id: 2, name: 'سارة حسن', email: 'sara.h@capmas.gov.eg', status: 'active', lastLogin: '2023-10-24 02:15 PM', lastActivity: 'اعتماد بيانات الجمارك' },
    { id: 3, name: 'خالد عبد الله', email: 'khaled.a@capmas.gov.eg', status: 'suspended', lastLogin: '2023-09-15 11:00 AM', lastActivity: 'تسجيل دخول' }
  ];

  isAddReviewerModalOpen = false;
  isEditReviewerModalOpen = false;
  isConfirmModalOpen = false;
  confirmActionType: 'suspend' | 'activate' | 'delete' = 'suspend';
  selectedReviewer: any = null;

  openAddReviewerModal() {
    this.isAddReviewerModalOpen = true;
  }

  openEditReviewerModal(reviewer: any) {
    this.selectedReviewer = reviewer;
    this.isEditReviewerModalOpen = true;
  }

  openConfirmModal(reviewer: any, type: 'suspend' | 'activate' | 'delete') {
    this.selectedReviewer = reviewer;
    this.confirmActionType = type;
    this.isConfirmModalOpen = true;
  }

  closeModals() {
    this.isAddReviewerModalOpen = false;
    this.isEditReviewerModalOpen = false;
    this.isConfirmModalOpen = false;
    // Don't nullify selectedReviewer immediately to avoid flicker during close animation
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.adminId = this.route.snapshot.paramMap.get('id') || '';
    this.initGraph();
    this.initDashboardCharts();
  }

  initDashboardCharts() {
    // Entity Performance Bar Chart
    this.entityPerformanceOptions = {
      color: ['#0986ED', '#C89637', '#EF4444'],
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { bottom: 0, right: 'center', itemGap: 20, textStyle: { fontFamily: 'Cairo', fontWeight: 'bold' } },
      grid: { top: 30, right: 20, bottom: 60, left: 40 },
      xAxis: { 
        type: 'category', 
        data: ['هيئة الجمارك', 'البنك المركزي', 'الرقابة المالية', 'هيئة الموانئ'],
        axisLabel: { fontFamily: 'Cairo', fontWeight: 'bold' }
      },
      yAxis: { type: 'value' },
      series: [
        { name: 'في الموعد', type: 'bar', stack: 'total', barWidth: 30, data: [12, 8, 15, 6] },
        { name: 'قيد المراجعة', type: 'bar', stack: 'total', data: [2, 3, 1, 4] },
        { name: 'متأخر', type: 'bar', stack: 'total', data: [1, 0, 2, 3] }
      ]
    };

    // Report Status Donut Chart
    this.reportStatusOptions = {
      color: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
      tooltip: { trigger: 'item' },
      series: [
        {
          name: 'حالة التقارير',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: { label: { show: true, fontSize: '12', fontWeight: 'bold', fontFamily: 'Cairo' } },
          data: [
            { value: 65, name: 'في الموعد' },
            { value: 15, name: 'متأخر' },
            { value: 12, name: 'قيد المراجعة' },
            { value: 8, name: 'مُعاد للتعديل' }
          ]
        }
      ]
    };

    // Reviewer Performance Horizontal Bar Chart
    this.reviewerPerformanceOptions = {
      color: ['#0986ED'],
      grid: { top: 10, right: 30, bottom: 20, left: 70 },
      xAxis: { type: 'value', show: false },
      yAxis: { 
        type: 'category', 
        data: ['أحمد', 'سارة', 'خالد'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontFamily: 'Cairo', fontWeight: 'bold' }
      },
      series: [
        { 
          type: 'bar', 
          barWidth: 15, 
          data: [32, 28, 24],
          itemStyle: { borderRadius: [0, 10, 10, 0] },
          label: { show: true, position: 'right', fontFamily: 'Cairo', fontWeight: 'bold' }
        }
      ]
    };
  }

  initGraph() {
    // Mock Nodes and Links for Graph
    const nodes = [
      { id: 'center', name: this.adminName, symbolSize: 80, itemStyle: { color: '#1e3a8a' }, label: { show: true, position: 'bottom', formatter: '{b}', fontWeight: 'bold' } },
      { id: '1', name: 'هيئة الجمارك المصرية', symbolSize: 50, itemStyle: { color: '#C89637' }, label: { show: true, position: 'right', formatter: '{b}', fontSize: 11, fontWeight: 'bold' } },
      { id: '2', name: 'البنك المركزي المصري', symbolSize: 50, itemStyle: { color: '#C89637' }, label: { show: true, position: 'right', formatter: '{b}', fontSize: 11, fontWeight: 'bold' } }
    ];

    const links = [
      { source: 'center', target: '1', lineStyle: { width: 2, color: '#94a3b8', curveness: 0.1 } },
      { source: 'center', target: '2', lineStyle: { width: 2, color: '#94a3b8', curveness: 0.1 } }
    ];

    this.chartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            const extraInfo = params.data.id === 'center' ? 'الإدارة العامة' : 'مطلوب منها: 2 تقرير';
            return `<div style="text-align:right; font-family:Cairo, sans-serif;"><b>${params.data.name}</b><br/>${extraInfo}</div>`;
          }
          return '';
        }
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'force',
          force: { repulsion: 500, edgeLength: [150, 250], gravity: 0.1 },
          roam: true,
          label: { fontFamily: 'Cairo, sans-serif' },
          data: nodes,
          links: links,
          lineStyle: { opacity: 0.9, width: 2, curveness: 0 }
        }
      ]
    };
  }
}
