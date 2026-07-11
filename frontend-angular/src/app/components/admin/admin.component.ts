import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DbServiceService } from 'src/app/services/db-service.service';
import { SurveyHeader } from 'src/app/common/survey-header';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: false
})
export class AdminComponent implements OnInit {

  surveyHeaders: SurveyHeader[] = [];
  constructor(private dbService: DbServiceService, private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listSurveys();
  }

  listSurveys(): void {
    this.dbService.getSurveyList().subscribe(
      (data: any) => {
        this.surveyHeaders = data;
        this.cdr.detectChanges();
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
