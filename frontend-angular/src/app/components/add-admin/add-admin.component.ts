import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Admin } from 'src/app/common/admin';
import { DbServiceService } from 'src/app/services/db-service.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {

  newAdmin: Admin = new Admin();
  adminAdded: boolean = false;

  constructor(private dbService: DbServiceService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.newAdmin.initialize();
  }

  addAdmin(f: any) {
    this.dbService.addAdmin(this.newAdmin).subscribe(
      data => {
        console.log(data);
      }
    )
    console.log(this.newAdmin);
    this.adminAdded = true;
  }

  isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  redirect(): void {
    this.router.navigate(['login']);
  }

}
