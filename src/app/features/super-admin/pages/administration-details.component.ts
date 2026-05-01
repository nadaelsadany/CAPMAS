import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { AdministrationService, ExternalEntity, Reviewer } from '../../../core/services/administration.service';

@Component({
  selector: 'app-administration-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgxEchartsModule],
  template: `
    <div class="h-full flex flex-col relative overflow-hidden text-right" dir="rtl">
      <!-- Main Content Container -->
      <div class="p-8 max-w-7xl mx-auto h-full flex flex-col w-full">
        
        <!-- Page Header -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <div class="flex items-center gap-2 text-gray-500 mb-0">
              <a routerLink="/super-admin/administrations" class="hover:text-capmas-primary transition-colors font-semibold text-sm">إدارة الإدارات العامة</a>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 rotate-180"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              <span class="text-gray-800 font-bold text-sm">{{ adminName }}</span>
            </div>
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
            
            <!-- Tab 0: Overview -->
            <div *ngIf="activeTab === 'overview'" class="animate-fade-in-up space-y-6">
              <div *ngIf="lateReportsCount > 0" class="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                  </div>
                  <div>
                    <p class="text-red-800 font-bold text-sm">يوجد {{ lateReportsCount }} تقارير متأخرة</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <p class="text-xs text-gray-400 font-bold mb-2">إجمالي التقارير</p>
                  <h3 class="text-2xl font-bold text-gray-800">124</h3>
                </div>
                <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <p class="text-xs text-gray-400 font-bold mb-2">تقارير متأخرة</p>
                  <h3 class="text-2xl font-bold text-red-500">{{ lateReportsCount }}</h3>
                </div>
                <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <p class="text-xs text-gray-400 font-bold mb-2">نسبة الالتزام</p>
                  <h3 class="text-2xl font-bold text-capmas-primary">94%</h3>
                </div>
              </div>

              <!-- Clickable Entity Cards Section -->
              <div class="mt-8">
                <div class="flex justify-between items-center mb-6">
                  <div class="flex items-center gap-2">
                    <span class="w-1 h-6 bg-capmas-primary rounded-full"></span>
                    <h4 class="font-bold text-gray-800 text-sm">الجهات الخارجية المرتبطة</h4>
                  </div>
                  <button (click)="activeTab = 'entities'" class="text-capmas-primary text-xs font-bold hover:underline transition-all flex items-center gap-1">
                    عرض كافة الجهات
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 rotate-180"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <a *ngFor="let entity of linkedEntities" 
                      [routerLink]="['/super-admin/administrations', adminId, 'entities', entity.id]"
                      class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full relative overflow-hidden">
                     <div class="absolute top-0 right-0 w-1 h-full" [class]="entity.status === 'on-time' ? 'bg-green-500' : 'bg-red-500'"></div>
                     <div class="flex justify-between items-start mb-6">
                       <div class="p-3 bg-blue-50 text-capmas-primary rounded-xl group-hover:bg-capmas-primary group-hover:text-white transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                       </div>
                       <div class="flex flex-col items-end gap-1">
                         <span [class]="entity.status === 'on-time' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'" 
                               class="px-3 py-1 rounded-full text-[10px] font-bold border">
                           {{ entity.status === 'on-time' ? 'منتظم' : 'متأخر' }}
                         </span>
                       </div>
                     </div>
                     <h5 class="font-bold text-gray-800 text-lg mb-1 group-hover:text-capmas-primary transition-colors leading-tight">{{ entity.name }}</h5>
                     <p class="text-xs text-gray-500 font-semibold mb-6">{{ entity.type }}</p>
                     <div class="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                       <div class="flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-400 group-hover:text-capmas-primary transition-colors"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                         <span class="text-xs font-bold text-gray-600 group-hover:text-capmas-primary transition-colors">{{ entity.reportsCount }} تقرير</span>
                       </div>
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-300 group-hover:text-capmas-primary group-hover:-translate-x-1 transition-all"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                     </div>
                   </a>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 class="font-bold text-gray-800 text-sm mb-6 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-capmas-primary"></span>
                    أداء الجهات الخارجية
                  </h4>
                  <div echarts [options]="entityPerformanceOptions" class="h-[300px]"></div>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 class="font-bold text-gray-800 text-sm mb-6 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-capmas-secondary"></span>
                    توزيع حالة التقارير
                  </h4>
                  <div echarts [options]="reportStatusOptions" class="h-[300px]"></div>
                </div>
              </div>
            </div>

            <!-- Tab 1: Reviewers -->
            <div *ngIf="activeTab === 'reviewers'" class="animate-fade-in-up space-y-6">
              <div class="flex justify-between items-center mb-6">
                <div>
                  <h3 class="text-xl font-bold text-gray-800">إدارة المراجعين</h3>
                  <p class="text-xs text-gray-500 font-semibold mt-1">عرض وإدارة مراجعي البيانات لهذه الإدارة</p>
                </div>
                <button (click)="openAddReviewerModal()" class="bg-capmas-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-opacity-90 transition-all flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  إضافة مراجع جديد
                </button>
              </div>
              
              <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table class="w-full text-right border-collapse">
                  <thead class="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
                    <tr>
                      <th class="p-6">الاسم الكامل</th>
                      <th class="p-6">البريد الإلكتروني</th>
                      <th class="p-6 text-center">الحالة</th>
                      <th class="p-6 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50">
                    <tr *ngFor="let reviewer of reviewersList" class="hover:bg-gray-50 transition-colors">
                      <td class="p-6 text-sm font-bold text-gray-800">{{ reviewer.name }}</td>
                      <td class="p-6 text-sm text-gray-500 font-bold" dir="ltr">{{ reviewer.email }}</td>
                      <td class="p-6 text-center">
                        <span [class]="reviewer.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'" 
                              class="px-3 py-1 rounded-full text-[10px] font-bold border">
                          {{ reviewer.status === 'active' ? 'نشط' : 'معطل' }}
                        </span>
                      </td>
                      <td class="p-6 text-center">
                        <div class="flex justify-center gap-2">
                          <button class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                          </button>
                          <button (click)="deleteReviewer(reviewer.id)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Tab 2: External Entities -->
            <div *ngIf="activeTab === 'entities'" class="animate-fade-in-up">
              <div class="flex justify-between items-center mb-8">
                <div>
                  <h2 class="text-2xl font-bold text-gray-800">الجهات الخارجية المرتبطة</h2>
                  <p class="text-sm text-gray-500 font-semibold mt-1">عرض وإدارة كافة الجهات المرتبطة بـ {{ adminName }}</p>
                </div>
                <button (click)="openLinkEntityModal()" class="bg-capmas-secondary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-yellow-100 hover:bg-opacity-90 transition-all flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                   ربط جهة جديدة
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <a *ngFor="let entity of linkedEntities" 
                   [routerLink]="['/super-admin/administrations', adminId, 'entities', entity.id]"
                   class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col h-full relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-1.5 h-full" [class]="entity.status === 'on-time' ? 'bg-green-500' : 'bg-red-500'"></div>
                  <div class="flex justify-between items-start mb-6">
                    <div class="p-4 bg-blue-50 text-capmas-primary rounded-2xl group-hover:bg-capmas-primary group-hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                    </div>
                    <span [class]="entity.status === 'on-time' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'" 
                          class="px-4 py-1 rounded-full text-xs font-bold border shadow-sm">
                      {{ entity.status === 'on-time' ? 'منتظم' : 'متأخر' }}
                    </span>
                  </div>
                  <h3 class="font-bold text-gray-800 text-xl mb-1 group-hover:text-capmas-primary transition-colors leading-tight">{{ entity.name }}</h3>
                  <p class="text-sm text-gray-400 font-bold mb-8">{{ entity.type }}</p>
                  
                  <div class="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                    <div class="flex flex-col">
                      <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">التقارير المرفوعة</span>
                      <span class="text-lg font-bold text-gray-700 group-hover:text-capmas-primary transition-colors">{{ entity.reportsCount }}</span>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-capmas-primary group-hover:text-white transition-all shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 rotate-180"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <!-- Tab 3: Graph -->
            <div *ngIf="activeTab === 'graph'" class="animate-fade-in-up h-[500px]">
              <div echarts [options]="chartOptions" class="w-full h-full"></div>
            </div>

            <!-- Tab 4: Required Reports -->
            <div *ngIf="activeTab === 'required_reports'" class="animate-fade-in-up space-y-6">
              <div class="flex justify-between items-center mb-6">
                <div>
                  <h3 class="text-xl font-bold text-gray-800">التقارير المطلوبة</h3>
                  <p class="text-xs text-gray-500 font-semibold mt-1">إدارة كافة التقارير المطلوبة من الجهات الخارجية التابعة لهذه الإدارة</p>
                </div>
                <button (click)="exportReports()" class="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  تصدير Excel
                </button>
              </div>

              <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table class="w-full text-right border-collapse">
                  <thead class="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
                    <tr>
                      <th class="p-6">اسم التقرير</th>
                      <th class="p-6">الجهة الخارجية</th>
                      <th class="p-6 text-center">الدورية</th>
                      <th class="p-6 text-center">موعد الاستحقاق</th>
                      <th class="p-6 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50">
                    <tr *ngFor="let report of adminReports" class="hover:bg-gray-50 transition-colors group">
                      <td class="p-6 text-sm font-bold text-gray-800">{{ report.name }}</td>
                      <td class="p-6">
                        <span class="text-xs text-capmas-primary bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 font-bold">{{ getEntityName(report.entityId) }}</span>
                      </td>
                      <td class="p-6 text-center text-xs font-bold text-gray-600">{{ getFrequencyLabel(report.frequency) }}</td>
                      <td class="p-6 text-center text-xs font-bold text-gray-600">{{ report.dueDate }}</td>
                      <td class="p-6 text-center">
                        <div class="flex justify-center gap-2">
                          <a [routerLink]="['/super-admin/external-entities', report.entityId, 'reports', report.id, 'config']" 
                             class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                          </a>
                          <button (click)="deleteReport(report.id)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Tab 5: History -->
            <div *ngIf="activeTab === 'history'" class="animate-fade-in-up space-y-6">
              <div class="flex justify-between items-center mb-6">
                <div>
                  <h3 class="text-xl font-bold text-gray-800">سجل التقارير المقدمة</h3>
                  <p class="text-xs text-gray-500 font-semibold mt-1">تتبع تاريخ استلام التقارير وحالاتها لكل الجهات الخارجية</p>
                </div>
                <button (click)="exportHistory()" class="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  تصدير Excel
                </button>
              </div>

              <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table class="w-full text-right border-collapse">
                  <thead class="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
                    <tr>
                      <th class="p-6">اسم التقرير</th>
                      <th class="p-6">الجهة الخارجية</th>
                      <th class="p-6 text-center">تاريخ التسليم</th>
                      <th class="p-6 text-center">الحالة</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50">
                    <tr *ngFor="let row of adminHistory" class="hover:bg-gray-50 transition-colors">
                      <td class="p-6 text-sm font-bold text-gray-800">{{ row.name }}</td>
                      <td class="p-6">
                        <span class="text-xs text-capmas-primary bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 font-bold">{{ row.entityName }}</span>
                      </td>
                      <td class="p-6 text-center text-xs font-bold text-gray-600">{{ row.submissionDate }}</td>
                      <td class="p-6 text-center">
                        <span [class]="getStatusClass(row.status)" class="px-3 py-1.5 rounded-xl text-[10px] border shadow-sm font-bold">
                          {{ row.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals Overlay -->
      <div *ngIf="isLinkEntityModalOpen || isAddReviewerModalOpen" class="fixed inset-0 bg-gray-900/50 z-[100] backdrop-blur-sm" (click)="closeModals()"></div>

      <!-- Link Entity Modal -->
      <div *ngIf="isLinkEntityModalOpen" class="fixed inset-y-0 left-0 w-full max-w-md bg-white shadow-2xl z-[110] flex flex-col">
        <div class="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">ربط جهة خارجية</h2>
          <button (click)="closeModals()" class="text-gray-400 hover:text-gray-600">×</button>
        </div>
        <div class="p-6">
          <input type="text" [(ngModel)]="searchTerm" placeholder="بحث..." class="w-full p-2.5 border border-gray-200 rounded-lg mb-4">
          <div class="space-y-3 overflow-y-auto max-h-[60vh]">
            <div *ngFor="let entity of filteredAvailableEntities" 
                 (click)="toggleEntitySelection(entity.id)"
                 [class.border-capmas-primary]="isSelected(entity.id)"
                 [class.bg-blue-50]="isSelected(entity.id)"
                 class="p-4 border border-gray-100 rounded-xl cursor-pointer hover:border-capmas-primary transition-all flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-capmas-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-gray-800">{{ entity.name }}</p>
                  <p class="text-[10px] text-gray-500 font-semibold">{{ entity.type }}</p>
                </div>
              </div>
              
              <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                   [class.bg-capmas-primary]="isSelected(entity.id)"
                   [class.border-capmas-primary]="isSelected(entity.id)"
                   [class.border-gray-200]="!isSelected(entity.id)">
                <svg *ngIf="isSelected(entity.id)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3.5 h-3.5 text-white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="p-6 mt-auto border-t border-gray-100 flex gap-3">
          <button (click)="saveLinking()" [disabled]="selectedEntityIds.length === 0" class="flex-1 bg-capmas-primary text-white font-bold py-3 rounded-lg disabled:opacity-50">ربط المختار ({{ selectedEntityIds.length }})</button>
          <button (click)="closeModals()" class="px-6 py-3 border border-gray-200 rounded-lg">إلغاء</button>
        </div>
      </div>

      <!-- Add Reviewer Modal -->
      <div *ngIf="isAddReviewerModalOpen" class="fixed inset-y-0 left-0 w-full max-w-md bg-white shadow-2xl z-[110] flex flex-col animate-slide-in-left">
        <div class="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">إضافة مراجع جديد</h2>
          <button (click)="closeModals()" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div class="p-8 flex-1 overflow-y-auto space-y-6">
          <div>
            <label class="block text-xs font-bold text-gray-400 mb-2 mr-2">الاسم الكامل</label>
            <input type="text" [(ngModel)]="newReviewer.name" placeholder="مثال: أحمد محمد علي" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-capmas-primary outline-none font-bold">
          </div>
          
          <div>
            <label class="block text-xs font-bold text-gray-400 mb-2 mr-2">البريد الإلكتروني</label>
            <input type="email" [(ngModel)]="newReviewer.email" placeholder="example@capmas.gov.eg" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-capmas-primary outline-none font-bold text-left" dir="ltr">
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-400 mb-2 mr-2">كلمة المرور المؤقتة</label>
            <input type="password" [(ngModel)]="newReviewer.password" placeholder="••••••••" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-capmas-primary outline-none font-bold text-left" dir="ltr">
          </div>

          <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p class="text-xs text-blue-700 font-bold leading-relaxed">
              * سيتم إرسال دعوة بالبريد الإلكتروني للمراجع الجديد لتفعيل الحساب وتغيير كلمة المرور.
            </p>
          </div>
        </div>

        <div class="p-6 border-t border-gray-100 flex gap-3">
          <button (click)="addReviewer()" [disabled]="!newReviewer.name || !newReviewer.email" 
                  class="flex-1 bg-capmas-primary text-white font-bold py-3 rounded-2xl shadow-lg shadow-blue-100 hover:bg-opacity-90 transition-all disabled:opacity-50">
            حفظ البيانات
          </button>
          <button (click)="closeModals()" class="px-8 py-3 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all">إلغاء</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
    .animate-slide-in-left { animation: slideInLeft 0.3s ease-out forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
  `]
})
export class AdministrationDetailsComponent implements OnInit, OnDestroy {
  private adminService = inject(AdministrationService);
  private route = inject(ActivatedRoute);

