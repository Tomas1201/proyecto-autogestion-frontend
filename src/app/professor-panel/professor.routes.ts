import { Routes } from '@angular/router';
import { ProfessorLayout } from './layout/professor-layout';
import { ProfessorDashboard } from './dashboard/professor-dashboard';
import { ProfessorMySubjects } from './my-subjects/my-subjects';
import { ProfessorGrades } from './grades/grades';
import { ProfessorAvailability } from './availability/availability';
import { ProfessorAttendance } from './attendance/attendance';

export const PROFESSOR_ROUTES: Routes = [
  {
    path: '',
    component: ProfessorLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ProfessorDashboard },
      { path: 'my-subjects', component: ProfessorMySubjects },
      { path: 'grades', component: ProfessorGrades },
      { path: 'availability', component: ProfessorAvailability },
      { path: 'attendance', component: ProfessorAttendance },
      { path: 'exams', loadComponent: () => import('./exams/exams').then(m => m.ProfessorExams) },
    ],
  },
];
