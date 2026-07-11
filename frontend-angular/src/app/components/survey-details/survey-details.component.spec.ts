import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SurveyDetailsComponent } from './survey-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DbServiceService } from 'src/app/services/db-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SurveyDetailsComponent', () => {
  let component: SurveyDetailsComponent;
  let fixture: ComponentFixture<SurveyDetailsComponent>;
  let dbServiceSpy: jasmine.SpyObj<DbServiceService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockSurvey = {
    id: 1,
    name: 'Test Survey',
    description: 'Test Description',
    created: '2026-07-11T10:00:00Z',
    validTill: '2026-07-12T10:00:00Z',
    questions: []
  };

  const mockRespondents = [
    { id: 1, fullName: 'John Doe', email: 'john@example.com', takenOn: '2026-07-11T10:05:00Z' }
  ];

  beforeEach(waitForAsync(() => {
    const dbSpy = jasmine.createSpyObj('DbServiceService', ['getSurvey', 'getSurveyRespondents', 'getSurveyResponses']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getIsLoggedIn']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    dbSpy.getSurvey.and.returnValue(of(mockSurvey));
    dbSpy.getSurveyRespondents.and.returnValue(of(mockRespondents));
    dbSpy.getSurveyResponses.and.returnValue(of([]));
    authSpy.getIsLoggedIn.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [SurveyDetailsComponent],
      providers: [
        { provide: DbServiceService, useValue: dbSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: rSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    dbServiceSpy = TestBed.inject(DbServiceService) as jasmine.SpyObj<DbServiceService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch survey details and responses on init', () => {
    expect(dbServiceSpy.getSurvey).toHaveBeenCalledWith(1);
    expect(dbServiceSpy.getSurveyRespondents).toHaveBeenCalledWith(1);
    expect(dbServiceSpy.getSurveyResponses).toHaveBeenCalledWith(1);
    expect(component.surveyDetails).toEqual(mockSurvey as any);
    expect(component.respondents).toEqual(mockRespondents as any);
  });
});
