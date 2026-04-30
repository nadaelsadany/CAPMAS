import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-card" [style.border-bottom-color]="color">
      <div class="kpi-content">
        <span class="label">{{ label }}</span>
        <h2 class="value">{{ value }}</h2>
        <span class="trend" [class.up]="trendUp" [class.down]="!trendUp">
          {{ trend }}% منذ الشهر الماضي
        </span>
      </div>
      <div class="kpi-icon" [style.background-color]="color + '22'" [style.color]="color">
        <i [class]="icon"></i>
      </div>
    </div>
  `,
  styles: [`
    .kpi-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border-bottom: 4px solid transparent;
      transition: transform 0.2s;
      
      &:hover {
        transform: translateY(-5px);
      }
    }
    .label {
      color: var(--text-secondary);
      font-size: 0.875rem;
      display: block;
      margin-bottom: 0.5rem;
    }
    .value {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--capmas-blue);
    }
    .trend {
      font-size: 0.75rem;
      margin-top: 0.5rem;
      display: block;
      &.up { color: #4caf50; }
      &.down { color: #f44336; }
    }
    .kpi-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
  `]
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() icon = '';
  @Input() color = '#003366';
  @Input() trend = '0';
  @Input() trendUp = true;
}
