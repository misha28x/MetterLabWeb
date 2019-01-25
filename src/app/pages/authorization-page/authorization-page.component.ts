import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

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
		Validators.required,
		Validators.email
	]);

	passwordFormControl = new FormControl('', [
		Validators.required
	]);

	constructor(
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
      
      this.redirectHome();
      
      setTimeout(() => {
        this.menuSv.setMenu(res.menu);
      }, 10);
		});
	}

  redirectHome(): void {
    setTimeout(() => {
      this.router.navigate(['default/home'], { replaceUrl: true });
    }, 0);
  }
}
