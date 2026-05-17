import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrService } from '../../core/services/hr.service';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Loading State -->
      <div *ngIf="isLoading()" class="d-flex justify-content-center align-items-center py-5">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Main Content -->
      <div *ngIf="!isLoading() && profileData()">
        <!-- Error & Success Alerts -->
        <div *ngIf="successMessage()" class="alert alert-success border-0 shadow-sm rounded-4 p-3 mb-4 d-flex align-items-center gap-3">
          <i class="fa-solid fa-circle-check fs-4"></i>
          <div>{{ successMessage() }}</div>
        </div>
        <div *ngIf="errorMessage()" class="alert alert-danger border-0 shadow-sm rounded-4 p-3 mb-4 d-flex align-items-center gap-3">
          <i class="fa-solid fa-triangle-exclamation fs-4"></i>
          <div>{{ errorMessage() }}</div>
        </div>

        <!-- Premium Profile Header Card -->
        <div class="card border-0 shadow-sm rounded-4 mb-4 profile-header-card overflow-hidden">
          <div class="card-body p-4 p-md-5 d-flex flex-column flex-md-row align-items-center gap-4 position-relative">
            <div class="profile-avatar-circle d-flex align-items-center justify-content-center shadow-lg">
              {{ getInitials(profileData().full_name) }}
            </div>
            <div class="text-center text-md-start text-white z-1">
              <span class="badge bg-white bg-opacity-25 text-white mb-2 px-3 py-2 rounded-pill text-uppercase tracking-wider fw-bold small">
                Active Employee
              </span>
              <h2 class="fw-bold mb-1 fs-1">{{ profileData().full_name }}</h2>
              <p class="mb-0 opacity-75 fs-5">
                <i class="fa-solid fa-envelope me-2"></i>{{ profileData().email }}
              </p>
            </div>
            
            <!-- Edit Toggle Button in Header -->
            <button 
              *ngIf="!isEditing()"
              class="btn btn-light btn-lg px-4 py-2 rounded-pill shadow-sm ms-md-auto d-flex align-items-center gap-2 border-0 hover-scale"
              (click)="toggleEdit(true)">
              <i class="fa-solid fa-user-pen text-primary"></i>
              <span class="fw-bold text-primary">Edit Profile</span>
            </button>
          </div>
        </div>

        <!-- View Mode Grid -->
        <div *ngIf="!isEditing()" class="row g-4 animate-fade-in">
          <!-- Card 1: Contact Details -->
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm rounded-4 glass-card h-100">
              <div class="card-body p-4">
                <div class="d-flex align-items-center gap-3 mb-4">
                  <div class="icon-circle bg-primary bg-opacity-10 text-primary">
                    <i class="fa-solid fa-address-book fs-4"></i>
                  </div>
                  <h4 class="fw-bold mb-0 text-dark">Contact Information</h4>
                </div>
                
                <div class="d-flex flex-column gap-3">
                  <div class="info-item">
                    <span class="info-label text-muted d-block small fw-semibold text-uppercase">Full Name</span>
                    <span class="info-value fs-5 fw-medium text-dark">{{ profileData().full_name }}</span>
                  </div>
                  <hr class="my-1 border-light">
                  <div class="info-item">
                    <span class="info-label text-muted d-block small fw-semibold text-uppercase">Email Address</span>
                    <span class="info-value fs-5 fw-medium text-dark">{{ profileData().email }}</span>
                  </div>
                  <hr class="my-1 border-light">
                  <div class="info-item">
                    <span class="info-label text-muted d-block small fw-semibold text-uppercase">Phone Number</span>
                    <span class="info-value fs-5 fw-medium text-dark">{{ profileData().phone || '-- Not Provided --' }}</span>
                  </div>
                  <hr class="my-1 border-light">
                  <div class="info-item">
                    <span class="info-label text-muted d-block small fw-semibold text-uppercase">Physical Address</span>
                    <span class="info-value fs-5 fw-medium text-dark whitespace-pre-wrap">{{ profileData().address || '-- Not Provided --' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2: Legal & Identity Docs -->
          <div class="col-lg-6">
            <div class="d-flex flex-column gap-4 h-100">
              <!-- Legal Docs Card -->
              <div class="card border-0 shadow-sm rounded-4 glass-card">
                <div class="card-body p-4">
                  <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="icon-circle bg-info bg-opacity-10 text-info">
                      <i class="fa-solid fa-id-card fs-4"></i>
                    </div>
                    <h4 class="fw-bold mb-0 text-dark">Identity & Legal</h4>
                  </div>
                  
                  <div class="row g-3">
                    <div class="col-sm-6">
                      <span class="info-label text-muted d-block small fw-semibold text-uppercase">Aadhaar Number</span>
                      <span class="info-value fs-5 fw-medium text-dark">{{ profileData().aadhaar_number || '-- Not Provided --' }}</span>
                    </div>
                    <div class="col-sm-6">
                      <span class="info-label text-muted d-block small fw-semibold text-uppercase">PAN Number</span>
                      <span class="info-value fs-5 fw-medium text-dark">{{ profileData().pan_number || '-- Not Provided --' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bank Details Card -->
              <div class="card border-0 shadow-sm rounded-4 glass-card flex-grow-1">
                <div class="card-body p-4">
                  <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="icon-circle bg-success bg-opacity-10 text-success">
                      <i class="fa-solid fa-university fs-4"></i>
                    </div>
                    <h4 class="fw-bold mb-0 text-dark">Financial & Banking Info</h4>
                  </div>
                  
                  <div class="row g-3">
                    <div class="col-sm-6">
                      <span class="info-label text-muted d-block small fw-semibold text-uppercase">Bank Account Number</span>
                      <span class="info-value fs-5 fw-medium text-dark">{{ profileData().bank_account || '-- Not Provided --' }}</span>
                    </div>
                    <div class="col-sm-6">
                      <span class="info-label text-muted d-block small fw-semibold text-uppercase">IFSC Code</span>
                      <span class="info-value fs-5 fw-medium text-dark">{{ profileData().bank_ifsc || '-- Not Provided --' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Mode Form -->
        <div *ngIf="isEditing()" class="card border-0 shadow-sm rounded-4 animate-fade-in">
          <div class="card-body p-4 p-md-5">
            <div class="d-flex align-items-center justify-content-between mb-4">
              <h3 class="fw-bold mb-0 text-dark">Modify Account Information</h3>
              <i class="fa-solid fa-shield-halved text-muted fs-4"></i>
            </div>
            
            <form (ngSubmit)="saveProfile()" #profileForm="ngForm">
              <!-- Contact Information Section -->
              <h5 class="fw-bold text-primary mb-3 border-bottom pb-2">1. Personal & Contact</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-secondary">Full Name <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    name="full_name"
                    class="form-control form-control-lg rounded-3 shadow-sm border-light" 
                    [(ngModel)]="editForm.full_name" 
                    required 
                    #fullNameInput="ngModel"
                    [class.is-invalid]="fullNameInput.invalid && fullNameInput.touched">
                  <div class="invalid-feedback">Name is required.</div>
                </div>
                
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-secondary">Email Address <span class="text-danger">*</span></label>
                  <input 
                    type="email" 
                    name="email"
                    class="form-control form-control-lg rounded-3 shadow-sm border-light" 
                    [(ngModel)]="editForm.email" 
                    required 
                    email
                    #emailInput="ngModel"
                    [class.is-invalid]="emailInput.invalid && emailInput.touched">
                  <div class="invalid-feedback">A valid email is required.</div>
                </div>

                <div class="col-md-12">
                  <label class="form-label fw-semibold text-secondary">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    class="form-control form-control-lg rounded-3 shadow-sm border-light" 
                    placeholder="Enter phone number"
                    [(ngModel)]="editForm.phone">
                </div>

                <div class="col-md-12">
                  <label class="form-label fw-semibold text-secondary">Physical Address</label>
                  <textarea 
                    name="address"
                    rows="3" 
                    class="form-control form-control-lg rounded-3 shadow-sm border-light" 
                    placeholder="Enter permanent address details"
                    [(ngModel)]="editForm.address"></textarea>
                </div>
              </div>

              <!-- Identity Documents Section -->
              <h5 class="fw-bold text-primary mb-3 border-bottom pb-2">2. Identity & Legal Documents</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-secondary">Aadhaar Number</label>
                  <input 
                    type="text" 
                    name="aadhaar_number"
                    class="form-control form-control-lg rounded-3 shadow-sm border-light" 
                    placeholder="XXXX XXXX XXXX"
                    [(ngModel)]="editForm.aadhaar_number">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-secondary">PAN Number</label>
                  <input 
                    type="text" 
                    name="pan_number"
                    class="form-control form-control-lg rounded-3 shadow-sm border-light" 
                    placeholder="ABCDE1234F"
                    [(ngModel)]="editForm.pan_number">
                </div>
              </div>

              <!-- Financial/Banking Section -->
              <h5 class="fw-bold text-primary mb-3 border-bottom pb-2">3. Bank Account details</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-secondary">Bank Account Number</label>
                  <input 
                    type="text" 
                    name="bank_account"
                    class="form-control form-control-lg rounded-3 shadow-sm border-light" 
                    placeholder="Enter account number"
                    [(ngModel)]="editForm.bank_account">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-secondary">IFSC Code</label>
                  <input 
                    type="text" 
                    name="bank_ifsc"
                    class="form-control form-control-lg rounded-3 shadow-sm border-light" 
                    placeholder="IFSC code"
                    [(ngModel)]="editForm.bank_ifsc">
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex justify-content-end gap-3 mt-4 border-top pt-4">
                <button 
                  type="button" 
                  class="btn btn-outline-secondary btn-lg px-4 rounded-pill shadow-sm"
                  [disabled]="isSaving()"
                  (click)="toggleEdit(false)">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm d-flex align-items-center gap-2"
                  [disabled]="profileForm.invalid || isSaving()">
                  <span *ngIf="isSaving()" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <i *ngIf="!isSaving()" class="fa-solid fa-floppy-disk"></i>
                  <span>{{ isSaving() ? 'Saving...' : 'Save Profile Changes' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-header-card {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
      position: relative;
    }
    
    .profile-header-card::after {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      top: -100px;
      right: -100px;
      pointer-events: none;
    }

    .profile-avatar-circle {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 4px solid rgba(255, 255, 255, 0.9);
      font-size: 2.8rem;
      color: white;
      font-weight: 800;
      letter-spacing: 1px;
      user-select: none;
    }

    .icon-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .glass-card {
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .glass-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.065) !important;
    }

    .info-label {
      letter-spacing: 0.5px;
      font-size: 0.75rem;
    }

    .info-value {
      font-size: 1.05rem;
    }

    .hover-scale {
      transition: transform 0.2s ease;
    }

    .hover-scale:hover {
      transform: scale(1.03);
    }

    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class PersonalInfoComponent implements OnInit {
  private hrService = inject(HrService);

  profileData = signal<any>(null);
  isEditing = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  
  editForm: any = {};

  ngOnInit() {
    this.fetchProfile();
  }

  fetchProfile() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.hrService.getProfile().subscribe({
      next: (data) => {
        this.profileData.set(data);
        this.editForm = { ...data };
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(err.error?.detail || 'Failed to load profile details.');
        this.isLoading.set(false);
      }
    });
  }

  toggleEdit(editing: boolean) {
    if (editing) {
      this.editForm = { ...this.profileData() };
      this.errorMessage.set('');
      this.successMessage.set('');
    }
    this.isEditing.set(editing);
  }

  saveProfile() {
    if (!this.editForm.full_name || !this.editForm.email) {
      this.errorMessage.set('Name and Email are required fields.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.hrService.updateProfile(this.editForm).subscribe({
      next: (data) => {
        this.profileData.set(data);
        this.isEditing.set(false);
        this.isSaving.set(false);
        this.successMessage.set('Your profile has been successfully updated!');
        // Clear message after 4 seconds
        setTimeout(() => this.successMessage.set(''), 4000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(err.error?.detail || 'Failed to update profile details.');
        this.isSaving.set(false);
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return 'EE';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
}
