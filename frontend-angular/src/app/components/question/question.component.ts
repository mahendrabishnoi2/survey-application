import { Component, OnInit, Input } from '@angular/core';
import { QuestionBase } from 'src/app/common/question-base';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  @Input() question: QuestionBase<string>;
  @Input() form: FormGroup;
  constructor() { }

  ngOnInit(): void {
  }

  get isValid() { return this.form.controls[this.question.key].valid; }

}
