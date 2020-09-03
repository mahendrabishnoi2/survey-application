import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionsOptions } from 'src/app/common/questions-options';

@Component({
  selector: 'app-add-options',
  templateUrl: './add-options.component.html',
  styleUrls: ['./add-options.component.css']
})
export class AddOptionsComponent implements OnInit {

  options: Array<string> = [];
  newOption: string = "";
  isDuplicate: boolean = false;
  duplicateMessage: string = "This option is already present."

  constructor() { }

  ngOnInit(): void {
  }

  addOption() {
    this.options.forEach(option => {
      if (option === this.newOption) this.isDuplicate = true;
    })
    if (!this.isDuplicate) {
      this.options.push(this.newOption);
      this.newOption = "";
    }
    console.log(this.isDuplicate);
  }

  log(x) {
    console.log(x);
  }

}
