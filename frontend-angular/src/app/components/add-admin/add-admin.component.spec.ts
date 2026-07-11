import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AddAdminComponent } from './add-admin.component';
import { DbServiceService } from 'src/app/services/db-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { Admin } from 'src/app/common/admin';

describe('AddAdminComponent', () => {
  let component: AddAdminComponent;
  let fixture: ComponentFixture<AddAdminComponent>;
  let dbServiceSpy: jasmine.SpyObj<DbServiceService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    const dbSpy = jasmine.createSpyObj('DbServiceService', ['addAdmin']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getIsLoggedIn']);

    TestBed.configureTestingModule({
      imports: [FormsModule, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: DbServiceService, useValue: dbSpy },
        { provide: AuthService, useValue: authSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ AddAdminComponent ]
    })
    .compileComponents();

    dbServiceSpy = TestBed.inject(DbServiceService) as jasmine.SpyObj<DbServiceService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize newAdmin on ngOnInit', () => {
    expect(component.newAdmin.email).toBe('');
    expect(component.newAdmin.isPrimaryAdmin).toBe(1);
  });

  it('should call dbService.addAdmin and set adminAdded to true on submit', () => {
    dbServiceSpy.addAdmin.and.returnValue(of(new Admin()));
    component.addAdmin({});

    expect(dbServiceSpy.addAdmin).toHaveBeenCalledWith(component.newAdmin);
    expect(component.adminAdded).toBeTrue();
  });
});
