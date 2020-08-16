import { Component, OnInit } from '@angular/core';
import { SurveyHeader } from 'src/app/common/survey-header';
import { DbServiceService } from 'src/app/services/db-service.service';

@Component({
  selector: 'app-list-surveys',
  templateUrl: './list-surveys.component.html',
  styleUrls: ['./list-surveys.component.css']
})
export class ListSurveysComponent implements OnInit {

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
