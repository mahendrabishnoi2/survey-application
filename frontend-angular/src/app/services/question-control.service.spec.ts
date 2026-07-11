import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { QuestionControlService } from './question-control.service';

describe('QuestionControlService', () => {
  let service: QuestionControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
