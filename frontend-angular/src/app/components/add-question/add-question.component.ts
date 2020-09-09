import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { InputTypes } from 'src/app/common/input-types';
import { CreateNewFormService } from 'src/app/services/create-new-form.service';
import { QuestionsOptions } from 'src/app/common/questions-options';
import { Questions } from 'src/app/common/questions';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  @Input() surveyQuestionFormArray: FormArray;
  @Input() qType: Map<string, string>;
  @Input() valType: Map<string, string>;
  // @Output() questionFormOut = new EventEmitter<FormGroup>();

  errorMessage: string = "";
  questionForm: FormGroup;

  // for adding new options
  options: Array<string> = [];
  newOption: string = "";
  isDuplicate: boolean = false;
  duplicateMessage: string = "This option is already present."
  hasError: boolean = false;

  constructor(private fb: FormBuilder, private newFormService: CreateNewFormService) { }

  ngOnInit(): void {
    this.formInit(new Questions(0, ""));
  }

  addOption() {
    this.isDuplicate = false;
    this.options.forEach(option => {
      if (option === this.newOption) this.isDuplicate = true;
    })
    if (!this.isDuplicate) {
      this.options.push(this.newOption);
      this.newOption = "";
    }
  }

  formInit(question: Questions) {
    let options = new FormArray([]);
    this.questionForm = this.fb.group({
      question: [question.question, [Validators.required]],
      questionType: [question.type, [Validators.required]],
      validation: [""],
      options: [options],
      id: [question.id]
    });
  }

  showForm(): void {
    console.log(this.questionForm);
  }

  addQuestion(): void {
    this.hasError = false;
    this.clearFields();
    this.addOptionsToForm();
    let hasOptions = !(this.questionForm.value.questionType == "oneline" ||
      this.questionForm.value.questionType == "multiline");

    // if type is radio or checkbox, then make sure at-least 2 options are present
    if (hasOptions && this.options.length < 2) {
      this.hasError = true;
      this.errorMessage = "Please add at-least 2 options";
    }
    if (!this.hasError) {
      this.newFormService.toggleComponent();
      this.surveyQuestionFormArray.push(this.questionForm);
    }
  }

  private addOptionsToForm() {
    let optionsFormArray: FormArray = new FormArray([]);

    // for each option create a form group and add it to form array
    this.options.forEach((option, index) => {
      optionsFormArray.push(this.fb.group({
        id: [index],
        name: [option]
      }));
    });

    this.questionForm.controls.options.setValue(optionsFormArray);
  }

  private clearFields() {
    if (this.questionForm.value.questionType === "oneline" || this.questionForm.value.questionType === "multiline") {
      this.clearOptions();
    } else {
      this.clearValidation();
    }
  }

  private clearValidation() {
    this.questionForm.controls.validation.setValue("");
  }

  private clearOptions() {
    this.questionForm.controls.options.setValue(new FormArray([]));
  }

  deleteOption(index: number) {
    this.options.splice(index, 1);
  }
}
