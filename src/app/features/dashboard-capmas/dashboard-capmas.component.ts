import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent } from '../../shared/ui/kpi-card.component';

@Component({
  selector: 'app-capmas-dashboard',
  standalone: true,
  imports: [CommonModule, KpiCardComponent],
  template: `
    <div class="dashboard-container">
      <header class="page-header">
        <h1>لوحة متابعة التجارة المركزية (CAPMAS)</h1>
        <p class="subtitle">نظرة عامة على البيانات الإحصائية والتقارير من جميع المؤسسات</p>
      </header>

      <div class="kpi-grid">
        <app-kpi-card label="إجمالي التقارير" value="1,248" icon="📈" color="#1976d2" trend="12" [trendUp]="true"></app-kpi-card>
        <app-kpi-card label="في انتظار المراجعة" value="84" icon="⏳" color="#f57c00" trend="5" [trendUp]="false"></app-kpi-card>
        <app-kpi-card label="تقارير الشهر الحالي" value="312" icon="📋" color="#388e3c" trend="8" [trendUp]="true"></app-kpi-card>
        <app-kpi-card label="تنبيهات جودة البيانات" value="7" icon="⚠️" color="#d32f2f" trend="2" [trendUp]="false"></app-kpi-card>
      </div>

      <div class="section-grid">
        <div class="chart-placeholder card">
          <div class="card-header">
            <h3>اتجاهات التجارة السنوية</h3>
            <div class="controls">سنوي | شهري | يومي</div>
          </div>
          <div class="visual">
             <!-- Simplified Visual placeholder -->
             <div class="bar-chart">
               <div class="bar" style="height: 60%"></div>
               <div class="bar" style="height: 80%"></div>
               <div class="bar" style="height: 45%"></div>
               <div class="bar" style="height: 90%"></div>
               <div class="bar" style="height: 65%"></div>
               <div class="bar" style="height: 75%"></div>
             </div>
          </div>
        </div>

        <div class="recent-activity card">
           <div class="card-header">
            <h3>نشاط المراجعة الأخير</h3>
          </div>
          <ul class="activity-list">
             <li>
               <div class="dot green"></div>
               <div class="text">تمت الموافقة على تقرير الصادرات (مصلحة الجمارك)</div>
               <div class="time">منذ 10 دقائق</div>
             </li>
             <li>
               <div class="dot orange"></div>
               <div class="text">تحققت المنصة تلقائياً من تقرير الكهرباء</div>
               <div class="time">منذ 35 دقيقة</div>
             </li>
             <li>
               <div class="dot red"></div>
               <div class="text">تم إرجاع تقرير الفوارق لوزارة البترول</div>
               <div class="time">منذ ساعتين</div>
             </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; flex-direction: column; gap: 2rem; }
    .page-header h1 { font-size: 1.75rem; color: var(--capmas-blue); margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-secondary); }
    
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
    
    .section-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
    
    .card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #f1f3f5; padding-bottom: 1rem; }
    
    .bar-chart { display: flex; align-items: flex-end; justify-content: space-around; height: 180px; padding-top: 1rem; }
    .bar { width: 40px; background: linear-gradient(to top, var(--capmas-blue), #1976d2); border-radius: 4px 4px 0 0; transition: 0.3s ease; &:hover { opacity: 0.8; }}
    
    .activity-list { list-style: none; padding: 0; 
      li { display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #f8f9fa; }
      .dot { width: 10px; height: 10px; border-radius: 50%; }
      .green { background: #4caf50; }
      .orange { background: #ff9800; }
      .red { background: #f44336; }
      .text { flex: 1; font-size: 0.875rem; }
      .time { font-size: 0.75rem; color: #999; }
    }
  `]
})
export class CapmasDashboardComponent {}
