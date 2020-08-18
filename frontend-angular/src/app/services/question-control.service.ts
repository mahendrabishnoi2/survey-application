import { Injectable } from '@angular/core';
import { QuestionBase } from '../common/question-base';
import { QuestionText } from '../common/question-text';
import { QuestionCheckbox } from '../common/question-checkbox';
import { QuestionRadio } from '../common/question-radio';
import { SurveyFull } from '../common/survey-full';
import { QuestionsOptions } from '../common/questions-options';
import { FormArray, FormControl, Validators, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class QuestionControlService {

  constructor() { }

  getQuestions(SurveyFull: SurveyFull): QuestionBase<string>[] {
    const questionsTemp = [];
    const temp = SurveyFull.questions;
    temp.forEach(q => {
      let ques;
      // oneline
      // multiline
      // radio
      // checkbox_multiselect
      if (q.type.typeName === "oneline" || q.type.typeName === "multiline") {
        ques = new QuestionText({
          key: q.id.toString(),
          label: q.question,
        });
      } else if (q.type.typeName === "checkbox_multiselect") {
        ques = new QuestionCheckbox({
          key: q.id.toString(),
          label: q.question,
          options: this.getOptions(q.options)
        })
      } else if (q.type.typeName === "radio") {
        ques = new QuestionRadio({
          key: q.id.toString(),
          label: q.question,
          options: this.getOptions(q.options)
        })
      }
      questionsTemp.push(ques);
    });
    return questionsTemp;
  }

  getOptions(options: QuestionsOptions[]): { key: string, value: string }[] {
    const out = [];
    options.forEach(option => {
      out.push({key:option.id.toString(), value: option.name});
    })
    return out;
  }

  toFormGroup(questions: QuestionBase<string>[]) {
    const group: any = {};

    questions.forEach(question => {
      // checkbox because we set controlType as checkbox in QuestionCheckbox class even though we are getting
      // checkbox_multiselect from database
      if (question.controlType === "checkbox") {
        group[question.key] = new FormArray([]);
        this.addCheckboxes(question.options, group[question.key]);
      } else {
        group[question.key] = question.required
          ? new FormControl(question.value || "", Validators.required)
          : new FormControl(question.value || "");
      }
    });
    return new FormGroup(group);
  }

  private addCheckboxes(options: {key: string, value: string}[], formArray: FormArray) {
    options.forEach(() => formArray.push(new FormControl(false)));
  }
}
