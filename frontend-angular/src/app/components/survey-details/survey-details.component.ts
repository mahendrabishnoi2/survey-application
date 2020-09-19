import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbServiceService } from 'src/app/services/db-service.service';
import { Respondant } from 'src/app/common/respondant';

@Component({
  selector: 'app-survey-details',
  templateUrl: './survey-details.component.html',
  styleUrls: ['./survey-details.component.css']
})
export class SurveyDetailsComponent implements OnInit {

  surveyId: number;
  respondents: Respondant[];

  constructor(private route: ActivatedRoute, private dbService: DbServiceService) { }

  ngOnInit(): void {
    this.surveyId = +this.route.snapshot.paramMap.get('id');
    this.getSurveyDetails();
    // console.log(this.surveyId);
  }

  getSurveyDetails() {
    this.dbService.getSurveyRespondents(this.surveyId).subscribe(
      data => {
        this.respondents = data;
        console.log(this.respondents);
      }
    )

  }

}
