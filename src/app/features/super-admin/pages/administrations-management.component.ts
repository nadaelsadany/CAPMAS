import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-administrations-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-arabic font-bold text-gray-800 mb-2">إدارة الإدارات العامة</h1>
          <p class="text-gray-500">متابعة ومراقبة أداء الإدارات، ربط الجهات الخارجية، وتعيين المراجعين.</p>
        </div>
        
        <button routerLink="/super-admin/administrations/create" class="bg-capmas-primary hover:bg-opacity-90 text-white px-6 py-2.5 rounded-lg shadow-sm transition-colors font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إنشاء إدارة عامة جديدة
        </button>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-blue-50 text-capmas-primary rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
          <div><p class="text-xs text-gray-500 font-bold mb-1">إجمالي الإدارات</p><p class="text-xl font-bold text-gray-800">12</p></div>
        </div>
      </div>

      <!-- Administrations Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div *ngFor="let admin of administrations" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
          <!-- Card Header -->
          <div class="p-6 border-b border-gray-50 flex items-start gap-4">
            <div class="p-3 bg-blue-50 text-capmas-primary rounded-xl shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-1 line-clamp-1">{{ admin.name }}</h3>
              <p class="text-xs text-gray-500 font-semibold line-clamp-2">إدارة مسؤولة عن جمع وتحليل البيانات من الجهات المرتبطة.</p>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-6 flex-1">
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm font-bold text-gray-600">الجهات المرتبطة</span>
              <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">{{ admin.linkedEntities }}</span>
            </div>
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm font-bold text-gray-600">التقارير المطلوبة</span>
              <span class="bg-blue-50 text-capmas-primary px-3 py-1 rounded-full text-sm font-bold">{{ admin.incomingReports }}</span>
            </div>
            
            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-gray-500">معدل الإنجاز العام</span>
                <span [class]="admin.textColor">{{ admin.statusText }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex" dir="ltr">
                <div [class]="admin.progressColor + ' h-2'" [style.width]="admin.progress + '%'"></div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="p-4 bg-gray-50 border-t border-gray-100 shrink-0">
            <button [routerLink]="['/super-admin/administrations', admin.id]" class="w-full bg-white border border-gray-200 hover:border-capmas-primary text-capmas-primary font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2">
              إدارة التفاصيل
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            </button>
          </div>
        </div>

      </div>

    </div>


    
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class AdministrationsManagementComponent {
  
  administrations = [
    {
      id: 'it-dept',
      name: 'إدارة تقنية المعلومات',
      linkedEntities: 45,
      reviewers: 8,
      incomingReports: 120,
      progress: 85,
      progressColor: 'bg-green-500',
      textColor: 'text-green-600',
      statusText: '85% معتمدة'
    },
    {
      id: 'planning-dept',
      name: 'إدارة التخطيط',
      linkedEntities: 30,
      reviewers: 5,
      incomingReports: 90,
      progress: 60,
      progressColor: 'bg-yellow-400',
      textColor: 'text-yellow-600',
      statusText: '60% معتمدة (تأخير)'
    },
    {
      id: 'hr-dept',
      name: 'إدارة الموارد البشرية',
      linkedEntities: 15,
      reviewers: 3,
      incomingReports: 45,
      progress: 95,
      progressColor: 'bg-green-500',
      textColor: 'text-green-600',
      statusText: '95% معتمدة'
    }
  ];


}
