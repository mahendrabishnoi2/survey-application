import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Campaign Registration Management System';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    
  }

  isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }
}
