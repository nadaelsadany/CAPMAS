import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdministrationService, ExternalEntity, Administration } from '../../../core/services/administration.service';
import { AuthService } from '../../../core/auth/auth.service';
import { PermissionDirective } from '../../../core/auth/permission.directive';

@Component({
  selector: 'app-external-entities',
  standalone: true,
  imports: [CommonModule, FormsModule, PermissionDirective],
  template: `
    <div class="p-8 max-w-7xl mx-auto h-full flex flex-col text-right" dir="rtl">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-arabic font-bold text-gray-800 mb-2">إدارة الجهات الخارجية</h1>
          <div class="flex items-center gap-4">
            <p class="text-gray-500 font-semibold">إدارة الجهات الخارجية، ربطها بالإدارات، ومتابعة التقارير المرفوعة.</p>
            <span *ngIf="auth.currentUser()?.role === 'DECISION_MAKER'" class="bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100 text-[10px] font-black flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
              عرض فقط
            </span>
          </div>
        </div>
        
        <button *appHasRole="['SUPER_ADMIN']" (click)="openCreateModal()" class="bg-capmas-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إنشاء جهة خارجية جديدة
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div class="relative flex-1 w-full">
          <input type="text" [(ngModel)]="searchTerm" placeholder="بحث باسم الجهة..." class="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-capmas-primary outline-none text-sm font-semibold transition-all bg-gray-50/30">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 absolute right-4 top-3.5 text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        </div>
        
        <select [(ngModel)]="typeFilter" class="w-full md:w-64 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-capmas-primary outline-none text-sm font-bold bg-gray-50/30">
          <option value="all">جميع أنواع الجهات</option>
          <option value="جهات حكومية">جهات حكومية</option>
          <option value="مؤسسات مالية">مؤسسات مالية</option>
          <option value="هيئات رقابية">هيئات رقابية</option>
          <option value="منظمات أعمال">منظمات أعمال</option>
        </select>
      </div>

      <!-- Entities Table -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-1">
        <div class="overflow-x-auto">
          <table class="w-full text-right border-collapse">
            <thead class="bg-gray-50/80 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th class="p-5">اسم الجهة الخارجية</th>
                <th class="p-5">النوع</th>
                <th class="p-5">الإدارة العامة المرتبطة</th>
                <th class="p-5 text-center">التقارير</th>
                <th class="p-5">الحالة</th>
                <th *appHasRole="['SUPER_ADMIN']" class="p-5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let entity of filteredEntities" 
                  class="group hover:bg-blue-50/30 transition-colors cursor-pointer"
                  (click)="navigateToDetails(entity.id)">
                <td class="p-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-capmas-primary group-hover:text-white transition-all">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                    </div>
                    <span class="font-bold text-gray-800 group-hover:text-capmas-primary transition-colors">{{ entity.name }}</span>
                  </div>
                </td>
                <td class="p-5 text-sm font-semibold text-gray-500">{{ entity.type }}</td>
                <td class="p-5">
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let admin of getLinkedAdmins(entity.id)" 
                          class="bg-blue-50 text-capmas-primary px-2.5 py-1 rounded-lg text-[10px] font-bold border border-blue-100">
                      {{ admin.name }}
                    </span>
                    <span *ngIf="getLinkedAdmins(entity.id).length === 0" class="text-xs text-gray-300 font-bold">غير مرتبطة</span>
                  </div>
                </td>
                <td class="p-5 text-center">
                  <span class="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">{{ entity.reportsCount }}</span>
                </td>
                <td class="p-5">
                  <span [class]="entity.status === 'on-time' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'" 
                        class="px-3 py-1 rounded-full text-[10px] font-bold border">
                    {{ entity.status === 'on-time' ? 'منتظم' : 'متأخر' }}
                  </span>
                </td>
                <td *appHasRole="['SUPER_ADMIN']" class="p-5 text-center" (click)="$event.stopPropagation()">
                   <div class="flex items-center justify-center gap-2">
                     <button (click)="openEditModal(entity)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg></button>
                     <button (click)="deleteEntity(entity.id)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div *ngIf="filteredEntities.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
           <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-200">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
           </div>
           <h3 class="text-lg font-bold text-gray-800 mb-1">لم يتم العثور على جهات خارجية</h3>
           <p class="text-sm text-gray-400 font-semibold">جرب تغيير كلمات البحث أو الفلاتر</p>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div *ngIf="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm animate-fade-in" (click)="closeModal()"></div>
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-fade-in-up">
        <div class="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">{{ isEditing ? 'تعديل جهة خارجية' : 'إضافة جهة خارجية' }}</h2>
            <p class="text-sm text-gray-500 font-semibold mt-1">أدخل بيانات الجهة الخارجية الأساسية</p>
          </div>
          <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full border border-gray-100 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        
        <div class="p-8 space-y-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">اسم الجهة <span class="text-red-500">*</span></label>
            <input type="text" [(ngModel)]="entityForm.name" class="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-capmas-primary/10 focus:border-capmas-primary font-bold text-gray-800 transition-all bg-gray-50/30">
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">نوع الجهة</label>
            <select [(ngModel)]="entityForm.type" class="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-capmas-primary/10 focus:border-capmas-primary font-bold text-gray-800 transition-all bg-gray-50/30">
              <option value="جهات حكومية">جهات حكومية</option>
              <option value="مؤسسات مالية">مؤسسات مالية</option>
              <option value="هيئات رقابية">هيئات رقابية</option>
              <option value="منظمات أعمال">منظمات أعمال</option>
            </select>
          </div>

          <div class="flex gap-4 pt-4">
            <button (click)="saveEntity()" class="flex-1 bg-capmas-primary text-white font-bold py-4 rounded-2xl hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-blue-100">حفظ البيانات</button>
            <button (click)="closeModal()" class="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-95">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class ExternalEntitiesManagementComponent implements OnInit, OnDestroy {
  private adminService = inject(AdministrationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public auth = inject(AuthService);
  private sub = new Subscription();

  entities: ExternalEntity[] = [];
  administrations: Administration[] = [];
  searchTerm: string = '';
  typeFilter: string = 'all';

  isModalOpen = false;
  isEditing = false;
  selectedEntityId: string | null = null;
  entityForm = { name: '', type: 'جهات حكومية' };

  ngOnInit() {
    this.sub.add(
      this.adminService.entities$.subscribe(data => this.entities = data)
    );
    this.sub.add(
      this.adminService.administrations$.subscribe(data => this.administrations = data)
    );

    this.sub.add(
      this.route.queryParams.subscribe(params => {
        if (params['create']) {
          this.openCreateModal();
        }
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get filteredEntities() {
    return this.entities.filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.typeFilter === 'all' || e.type === this.typeFilter;
      return matchesSearch && matchesType;
    });
  }

  getLinkedAdmins(entityId: string) {
    return this.administrations.filter(a => a.linkedEntityIds.includes(entityId));
  }

  navigateToDetails(id: string) {
    const role = this.auth.currentUser()?.role;
    const base = role === 'DECISION_MAKER' ? '/decision-maker' : '/super-admin';
    this.router.navigate([`${base}/external-entities`, id]);
  }

  openCreateModal() {
    this.isEditing = false;
    this.entityForm = { name: '', type: 'جهات حكومية' };
    this.isModalOpen = true;
  }

  openEditModal(entity: ExternalEntity) {
    this.isEditing = true;
    this.selectedEntityId = entity.id;
    this.entityForm = { name: entity.name, type: entity.type };
    this.isModalOpen = true;
  }

  saveEntity() {
    if (!this.entityForm.name) return;

    if (this.isEditing && this.selectedEntityId) {
      this.adminService.updateExternalEntity(this.selectedEntityId, this.entityForm);
    } else {
      this.adminService.createExternalEntity({
        ...this.entityForm,
        status: 'on-time',
        reportsCount: 0
      });
    }
    this.closeModal();
  }

  deleteEntity(id: string) {
    if (confirm('هل أنت متأكد من حذف هذه الجهة؟')) {
      this.adminService.deleteExternalEntity(id);
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedEntityId = null;
  }
}
