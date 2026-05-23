import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="glass-panel auth-card">
        <h2 class="text-center">Welcome Back</h2>
        <p class="text-center mb-4">Login to Team Task Manager</p>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" class="form-control" placeholder="Enter your email">
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" class="form-control" placeholder="Enter your password">
          </div>
          
          <div *ngIf="error" class="error-message mb-4">{{ error }}</div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%" [disabled]="loginForm.invalid">
            Login
          </button>
        </form>
        
        <p class="text-center mt-4">
          Don't have an account? <a routerLink="/signup" class="auth-link">Sign up</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 1rem;
    }
    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 2.5rem 2rem;
    }
    .auth-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }
    .auth-link:hover {
      text-decoration: underline;
    }
    .error-message {
      color: var(--danger-color);
      font-size: 0.875rem;
      text-align: center;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #475569;
      font-weight: 500;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          if (err.error?.errors) {
            const firstError = Object.values(err.error.errors)[0] as string[];
            this.error = firstError[0] || 'Validation error';
          } else {
            this.error = err.error?.message || err.error?.title || 'Invalid credentials. Make sure the backend is running.';
          }
        }
      });
    }
  }
}
