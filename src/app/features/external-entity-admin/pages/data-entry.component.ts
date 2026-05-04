import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdministrationService, Report } from '../../../core/services/administration.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-entity-data-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
        <a routerLink="/external-entity-admin" class="hover:text-capmas-primary transition-colors">الرئيسية</a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
        <span class="text-gray-600">تقديم بيانات: {{ report()?.name }}</span>
      </nav>

      <div class="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
        <!-- Header -->
        <div class="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">{{ report()?.name }}</h1>
            <p class="text-sm text-gray-500 font-medium">{{ report()?.description }}</p>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">تاريخ الاستحقاق</span>
            <span class="text-lg font-black text-red-500">{{ report()?.dueDate }}</span>
          </div>
        </div>

        <!-- Selection for Method if Both -->
        <div *ngIf="report()?.inputMethod === 'both'" class="px-10 py-6 border-b border-gray-50 flex gap-4">
          <button 
            (click)="selectedMethod.set('form')"
            [ngClass]="selectedMethod() === 'form' ? 'bg-capmas-primary text-white' : 'bg-gray-100 text-gray-600'"
            class="flex-1 py-4 rounded-2xl text-sm font-bold transition-all"
          >
            إدخال عبر النموذج الرقمي
          </button>
          <button 
            (click)="selectedMethod.set('excel')"
            [ngClass]="selectedMethod() === 'excel' ? 'bg-capmas-primary text-white' : 'bg-gray-100 text-gray-600'"
            class="flex-1 py-4 rounded-2xl text-sm font-bold transition-all"
          >
            رفع ملف إكسل (Excel)
          </button>
        </div>

        <!-- Success State -->
        <div *ngIf="isSubmitted()" class="text-center py-24 animate-in zoom-in duration-500">
          <div class="w-28 h-28 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-14 h-14"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
          </div>
          <h2 class="text-4xl font-black text-gray-800 mb-4">تم إرسال التقرير بنجاح!</h2>
          <p class="text-gray-500 max-w-md mx-auto font-medium text-lg mb-12">سيتم مراجعة البيانات من قبل الإدارة المختصة وإعلامكم بالنتيجة في أقرب وقت.</p>
          <div class="flex flex-col sm:flex-row justify-center gap-4 px-10">
            <button (click)="goBack()" class="px-10 py-5 bg-capmas-primary text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex-1">
              العودة للوحة التحكم
            </button>
            <button (click)="resetForm()" class="px-10 py-5 bg-gray-50 text-gray-600 font-bold rounded-3xl hover:bg-gray-100 transition-all border border-gray-100 flex-1">
              تقديم تقرير آخر
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div *ngIf="!isSubmitted()" class="p-10">
          
          <!-- Form Mode -->
          <div *ngIf="selectedMethod() === 'form'" class="space-y-8 animate-in fade-in duration-500">
            <div *ngFor="let field of report()?.dynamicFields" class="space-y-3">
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">{{ field.name }} {{ field.required ? '*' : '' }}</label>
              <input 
                *ngIf="field.type === 'number'"
                type="number"
                class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-capmas-primary outline-none transition-all"
                placeholder="0.00"
              >
              <input 
                *ngIf="field.type === 'text'"
                type="text"
                class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-capmas-primary outline-none transition-all"
                placeholder="أدخل البيانات هنا..."
              >
            </div>
            
            <div *ngIf="!report()?.dynamicFields?.length" class="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
               <p class="text-gray-400 font-bold">لا توجد حقول نموذج محددة لهذا التقرير.</p>
            </div>
          </div>

          <!-- Excel Mode -->
          <div *ngIf="selectedMethod() === 'excel'" class="animate-in fade-in duration-500">
            <div class="bg-blue-50 border border-blue-100 p-8 rounded-3xl mb-8 flex items-center justify-between">
              <div class="flex items-center gap-6">
                <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-capmas-primary shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                </div>
                <div>
                  <h4 class="font-bold text-gray-800">قالب ملف الإكسل المعتمد</h4>
                  <p class="text-xs text-gray-500 font-medium">يرجى تحميل القالب وتعبئته بالبيانات المطلوبة قبل الرفع.</p>
                </div>
              </div>
              <button class="px-6 py-3 bg-white text-capmas-primary border border-capmas-primary/20 font-bold rounded-2xl hover:bg-capmas-primary hover:text-white transition-all shadow-sm">
                تحميل القالب (.xlsx)
              </button>
            </div>

            <div class="border-4 border-dashed border-gray-100 rounded-[3rem] p-20 text-center hover:border-capmas-primary/20 transition-all cursor-pointer group">
               <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 group-hover:scale-110 group-hover:text-capmas-primary transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>
               </div>
               <h4 class="text-xl font-bold text-gray-800 mb-2">اضغط هنا أو اسحب الملف للرفع</h4>
               <p class="text-sm text-gray-400 font-medium italic">تدعم المنصة ملفات Excel (.xlsx, .csv) بحد أقصى 10 ميجابايت.</p>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="mt-12 pt-10 border-t border-gray-50 flex gap-4">
            <button 
              (click)="submit()" 
              [disabled]="isSubmitting()"
              class="flex-[2] py-5 bg-capmas-primary text-white font-black rounded-3xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <span *ngIf="isSubmitting()" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ isSubmitting() ? 'جاري إرسال البيانات...' : 'تأكيد وإرسال التقرير للمراجعة' }}
            </button>
            <button (click)="goBack()" class="flex-1 py-5 bg-gray-100 text-gray-600 font-bold rounded-3xl hover:bg-gray-200 transition-all active:scale-95">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EntityDataEntryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminService = inject(AdministrationService);
  private auth = inject(AuthService);

  report = signal<Report | null>(null);
  selectedMethod = signal<'form' | 'excel'>('form');
  isSubmitting = signal(false);
  isSubmitted = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.params['reportId'];
    const r = this.adminService.getReport(id);
    if (r) {
      this.report.set(r);
      // Set initial method based on report settings
      if (r.inputMethod === 'excel') this.selectedMethod.set('excel');
    }
  }

  submit() {
    const r = this.report();
    if (!r) return;

    this.isSubmitting.set(true);
    
    // Simulate API call
    setTimeout(() => {
      this.adminService.submitReport({
        reportId: r.id,
        reportName: r.name,
        entityId: this.auth.currentUser()?.assignedEntityId || '',
        adminId: r.adminId,
        status: 'under_review',
        delayDays: 0,
        data: {}
      });

      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
    }, 1500);
  }

  goBack() {
    const r = this.report();
    if (r) {
      this.router.navigate(['/external-entity-admin/portal', r.adminId]);
    } else {
      this.router.navigate(['/external-entity-admin']);
    }
  }

  resetForm() {
    this.isSubmitted.set(false);
  }
}
