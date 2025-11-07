import { Routes } from '@angular/router';
import { MainView } from './main-view/main-view';
import { CareerSelfManagement } from './career-self-management/career-self-management';
import { ProfessorSelfManagement } from './professor-self-management/professor-self-management';
import { StudentSelfManagement } from './student-self-management/student-self-management';
import { SubjectSelfManagement } from './subject-self-management/subject-self-management';

export const routes: Routes = [{path:'', redirectTo:'/MainView', pathMatch:'full'},

{path:'MainView', component: MainView},
{ path: 'Career', component: CareerSelfManagement},
{ path: 'Professor', component: ProfessorSelfManagement},
{ path: 'Student', component: StudentSelfManagement},
{ path: 'Subject', component: SubjectSelfManagement},


];