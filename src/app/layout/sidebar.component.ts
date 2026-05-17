import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="bg-dark text-white p-3 h-100" style="width: 250px;">
      <h3 class="text-center mb-4 text-primary fw-bold">AutoTricks</h3>
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link text-white">
            <i class="fa-solid fa-home me-2"></i> Dashboard
          </a>
        </li>
        <li>
          <a routerLink="/personal-info" routerLinkActive="active" class="nav-link text-white">
            <i class="fa-solid fa-user me-2"></i> Personal Info
          </a>
        </li>
        <li>
          <a routerLink="/attendance" routerLinkActive="active" class="nav-link text-white">
            <i class="fa-solid fa-clock me-2"></i> Attendance
          </a>
        </li>
        <li>
          <a routerLink="/leave" routerLinkActive="active" class="nav-link text-white">
            <i class="fa-solid fa-calendar-alt me-2"></i> Leave
          </a>
        </li>
        <li>
          <a routerLink="/chatbot" routerLinkActive="active" class="nav-link text-white">
            <i class="fa-solid fa-robot me-2"></i> HR Chatbot
          </a>
        </li>
      </ul>
    </div>
  `
})
export class SidebarComponent {}
