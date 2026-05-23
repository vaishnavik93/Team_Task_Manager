import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="d-flex justify-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <div>
          <button *ngIf="isAdmin" class="btn btn-primary mr-2" (click)="router.navigate(['/projects'])">Manage Projects</button>
          <button class="btn btn-primary mr-2" (click)="router.navigate(['/tasks'])">View Tasks</button>
          <button class="btn btn-danger" (click)="logout()">Logout</button>
        </div>
      </div>

    <div class="stats-grid" *ngIf="stats">
      <div class="stat-card glass-panel">
        <div class="stat-title">Total Tasks</div>
        <div class="stat-value text-primary">{{ stats.totalTasks }}</div>
      </div>
      
      <div class="stat-card glass-panel">
        <div class="stat-title">Pending</div>
        <div class="stat-value text-warning">{{ stats.pendingTasks }}</div>
      </div>

      <div class="stat-card glass-panel">
        <div class="stat-title">In Progress</div>
        <div class="stat-value text-accent">{{ stats.inProgressTasks }}</div>
      </div>
      
      <div class="stat-card glass-panel">
        <div class="stat-title">Completed</div>
        <div class="stat-value text-success">{{ stats.completedTasks }}</div>
      </div>
      
      <div class="stat-card glass-panel">
        <div class="stat-title">Overdue</div>
        <div class="stat-value text-danger">{{ stats.overdueTasks }}</div>
      </div>
    </div>
    
    <div *ngIf="!stats && !error" class="text-center mt-4 text-muted">
      Loading dashboard statistics...
    </div>
    
    <div *ngIf="error" class="text-center mt-4 text-danger">
      {{ error }}
    </div>
    </div>
  `,
  styles: [`
    .d-flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    .mr-2 { margin-right: 0.5rem; }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .stat-card {
      padding: 1.5rem;
      text-align: center;
      transition: transform 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
    }
    
    .stat-title {
      font-size: 1rem;
      color: #475569;
      margin-bottom: 0.5rem;
    }
    
    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #0f172a;
    }
    
    .text-primary { color: var(--primary-color); }
    .text-warning { color: var(--warning-color); }
    .text-accent { color: var(--accent-color); }
    .text-success { color: var(--success-color); }
    .text-danger { color: var(--danger-color); }
    .text-muted { color: #64748b; }
    .text-center { text-align: center; }
    .mt-4 { margin-top: 1rem; }
    
    .btn-danger {
      background: linear-gradient(135deg, var(--danger-color), #b91c1c);
      color: white;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: any;
  error: string = '';
  isAdmin: boolean = false;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    public router: Router
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit() {
    this.taskService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard statistics. Please ensure the backend server is running.';
        console.error(err);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
