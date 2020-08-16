import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { UserSurveyComponent } from './components/user-survey/user-survey.component';
import { AdminComponent } from './components/admin/admin.component';
import { ListSurveysComponent } from './components/list-surveys/list-surveys.component';
import { TakeSurveyComponent } from './components/take-survey/take-survey.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    UserSurveyComponent,
    AdminComponent,
    ListSurveysComponent,
    TakeSurveyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
