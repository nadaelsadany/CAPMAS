import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { NotificationService } from './notification.service';

export interface Administration {
  id: string;
  name: string;
  description: string;
  linkedEntityIds: string[];
}

export interface ExternalEntity {
  id: string;
  name: string;
  type: string;
  status: 'on-time' | 'delayed';
  reportsCount: number;
}

export interface Reviewer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended';
  lastLogin: string;
  lastActivity: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMINISTRATION_ADMIN' | 'EXTERNAL_ENTITY_ADMIN' | 'ADMINISTRATION_REVIEWER';
  assignedAdminIds?: string[]; // Multiple for ADMINISTRATION_ADMIN or ADMINISTRATION_REVIEWER
  assignedEntityId?: string;   // Single for EXTERNAL_ENTITY_ADMIN
  joinDate: string;
  status: 'active' | 'suspended';
  password?: string;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  adminId: string;
  adminName?: string;
  entityId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  dueDate: string;
  gracePeriod: number;
  inputMethod: 'form' | 'excel' | 'both';
  status: 'منتظم' | 'متأخر';
  dynamicFields: any[];
}

export interface ReportSubmission {
  id: string;
  reportId: string;
  reportName: string;
  entityId: string;
  adminId: string;
  submittedAt: string;
  status: 'approved' | 'under_review' | 'returned';
  returnReason?: string;
  returnedAt?: string;
  delayDays: number;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  private noteService = inject(NotificationService);

  private STORAGE_KEY = 'capmas_admin_data';

  private initialReports: Report[] = [
    { 
      id: 'rep-1', name: 'بيان الواردات اليومي', description: 'بيان تفصيلي بالواردات اليومية عبر المنافذ',
      adminId: 'it-dept', adminName: 'إدارة تقنية المعلومات', entityId: 'customs', 
      frequency: 'daily', dueDate: '09:00 ص', gracePeriod: 0, inputMethod: 'both', status: 'منتظم',
      dynamicFields: [{ name: 'إجمالي القيمة', type: 'number', required: true }]
    },
    { 
      id: 'rep-2', name: 'تقرير حركة الحاويات الشهري', description: 'إحصاءات شهرية لحركة الحاويات',
      adminId: 'it-dept', adminName: 'إدارة تقنية المعلومات', entityId: 'customs', 
      frequency: 'monthly', dueDate: '5 من الشهر', gracePeriod: 2, inputMethod: 'excel', status: 'متأخر',
      dynamicFields: []
    },
    { 
      id: 'rep-3', name: 'إحصاءات العمالة الربع سنوية', description: 'بيانات العمالة والأجور والتدريب',
      adminId: 'hr-dept', adminName: 'إدارة الموارد البشرية', entityId: 'customs', 
      frequency: 'quarterly', dueDate: '15 من الشهر', gracePeriod: 5, inputMethod: 'form', status: 'منتظم',
      dynamicFields: [
        { name: 'عدد الموظفين الجدد', type: 'number', required: true },
        { name: 'إجمالي ساعات التدريب', type: 'number', required: false }
      ]
    }
  ];

  private initialSubmissions: ReportSubmission[] = [
    {
      id: 'sub-1', reportId: 'rep-1', reportName: 'بيان الواردات اليومي', entityId: 'customs', adminId: 'it-dept',
      submittedAt: new Date(Date.now() - 86400000).toISOString(), status: 'approved', delayDays: 0, data: {}
    },
    {
      id: 'sub-2', reportId: 'rep-2', reportName: 'تقرير حركة الحاويات الشهري', entityId: 'customs', adminId: 'it-dept',
      submittedAt: new Date(Date.now() - 172800000).toISOString(), status: 'returned', 
      returnReason: 'يوجد تضارب في أرقام الحاويات الفارغة بالجدول الثالث.', returnedAt: new Date(Date.now() - 43200000).toISOString(),
      delayDays: 2, data: {}
    }
  ];

