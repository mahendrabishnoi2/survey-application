import { Injectable } from '@angular/core';
import { QuestionBase } from '../common/question-base';
import { QuestionText } from '../common/question-text';
import { QuestionCheckbox } from '../common/question-checkbox';
import { QuestionRadio } from '../common/question-radio';
import { SurveyFull } from '../common/survey-full';
import { QuestionsOptions } from '../common/questions-options';
import { FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { QuestionMultiLine } from '../common/question-multi-line';

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
      if (q.type.typeName === "oneline") {
        ques = new QuestionText({
          key: q.id.toString(),
          validation: q.validation,
          label: q.question,
        });
      } else if(q.type.typeName === "multiline") {
        ques = new QuestionMultiLine({
          key: q.id.toString(),
          validation: q.validation,
          label: q.question,
        });
      }else if (q.type.typeName === "checkbox_multiselect") {
        ques = new QuestionCheckbox({
          key: q.id.toString(),
          label: q.question,
          validation: q.validation,
          options: this.getOptions(q.options)
        })
      } else if (q.type.typeName === "radio") {
        ques = new QuestionRadio({
          key: q.id.toString(),
          label: q.question,
          validation: q.validation,
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
        if (question.validation != "" || question.validation != null) {
          if (question.validation === "alpha") {
            group[question.key] = new FormControl(question.value || "", [Validators.required, Validators.pattern('[a-zA-Z ]+')]);
          } else if (question.validation === "numeric") {
            group[question.key] = new FormControl(question.value || "", [Validators.required, Validators.pattern('[0-9]+')]);
          } else if (question.validation === "alpha-numeric"){  // alpha-numeric
            group[question.key] = new FormControl(question.value || "", [Validators.required, Validators.pattern('[a-zA-Z0-9_]+')]);
          } else {
            group[question.key] = new FormControl(question.value || "", [Validators.required]);
          }
        } else {
          group[question.key] = new FormControl(question.value || "", Validators.required);
        }
      }
    });
    return new FormGroup(group);
  }

  private addCheckboxes(options: {key: string, value: string}[], formArray: FormArray) {
    options.forEach(() => formArray.push(new FormControl(false)));
  }
}
