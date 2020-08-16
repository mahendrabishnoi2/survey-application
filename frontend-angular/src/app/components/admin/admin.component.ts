import { Component, OnInit } from '@angular/core';
import { DbServiceService } from 'src/app/services/db-service.service';
import { SurveyHeader } from 'src/app/common/survey-header';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  surveyHeaders: SurveyHeader[];
  constructor(private dbService: DbServiceService) { }

  ngOnInit(): void {
    this.listSurveys();
  }

  listSurveys(): void {
    this.dbService.getSurveyList().subscribe(
      data => {
        this.surveyHeaders = data;
      }
    );
  }

}
