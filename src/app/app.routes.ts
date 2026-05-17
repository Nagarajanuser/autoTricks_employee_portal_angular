import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ChatbotComponent } from './features/chatbot/chatbot.component';
import { AttendanceComponent } from './features/attendance/attendance.component';
import { LeaveComponent } from './features/leave/leave.component';
import { PlaceholderComponent } from './features/placeholder.component';
import { LoginComponent } from './auth/login.component';
import { authGuard } from './core/guards/auth.guard';

import { PayrollComponent } from './features/payroll/payroll.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { PersonalInfoComponent } from './features/personal-info/personal-info.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'chatbot', component: ChatbotComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'leave', component: LeaveComponent },
      { path: 'personal-info', component: PersonalInfoComponent },
      { path: 'payroll', component: PayrollComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'performance', component: PlaceholderComponent, data: { title: 'Performance' } },
      { path: 'assets', component: PlaceholderComponent, data: { title: 'Assets' } },
      { path: 'reports', component: PlaceholderComponent, data: { title: 'Reports' } },
      { path: 'settings', component: PlaceholderComponent, data: { title: 'Settings' } }
    ]
  },
  { path: '**', redirectTo: '' }
];
