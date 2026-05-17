import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrService } from '../../core/services/hr.service';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold mb-0">Leave Management</h3>
        <button class="btn btn-primary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#applyLeaveModal">
          <i class="fa-solid fa-plus me-2"></i> Apply Leave
        </button>
      </div>

      <!-- Balance Cards -->
      <div class="row g-4 mb-4" *ngIf="balance()">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div class="card-body text-center">
              <h6 class="text-muted fw-bold">Total Available</h6>
              <h2 class="fw-bold text-primary mt-2">{{ balance().total_available }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div class="card-body text-center">
              <h6 class="text-muted fw-bold">Casual Leave</h6>
              <h2 class="fw-bold text-info mt-2">{{ balance().casual_leave }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div class="card-body text-center">
              <h6 class="text-muted fw-bold">Sick Leave</h6>
              <h2 class="fw-bold text-danger mt-2">{{ balance().sick_leave }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div class="card-body text-center">
              <h6 class="text-muted fw-bold">Earned Leave</h6>
              <h2 class="fw-bold text-success mt-2">{{ balance().earned_leave }}</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- History Table -->
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-4">
          <h5 class="fw-bold mb-4">Leave History</h5>
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let record of history()">
                  <td class="fw-bold">{{ record.leave_type }}</td>
                  <td>{{ record.start_date | date }} to {{ record.end_date | date }}</td>
                  <td><span class="text-truncate d-inline-block" style="max-width: 250px;">{{ record.reason }}</span></td>
                  <td>
                    <span class="badge rounded-pill" 
                          [ngClass]="{
                            'bg-warning text-dark': record.status === 'Pending',
                            'bg-success': record.status === 'Approved',
                            'bg-danger': record.status === 'Rejected'
                          }">
                      {{ record.status }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="history().length === 0">
                  <td colspan="4" class="text-center text-muted py-4">No leave records found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Apply Leave Modal -->
    <div class="modal fade" id="applyLeaveModal" tabindex="-1" aria-labelledby="applyLeaveModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0 pt-4 px-4">
            <h5 class="modal-title fw-bold" id="applyLeaveModalLabel">Apply for Leave</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form (ngSubmit)="submitLeave()">
            <div class="modal-body px-4">
              <div *ngIf="message()" class="alert alert-info p-2 small">{{ message() }}</div>
              
              <div class="mb-3">
                <label class="form-label small fw-bold text-muted">LEAVE TYPE</label>
                <select class="form-select rounded-3" [(ngModel)]="leaveData.leave_type" name="leave_type" required>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                </select>
              </div>
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">START DATE</label>
                  <input type="date" class="form-control rounded-3" [(ngModel)]="leaveData.start_date" name="start_date" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">END DATE</label>
                  <input type="date" class="form-control rounded-3" [(ngModel)]="leaveData.end_date" name="end_date" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold text-muted">REASON</label>
                <textarea class="form-control rounded-3" rows="3" [(ngModel)]="leaveData.reason" name="reason" required></textarea>
              </div>
            </div>
            <div class="modal-footer border-top-0 pb-4 px-4">
              <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary rounded-pill px-4" [disabled]="isSubmitting()">
                {{ isSubmitting() ? 'Submitting...' : 'Submit Request' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LeaveComponent implements OnInit {
  private hrService = inject(HrService);
  
  balance = signal<any>(null);
  history = signal<any[]>([]);
  isSubmitting = signal(false);
  message = signal('');
  
  leaveData = {
    leave_type: 'Casual Leave',
    start_date: '',
    end_date: '',
    reason: ''
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.hrService.getLeaveBalance().subscribe(data => this.balance.set(data));
    this.hrService.getLeaveHistory().subscribe(data => this.history.set(data));
  }

  submitLeave() {
    this.isSubmitting.set(true);
    this.message.set('');
    
    this.hrService.applyLeave(this.leaveData).subscribe({
      next: (res) => {
        this.message.set(res.message);
        this.loadData(); // Refresh history
        this.isSubmitting.set(false);
        // Reset form
        this.leaveData = { leave_type: 'Casual Leave', start_date: '', end_date: '', reason: '' };
        
        // Hide modal (assuming bootstrap JS is loaded globally)
        const modalEl = document.getElementById('applyLeaveModal');
        if (modalEl) {
          // A bit hacky without a wrapper service, but works for demo
          const modal = (window as any).bootstrap?.Modal?.getInstance(modalEl);
          modal?.hide();
        }
      },
      error: (err) => {
        this.message.set(err.error?.detail || 'Error submitting leave request');
        this.isSubmitting.set(false);
      }
    });
  }
}
