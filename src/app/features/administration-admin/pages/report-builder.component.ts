import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-report-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      
      <div class="mb-8">
        <h1 class="text-3xl font-arabic font-bold text-capmas-primary mb-2">إعدادات هيكل التقارير (Report Builder)</h1>
        <p class="text-gray-500">قم بتكوين قالب التقرير الديناميكي، تحديد دورية الإرسال، وتصميم الحقول المطلوبة للإدخال المباشر.</p>
      </div>

      <form [formGroup]="reportForm" (ngSubmit)="saveReport()" class="space-y-8">
        
        <!-- Basic Settings -->
        <div class="bg-white p-6 rounded-lg shadow border-t-4 border-capmas-primary">
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
            الإعدادات الأساسية
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">اسم التقرير <span class="text-red-500">*</span></label>
              <input type="text" formControlName="reportName" placeholder="مثال: التقرير الشهري للنمو" class="w-full p-3 border border-gray-300 rounded focus:border-capmas-primary focus:ring-1 focus:ring-capmas-primary outline-none">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">دورية التقرير <span class="text-red-500">*</span></label>
              <select formControlName="frequency" class="w-full p-3 border border-gray-300 rounded focus:border-capmas-primary focus:ring-1 focus:ring-capmas-primary outline-none">
                <option value="monthly">شهري</option>
                <option value="quarterly">ربع سنوي</option>
                <option value="semi_annual">نصف سنوي</option>
                <option value="annual">سنوي</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">طريقة الإدخال المسموحة <span class="text-red-500">*</span></label>
              <select formControlName="inputMethod" class="w-full p-3 border border-gray-300 rounded focus:border-capmas-primary focus:ring-1 focus:ring-capmas-primary outline-none">
                <option value="excel">رفع ملف Excel فقط</option>
                <option value="form">إدخال مباشر (نماذج إلكترونية)</option>
                <option value="both">كلاهما مسموح</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">مدة التأخير المسموح بها (أيام) <span class="text-red-500">*</span></label>
              <input type="number" formControlName="allowedDelayDays" placeholder="0" min="0" class="w-full p-3 border border-gray-300 rounded focus:border-capmas-primary focus:ring-1 focus:ring-capmas-primary outline-none">
              <p class="text-xs text-gray-500 mt-1">يتم احتساب غرامة أو تنبيه بعد انقضاء هذه المدة من موعد الاستحقاق.</p>
            </div>
          </div>
        </div>

        <!-- Dynamic Fields Builder -->
        <div *ngIf="showFormBuilder" class="bg-white p-6 rounded-lg shadow border-t-4 border-capmas-secondary">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
              منشئ الحقول الديناميكية
            </h2>
            <button type="button" (click)="addField()" class="bg-gray-100 hover:bg-gray-200 text-capmas-primary px-4 py-2 rounded text-sm font-bold flex items-center gap-1 border border-gray-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              إضافة حقل جديد
            </button>
          </div>
          
          <p class="text-sm text-gray-500 mb-6">سيتم استخدام هذه الحقول لبناء نموذج الإدخال الإلكتروني الذي سيظهر للجهات الخارجية.</p>

          <div formArrayName="dynamicFields" class="space-y-4">
            <div *ngFor="let field of dynamicFields.controls; let i = index" [formGroupName]="i" class="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 rounded border border-gray-200">
              <div class="flex-1 w-full">
                <label class="block text-xs font-semibold text-gray-600 mb-1">اسم الحقل</label>
                <input type="text" formControlName="name" placeholder="مثال: إجمالي الإيرادات" class="w-full p-2 border border-gray-300 rounded focus:border-capmas-primary outline-none">
              </div>
              <div class="w-full md:w-1/4">
                <label class="block text-xs font-semibold text-gray-600 mb-1">نوع البيانات</label>
                <select formControlName="type" class="w-full p-2 border border-gray-300 rounded focus:border-capmas-primary outline-none">
                  <option value="text">نص (Text)</option>
                  <option value="number">رقم (Number)</option>
                  <option value="date">تاريخ (Date)</option>
                  <option value="boolean">نعم/لا (Boolean)</option>
                </select>
              </div>
              <div class="w-full md:w-1/6 flex items-center justify-center pt-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" formControlName="required" class="w-4 h-4 text-capmas-primary rounded border-gray-300 focus:ring-capmas-primary">
                  <span class="text-sm font-semibold text-gray-700">إجباري</span>
                </label>
              </div>
              <div class="pt-4">
                <button type="button" (click)="removeField(i)" class="text-red-500 hover:text-red-700 p-2 bg-white rounded border border-gray-200 shadow-sm" title="حذف الحقل">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                </button>
              </div>
            </div>
            
            <!-- Empty State -->
            <div *ngIf="dynamicFields.length === 0" class="text-center py-8 text-gray-500 bg-gray-50 rounded border border-dashed border-gray-300">
              لا توجد حقول حتى الآن. انقر على "إضافة حقل جديد" للبدء.
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end gap-4 border-t pt-6">
          <button type="button" class="px-6 py-3 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 transition-colors">إلغاء</button>
          <button type="submit" [disabled]="!reportForm.valid" class="bg-capmas-primary hover:bg-opacity-90 disabled:opacity-50 text-white px-8 py-3 rounded shadow transition-colors font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            حفظ إعدادات التقرير
          </button>
        </div>

      </form>
    </div>
  `
})
export class ReportBuilderComponent {
  reportForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      reportName: ['', Validators.required],
      frequency: ['monthly', Validators.required],
      inputMethod: ['form', Validators.required],
      allowedDelayDays: [0, [Validators.required, Validators.min(0)]],
      dynamicFields: this.fb.array([])
    });

    // Add initial empty field to demonstrate the feature
    this.addField();
  }

  get dynamicFields(): FormArray {
    return this.reportForm.get('dynamicFields') as FormArray;
  }

  get showFormBuilder(): boolean {
    const inputMethod = this.reportForm.get('inputMethod')?.value;
    return inputMethod === 'form' || inputMethod === 'both';
  }

  addField() {
    const fieldGroup = this.fb.group({
      name: ['', Validators.required],
      type: ['text', Validators.required],
      required: [false]
    });
    this.dynamicFields.push(fieldGroup);
  }

  removeField(index: number) {
    this.dynamicFields.removeAt(index);
  }

  saveReport() {
    if (this.reportForm.valid) {
      console.log('Report Configuration Saved:', this.reportForm.value);
      alert('تم حفظ إعدادات التقرير بنجاح! (يمكنك الاطلاع على البيانات في الـ Console)');
    }
  }
}
