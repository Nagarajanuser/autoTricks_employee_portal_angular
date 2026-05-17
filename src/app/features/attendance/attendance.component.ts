import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrService } from '../../core/services/hr.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h3 class="fw-bold mb-4">Daily Attendance</h3>

      <!-- Action Cards -->
      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 h-100 text-center p-4">
            <h5 class="text-muted fw-bold mb-3">Today's Action</h5>
            <div class="d-flex justify-content-center gap-3">
              <button class="btn btn-success btn-lg px-4 rounded-pill shadow-sm" 
                      (click)="checkIn()" [disabled]="isLoading()">
                <i class="fa-solid fa-sign-in-alt me-2"></i> Check In
              </button>
              <button class="btn btn-danger btn-lg px-4 rounded-pill shadow-sm" 
                      (click)="checkOut()" [disabled]="isLoading()">
                <i class="fa-solid fa-sign-out-alt me-2"></i> Check Out
              </button>
            </div>
            <div *ngIf="message()" class="alert alert-info mt-3 p-2 small">
              {{ message() }}
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 h-100 p-4 bg-primary text-white bg-gradient">
            <div class="d-flex justify-content-between align-items-center h-100">
              <div>
                <h5 class="fw-normal mb-1">Current Time</h5>
                <h2 class="fw-bold mb-0">{{ currentTime | date:'mediumTime' }}</h2>
                <p class="mb-0 mt-2 opacity-75">{{ currentTime | date:'fullDate' }}</p>
              </div>
              <i class="fa-solid fa-clock" style="font-size: 4rem; opacity: 0.5;"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- History Table -->
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-4">
          <h5 class="fw-bold mb-4">Attendance History</h5>
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let record of history()">
                  <td>{{ record.date | date:'mediumDate' }}</td>
                  <td>{{ record.check_in ? (record.check_in | date:'shortTime') : '--' }}</td>
                  <td>{{ record.check_out ? (record.check_out | date:'shortTime') : '--' }}</td>
                  <td>
                    <span class="badge rounded-pill" 
                          [ngClass]="record.status === 'Present' ? 'bg-success' : 'bg-warning text-dark'">
                      {{ record.status }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="history().length === 0">
                  <td colspan="4" class="text-center text-muted py-4">No attendance records found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AttendanceComponent implements OnInit {
  private hrService = inject(HrService);
  
  history = signal<any[]>([]);
  isLoading = signal(false);
  message = signal('');
  currentTime = new Date();

  ngOnInit() {
    this.loadHistory();
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  loadHistory() {
    this.hrService.getAttendanceHistory().subscribe({
      next: (data) => this.history.set(data),
      error: (err) => console.error(err)
    });
  }

  checkIn() {
    this.isLoading.set(true);
    this.message.set('');
    this.hrService.checkIn().subscribe({
      next: (res) => {
        this.message.set(res.message);
        this.loadHistory();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.message.set(err.error?.detail || 'Error checking in');
        this.isLoading.set(false);
      }
    });
  }

  checkOut() {
    this.isLoading.set(true);
    this.message.set('');
    this.hrService.checkOut().subscribe({
      next: (res) => {
        this.message.set(res.message);
        this.loadHistory();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.message.set(err.error?.detail || 'Error checking out');
        this.isLoading.set(false);
      }
    });
  }
}
