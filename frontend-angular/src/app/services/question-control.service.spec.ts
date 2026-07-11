import { TestBed } from '@angular/core/testing';
import { QuestionControlService } from './question-control.service';
import { SurveyFull } from '../common/survey-full';
import { QuestionText } from '../common/question-text';

describe('QuestionControlService', () => {
  let service: QuestionControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map survey questions to QuestionBase objects', () => {
    const mockSurvey: SurveyFull = {
      id: 1,
      name: 'Test Survey',
      description: 'Desc',
      created: new Date(),
      validTill: new Date(),
      questions: [
        {
          id: 101,
          question: 'What is your name?',
          type: { id: 1, typeName: 'oneline' },
          validation: 'alpha',
          options: []
        }
      ]
    };

    const questions = service.getQuestions(mockSurvey);
    expect(questions.length).toBe(1);
    expect(questions[0].key).toBe('101');
    expect(questions[0].label).toBe('What is your name?');
    expect(questions[0].validation).toBe('alpha');
  });

  it('should create a FormGroup from QuestionBase list', () => {
    const question = new QuestionText({
      key: 'name',
      label: 'Your Name',
      required: true,
      validation: 'alpha'
    });

    const formGroup = service.toFormGroup([question]);
    expect(formGroup.contains('name')).toBeTrue();
    const control = formGroup.get('name');
    expect(control).toBeTruthy();
    expect(control?.valid).toBeFalse(); // since required is true and value is empty
  });
});
