import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="container-fluid">
      <h2 class="mb-4 fw-bold">Welcome, John Doe! 👋</h2>
      
      <div class="row g-4 mb-4">
        <!-- Leave Balance Card -->
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 h-100 bg-primary text-white bg-gradient">
            <div class="card-body">
              <h5 class="card-title fw-normal"><i class="fa-solid fa-umbrella-beach me-2"></i> Leave Balance</h5>
              <h2 class="mt-3 fw-bold">12 <span class="fs-5 fw-normal">Days</span></h2>
            </div>
          </div>
        </div>

        <!-- Attendance Card -->
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 h-100 bg-success text-white bg-gradient">
            <div class="card-body">
              <h5 class="card-title fw-normal"><i class="fa-solid fa-clock me-2"></i> Attendance</h5>
              <h2 class="mt-3 fw-bold">98% <span class="fs-5 fw-normal">This Month</span></h2>
            </div>
          </div>
        </div>

        <!-- Tasks Card -->
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 h-100 bg-warning text-dark bg-gradient">
            <div class="card-body">
              <h5 class="card-title fw-normal"><i class="fa-solid fa-list-check me-2"></i> Pending Tasks</h5>
              <h2 class="mt-3 fw-bold">5 <span class="fs-5 fw-normal">Tasks</span></h2>
            </div>
          </div>
        </div>

        <!-- KPI Card -->
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 h-100 bg-info text-white bg-gradient">
            <div class="card-body">
              <h5 class="card-title fw-normal"><i class="fa-solid fa-chart-line me-2"></i> Performance</h5>
              <h2 class="mt-3 fw-bold">Excellent</h2>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row g-4">
        <div class="col-md-8">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body">
              <h5 class="card-title fw-bold mb-4">Recent Activities</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Checked in at 09:00 AM</span>
                  <span class="badge bg-light text-dark">Today</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Leave request approved</span>
                  <span class="badge bg-light text-dark">Yesterday</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Completed Quarterly Review</span>
                  <span class="badge bg-light text-dark">May 10</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body">
              <h5 class="card-title fw-bold mb-4">Upcoming Holidays</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item px-0">
                  <strong>Summer Break</strong><br>
                  <small class="text-muted">June 15, 2026</small>
                </li>
                <li class="list-group-item px-0">
                  <strong>Independence Day</strong><br>
                  <small class="text-muted">August 15, 2026</small>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {}
