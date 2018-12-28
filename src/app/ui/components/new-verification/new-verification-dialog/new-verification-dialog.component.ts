import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DataService } from '../../../../services/data.service';
import { Verification } from '../../../../interfaces/verifications';

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
    private dialogRef: MatDialogRef<NewVerificationDialogComponent>,
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
      isUnique: false
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
    this.verification = {
      client: this.generalDataForm.get('surname').value + ' ' +
        this.generalDataForm.get('name').value + ' ' +
        this.generalDataForm.get('middlename'),
      phoneNumber: this.generalDataForm.get('phone').value,
      addingDate: new Date().getUTCDate() + '-' + new Date().getUTCMonth() + '-' + new Date().getUTCFullYear(),
      district: this.locationForm.get('district').value,
      settlement: this.locationForm.get('district').value,
      index: this.locationForm.get('index').value,
      street: this.locationForm.get('street').value,
      house: this.locationForm.get('house').value,
      apartment: this.locationForm.get('apartment').value,
      isDismantled: this.locationForm.get('isDismantled').value,
      montageDate: this.counterForm.get('montageDate').value,
      employeeName: this.counterForm.get('employeeName').value,
      comment: this.counterForm.get('comment').value,
      counterNumber: this.counterForm.get('counterNumber').value,
      haveSeal: this.counterForm.get('haveSeal').value,
      counterType: this.counterForm.get('counterType').value,
      productionYear: this.counterForm.get('productionYear').value,
      acumulatedVolume: this.counterForm.get('acumulatedVolume').value,
      applicationNumber: '',
      brigadeName: '',
      note: this.additionalDataForm.get('note').value,
      serviceProvider: '',
      stationNumber: '',
      status: '',
      symbol: '',
      taskDate: ''
    };

    this.dataSv.sendData(url, this.verification);
  }
}
