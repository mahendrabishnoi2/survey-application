import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QuestionComponent } from './question.component';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [QuestionComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    
    // Provide inputs
    component.form = new FormGroup({
      'q1': new FormControl('')
    });
    component.question = {
      key: 'q1',
      label: 'Test Question',
      controlType: 'oneline',
      type: 'text',
      required: true,
      order: 1,
      options: []
    } as any;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
