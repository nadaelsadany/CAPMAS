import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { Subscription } from 'rxjs';
import { AdministrationService, ExternalEntity, Administration } from '../../../core/services/administration.service';

@Component({
  selector: 'app-external-entity-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxEchartsModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto h-full flex flex-col text-right font-Cairo" dir="rtl">
      
      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2 text-gray-400 mb-8 text-xs font-bold tracking-wider">
        <a routerLink="/super-admin" class="hover:text-capmas-primary transition-colors">الرئيسية</a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 rotate-180"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        <a routerLink="/super-admin/external-entities" class="hover:text-capmas-primary transition-colors">الجهات الخارجية</a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 rotate-180"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        <span class="text-gray-800">{{ entity?.name }}</span>
      </div>

      <!-- Tabs Header -->
      <div class="flex gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-2xl w-fit overflow-x-auto max-w-full no-scrollbar">
        <button *ngFor="let tab of tabs" 
                (click)="activeTab = tab.id"
                [class]="activeTab === tab.id ? 'bg-white shadow-md text-capmas-primary border border-gray-100' : 'text-gray-500 hover:bg-white/50'"
                class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap">
          {{ tab.title }}
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="flex-1 min-h-0">
        
        <!-- Tab 1: Overview -->
        <div *ngIf="activeTab === 'overview'" class="animate-fade-in space-y-8 pb-10">
          
          <!-- Alerts Widget (Moved from Header) -->
          <div *ngIf="lateReports.length > 0" 
               class="flex items-center gap-6 bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 shadow-sm animate-fade-in">
            <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <div class="flex flex-col gap-1">
              <h4 class="font-bold text-2xl tracking-tight">تنبيه أداء الجهة</h4>
              <p class="text-sm font-semibold opacity-80 leading-relaxed">
                يوجد <span class="bg-red-600 text-white px-2 py-0.5 rounded-lg mx-1">{{ lateReports.length }} تقارير متأخرة</span> 
                تتطلب التدخل الفوري من الإدارات المعنية.
              </p>
            </div>
          </div>
          
          <!-- KPI Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div (click)="scrollToGraph()" 
                 class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center group hover:border-capmas-primary hover:shadow-md transition-all cursor-pointer">
              <span class="text-[10px] font-bold text-gray-400 uppercase mb-2">الإدارات المرتبطة</span>
              <h3 class="text-3xl font-bold text-gray-800 group-hover:text-capmas-primary">{{ linkedAdmins.length }}</h3>
              <span class="text-[10px] text-capmas-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity font-bold">عرض الجراف ↓</span>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center group hover:border-capmas-primary transition-all">
              <span class="text-[10px] font-bold text-gray-400 uppercase mb-2">إجمالي المطلوب</span>
              <h3 class="text-3xl font-bold text-gray-800 group-hover:text-capmas-primary">24</h3>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center group hover:border-red-500 transition-all">
              <span class="text-[10px] font-bold text-gray-400 uppercase mb-2">تقارير متأخرة</span>
              <h3 class="text-3xl font-bold text-red-500">{{ lateReports.length }}</h3>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center group hover:border-green-500 transition-all">
              <span class="text-[10px] font-bold text-gray-400 uppercase mb-2">مسلم في الموعد</span>
              <h3 class="text-3xl font-bold text-green-500">18</h3>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center group hover:border-capmas-secondary transition-all">
              <span class="text-[10px] font-bold text-gray-400 uppercase mb-2">نسبة الالتزام</span>
              <h3 class="text-3xl font-bold text-capmas-secondary">75%</h3>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Side: Alerts & Table -->
            <div class="lg:col-span-1 space-y-6">
              <!-- Clickable Alerts -->
              <div *ngIf="lateReports.length > 0" class="space-y-3">
                <div *ngFor="let report of lateReports" 
                     (click)="navigateToAdmin(report.adminId)"
                     class="p-4 bg-white border-r-4 border-red-500 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-red-50/50 transition-all flex items-center justify-between group">
                  <div>
                    <h5 class="text-sm font-bold text-gray-800 group-hover:text-red-600">{{ report.name }}</h5>
                    <p class="text-[10px] text-gray-400 font-bold mt-1">تأخير في: {{ report.adminName }}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-300 group-hover:text-red-500 rotate-180"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </div>
              </div>

              <!-- Late Reports Mini Table -->
              <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h4 class="font-bold text-gray-800 text-sm mb-6 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-red-500"></span>
                  التقارير المتأخرة حالياً
                </h4>
                <div class="space-y-4">
                  <div *ngFor="let report of lateReports" class="flex items-center justify-between text-xs font-bold p-3 bg-gray-50 rounded-xl">
                    <span class="text-gray-700">{{ report.name }}</span>
                    <span class="text-red-500">{{ report.daysLate }} أيام تأخير</span>
                  </div>
                  <div *ngIf="lateReports.length === 0" class="text-center py-6">
                    <p class="text-xs text-gray-400">لا يوجد تقارير متأخرة حالياً ✨</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side: Relationship Graph -->
            <div class="lg:col-span-2" #graphSection>
              <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
                <div class="flex justify-between items-center mb-8">
                  <h4 class="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <span class="w-2 h-6 bg-capmas-primary rounded-full"></span>
                    خريطة الارتباطات والأداء
                  </h4>
                  <div class="flex gap-4">
                    <div class="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                      <span class="w-2 h-2 rounded-full bg-green-500"></span> ملتزم
                    </div>
                    <div class="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                      <span class="w-2 h-2 rounded-full bg-red-500"></span> متأخر
                    </div>
                  </div>
                </div>
                <div echarts [options]="graphOptions" class="flex-1 min-h-[450px]"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Required Reports -->
        <div *ngIf="activeTab === 'required'" class="animate-fade-in space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let report of requiredReports" 
                 class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border-t-4"
                 [class.border-t-green-500]="report.status === 'منتظم'"
                 [class.border-t-red-500]="report.status === 'متأخر'">
              
              <div>
                <div class="flex justify-between items-start mb-4 relative">
                  <h4 class="text-lg font-bold text-gray-800 group-hover:text-capmas-primary transition-colors leading-tight pr-8">{{ report.name }}</h4>
                  <div class="flex flex-col items-end gap-2">
                    <span [class]="report.status === 'منتظم' ? 'text-green-600 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'" 
                          class="px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap">
                      {{ report.status }}
                    </span>
                    <button (click)="deleteReport(report.id)" 
                            class="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="حذف التقرير">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                    </button>
                  </div>
                </div>

                <div class="flex items-center gap-2 mb-6">
                  <span class="text-[10px] text-gray-400 font-bold uppercase">الجهة التابعة:</span>
                  <span class="bg-blue-50 text-capmas-primary px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-100">
                    {{ report.adminName }}
                  </span>
                </div>
              </div>

              <div class="space-y-3 pt-4 border-t border-gray-50">
                <div class="flex justify-between items-center text-xs font-bold">
                  <span class="text-gray-400">الدورية</span>
                  <span class="text-gray-700">{{ getFrequencyLabel(report.frequency) }}</span>
                </div>
                <div class="flex justify-between items-center text-xs font-bold">
                  <span class="text-gray-400">موعد التسليم</span>
                  <span class="text-gray-700">{{ report.dueDate }}</span>
                </div>
              </div>

              <a [routerLink]="['/super-admin/external-entities', entity?.id, 'reports', report.id, 'config']" 
                 class="mt-6 w-full py-2.5 bg-gray-50 hover:bg-capmas-primary hover:text-white rounded-xl text-xs font-bold text-gray-600 transition-all border border-gray-100 text-center">
                تعديل إعدادات التقرير
              </a>
            </div>
          </div>
          
          <div *ngIf="requiredReports.length === 0" class="bg-white p-20 rounded-3xl border border-gray-100 text-center shadow-sm">
             <p class="text-gray-400 font-bold">لا يوجد تقارير مطلوبة حالياً لهذه الجهة.</p>
          </div>
        </div>

        <!-- Tab 3: Add Report -->
        <div *ngIf="activeTab === 'add'" class="animate-fade-in max-w-4xl mx-auto">
          <div class="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <h3 class="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <span class="w-2 h-8 bg-capmas-secondary rounded-full"></span>
              إضافة تقرير جديد للجهة
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <!-- Mandatory Admin Selection -->
              <div class="col-span-1 md:col-span-2">
                <label class="block text-sm font-bold text-gray-500 mb-3">الإدارة العامة التابع لها التقرير <span class="text-red-500">*</span></label>
                <select [(ngModel)]="newReport.adminId" 
                        [class.border-red-300]="showAddErrors && !newReport.adminId"
                        class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-capmas-primary/10 outline-none text-md font-bold bg-gray-50/30 transition-all">
                  <option value="" disabled selected>اختر الإدارة العامة...</option>
                  <option *ngFor="let admin of linkedAdmins" [value]="admin.id">{{ admin.name }}</option>
                </select>
                <p *ngIf="showAddErrors && !newReport.adminId" class="text-red-500 text-xs font-bold mt-2 mr-2">يجب اختيار الإدارة العامة أولاً</p>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-500 mb-3">اسم التقرير <span class="text-red-500">*</span></label>
                <input type="text" [(ngModel)]="newReport.name" 
                       [class.border-red-300]="showAddErrors && !newReport.name"
                       placeholder="مثال: بيان الواردات اليومي" 
                       class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-capmas-primary/10 outline-none text-md font-bold bg-gray-50/30 transition-all">
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-500 mb-3">الدورية</label>
                <select [(ngModel)]="newReport.periodicity" class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-capmas-primary/10 outline-none text-md font-bold bg-gray-50/30">
                  <option>يومي</option>
                  <option>أسبوعي</option>
                  <option>شهري</option>
                  <option>ربع سنوي</option>
                  <option>سنوي</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-500 mb-3">تاريخ أول استحقاق</label>
                <input type="date" class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-capmas-primary/10 outline-none text-md font-bold bg-gray-50/30">
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-500 mb-3">فترة السماح (أيام)</label>
                <input type="number" class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-capmas-primary/10 outline-none text-md font-bold bg-gray-50/30" placeholder="0">
              </div>
            </div>

            <div class="flex gap-4">
              <button (click)="activeTab = 'required'" class="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">إلغاء</button>
              <button (click)="saveNewReport()" class="flex-[2] py-4 bg-capmas-primary text-white rounded-2xl font-bold hover:bg-opacity-90 shadow-lg shadow-blue-200 transition-all">
                إنشاء التقرير وربطه بالإدارة
              </button>
            </div>
          </div>
        </div>

        <!-- Tab 4: History -->
        <div *ngIf="activeTab === 'history'" class="animate-fade-in space-y-6 pb-20">
          <!-- Filters -->
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <label class="block text-[10px] font-bold text-gray-400 mb-2 mr-2">فلترة حسب الإدارة</label>
              <select [(ngModel)]="historyFilters.admin" class="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-capmas-primary/10 outline-none text-sm font-bold bg-gray-50/30">
                <option value="all">جميع الإدارات</option>
                <option *ngFor="let admin of linkedAdmins" [value]="admin.id">{{ admin.name }}</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-[10px] font-bold text-gray-400 mb-2 mr-2">فلترة حسب الحالة</label>
              <select [(ngModel)]="historyFilters.status" class="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-capmas-primary/10 outline-none text-sm font-bold bg-gray-50/30">
                <option value="all">جميع الحالات</option>
                <option value="تم التسليم">تم التسليم</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
                <option value="متأخر">متأخر</option>
                <option value="معاد للتعديل">معاد للتعديل</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-[10px] font-bold text-gray-400 mb-2 mr-2">تاريخ محدد</label>
              <input type="date" [(ngModel)]="historyFilters.date" class="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-capmas-primary/10 outline-none text-sm font-bold bg-gray-50/30">
            </div>
            <div class="flex items-end">
              <button (click)="exportHistory()" class="px-6 py-3 bg-green-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center gap-2 mb-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                تصدير Excel
              </button>
            </div>
          </div>

          <!-- History Table -->
          <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table class="w-full text-right border-collapse font-bold">
              <thead class="bg-gray-50/80 text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th class="p-6">اسم التقرير</th>
                  <th class="p-6">الإدارة المقدَّم لها</th>
                  <th class="p-6 text-center">الحالة</th>
                  <th class="p-6 text-center">تاريخ التسليم</th>
                  <th class="p-6 text-center">التأخير</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr *ngFor="let row of filteredHistory" class="hover:bg-gray-50 transition-colors group">
                  <td class="p-6">
                    <div class="text-gray-800">{{ row.name }}</div>
                  </td>
                  <td class="p-6">
                    <span class="text-xs text-capmas-primary bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{{ row.adminName }}</span>
                  </td>
                  <td class="p-6 text-center">
                    <span [class]="getStatusClass(row.status)" class="px-3 py-1.5 rounded-xl text-[10px] border shadow-sm">
                      {{ row.status }}
                    </span>
                  </td>
                  <td class="p-6 text-center text-sm text-gray-600">{{ row.submissionDate }}</td>
                  <td class="p-6 text-center">
                    <span *ngIf="row.daysLate > 0" class="text-red-500 text-xs">{{ row.daysLate }} أيام</span>
                    <span *ngIf="row.daysLate === 0" class="text-green-500 text-xs">لا يوجد</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    .animate-bounce-subtle { animation: bounce-subtle 3s infinite ease-in-out; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class ExternalEntityDetailsComponent implements OnInit, OnDestroy {
  private adminService = inject(AdministrationService);
  private route = inject(ActivatedRoute);
  private sub = new Subscription();

  @ViewChild('graphSection') graphSection!: ElementRef;

  entity: ExternalEntity | null = null;
  linkedAdmins: Administration[] = [];
  activeTab: string = 'overview';

  tabs = [
    { id: 'overview', title: 'نظرة عامة (Overview)' },
    { id: 'required', title: 'التقارير المطلوبة والإعدادات' },
    { id: 'add', title: 'إضافة تقرير جديد' },
    { id: 'history', title: 'سجل التقارير المقدمة (History)' }
  ];

  lateReports = [
    { id: 1, name: 'تقرير حركة الحاويات الشهري', adminId: 'it-dept', adminName: 'إدارة تقنية المعلومات', daysLate: 3 },
    { id: 2, name: 'بيان ميزان المدفوعات', adminId: 'planning', adminName: 'إدارة التخطيط', daysLate: 5 }
  ];

  submissionHistory = [
    { name: 'بيان الواردات اليومي', adminName: 'إدارة التجارة الخارجية', submissionDate: '2026-04-30', status: 'تم التسليم', daysLate: 0, adminId: 'trade' },
    { name: 'بيان الواردات اليومي', adminName: 'إدارة التجارة الخارجية', submissionDate: '2026-04-29', status: 'تم التسليم', daysLate: 0, adminId: 'trade' },
    { name: 'تقرير حركة الحاويات الشهري', adminName: 'إدارة تقنية المعلومات', submissionDate: '2026-04-10', status: 'معاد للتعديل', daysLate: 5, adminId: 'it-dept' },
    { name: 'تقرير حركة الحاويات الشهري', adminName: 'إدارة تقنية المعلومات', submissionDate: '2026-04-05', status: 'متأخر', daysLate: 3, adminId: 'it-dept' },
    { name: 'بيان ميزان المدفوعات', adminName: 'إدارة التخطيط', submissionDate: '2026-04-01', status: 'قيد المراجعة', daysLate: 0, adminId: 'planning' }
  ];

  requiredReports: any[] = [];

  historyFilters = { admin: 'all', status: 'all', date: '' };
  
  newReport = { name: '', adminId: '', periodicity: 'شهري' };
  showAddErrors = false;

  graphOptions: any = {};

  ngOnInit() {
    this.sub.add(
      this.route.params.subscribe(params => {
        const id = params['entityId'];
        if (id) {
          this.entity = this.adminService.getExternalEntity(id) || null;
          this.loadLinkedAdmins(id);
          this.initGraph();
        }
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  loadLinkedAdmins(entityId: string) {
    this.sub.add(
      this.adminService.administrations$.subscribe(admins => {
        this.linkedAdmins = admins.filter(a => a.linkedEntityIds.includes(entityId));
        this.initGraph();
      })
    );

    this.sub.add(
      this.adminService.reports$.subscribe(reports => {
        this.requiredReports = reports.filter(r => r.entityId === entityId);
      })
    );
  }

  scrollToGraph() {
    this.graphSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  saveNewReport() {
    if (!this.newReport.name || !this.newReport.adminId) {
      this.showAddErrors = true;
      return;
    }
    
    this.adminService.saveReport({
      id: 'rep-' + Math.random().toString(36).substr(2, 9),
      name: this.newReport.name,
      description: '',
      adminId: this.newReport.adminId,
      entityId: this.entity?.id || '',
      frequency: this.newReport.periodicity as any,
      dueDate: 'يتم التحديد',
      gracePeriod: 0,
      inputMethod: 'form',
      status: 'منتظم',
      dynamicFields: []
    });
    
    // Reset and switch back
    this.newReport = { name: '', adminId: '', periodicity: 'شهري' };
    this.showAddErrors = false;
    this.activeTab = 'required';
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

  deleteReport(reportId: string) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا التقرير نهائياً؟')) {
      this.adminService.deleteReport(reportId);
    }
  }

  exportHistory() {
    alert('جاري تجهيز ملف Excel للتقرير... سيتم التحميل خلال لحظات');
  }

  initGraph() {
    if (!this.entity) return;

    const nodes: any[] = [
      { 
        name: this.entity.name, 
        symbolSize: 80, 
        itemStyle: { color: '#0986ED' },
        label: { show: true, position: 'bottom', fontWeight: 'bold', fontFamily: 'Cairo', fontSize: 14 }
      }
    ];

    const links: any[] = [];

    this.linkedAdmins.forEach(admin => {
      const isLate = this.lateReports.some(r => r.adminId === admin.id);
      nodes.push({
        name: admin.name,
        symbolSize: 50,
        itemStyle: { color: isLate ? '#ef4444' : '#C89637' },
        label: { show: true, position: 'right', fontSize: 10, fontWeight: 'bold', fontFamily: 'Cairo' }
      });
      links.push({ source: this.entity!.name, target: admin.name });
    });

    this.graphOptions = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            if (params.name === this.entity?.name) return `جهة خارجية: ${params.name}`;
            return `إدارة عامة: ${params.name}<br/>الحالة: ${this.lateReports.some(r => r.adminName === params.name) ? 'يوجد تأخير' : 'ملتزم'}`;
          }
          return '';
        }
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          animation: true,
          draggable: true,
          data: nodes,
          links: links,
          roam: true,
          label: { position: 'right', formatter: '{b}', fontFamily: 'Cairo' },
          force: { repulsion: 1000, edgeLength: [100, 200] },
          lineStyle: { color: '#e2e8f0', width: 2, curveness: 0.1 }
        }
      ]
    };
  }

  get filteredHistory() {
    return this.submissionHistory.filter(h => {
      const matchesAdmin = this.historyFilters.admin === 'all' || h.adminId === this.historyFilters.admin;
      const matchesStatus = this.historyFilters.status === 'all' || h.status === this.historyFilters.status;
      return matchesAdmin && matchesStatus;
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'تم التسليم': return 'bg-green-50 text-green-700 border-green-100';
      case 'قيد المراجعة': return 'bg-blue-50 text-capmas-primary border-blue-100';
      case 'متأخر': return 'bg-red-50 text-red-700 border-red-100';
      case 'معاد للتعديل': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  }

  navigateToAdmin(adminId: string) {
    // Navigate to admin details if needed
  }
}
