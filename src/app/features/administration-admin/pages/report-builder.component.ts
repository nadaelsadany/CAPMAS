import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdministrationService, Report, Administration } from '../../../core/services/administration.service';

@Component({
  selector: 'app-report-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex flex-col lg:flex-row h-screen font-Cairo text-right overflow-hidden bg-gray-50" dir="rtl">
      
      <!-- Left Pane: Report Builder -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white border-l border-gray-100 relative">
        <div class="max-w-3xl mx-auto">
          <div class="flex items-center gap-2 text-gray-400 mb-8 text-xs font-bold tracking-wider">
            <a routerLink="/super-admin" class="hover:text-capmas-primary transition-colors">الرئيسية</a>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 rotate-180"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            <a [routerLink]="['/super-admin/external-entities', entityId]" class="hover:text-capmas-primary transition-colors">تفاصيل الجهة</a>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 rotate-180"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            <span class="text-gray-800">إعدادات التقرير</span>
          </div>

          <div class="mb-10">
            <h1 class="text-3xl font-bold text-capmas-primary mb-3">إعداد التقرير</h1>
            <p class="text-gray-500 font-semibold">بناء هيكل التقرير أو رفع قالب جاهز للاستخدام.</p>
          </div>

          <form [formGroup]="reportForm" (ngSubmit)="saveReport()" class="space-y-8 pb-32">
            
            <!-- Basic Settings -->
            <div class="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <h2 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span class="w-1.5 h-5 bg-capmas-primary rounded-full"></span>
                الإعدادات الأساسية
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label class="block text-sm font-bold text-gray-500 mb-2">اسم التقرير <span class="text-red-500">*</span></label>
                  <input type="text" formControlName="name" placeholder="مثال: التقرير الشهري للنمو" class="w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-capmas-primary outline-none font-bold shadow-sm">
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-bold text-gray-500 mb-2">وصف التقرير</label>
                  <textarea formControlName="description" rows="3" placeholder="شرح موجز لمحتوى التقرير..." class="w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-capmas-primary outline-none font-bold shadow-sm"></textarea>
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-500 mb-2">الإدارة المسؤولة <span class="text-red-500">*</span></label>
                  <select formControlName="adminId" class="w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-capmas-primary outline-none font-bold shadow-sm">
                    <option value="" disabled>اختر الإدارة...</option>
                    <option *ngFor="let admin of availableAdmins" [value]="admin.id">{{ admin.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-500 mb-2">الدورية <span class="text-red-500">*</span></label>
                  <select formControlName="frequency" class="w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-capmas-primary outline-none font-bold shadow-sm">
                    <option value="daily">يومي</option>
                    <option value="weekly">أسبوعي</option>
                    <option value="monthly">شهري</option>
                    <option value="quarterly">ربع سنوي</option>
                    <option value="semi_annual">نصف سنوي</option>
                    <option value="annual">سنوي</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-500 mb-2">موعد الاستحقاق <span class="text-red-500">*</span></label>
                  <input type="text" formControlName="dueDate" placeholder="يوم 5" class="w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-capmas-primary outline-none font-bold shadow-sm">
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-500 mb-2">فترة السماح (أيام) <span class="text-red-500">*</span></label>
                  <input type="number" formControlName="gracePeriod" min="0" class="w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-capmas-primary outline-none font-bold shadow-sm">
                </div>
              </div>
            </div>

            <!-- Creation Mode Toggle -->
            <div class="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <h2 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span class="w-1.5 h-5 bg-capmas-secondary rounded-full"></span>
                طريقة إعداد التقرير
              </h2>
              <div class="flex gap-4">
                <button type="button" (click)="creationMode = 'manual'" [class.border-capmas-primary]="creationMode === 'manual'" [class.bg-blue-50]="creationMode === 'manual'" class="flex-1 p-4 border-2 border-gray-200 rounded-xl font-bold flex flex-col items-center justify-center gap-2 hover:border-capmas-primary transition-colors bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" [class.text-capmas-primary]="creationMode === 'manual'"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
                  تصميم يدوي (حقول)
                </button>
                <button type="button" (click)="creationMode = 'template'" [class.border-capmas-primary]="creationMode === 'template'" [class.bg-blue-50]="creationMode === 'template'" class="flex-1 p-4 border-2 border-gray-200 rounded-xl font-bold flex flex-col items-center justify-center gap-2 hover:border-capmas-primary transition-colors bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" [class.text-capmas-primary]="creationMode === 'template'"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                  رفع قالب جاهز
                </button>
              </div>
            </div>

            <!-- Sections Builder -->
            <div *ngIf="creationMode === 'manual'" class="space-y-6 animate-fade-in-up">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-bold text-gray-800">أقسام التقرير</h2>
                <div class="flex gap-2">
                  <button type="button" (click)="addTableSection()" class="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all border border-emerald-200">+ جدول</button>
                  <button type="button" (click)="addFormSection()" class="px-3 py-2 bg-blue-50 text-capmas-primary rounded-lg text-xs font-bold hover:bg-capmas-primary hover:text-white transition-all border border-blue-100">+ حقول</button>
                  <button type="button" (click)="addStaticSection()" class="px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-600 hover:text-white transition-all border border-amber-200">+ نص</button>
                </div>
              </div>
              <div *ngIf="sections.controls.length === 0" class="text-center p-10 bg-white border-2 border-dashed border-gray-200 rounded-xl">
                <p class="text-gray-400 font-bold">أضف قسماً للتقرير: جدول، حقول، أو نص ثابت</p>
              </div>
              <div *ngFor="let sec of sections.controls; let si = index" class="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                <div class="flex justify-between items-center mb-4">
                  <div class="flex items-center gap-2">
                    <span *ngIf="getSectionType(sec)==='table'" class="w-2 h-5 bg-emerald-500 rounded-full"></span>
                    <span *ngIf="getSectionType(sec)==='form'" class="w-2 h-5 bg-capmas-primary rounded-full"></span>
                    <span *ngIf="getSectionType(sec)==='static'" class="w-2 h-5 bg-amber-500 rounded-full"></span>
                    <input [formControl]="$any(sec).controls.title" placeholder="عنوان القسم" class="bg-transparent font-bold text-gray-800 outline-none text-sm border-b border-transparent focus:border-capmas-primary">
                  </div>
                  <button type="button" (click)="removeSection(si)" class="p-1 text-red-400 hover:text-red-600 text-xs">حذف</button>
                </div>
                <!-- TABLE SECTION -->
                <div *ngIf="getSectionType(sec)==='table'">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold text-gray-500">تعريف الأعمدة</span>
                    <button type="button" (click)="addTableColumn(sec)" class="text-xs font-bold text-emerald-600 hover:underline">+ عمود</button>
                  </div>
                  <div *ngFor="let col of getTableColumns(sec).controls; let ci = index" class="flex gap-3 items-center mb-2 bg-white p-3 rounded-lg border border-gray-200">
                    <input [formControl]="$any(col).controls.name" placeholder="اسم العمود" class="flex-1 p-2 bg-gray-50 rounded-lg outline-none font-bold text-xs border border-transparent focus:border-capmas-primary">
                    <select [formControl]="$any(col).controls.type" class="p-2 bg-gray-50 rounded-lg outline-none font-bold text-xs">
                      <option value="text">نص</option><option value="number">رقم</option><option value="date">تاريخ</option><option value="boolean">نعم/لا</option>
                    </select>
                    <label class="flex items-center gap-1 text-xs"><input type="checkbox" [formControl]="$any(col).controls.required" class="w-3 h-3">مطلوب</label>
                    <button type="button" (click)="removeTableColumn(sec, ci)" class="text-red-400 hover:text-red-600 text-xs">×</button>
                  </div>
                </div>
                <!-- FORM SECTION -->
                <div *ngIf="getSectionType(sec)==='form'">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold text-gray-500">حقول النموذج</span>
                    <button type="button" (click)="addSectionField(sec)" class="text-xs font-bold text-capmas-primary hover:underline">+ حقل</button>
                  </div>
                  <div *ngFor="let f of getSectionFields(sec).controls; let fi = index" class="flex gap-3 items-center mb-2 bg-white p-3 rounded-lg border border-gray-200">
                    <input [formControl]="$any(f).controls.name" placeholder="اسم الحقل" class="flex-1 p-2 bg-gray-50 rounded-lg outline-none font-bold text-xs border border-transparent focus:border-capmas-primary">
                    <select [formControl]="$any(f).controls.type" class="p-2 bg-gray-50 rounded-lg outline-none font-bold text-xs">
                      <option value="text">نص</option><option value="number">رقم</option><option value="date">تاريخ</option><option value="boolean">نعم/لا</option>
                    </select>
                    <label class="flex items-center gap-1 text-xs"><input type="checkbox" [formControl]="$any(f).controls.required" class="w-3 h-3">مطلوب</label>
                    <button type="button" (click)="removeSectionField(sec, fi)" class="text-red-400 hover:text-red-600 text-xs">×</button>
                  </div>
                </div>
                <!-- STATIC TEXT SECTION -->
                <div *ngIf="getSectionType(sec)==='static'">
                  <textarea [formControl]="$any(sec).controls.content" rows="3" placeholder="أدخل النص الثابت هنا..." class="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none font-bold text-sm focus:border-capmas-primary"></textarea>
                </div>
              </div>
            </div>

            <!-- Template Upload Zone -->
            <div *ngIf="creationMode === 'template'" class="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 animate-fade-in-up">
               <h2 class="text-lg font-bold text-gray-800 mb-6">رفع قالب التقرير</h2>
               <div 
                 class="border-2 border-dashed rounded-xl p-10 text-center transition-all bg-white relative overflow-hidden"
                 [class.border-capmas-primary]="isDragging"
                 [class.bg-blue-50]="isDragging"
                 [class.border-gray-300]="!isDragging"
                 (dragover)="onDragOver($event)" 
                 (dragleave)="onDragLeave($event)" 
                 (drop)="onDrop($event)">
                 
                 <div *ngIf="!uploadedFileName" class="pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-gray-400 mx-auto mb-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>
                    <p class="text-gray-600 font-bold mb-2">اسحب وأفلت ملف القالب هنا</p>
                    <p class="text-xs text-gray-400 font-semibold mb-4">يدعم ملفات Excel و Word (XLSX, DOCX)</p>
                    <button type="button" (click)="fileInput.click()" class="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-gray-50 pointer-events-auto">استعراض الملفات</button>
                    <input type="file" #fileInput class="hidden" (change)="onFileSelected($event)" accept=".xlsx,.xls,.docx,.doc">
                 </div>

                 <div *ngIf="uploadedFileName" class="flex flex-col items-center pointer-events-none">
                   <div class="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4 border-4 border-green-100">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                   </div>
                   <p class="text-gray-800 font-bold text-lg mb-1">تم رفع القالب بنجاح</p>
                   <p class="text-sm text-gray-500 font-semibold mb-4" dir="ltr">{{ uploadedFileName }}</p>
                   <button type="button" (click)="removeTemplate(); $event.stopPropagation()" class="text-red-500 hover:text-red-600 font-bold text-sm pointer-events-auto hover:underline">إزالة القالب</button>
                 </div>
               </div>
            </div>

            <!-- Submit Buttons -->
            <div class="fixed bottom-0 left-0 right-0 lg:right-1/2 p-6 bg-white/95 backdrop-blur border-t border-gray-100 flex justify-end gap-4 shadow-2xl z-50">
              <button type="button" [routerLink]="['/super-admin/external-entities', entityId]" 
                      class="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm">إلغاء</button>
              <button type="submit" [disabled]="!reportForm.valid || (creationMode === 'template' && !uploadedFileName)" 
                      class="px-10 py-3 bg-capmas-primary text-white rounded-xl font-bold hover:bg-opacity-90 shadow-lg shadow-blue-100 transition-all disabled:opacity-50 text-sm">
                حفظ التقرير
              </button>
            </div>

          </form>
        </div>
      </div>

      <!-- Right Pane: Live Preview -->
      <div class="hidden lg:flex flex-col w-1/2 bg-gray-50 border-r border-gray-200 overflow-hidden relative shadow-inner">
        
        <div class="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm z-10 shrink-0">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
            <h2 class="font-bold text-gray-800">معاينة التقرير</h2>
          </div>
          <span class="text-[10px] bg-blue-50 text-capmas-primary px-3 py-1 rounded-full font-bold border border-blue-100">يظهر كما يراه الموظف</span>
        </div>

        <div class="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2Y5ZmFmYiIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iI2UzZThlZiIvPgo8L3N2Zz4=')]">
          
          <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden min-h-[500px] flex flex-col">
            <!-- Preview Header -->
            <div class="p-8 border-b border-gray-100 bg-gray-50/50">
              <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ reportForm.get('name')?.value || 'عنوان التقرير...' }}</h1>
              <p class="text-sm text-gray-500 font-semibold leading-relaxed">{{ reportForm.get('description')?.value || 'وصف التقرير سيظهر هنا...' }}</p>
              
              <div class="flex gap-4 mt-6">
                <div class="bg-white px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 flex items-center gap-2 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-capmas-primary"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                  <span>الاستحقاق: {{ reportForm.get('dueDate')?.value || '--' }}</span>
                </div>
                <div class="bg-white px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 flex items-center gap-2 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-capmas-primary"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  <span>دورية: {{ getFrequencyLabel(reportForm.get('frequency')?.value) }}</span>
                </div>
              </div>
            </div>

            <!-- Preview Body (Manual - Sections) -->
            <div *ngIf="creationMode === 'manual'" class="p-8 flex-1">
              <div *ngIf="sections.controls.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                <p class="font-bold">أضف أقسام للتقرير لتبدأ المعاينة</p>
              </div>
              <div class="space-y-8">
                <div *ngFor="let sec of sections.controls" class="space-y-3">
                  <h3 *ngIf="sec.get('title')?.value" class="text-base font-bold text-gray-800 border-b border-gray-200 pb-2">{{ sec.get('title')?.value }}</h3>
                  <!-- TABLE PREVIEW -->
                  <div *ngIf="getSectionType(sec)==='table'" class="overflow-x-auto">
                    <table class="w-full border-collapse border border-gray-300 text-sm">
                      <thead><tr class="bg-gray-100">
                        <th class="border border-gray-300 p-3 font-bold text-gray-700 text-xs">#</th>
                        <th *ngFor="let col of getTableColumns(sec).controls" class="border border-gray-300 p-3 font-bold text-gray-700 text-xs">
                          {{ col.get('name')?.value || 'عمود' }}
                          <span *ngIf="col.get('required')?.value" class="text-red-500">*</span>
                        </th>
                      </tr></thead>
                      <tbody>
                        <tr *ngFor="let row of getPreviewRows(sec); let ri = index" class="hover:bg-gray-50">
                          <td class="border border-gray-300 p-2 text-center text-gray-400 text-xs">{{ ri + 1 }}</td>
                          <td *ngFor="let col of getTableColumns(sec).controls" class="border border-gray-300 p-2">
                            <input disabled class="w-full p-1 bg-gray-50 border border-gray-200 rounded text-xs opacity-60 cursor-not-allowed">
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button type="button" disabled class="mt-2 text-xs font-bold text-emerald-600 opacity-60 cursor-not-allowed">+ إضافة صف</button>
                  </div>
                  <!-- FORM PREVIEW -->
                  <div *ngIf="getSectionType(sec)==='form'" class="space-y-4">
                    <div *ngFor="let f of getSectionFields(sec).controls" class="space-y-1">
                      <label class="block text-sm font-bold text-gray-700">{{ f.get('name')?.value || 'حقل' }}<span *ngIf="f.get('required')?.value" class="text-red-500">*</span></label>
                      <input disabled class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl opacity-60 cursor-not-allowed">
                    </div>
                  </div>
                  <!-- STATIC PREVIEW -->
                  <div *ngIf="getSectionType(sec)==='static'" class="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p class="text-sm text-gray-700 font-semibold whitespace-pre-wrap">{{ sec.get('content')?.value || 'نص ثابت...' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Preview Body (Template) -->
            <div *ngIf="creationMode === 'template'" class="p-8 flex-1 flex flex-col items-center justify-center text-center">
              <div *ngIf="!uploadedFileName" class="text-gray-400 space-y-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                <p class="font-bold text-lg text-gray-500">سيتم عرض القالب المرفوع هنا</p>
                <p class="text-sm font-semibold">قم برفع القالب من الجهة اليمنى لمعاينته</p>
              </div>

              <div *ngIf="uploadedFileName" class="w-full text-center space-y-6">
                 <div class="bg-green-50 w-24 h-24 rounded-2xl mx-auto flex items-center justify-center shadow-inner border border-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-green-600"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                 </div>
                 <div>
                   <p class="text-xl font-bold text-gray-800 mb-2">معاينة القالب المرفق</p>
                   <p class="text-sm text-gray-500 font-bold bg-gray-100 inline-block px-4 py-2 rounded-lg" dir="ltr">{{ uploadedFileName }}</p>
                 </div>
                 <div class="bg-blue-50 border border-blue-100 p-4 rounded-xl text-right">
                   <p class="text-sm text-blue-800 font-bold mb-1 flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                     ملاحظة للموظف:
                   </p>
                   <p class="text-xs text-blue-600 font-semibold leading-relaxed">
                     سيقوم الموظف بتحميل هذا القالب، تعبئة البيانات المطلوبة داخله، ثم إعادة رفعه إلى النظام لاستكمال عملية تقديم التقرير.
                   </p>
                 </div>
              </div>
            </div>

            <!-- Preview Footer -->
            <div class="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
               <button type="button" disabled class="px-8 py-3 bg-capmas-primary text-white rounded-xl font-bold opacity-50 cursor-not-allowed text-sm">تقديم التقرير</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background: #fcfcfc; min-height: 100vh; }
    .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
  `]
})
export class ReportBuilderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminService = inject(AdministrationService);

  reportForm: FormGroup;
  entityId: string = '';
  reportId: string = '';
  availableAdmins: Administration[] = [];

  creationMode: 'manual' | 'template' = 'manual';
  isDragging = false;
  uploadedFileName: string | null = null;

  constructor() {
    this.reportForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      adminId: ['', Validators.required],
      entityId: [''],
      frequency: ['monthly', Validators.required],
      dueDate: ['', Validators.required],
      gracePeriod: [0, [Validators.required, Validators.min(0)]],
      inputMethod: ['form', Validators.required],
      status: ['منتظم'],
      dynamicFields: this.fb.array([]),
      sections: this.fb.array([])
    });
  }

  get sections(): FormArray {
    return this.reportForm.get('sections') as FormArray;
  }

  // Section helpers
  addFormSection() {
    this.sections.push(this.fb.group({
      type: ['form'],
      title: [''],
      fields: this.fb.array([])
    }));
  }

  addTableSection() {
    this.sections.push(this.fb.group({
      type: ['table'],
      title: [''],
      columns: this.fb.array([]),
      rows: this.fb.array([])
    }));
  }

  addStaticSection() {
    this.sections.push(this.fb.group({
      type: ['static'],
      title: [''],
      content: ['']
    }));
  }

  // Table helpers
  getTableColumns(section: any): FormArray {
    return section.get('columns') as FormArray;
  }
  addTableColumn(section: any) {
    this.getTableColumns(section).push(this.fb.group({
      name: ['', Validators.required],
      type: ['text', Validators.required],
      required: [false]
    }));
  }
  getTableRows(section: any): FormArray {
    return section.get('rows') as FormArray;
  }
  addTableRow(section: any) {
    const cols = this.getTableColumns(section);
    const rowGroup = this.fb.group({});
    cols.controls.forEach((col: any) => {
      const colName = col.get('name')?.value || 'col';
      rowGroup.addControl(colName, this.fb.control(''));
    });
    this.getTableRows(section).push(rowGroup);
  }

  // Utility for preview rendering
  getSectionType(section: any): string {
    return section.get('type')?.value;
  }

  removeSection(index: number) {
    this.sections.removeAt(index);
  }

  removeTableColumn(section: any, index: number) {
    this.getTableColumns(section).removeAt(index);
  }

  getSectionFields(section: any): FormArray {
    return section.get('fields') as FormArray;
  }

  addSectionField(section: any) {
    this.getSectionFields(section).push(this.fb.group({
      name: ['', Validators.required],
      type: ['text', Validators.required],
      required: [false]
    }));
  }

  removeSectionField(section: any, index: number) {
    this.getSectionFields(section).removeAt(index);
  }

  getPreviewRows(section: any): any[] {
    const cols = this.getTableColumns(section);
    if (cols.length === 0) return [];
    return [1, 2, 3]; // Show 3 placeholder rows in preview
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entityId = params['entityId'];
      this.reportId = params['reportId'];

      this.loadContext();
      if (this.reportId && this.reportId !== 'new') {
        this.loadReport();
      }
    });
  }


  loadContext() {
    this.availableAdmins = this.adminService.getAdministrations();
    this.reportForm.patchValue({ entityId: this.entityId });
  }

  loadReport() {
    const report = this.adminService.getReport(this.reportId);
    if (report) {
      this.reportForm.patchValue(report);
      
      if (report.inputMethod === 'excel' || report.inputMethod === 'both') {
         this.creationMode = 'template';
         this.uploadedFileName = report.name + '_Template.xlsx';
      }

      // Load dynamic fields
      const fieldsArray = this.reportForm.get('dynamicFields') as FormArray;
      fieldsArray.clear();
      report.dynamicFields?.forEach(f => {
        fieldsArray.push(this.fb.group({
          name: [f.name, Validators.required],
          type: [f.type, Validators.required],
          required: [f.required]
        }));
      });
    }
  }

  get dynamicFields(): FormArray {
    return this.reportForm.get('dynamicFields') as FormArray;
  }

  addField() {
    this.dynamicFields.push(this.fb.group({
      name: ['', Validators.required],
      type: ['text', Validators.required],
      required: [false]
    }));
  }

  removeField(index: number) {
    this.dynamicFields.removeAt(index);
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

  // Drag and drop handlers
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadedFileName = files[0].name;
      this.reportForm.patchValue({ inputMethod: 'excel' });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFileName = file.name;
      this.reportForm.patchValue({ inputMethod: 'excel' });
    }
  }

  removeTemplate() {
    this.uploadedFileName = null;
    this.reportForm.patchValue({ inputMethod: 'form' });
  }

  saveReport() {
    if (this.reportForm.valid && (this.creationMode === 'manual' || this.uploadedFileName)) {
      const reportData: Report = {
        ...this.reportForm.value,
        inputMethod: this.creationMode === 'template' ? 'excel' : 'form',
        id: this.reportId === 'new' ? 'rep-' + Math.random().toString(36).substr(2, 9) : this.reportId
      };
      
      this.adminService.saveReport(reportData);
      this.router.navigate(['/super-admin/external-entities', this.entityId]);
    }
  }
}
