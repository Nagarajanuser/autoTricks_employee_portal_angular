import { Component, inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4 py-3">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1 fw-bold">Employee Portal</span>
        <div class="d-flex align-items-center">
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle d-flex align-items-center gap-2" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fa-solid fa-user-circle fs-4 text-primary"></i>
              <span>John Doe</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userMenu">
              <li><a class="dropdown-item" href="javascript:void(0)"><i class="fa-solid fa-cog me-2"></i> Settings</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="javascript:void(0)" (click)="logout()"><i class="fa-solid fa-sign-out-alt me-2"></i> Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}

