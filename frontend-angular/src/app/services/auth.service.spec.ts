import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in admin, save to localStorage, and set isLoggedIn', () => {
    const mockAdmin = { id: 1, email: 'admin@test.com', fullName: 'Test Admin' };
    service.login(mockAdmin);

    expect(service.getIsLoggedIn()).toBeTrue();
    expect(localStorage.getItem('admin')).toBeTruthy();
    expect(service.getAdmin()?.email).toBe('admin@test.com');
  });

  it('should log out admin, clear localStorage, and reset status', () => {
    const mockAdmin = { id: 1, email: 'admin@test.com', fullName: 'Test Admin' };
    service.login(mockAdmin);
    service.logout();

    expect(service.getIsLoggedIn()).toBeFalse();
    expect(localStorage.getItem('admin')).toBeNull();
    expect(service.getAdmin()).toBeNull();
  });
});
