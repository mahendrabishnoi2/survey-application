import { Component, OnInit } from '@angular/core';
import { DbServiceService } from 'src/app/services/db-service.service';
import { SurveyHeader } from 'src/app/common/survey-header';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  surveyHeaders: SurveyHeader[];
  constructor(private dbService: DbServiceService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.listSurveys();
    console.log(this.authService.getAdmin());
    // console.log(this.authService.isLoggedIn);
  }

  listSurveys(): void {
    this.dbService.getSurveyList().subscribe(
      data => {
        this.surveyHeaders = data;
      }
    );
  }

  isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  redirect(): void {
    this.router.navigate(['login']);
  }

}
