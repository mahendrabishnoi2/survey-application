import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeSurveyQuestionsComponent } from './take-survey-questions.component';

describe('TakeSurveyQuestionsComponent', () => {
  let component: TakeSurveyQuestionsComponent;
  let fixture: ComponentFixture<TakeSurveyQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeSurveyQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeSurveyQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
