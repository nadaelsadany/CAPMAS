import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdministrationService } from '../../../core/services/administration.service';
import { AuthService } from '../../../core/auth/auth.service';

type ReportStatus = 'new' | 'returned' | 'reviewed' | 'late';

@Component({
  selector: 'app-reports-management',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      
      <!-- Top Navigation & Context -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <nav class="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            <a routerLink="/administration-admin" class="hover:text-capmas-primary transition-colors">الرئيسية</a>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            <span class="text-gray-600">مراجعة التقارير</span>
            <ng-container *ngIf="selectedEntity()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
              <span class="text-capmas-primary">{{ selectedEntity()?.name }}</span>
            </ng-container>
          </nav>
          <h1 class="text-3xl font-bold text-gray-800">
            {{ selectedEntity() ? 'تقارير ' + selectedEntity()?.name : 'اختيار الجهة للمراجعة' }}
          </h1>
        </div>

        <div class="flex items-center gap-4">
          <!-- Administration Selector (Moved from Header) -->
          <div *ngIf="availableAdmins().length > 1" class="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
            <span class="text-[10px] font-bold text-gray-400 px-3 uppercase tracking-wider">الإدارة:</span>
            <select 
              [ngModel]="activeAdminId()" 
              (ngModelChange)="switchAdmin($event)"
              class="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-capmas-primary outline-none cursor-pointer min-w-[180px]"
            >
              <option *ngFor="let admin of availableAdmins()" [value]="admin.id">{{ admin.name }}</option>
            </select>
          </div>

          <button *ngIf="selectedEntity()" (click)="selectedEntity.set(null)" class="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 bg-white border border-gray-100 rounded-xl transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
            تغيير الجهة
          </button>
        </div>
      </div>

      <!-- State 1: Entity Selection Table -->
      <div *ngIf="!selectedEntity()" class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <table class="w-full text-right border-collapse">
          <thead>
            <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100">
              <th class="px-8 py-5">اسم الجهة التابعة</th>
              <th class="px-8 py-5 text-center">إجمالي التقارير المطلوبة</th>
              <th class="px-8 py-5 text-center">بانتظار المراجعة</th>
              <th class="px-8 py-5 text-left">الإجراء</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr 
              *ngFor="let entity of linkedEntities()" 
              class="group hover:bg-gray-50/50 transition-colors cursor-pointer"
              (click)="selectEntity(entity)"
            >
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-blue-50 text-capmas-primary flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6.75h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18" /></svg>
                  </div>
                  <h4 class="text-sm font-bold text-gray-800 group-hover:text-capmas-primary transition-colors">{{ entity.name }}</h4>
                </div>
              </td>
              <td class="px-8 py-6 text-center">
                <span class="text-sm font-black text-gray-700">{{ entity.totalRequired }}</span>
              </td>
              <td class="px-8 py-6 text-center">
                <span class="text-sm font-black text-gray-700">{{ entity.pendingCount }}</span>
              </td>
              <td class="px-8 py-6 text-left">
                <button class="px-5 py-2 bg-gray-100 text-gray-600 text-[10px] font-black rounded-xl group-hover:bg-capmas-primary group-hover:text-white transition-all">
                  عرض التقارير
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- State 2: Reports View with Tabs -->
      <div *ngIf="selectedEntity()" class="animate-in fade-in zoom-in-95 duration-500">
        
        <!-- Tabs Header -->
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

        <!-- Reports List -->
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
          <table class="w-full text-right border-collapse">
            <thead>
              <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100">
                <th class="px-8 py-5">اسم التقرير</th>
                <th class="px-8 py-5">المرحلة الحالية</th>
                <th class="px-8 py-5">تاريخ الاستحقاق</th>
                <th class="px-8 py-5">آخر تحديث</th>
                <th class="px-8 py-5 text-left">الإجراء</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let report of filteredReports()" class="group hover:bg-gray-50/50 transition-colors">
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-capmas-primary flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-gray-800 group-hover:text-capmas-primary transition-colors">{{ report.name }}</h4>
                      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">الدورية: {{ report.period }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full" [ngClass]="getStatusColor(report.status)"></div>
                    <span class="text-xs font-bold text-gray-700">{{ getStatusLabel(report.status) }}</span>
                  </div>
                </td>
                <td class="px-8 py-6">
                   <div class="flex flex-col">
                     <span class="text-xs font-bold text-gray-600">{{ report.dueDate | date:'mediumDate' }}</span>
                     <span *ngIf="report.isLate" class="text-[10px] font-black text-red-500 mt-0.5">متأخر منذ {{ report.delayDays }} يوم</span>
                   </div>
                </td>
                <td class="px-8 py-6">
                  <span class="text-[11px] font-bold text-gray-400 italic">{{ report.updatedAt | date:'short' }}</span>
                </td>
                <td class="px-8 py-6 text-left">
                  <button 
                    *ngIf="report.status === 'new' || report.status === 'returned'"
                    [routerLink]="['/administration-admin/review', report.id]"
                    class="px-5 py-2 bg-capmas-primary text-white text-[10px] font-black rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                  >
                    {{ report.status === 'returned' ? 'إعادة مراجعة' : 'مراجعة الآن' }}
                  </button>
                  <button 
                    *ngIf="report.status === 'reviewed'"
                    [routerLink]="['/administration-admin/review', report.id]"
                    class="px-5 py-2 bg-gray-100 text-gray-600 text-[10px] font-black rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                  >
                    عرض التفاصيل
                  </button>
                  <button 
                    *ngIf="report.status === 'late'"
                    class="px-5 py-2 bg-red-50 text-red-600 text-[10px] font-black rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-95"
                  >
                    إرسال تذكير
                  </button>
                </td>
              </tr>

              <tr *ngIf="filteredReports().length === 0">
                <td colspan="5" class="px-8 py-20 text-center">
                  <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                  </div>
                  <h5 class="text-sm font-bold text-gray-800">لا توجد تقارير في هذا القسم</h5>
                  <p class="text-xs text-gray-400 font-medium">سيتم عرض التقارير هنا بمجرد توفر بيانات مطابقة للمعايير المختارة.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ReportsManagementComponent implements OnInit {
  private adminService = inject(AdministrationService);
  private auth = inject(AuthService);

  activeAdminId = this.auth.activeAdministrationId;
  selectedEntity = signal<any>(null);
  activeTab = signal<ReportStatus>('new');

  tabs: { id: ReportStatus; label: string }[] = [
    { id: 'new', label: 'تقارير جديدة' },
    { id: 'returned', label: 'مُعادة للتصحيح' },
    { id: 'reviewed', label: 'تمت المراجعة' },
    { id: 'late', label: 'لم يتم التسليم (متأخرة)' }
  ];

  availableAdmins = computed(() => {
    const user = this.auth.currentUser();
    if (!user || !user.administrationIds) return [];
    return this.adminService.getAdministrationsSync().filter(a => user.administrationIds?.includes(a.id));
  });

  linkedEntities = computed(() => {
    const adminId = this.activeAdminId();
    if (!adminId) return [];
    
    // Mocking entity data for the current administration
    return [
      { 
        id: 'e1', 
        name: 'مصلحة الجمارك المصرية', 
        pendingCount: 12, 
        totalRequired: 45
      },
      { 
        id: 'e2', 
        name: 'الهيئة العامة للرقابة على الصادرات', 
        pendingCount: 8, 
        totalRequired: 24
      },
      { 
        id: 'e3', 
        name: 'وزارة المالية - قطاع التجارة', 
        pendingCount: 3, 
        totalRequired: 12
      },
      { 
        id: 'e4', 
        name: 'الغرفة التجارية بالقاهرة', 
        pendingCount: 0, 
        totalRequired: 10
      }
    ];
  });

  reports = computed(() => {
    const entityId = this.selectedEntity()?.id;
    if (!entityId) return [];

    // Mocking reports for the selected entity
    return [
      { id: 'r1', name: 'بيان الواردات اليومي', period: 'يومي', status: 'new', dueDate: new Date(), updatedAt: new Date(), isLate: false, delayDays: 0 },
      { id: 'r2', name: 'حركة الملاحة الجوية', period: 'أسبوعي', status: 'new', dueDate: new Date(), updatedAt: new Date(Date.now() - 3600000), isLate: false, delayDays: 0 },
      { id: 'r3', name: 'تقرير الصادرات الزراعية', period: 'شهري', status: 'returned', dueDate: new Date(Date.now() - 86400000), updatedAt: new Date(), isLate: false, delayDays: 0 },
      { id: 'r4', name: 'بيانات الحصيلة الجمركية', period: 'يومي', status: 'reviewed', dueDate: new Date(Date.now() - 172800000), updatedAt: new Date(Date.now() - 86400000), isLate: false, delayDays: 0 },
      { id: 'r5', name: 'ميزان المدفوعات التجاري', period: 'شهري', status: 'late', dueDate: new Date(Date.now() - 432000000), updatedAt: new Date(Date.now() - 432000000), isLate: true, delayDays: 5 },
      { id: 'r6', name: 'تقرير حركة الشحن البحري', period: 'أسبوعي', status: 'late', dueDate: new Date(Date.now() - 259200000), updatedAt: new Date(Date.now() - 259200000), isLate: true, delayDays: 3 },
    ] as any[];
  });

  filteredReports = computed(() => {
    return this.reports().filter(r => r.status === this.activeTab());
  });

  ngOnInit() {
    if (!this.activeAdminId() && this.availableAdmins().length > 0) {
      this.auth.activeAdministrationId.set(this.availableAdmins()[0].id);
    }
  }

  selectEntity(entity: any) {
    this.selectedEntity.set(entity);
  }

  switchAdmin(id: string) {
    this.auth.activeAdministrationId.set(id);
    this.selectedEntity.set(null); // Reset selection when switching context
  }

  getTabCount(status: string): number {
    return this.reports().filter(r => r.status === status).length;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'new': return 'في انتظار المراجعة';
      case 'returned': return 'مُعدل من الجهة';
      case 'reviewed': return 'تم الاعتماد';
      case 'late': return 'لم يتم التسليم';
      default: return 'غير معروف';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'new': return 'bg-orange-500';
      case 'returned': return 'bg-blue-500';
      case 'reviewed': return 'bg-green-500';
      case 'late': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  }
}
