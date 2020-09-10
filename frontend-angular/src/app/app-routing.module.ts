import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSurveyComponent } from './components/user-survey/user-survey.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { TakeSurveyComponent } from './components/take-survey/take-survey.component';
import { CreateSurveyComponent } from './components/create-survey/create-survey.component';
import { AddAdminComponent } from './components/add-admin/add-admin.component';


const routes: Routes = [
  { path: 'addAdmin', component: AddAdminComponent},
  { path: 'createSurvey', component: CreateSurveyComponent }, 
  { path: 'takeSurvey/:id', component:  TakeSurveyComponent},
  { path: 'login', component: AdminLoginComponent},
  { path: 'admin', component: AdminComponent },
  { path: 'surveycompleted', component: UserSurveyComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
