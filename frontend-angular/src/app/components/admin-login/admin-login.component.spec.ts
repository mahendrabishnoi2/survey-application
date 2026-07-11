import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminLoginComponent } from './admin-login.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DbServiceService } from 'src/app/services/db-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { of, throwError } from 'rxjs';

describe('AdminLoginComponent', () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;
  let dbServiceSpy: jasmine.SpyObj<DbServiceService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    const dbSpy = jasmine.createSpyObj('DbServiceService', ['verifyLogin']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);
    const aSpy = jasmine.createSpyObj('AuthService', ['getIsLoggedIn', 'login']);

    aSpy.getIsLoggedIn.and.returnValue(false);

    TestBed.configureTestingModule({
      declarations: [AdminLoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: DbServiceService, useValue: dbSpy },
        { provide: Router, useValue: rSpy },
        { provide: AuthService, useValue: aSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    dbServiceSpy = TestBed.inject(DbServiceService) as jasmine.SpyObj<DbServiceService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form fields', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');
    expect(component.loginForm.valid).toBeFalse();

    emailControl?.setValue('admin@example.com');
    passwordControl?.setValue('password123');
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should redirect if login succeeds', () => {
    const mockAdminResponse = { id: 1, email: 'admin@example.com', fullName: 'Admin User', password: 'password123' };
    dbServiceSpy.verifyLogin.and.returnValue(of(mockAdminResponse));

    component.loginForm.get('email')?.setValue('admin@example.com');
    component.loginForm.get('password')?.setValue('password123');
    component.login();

    expect(dbServiceSpy.verifyLogin).toHaveBeenCalled();
    expect(authServiceSpy.login).toHaveBeenCalledWith(mockAdminResponse);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['admin']);
  });

  it('should set error message if login fails', () => {
    dbServiceSpy.verifyLogin.and.returnValue(of({ id: -1, email: '', fullName: '', password: '' }));

    component.loginForm.get('email')?.setValue('admin@example.com');
    component.loginForm.get('password')?.setValue('wrongpassword');
    component.login();

    expect(component.errorMsg).toBe('Invalid User name or password');
  });
});
