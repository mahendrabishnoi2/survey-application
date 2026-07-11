import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { AddQuestionComponent } from './add-question.component';
import { CreateNewFormService } from 'src/app/services/create-new-form.service';

describe('AddQuestionComponent', () => {
  let component: AddQuestionComponent;
  let fixture: ComponentFixture<AddQuestionComponent>;
  let formServiceSpy: jasmine.SpyObj<CreateNewFormService>;

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('CreateNewFormService', ['toggleComponent']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: CreateNewFormService, useValue: spy }
      ],
      declarations: [ AddQuestionComponent ]
    })
    .compileComponents();

    formServiceSpy = TestBed.inject(CreateNewFormService) as jasmine.SpyObj<CreateNewFormService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQuestionComponent);
    component = fixture.componentInstance;
    component.surveyQuestionFormArray = new FormArray<any>([]);
    component.qType = new Map();
    component.valType = new Map();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add option to options list', () => {
    component.newOption = 'Option Alpha';
    component.addOption();

    expect(component.options).toEqual(['Option Alpha']);
    expect(component.newOption).toBe('');
  });

  it('should push valid question form to surveyQuestionFormArray', () => {
    component.questionForm.get('question')?.setValue('Test Question?');
    component.questionForm.get('questionType')?.setValue('oneline');
    
    component.addQuestion();

    expect(component.surveyQuestionFormArray.length).toBe(1);
    expect(formServiceSpy.toggleComponent).toHaveBeenCalled();
  });
});
