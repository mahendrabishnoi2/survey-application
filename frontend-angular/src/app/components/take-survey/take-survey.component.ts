import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbServiceService } from 'src/app/services/db-service.service';
import { SurveyFull } from 'src/app/common/survey-full';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/common/question-base';
import { QuestionControlService } from 'src/app/services/question-control.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-take-survey',
    templateUrl: './take-survey.component.html',
    styleUrls: ['./take-survey.component.css'],
    standalone: false
})
export class TakeSurveyComponent implements OnInit {

  surveyId!: number;
  details!: FormGroup;
  inputPersonalDetails = true;
  message = "";
  questions: QuestionBase<string>[] = [];
  surveyExpired!: boolean;
  survey!: SurveyFull;

  constructor(private route: ActivatedRoute, private dbService: DbServiceService,
    private fb: FormBuilder, private qcs: QuestionControlService, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.auth.logout();
    const idParam = this.route.snapshot.paramMap.get('id');
    this.surveyId = idParam ? +idParam : 0;
    this.getSurvey();
    this.createForm();
  }

  createForm(): void {
    this.details = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      submitDate: ['']
    })
  }

  getSurvey(): void {
    this.dbService.getSurvey(this.surveyId).subscribe(
      (data: any) => {
        this.survey = data;
        this.surveyExpired = this.compareDate(data.validTill as Date);
      }
    )
  }

  compareDate(expire: any) {
    const expiry: Date = new Date(expire.toString().split('T')[0]);
    const today: Date = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();
    const expiryYear = expiry.getFullYear();
    const expiryMonth = expiry.getMonth() + 1;
    const expiryDate = expiry.getDate();
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
      (data: any) => {
        if (data) {
          this.message = "You have already taken this survey!";
        } else {
          this.inputPersonalDetails = false;
        }
      }
    )
  }
}
