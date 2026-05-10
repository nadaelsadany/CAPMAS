import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Administration, AdministrationService } from '../../../core/services/administration.service';
import { AuthService } from '../../../core/auth/auth.service';
import { PermissionDirective } from '../../../core/auth/permission.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-administrations-management',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PermissionDirective],
  template: `
    <div class="p-8 max-w-7xl mx-auto h-full flex flex-col">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-arabic font-bold text-gray-800 mb-2">إدارة الإدارات العامة</h1>
          <p class="text-gray-500 font-semibold">متابعة ومراقبة أداء الإدارات، ربط الجهات الخارجية، وتعيين المراجعين.</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="relative">
            <input type="text" [(ngModel)]="searchTerm" placeholder="بحث باسم الإدارة..." class="pr-10 pl-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-capmas-primary outline-none text-sm font-semibold w-64 transition-all focus:w-80 bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 absolute right-3 top-3 text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          </div>
          <button *appHasRole="['SUPER_ADMIN']" routerLink="/super-admin/administrations/create" class="bg-capmas-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            إضافة إدارة
          </button>
          
          <div *appHasRole="['DECISION_MAKER']" class="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 text-xs font-bold flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
             عرض فقط
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div class="p-3 bg-blue-50 text-capmas-primary rounded-xl"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
          <div><p class="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">إجمالي الإدارات</p><p class="text-2xl font-bold text-gray-800">{{ administrations.length }}</p></div>
        </div>
      </div>

      <!-- Administrations Cards Grid -->
      <div class="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div *ngFor="let admin of filteredAdministrations" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full group relative animate-fade-in-up">
            
            <!-- Quick Actions Menu -->
            <div *appHasRole="['SUPER_ADMIN']" class="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button (click)="openEditModal(admin)" class="p-2 bg-white/95 backdrop-blur shadow-sm rounded-lg text-blue-600 hover:bg-blue-50 transition-colors border border-gray-100" title="تعديل">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
              </button>
              <button (click)="openDeleteModal(admin)" class="p-2 bg-white/95 backdrop-blur shadow-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors border border-gray-100" title="حذف">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </button>
            </div>

            <!-- Card Header -->
            <div class="p-6 border-b border-gray-50 flex items-start gap-4">
              <div class="p-3 bg-blue-50 text-capmas-primary rounded-xl shrink-0 group-hover:bg-capmas-primary group-hover:text-white transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-capmas-primary transition-colors">{{ admin.name }}</h3>
                <p class="text-xs text-gray-500 font-semibold line-clamp-2 leading-relaxed">{{ admin.description }}</p>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6 flex-1 space-y-5">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-capmas-secondary"></div>
                  <span class="text-sm font-bold text-gray-600">الجهات المرتبطة</span>
                </div>
                <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-bold">{{ admin.linkedEntityIds.length }}</span>
              </div>
              

            </div>

            <!-- Card Footer -->
            <div class="p-6 bg-gray-50/50 border-t border-gray-100 shrink-0">
              <button [routerLink]="[getDetailsLink(admin.id)]" class="w-full bg-white border border-gray-200 hover:border-capmas-primary hover:text-capmas-primary text-gray-700 font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 group/btn active:scale-95 shadow-sm">
                <span>{{ authService.currentUser()?.role === 'DECISION_MAKER' ? 'عرض التفاصيل والتقارير' : 'عرض التفاصيل والإدارة' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              </button>
            </div>
          </div>

        </div>
        
        <!-- Empty Results -->
        <div *ngIf="filteredAdministrations.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
           <div class="w-24 h-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
           </div>
           <p class="text-gray-400 font-bold text-lg">لم يتم العثور على إدارات تطابق البحث</p>
           <button (click)="searchTerm = ''" class="mt-2 text-capmas-primary font-bold hover:underline">عرض كافة الإدارات</button>
        </div>
      </div>

      <!-- Edit Modal -->
      <div *ngIf="isEditModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm animate-fade-in" (click)="closeModals()"></div>
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in-up overflow-hidden">
          <div class="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">تعديل الإدارة</h2>
              <p class="text-sm text-gray-500 font-semibold mt-1">تحديث البيانات الأساسية لـ {{ selectedAdmin?.name }}</p>
            </div>
            <button (click)="closeModals()" class="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full border border-gray-100 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div class="p-8 space-y-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">اسم الإدارة العامة <span class="text-red-500">*</span></label>
              <input type="text" [(ngModel)]="editForm.name" class="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-capmas-primary/10 focus:border-capmas-primary font-bold text-gray-800 transition-all bg-gray-50/30">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">وصف الإدارة</label>
              <textarea [(ngModel)]="editForm.description" rows="4" class="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-capmas-primary/10 focus:border-capmas-primary font-semibold text-gray-700 transition-all bg-gray-50/30" placeholder="أدخل وصفاً تفصيلياً لمهام الإدارة..."></textarea>
            </div>
            <div class="flex gap-4 pt-2">
              <button (click)="saveEdit()" class="flex-1 bg-capmas-primary text-white font-bold py-4 rounded-2xl hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-blue-100">حفظ التعديلات</button>
              <button (click)="closeModals()" class="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-95">إلغاء</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Modal -->
      <div *ngIf="isDeleteModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm animate-fade-in" (click)="closeModals()"></div>
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 animate-fade-in-up p-8 text-center">
          <div class="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-red-100/50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-12 h-12"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-3">حذف الإدارة العامة</h2>
          <p class="text-gray-500 font-semibold text-sm mb-8 leading-relaxed">
            هل أنت متأكد من حذف <span class="text-gray-800 font-bold">"{{ selectedAdmin?.name }}"</span>؟
            <br>
            <span class="text-red-500 font-bold block mt-2 text-xs">تنبيه: سيتم فصل كافة الجهات المرتبطة تلقائياً.</span>
          </p>
          <div class="flex gap-4">
            <button (click)="confirmDelete()" class="flex-1 bg-red-500 text-white font-bold py-4 rounded-2xl hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-100">تأكيد الحذف</button>
            <button (click)="closeModals()" class="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-95">إلغاء</button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #e5e7eb;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #d1d5db;
    }
  `]
})
export class AdministrationsManagementComponent implements OnInit, OnDestroy {
  
  administrations: Administration[] = [];
  searchTerm: string = '';
  private sub = new Subscription();
  
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  selectedAdmin: Administration | null = null;
  editForm = { name: '', description: '' };
  
  constructor(
    private adminService: AdministrationService,
    public authService: AuthService
  ) {}

  getDetailsLink(adminId: string) {
    const role = this.authService.currentUser()?.role;
    const base = role === 'DECISION_MAKER' ? '/decision-maker' : '/super-admin';
    return `${base}/administrations/${adminId}`;
  }

  ngOnInit() {
    this.sub.add(this.adminService.administrations$.subscribe(data => {
      this.administrations = data;
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get filteredAdministrations() {
    return this.administrations.filter(a => 
      a.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      a.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openEditModal(admin: Administration) {
    this.selectedAdmin = admin;
    this.editForm = { name: admin.name, description: admin.description };
    this.isEditModalOpen = true;
  }

  saveEdit() {
    if (this.selectedAdmin) {
      this.adminService.updateAdministration(this.selectedAdmin.id, this.editForm);
      this.closeModals();
    }
  }

  openDeleteModal(admin: Administration) {
    this.selectedAdmin = admin;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.selectedAdmin) {
      this.adminService.deleteAdministration(this.selectedAdmin.id);
      this.closeModals();
    }
  }

  closeModals() {
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
    this.selectedAdmin = null;
  }
}
