import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSurveyComponent } from './components/user-survey/user-survey.component';


const routes: Routes = [
  { path: 'survey/:id', component: UserSurveyComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
