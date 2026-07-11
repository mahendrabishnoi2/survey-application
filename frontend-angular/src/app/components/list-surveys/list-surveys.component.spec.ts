import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { ListSurveysComponent } from './list-surveys.component';
import { DbServiceService } from 'src/app/services/db-service.service';
import { SurveyHeader } from 'src/app/common/survey-header';

describe('ListSurveysComponent', () => {
  let component: ListSurveysComponent;
  let fixture: ComponentFixture<ListSurveysComponent>;
  let dbServiceSpy: jasmine.SpyObj<DbServiceService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const dbSpy = jasmine.createSpyObj('DbServiceService', ['getSurveyList', 'deleteSurvey']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: DbServiceService, useValue: dbSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ ListSurveysComponent ]
    })
    .compileComponents();

    dbServiceSpy = TestBed.inject(DbServiceService) as jasmine.SpyObj<DbServiceService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  }));

  beforeEach(() => {
    const mockHeaders: SurveyHeader[] = [{ id: 1, surveyName: 'Test Survey' }];
    dbServiceSpy.getSurveyList.and.returnValue(of(mockHeaders));
    fixture = TestBed.createComponent(ListSurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list surveys on init', () => {
    expect(dbServiceSpy.getSurveyList).toHaveBeenCalled();
    expect(component.surveyHeaders.length).toBe(1);
    expect(component.surveyHeaders[0].surveyName).toBe('Test Survey');
  });

  it('should delete survey and navigate to login/refresh', () => {
    dbServiceSpy.deleteSurvey.and.returnValue(of({}));
    component.deleteSurvey(1);

    expect(dbServiceSpy.deleteSurvey).toHaveBeenCalledWith(1);
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });
});
