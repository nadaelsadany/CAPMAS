import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuditService {
  log(action: string, metadata: any) {
    const entry = {
      timestamp: new Date(),
      action,
      metadata,
      userId: localStorage.getItem('user_id'),
      institutionId: localStorage.getItem('tenant_id')
    };
    
    // In a real app, this would hit a secure /audit endpoint
    console.info('[AUDIT LOG]:', entry);
  }
}
