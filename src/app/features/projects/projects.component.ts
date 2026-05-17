import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrService } from '../../core/services/hr.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <h3 class="fw-bold mb-4">Assigned Projects</h3>

      <div class="row g-4">
        <!-- Projects List -->
        <div class="col-md-4">
          <div class="list-group shadow-sm border-0 rounded-4">
            <button *ngFor="let proj of projects()" 
                    class="list-group-item list-group-item-action p-4 border-0 border-bottom"
                    [class.active]="selectedProject()?.id === proj.id"
                    (click)="selectProject(proj)">
              <div class="d-flex w-100 justify-content-between mb-2">
                <h6 class="mb-0 fw-bold">{{ proj.name }}</h6>
                <span class="badge" [ngClass]="proj.status === 'Active' ? 'bg-success' : 'bg-secondary'">{{ proj.status }}</span>
              </div>
              <p class="mb-1 small text-truncate" [class.text-white]="selectedProject()?.id === proj.id" [class.text-muted]="selectedProject()?.id !== proj.id">
                {{ proj.description }}
              </p>
              <small [class.text-white]="selectedProject()?.id === proj.id" [class.text-muted]="selectedProject()?.id !== proj.id">
                Role: <strong>{{ proj.role }}</strong>
              </small>
            </button>
            <div *ngIf="projects().length === 0" class="p-4 text-center text-muted">
              No assigned projects.
            </div>
          </div>
        </div>

        <!-- Project Details & Timesheet -->
        <div class="col-md-8">
          <div *ngIf="selectedProject()" class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-header bg-white border-bottom p-4">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="fw-bold mb-0">{{ selectedProject()?.name }} - Tasks</h5>
                <button class="btn btn-primary btn-sm rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#timesheetModal">
                  <i class="fa-solid fa-clock me-1"></i> Log Hours
                </button>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="ps-4">Task Title</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let task of tasks()">
                      <td class="ps-4">{{ task.title }}</td>
                      <td>{{ task.due_date | date }}</td>
                      <td>
                        <span class="badge rounded-pill bg-light text-dark border">{{ task.status }}</span>
                      </td>
                    </tr>
                    <tr *ngIf="tasks().length === 0">
                      <td colspan="3" class="text-center text-muted py-4">No tasks found for this project.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div *ngIf="!selectedProject()" class="card border-0 shadow-sm rounded-4 h-100 d-flex align-items-center justify-content-center bg-light">
            <div class="text-center text-muted p-5">
              <i class="fa-solid fa-folder-open fs-1 mb-3 opacity-50"></i>
              <h5>Select a Project</h5>
              <p>Choose a project from the left to view tasks and log hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Timesheet Modal -->
    <div class="modal fade" id="timesheetModal" tabindex="-1" aria-labelledby="timesheetModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom-0 pt-4 px-4">
            <h5 class="modal-title fw-bold" id="timesheetModalLabel">Log Hours for {{ selectedProject()?.name }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form (ngSubmit)="submitTimesheet()">
            <div class="modal-body px-4">
              <div *ngIf="message()" class="alert alert-info p-2 small">{{ message() }}</div>
              
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">DATE</label>
                  <input type="date" class="form-control rounded-3" [(ngModel)]="timesheetData.date" name="date" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">HOURS WORKED</label>
                  <input type="number" step="0.5" min="0.5" max="24" class="form-control rounded-3" [(ngModel)]="timesheetData.hours_worked" name="hours_worked" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold text-muted">DESCRIPTION OF WORK</label>
                <textarea class="form-control rounded-3" rows="3" [(ngModel)]="timesheetData.description" name="description" required placeholder="What did you work on?"></textarea>
              </div>
            </div>
            <div class="modal-footer border-top-0 pb-4 px-4">
              <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary rounded-pill px-4" [disabled]="isSubmitting()">
                {{ isSubmitting() ? 'Submitting...' : 'Submit Timesheet' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProjectsComponent implements OnInit {
  private hrService = inject(HrService);
  
  projects = signal<any[]>([]);
  selectedProject = signal<any>(null);
  tasks = signal<any[]>([]);
  
  isSubmitting = signal(false);
  message = signal('');
  
  timesheetData = {
    date: new Date().toISOString().split('T')[0],
    hours_worked: 8,
    description: ''
  };

  ngOnInit() {
    this.hrService.getAssignedProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
        if (data && data.length > 0) {
          this.selectProject(data[0]);
        }
      },
      error: (err) => console.error(err)
    });
  }

  selectProject(proj: any) {
    this.selectedProject.set(proj);
    this.hrService.getProjectTasks(proj.id).subscribe({
      next: (data) => this.tasks.set(data),
      error: (err) => console.error(err)
    });
  }

  submitTimesheet() {
    if (!this.selectedProject()) return;
    
    this.isSubmitting.set(true);
    this.message.set('');
    
    const payload = {
      project_id: this.selectedProject().id,
      ...this.timesheetData
    };
    
    this.hrService.submitTimesheet(payload).subscribe({
      next: (res) => {
        this.message.set(res.message);
        this.isSubmitting.set(false);
        this.timesheetData.description = ''; // reset only description
        
        const modalEl = document.getElementById('timesheetModal');
        if (modalEl) {
          const modal = (window as any).bootstrap?.Modal?.getInstance(modalEl);
          modal?.hide();
        }
      },
      error: (err) => {
        this.message.set(err.error?.detail || 'Error submitting timesheet');
        this.isSubmitting.set(false);
      }
    });
  }
}
