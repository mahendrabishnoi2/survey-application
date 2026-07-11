import { Injectable } from '@angular/core';
import { Admin } from '../common/admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private admin: Admin = new Admin();
  private isLoggedIn = false;

  constructor() {
    this.isLoggedIn = localStorage.getItem('admin') !== null;
    if (this.isLoggedIn) {
      this.admin = Object.assign(new Admin(), JSON.parse(localStorage.getItem('admin')!));
    }
  }

  login(adminJSON: any) {
    this.admin = Object.assign(new Admin(), adminJSON);
    this.isLoggedIn = true;
    localStorage.setItem('admin', JSON.stringify(this.admin));
  }

  getAdmin(): Admin | null {
    return this.isLoggedIn ? this.admin : null;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.admin = new Admin();
    localStorage.removeItem('admin');
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }
}
