import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div class="card border-0 shadow-lg rounded-4" style="width: 400px; max-width: 90vw;">
        <div class="card-body p-5">
          <div class="text-center mb-4">
            <i class="fa-solid fa-building text-primary mb-3" style="font-size: 3rem;"></i>
            <h2 class="fw-bold">AutoTricks</h2>
            <p class="text-muted">Employee Portal Login</p>
          </div>

          <div *ngIf="errorMessage" class="alert alert-danger p-2 fs-6">
            {{ errorMessage }}
          </div>

          <form (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label text-muted small fw-bold">USERNAME</label>
              <input type="text" class="form-control form-control-lg rounded-3" 
                     [(ngModel)]="credentials.username" name="username" required 
                     placeholder="e.g. johndoe">
            </div>

            <div class="mb-4">
              <label class="form-label text-muted small fw-bold">PASSWORD</label>
              <input type="password" class="form-control form-control-lg rounded-3" 
                     [(ngModel)]="credentials.password" name="password" required 
                     placeholder="••••••••">
            </div>

            <button type="submit" class="btn btn-primary btn-lg w-100 rounded-3 shadow-sm fw-bold" [disabled]="isLoading">
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isLoading ? 'Signing In...' : 'Sign In' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  
  credentials = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || 'Invalid username or password';
      }
    });
  }
}
