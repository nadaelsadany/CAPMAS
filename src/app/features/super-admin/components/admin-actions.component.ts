import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-actions',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <h3 class="text-xl font-bold text-capmas-primary mb-6">إجراءات الإدارة السريعة</h3>
      
      <div class="flex flex-wrap gap-4">
        <button routerLink="/super-admin/administrations/create" class="bg-capmas-primary hover:bg-opacity-90 text-white px-6 py-3 rounded shadow transition-colors font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إنشاء إدارة عامة
        </button>
        
        <button [routerLink]="['/super-admin/external-entities']" [queryParams]="{create: true}" class="bg-capmas-primary hover:bg-opacity-90 text-white px-6 py-3 rounded shadow transition-colors font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إنشاء جهة خارجية
        </button>

        <button routerLink="/super-admin/administrations" class="bg-capmas-secondary hover:bg-opacity-90 text-white px-6 py-3 rounded shadow transition-colors font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
          ربط جهة بإدارة عامة
        </button>

        <button routerLink="/super-admin/users" class="bg-capmas-accent hover:bg-opacity-90 text-white px-6 py-3 rounded shadow transition-colors font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>
          تعيين مراجع
        </button>
      </div>
    </div>
  `
})
export class AdminActionsComponent {}
