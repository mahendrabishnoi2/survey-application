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
