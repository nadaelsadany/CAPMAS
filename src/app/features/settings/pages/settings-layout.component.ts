import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService, NotificationSettings } from '../../../core/services/notification.service';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'language';

@Component({
  selector: 'app-settings-layout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-6xl mx-auto">
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">إعدادات الحساب</h1>
        <p class="text-gray-500">إدارة ملفك الشخصي، الأمان، وتفضيلات النظام.</p>
      </div>

      <!-- Tabs Header -->
      <div class="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit">
        <button 
          *ngFor="let tab of tabs" 
          (click)="activeTab = tab.id"
          [class]="activeTab === tab.id ? 'bg-capmas-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'"
          class="px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        <!-- PROFILE TAB -->
        <div *ngIf="activeTab === 'profile'" class="space-y-8">
          <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-10">
            <div class="flex flex-col md:flex-row gap-12 items-start">
              <!-- Avatar Upload -->
              <div class="flex flex-col items-center gap-4 shrink-0">
                <div class="relative group">
                  <img [src]="profileForm.avatarUrl" class="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover group-hover:opacity-75 transition-opacity">
                  <label class="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="bg-black/50 p-2 rounded-full text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" /></svg>
                    </div>
                    <input type="file" class="hidden" (change)="onFileSelected($event)">
                  </label>
                </div>
                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">JPG, PNG MAX 2MB</span>
              </div>

              <!-- Form Fields -->
              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <div class="col-span-2 md:col-span-1">
                  <label class="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">الاسم الكامل</label>
                  <input type="text" [(ngModel)]="profileForm.name" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-capmas-primary outline-none transition-all">
                </div>
                <div class="col-span-2 md:col-span-1">
                  <label class="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">البريد الإلكتروني</label>
                  <input type="email" [value]="profileForm.email" disabled class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm text-gray-400 cursor-not-allowed">
                </div>
                <div class="col-span-2">
                  <label class="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">الدور الوظيفي</label>
                  <div class="px-5 py-4 bg-blue-50 border border-blue-100 rounded-2xl text-capmas-primary text-sm font-bold w-fit">
                    {{ profileForm.roleLabel }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-12 flex justify-end">
              <button (click)="saveProfile()" class="px-10 py-4 bg-capmas-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all transform hover:-translate-y-1">
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>

        <!-- SECURITY TAB -->
        <div *ngIf="activeTab === 'security'" class="space-y-8">
          <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-10 max-w-2xl">
            <h3 class="text-xl font-bold text-gray-800 mb-8">تغيير كلمة المرور</h3>
            <div class="space-y-6">
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">كلمة المرور الحالية</label>
                <input type="password" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-capmas-primary outline-none transition-all">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">كلمة المرور الجديدة</label>
                <input type="password" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-capmas-primary outline-none transition-all">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">تأكيد كلمة المرور</label>
                <input type="password" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-capmas-primary outline-none transition-all">
              </div>
            </div>
            <div class="mt-10 flex justify-end">
              <button class="px-10 py-4 bg-capmas-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all transform hover:-translate-y-1">
                تحديث الأمان
              </button>
            </div>
          </div>
        </div>

        <!-- NOTIFICATIONS TAB -->
        <div *ngIf="activeTab === 'notifications'" class="space-y-8">
           <!-- Moving existing notification settings logic here -->
           <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-8 space-y-6">
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <h4 class="font-bold text-gray-800 text-sm">تحديثات التقارير</h4>
                  <p class="text-xs text-gray-500">تقديم، اعتماد، أو إرجاع التقارير.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" [(ngModel)]="noteSettings.emailNotifications.report" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-capmas-primary"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <h4 class="font-bold text-gray-800 text-sm">إعدادات النظام والعلاقات</h4>
                  <p class="text-xs text-gray-500">ربط جهات جديدة أو تعديل هياكل التقارير.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" [(ngModel)]="noteSettings.emailNotifications.config" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-capmas-primary"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <h4 class="font-bold text-gray-800 text-sm">أمن وتنبيهات الحساب</h4>
                  <p class="text-xs text-gray-500">تغيير كلمة المرور أو تحديثات الدخول.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" [(ngModel)]="noteSettings.emailNotifications.account" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-capmas-primary"></div>
                </label>
              </div>
            </div>
            <div class="px-8 pb-8 flex justify-end">
               <button (click)="saveNotes()" class="px-8 py-3 bg-capmas-primary text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-all">حفظ التفضيلات</button>
            </div>
          </div>
        </div>

        <!-- LANGUAGE TAB -->
        <div *ngIf="activeTab === 'language'" class="space-y-8">
          <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-10 max-w-2xl">
            <h3 class="text-xl font-bold text-gray-800 mb-8">لغة العرض</h3>
            <div class="grid grid-cols-2 gap-4">
              <button 
                (click)="setLanguage('ar')"
                [class.border-capmas-primary]="lang === 'ar'"
                [class.bg-blue-50]="lang === 'ar'"
                class="flex flex-col items-center gap-4 p-8 border-2 rounded-3xl hover:bg-gray-50 transition-all group"
              >
                <span class="text-4xl">🇪🇬</span>
                <span class="font-bold text-gray-700 group-hover:text-capmas-primary">العربية</span>
                <div *ngIf="lang === 'ar'" class="w-5 h-5 bg-capmas-primary text-white rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                </div>
              </button>
              <button 
                (click)="setLanguage('en')"
                [class.border-capmas-primary]="lang === 'en'"
                [class.bg-blue-50]="lang === 'en'"
                class="flex flex-col items-center gap-4 p-8 border-2 rounded-3xl hover:bg-gray-50 transition-all group"
              >
                <span class="text-4xl">🇺🇸</span>
                <span class="font-bold text-gray-700 group-hover:text-capmas-primary">English</span>
                <div *ngIf="lang === 'en'" class="w-5 h-5 bg-capmas-primary text-white rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                </div>
              </button>
            </div>
            <p class="mt-8 text-xs text-gray-400 text-center font-bold">تغيير اللغة سيؤدي إلى إعادة تحميل الواجهة بتنسيق RTL/LTR المتوافق.</p>
          </div>
        </div>

      </div>
    </div>
  `
})
export class SettingsLayoutComponent implements OnInit {
  private auth = inject(AuthService);
  private noteService = inject(NotificationService);

  activeTab: SettingsTab = 'profile';
  tabs: { id: SettingsTab; label: string }[] = [
    { id: 'profile', label: 'الملف الشخصي' },
    { id: 'security', label: 'الأمان' },
    { id: 'notifications', label: 'التنبيهات' },
    { id: 'language', label: 'اللغة' }
  ];

  profileForm = {
    name: '',
    email: '',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    roleLabel: ''
  };

  noteSettings!: NotificationSettings;
  lang = 'ar';

  ngOnInit() {
    const user = this.auth.currentUser();
    if (user) {
      this.profileForm.name = user.name;
      this.profileForm.email = user.email;
      this.profileForm.roleLabel = this.formatRole(user.role);
    }
    this.noteService.settings$.subscribe(s => this.noteSettings = JSON.parse(JSON.stringify(s)));
  }

  formatRole(role: string) {
    switch(role) {
      case 'SUPER_ADMIN': return 'مدير نظام عام';
      case 'ADMINISTRATION_ADMIN': return 'مدير إدارة عامة';
      case 'EXTERNAL_ENTITY_ADMIN': return 'مدير جهة خارجية';
      default: return 'موظف نظام';
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.profileForm.avatarUrl = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    alert('تم حفظ بيانات الملف الشخصي بنجاح');
  }

  saveNotes() {
    this.noteService.updateSettings(this.noteSettings);
    alert('تم تحديث تفضيلات التنبيهات');
  }

  setLanguage(l: string) {
    this.lang = l;
    // Real logic would update translate service and dir
    alert(`Language changed to: ${l === 'ar' ? 'العربية' : 'English'}`);
  }
}
