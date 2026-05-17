import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <div class="container-fluid py-5 text-center">
      <div class="card border-0 shadow-sm rounded-4 mx-auto" style="max-width: 600px;">
        <div class="card-body p-5">
          <i class="fa-solid fa-person-digging fs-1 text-secondary mb-4"></i>
          <h2 class="fw-bold text-dark">{{ title }} Module</h2>
          <p class="text-muted fs-5 mt-3">This module is currently under development. Please check back later.</p>
        </div>
      </div>
    </div>
  `
})
export class PlaceholderComponent {
  @Input() title: string = 'Feature';
}
