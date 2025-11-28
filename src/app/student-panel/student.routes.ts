import { Routes } from '@angular/router';
import { StudentLayout } from './layout/student-layout';
import { StudentDashboard } from './dashboard/student-dashboard';

export const STUDENT_ROUTES: Routes = [
    {
        path: '',
        component: StudentLayout,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: StudentDashboard },
            {
                path: 'my-subjects',
                loadComponent: () => import('./my-subjects/my-subjects').then(m => m.MySubjects)
            },
            {
                path: 'final-exams',
                loadComponent: () => import('./final-exams/final-exams').then(m => m.FinalExams)
            },
            {
                path: 'grades',
                loadComponent: () => import('./grades/grades').then(m => m.Grades)
            },
            {
                path: 'academic-status',
                loadComponent: () => import('./academic-status/academic-status').then(m => m.AcademicStatus)
            },
            {
                path: 'attendance',
                loadComponent: () => import('./attendance/attendance').then(m => m.Attendance)
            },
            {
                path: 'study-plan',
                loadComponent: () => import('./study-plan/study-plan').then(m => m.StudyPlan)
            }
        ]
    }
];
