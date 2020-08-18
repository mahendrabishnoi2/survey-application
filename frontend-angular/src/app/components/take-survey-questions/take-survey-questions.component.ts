import { Component, OnInit, Input } from '@angular/core';
import { SurveyFull } from 'src/app/common/survey-full';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { QuestionBase } from 'src/app/common/question-base';
import { QuestionText } from 'src/app/common/question-text';
import { QuestionCheckbox } from 'src/app/common/question-checkbox';
import { QuestionsOptions } from 'src/app/common/questions-options';
import { QuestionRadio } from 'src/app/common/question-radio';
import { QuestionControlService } from 'src/app/services/question-control.service';

@Component({
  selector: 'app-take-survey-questions',
  templateUrl: './take-survey-questions.component.html',
  styleUrls: ['./take-survey-questions.component.css']
})
export class TakeSurveyQuestionsComponent implements OnInit {

  @Input() survey: SurveyFull;
  @Input() details: FormGroup;
  @Input() questions: QuestionBase<string>[];
  form: FormGroup;
  payLoad = "";
  // questions: QuestionBase<string>[];

  constructor(private fb: FormBuilder, private qcs: QuestionControlService) { }

  ngOnInit(): void {
    // this.questions = this.qcs.getQuestions(this.survey);
    console.log(this.questions);
    this.form = this.qcs.toFormGroup(this.questions);
    console.log(this.form);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }

}
