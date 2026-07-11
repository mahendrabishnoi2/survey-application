import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { SurveyFull } from 'src/app/common/survey-full';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { QuestionBase } from 'src/app/common/question-base';
import { QuestionControlService } from 'src/app/services/question-control.service';
import { SurveyResponse } from 'src/app/common/survey-response';
import { Answer } from 'src/app/common/answer';
import { DbServiceService } from 'src/app/services/db-service.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-take-survey-questions',
    templateUrl: './take-survey-questions.component.html',
    styleUrls: ['./take-survey-questions.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TakeSurveyQuestionsComponent implements OnInit {

  @Input() survey!: SurveyFull;
  @Input() details!: FormGroup;
  @Input() questions!: QuestionBase<string>[];
  form!: FormGroup;
  // payLoad = "";
  surveyResponse!: SurveyResponse;
  // questions: QuestionBase<string>[];

  constructor(private fb: FormBuilder, private qcs: QuestionControlService,
    private dbService: DbServiceService, private router: Router) { }

  ngOnInit(): void {
    // this.questions = this.qcs.getQuestions(this.survey);
    console.log(this.questions);
    this.form = this.qcs.toFormGroup(this.questions);
    console.log(this.form);
    console.log(this.details);
  }

  private createObject(): void {
    // create survey response object to send to backend 
    const answers: Answer[] = [];
    let answer: Answer;
    // we need to find selected ids and labels in case of checkbox question
    this.questions.forEach(question => {
      const id = question.key;
      const qId: number = +question.key;
      const qText: string = question.label;
      const qTypeText: string = question.controlType;
      let selectedOptionIds = "";
      let answerText = "";
      const formControl = this.form.get(id);
      if (formControl) {
        if (qTypeText === "radio") {  // working
          // form contains option id, get id of selected option from form and use that
          // id to get text of option
          selectedOptionIds = formControl.value;
          const options = question.options;
          answerText = this.getValueFromKey(options, selectedOptionIds);
        } else if (qTypeText === "checkbox") {  // working
          // form contains an array of boolean
          const isChecked: boolean[] = formControl.value;
          const options = question.options;
          const selectedOptions: number[] = [];  // array of id of selected options
          for (let i = 0; i < options.length; i++) {
            if (isChecked[i]) {
              selectedOptions.push(+options[i].key);
            }
          }

          // if one or more checkbox selected, do further processing
          if (selectedOptions.length > 0) {
            selectedOptionIds = selectedOptions[0].toString();
            answerText = this.getValueFromKey(options, selectedOptions[0].toString());

            for (let i = 1; i < selectedOptions.length; i++) {
              selectedOptionIds += " " + selectedOptions[i];
              answerText += " | " + this.getValueFromKey(options, selectedOptions[i].toString());
            }
          }
        } else { // working
          answerText = formControl.value;
        }
      }

      answers.push(new Answer(qId, qText, qTypeText, answerText, selectedOptionIds));
    });

    this.surveyResponse = {
      id: this.survey.id,
      fullName: this.details.get('fullName')?.value || '',
      email: this.details.get('email')?.value || '',
      submitDate: new Date(),
      answers: answers
    }
  }

  onSubmit() {
    // log answers given by users
    console.log(this.form.value);

    // create an object from form values, will be sent to database
    this.createObject();

    // use dbservice to save user's response
    this.dbService.saveSurveyResponse(this.surveyResponse).subscribe(
      (data: any) => {
        console.log(data);
      }
    )

    // the object which we send to db service
    // console.log(this.surveyResponse);

    // after survey is completed, redirect to a new page
    this.router.navigate(['surveycompleted']);

    // can we create a new array of response to questions
    // for each respondant
    /*
    {
      fullName,
      email,
      submitDate,
      answers[]
    }
  
    // each answer
    {
      questionId
      questionType
      answer: // text for all types, for multiple choice answers we can save with some delimiter
      selectedOptionIds: 
    }
    */
  }

  private getValueFromKey(options: { key: string, value: string }[], key: string): string {
    for (let i = 0; i < options.length; i++) {
      if (options[i].key === key) {
        return options[i].value;
      }
    }
    return "Error: Key Not Found";
  }

}
