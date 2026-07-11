import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TakeSurveyQuestionsComponent } from './take-survey-questions.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { QuestionControlService } from 'src/app/services/question-control.service';
import { DbServiceService } from 'src/app/services/db-service.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TakeSurveyQuestionsComponent', () => {
  let component: TakeSurveyQuestionsComponent;
  let fixture: ComponentFixture<TakeSurveyQuestionsComponent>;
  let qcsSpy: jasmine.SpyObj<QuestionControlService>;
  let dbServiceSpy: jasmine.SpyObj<DbServiceService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    const qSpy = jasmine.createSpyObj('QuestionControlService', ['toFormGroup']);
    const dbSpy = jasmine.createSpyObj('DbServiceService', ['saveSurveyResponse']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    qSpy.toFormGroup.and.returnValue(new FormGroup({
      '1': new FormControl('Answer 1')
    }));
    dbSpy.saveSurveyResponse.and.returnValue(of({}));

    TestBed.configureTestingModule({
      declarations: [TakeSurveyQuestionsComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: QuestionControlService, useValue: qSpy },
        { provide: DbServiceService, useValue: dbSpy },
        { provide: Router, useValue: rSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    qcsSpy = TestBed.inject(QuestionControlService) as jasmine.SpyObj<QuestionControlService>;
    dbServiceSpy = TestBed.inject(DbServiceService) as jasmine.SpyObj<DbServiceService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeSurveyQuestionsComponent);
    component = fixture.componentInstance;

    // Provide required component @Input() bindings
    component.survey = { id: 1, name: 'Test Survey', description: 'Test Description', questions: [], created: new Date(), validTill: new Date() };
    component.details = new FormGroup({
      fullName: new FormControl('John Doe'),
      email: new FormControl('john@example.com'),
      submitDate: new FormControl('')
    });
    component.questions = [
      { key: '1', label: 'Question 1', controlType: 'oneline', type: 'text', required: true, order: 1, options: [] } as any
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process onSubmit and save response', () => {
    component.onSubmit();
    expect(dbServiceSpy.saveSurveyResponse).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['surveycompleted']);
  });
});
