import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CreateSurveyComponent } from './create-survey.component';
import { DbServiceService } from 'src/app/services/db-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { CreateNewFormService } from 'src/app/services/create-new-form.service';

describe('CreateSurveyComponent', () => {
  let component: CreateSurveyComponent;
  let fixture: ComponentFixture<CreateSurveyComponent>;
  let dbServiceSpy: jasmine.SpyObj<DbServiceService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    const dbSpy = jasmine.createSpyObj('DbServiceService', ['saveNewSurvey']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getIsLoggedIn']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        CreateNewFormService,
        { provide: DbServiceService, useValue: dbSpy },
        { provide: AuthService, useValue: authSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ CreateSurveyComponent ]
    })
    .compileComponents();

    dbServiceSpy = TestBed.inject(DbServiceService) as jasmine.SpyObj<DbServiceService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  }));

  beforeEach(() => {
    authServiceSpy.getIsLoggedIn.and.returnValue(true);
    fixture = TestBed.createComponent(CreateSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with expected controls', () => {
    expect(component.newSurveyForm.contains('surveyName')).toBeTrue();
    expect(component.newSurveyForm.contains('validTill')).toBeTrue();
    expect(component.newSurveyForm.contains('description')).toBeTrue();
  });

  it('should get minimum date in YYYY-MM-DD format', () => {
    const minDate = component.getMinDate();
    expect(minDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should submit survey and call dbService', () => {
    dbServiceSpy.saveNewSurvey.and.returnValue(of({ id: 1 }));
    component.newSurveyForm.get('surveyName')?.setValue('App Feedback');
    component.newSurveyForm.get('description')?.setValue('Review');
    component.newSurveyForm.get('validTill')?.setValue('2026-12-31');

    component.submitSurvey();
    expect(dbServiceSpy.saveNewSurvey).toHaveBeenCalled();
    expect(component.surveyLink).toBe('localhost:4200/takeSurvey/1');
  });
});
