import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
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
});
