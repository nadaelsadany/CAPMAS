import { Component } from '@angular/core';

@Component({
  selector: 'app-external-entity-admin',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-arabic font-bold text-capmas-primary mb-6">لوحة تحكم الجهة الخارجية</h1>
      
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-bold mb-4 text-capmas-primary">التقارير المطلوبة</h2>
        <p class="text-gray-600">المهام المعلقة والتقارير الواجب رفعها قريباً...</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4 text-capmas-primary">حالة التقارير المرسلة</h2>
        <p class="text-gray-600">متابعة حالة الاعتماد للتقارير التي تم تقديمها سابقاً...</p>
      </div>
    </div>
  `
})
export class ExternalEntityAdminComponent {}
