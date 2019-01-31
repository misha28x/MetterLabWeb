import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

import { DataService } from 'src/app/services/data.service';
import { Verification } from 'src/app/interfaces/verifications';
import { VerificationService } from 'src/app/services/verification.service';

const url = 'http://localhost:3000/api/new-verifications';

@Component({
	selector: 'app-new-verification-dialog',
	templateUrl: './new-verification-dialog.component.html',
	styleUrls: ['./new-verification-dialog.component.scss']
})
export class NewVerificationDialogComponent implements OnInit {
	step: number;
	verification: Verification;

	generalDataForm: FormGroup;
	locationForm: FormGroup;
	counterForm: FormGroup;
	additionalDataForm: FormGroup;

	private url: string;

	constructor(
		private verificationSv: VerificationService,
		private dataSv: DataService,
		private fb: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	setStep(index: number): void {
		this.step = index;
	}

	nextStep(): void {
		this.step++;
	}

	prevStep(): void {
		this.step--;
	}

	ngOnInit(): void {
		this.generalDataForm = this.fb.group({
			surname: '',
			name: '',
			middlename: '',
			phone: '+380'
		});

		this.locationForm = this.fb.group({
			region: '',
			district: '',
			settlement: '',
			index: '',
			street: '',
			house: '',
			apartment: '',
			isDismantled: false,
			isUnique: false,
			counterQuantity: 0,
			serviceType: '',
			serviceProvider: ''
		});

		this.counterForm = this.fb.group({
			isDismantled: false,
			montageDate: '',
			employeeName: '',
			comment: '',
			counterNumber: '',
			haveSeal: '',
			counterType: '',
			productionYear: '',
			symbol: '',
			acumulatedVolume: ''
		});

		this.additionalDataForm = this.fb.group({
			entrance: '',
			doorCode: '',
			floor: '',
			favorDate: '',
			sanitaryWellFare: '',
			waterAbsentTo: '',
			note: ''
		});
	}

	sendData(): void {
		this.dataSv.sendData(url, this.setVerification())
			.subscribe(next => console.log);
	}
	// TODO: Переробити на адресу
	checkForDupliacates(): void {
		this.verificationSv.addVerification(this.setVerification());
	}

	setVerification(): Verification {
		const name = this.generalDataForm.get('name').value.replace(/'/g, /\'/);
		const surname = this.generalDataForm.get('surname').value.replace(/'/g, /\'/);
		const middlename = this.generalDataForm.get('middlename').value.replace(/'/g, /\'/);

		const fullName = `${surname} ${name} ${middlename}`;

		return {
			client: fullName,
			phoneNumber: this.generalDataForm.get('phone').value,
			addingDate: new Date().getUTCFullYear() + '-' + new Date().getUTCMonth() + 1 + '-' + new Date().getUTCDate(),
			region: this.locationForm.get('region').value.replace(/'/g, /\'/),
			district: this.locationForm.get('district').value.replace(/'/g, /\'/),
			settlement: this.locationForm.get('settlement').value.replace(/'/g, /\'/),
			index: this.locationForm.get('index').value,
			street: this.locationForm.get('street').value,
			house: this.locationForm.get('house').value,
			apartment: this.locationForm.get('apartment').value,
			isDismantled: this.locationForm.get('isDismantled').value,
			montageDate: this.counterForm.get('montageDate').value,
			employeeName: this.counterForm.get('employeeName').value.replace(/'/g, /\'/),
			comment: this.counterForm.get('comment').value.replace(/'/g, /\'/),
			counterNumber: this.counterForm.get('counterNumber').value,
			haveSeal: this.counterForm.get('haveSeal').value,
			counterType: this.counterForm.get('counterType').value,
			productionYear: this.counterForm.get('productionYear').value,
			acumulatedVolume: this.counterForm.get('acumulatedVolume').value,
			favorDate: this.additionalDataForm.get('favorDate').value,
			sanitaryWellfare: this.additionalDataForm.get('sanitaryWellFare').value,
			waterAbsentTo: this.additionalDataForm.get('waterAbsentTo').value,
			note: this.additionalDataForm.get('note').value,
			serviceProvider: this.locationForm.get('serviceProvider').value,
			serviceType: this.locationForm.get('serviceType').value,
			symbol: this.counterForm.get('symbol').value,
			counterQuantity: this.locationForm.get('counterQuantity').value,
			floor: this.additionalDataForm.get('floor').value,
			entrance: this.additionalDataForm.get('entrance').value
		};
	}

  // saveByPattern() {
  //   this.locationForm.patchValue(

  //   );
  // }
}
