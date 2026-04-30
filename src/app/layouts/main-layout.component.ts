import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <img src="assets/logos/capmas_logo.png" alt="الجهاز المركزي للمحاسبات" class="logo">
          <h1>منصة التجارة الموحدة</h1>
        </div>
        
        <nav class="nav-menu">
          <a routerLink="/dashboard-capmas" routerLinkActive="active" class="nav-item">
            <span class="icon">📊</span> لوحة التحكم المركزية
          </a>
          <a routerLink="/dashboard-inst" routerLinkActive="active" class="nav-item">
            <span class="icon">🏢</span> لوحة المؤسسة
          </a>
          <a routerLink="/reports" class="nav-item">
            <span class="icon">📁</span> التقارير
          </a>
          <a routerLink="/settings" class="nav-item">
            <span class="icon">⚙️</span> الإعدادات
          </a>
        </nav>
        
        <div class="user-profile">
          <div class="avatar">👤</div>
          <div class="info">
            <span class="name">مستخدم نموذجي</span>
            <span class="role">مسؤول النظام</span>
          </div>
        </div>
      </aside>

      <main class="content-area">
        <header class="top-bar">
          <div class="search-box">
             <input type="text" placeholder="بحث في التقارير (رقم التقرير، المؤسسة)...">
          </div>
          <div class="actions">
            <button class="notif-btn">🔔 <span class="badge">3</span></button>
            <button class="lang-btn">English</button>
          </div>
        </header>
        
        <div class="scroll-container">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-shell { display: flex; height: 100vh; overflow: hidden; }
    
    .sidebar {
      width: 280px;
      background: var(--capmas-blue);
      color: white;
      display: flex;
      flex-direction: column;
      padding: 2rem 0;
    }
    
    .brand {
      padding: 0 1.5rem 2rem;
      text-align: center;
      h1 { font-size: 1.1rem; margin-top: 1rem; color: var(--capmas-gold); }
      .logo { width: 80px; }
    }
    
    .nav-menu {
      flex: 1;
      padding: 0 1rem;
      .nav-item {
        display: block;
        padding: 0.875rem 1.25rem;
        color: rgba(255,255,255,0.7);
        text-decoration: none;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        transition: 0.2s;
        
        &:hover, &.active {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .icon { margin-left: 0.75rem; }
      }
    }
    
    .user-profile {
      padding: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      .avatar { width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-left: 1rem; }
      .name { display: block; font-weight: 600; font-size: 0.9rem; }
      .role { font-size: 0.75rem; opacity: 0.7; }
    }
    
    .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--surface-200);
    }
    
    .top-bar {
      height: 70px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.03);
      
      .search-box input {
        border: none;
        background: #f1f3f5;
        padding: 0.6rem 1.5rem;
        border-radius: 20px;
        width: 350px;
        font-family: inherit;
        outline: none;
      }
      
      .actions {
         display: flex;
         gap: 1.5rem;
         .notif-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; position: relative; .badge { position: absolute; top: -5px; right: -5px; background: red; color: white; size: 16px; border-radius: 50%; font-size: 10px; padding: 2px 5px; }}
         .lang-btn { background: none; border: 1px solid #ddd; padding: 0.4rem 1rem; border-radius: 4px; cursor: pointer; font-family: inherit; }
      }
    }
    
    .scroll-container {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }
  `]
})
export class MainLayoutComponent {}
