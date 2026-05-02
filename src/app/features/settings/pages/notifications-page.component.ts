import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AppNotification, NotificationCategory } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/auth/auth.service';
import { map, BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">مركز التنبيهات</h1>
          <p class="text-gray-500 font-medium">عرض وإدارة كافة الاشعارات والتحركات في المنصة.</p>
        </div>
        <button 
          (click)="markAllAsRead()"
          class="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-capmas-primary hover:text-capmas-primary transition-all shadow-sm"
        >
          تحديد الكل كمقروء
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3 mb-8">
        <button 
          *ngFor="let filter of filters" 
          (click)="setActiveFilter(filter.id)"
          [class]="activeFilter === filter.id ? 'bg-capmas-primary text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200'"
          class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Notifications List -->
      <div class="space-y-4">
        <div *ngIf="(filteredNotifications$ | async)?.length === 0" class="bg-white rounded-[2rem] p-16 text-center border border-gray-100 shadow-sm">
           <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-gray-200"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
           </div>
           <h3 class="text-xl font-bold text-gray-800 mb-2">لا توجد تنبيهات</h3>
           <p class="text-gray-400 font-medium">سيتم عرض التنبيهات المتعلقة بفلترك هنا عند ورودها.</p>
        </div>

        <div 
          *ngFor="let note of filteredNotifications$ | async" 
          [class.border-r-4]="!note.isRead"
          [class.border-capmas-primary]="!note.isRead"
          class="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col md:flex-row gap-6 items-start md:items-center group transition-all hover:shadow-md hover:border-gray-100"
        >
          <!-- Status Icon -->
          <div [ngClass]="getCategoryStyles(note.category)" class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
            <svg *ngIf="note.category === 'report'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
            <svg *ngIf="note.category === 'config'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 12h7.5" /></svg>
            <svg *ngIf="note.category === 'account'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
          </div>

          <!-- Content -->
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
              <h4 class="font-bold text-gray-800">{{ note.title }}</h4>
              <span *ngIf="!note.isRead" class="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold">جديد</span>
              <span [ngClass]="getPriorityStyles(note.priority)" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase">{{ formatPriority(note.priority) }}</span>
            </div>
            <p class="text-sm text-gray-500 leading-relaxed max-w-2xl">{{ note.message }}</p>
          </div>

          <!-- Metadata & Actions -->
          <div class="flex flex-col items-end gap-2 md:border-r border-gray-100 md:pr-6 shrink-0">
            <span class="text-xs text-gray-400 font-bold">{{ formatFullDate(note.timestamp) }}</span>
            <div class="flex gap-2">
              <button 
                *ngIf="!note.isRead"
                (click)="markAsRead(note.id)"
                class="text-[10px] font-bold text-capmas-primary hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                تحديد كمقروء
              </button>
              <button 
                *ngIf="note.link"
                class="text-[10px] font-bold text-gray-500 border border-gray-100 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                انتقال للسياق
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotificationsPageComponent implements OnInit {
  private noteService = inject(NotificationService);
  private auth = inject(AuthService);

  filters = [
    { id: 'all', label: 'الكل' },
    { id: 'unread', label: 'غير المقروءة' },
    { id: 'report', label: 'تحديثات التقارير' },
    { id: 'config', label: 'إعدادات النظام' },
    { id: 'account', label: 'الحساب والأمن' }
  ];

  activeFilter = 'all';
  private activeFilterSubject = new BehaviorSubject<string>('all');

  filteredNotifications$ = combineLatest([
    this.noteService.notifications$,
    this.activeFilterSubject
  ]).pipe(
    map(([notes, filter]) => {
      const userId = this.auth.currentUser()?.id;
      let filtered = notes.filter(n => n.userId === userId);

      if (filter === 'unread') filtered = filtered.filter(n => !n.isRead);
      else if (filter !== 'all') filtered = filtered.filter(n => n.category === filter);

      return filtered;
    })
  );

  ngOnInit() {}

  setActiveFilter(filterId: string) {
    this.activeFilter = filterId;
    this.activeFilterSubject.next(filterId);
  }

  markAsRead(id: string) {
    this.noteService.markAsRead(id);
  }

  markAllAsRead() {
    this.noteService.markAllAsRead();
  }

  getCategoryStyles(category: string) {
    switch(category) {
      case 'report': return 'bg-blue-100 text-blue-600';
      case 'config': return 'bg-purple-100 text-purple-600';
      case 'account': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  getPriorityStyles(priority: string) {
    switch(priority) {
      case 'critical': return 'bg-red-600 text-white shadow-md shadow-red-100';
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  }

  formatPriority(priority: string) {
    switch(priority) {
      case 'critical': return 'حرج';
      case 'high': return 'هام';
      case 'medium': return 'متوسط';
      default: return 'عادي';
    }
  }

  formatFullDate(timestamp: string) {
    return new Date(timestamp).toLocaleString('ar-EG', { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  }
}
