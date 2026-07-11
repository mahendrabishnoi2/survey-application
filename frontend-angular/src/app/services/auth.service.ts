import { Injectable } from '@angular/core';
import { Admin } from '../common/admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  admin: Admin = new Admin();
  isLoggedIn = false;

  constructor() { }

  login(adminJSON: any) {
    this.admin = Object.assign(new Admin(), adminJSON);
    this.isLoggedIn = true;
    localStorage.setItem('admin', JSON.stringify(this.admin));
  }

  getAdmin(): any {
    const adminData = localStorage.getItem('admin');
    if (adminData != null) {
      this.admin = Object.assign(new Admin(), JSON.parse(adminData));
      return this.admin;
    }
    return null;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.admin = new Admin();
    localStorage.removeItem('admin');
  }

  hasItem(item: string): boolean {
    return localStorage.getItem(item) !== null;
  }

  getIsLoggedIn(): boolean {
    return !(this.getAdmin() === null);
  }
}
