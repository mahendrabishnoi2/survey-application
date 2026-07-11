import { TestBed } from '@angular/core/testing';
import { CreateNewFormService } from './create-new-form.service';

describe('CreateNewFormService', () => {
  let service: CreateNewFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateNewFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default componentToShow to create-survey', () => {
    expect(service.enabledComponent()).toBe('create-survey');
  });

  it('should toggle componentToShow between create-survey and add-question', () => {
    service.toggleComponent();
    expect(service.enabledComponent()).toBe('add-question');

    service.toggleComponent();
    expect(service.enabledComponent()).toBe('create-survey');
  });

  it('should reset componentToShow to create-survey', () => {
    service.toggleComponent(); // sets to add-question
    service.reset();
    expect(service.enabledComponent()).toBe('create-survey');
  });

  it('should set componentToShow to survey-created on success', () => {
    service.success();
    expect(service.enabledComponent()).toBe('survey-created');
  });
});
