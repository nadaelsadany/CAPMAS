import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdministrationService, Report, ReportSubmission } from '../../../core/services/administration.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-entity-portal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      
      <!-- Top Navigation & Context -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <nav class="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            <a routerLink="/external-entity-admin" class="hover:text-capmas-primary transition-colors">الرئيسية</a>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            <span class="text-gray-600">بوابة الجهة الخارجية</span>
          </nav>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-capmas-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6.75h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18" /></svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-800">{{ administration()?.name }}</h1>
              <p class="text-sm text-gray-500 font-medium">متابعة الالتزامات وتقديم البيانات الإحصائية</p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button routerLink="/external-entity-admin" class="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 bg-white border border-gray-100 rounded-xl transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
            تغيير الإدارة
          </button>
        </div>
      </div>

      <!-- KPI Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-20 h-20 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors"></div>
          <div class="relative z-10">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">إجمالي المطلوب</span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black text-gray-800">{{ getTabCount('required') }}</span>
              <span class="text-xs font-bold text-blue-500">تقرير</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-20 h-20 bg-orange-50 rounded-full blur-2xl group-hover:bg-orange-100 transition-colors"></div>
          <div class="relative z-10">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">قيد المراجعة</span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black text-orange-600">{{ getUnderReviewCount() }}</span>
              <span class="text-xs font-bold text-orange-400">تحت المراجعة</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-20 h-20 bg-red-50 rounded-full blur-2xl group-hover:bg-red-100 transition-colors"></div>
          <div class="relative z-10">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">متأخرات</span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black text-red-600">{{ getOverdueCount() }}</span>
              <span class="text-xs font-bold text-red-400">تجاوز المهلة</span>
            </div>
          </div>
        </div>

        <div class="bg-red-600 p-8 rounded-[2.5rem] shadow-xl shadow-red-100 relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
          <div class="relative z-10 text-white">
            <span class="text-[10px] font-black opacity-80 uppercase tracking-widest block mb-2">بحاجة لتصحيح</span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black">{{ getTabCount('returned') }}</span>
              <span class="text-xs font-bold opacity-80">تقرير مرجع</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Critical Alerts Section -->
      <div *ngIf="getOverdueCount() > 0 || getTabCount('returned') > 0" class="mb-10 space-y-4">
        <div *ngIf="getTabCount('returned') > 0" class="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center justify-between animate-in slide-in-from-right duration-500">
           <div class="flex items-center gap-4">
             <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
             </div>
             <div>
               <h4 class="text-sm font-bold text-gray-800">توجد تقارير مُعادة للتصحيح</h4>
               <p class="text-xs text-gray-500 font-medium">يرجى مراجعة ملاحظات الإدارة وإعادة إرسال البيانات المصححة في أقرب وقت.</p>
             </div>
           </div>
           <button (click)="activeTab.set('returned')" class="px-5 py-2 bg-red-600 text-white text-[10px] font-black rounded-lg hover:bg-red-700 transition-all">عرض الملاحظات</button>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex flex-wrap gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-[1.8rem] w-fit border border-gray-200/50">
        <button 
          *ngFor="let tab of tabs" 
          (click)="activeTab.set(tab.id)"
          [ngClass]="activeTab() === tab.id ? 'bg-white text-capmas-primary shadow-md' : 'text-gray-500 hover:text-gray-800'"
          class="px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all flex items-center gap-3"
        >
          {{ tab.label }}
          <span 
            *ngIf="getTabCount(tab.id) > 0" 
            class="w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black"
            [ngClass]="activeTab() === tab.id ? 'bg-capmas-primary text-white' : 'bg-gray-200 text-gray-500'"
          >
            {{ getTabCount(tab.id) }}
          </span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        
        <!-- Required Reports Tab -->
        <div *ngIf="activeTab() === 'required'" class="animate-in fade-in duration-300">
          <table class="w-full text-right border-collapse">
            <thead>
              <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100">
                <th class="px-8 py-5">اسم التقرير</th>
                <th class="px-8 py-5">الدورية</th>
                <th class="px-8 py-5">تاريخ الاستحقاق</th>
                <th class="px-8 py-5 text-center">طريقة الإدخال</th>
                <th class="px-8 py-5 text-left">الإجراء</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let report of requiredReports()" class="group hover:bg-gray-50/50 transition-colors">
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-capmas-primary flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                    </div>
                    <span class="text-sm font-bold text-gray-800">{{ report.name }}</span>
                  </div>
                </td>
                <td class="px-8 py-6 text-xs font-bold text-gray-500">{{ report.frequency }}</td>
                <td class="px-8 py-6 text-xs font-bold text-red-500">{{ report.dueDate }}</td>
                <td class="px-8 py-6 text-center">
                   <span class="px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-tighter">
                     {{ report.inputMethod === 'both' ? 'نموذج + إكسل' : report.inputMethod === 'form' ? 'نموذج إلكتروني' : 'رفع ملف إكسل' }}
                   </span>
                </td>
                <td class="px-8 py-6 text-left">
                  <button [routerLink]="['/external-entity-admin/submit', report.id]" class="px-6 py-2 bg-capmas-primary text-white text-[10px] font-black rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100">
                    بدء الإدخال
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Returned Tab -->
        <div *ngIf="activeTab() === 'returned'" class="animate-in fade-in duration-300">
          <div class="p-8 space-y-6">
            <div *ngFor="let sub of returnedSubmissions()" class="p-6 bg-red-50/50 border border-red-100 rounded-[2rem] relative group">
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-bold text-gray-800">{{ sub.reportName }}</h4>
                    <p class="text-xs text-red-500 font-bold">تم الإرجاع بتاريخ: {{ sub.returnedAt | date:'medium' }}</p>
                  </div>
                </div>
                <button [routerLink]="['/external-entity-admin/submit', sub.reportId]" class="px-6 py-3 bg-red-600 text-white text-xs font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                  تصحيح وإعادة إرسال
                </button>
              </div>
              <div class="bg-white/80 p-4 rounded-xl border border-red-50">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">ملاحظات الإدارة:</span>
                <p class="text-sm text-gray-700 leading-relaxed font-medium">{{ sub.returnReason }}</p>
              </div>
            </div>
            <div *ngIf="returnedSubmissions().length === 0" class="text-center py-20">
               <p class="text-gray-400 font-bold">لا توجد تقارير مُعادة حالياً.</p>
            </div>
          </div>
        </div>

        <!-- History Tab -->
        <div *ngIf="activeTab() === 'history'" class="animate-in fade-in duration-300">
           <!-- Status Filters -->
           <div class="px-8 py-4 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4">
             <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">تصفية حسب الحالة:</span>
             <div class="flex gap-2">
               <button (click)="statusFilter.set('all')" 
                       [class.bg-white]="statusFilter() === 'all'" 
                       [class.shadow-sm]="statusFilter() === 'all'" 
                       [class.text-capmas-primary]="statusFilter() === 'all'" 
                       class="px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all border border-transparent"
                       [class.border-gray-200]="statusFilter() === 'all'">الكل</button>
               <button (click)="statusFilter.set('approved')" 
                       [class.bg-green-500]="statusFilter() === 'approved'" 
                       [class.text-white]="statusFilter() === 'approved'" 
                       class="px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all border border-transparent hover:bg-green-50 text-green-600">تم الاعتماد</button>
               <button (click)="statusFilter.set('returned')" 
                       [class.bg-red-500]="statusFilter() === 'returned'" 
                       [class.text-white]="statusFilter() === 'returned'" 
                       class="px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all border border-transparent hover:bg-red-50 text-red-600">معاده للتصحيح</button>
               <button (click)="statusFilter.set('under_review')" 
                       [class.bg-orange-500]="statusFilter() === 'under_review'" 
                       [class.text-white]="statusFilter() === 'under_review'" 
                       class="px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all border border-transparent hover:bg-orange-50 text-orange-600">قيد المراجعة</button>
             </div>
           </div>

           <table class="w-full text-right border-collapse">
            <thead>
              <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100">
                <th class="px-8 py-5">اسم التقرير</th>
                <th class="px-8 py-5 text-center">تاريخ التقديم</th>
                <th class="px-8 py-5 text-center">الحالة</th>
                <th class="px-8 py-5 text-center">التأخير</th>
                <th class="px-8 py-5 text-left">التفاصيل</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let sub of historySubmissions()" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-8 py-6 font-bold text-gray-700 text-sm">{{ sub.reportName }}</td>
                <td class="px-8 py-6 text-center text-xs font-bold text-gray-500">{{ sub.submittedAt | date:'medium' }}</td>
                <td class="px-8 py-6 text-center">
                  <span class="px-3 py-1 rounded-full text-[10px] font-black" [ngClass]="getStatusClasses(sub.status)">
                    {{ getStatusLabel(sub.status) }}
                  </span>
                </td>
                <td class="px-8 py-6 text-center font-bold text-xs" [ngClass]="sub.delayDays > 0 ? 'text-red-500' : 'text-green-500'">
                  {{ sub.delayDays > 0 ? sub.delayDays + ' أيام' : 'لا يوجد' }}
                </td>
                <td class="px-8 py-6 text-left">
                  <button class="p-2 text-gray-400 hover:text-capmas-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="historySubmissions().length === 0" class="text-center py-20">
             <p class="text-gray-400 font-bold">لا توجد تقارير مطابقة لهذا التصنيف.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EntityPortalComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private adminService = inject(AdministrationService);
  private auth = inject(AuthService);

  adminId = signal<string | null>(null);
  activeTab = signal<'required' | 'returned' | 'history'>('required');
  statusFilter = signal<'all' | 'approved' | 'returned' | 'under_review'>('all');

  tabs: { id: 'required' | 'returned' | 'history'; label: string }[] = [
    { id: 'required', label: 'التقارير المطلوبة' },
    { id: 'returned', label: 'مُعادة للتصحيح' },
    { id: 'history', label: 'التقارير المرسلة' }
  ];

  administration = computed(() => {
    const id = this.adminId();
    return id ? this.adminService.getAdministration(id) : null;
  });

  requiredReports = computed(() => {
    const adminId = this.adminId();
    const entityId = this.auth.currentUser()?.assignedEntityId;
    if (!adminId || !entityId) return [];
    
    // Filter reports for this specific entity and admin
    return this.adminService.getReportsByEntity(entityId).filter(r => r.adminId === adminId);
  });

  returnedSubmissions = computed(() => {
    const adminId = this.adminId();
    const entityId = this.auth.currentUser()?.assignedEntityId;
    if (!adminId || !entityId) return [];
    return this.adminService.getReturnedSubmissions(entityId, adminId);
  });

  historySubmissions = computed(() => {
    const adminId = this.adminId();
    const entityId = this.auth.currentUser()?.assignedEntityId;
    const filter = this.statusFilter();
    
    if (!adminId || !entityId) return [];
    
    let submissions = this.adminService.getSubmissionsByAdmin(entityId, adminId);
    
    if (filter !== 'all') {
      submissions = submissions.filter(s => s.status === filter);
    }
    
    return submissions;
  });

  ngOnInit() {
    this.adminId.set(this.route.snapshot.params['adminId']);
  }

  getTabCount(tabId: string): number {
    switch (tabId) {
      case 'required': return this.requiredReports().length;
      case 'returned': return this.returnedSubmissions().length;
      case 'history': return this.historySubmissions().length;
      default: return 0;
    }
  }

  getUnderReviewCount(): number {
    return this.historySubmissions().filter(s => s.status === 'under_review').length;
  }

  getOverdueCount(): number {
    // In a real app, this would check current date vs report deadline
    // For mock, we'll return a fixed number or check history for late submissions
    return this.historySubmissions().filter(s => s.delayDays > 0).length;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'approved': return 'تم الاعتماد';
      case 'under_review': return 'قيد المراجعة';
      case 'returned': return 'معاده للتصحيح';
      default: return status;
    }
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'under_review': return 'bg-orange-100 text-orange-700';
      case 'returned': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
