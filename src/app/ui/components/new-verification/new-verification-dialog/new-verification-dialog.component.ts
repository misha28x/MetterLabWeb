import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DataService } from 'src/app/services/data.service';
import { Verification } from 'src/app/interfaces/verifications';
import { VerificationService } from 'src/app/services/verification.service';

const url = 'http://localhost:3000/api/new-verifications';

@Component({
	selector: 'app-new-verification-dialog',
	templateUrl: './new-verification-dialog.component.html',
	styleUrls: ['./new-verification-dialog.component.scss']
})
export class NewVerificationDialogComponent implements OnInit, AfterContentInit {
	step: number;
	verification: Verification;

	generalDataForm: FormGroup;
	locationForm: FormGroup;
	counterForm: FormGroup;
	additionalDataForm: FormGroup;
  showForm: boolean;

  private url: string;

	constructor(
		private verificationSv: VerificationService,
    private dialogRef: MatDialogRef<NewVerificationDialogComponent>,
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

  ngAfterContentInit(): void {
    setTimeout(() => this.showForm = true , 150);
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
      favorDate: new Date(),
      favorTime: new Date(),
			sanitaryWellFare: '',
			waterAbsentTo: '',
			note: ''
		});
	}

	sendData(): void {
		this.dataSv.sendData(url, this.setVerification()).subscribe();
    this.dialogRef.close();
  }
  
  clearForm(): void {
    this.additionalDataForm.reset();
    this.generalDataForm.reset();
    this.locationForm.reset();
    this.counterForm.reset();
    this.step = 0;
  }
  
  saveByPattern(): void {
    this.dataSv.sendData(url, this.setVerification()).subscribe();

    this.step = 0;
    
    this.locationForm.patchValue({
      counterQuantity: 0,
      serviceType: '',
      serviceProvider: ''
    });
  }

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
      favorDate: this.additionalDataForm.get('favorDate').value.toISOString(),
      favorTime: this.additionalDataForm.get('favorTime').value.toISOString(),
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
}
