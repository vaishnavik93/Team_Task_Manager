import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="glass-panel auth-card">
        <h2 class="text-center">Create Account</h2>
        <p class="text-center mb-4">Join Team Task Manager</p>
        
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Name</label>
            <input type="text" formControlName="name" class="form-control" placeholder="John Doe">
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" class="form-control" placeholder="Enter your email">
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" class="form-control" placeholder="Create a password">
          </div>

          <div class="form-group">
            <label>Role</label>
            <select formControlName="role" class="form-control">
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <div *ngIf="error" class="error-message mb-4">{{ error }}</div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%" [disabled]="signupForm.invalid">
            Sign Up
          </button>
        </form>
        
        <p class="text-center mt-4">
          Already have an account? <a routerLink="/login" class="auth-link">Login</a>
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
    select option {
      background: var(--bg-color);
      color: var(--text-color);
    }
  `]
})
export class SignupComponent {
  signupForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Member', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (err.error?.errors) {
            const firstError = Object.values(err.error.errors)[0] as string[];
            this.error = firstError[0] || 'Validation error';
          } else {
            this.error = err.error?.message || err.error?.title || 'Registration failed. Make sure the backend is running.';
          }
        }
      });
    }
  }
}
