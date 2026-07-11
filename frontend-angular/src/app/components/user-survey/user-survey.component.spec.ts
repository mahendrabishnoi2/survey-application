import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';

import { UserSurveyComponent } from './user-survey.component';

describe('UserSurveyComponent', () => {
  let component: UserSurveyComponent;
  let fixture: ComponentFixture<UserSurveyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ UserSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the thank you message in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Thank You for completing survey.');
  });
});
