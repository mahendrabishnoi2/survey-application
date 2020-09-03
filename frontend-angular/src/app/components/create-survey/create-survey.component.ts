import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { QuestionsOptions } from 'src/app/common/questions-options';
import { InputTypes } from 'src/app/common/input-types';
import { CreateNewFormService } from 'src/app/services/create-new-form.service';


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

  constructor(private fb: FormBuilder, private newFormService: CreateNewFormService) { }

  newSurveyForm: FormGroup;
  surveyQuestionFormArray: FormArray;

  ngOnInit(): void {
    this.initMap();
    this.minDate = this.getMinDate();
    this.formInit(new SurveyTemp());
    this.componentToShow = "create-survey";
  }

  formInit(survey: SurveyTemp) {

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
  }

  addQuestion(): void {
    this.newFormService.toggleComponent();
  }

  showForm() {
    console.log(this.newSurveyForm);
  }

  getEnabledComponent(): string {
    return this.newFormService.enabledComponent();
  }
}

class Ques {
  id: number;
  question: string;
  type: string;
  options: string[];
  validation: string;
}

class SurveyTemp {
  id: number;
  name: string;
  questions: Ques[];
  created: Date;
  validTill: Date;
  description: string;
}

