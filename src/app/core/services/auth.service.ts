import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private tokenKey = 'authToken';
  
  // Signal to hold the current logged in state
  isAuthenticated = signal<boolean>(this.hasToken());

  login(credentials: any) {
    return this.http.post<{access_token: string}>('http://localhost:8000/api/v1/auth/login', credentials).pipe(
      tap(response => {
        if (response && response.access_token) {
          localStorage.setItem(this.tokenKey, response.access_token);
          this.isAuthenticated.set(true);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
