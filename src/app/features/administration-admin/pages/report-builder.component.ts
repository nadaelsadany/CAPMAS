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
    <div class="p-8 max-w-5xl mx-auto font-Cairo text-right" dir="rtl">
      
      <div class="flex items-center gap-2 text-gray-400 mb-8 text-xs font-bold tracking-wider">
        <a routerLink="/super-admin" class="hover:text-capmas-primary transition-colors">الرئيسية</a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 rotate-180"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        <a [routerLink]="['/super-admin/external-entities', entityId]" class="hover:text-capmas-primary transition-colors">تفاصيل الجهة</a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 rotate-180"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        <span class="text-gray-800">إعدادات التقرير</span>
      </div>

      <div class="mb-10">
        <h1 class="text-3xl font-bold text-capmas-primary mb-3">تعديل إعدادات التقرير</h1>
        <p class="text-gray-500 font-semibold">تكوين الدورية، الإدارة المسؤولة، وتصميم الحقول الديناميكية.</p>
      </div>

      <form [formGroup]="reportForm" (ngSubmit)="saveReport()" class="space-y-8 pb-20">
        
        <!-- Basic Settings -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 class="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <span class="w-1.5 h-6 bg-capmas-primary rounded-full"></span>
            الإعدادات الأساسية
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-gray-500 mb-2">اسم التقرير <span class="text-red-500">*</span></label>
              <input type="text" formControlName="name" placeholder="مثال: التقرير الشهري للنمو" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-capmas-primary outline-none font-bold">
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-gray-500 mb-2">وصف التقرير</label>
              <textarea formControlName="description" rows="3" placeholder="شرح موجز لمحتوى التقرير..." class="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-capmas-primary outline-none font-bold"></textarea>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-500 mb-2">الإدارة العامة المسؤولة <span class="text-red-500">*</span></label>
              <select formControlName="adminId" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-capmas-primary outline-none font-bold">
                <option value="" disabled>اختر الإدارة...</option>
                <option *ngFor="let admin of availableAdmins" [value]="admin.id">{{ admin.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-500 mb-2">دورية التقرير <span class="text-red-500">*</span></label>
              <select formControlName="frequency" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-capmas-primary outline-none font-bold">
                <option value="daily">يومي</option>
                <option value="weekly">أسبوعي</option>
                <option value="monthly">شهري</option>
                <option value="quarterly">ربع سنوي</option>
                <option value="semi_annual">نصف سنوي</option>
                <option value="annual">سنوي</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-500 mb-2">موعد الاستحقاق (مثال: 5 من الشهر) <span class="text-red-500">*</span></label>
              <input type="text" formControlName="dueDate" placeholder="يوم 5" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-capmas-primary outline-none font-bold">
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-500 mb-2">فترة السماح (أيام) <span class="text-red-500">*</span></label>
              <input type="number" formControlName="gracePeriod" min="0" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-capmas-primary outline-none font-bold">
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-500 mb-2">طريقة الإدخال <span class="text-red-500">*</span></label>
              <select formControlName="inputMethod" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-capmas-primary outline-none font-bold">
                <option value="excel">رفع ملف Excel فقط</option>
                <option value="form">إدخال مباشر (نموذج)</option>
                <option value="both">كلاهما مسموح</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Dynamic Fields Builder -->
        <div *ngIf="showFormBuilder" class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-3">
              <span class="w-1.5 h-6 bg-capmas-secondary rounded-full"></span>
              منشئ حقول النموذج
            </h2>
            <button type="button" (click)="addField()" class="px-4 py-2 bg-blue-50 text-capmas-primary rounded-xl text-xs font-bold hover:bg-capmas-primary hover:text-white transition-all border border-blue-100">
              + إضافة حقل
            </button>
          </div>
          
          <div formArrayName="dynamicFields" class="space-y-4">
            <div *ngFor="let field of dynamicFields.controls; let i = index" [formGroupName]="i" 
                 class="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div class="flex-1 w-full">
                <label class="block text-[10px] font-bold text-gray-400 mb-2 mr-2">اسم الحقل</label>
                <input type="text" formControlName="name" placeholder="مثال: القيمة الإجمالية" class="w-full p-3 border border-gray-200 rounded-xl focus:border-capmas-primary outline-none font-bold">
              </div>
              <div class="w-full md:w-1/4">
                <label class="block text-[10px] font-bold text-gray-400 mb-2 mr-2">نوع البيانات</label>
                <select formControlName="type" class="w-full p-3 border border-gray-200 rounded-xl focus:border-capmas-primary outline-none font-bold">
                  <option value="text">نص</option>
                  <option value="number">رقم</option>
                  <option value="date">تاريخ</option>
                  <option value="boolean">نعم/لا</option>
                </select>
              </div>
              <div class="flex items-center gap-2 mb-4 mr-4">
                <input type="checkbox" formControlName="required" class="w-4 h-4 rounded border-gray-300 text-capmas-primary focus:ring-capmas-primary">
                <span class="text-xs font-bold text-gray-600">إجباري</span>
              </div>
              <button type="button" (click)="removeField(i)" class="mb-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="sticky bottom-0 left-0 right-0 p-8 bg-white/90 backdrop-blur-md border-t border-gray-100 flex justify-end gap-4 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)] z-50 -mx-8 -mb-8 mt-12 rounded-b-3xl">
          <button type="button" [routerLink]="['/super-admin/external-entities', entityId]" 
                  class="px-10 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">إلغاء</button>
          <button type="submit" [disabled]="!reportForm.valid" 
                  class="px-16 py-4 bg-capmas-primary text-white rounded-2xl font-bold hover:bg-opacity-90 shadow-xl shadow-blue-100 transition-all disabled:opacity-50">
            حفظ إعدادات التقرير
          </button>
        </div>

      </form>
    </div>
  `,
  styles: [`
    :host { display: block; background: #fcfcfc; min-height: 100vh; }
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
      dynamicFields: this.fb.array([])
    });
  }

  ngOnInit() {
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

  get showFormBuilder(): boolean {
    const inputMethod = this.reportForm.get('inputMethod')?.value;
    return inputMethod === 'form' || inputMethod === 'both';
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

  saveReport() {
    if (this.reportForm.valid) {
      const reportData: Report = {
        ...this.reportForm.value,
        id: this.reportId === 'new' ? 'rep-' + Math.random().toString(36).substr(2, 9) : this.reportId
      };
      
      this.adminService.saveReport(reportData);
      this.router.navigate(['/super-admin/external-entities', this.entityId]);
    }
  }
}
