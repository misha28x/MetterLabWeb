import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
    private fb: FormBuilder
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
      phone: ''
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
    this.dataSv.sendData(url, this.setVerification());
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
      addingDate: new Date().getUTCDate() + '-' + new Date().getUTCMonth() + '-' + new Date().getUTCFullYear(),
      district: this.locationForm.get('district').value.replace(/'/g, /\'/),
      settlement: this.locationForm.get('district').value.replace(/'/g, /\'/),
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
      applicationNumber: '',
      brigadeName: '',
      note: this.additionalDataForm.get('note').value.replace(/'/g, /\'/),
      serviceProvider: this.locationForm.get('serviceProvider').value.replace(/'/g, /\'/),
      serviceType: this.locationForm.get('serviceType').value,
      stationNumber: '',
      status: '',
      symbol: this.counterForm.get('symbol').value,
      taskDate: ''
    };
  }
}
