import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { QuestionsOptions } from 'src/app/common/questions-options';
import { InputTypes } from 'src/app/common/input-types';
import { CreateNewFormService } from 'src/app/services/create-new-form.service';
import { SurveyFull } from 'src/app/common/survey-full';
import { Questions } from 'src/app/common/questions';
import { DbServiceService } from 'src/app/services/db-service.service';
import { SurveyHeader } from 'src/app/common/survey-header';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-survey',
    templateUrl: './create-survey.component.html',
    styleUrls: ['./create-survey.component.css'],
    standalone: false
})
export class CreateSurveyComponent implements OnInit {

  qTypeMap!: Map<string, string>;
  validationMap!: Map<string, string>;
  minDate!: string;
  maxDate!: Date;
  componentToShow!: string;
  questionsForDisplay: any;
  submittedSurveyDetails!: SurveyHeader;
  surveyLink = "";

  constructor(private fb: FormBuilder, private newFormService: CreateNewFormService, private dbService: DbServiceService,
    private authService: AuthService, private router: Router) { }

  newSurveyForm!: FormGroup;
  surveyQuestionFormArray!: FormArray;

  ngOnInit(): void {
    if (!this.isLoggedIn()) this.redirect();
    this.initMap();
    this.newFormService.reset();
    this.minDate = this.getMinDate();
    this.formInit(new SurveyFull());
    this.componentToShow = "create-survey";
    this.questionsForDisplay = this.newSurveyForm.value.questions.value as any[];
  }

  formInit(survey: SurveyFull) {
    this.surveyQuestionFormArray = this.fb.array([]);

    this.newSurveyForm = this.fb.group({
      surveyName: [survey.name, [Validators.required]],
      questions: [this.surveyQuestionFormArray],
      created: [survey.created],
      validTill: [survey.validTill, [Validators.required]],
      description: [survey.description, [Validators.required]]
    });
  }

  private initMap(): void {
    this.qTypeMap = new Map();
    this.qTypeMap.set("oneline", "Single Line Answer");
    this.qTypeMap.set("multiline", "Multiple Line Answer");
    this.qTypeMap.set("radio", "Radio Button");
    this.qTypeMap.set("checkbox_multiselect", "Checkbox Type");

    this.validationMap = new Map();
    this.validationMap.set("alpha", "Alphabets Only");
    this.validationMap.set("alpha-numeric", "Alpha Numberic Values");
    this.validationMap.set("numeric", "Numbers only");
    this.validationMap.set("", "No Validation");
  }

  getMinDate(): string {
    const _year = new Date().getFullYear();
    const _month = new Date().getMonth() + 1;
    const _date = new Date().getDate();

    const year: string = _year.toString();
    let month: string = _month.toString();
    let date: string = _date.toString();
    if (_month < 10) {
      month = `0${_month}`;
    }
    if (_date < 10) {
      date = `0${_date}`;
    }
    return `${year}-${month}-${date}`;
  }

  submitSurvey(): void {
    const survey = this.createSurveyObjectFromForm();
    this.dbService.saveNewSurvey(survey).subscribe({
      next: (data: any) => {
        this.submittedSurveyDetails = data;
        this.surveyLink = `${window.location.origin}/#/takeSurvey/${data.id}`;
        this.newFormService.success();
      },
      error: (_err: any) => {}

    });
  }

  addQuestion(): void {
    this.newFormService.toggleComponent();
    this.questionsForDisplay = this.newSurveyForm.value.questions.value as any[];
  }

  getEnabledComponent(): string {
    return this.newFormService.enabledComponent();
  }

  createSurveyObjectFromForm(): SurveyFull {
    const survey: SurveyFull = new SurveyFull();
    survey.id = 0;
    survey.created = new Date();
    survey.name = this.newSurveyForm.value.surveyName;
    survey.description = this.newSurveyForm.value.description;
    survey.validTill = new Date(this.newSurveyForm.value.validTill);
    survey.questions = [];

    const questionsArray = this.newSurveyForm.value.questions.value;

    questionsArray.forEach((question: any, index: number) => {
      const q: Questions = new Questions(index, question.question);
      const type: InputTypes = new InputTypes();
      type.id = 0;
      type.typeName = question.questionType
      q.type = type;
      q.validation = question.validation;
      const optionArray = question.options.value;
      q.options = [];

      optionArray.forEach((opt: any, id: number) => {
        const o: QuestionsOptions = new QuestionsOptions();
        o.id = opt.id;
        o.name = opt.name;
        q.options.push(o);
      })

      survey.questions.push(q);
    });

    return survey;
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.surveyLink);
  }

  isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  redirect(): void {
    this.router.navigate(['login']);
  }
}