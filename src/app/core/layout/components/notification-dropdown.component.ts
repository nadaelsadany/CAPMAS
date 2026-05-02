import { Component, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService, AppNotification } from '../../services/notification.service';
import { AuthService } from '../../auth/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative">
      <!-- Bell Icon -->
      <button 
        (click)="toggleDropdown()"
        class="relative p-2 text-gray-500 hover:text-capmas-primary hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        <span *ngIf="(unreadCount$ | async) ?? 0 > 0" class="absolute top-1.5 right-1.5 flex h-4 w-4">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white font-bold items-center justify-center">
            {{ unreadCount$ | async }}
          </span>
        </span>
      </button>

      <!-- Dropdown Panel -->
      <div 
        *ngIf="isOpen"
        class="absolute left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200"
      >
        <!-- Header -->
        <div class="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h4 class="font-bold text-gray-800 text-sm">التنبيهات</h4>
          <button 
            (click)="markAllAsRead()" 
            class="text-[10px] font-bold text-capmas-primary hover:underline"
          >
            تحديد الكل كمقروء
          </button>
        </div>

        <!-- Notification List -->
        <div class="max-h-[400px] overflow-y-auto">
          <div *ngIf="(recentNotifications$ | async)?.length === 0" class="p-8 text-center">
            <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-300"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
            </div>
            <p class="text-xs text-gray-400 font-bold">لا توجد تنبيهات جديدة</p>
          </div>

          <div 
            *ngFor="let note of recentNotifications$ | async" 
            [class.bg-blue-50]="!note.isRead"
            class="px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group"
            (click)="onNotificationClick(note)"
          >
            <div class="flex gap-3">
              <!-- Type Icon -->
              <div [ngClass]="getCategoryStyles(note.category)" class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                <svg *ngIf="note.category === 'report'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                <svg *ngIf="note.category === 'config'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 12h7.5" /></svg>
                <svg *ngIf="note.category === 'account'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start mb-0.5">
                  <h5 class="text-xs font-bold text-gray-800 line-clamp-1">{{ note.title }}</h5>
                  <span class="text-[10px] text-gray-400 font-bold shrink-0">{{ formatTime(note.timestamp) }}</span>
                </div>
                <p class="text-[11px] text-gray-500 leading-normal line-clamp-2">{{ note.message }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <a 
          routerLink="/settings/all-notifications" 
          (click)="isOpen = false"
          class="block py-3 text-center bg-gray-50 border-t border-gray-100 text-[11px] font-bold text-gray-500 hover:text-capmas-primary hover:bg-gray-100 transition-colors"
        >
          عرض كافة التنبيهات
        </a>
      </div>
    </div>
  `
})
export class NotificationDropdownComponent {
  private noteService = inject(NotificationService);
  private auth = inject(AuthService);
  private el = inject(ElementRef);

  isOpen = false;
  unreadCount$ = this.noteService.getUnreadCount();
  recentNotifications$ = this.noteService.notifications$.pipe(
    map(notes => {
      const userId = this.auth.currentUser()?.id;
      return notes.filter(n => n.userId === userId).slice(0, 5);
    })
  );

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  markAllAsRead() {
    this.noteService.markAllAsRead();
  }

  onNotificationClick(note: AppNotification) {
    this.noteService.markAsRead(note.id);
    this.isOpen = false;
    // Logic to navigate or open modal based on note.link
  }

  getCategoryStyles(category: string) {
    switch(category) {
      case 'report': return 'bg-blue-100 text-blue-600';
      case 'config': return 'bg-purple-100 text-purple-600';
      case 'account': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  formatTime(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'الآن';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} د`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} س`;
    return date.toLocaleDateString('ar-EG');
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
