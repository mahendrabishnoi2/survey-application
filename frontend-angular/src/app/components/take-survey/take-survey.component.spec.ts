import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { TakeSurveyComponent } from './take-survey.component';
import { DbServiceService } from 'src/app/services/db-service.service';
import { QuestionControlService } from 'src/app/services/question-control.service';
import { AuthService } from 'src/app/services/auth.service';

describe('TakeSurveyComponent', () => {
  let component: TakeSurveyComponent;
  let fixture: ComponentFixture<TakeSurveyComponent>;
  let dbServiceSpy: jasmine.SpyObj<DbServiceService>;

  beforeEach(waitForAsync(() => {
    const dbSpy = jasmine.createSpyObj('DbServiceService', ['getSurvey', 'verifyUser']);
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        QuestionControlService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: DbServiceService, useValue: dbSpy },
        { provide: AuthService, useValue: authSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ TakeSurveyComponent ]
    })
    .compileComponents();

    dbServiceSpy = TestBed.inject(DbServiceService) as jasmine.SpyObj<DbServiceService>;
  }));

  beforeEach(() => {
    const mockSurvey = {
      id: 1,
      name: 'E2E Customer Feedback',
      description: 'Desc',
      validTill: '2026-12-31',
      questions: []
    };
    dbServiceSpy.getSurvey.and.returnValue(of(mockSurvey as any));

    fixture = TestBed.createComponent(TakeSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load survey on init', () => {
    expect(dbServiceSpy.getSurvey).toHaveBeenCalled();
    expect(component.survey.name).toBe('E2E Customer Feedback');
  });

  it('should check if date is expired correctly', () => {
    const expired = component.compareDate('2020-01-01');
    expect(expired).toBeTrue();

    const notExpired = component.compareDate('2099-01-01');
    expect(notExpired).toBeFalse();
  });

  it('should verify user and toggle personal details input section', () => {
    dbServiceSpy.verifyUser.and.returnValue(of(false)); // user has not taken survey yet
    component.onSubmit();

    expect(dbServiceSpy.verifyUser).toHaveBeenCalled();
    expect(component.inputPersonalDetails).toBeFalse();
  });
});
