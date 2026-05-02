import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdministrationService } from '../../../core/services/administration.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-report-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
        <a routerLink="/administration-admin" class="hover:text-capmas-primary transition-colors">لوحة التحكم</a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
        <span class="text-gray-600">مراجعة تقرير</span>
      </nav>

      <!-- Report Header -->
      <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-blue-100 text-capmas-primary rounded-[1.5rem] flex items-center justify-center shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">{{ reportName }}</h1>
            <div class="flex flex-wrap gap-4 text-xs font-bold">
              <span class="text-gray-400">الجهة المرسلة: <span class="text-gray-700">{{ entityName }}</span></span>
              <span class="text-gray-400">تاريخ التقديم: <span class="text-gray-700">{{ submittedAt | date:'medium' }}</span></span>
              <span class="px-3 py-1 bg-orange-100 text-orange-600 rounded-full">قيد المراجعة</span>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button (click)="openReturnModal()" class="px-6 py-3 border border-red-100 text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all active:scale-95">
            إرجاع للتصحيح
          </button>
          <button (click)="approveReport()" class="px-10 py-3 bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-100 hover:bg-green-700 transition-all transform hover:-translate-y-1 active:scale-95">
            اعتماد التقرير
          </button>
        </div>
      </div>

      <!-- Main Review Area -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Report Content / Excel View Placeholder -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            <div class="px-8 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">عرض محتوى الملف (EXCEL PREVIEW)</span>
              <div class="flex gap-2">
                <button class="p-2 text-gray-400 hover:text-capmas-primary transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg></button>
                <button class="p-2 text-gray-400 hover:text-capmas-primary transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg></button>
              </div>
            </div>
            
            <div class="flex-1 flex items-center justify-center bg-gray-50/20 p-12">
               <div class="text-center space-y-6 max-w-md">
                 <div class="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                 </div>
                 <h2 class="text-xl font-bold text-gray-800">جاري تحميل بيانات التقرير...</h2>
                 <p class="text-sm text-gray-400 font-medium">يتم الآن التحقق من صحة البيانات وجدولة عرض الجداول الإحصائية المرفقة بالبيان اليومي.</p>
                 <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                   <div class="bg-capmas-primary h-full w-2/3 animate-pulse"></div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Sidebar: History & Validation -->
        <div class="space-y-6">
          <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
            <h3 class="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-green-500"></span>
              نتائج التحقق الآلي
            </h3>
            <div class="space-y-4">
              <div class="flex items-center gap-3 p-3 bg-green-50 rounded-2xl border border-green-100 text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                <span class="text-[10px] font-bold">هيكل الملف مطابق للمواصفات</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-green-50 rounded-2xl border border-green-100 text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                <span class="text-[10px] font-bold">كافة الحقول الإلزامية مكتملة</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl border border-orange-100 text-orange-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                <span class="text-[10px] font-bold">يوجد تكرار بسيط في بعض القيم</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-6">سجل التقرير</h3>
            <div class="space-y-6 relative before:absolute before:right-[11px] before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200">
              <div class="relative pr-8">
                <div class="absolute right-0 top-1 w-6 h-6 bg-blue-100 text-capmas-primary rounded-full flex items-center justify-center border-4 border-gray-50 z-10">
                  <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
                </div>
                <h4 class="text-xs font-bold text-gray-800">تم تقديم التقرير</h4>
                <p class="text-[10px] text-gray-400 font-bold mb-1">بواسطة: أحمد علي (مصلحة الجمارك)</p>
                <span class="text-[9px] text-gray-300">{{ submittedAt | date:'short' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Return Modal -->
      <div *ngIf="showReturnModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div class="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden border border-white/20 scale-100 animate-in zoom-in-95 duration-300">
          <div class="p-10">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">إرجاع التقرير للتصحيح</h2>
            <p class="text-gray-500 text-sm mb-8">يرجى توضيح أسباب الإرجاع لمساعدة الجهة على تصحيح البيانات المطلوبة.</p>
            
            <div class="space-y-6">
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">سبب الإرجاع (إلزامي)</label>
                <textarea 
                  [(ngModel)]="returnReason"
                  placeholder="مثال: يوجد خطأ في إجمالي المبالغ بالصف رقم 42..."
                  class="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-4 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all h-40 resize-none"
                ></textarea>
              </div>
            </div>

            <div class="mt-10 flex gap-4">
              <button (click)="closeReturnModal()" class="flex-1 px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95">
                إلغاء
              </button>
              <button 
                (click)="submitReturn()" 
                [disabled]="!returnReason.trim()"
                class="flex-[2] px-6 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                تأكيد الإرجاع وإبلاغ الجهة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReportReviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private noteService = inject(NotificationService);

  reportId = '';
  reportName = 'بيان الواردات الأسبوعي - أبريل 2024';
  entityName = 'مصلحة الجمارك المصرية';
  submittedAt = new Date();

  showReturnModal = false;
  returnReason = '';

  ngOnInit() {
    this.reportId = this.route.snapshot.params['id'];
  }

  approveReport() {
    // Logic to approve
    alert('تم اعتماد التقرير بنجاح، سيتم إرسال إشعار للجهة المعنية.');
    this.noteService.addNotification({
      userId: 'entity-user-1', // Mock target
      type: 'report_approved',
      category: 'report',
      title: 'تم اعتماد تقريرك',
      message: `تمت الموافقة على تقرير: ${this.reportName}`,
      priority: 'medium'
    });
    this.router.navigate(['/administration-admin']);
  }

  openReturnModal() {
    this.showReturnModal = true;
  }

  closeReturnModal() {
    this.showReturnModal = false;
    this.returnReason = '';
  }

  submitReturn() {
    if (!this.returnReason.trim()) return;

    // Logic to return
    alert('تم إرجاع التقرير للتصحيح مع السبب المذكور.');
    this.noteService.addNotification({
      userId: 'entity-user-1', // Mock target
      type: 'report_returned',
      category: 'report',
      title: 'تقرير مرجع للتصحيح',
      message: `سبب الإرجاع: ${this.returnReason}`,
      priority: 'high'
    });
    this.closeReturnModal();
    this.router.navigate(['/administration-admin']);
  }
}