  private initialAdministrations: Administration[] = [
    { id: 'it-dept', name: 'إدارة تقنية المعلومات', description: 'مسؤولة عن البنية التحتية والأنظمة الرقمية', linkedEntityIds: ['customs', 'central-bank'] },
    { id: 'stats-dept', name: 'إدارة الإحصاءات الاقتصادية', description: 'تحليل المؤشرات المالية والتجارية', linkedEntityIds: ['tax-authority', 'customs'] },
    { id: 'hr-dept', name: 'إدارة الموارد البشرية', description: 'شؤون العاملين والتدريب', linkedEntityIds: ['customs'] }
  ];

  private initialEntities: ExternalEntity[] = [
    { id: 'customs', name: 'مصلحة الجمارك المصرية', type: 'جهات حكومية', status: 'on-time', reportsCount: 12 },
    { id: 'central-bank', name: 'البنك المركزي المصري', type: 'مؤسسات مالية', status: 'on-time', reportsCount: 8 },
    { id: 'tax-authority', name: 'مصلحة الضرائب المصرية', type: 'جهات حكومية', status: 'delayed', reportsCount: 15 },
    { id: 'fra', name: 'الهيئة العامة للرقابة المالية', type: 'هيئات رقابية', status: 'on-time', reportsCount: 5 },
    { id: 'chamber-commerce', name: 'اتحاد الغرف التجارية', type: 'منظمات أعمال', status: 'on-time', reportsCount: 20 }
  ];

  private administrationsSubject = new BehaviorSubject<Administration[]>([]);
  private entitiesSubject = new BehaviorSubject<ExternalEntity[]>([]);
  private reportsSubject = new BehaviorSubject<Report[]>([]);
  private submissionsSubject = new BehaviorSubject<ReportSubmission[]>([]);
  private usersSubject = new BehaviorSubject<SystemUser[]>([]);

