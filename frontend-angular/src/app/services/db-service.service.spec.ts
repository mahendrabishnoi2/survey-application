import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DbServiceService } from './db-service.service';
import { Admin } from '../common/admin';

describe('DbServiceService', () => {
  let service: DbServiceService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DbServiceService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(DbServiceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getSurveyResponses and return data', () => {
    const mockResponses = [{ id: 1, answer: 'yes' }];
    service.getSurveyResponses(1).subscribe(res => {
      expect(res).toEqual(mockResponses);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/surveys/responses/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponses);
  });

  it('should call verifyLogin with admin credentials', () => {
    const admin = new Admin();
    admin.email = 'test@example.com';
    admin.password = 'password';
    
    service.verifyLogin(admin).subscribe(res => {
      expect(res).toEqual({ id: 1 });
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(admin);
    req.flush({ id: 1 });
  });
});
