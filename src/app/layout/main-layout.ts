import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="d-flex" style="height: 100vh;">
      <app-sidebar></app-sidebar>
      <div class="flex-grow-1 d-flex flex-column" style="overflow: hidden;">
        <app-navbar></app-navbar>
        <div class="p-4" style="overflow-y: auto;">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class MainLayoutComponent {}
