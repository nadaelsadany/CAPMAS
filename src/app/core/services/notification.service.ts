import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export type NotificationType = 
  | 'report_submitted' | 'report_approved' | 'report_returned' | 'report_deadline' | 'report_overdue' | 'excel_failed'
  | 'entity_linked' | 'new_report_assigned' | 'report_updated' | 'rules_changed'
  | 'account_created' | 'password_reset' | 'account_suspended' | 'reviewer_assigned';

export type NotificationCategory = 'report' | 'config' | 'account';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface NotificationSettings {
  emailNotifications: {
    report: boolean;
    config: boolean;
    account: boolean;
  };
  deadlineReminderDays: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private STORAGE_KEY = 'capmas_notifications';
  private SETTINGS_KEY = 'capmas_notification_settings';
  
  private auth = inject(AuthService);
  
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private settingsSubject = new BehaviorSubject<NotificationSettings>({
    emailNotifications: {
      report: true,
      config: true,
      account: true
    },
    deadlineReminderDays: 2
  });
  settings$ = this.settingsSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.notificationsSubject.next(JSON.parse(stored));
    } else {
      // Mock initial notifications for demo
      this.notificationsSubject.next(this.getMockNotifications());
      this.saveToStorage();
    }

    const storedSettings = localStorage.getItem(this.SETTINGS_KEY);
    if (storedSettings) {
      this.settingsSubject.next(JSON.parse(storedSettings));
    }
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notificationsSubject.value));
  }

  private saveSettingsToStorage() {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settingsSubject.value));
  }

  getUnreadCount() {
    const userId = this.auth.currentUser()?.id;
    return this.notificationsSubject.pipe(
      map(notes => notes.filter(n => n.userId === userId && !n.isRead).length)
    );
  }

  addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) {
    const newNote: AppNotification = {
      ...notification,
      id: 'note-' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([newNote, ...current]);
    this.saveToStorage();

    // Trigger simulation of email if setting is enabled
    if (this.settingsSubject.value.emailNotifications[notification.category]) {
      console.log(`[EMAIL SENT] to user ${notification.userId}: ${notification.title}`);
    }
  }

  markAsRead(id: string) {
    const current = this.notificationsSubject.value;
    const index = current.findIndex(n => n.id === id);
    if (index > -1) {
      current[index].isRead = true;
      this.notificationsSubject.next([...current]);
      this.saveToStorage();
    }
  }

  markAllAsRead() {
    const userId = this.auth.currentUser()?.id;
    const current = this.notificationsSubject.value.map(n => {
      if (n.userId === userId) return { ...n, isRead: true };
      return n;
    });
    this.notificationsSubject.next(current);
    this.saveToStorage();
  }

  updateSettings(settings: NotificationSettings) {
    this.settingsSubject.next(settings);
    this.saveSettingsToStorage();
  }

  private getMockNotifications(): AppNotification[] {
    // We don't have user IDs fixed yet for all roles, so we use placeholder IDs
    // but in a real app these would be real user IDs.
    return [
      {
        id: '1', userId: '1', type: 'report_submitted', category: 'report',
        title: 'تم تقديم تقرير جديد', message: 'قامت مصلحة الجمارك بتقديم بيان الواردات اليومي.',
        timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: false, priority: 'medium',
        link: '/super-admin/administrations/it-dept'
      },
      {
        id: '2', userId: '1', type: 'report_overdue', category: 'report',
        title: 'تأخر في تسليم تقرير', message: 'تجاوز تقرير حركة الحاويات موعد التسليم المحدد.',
        timestamp: new Date(Date.now() - 86400000).toISOString(), isRead: false, priority: 'critical',
        link: '/super-admin/administrations/it-dept'
      },
      {
        id: '3', userId: '1', type: 'account_created', category: 'account',
        title: 'ترحيب بالمستخدم الجديد', message: 'مرحباً بك في منصة تبادل البيانات CAPMAS.',
        timestamp: new Date(Date.now() - 172800000).toISOString(), isRead: true, priority: 'low'
      }
    ];
  }
}
