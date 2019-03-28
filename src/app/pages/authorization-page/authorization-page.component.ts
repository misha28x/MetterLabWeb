import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { login } from '../../store/actions/permission.action';

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

      console.log({ res: res.permission > 0});
      if (parseInt(res.permission) > 0) {
        this.redirectHome(res.permission);
      }

      window.localStorage.setItem('user', JSON.stringify(res));
      window.localStorage.setItem('time', new Date().getTime().toString());
      this.store.dispatch(login(res));
    });
  }

  redirectHome(permission: any): void {
    let url: string;

    switch (permission) {
      case 1:
      case 2:
      case 3:
      case 4:
        url = 'default/home';
        break;
      case 6:
        url = 'default/verifications';
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
