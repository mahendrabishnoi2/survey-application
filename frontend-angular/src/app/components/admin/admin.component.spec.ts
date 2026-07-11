import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { AdminComponent } from './admin.component';
import { DbServiceService } from 'src/app/services/db-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { SurveyHeader } from 'src/app/common/survey-header';
import { Admin } from 'src/app/common/admin';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let dbServiceSpy: jasmine.SpyObj<DbServiceService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const dbSpy = jasmine.createSpyObj('DbServiceService', ['getSurveyList']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getIsLoggedIn', 'getAdmin']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: DbServiceService, useValue: dbSpy },
        { provide: AuthService, useValue: authSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ AdminComponent ]
    })
    .compileComponents();

    dbServiceSpy = TestBed.inject(DbServiceService) as jasmine.SpyObj<DbServiceService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  }));

  beforeEach(() => {
    const mockHeaders: SurveyHeader[] = [{ id: 1, surveyName: 'Feedback Survey' }];
    dbServiceSpy.getSurveyList.and.returnValue(of(mockHeaders));
    const mockAdmin = new Admin();
    mockAdmin.id = 1;
    authServiceSpy.getAdmin.and.returnValue(mockAdmin);

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch survey list on init', () => {
    expect(dbServiceSpy.getSurveyList).toHaveBeenCalled();
    expect(component.surveyHeaders.length).toBe(1);
    expect(component.surveyHeaders[0].surveyName).toBe('Feedback Survey');
  });

  it('should call authService.getIsLoggedIn', () => {
    authServiceSpy.getIsLoggedIn.and.returnValue(true);
    expect(component.isLoggedIn()).toBeTrue();
  });

  it('should navigate to login on redirect', () => {
    component.redirect();
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });
});
