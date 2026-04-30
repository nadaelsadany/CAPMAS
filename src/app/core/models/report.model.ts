export type ReportStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_VALIDATION' | 'READY_FOR_REVIEW' | 'RETURNED' | 'APPROVED';

export interface TradeReport {
  id: string;
  institutionId: string;
  type: 'INTERNAL' | 'EXTERNAL';
  subdomain: 'BANKRUPTCY' | 'PROTEST' | 'IMPORT' | 'EXPORT';
  title: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
  submittedBy?: string;
  data: any; // Dynamic based on institution configuration
}
