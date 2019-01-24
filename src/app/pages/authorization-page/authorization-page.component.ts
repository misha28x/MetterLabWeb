import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { DataService } from '../../services/data.service';

const authUrl = 'http://localhost:3000/api/authorization/';

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

	constructor(private dataSv: DataService) { }

	ngOnInit() {
	}

	auth() {
		const authData = {
			email: '',
			pass: ''
		};

		authData.email = this.emailFormControl.value;
		authData.pass = this.passwordFormControl.value;

		return this.dataSv.sendData(authUrl, authData).subscribe(res => {
			if (res.hasOwnProperty('error')) {
				return;
			}
			
		});
	}
}