  adminId: string = '';
  adminName = '';
  private sub = new Subscription();
  
  tabs = [
    { id: 'overview', title: 'نظرة عامة' },
    { id: 'required_reports', title: 'التقارير المطلوبة' },
    { id: 'history', title: 'سجل التسليم' },
    { id: 'reviewers', title: 'المراجعين' },
    { id: 'entities', title: 'الجهات الخارجية' },
    { id: 'graph', title: 'رسم بياني' }
  ];
  activeTab = 'overview';
  
  reviewersList: Reviewer[] = [];
  linkedEntities: ExternalEntity[] = [];
  availableEntities: ExternalEntity[] = [];
  adminReports: any[] = [];
  adminHistory: any[] = [];
  
  selectedEntityIds: string[] = [];
  searchTerm: string = '';
  lateReportsCount = 0;

  isLinkEntityModalOpen = false;
  isAddReviewerModalOpen = false;
  isEditReviewerModalOpen = false;
  isConfirmModalOpen = false;
  selectedReviewer: Reviewer | null = null;
  newReviewer = { name: '', email: '', password: '' };

  chartOptions: EChartsOption = {};
  entityPerformanceOptions: EChartsOption = {};
  reportStatusOptions: EChartsOption = {};

  ngOnInit() {
    this.sub.add(
      this.route.params.subscribe(params => {
        this.adminId = params['id'];
        this.loadData();
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get filteredAvailableEntities() {
    return this.availableEntities.filter(e => 
      e.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      e.type.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  loadData() {
    const admin = this.adminService.getAdministration(this.adminId);
    if (admin) {
      this.adminName = admin.name;
    }

    this.linkedEntities = this.adminService.getLinkedEntities(this.adminId);
    this.availableEntities = this.adminService.getAvailableEntities(this.adminId);
    
    this.reviewersList = [
      { id: '1', name: 'أحمد علي', email: 'a.ali@capmas.gov.eg', status: 'active', lastLogin: '2024-04-30 09:00', lastActivity: 'مراجعة تقرير التجارة' },
      { id: '2', name: 'سارة حسن', email: 's.hassan@capmas.gov.eg', status: 'active', lastLogin: '2024-04-30 10:15', lastActivity: 'تعديل بيانات مراجع' }
    ];

    this.sub.add(
      this.adminService.reports$.subscribe(reports => {
        this.adminReports = reports.filter(r => r.adminId === this.adminId);
        this.lateReportsCount = this.adminReports.filter(r => r.status === 'متأخر').length;
      })
    );

    this.adminHistory = [
      { name: 'بيان الواردات اليومي', entityName: 'مصلحة الجمارك المصرية', submissionDate: '2026-04-30', status: 'تم التسليم' },
      { name: 'تقرير حركة الحاويات الشهري', entityName: 'مصلحة الجمارك المصرية', submissionDate: '2026-04-10', status: 'متأخر' },
      { name: 'بيان ميزان المدفوعات', entityName: 'البنك المركزي المصري', submissionDate: '2026-04-01', status: 'قيد المراجعة' }
    ];

    this.updateVisuals();
  }

  getEntityName(id: string) {
    return this.adminService.getExternalEntity(id)?.name || id;
  }

  getFrequencyLabel(freq: string) {
    const labels: any = {
      daily: 'يومي',
      weekly: 'أسبوعي',
      monthly: 'شهري',
      quarterly: 'ربع سنوي',
      semi_annual: 'نصف سنوي',
      annual: 'سنوي'
    };
    return labels[freq] || freq;
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'تم التسليم': return 'bg-green-50 text-green-700 border-green-100';
      case 'قيد المراجعة': return 'bg-blue-50 text-capmas-primary border-blue-100';
      case 'متأخر': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  }

  exportReports() {
    alert('جاري تصدير قائمة التقارير المطلوبة إلى Excel...');
  }

  exportHistory() {
    alert('جاري تصدير سجل التقارير المقدمة إلى Excel...');
  }

  deleteReport(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا التقرير؟')) {
      this.adminService.deleteReport(id);
    }
  }

  updateVisuals() {
    this.chartOptions = {
      tooltip: { trigger: 'item' },
      series: [{
        type: 'graph',
        layout: 'force',
        data: [
          { name: this.adminName, symbolSize: 80, itemStyle: { color: '#1e3a8a' } },
          ...this.linkedEntities.map(e => ({ name: e.name, symbolSize: 50, itemStyle: { color: '#C89637' } }))
        ],
        links: this.linkedEntities.map(e => ({ source: this.adminName, target: e.name })),
        roam: true,
        label: { show: true, position: 'right' },
        force: { repulsion: 2000 }
      }]
    };

    this.entityPerformanceOptions = {
      xAxis: { type: 'category', data: this.linkedEntities.map(e => e.name) },
      yAxis: { type: 'value' },
      series: [{ data: this.linkedEntities.map(e => e.reportsCount), type: 'bar', itemStyle: { color: '#1e3a8a' } }]
    };

    this.reportStatusOptions = {
      series: [{
        type: 'pie',
        radius: '70%',
        data: [
          { value: 40, name: 'مقبول', itemStyle: { color: '#10b981' } },
          { value: 25, name: 'قيد المراجعة', itemStyle: { color: '#3b82f6' } },
          { value: 15, name: 'متأخر', itemStyle: { color: '#ef4444' } }
        ]
      }]
    };
  }

  openLinkEntityModal() {
    this.isLinkEntityModalOpen = true;
    this.searchTerm = '';
    this.selectedEntityIds = [];
  }

  toggleEntitySelection(id: string) {
    const index = this.selectedEntityIds.indexOf(id);
    if (index === -1) {
      this.selectedEntityIds.push(id);
    } else {
      this.selectedEntityIds.splice(index, 1);
    }
  }

  isSelected(id: string) {
    return this.selectedEntityIds.includes(id);
  }

  saveLinking() {
    this.adminService.linkEntities(this.adminId, this.selectedEntityIds);
    this.closeModals();
    this.loadData();
  }

  closeModals() {
    this.isLinkEntityModalOpen = false;
    this.isAddReviewerModalOpen = false;
    this.isEditReviewerModalOpen = false;
    this.isConfirmModalOpen = false;
  }

  openAddReviewerModal() { 
    this.newReviewer = { name: '', email: '', password: '' };
    this.isAddReviewerModalOpen = true; 
  }

  addReviewer() {
    if (this.newReviewer.name && this.newReviewer.email) {
      const reviewer: Reviewer = {
        id: Math.random().toString(36).substr(2, 9),
        name: this.newReviewer.name,
        email: this.newReviewer.email,
        status: 'active',
        lastLogin: '-',
        lastActivity: 'تمت الإضافة حديثاً'
      };
      this.reviewersList.push(reviewer);
      this.closeModals();
    }
  }

  deleteReviewer(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا المراجع؟')) {
      this.reviewersList = this.reviewersList.filter(r => r.id !== id);
    }
  }

  openEditReviewerModal(reviewer: Reviewer) {
    this.selectedReviewer = reviewer;
    this.isEditReviewerModalOpen = true;
  }
  openConfirmModal(item: any, action: string) { this.isConfirmModalOpen = true; }
}
