import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Store, Action } from '@ngrx/store';

import { Admin, Metrology, ServiceProvider, User, Unauthorized } from '../../store/actions/permission.action';

import { DataService } from '../../services/data.service';
import { MenuService } from '../../services/menu.service';

const authUrl = 'http://localhost:3000/api/authorization';

@Component({
  selector: 'app-authorization-page',
  templateUrl: './authorization-page.component.html',
  styleUrls: ['./authorization-page.component.scss']
})
export class AuthorizationPageComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private store: Store<string>,
    private dataSv: DataService,
    private menuSv: MenuService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  authorization(): void {
    const authData = {
      email: '',
      pass: ''
    };

    authData.email = this.emailFormControl.value;
    authData.pass = this.passwordFormControl.value;

    this.dataSv.sendData(authUrl, authData).subscribe(res => {
      if (res.hasOwnProperty('error')) {
        return;
      }

      if (res.permission > 0) {
        this.redirectHome(res.permission);
      }

      this.store.dispatch(this.getPermission(res.permission));
    });
  }

  getPermission(permission: number): Action {
    if (permission === 4) {
      return new Admin();
    }

    if (permission === 3) {
      return new Metrology();
    }

    if (permission === 2) {
      return new ServiceProvider();
    }

    if (permission === 1) {
      return new User();
    }

    return new Unauthorized;
  }

  redirectHome(permission: any): void {
    let url: string;

    switch (permission) {
      case 1:
      case 4:
        url = 'default/home';
        break;
      case 2:
        url = 'default/verifications';
        break;
      case 3:
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
