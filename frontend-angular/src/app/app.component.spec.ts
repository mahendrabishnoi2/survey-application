import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const aSpy = jasmine.createSpyObj('AuthService', ['getIsLoggedIn', 'logout']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: aSpy },
        {
          provide: ElementRef,
          useValue: { nativeElement: { ownerDocument: { body: { style: { backgroundColor: '' } } } } }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have title`, () => {
    expect(component.title).toEqual('Campaign Registration Management System');
  });

  it('should call authService.logout and navigate on logout', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
