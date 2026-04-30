import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';

interface ExternalEntity {
  id: string;
  name: string;
  type: string;
}

@Component({
  selector: 'app-create-administration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxEchartsModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto h-full flex flex-col">
      
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <div class="flex items-center gap-2 text-gray-500 mb-2">
            <a routerLink="/super-admin/administrations" class="hover:text-capmas-primary transition-colors font-semibold">إدارة الإدارات العامة</a>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            <span class="text-gray-800 font-bold">إنشاء إدارة جديدة</span>
          </div>
          <h1 class="text-3xl font-arabic font-bold text-gray-800">إنشاء إدارة عامة جديدة</h1>
        </div>
        
        <div class="flex gap-4">
          <button routerLink="/super-admin/administrations" class="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg shadow-sm font-semibold hover:bg-gray-50 transition-colors">إلغاء</button>
          <button [disabled]="!isValid()" (click)="save()" class="bg-capmas-primary text-white px-6 py-2.5 rounded-lg shadow-sm font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            حفظ وإنشاء الإدارة
          </button>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        
        <!-- Right Column: Form (Name, Desc, Selection) -->
        <div class="w-full lg:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
          
          <!-- Basic Info -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 shrink-0">
            <h2 class="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">البيانات الأساسية</h2>
            
            <div class="mb-5">
              <label class="block text-sm font-bold text-gray-700 mb-2">اسم الإدارة العامة <span class="text-red-500">*</span></label>
              <input type="text" [(ngModel)]="adminName" (ngModelChange)="updateGraph()" placeholder="مثال: الإدارة المركزية للإحصاء" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-capmas-primary focus:border-transparent text-sm">
            </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">وصف الإدارة <span class="text-red-500">*</span></label>
              <textarea [(ngModel)]="adminDesc" placeholder="نبذة عن دور الإدارة ومسؤولياتها..." rows="3" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-capmas-primary focus:border-transparent text-sm"></textarea>
            </div>
          </div>

          <!-- Multi-Select Entities -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-[400px]">
            <h2 class="text-lg font-bold text-gray-800 mb-2">الجهات الخارجية المرتبطة</h2>
            <p class="text-xs text-gray-500 mb-4 font-semibold">يرجى تحديد الجهات التي ستتفاعل مع هذه الإدارة</p>
            
            <div class="relative mb-4 shrink-0">
              <input type="text" [(ngModel)]="searchQuery" placeholder="بحث باسم الجهة أو نوعها..." class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-capmas-primary text-sm bg-gray-50">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              </div>
            </div>

            <!-- Entities List -->
            <div class="flex-1 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-100">
              <div *ngFor="let entity of filteredEntities()" 
                   (click)="toggleEntity(entity)"
                   class="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                   [class.bg-blue-50]="isSelected(entity)">
                <div class="w-5 h-5 rounded border flex items-center justify-center shrink-0" 
                     [class.bg-capmas-primary]="isSelected(entity)" 
                     [class.border-capmas-primary]="isSelected(entity)"
                     [class.border-gray-300]="!isSelected(entity)">
                  <svg *ngIf="isSelected(entity)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-white"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-800">{{ entity.name }}</p>
                  <p class="text-xs text-gray-500 font-semibold">{{ entity.type }}</p>
                </div>
              </div>
              <div *ngIf="filteredEntities().length === 0" class="p-6 text-center text-gray-500 text-sm font-semibold">
                لا توجد جهات مطابقة للبحث.
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100 shrink-0">
               <p class="text-sm font-bold text-gray-700">تم اختيار: <span class="text-capmas-primary">{{ selectedEntities.length }}</span> جهة</p>
               <p *ngIf="selectedEntities.length === 0" class="text-xs text-red-500 font-bold mt-1">يجب اختيار جهة واحدة على الأقل</p>
            </div>
          </div>

        </div>
        
        <!-- Left Column: Graph View -->
        <div class="w-full lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
          <div class="flex justify-between items-center mb-4 shrink-0">
            <div>
              <h2 class="text-lg font-bold text-gray-800">العرض البصري (Graph View)</h2>
              <p class="text-xs text-gray-500 font-semibold">توضيح شكل العلاقات الخاصة بالإدارة الجديدة</p>
            </div>
            <div class="flex gap-4">
              <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-[#1e3a8a]"></span><span class="text-xs font-bold text-gray-600">الإدارة</span></div>
              <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-[#C89637]"></span><span class="text-xs font-bold text-gray-600">جهة خارجية</span></div>
            </div>
          </div>

          <div class="flex-1 bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden flex items-center justify-center">
            <!-- Echarts Graph -->
            <div *ngIf="selectedEntities.length > 0 || adminName; else emptyState" echarts [options]="chartOptions" class="w-full h-full"></div>
            
            <!-- Empty State -->
            <ng-template #emptyState>
              <div class="flex flex-col items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mb-4 opacity-50"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" /></svg>
                <p class="font-bold">أدخل اسم الإدارة واختر الجهات لتوليد الرسم البياني</p>
              </div>
            </ng-template>
          </div>
        </div>

      </div>
    </div>
  `
})
export class CreateAdministrationComponent implements OnInit {
  adminName = '';
  adminDesc = '';
  searchQuery = '';
  
  availableEntities: ExternalEntity[] = [
    { id: '1', name: 'هيئة الجمارك المصرية', type: 'هيئة حكومية' },
    { id: '2', name: 'البنك المركزي المصري', type: 'قطاع مصرفي' },
    { id: '3', name: 'وزارة التخطيط والتنمية الاقتصادية', type: 'وزارة' },
    { id: '4', name: 'وزارة التجارة والصناعة', type: 'وزارة' },
    { id: '5', name: 'هيئة الرقابة على الصادرات والواردات', type: 'هيئة رقابية' },
    { id: '6', name: 'جهاز التعبئة العامة والإحصاء', type: 'جهة مركزية' },
    { id: '7', name: 'الهيئة العامة للاستثمار', type: 'هيئة حكومية' },
    { id: '8', name: 'مصلحة الضرائب', type: 'هيئة حكومية' }
  ];

  selectedEntities: ExternalEntity[] = [];
  
  chartOptions: any = {};

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateGraph();
  }

  filteredEntities() {
    const q = this.searchQuery.toLowerCase();
    return this.availableEntities.filter(e => 
      e.name.toLowerCase().includes(q) || e.type.toLowerCase().includes(q)
    );
  }

  isSelected(entity: ExternalEntity) {
    return this.selectedEntities.some(e => e.id === entity.id);
  }

  toggleEntity(entity: ExternalEntity) {
    if (this.isSelected(entity)) {
      this.selectedEntities = this.selectedEntities.filter(e => e.id !== entity.id);
    } else {
      this.selectedEntities.push(entity);
    }
    this.updateGraph();
  }

  isValid() {
    return this.adminName.trim().length > 0 && this.adminDesc.trim().length > 0 && this.selectedEntities.length > 0;
  }

  save() {
    if (this.isValid()) {
      // Logic to save goes here
      this.router.navigate(['/super-admin/administrations']);
    }
  }

  updateGraph() {
    const mainNodeName = this.adminName.trim() || 'الإدارة الجديدة';
    
    // Nodes
    const nodes: any[] = [
      {
        id: 'center',
        name: mainNodeName,
        symbolSize: 80,
        itemStyle: { color: '#1e3a8a' }, // capmas-primary (Dark Navy)
        label: { show: true, position: 'bottom', formatter: '{b}', fontWeight: 'bold' },
        category: 0
      }
    ];

    // Edges
    const links: any[] = [];

    this.selectedEntities.forEach(entity => {
      nodes.push({
        id: entity.id,
        name: entity.name,
        symbolSize: 50,
        itemStyle: { color: '#C89637' }, // Accent Gold
        label: { show: true, position: 'right', formatter: '{b}', fontSize: 11, fontWeight: 'bold' },
        category: 1
      });

      links.push({
        source: 'center',
        target: entity.id,
        lineStyle: { width: 2, color: '#94a3b8', curveness: 0.1 }
      });
    });

    this.chartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            return `<div style="text-align:right; font-family:Cairo, sans-serif;"><b>${params.data.name}</b><br/>${params.data.id === 'center' ? 'الإدارة العامة' : 'جهة خارجية'}</div>`;
          }
          return '';
        }
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'force',
          force: {
            repulsion: 400,
            edgeLength: [100, 200],
            gravity: 0.1
          },
          roam: true,
          label: {
            fontFamily: 'Cairo, sans-serif'
          },
          data: nodes,
          links: links,
          lineStyle: {
            opacity: 0.9,
            width: 2,
            curveness: 0
          }
        }
      ]
    };
  }
}
