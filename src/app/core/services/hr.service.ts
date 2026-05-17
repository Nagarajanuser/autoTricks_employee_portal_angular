import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HrService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000/api/v1';

  // Attendance Endpoints
  checkIn(): Observable<any> {
    return this.http.post(`${this.baseUrl}/attendance/check-in`, {});
  }

  checkOut(): Observable<any> {
    return this.http.post(`${this.baseUrl}/attendance/check-out`, {});
  }

  getAttendanceHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/attendance/history`);
  }

  // Leave Endpoints
  applyLeave(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/leave/apply`, data);
  }

  getLeaveHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/leave/history`);
  }

  getLeaveBalance(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/leave/balance`);
  }

  // Payroll Endpoints
  getPayrollHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/payroll/history`);
  }

  // Projects Endpoints
  getAssignedProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projects/assigned`);
  }

  getProjectTasks(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projects/${projectId}/tasks`);
  }

  submitTimesheet(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/projects/timesheet`, data);
  }
}