  administrations$ = this.administrationsSubject.asObservable();
  entities$ = this.entitiesSubject.asObservable();
  reports$ = this.reportsSubject.asObservable();
  submissions$ = this.submissionsSubject.asObservable();
  users$ = this.usersSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        const { administrations, entities, reports, submissions, users } = JSON.parse(storedData);
        this.administrationsSubject.next(administrations || this.initialAdministrations);
        this.entitiesSubject.next(entities || this.initialEntities);
        this.reportsSubject.next(reports || this.initialReports);
        this.submissionsSubject.next(submissions || this.initialSubmissions);
        this.usersSubject.next(users || this.getInitialUsers());
      } else {
        this.administrationsSubject.next(this.initialAdministrations);
        this.entitiesSubject.next(this.initialEntities);
        this.reportsSubject.next(this.initialReports);
        this.submissionsSubject.next(this.initialSubmissions);
        this.usersSubject.next(this.getInitialUsers());
        this.saveToStorage();
      }
    } catch (e) {
      this.administrationsSubject.next(this.initialAdministrations);
      this.entitiesSubject.next(this.initialEntities);
    }
  }

  private saveToStorage() {
    try {
      const data = {
        administrations: this.administrationsSubject.value,
        entities: this.entitiesSubject.value,
        reports: this.reportsSubject.value,
        submissions: this.submissionsSubject.value,
        users: this.usersSubject.value
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  private getInitialUsers(): SystemUser[] {
    return [
      { id: '1', name: 'م. أحمد محمود', email: 'admin@capmas.gov.eg', role: 'SUPER_ADMIN', joinDate: '2024/10/26', status: 'active' },
      { id: '2', name: 'أ. سارة علي', email: 's.ali@capmas.gov.eg', role: 'ADMINISTRATION_ADMIN', assignedAdminIds: ['it-dept'], joinDate: '2024/10/26', status: 'active' },
      { id: '3', name: 'أ. خالد حسن', email: 'k.hassan@customs.gov.eg', role: 'EXTERNAL_ENTITY_ADMIN', assignedEntityId: 'customs', joinDate: '2024/10/26', status: 'active' },
      { id: '4', name: 'د. منى حسن', email: 'm.hassan@capmas.gov.eg', role: 'ADMINISTRATION_REVIEWER', assignedAdminIds: ['it-dept'], joinDate: '2024/11/01', status: 'active' },
      { id: '5', name: 'أ. يوسف محمد', email: 'y.mohamed@tax.gov.eg', role: 'EXTERNAL_ENTITY_ADMIN', assignedEntityId: 'tax-authority', joinDate: '2024/11/05', status: 'active' },
      { id: '6', name: 'أ. ليلى إبراهيم', email: 'l.ibrahim@capmas.gov.eg', role: 'ADMINISTRATION_ADMIN', assignedAdminIds: ['hr-dept'], joinDate: '2024/11/10', status: 'suspended' }
    ];
  }

  getAdministrationsSync(): Administration[] {
    return this.administrationsSubject.value;
  }

  getAdministrations() {
    return this.administrationsSubject.value;
  }

  getAdministration(id: string) {
    return this.administrationsSubject.value.find(a => a.id === id);
  }

  createAdministration(admin: Omit<Administration, 'id' | 'linkedEntityIds'>) {
    const newAdmin: Administration = {
      ...admin,
      id: Math.random().toString(36).substr(2, 9),
      linkedEntityIds: []
    };
    const current = this.administrationsSubject.value;
    this.administrationsSubject.next([...current, newAdmin]);
    this.saveToStorage();
    return newAdmin;
  }

  updateAdministration(id: string, data: Partial<Administration>) {
    const current = this.administrationsSubject.value;
    const index = current.findIndex(a => a.id === id);
    if (index > -1) {
      current[index] = { ...current[index], ...data };
      this.administrationsSubject.next([...current]);
      this.saveToStorage();
    }
  }

  deleteAdministration(id: string) {
    const current = this.administrationsSubject.value;
    this.administrationsSubject.next(current.filter(a => a.id !== id));
    this.saveToStorage();
  }

  getExternalEntitiesSync(): ExternalEntity[] {
    return this.entitiesSubject.value;
  }

  getEntities() {
    return this.entitiesSubject.value;
  }

  getExternalEntity(id: string) {
    return this.entitiesSubject.value.find(e => e.id === id);
  }

  createExternalEntity(entity: Omit<ExternalEntity, 'id'>) {
    const newEntity: ExternalEntity = {
      ...entity,
      id: 'entity-' + Math.random().toString(36).substr(2, 9)
    };
    const current = this.entitiesSubject.value;
    this.entitiesSubject.next([...current, newEntity]);
    this.saveToStorage();
    return newEntity;
  }

  updateExternalEntity(id: string, data: Partial<ExternalEntity>) {
    const current = this.entitiesSubject.value;
    const index = current.findIndex(e => e.id === id);
    if (index > -1) {
      current[index] = { ...current[index], ...data };
      this.entitiesSubject.next([...current]);
      this.saveToStorage();
    }
  }

  deleteExternalEntity(id: string) {
    const current = this.entitiesSubject.value;
    this.entitiesSubject.next(current.filter(e => e.id !== id));
    
    // Also remove from administrations
    const admins = this.administrationsSubject.value;
    admins.forEach(admin => {
      admin.linkedEntityIds = admin.linkedEntityIds.filter(eid => eid !== id);
    });
    this.administrationsSubject.next([...admins]);
    
    this.saveToStorage();
  }

  getLinkedEntities(adminId: string) {
    const admin = this.getAdministration(adminId);
    if (!admin) return [];
    return this.entitiesSubject.value.filter(e => admin.linkedEntityIds.includes(e.id));
  }

  getAvailableEntities(adminId: string) {
    const admin = this.getAdministration(adminId);
    if (!admin) return this.entitiesSubject.value;
    return this.entitiesSubject.value.filter(e => !admin.linkedEntityIds.includes(e.id));
  }

  getUnlinkedEntities() {
    const allLinkedIds = this.administrationsSubject.value.flatMap(a => a.linkedEntityIds);
    return this.entitiesSubject.value.filter(e => !allLinkedIds.includes(e.id));
  }

  linkEntities(adminId: string, entityIds: string[]) {
    const admins = this.administrationsSubject.value;
    const index = admins.findIndex(a => a.id === adminId);
    if (index > -1) {
      admins[index].linkedEntityIds = [...new Set([...admins[index].linkedEntityIds, ...entityIds])];
      this.administrationsSubject.next([...admins]);
      this.saveToStorage();

      // Trigger Notification
      this.noteService.addNotification({
        userId: '1', // Super Admin
        type: 'entity_linked',
        category: 'config',
        title: 'تم ربط جهات جديدة',
        message: `تم ربط ${entityIds.length} جهة/جهات بالإدارة: ${admins[index].name}`,
        priority: 'medium'
      });
    }
  }

  unlinkEntity(adminId: string, entityId: string) {
    const admins = this.administrationsSubject.value;
    const index = admins.findIndex(a => a.id === adminId);
    if (index > -1) {
      admins[index].linkedEntityIds = admins[index].linkedEntityIds.filter(id => id !== entityId);
      this.administrationsSubject.next([...admins]);
      this.saveToStorage();
    }
  }

  // Report Methods
  getReportsByEntity(entityId: string) {
    return this.reportsSubject.value.filter(r => r.entityId === entityId);
  }

  getReport(id: string) {
    return this.reportsSubject.value.find(r => r.id === id);
  }

  saveReport(report: Report) {
    const current = this.reportsSubject.value;
    const index = current.findIndex(r => r.id === report.id);
    
    // Add admin name for display
    const admin = this.getAdministration(report.adminId);
    if (admin) report.adminName = admin.name;

    if (index > -1) {
      current[index] = { ...report };
    } else {
      current.push({ ...report, id: report.id || 'rep-' + Math.random().toString(36).substr(2, 9) });
    }
    
    this.reportsSubject.next([...current]);
    this.saveToStorage();

    // Trigger Notification
    this.noteService.addNotification({
      userId: '1', // Super Admin or Administration Admin
      type: 'report_submitted',
      category: 'report',
      title: 'تم حفظ/تحديث تقرير',
      message: `تم إجراء تغييرات على تقرير: ${report.name}`,
      priority: 'medium',
      link: `/super-admin/administrations/${report.adminId}`
    });
  }

  deleteReport(id: string) {
    const current = this.reportsSubject.value;
    this.reportsSubject.next(current.filter(r => r.id !== id));
    this.saveToStorage();
  }

  // User Methods
  getUsers() {
    return this.usersSubject.value;
  }

  createUser(user: Omit<SystemUser, 'id' | 'joinDate' | 'status'>) {
    const newUser: SystemUser = {
      ...user,
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      joinDate: new Date().toLocaleDateString('ar-EG'),
      status: 'active'
    };
    const current = this.usersSubject.value;
    this.usersSubject.next([...current, newUser]);
    this.saveToStorage();

    // Trigger Notification for the new user
    this.noteService.addNotification({
      userId: newUser.id,
      type: 'account_created',
      category: 'account',
      title: 'تم إنشاء حسابك بنجاح',
      message: `مرحباً ${newUser.name}، تم تفعيل حسابك بصلاحيات ${newUser.role}.`,
      priority: 'high'
    });

    return newUser;
  }

  updateUser(id: string, data: Partial<SystemUser>) {
    const current = this.usersSubject.value;
    const index = current.findIndex(u => u.id === id);
    if (index > -1) {
      current[index] = { ...current[index], ...data };
      this.usersSubject.next([...current]);
      this.saveToStorage();
    }
  }

  deleteUser(id: string) {
    const current = this.usersSubject.value;
    this.usersSubject.next(current.filter(u => u.id !== id));
    this.saveToStorage();
  }

  // Submission Methods
  getSubmissionsByEntity(entityId: string) {
    return this.submissionsSubject.value.filter(s => s.entityId === entityId);
  }

  getSubmissionsByAdmin(entityId: string, adminId: string) {
    return this.submissionsSubject.value.filter(s => s.entityId === entityId && s.adminId === adminId);
  }

  getReturnedSubmissions(entityId: string, adminId: string) {
    return this.submissionsSubject.value.filter(s => s.entityId === entityId && s.adminId === adminId && s.status === 'returned');
  }

  submitReport(submission: Omit<ReportSubmission, 'id' | 'submittedAt'>) {
    const newSubmission: ReportSubmission = {
      ...submission,
      id: 'sub-' + Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString()
    };
    const current = this.submissionsSubject.value;
    this.submissionsSubject.next([...current, newSubmission]);
    this.saveToStorage();
    return newSubmission;
  }
}
