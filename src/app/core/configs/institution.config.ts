import { Injectable, signal } from '@angular/core';

export interface InstitutionConfig {
  id: string;
  name: string;
  logo: string;
  reportType: 'EXTERNAL' | 'INTERNAL';
  validationRules: string[];
}

@Injectable({ providedIn: 'root' })
export class InstitutionConfigService {
  private currentConfigSignal = signal<InstitutionConfig | null>(null);
  currentConfig = this.currentConfigSignal.asReadonly();

  // Simulated load based on tenant_id
  loadConfig(institutionId: string) {
    const mockConfigs: Record<string, InstitutionConfig> = {
      'customs': {
        id: 'customs',
        name: 'Customs Authority',
        logo: 'assets/logos/customs.png',
        reportType: 'EXTERNAL',
        validationRules: ['HS_CODE_REQUIRED', 'WEIGHT_POSITIVE']
      },
      'judiciary': {
        id: 'judiciary',
        name: 'Judiciary (Courts)',
        logo: 'assets/logos/judiciary.png',
        reportType: 'INTERNAL',
        validationRules: ['CASE_ID_REQUIRED', 'PARTY_NAMES_MATCH']
      }
    };
    
    this.currentConfigSignal.set(mockConfigs[institutionId] || null);
  }
}
