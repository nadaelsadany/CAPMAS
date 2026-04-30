import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-external-entity-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxEchartsModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto h-full flex flex-col">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div class="flex items-center gap-2 text-gray-500 mb-2 text-sm font-semibold">
            <a [routerLink]="['/super-admin/administrations', adminId]" class="hover:text-capmas-primary transition-colors">{{ adminName }}</a>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            <span class="text-gray-800">{{ entityName }}</span>
          </div>
          <div class="flex items-center gap-4">
            <h1 class="text-3xl font-bold text-gray-800">{{ entityName }}</h1>
            <span class="px-3 py-1 bg-blue-50 text-capmas-primary rounded-full text-xs font-bold border border-blue-100">{{ entityType }}</span>
            <span [class]="commitmentClass" class="px-3 py-1 rounded-full text-xs font-bold border">{{ commitmentStatus }}</span>
          </div>
        </div>
        
        <div *ngIf="lateReportsCount > 0" class="flex items-center gap-3 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          <div class="flex flex-col">
            <span class="font-bold text-sm">تنبيه: يوجد تقارير متأخرة</span>
            <span class="text-xs font-semibold">يوجد عدد {{ lateReportsCount }} تقرير لم يتم تسليمه في الموعد</span>
          </div>
        </div>
      </div>

      <!-- Main Content with Tabs -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
        
        <!-- Tabs Header -->
        <div class="flex border-b border-gray-100 bg-gray-50 px-6 shrink-0 overflow-x-auto">
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
        <div class="flex-1 overflow-y-auto p-8">
          
          <!-- Tab 1: Overview -->
          <div *ngIf="activeTab === 'overview'" class="animate-fade-in">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div class="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                <p class="text-sm font-bold text-blue-600 mb-1">التقارير المطلوبة</p>
                <h3 class="text-3xl font-bold text-blue-800">12</h3>
              </div>
              <div class="bg-green-50 border border-green-100 p-6 rounded-2xl">
                <p class="text-sm font-bold text-green-600 mb-1">التقارير المسلمة</p>
                <h3 class="text-3xl font-bold text-green-800">8</h3>
              </div>
              <div class="bg-red-50 border border-red-100 p-6 rounded-2xl">
                <p class="text-sm font-bold text-red-600 mb-1">التقارير المتأخرة</p>
                <h3 class="text-3xl font-bold text-red-800">2</h3>
              </div>
              <div class="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl">
                <p class="text-sm font-bold text-yellow-600 mb-1">نسبة الالتزام</p>
                <h3 class="text-3xl font-bold text-yellow-800">75%</h3>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                <h3 class="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span class="w-2 h-6 bg-capmas-primary rounded-full"></span>
                  تحليل حالة التقارير
                </h3>
                <div echarts [options]="statusChartOptions" class="h-64"></div>
              </div>
              <div class="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                <h3 class="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span class="w-2 h-6 bg-capmas-secondary rounded-full"></span>
                  الالتزام الزمني (آخر 6 أشهر)
                </h3>
                <div echarts [options]="historyChartOptions" class="h-64"></div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Required Reports -->
          <div *ngIf="activeTab === 'reports'" class="animate-fade-in">
            <div *ngIf="!selectedReport">
              <div class="flex justify-between items-center mb-8">
                <div class="relative w-full max-w-md">
                  <span class="absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                  </span>
                  <input type="text" placeholder="ابحث عن تقرير..." class="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-capmas-primary/20 focus:border-capmas-primary text-sm font-semibold transition-all">
                </div>
                <button (click)="createNewReport()" class="bg-capmas-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  إضافة تقرير جديد
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div *ngFor="let report of reports" (click)="selectReport(report)" class="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:border-capmas-primary hover:shadow-md transition-all cursor-pointer">
                  <div class="flex justify-between items-start mb-4">
                    <h3 class="font-bold text-gray-800 group-hover:text-capmas-primary transition-colors">{{ report.name }}</h3>
                    <span [class]="report.statusClass" class="px-2.5 py-1 rounded-full text-[10px] font-bold border">{{ report.lastStatus }}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-4 text-xs font-bold text-gray-500 mb-4">
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                      {{ report.periodicity }}
                    </div>
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      يوم {{ report.deliveryDay }} من الشهر
                    </div>
                  </div>
                  <div class="flex items-center gap-2 text-xs font-bold text-capmas-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    طريقة الإدخال: {{ report.inputMethod }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Report Details Sub-view -->
            <div *ngIf="selectedReport" class="animate-fade-in">
              <div class="flex items-center gap-4 mb-8">
                <button (click)="selectedReport = null" class="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </button>
                <h3 class="text-2xl font-bold text-gray-800">{{ selectedReport.isNew ? 'إعداد تقرير جديد للجهة' : 'تعديل إعدادات: ' + selectedReport.name }}</h3>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-1 space-y-6">
                  <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 class="font-bold text-gray-800 mb-6 text-sm">إعدادات التسليم</h4>
                    <div class="space-y-4">
                      <div *ngIf="selectedReport.isNew">
                        <label class="block text-xs font-bold text-gray-500 mb-2">اسم التقرير <span class="text-red-500">*</span></label>
                        <input type="text" [(ngModel)]="selectedReport.name" placeholder="مثال: التقرير اليومي للبيانات" class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white">
                      </div>
                      <div>
                        <label class="block text-xs font-bold text-gray-500 mb-2">الدورية</label>
                        <select [(ngModel)]="selectedReport.periodicity" class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white">
                          <option>شهري</option>
                          <option>نصف سنوي</option>
                          <option>سنوي</option>
                        </select>
                      </div>

                      <div *ngIf="selectedReport.periodicity === 'سنوي' || selectedReport.periodicity === 'نصف سنوي'" class="animate-fade-in">
                        <label class="block text-xs font-bold text-gray-500 mb-2">شهر التسليم</label>
                        <select [(ngModel)]="selectedReport.deliveryMonth" class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white">
                          <option *ngFor="let m of months; let i = index" [value]="i + 1">{{ m }}</option>
                        </select>
                      </div>

                      <div>
                        <label class="block text-xs font-bold text-gray-500 mb-2">يوم التسليم</label>
                        <input type="number" [(ngModel)]="selectedReport.deliveryDay" class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white">
                      </div>
                      <div>
                        <label class="block text-xs font-bold text-gray-500 mb-2">فترة السماح (أيام)</label>
                        <input type="number" [(ngModel)]="selectedReport.gracePeriod" class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white">
                      </div>
                      
                      <div class="pt-4 border-t border-gray-100">
                        <label class="block text-xs font-bold text-gray-500 mb-3">طريقة إدخال البيانات</label>
                        <div class="space-y-2">
                          <label class="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl cursor-pointer hover:bg-blue-50/50 transition-all">
                            <input type="checkbox" [(ngModel)]="selectedMethods.form" class="w-4 h-4 text-capmas-primary rounded border-gray-300 focus:ring-capmas-primary">
                            <span class="text-sm font-bold text-gray-700">إدخال يدوي عبر نموذج (Form)</span>
                          </label>
                          <label class="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl cursor-pointer hover:bg-blue-50/50 transition-all">
                            <input type="checkbox" [(ngModel)]="selectedMethods.excel" class="w-4 h-4 text-capmas-primary rounded border-gray-300 focus:ring-capmas-primary">
                            <span class="text-sm font-bold text-gray-700">رفع ملف Excel</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button class="w-full bg-capmas-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-opacity-90 transition-all">
                    {{ selectedReport.isNew ? 'إنشاء التقرير' : 'حفظ الإعدادات' }}
                  </button>
                </div>

                <div class="lg:col-span-2 space-y-6">
                  <div *ngIf="selectedMethods.form" class="bg-white border border-gray-100 rounded-2xl p-6 animate-fade-in">
                    <div class="flex justify-between items-center mb-6">
                      <h4 class="font-bold text-gray-800 text-sm flex items-center gap-2">
                        نموذج البيانات (Template)
                        <span class="text-[10px] text-gray-400 font-normal">(يحدد الأعمدة المطلوبة)</span>
                      </h4>
                      <button (click)="isAddFieldModalOpen = true" class="text-capmas-primary text-xs font-bold hover:underline flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        إضافة حقل
                      </button>
                    </div>
                    
                    <div class="space-y-3">
                      <div *ngFor="let field of reportFields; let i = index" class="group flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-capmas-primary/30 transition-all">
                        <span class="w-8 h-8 flex items-center justify-center bg-white rounded-lg font-bold text-gray-400 text-xs shadow-sm">{{ i + 1 }}</span>
                        <div class="flex-1">
                          <p class="text-sm font-bold text-gray-800">{{ field.name }}</p>
                          <p class="text-[10px] text-gray-500 font-semibold">نوع الحقل: {{ field.type }}</p>
                        </div>
                        <div class="flex items-center gap-3">
                          <span *ngIf="field.required" class="px-2 py-1 bg-blue-50 text-capmas-primary text-[10px] font-bold rounded">إلزامي</span>
                          <button (click)="removeField(i)" class="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100" title="حذف الحقل">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                          </button>
                        </div>
                      </div>
                      
                      <div *ngIf="reportFields.length === 0" class="p-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                        <p class="text-xs font-bold text-gray-400">لا توجد حقول معرفة. ابدأ بإضافة حقول للتقرير.</p>
                      </div>
                    </div>
                  </div>

                  <div class="bg-white border border-gray-100 rounded-2xl p-6">
                    <div class="flex justify-between items-center mb-6">
                      <h4 class="font-bold text-gray-800 text-sm">معاينة التقرير (كما يظهر للجهة)</h4>
                      <div *ngIf="selectedMethods.form && selectedMethods.excel" class="flex bg-gray-100 p-1 rounded-lg">
                        <button (click)="previewType = 'form'" [class]="previewType === 'form' ? 'bg-white shadow-sm text-capmas-primary' : 'text-gray-500'" class="px-3 py-1.5 rounded-md text-[10px] font-bold transition-all">نموذج يدوي</button>
                        <button (click)="previewType = 'excel'" [class]="previewType === 'excel' ? 'bg-white shadow-sm text-capmas-primary' : 'text-gray-500'" class="px-3 py-1.5 rounded-md text-[10px] font-bold transition-all">رفع Excel</button>
                      </div>
                    </div>

                    <div *ngIf="selectedMethods.form && (previewType === 'form' || !selectedMethods.excel)" class="p-6 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30 animate-fade-in">
                       <h5 class="text-center font-bold text-gray-600 mb-6">{{ selectedReport.name }}</h5>
                       <div class="grid grid-cols-2 gap-4">
                          <div *ngFor="let field of reportFields" class="col-span-1">
                            <label class="block text-xs font-bold text-gray-400 mb-2">{{ field.name }}</label>
                            <input type="text" disabled class="w-full bg-white border border-gray-100 rounded-lg p-2">
                          </div>
                          <div class="col-span-2 mt-2">
                            <button class="w-full bg-capmas-secondary/50 text-white font-bold py-2 rounded-lg cursor-not-allowed">إرسال التقرير</button>
                          </div>
                       </div>
                    </div>

                    <div *ngIf="selectedMethods.excel && (previewType === 'excel' || !selectedMethods.form)" class="p-6 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30 animate-fade-in">
                      <div class="text-center mb-8">
                        <button class="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-capmas-primary font-bold hover:bg-blue-50 transition-all shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                          تحميل نموذج Excel
                        </button>
                        <p class="text-[10px] text-gray-400 font-bold mt-2">النموذج يحتوي على كافة الحقول المعرفة أعلاه</p>
                      </div>

                      <div class="border-2 border-dashed border-blue-200 rounded-2xl p-10 bg-white flex flex-col items-center justify-center transition-all hover:bg-blue-50/50 cursor-pointer">
                        <div class="w-12 h-12 bg-blue-50 text-capmas-primary rounded-full flex items-center justify-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        </div>
                        <p class="text-sm font-bold text-gray-800 mb-1">اسحب ملف Excel هنا</p>
                        <p class="text-xs text-gray-400 font-semibold">أو اضغط لاختيار الملف من جهازك</p>
                      </div>
                      
                      
                      <div *ngIf="uploadStatus !== 'idle'" class="mt-6 p-4 rounded-xl border animate-fade-in" 
                           [ngClass]="uploadStatus === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'">
                        <div class="flex items-center gap-3">
                          <svg *ngIf="uploadStatus === 'success'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <svg *ngIf="uploadStatus === 'error'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                          <span class="text-sm font-bold">{{ uploadStatus === 'success' ? 'تم التحقق من الملف بنجاح' : 'خطأ في التحقق من الملف' }}</span>
                        </div>
                        <p class="text-xs font-semibold mt-1 opacity-80">{{ uploadStatus === 'success' ? 'الملف مطابق للمواصفات الفنية.' : 'الرجاء التأكد من وجود كافة الأعمدة المطلوبة وصحة البيانات.' }}</p>
                      </div>
                    </div>

                    <div *ngIf="!selectedMethods.form && !selectedMethods.excel" class="p-12 text-center border-2 border-dashed border-gray-100 rounded-2xl animate-fade-in">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-gray-300 mx-auto mb-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                      <p class="text-sm font-bold text-gray-400">يرجى اختيار طريقة إدخال البيانات لعرض المعاينة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 3: Submitted Reports -->
          <div *ngIf="activeTab === 'submitted'" class="animate-fade-in">
            <div class="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table class="w-full text-right">
                <thead class="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th class="p-5 font-bold text-sm text-gray-600">اسم التقرير</th>
                    <th class="p-5 font-bold text-sm text-gray-600">تاريخ التسليم</th>
                    <th class="p-5 font-bold text-sm text-gray-600">الحالة</th>
                    <th class="p-5 font-bold text-sm text-gray-600">التأخير</th>
                    <th class="p-5 font-bold text-sm text-gray-600">المراجع</th>
                    <th class="p-5 font-bold text-sm text-gray-600">الإجراءات</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr *ngFor="let row of submittedHistory" class="hover:bg-gray-50 transition-colors">
                    <td class="p-5 font-bold text-gray-800">{{ row.name }}</td>
                    <td class="p-5 text-sm font-semibold text-gray-500">{{ row.date }}</td>
                    <td class="p-5">
                      <span [class]="row.statusClass" class="px-2.5 py-1 rounded-full text-[10px] font-bold border">{{ row.status }}</span>
                    </td>
                    <td class="p-5 text-sm font-bold" [class]="row.delay > 0 ? 'text-red-500' : 'text-green-500'">
                      {{ row.delay > 0 ? row.delay + ' يوم' : 'لا يوجد' }}
                    </td>
                    <td class="p-5 text-sm font-semibold text-gray-600">{{ row.reviewer }}</td>
                    <td class="p-5">
                      <button (click)="viewSubmissionDetails(row)" class="text-capmas-primary font-bold text-xs hover:underline transition-all">عرض التفاصيل</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

    </div>

    <!-- Add Field Modal -->
    <div *ngIf="isAddFieldModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" (click)="isAddFieldModalOpen = false"></div>
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden animate-fade-in-up">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="font-bold text-gray-800">إضافة حقل جديد للنموذج</h3>
          <button (click)="isAddFieldModalOpen = false" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-2">اسم الحقل <span class="text-red-500">*</span></label>
            <input type="text" [(ngModel)]="newField.name" placeholder="مثال: عدد الموظفين" class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 mb-2">نوع البيانات</label>
              <select [(ngModel)]="newField.type" class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white">
                <option>رقمي</option>
                <option>نصي</option>
                <option>تاريخ</option>
                <option>عملة</option>
                <option>قائمة خيارات</option>
              </select>
            </div>
            <div class="flex items-end pb-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="newField.required" class="w-4 h-4 text-capmas-primary rounded border-gray-300">
                <span class="text-xs font-bold text-gray-700">حقل إلزامي</span>
              </label>
            </div>
          </div>
          <div class="pt-4 flex gap-3">
            <button (click)="isAddFieldModalOpen = false" class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">إلغاء</button>
            <button (click)="addField()" [disabled]="!newField.name" class="flex-1 py-2.5 bg-capmas-primary text-white rounded-xl text-sm font-bold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">إضافة الحقل</button>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Submission Details Modal -->
    <div *ngIf="selectedSubmission" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" (click)="selectedSubmission = null"></div>
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-fade-in-up">
        <div class="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 class="text-xl font-bold text-gray-800">{{ selectedSubmission.name }}</h3>
            <p class="text-sm text-gray-500 font-semibold mt-1">تاريخ التسليم: {{ selectedSubmission.date }}</p>
          </div>
          <button (click)="selectedSubmission = null" class="p-2 hover:bg-white rounded-full transition-all text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div class="p-8 space-y-8">
          <!-- Submission Info -->
          <div class="grid grid-cols-3 gap-6">
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p class="text-[10px] text-gray-400 font-bold mb-1">الحالة</p>
              <span [class]="selectedSubmission.statusClass" class="px-2 py-0.5 rounded-full text-[10px] font-bold border">{{ selectedSubmission.status }}</span>
            </div>
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p class="text-[10px] text-gray-400 font-bold mb-1">المراجع</p>
              <p class="text-sm font-bold text-gray-700">{{ selectedSubmission.reviewer }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p class="text-[10px] text-gray-400 font-bold mb-1">التأخير</p>
              <p class="text-sm font-bold" [class]="selectedSubmission.delay > 0 ? 'text-red-500' : 'text-green-500'">
                {{ selectedSubmission.delay > 0 ? selectedSubmission.delay + ' يوم' : 'لا يوجد' }}
              </p>
            </div>
          </div>

          <!-- Data Content -->
          <div>
            <h4 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-capmas-primary"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              بيانات التقرير المستلمة
            </h4>
            <div class="border border-gray-100 rounded-2xl overflow-hidden">
              <table class="w-full text-right text-sm">
                <thead class="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th class="p-4 font-bold text-gray-600">الحقل</th>
                    <th class="p-4 font-bold text-gray-600">القيمة</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr>
                    <td class="p-4 text-gray-500 font-semibold">إجمالي عدد الحاويات</td>
                    <td class="p-4 font-bold text-gray-800">1,245 حاوية</td>
                  </tr>
                  <tr>
                    <td class="p-4 text-gray-500 font-semibold">قيمة الرسوم الجمركية</td>
                    <td class="p-4 font-bold text-gray-800">245,000 ج.م</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button (click)="selectedSubmission = null" class="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all">إغلاق</button>
            <button class="flex-1 py-3 bg-capmas-primary text-white rounded-2xl font-bold hover:bg-opacity-90 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              تحميل التقرير الأصلي
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ExternalEntityDetailsComponent implements OnInit {
  adminId: string = '';
  adminName: string = 'إدارة التجارة الخارجية';
  entityId: string = '';
  entityName: string = 'هيئة الجمارك المصرية';
  entityType: string = 'هيئة حكومية';
  commitmentStatus: string = 'التزام متوسط';
  commitmentClass: string = 'bg-yellow-50 text-yellow-600 border-yellow-100';
  lateReportsCount: number = 2;

  activeTab: string = 'overview';
  selectedReport: any = null;
  
  // Input Method State
  selectedMethods = { form: true, excel: false };
  previewType: 'form' | 'excel' = 'form';
  uploadStatus: 'idle' | 'success' | 'error' = 'idle';
  fileName: string = '';

  tabs = [
    { id: 'overview', title: 'نظرة عامة (Overview)' },
    { id: 'reports', title: 'التقارير المطلوبة والإعدادات' },
    { id: 'submitted', title: 'التقارير المقدمة' }
  ];

  reports = [
    { id: 1, name: 'بيان الواردات اليومي', periodicity: 'يومي', deliveryDay: 1, inputMethod: 'رفع ملف Excel', lastStatus: 'تم التسليم', statusClass: 'bg-green-50 text-green-600 border-green-100', gracePeriod: 2 },
    { id: 2, name: 'تقرير حركة الحاويات الشهري', periodicity: 'شهري', deliveryDay: 5, inputMethod: 'نموذج مباشر (Form)', lastStatus: 'متأخر', statusClass: 'bg-red-50 text-red-600 border-red-100', gracePeriod: 3 }
  ];

  submittedHistory = [
    { name: 'بيان الواردات اليومي', date: '2026-04-28', status: 'مقبول', statusClass: 'bg-green-50 text-green-600 border-green-100', delay: 0, reviewer: 'أحمد محمود' },
    { name: 'بيان الواردات اليومي', date: '2026-04-27', status: 'مقبول', statusClass: 'bg-green-50 text-green-600 border-green-100', delay: 0, reviewer: 'سارة حسن' },
    { name: 'تقرير حركة الحاويات الشهري', date: '2026-04-01', status: 'معاد للتعديل', statusClass: 'bg-yellow-50 text-yellow-600 border-yellow-100', delay: 3, reviewer: 'أحمد محمود' }
  ];

  statusChartOptions: any = {};
  historyChartOptions: any = {};

  // Field Management State
  isAddFieldModalOpen = false;
  reportFields = [
    { name: 'إجمالي عدد الحاويات', type: 'رقمي', required: true },
    { name: 'قيمة الرسوم الجمركية', type: 'عملة', required: true }
  ];
  newField = { name: '', type: 'رقمي', required: true };
  
  months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  selectedSubmission: any = null;

  addField() {
    if (this.newField.name) {
      this.reportFields.push({ ...this.newField });
      this.newField = { name: '', type: 'رقمي', required: true };
      this.isAddFieldModalOpen = false;
    }
  }

  removeField(index: number) {
    this.reportFields.splice(index, 1);
  }

  viewSubmissionDetails(submission: any) {
    this.selectedSubmission = submission;
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.adminId = this.route.snapshot.paramMap.get('id') || '';
    this.entityId = this.route.snapshot.paramMap.get('entityId') || '';
    this.initCharts();
  }

  selectReport(report: any) {
    this.selectedReport = { ...report, isNew: false };
    this.selectedMethods = { 
      form: report.inputMethod.includes('نموذج'), 
      excel: report.inputMethod.includes('Excel') 
    };
  }

  createNewReport() {
    this.selectedReport = {
      name: '',
      periodicity: 'شهري',
      deliveryDay: 1,
      deliveryMonth: 1,
      inputMethod: 'نموذج مباشر (Form)',
      gracePeriod: 0,
      isNew: true
    };
    this.selectedMethods = { form: true, excel: false };
    this.previewType = 'form';
  }

  initCharts() {
    this.statusChartOptions = {
      tooltip: { trigger: 'item' },
      legend: { bottom: '0%', left: 'center', textStyle: { fontFamily: 'Cairo', fontWeight: 'bold' } },
      series: [
        {
          name: 'حالة التقارير',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false },
          data: [
            { value: 10, name: 'في الموعد', itemStyle: { color: '#0986ED' } },
            { value: 2, name: 'متأخر', itemStyle: { color: '#ef4444' } },
            { value: 3, name: 'قيد المراجعة', itemStyle: { color: '#C89637' } }
          ]
        }
      ]
    };

    this.historyChartOptions = {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        axisLabel: { fontWeight: 'bold', color: '#94a3b8' }
      },
      yAxis: { type: 'value', axisLabel: { fontWeight: 'bold', color: '#94a3b8' } },
      series: [
        {
          name: 'نسبة الالتزام',
          type: 'line',
          smooth: true,
          data: [80, 85, 70, 90, 75, 80],
          itemStyle: { color: '#0986ED' },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{ offset: 0, color: 'rgba(9, 134, 237, 0.3)' }, { offset: 1, color: 'rgba(9, 134, 237, 0)' }]
            }
          }
        }
      ]
    };
  }
}
