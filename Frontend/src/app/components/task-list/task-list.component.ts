import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="d-flex justify-between align-items-center mb-4">
        <h2>Tasks</h2>
        <button class="btn btn-primary" (click)="router.navigate(['/dashboard'])">Back to Dashboard</button>
      </div>

      <div class="glass-panel p-4 mb-4" *ngIf="isAdmin">
        <h3>Create New Task</h3>
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
          <div class="form-group">
            <input type="text" formControlName="title" class="form-control" placeholder="Task Title">
          </div>
          <div class="form-group">
            <input type="text" formControlName="description" class="form-control" placeholder="Description">
          </div>
          <div class="form-group">
            <select formControlName="projectId" class="form-control">
              <option value="">Select Project</option>
              <option *ngFor="let p of projects" [value]="p.id">{{ p.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <input type="date" formControlName="dueDate" class="form-control">
          </div>
          <div class="form-group">
            <input type="number" formControlName="assignedToId" class="form-control" placeholder="Assignee User ID">
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="taskForm.invalid">Create Task</button>
        </form>
      </div>

      <div *ngIf="tasks.length === 0" class="text-center mt-4 text-muted">
        <p>No tasks found. Get started by creating a new task.</p>
      </div>

      <div class="tasks-grid" *ngIf="tasks.length > 0">
        <div class="glass-panel p-4 task-card" *ngFor="let t of tasks">
          <div class="d-flex justify-between align-items-center mb-2">
            <h4 style="color: #0f172a; margin-bottom: 0;">{{ t.title }}</h4>
            <span class="status-badge" [ngClass]="t.status.toLowerCase().replace(' ', '-')">{{ t.status }}</span>
          </div>
          <p class="text-muted">{{ t.description }}</p>
          <div class="task-meta mt-4">
            <div><strong>Project:</strong> <span class="text-dark">{{ t.projectName }}</span></div>
            <div><strong>Assigned To:</strong> <span class="text-dark">{{ t.assignedToName || 'Unassigned' }}</span></div>
            <div><strong>Due:</strong> <span class="text-dark">{{ t.dueDate | date }}</span></div>
          </div>
          
          <div class="mt-4 pt-4 border-top" *ngIf="t.status !== 'Completed'">
            <label class="text-small font-semibold">Update Status:</label>
            <select class="form-control status-select mt-2" (change)="updateStatus(t.id, $event)">
              <option [selected]="t.status === 'Pending'" value="Pending">Pending</option>
              <option [selected]="t.status === 'In Progress'" value="In Progress">In Progress</option>
              <option [selected]="t.status === 'Completed'" value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .d-flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    .p-4 { padding: 1.5rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-2 { margin-top: 0.5rem; }
    .pt-4 { padding-top: 1rem; }
    .border-top { border-top: 1px solid var(--glass-border); }
    .text-center { text-align: center; }
    
    .task-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      align-items: start;
    }
    
    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .task-card {
      display: flex;
      flex-direction: column;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .status-badge.pending { background: rgba(245, 158, 11, 0.2); color: var(--warning-color); }
    .status-badge.in-progress { background: rgba(124, 58, 237, 0.15); color: var(--accent-color); }
    .status-badge.completed { background: rgba(16, 185, 129, 0.15); color: var(--success-color); }

    .text-muted { color: #475569; font-size: 0.95rem; line-height: 1.5; }
    .text-small { color: #64748b; font-size: 0.8rem; }
    .text-dark { color: #0f172a; font-weight: 500; }
    .font-semibold { font-weight: 600; color: #334155; }
    
    .task-meta {
      font-size: 0.85rem;
      color: #475569;
      display: grid;
      gap: 0.5rem;
    }
    
    .status-select {
      padding: 0.5rem;
      font-size: 0.85rem;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  projects: any[] = [];
  taskForm: FormGroup;
  isAdmin: boolean = false;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private authService: AuthService,
    private fb: FormBuilder,
    public router: Router
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      projectId: ['', Validators.required],
      dueDate: ['', Validators.required],
      assignedToId: ['']
    });
  }

  ngOnInit() {
    this.loadTasks();
    if (this.isAdmin) {
      this.projectService.getProjects().subscribe(data => this.projects = data);
    }
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      this.taskService.createTask(formValue).subscribe(() => {
        this.loadTasks();
        this.taskForm.reset();
      });
    }
  }

  updateStatus(id: number, event: any) {
    const status = event.target.value;
    this.taskService.updateTaskStatus(id, status).subscribe(() => {
      this.loadTasks();
    });
  }
}
