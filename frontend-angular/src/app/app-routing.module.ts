import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSurveyComponent } from './components/user-survey/user-survey.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { TakeSurveyComponent } from './components/take-survey/take-survey.component';


const routes: Routes = [
  { path: 'takeSurvey/:id', component:  TakeSurveyComponent},
  { path: 'login', component: AdminLoginComponent},
  { path: 'admin', component: AdminComponent },
  { path: 'survey/:id', component: UserSurveyComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
