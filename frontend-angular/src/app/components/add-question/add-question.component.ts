import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CreateNewFormService } from 'src/app/services/create-new-form.service';
import { Questions } from 'src/app/common/questions';

@Component({
    selector: 'app-add-question',
    templateUrl: './add-question.component.html',
    styleUrls: ['./add-question.component.css'],
    standalone: false
})
export class AddQuestionComponent implements OnInit {

  @Input() surveyQuestionFormArray!: FormArray;
  @Input() qType!: Map<string, string>;
  @Input() valType!: Map<string, string>;

  errorMessage = "";
  questionForm!: FormGroup;

  // for adding new options
  options: string[] = [];
  newOption = "";
  isDuplicate = false;
  duplicateMessage = "This option is already present."
  hasError = false;

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
    const options = this.fb.array([]);
    this.questionForm = this.fb.group({
      question: [question.question, [Validators.required]],
      questionType: [question.type, [Validators.required]],
      validation: [""],
      options: [options],
      id: [question.id]
    });
  }

  addQuestion(): void {
    this.hasError = false;
    this.clearFields();
    this.addOptionsToForm();
    const hasOptions = !(this.questionForm.value.questionType == "oneline" ||
      this.questionForm.value.questionType == "multiline");

    // if type is radio or checkbox, then make sure at-least 2 options are present
    if (hasOptions && this.options.length < 2) {
      this.hasError = true;
      this.errorMessage = "Please add at-least 2 options";
    }
    if (!this.hasError) {
      this.newFormService.toggleComponent();
      this.surveyQuestionFormArray.push(this.questionForm);
      console.log('Question added, array length:', this.surveyQuestionFormArray.length);
    }
  }

  private addOptionsToForm() {
    const optionsFormArray = new FormArray<any>([]);

    // for each option create a form group and add it to form array
    this.options.forEach((option, index) => {
      optionsFormArray.push(this.fb.group({
        id: [index],
        name: [option]
      }));
    });

    this.questionForm.get('options')?.setValue(optionsFormArray);
  }

  private clearFields() {
    if (this.questionForm.value.questionType === "oneline" || this.questionForm.value.questionType === "multiline") {
      this.clearOptions();
    } else {
      this.clearValidation();
    }
  }

  private clearValidation() {
    this.questionForm.get('validation')?.setValue("");
  }

  private clearOptions() {
    this.questionForm.get('options')?.setValue(this.fb.array([]));
  }

  deleteOption(index: number) {
    this.options.splice(index, 1);
  }
}
