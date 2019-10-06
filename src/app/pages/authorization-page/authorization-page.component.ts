import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-authorization-page',
  templateUrl: './authorization-page.component.html',
  styleUrls: ['./authorization-page.component.scss']
})
export class AuthorizationPageComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required]);

  passwordFormControl = new FormControl('', [Validators.required]);

  constructor(
    private dataSv: DataService,
    private authSv: AuthService,
    private menuSv: MenuService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  authorization(): void {
    const authData = {
      email: '',
      pass: ''
    };

    authData.email = this.emailFormControl.value;
    authData.pass = this.passwordFormControl.value;

    this.authSv.authorization(authData).subscribe(res => {
      window.localStorage.setItem('user', JSON.stringify(res));
      window.localStorage.setItem('time', new Date().getTime().toString());
      console.log(res);
      this.redirectHome(res.permission);
    });
  }

  redirectHome(permission: any): void {
    let url: string;

    switch (permission) {
      case 1:
      case 2:
      case 3:
      case 4:
        url = 'default/tasks-planing';
        break;
      case 6:
        url = 'default/new-verifications';
        break;
      case 5:
        url = 'default/metrology';
        break;
      default:
        url = 'extra/auth';
        break;
    }

    setTimeout(() => {
      this.router.navigate([url], { replaceUrl: true });
    }, 0);
  }
}
