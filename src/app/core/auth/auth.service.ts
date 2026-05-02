import { Injectable, signal } from '@angular/core';

export type UserRole = 'SUPER_ADMIN' | 'ADMINISTRATION_ADMIN' | 'ADMINISTRATION_REVIEWER' | 'EXTERNAL_ENTITY_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sectorId?: string;
  institutionId?: string;
  administrationIds?: string[]; // Multiple administrations for admin/reviewer roles
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Using Angular Signals for reactive state
  currentUser = signal<User | null>({
    id: '1',
    name: 'Admin User',
    email: 'admin@capmas.gov.eg',
    role: 'SUPER_ADMIN'
  });

  activeAdministrationId = signal<string | null>(null);

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(allowedRoles: UserRole[]): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return allowedRoles.includes(user.role);
  }

  loginAs(role: UserRole) {
    this.currentUser.set({
      id: 'test',
      name: `Test ${role}`,
      email: `${role.toLowerCase()}@capmas.gov.eg`,
      role: role,
      administrationIds: role === 'ADMINISTRATION_ADMIN' || role === 'ADMINISTRATION_REVIEWER' ? ['it-dept', 'stats-dept'] : []
    });
  }
}
