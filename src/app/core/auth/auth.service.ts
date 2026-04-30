import { Injectable, signal } from '@angular/core';

export type UserRole = 'SUPER_ADMIN' | 'ADMINISTRATION_ADMIN' | 'EXTERNAL_ENTITY_ADMIN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  sectorId?: string;
  institutionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Using Angular Signals for reactive state
  currentUser = signal<User | null>({
    id: '1',
    name: 'Admin User',
    role: 'SUPER_ADMIN' // Default mock to SUPER_ADMIN
  });

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
      role: role
    });
  }
}
