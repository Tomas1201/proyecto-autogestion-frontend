import { Routes } from '@angular/router';
import { MainView } from './admin-panel/main-view/main-view';
import { CareerSelfManagement } from './admin-panel/career/career-self-management';
import { ProfessorSelfManagement } from './admin-panel/professor/professor-self-management';
import { StudentSelfManagement } from './admin-panel/student/student-self-management';
import { SubjectSelfManagement } from './admin-panel/subject/subject-self-management';
import { AddCareer } from './admin-panel/career/add-career/add-career';
export const routes: Routes = [{path:'', redirectTo:'/MainView', pathMatch:'full'},

{path:'MainView', component: MainView},
{ path: 'Career', component: CareerSelfManagement},
{ path: 'Professor', component: ProfessorSelfManagement},
{ path: 'Student', component: StudentSelfManagement},
{ path: 'Subject', component: SubjectSelfManagement},
{path:'AddCareer', component:AddCareer}


];