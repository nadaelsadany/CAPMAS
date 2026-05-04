import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdministrationService } from '../../../core/services/administration.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-entity-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      <div class="mb-10 text-center animate-in fade-in zoom-in duration-700">
        <h1 class="text-4xl font-black text-gray-800 mb-4">بوابة تبادل البيانات للجهات الخارجية</h1>
        <p class="text-gray-500 max-w-2xl mx-auto font-medium text-lg">يرجى اختيار الإدارة المختصة لمتابعة التزاماتك وتقديم التقارير المطلوبة.</p>
        <div class="w-24 h-1.5 bg-capmas-primary mx-auto mt-6 rounded-full opacity-20"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          *ngFor="let admin of linkedAdministrations()" 
          [routerLink]="['portal', admin.id]"
          class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-capmas-primary/20 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-capmas-primary/5 transition-colors"></div>
          
          <div class="relative z-10">
            <div class="flex justify-between items-start mb-6">
              <div class="w-14 h-14 rounded-2xl bg-blue-50 text-capmas-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6.75h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18" /></svg>
              </div>
              <span class="text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest" 
                    [ngClass]="admin.isDelayed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
                {{ admin.isDelayed ? 'توجد تنبيهات' : 'ملتزم' }}
              </span>
            </div>

            <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-capmas-primary transition-colors">{{ admin.name }}</h3>
            <p class="text-xs text-gray-400 font-bold mb-6 line-clamp-2">{{ admin.description }}</p>

            <div class="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">تقارير مطلوبة</span>
                <span class="text-lg font-black text-capmas-primary">{{ admin.requiredReports }}</span>
              </div>
              <div class="flex flex-col text-left items-end">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">آخر موعد</span>
                <span class="text-xs font-bold text-gray-600">{{ admin.nextDeadline }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EntityDashboardComponent implements OnInit {
  private adminService = inject(AdministrationService);
  private auth = inject(AuthService);

  linkedAdministrations = computed(() => {
    const user = this.auth.currentUser();
    const entityId = user?.assignedEntityId;
    if (!entityId) return [];

    const admins = this.adminService.getAdministrationsSync();
    return admins
      .filter(a => a.linkedEntityIds.includes(entityId))
      .map(a => ({
        ...a,
        requiredReports: 3, // Mocking
        nextDeadline: '15 مايو', // Mocking
        isDelayed: Math.random() > 0.7 // Mocking
      }));
  });

  ngOnInit() {}
}
