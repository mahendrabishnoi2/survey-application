import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SurveyHeader } from 'src/app/common/survey-header';
import { DbServiceService } from 'src/app/services/db-service.service';
import { Questions } from 'src/app/common/questions';
import { InputTypes } from 'src/app/common/input-types';
import { QuestionsOptions } from 'src/app/common/questions-options';
import { timer } from 'rxjs';


@Component({
  selector: 'app-take-survey',
  templateUrl: './take-survey.component.html',
  styleUrls: ['./take-survey.component.css']
})
export class TakeSurveyComponent implements OnInit {

  id: number;
  headers: SurveyHeader;
  questions: Questions[] = [];
  questionTypes: InputTypes[] = [];
  questionOptions: QuestionsOptions[][] = [];

  constructor(private route: ActivatedRoute, private dbService: DbServiceService) {
  }

  async ngOnInit(): Promise<void> {
    this.getQuestions();
    // this.getSurvey();
  }

  getQuestions(): void {
    // get survey id
    this.id = +this.route.snapshot.paramMap.get('id');

    // get survey details
    this.dbService.getSurveyHeaderById(this.id).subscribe(
      data => {
        this.headers = data;
      }
    );

    // get questions
    this.dbService.getQuestions(this.id).subscribe(
      data => {
        data.forEach(element => {
          this.questions.push(new Questions(element.id, element.questionName));
          // get type of question
          this.dbService.getInputType(element.id).subscribe(
            data => {
              this.questionTypes.push(data);

              // if mcq type question then get options
              if(data.inputTypeName == "radio" || data.inputTypeName == "checkbox_multiselect") {
                this.dbService.getQuestionsOptions(element.id).subscribe(
                  data => {
                    this.questionOptions.push(data);
                  }
                );
              } else {
                this.questionOptions.push(null);
              }
            }
          );

          console.log(element.id + " " + element.questionName);
        })

        console.log(JSON.stringify(data));
      }
    );

  }

  // getSurvey(): void {

  //   console.log("questions length: ");

  //   console.log(this.questions.length);

  //   // go through each question and get its type and options if available
  //   for (let i = 0; i < this.questions.length; i++) {
  //     // let id = this.questions[i].id;
  //     // // get input type
  //     // this.dbService.getInputType(id).subscribe(
  //     //   data => {
  //     //     this.questionTypes.push(data);
  //     //   }
  //     // );

  //     // // if question type is not text box, get options for this question 
  //     // if (this.questionTypes[i].inputTypeName == "radio" || this.questionTypes[i].inputTypeName == "checkbox_multiselect") {
  //     //   this.dbService.getQuestionsOptions(id).subscribe(
  //     //     data => {
  //     //       this.questionOptions.push(data);
  //     //     }
  //     //   );
  //     // } else {
  //     //   this.questionOptions.push(null);
  //     // }
  //     console.log(i);

  //   }

  //   console.log("done loading questions");

  // }
}
