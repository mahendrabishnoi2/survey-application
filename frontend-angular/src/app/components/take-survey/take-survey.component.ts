import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { DbServiceService } from 'src/app/services/db-service.service';
import { SurveyFull } from 'src/app/common/survey-full';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/common/question-base';
import { QuestionControlService } from 'src/app/services/question-control.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-take-survey',
  templateUrl: './take-survey.component.html',
  styleUrls: ['./take-survey.component.css']
})
export class TakeSurveyComponent implements OnInit {

  surveyId: number;
  details: FormGroup;
  inputPersonalDetails: boolean = true;
  message: string = "";
  questions: QuestionBase<string>[];
  surveyExpired: Boolean;

  // headers: SurveyHeader;
  // questions: Questions[] = [];
  // questionTypes: InputTypes[] = [];
  // questionOptions: QuestionsOptions[][] = [];

  survey: SurveyFull;

  constructor(private route: ActivatedRoute, private dbService: DbServiceService,
    private fb: FormBuilder, private qcs: QuestionControlService, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.auth.logout();
    this.surveyId = +this.route.snapshot.paramMap.get('id');
    this.getSurvey();
    this.createForm();
  }

  createForm(): void {
    this.details = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      submitDate: ['']
    })
  }

  getSurvey(): void {
    this.dbService.getSurvey(this.surveyId).subscribe(
      data => {
        this.survey = data;
        this.surveyExpired = this.compareDate(data.validTill as Date);
        console.log(JSON.stringify(data));
      }
    )
  }

  compareDate(expire: any) {
    let expiry: Date = new Date(expire.toString().split('T')[0]);
    let today: Date = new Date();
    let todayYear = today.getFullYear();
    let todayMonth = today.getMonth() + 1;
    let todayDate = today.getDate();
    let expiryYear = expiry.getFullYear();
    let expiryMonth = expiry.getMonth() + 1;
    let expiryDate = expiry.getDate();
    console.log(`${todayYear}-${todayMonth}-${todayDate}`);
    if (todayYear > expiryYear) return true;
    if (todayYear === expiryYear) {
      if (todayMonth > expiryMonth) return true;
      if (todayMonth === expiryMonth) {
        if (todayDate > expiryDate) return true;
      }
    }
    return false;
  }


  onSubmit(): void {
    this.questions = this.qcs.getQuestions(this.survey);
    this.dbService.verifyUser(this.surveyId, this.details.value).subscribe(
      data => {
        if (data) {
          // already taken survey (data: boolean)
          this.message = "You have already taken this survey!";
        } else {
          this.inputPersonalDetails = false;
        }
        console.log(data);
      }
    )
  }
}
