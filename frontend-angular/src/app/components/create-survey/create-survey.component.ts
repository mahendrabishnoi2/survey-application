import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, Form } from '@angular/forms';
import { QuestionsOptions } from 'src/app/common/questions-options';
import { InputTypes } from 'src/app/common/input-types';
import { CreateNewFormService } from 'src/app/services/create-new-form.service';
import { SurveyFull } from 'src/app/common/survey-full';
import { Questions } from 'src/app/common/questions';
import { DbServiceService } from 'src/app/services/db-service.service';


@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})
export class CreateSurveyComponent implements OnInit {

  qTypeMap: Map<string, string>;
  validationMap: Map<string, string>;
  minDate: string;
  maxDate: Date;
  componentToShow: string;

  constructor(private fb: FormBuilder, private newFormService: CreateNewFormService, private dbService: DbServiceService) { }

  newSurveyForm: FormGroup;
  surveyQuestionFormArray: FormArray;

  ngOnInit(): void {
    this.initMap();
    this.minDate = this.getMinDate();
    this.formInit(new SurveyFull());
    this.componentToShow = "create-survey";
  }

  formInit(survey: SurveyFull) {

    this.surveyQuestionFormArray = new FormArray([]);

    // this block is not required, remove it later, we are handling this in add-question component
    // survey.questions?.forEach((question: Ques) => {
    //   let questionForm = this.fb.group({
    //     question: [question.question, [Validators.required]],
    //     responseType: [question.type, [Validators.required]],
    //     validation: [question.validation],
    //     options: [question.options],
    //     id: [question.id]
    //   });
    //   this.surveyQuestionFormArray.push(questionForm);
    // });

    this.newSurveyForm = this.fb.group({
      surveyName: [survey.name, [Validators.required]],
      questions: [this.surveyQuestionFormArray],
      created: [survey.created],
      validTill: [survey.validTill],
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

    let year: string = _year.toString();
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
    let survey = this.createSurveyObjectFromForm();
    this.dbService.saveNewSurvey(survey).subscribe();
  }

  addQuestion(): void {
    this.newFormService.toggleComponent();
  }

  showForm() {
    console.log(this.newSurveyForm.value);
  }

  getEnabledComponent(): string {
    return this.newFormService.enabledComponent();
  }

  createSurveyObjectFromForm(): SurveyFull {
    let survey: SurveyFull = new SurveyFull();
    survey.created = new Date();
    survey.name  = this.newSurveyForm.value.surveyName;
    survey.description = this.newSurveyForm.value.description;
    survey.validTill = this.newSurveyForm.value.validTill;
    survey.questions = [];

    let questionsArray = this.newSurveyForm.value.questions.value;

    questionsArray.forEach((question, index) => {
      let q: Questions = new Questions(index, question.question);
      let type: InputTypes = new InputTypes();
      type.id = 0;
      type.typeName = question.questionType
      q.type = type;
      q.validation = question.validation;
      let optionArray = question.options.value;
      q.options = [];

      optionArray.forEach((opt, id) => {
        let o: QuestionsOptions = new QuestionsOptions();
        o.id = opt.id;
        o.name = opt.name;
        q.options.push(o);
      })

      survey.questions.push(q);
    });

    return survey;
  }
}