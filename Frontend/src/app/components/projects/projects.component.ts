import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="d-flex justify-between align-items-center mb-4">
        <h2>Manage Projects</h2>
        <button class="btn btn-primary" (click)="router.navigate(['/dashboard'])">Back to Dashboard</button>
      </div>

      <div class="glass-panel p-4 mb-4">
        <h3>Create New Project</h3>
        <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="d-flex gap-2">
          <div class="form-group flex-1">
            <input type="text" formControlName="name" class="form-control" placeholder="Project Name">
          </div>
          <div class="form-group flex-2">
            <input type="text" formControlName="description" class="form-control" placeholder="Project Description">
          </div>
          <button type="submit" class="btn btn-primary h-fit" [disabled]="projectForm.invalid">Create</button>
        </form>
      </div>

      <div *ngIf="projects.length === 0" class="text-center mt-4 text-muted">
        <p>No projects found. Create a new project to get started.</p>
      </div>

      <div class="projects-grid" *ngIf="projects.length > 0">
        <div class="glass-panel p-4 project-card" *ngFor="let p of projects">
          <h4 style="color: #0f172a; margin-bottom: 0.5rem;">{{ p.name }}</h4>
          <p class="text-muted">{{ p.description }}</p>
          <div class="mt-2 text-small">Created: {{ p.createdAt | date }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .d-flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    .gap-2 { gap: 1rem; }
    .flex-1 { flex: 1; }
    .flex-2 { flex: 2; }
    .h-fit { height: fit-content; margin-top: 0; }
    .p-4 { padding: 1.5rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-2 { margin-top: 0.5rem; }
    .text-center { text-align: center; }
    
    form .form-group { margin-bottom: 0; }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .project-card {
      transition: transform 0.3s ease;
    }
    .project-card:hover {
      transform: translateY(-5px);
    }

    .text-muted { color: #475569; font-size: 0.95rem; line-height: 1.5; }
    .text-small { color: #64748b; font-size: 0.8rem; }
  `]
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  projectForm: FormGroup;

  constructor(
    private projectService: ProjectService,
    private fb: FormBuilder,
    public router: Router
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.projectService.createProject(this.projectForm.value).subscribe(() => {
        this.loadProjects();
        this.projectForm.reset();
      });
    }
  }
}
