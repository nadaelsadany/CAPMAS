import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdministrationService } from '../../../core/services/administration.service';
import { AuthService } from '../../../core/auth/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="p-8">
      <!-- Header & Administration Selector -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">لوحة متابعة الإدارة</h1>
          <p class="text-gray-500 font-medium">متابعة التقارير والامتثال للجهات التابعة.</p>
        </div>

        <div *ngIf="availableAdmins().length > 1" class="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
          <span class="text-[10px] font-bold text-gray-400 px-3 uppercase tracking-wider">تبديل الإدارة:</span>
          <select 
            [ngModel]="activeAdminId()" 
            (ngModelChange)="switchAdmin($event)"
            class="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-capmas-primary outline-none cursor-pointer min-w-[180px]"
          >
            <option *ngFor="let admin of availableAdmins()" [value]="admin.id" [disabled]="admin.id === activeAdminId()">{{ admin.name }}</option>
          </select>
        </div>
      </div>

      <div *ngIf="!activeAdminId()" class="bg-white rounded-[2.5rem] p-12 text-center border border-dashed border-gray-200">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">لم يتم اختيار إدارة</h2>
        <p class="text-gray-500 max-w-sm mx-auto">يرجى اختيار الإدارة المطلوب متابعتها من القائمة العلوية أو التأكد من صلاحيات حسابك.</p>
      </div>

      <!-- Stats Grid -->
      <div *ngIf="activeAdminId()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors"></div>
          <div class="relative z-10">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">إجمالي التقارير المطلوبة</span>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-black text-gray-800">{{ stats().totalRequired }}</span>
              <span class="text-xs font-bold text-blue-600">بيان</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full blur-2xl group-hover:bg-orange-100 transition-colors"></div>
          <div class="relative z-10">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">تقارير قيد المراجعة</span>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-black text-orange-600">{{ stats().pendingReview }}</span>
              <span class="text-xs font-bold text-orange-400">تحتاج إجراء</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full blur-2xl group-hover:bg-red-100 transition-colors"></div>
          <div class="relative z-10">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">تقارير متأخرة</span>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-black text-red-600">{{ stats().overdue }}</span>
              <span class="text-xs font-bold text-red-400">تجاوز المهلة</span>
            </div>
          </div>
        </div>

        <div class="bg-blue-600 p-8 rounded-[2rem] shadow-xl shadow-blue-100 relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div class="relative z-10 text-white">
            <span class="text-xs font-bold opacity-80 uppercase tracking-widest mb-1 block">نسبة الامتثال</span>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-black">{{ stats().compliance }}%</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-blue-200"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.5 4.5L21.75 4.5M21.75 4.5V9m0-4.5H17.25" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="activeAdminId()" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content: Reports for Review -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 class="font-bold text-gray-800">التقارير الواردة للمراجعة</h3>
              <a routerLink="/administration-admin/reports" class="text-xs font-bold text-capmas-primary hover:underline transition-all">عرض كافة التقارير</a>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30">
                    <th class="px-8 py-4">الجهة المرسلة</th>
                    <th class="px-8 py-4">اسم التقرير</th>
                    <th class="px-8 py-4">تاريخ التقديم</th>
                    <th class="px-8 py-4 text-left">الإجراء</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr *ngFor="let report of pendingReports()" class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                          {{ report.entityName.charAt(0) }}
                        </div>
                        <span class="text-sm font-bold text-gray-700">{{ report.entityName }}</span>
                      </div>
                    </td>
                    <td class="px-8 py-5">
                      <span class="text-sm text-gray-600 font-medium">{{ report.reportName }}</span>
                    </td>
                    <td class="px-8 py-5">
                      <span class="text-xs text-gray-400 font-bold">{{ report.submittedAt | date:'shortDate' }}</span>
                    </td>
                    <td class="px-8 py-5 text-left">
                      <button [routerLink]="['/administration-admin/review', report.id]" class="px-4 py-2 bg-blue-50 text-capmas-primary rounded-xl text-[10px] font-bold hover:bg-capmas-primary hover:text-white transition-all">
                        مراجعة الآن
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="pendingReports().length === 0">
                    <td colspan="4" class="px-8 py-10 text-center text-gray-400 font-medium italic text-sm">
                      لا توجد تقارير بانتظار المراجعة حالياً.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sidebar: Linked Entities Compliance -->
        <div class="space-y-6">
          <div class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
            <h3 class="font-bold text-gray-800 mb-6">امتثال الجهات التابعة</h3>
            <div class="space-y-6">
              <div *ngFor="let entity of linkedEntities()" class="flex items-center justify-between group">
                <div class="flex items-center gap-3">
                  <div [ngClass]="entity.isOverdue ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'" class="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                    <svg *ngIf="!entity.isOverdue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    <svg *ngIf="entity.isOverdue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-800">{{ entity.name }}</h4>
                    <p class="text-[10px] font-bold" [ngClass]="entity.isOverdue ? 'text-red-400' : 'text-green-400'">
                      {{ entity.isOverdue ? 'متأخر في التسليم' : 'ملتزم بالمواعيد' }}
                    </p>
                  </div>
                </div>
                <button class="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-300 hover:text-capmas-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
             <div class="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
             <h4 class="text-sm font-bold mb-4 flex items-center gap-2">
               <span class="w-2 h-2 rounded-full bg-blue-400"></span>
               مواعيد الاستحقاق القادمة
             </h4>
             <div class="space-y-4 relative z-10">
               <div *ngFor="let deadline of upcomingDeadlines()" class="bg-white/10 p-4 rounded-2xl border border-white/5">
                 <div class="flex justify-between items-center mb-1">
                   <span class="text-[11px] font-bold text-blue-300 uppercase tracking-widest">{{ deadline.reportName }}</span>
                   <span class="text-[10px] text-white/50 font-bold italic">بعد {{ deadline.daysLeft }} أيام</span>
                 </div>
                 <p class="text-[10px] text-white/80 font-medium">آخر موعد: {{ deadline.dueDate | date:'longDate' }}</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdministrationDashboardComponent implements OnInit {
  private adminService = inject(AdministrationService);
  private auth = inject(AuthService);

  activeAdminId = this.auth.activeAdministrationId;
  availableAdmins = computed(() => {
    const user = this.auth.currentUser();
    if (!user || !user.administrationIds) return [];
    return this.adminService.getAdministrationsSync().filter(a => user.administrationIds?.includes(a.id));
  });

  stats = computed(() => {
    const adminId = this.activeAdminId();
    // In a real app, these would be calculated from service
    return {
      totalRequired: 24,
      pendingReview: 8,
      overdue: 3,
      compliance: 87
    };
  });

  pendingReports = computed(() => {
    // Mocking pending reports for the current administration
    return [
      { id: 'r1', entityName: 'مصلحة الجمارك', reportName: 'بيان الواردات الأسبوعي', submittedAt: new Date() },
      { id: 'r2', entityName: 'الهيئة العامة للرقابة', reportName: 'فحص عينات التربة', submittedAt: new Date(Date.now() - 86400000) },
      { id: 'r3', entityName: 'وزارة المالية', reportName: 'الحصيلة الضريبية', submittedAt: new Date(Date.now() - 172800000) }
    ];
  });

  linkedEntities = computed(() => {
    const adminId = this.activeAdminId();
    if (!adminId) return [];
    const admin = this.adminService.getAdministrationsSync().find((a: any) => a.id === adminId);
    if (!admin) return [];
    
    // Cross reference with entities
    const entities = this.adminService.getExternalEntitiesSync();
    return (admin.linkedEntityIds || []).map((id: string) => {
      const entity = entities.find((e: any) => e.id === id);
      return {
        id: id,
        name: entity?.name ?? 'جهة غير معروفة',
        isOverdue: Math.random() > 0.7 // Mocking overdue status
      };
    });
  });

  upcomingDeadlines = computed(() => {
    return [
      { reportName: 'تقرير حركة الملاحة', dueDate: new Date(Date.now() + 2 * 86400000), daysLeft: 2 },
      { reportName: 'بيانات الصادرات السنوية', dueDate: new Date(Date.now() + 5 * 86400000), daysLeft: 5 }
    ];
  });

  ngOnInit() {
    // Initialize active admin if not set
    if (!this.activeAdminId() && this.availableAdmins().length > 0) {
      this.auth.activeAdministrationId.set(this.availableAdmins()[0].id);
    }
  }

  switchAdmin(id: any) {
    this.auth.activeAdministrationId.set(id.toString());
  }
}
