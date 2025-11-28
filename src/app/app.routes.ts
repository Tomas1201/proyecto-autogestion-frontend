import { Routes } from '@angular/router';
import { MainView } from './admin-panel/main-view/main-view';
import { Career } from './admin-panel/career/career';
import { Professor } from './admin-panel/professor/professor';
import { Student } from './admin-panel/student/student';
import { Subject } from './admin-panel/subject/subject';
import { AddCareer } from './admin-panel/career/add-career/add-career';
import { Login } from './login/login';

export const routes: Routes = [
    { path: '', redirectTo: '/Login', pathMatch: 'full' },
    { path: 'Login', component: Login },
    { path: 'MainView', component: MainView },
    { path: 'Career', component: Career },
    { path: 'Professor', component: Professor },
    { path: 'Student', component: Student },
    { path: 'Subject', component: Subject },
    { path: 'AddCareer', component: AddCareer },
    {
        path: 'student-panel',
        loadChildren: () => import('./student-panel/student.routes').then(m => m.STUDENT_ROUTES)
    },
    {
        path: 'professor-panel',
        loadChildren: () => import('./professor-panel/professor.routes').then(m => m.PROFESSOR_ROUTES)
    }
];