import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrService } from '../../core/services/hr.service';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h3 class="fw-bold mb-4">Payroll & Salary</h3>

      <!-- Current Salary Structure -->
      <div class="card border-0 shadow-sm rounded-4 mb-4 bg-dark text-white bg-gradient">
        <div class="card-body p-4">
          <div class="row align-items-center">
            <div class="col-md-6">
              <h5 class="text-white-50 fw-bold mb-1">Current Salary Structure</h5>
              <p class="mb-0 small">Based on your latest payslip</p>
            </div>
            <div class="col-md-6 text-md-end mt-3 mt-md-0">
              <h2 class="fw-bold text-success mb-0" *ngIf="latestPayroll()">
                {{ latestPayroll()?.net_salary | currency:'USD' }} <span class="fs-6 text-white-50 fw-normal">/ month</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Payslip History -->
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-4">
          <h5 class="fw-bold mb-4">Payslip History</h5>
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>Month/Year</th>
                  <th>Basic Salary</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let record of history()">
                  <td class="fw-bold">{{ getMonthName(record.month) }} {{ record.year }}</td>
                  <td>{{ record.basic_salary | currency:'USD' }}</td>
                  <td>{{ record.allowances | currency:'USD' }}</td>
                  <td class="text-danger">-{{ record.deductions | currency:'USD' }}</td>
                  <td class="fw-bold text-success">{{ record.net_salary | currency:'USD' }}</td>
                  <td>
                    <span class="badge rounded-pill bg-success">{{ record.status }}</span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary rounded-pill">
                      <i class="fa-solid fa-download me-1"></i> PDF
                    </button>
                  </td>
                </tr>
                <tr *ngIf="history().length === 0">
                  <td colspan="7" class="text-center text-muted py-4">No payroll records found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PayrollComponent implements OnInit {
  private hrService = inject(HrService);
  
  history = signal<any[]>([]);
  latestPayroll = signal<any>(null);

  ngOnInit() {
    this.hrService.getPayrollHistory().subscribe({
      next: (data) => {
        this.history.set(data);
        if (data && data.length > 0) {
          this.latestPayroll.set(data[0]);
        }
      },
      error: (err) => console.error(err)
    });
  }

  getMonthName(monthNumber: number): string {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
  }
}
