import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Campaign Registration Management System';

  constructor(private authService: AuthService, private router: Router, private elementRef: ElementRef) {}

  ngOnInit(): void {
    
  }

  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'yourColor';
 }

  isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }
}
