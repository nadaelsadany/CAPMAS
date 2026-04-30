import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../../shared/ui/status-badge.component';

@Component({
  selector: 'app-institution-dashboard',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="dashboard-container">
      <header class="page-header">
        <div class="title-section">
          <h1>لوحة أعمال مصلحة الجمارك</h1>
          <p class="subtitle">إدارة وتقديم تقارير التجارة الخارجية</p>
        </div>
        <button class="button-primary">+ تقديم تقرير جديد</button>
      </header>

      <div class="stats-mini">
        <div class="stat-box"><span>قيد المعالجة:</span> <strong>5</strong></div>
        <div class="stat-box"><span>بحاجة لتصحيح:</span> <strong style="color: red">2</strong></div>
        <div class="stat-box"><span>بانتظار الإرسال:</span> <strong>1</strong></div>
      </div>

      <div class="table-card">
        <div class="card-header">
           <h3>أحدث التقارير</h3>
           <div class="filters">كل التواريخ | كل الحالات</div>
        </div>
        
        <table class="data-table">
          <thead>
            <tr>
              <th>رقم التقرير</th>
              <th>النوع</th>
              <th>تاريخ الإنشاء</th>
              <th>المُحرر</th>
              <th>الحالة</th>
              <th>اجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#EXT-2024-001</td>
              <td>تجارة إلكترونية</td>
              <td>2024-04-20</td>
              <td>أحمد علي</td>
              <td><app-status-badge status="APPROVED"></app-status-badge></td>
              <td><button class="text-btn">عرض</button></td>
            </tr>
            <tr>
              <td>#EXT-2024-002</td>
              <td>واردات زراعية</td>
              <td>2024-04-22</td>
              <td>سارة محمود</td>
              <td><app-status-badge status="READY_FOR_REVIEW"></app-status-badge></td>
              <td><button class="text-btn">إرسال</button></td>
            </tr>
            <tr>
              <td>#EXT-2024-003</td>
              <td>صادرات صناعية</td>
              <td>2024-04-25</td>
              <td>أحمد علي</td>
              <td><app-status-badge status="RETURNED"></app-status-badge></td>
              <td><button class="text-btn">تعديل</button></td>
            </tr>
             <tr>
              <td>#EXT-2024-004</td>
              <td>واردات خام</td>
              <td>2024-04-26</td>
              <td>محمد عادل</td>
              <td><app-status-badge status="DRAFT"></app-status-badge></td>
              <td><button class="text-btn">تعديل</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; }
    .page-header h1 { font-size: 1.5rem; color: var(--capmas-blue); margin-bottom: 0.25rem; }
    .subtitle { color: var(--text-secondary); font-size: 0.9rem; }
    
    .stats-mini { display: flex; gap: 2rem; background: #eaedf0; padding: 1rem 1.5rem; border-radius: 8px; }
    .stat-box { font-size: 0.9rem; color: var(--text-secondary); strong { color: var(--capmas-blue); margin-right: 0.5rem; font-size: 1.1rem; } }

    .table-card { background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); overflow: hidden; }
    .card-header { padding: 1.5rem; border-bottom: 1px solid #f1f3f5; display: flex; justify-content: space-between; align-items: center; }
    
    .data-table { width: 100%; border-collapse: collapse; 
      th, td { padding: 1.25rem 1.5rem; text-align: right; border-bottom: 1px solid #f8f9fa; }
      th { background: #fafafa; color: var(--text-secondary); font-weight: 600; font-size: 0.85rem; }
      td { font-size: 0.9rem; }
      tr:hover { background: #fcfcfc; }
    }
    
    .text-btn { background: none; border: none; color: var(--capmas-blue); cursor: pointer; font-weight: 600; font-family: inherit; }
  `]
})
export class InstitutionDashboardComponent {}
