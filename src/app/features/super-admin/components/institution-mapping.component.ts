import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationService, Administration, ExternalEntity } from '../../../core/services/administration.service';

@Component({
  selector: 'app-institution-mapping',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm mb-8">
      <div class="flex justify-between items-center mb-10">
        <div>
          <h3 class="text-xl font-bold text-gray-800">خريطة العلاقات الهيكلية</h3>
          <p class="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">ECOSYSTEM CONNECTIVITY MAP</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-capmas-primary"></span>
          <span class="text-[10px] font-bold text-gray-500">إدارة عامة</span>
          <span class="w-3 h-3 rounded-full bg-blue-50 border border-blue-200 ml-2"></span>
          <span class="text-[10px] font-bold text-gray-500">جهة خارجية</span>
        </div>
      </div>
      
      <div class="space-y-16 relative">
        <!-- Vertical Timeline Line -->
        <div class="absolute top-0 bottom-0 right-[5rem] w-2 bg-gray-200 -z-10 hidden lg:block rounded-full"></div>

        <div *ngFor="let admin of administrations" class="relative group">
          <div class="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-16">
            
            <!-- Administration Node -->
            <div class="relative z-10 shrink-0">
              <div class="w-40 h-24 bg-capmas-primary text-white rounded-2xl shadow-xl shadow-blue-100 flex flex-col justify-center items-center border-b-4 border-capmas-secondary transition-transform group-hover:scale-105 duration-300">
                <span class="text-[10px] opacity-70 font-bold mb-1">الإدارة العامة</span>
                <span class="font-bold text-center text-sm leading-tight px-3">{{ admin.name }}</span>
                
                <!-- Main Connector from Admin Node -->
                <div class="hidden lg:block absolute left-0 top-1/2 w-16 h-1 bg-gray-300 -translate-x-full -z-10"></div>
              </div>
            </div>

            <!-- Entities Cluster -->
            <div class="flex flex-wrap gap-4 flex-1 relative">
              <div *ngIf="admin.linkedEntityIds.length === 0" class="py-4 px-6 border-2 border-dashed border-gray-200 rounded-2xl text-gray-300 font-bold text-xs">
                لا توجد جهات مرتبطة حالياً
              </div>
              
              <div *ngFor="let entityId of admin.linkedEntityIds" class="relative animate-fade-in flex items-center">
                <!-- Connector to each entity -->
                <div class="hidden lg:block w-4 h-1 bg-gray-300 shrink-0"></div>
                
                <div class="px-6 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl shadow-sm flex items-center gap-3 hover:bg-white hover:shadow-md transition-all group/entity">
                  <div class="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-capmas-primary shadow-sm border border-blue-50 group-hover/entity:bg-capmas-primary group-hover/entity:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                  </div>
                  <span class="text-capmas-primary font-bold text-xs">{{ getEntityName(entityId) }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <p class="text-xs text-gray-400 text-center font-bold">
          خريطة تفاعلية توضح ترابط الإدارات العامة بالجهات الخارجية المستهدفة لتبادل البيانات.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(10px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class InstitutionMappingComponent implements OnInit {
  private adminService = inject(AdministrationService);
  administrations: Administration[] = [];
  entities: ExternalEntity[] = [];

  ngOnInit() {
    this.adminService.administrations$.subscribe(data => {
      this.administrations = data;
    });
    this.adminService.entities$.subscribe(data => {
      this.entities = data;
    });
  }

  getEntityName(id: string) {
    return this.entities.find(e => e.id === id)?.name || 'جهة غير معروفة';
  }
}
