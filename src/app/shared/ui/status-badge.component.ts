import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportStatus } from '../../core/models/report.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="status.toLowerCase()">
      {{ getLabel() }}
    </span>
  `,
  styles: [`
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .draft { background: #e0e0e0; color: #616161; }
    .submitted { background: #e3f2fd; color: #1976d2; }
    .ready_for_review { background: #fff3e0; color: #f57c00; }
    .approved { background: #e8f5e9; color: #388e3c; }
    .returned { background: #ffebee; color: #d32f2f; }
  `]
})
export class StatusBadgeComponent {
  @Input() status: ReportStatus = 'DRAFT';

  getLabel(): string {
    const labels: Record<ReportStatus, string> = {
      'DRAFT': 'مسودة',
      'SUBMITTED': 'تم التقديم',
      'UNDER_VALIDATION': 'قيد التحقق',
      'READY_FOR_REVIEW': 'جاهز للمراجعة',
      'RETURNED': 'بحاجة لتصحيح',
      'APPROVED': 'تمت الموافقة'
    };
    return labels[this.status] || this.status;
  }
}
