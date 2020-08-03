import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-survey',
  templateUrl: './user-survey.component.html',
  styleUrls: ['./user-survey.component.css']
})
export class UserSurveyComponent implements OnInit {

  surveyId: number;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

}
