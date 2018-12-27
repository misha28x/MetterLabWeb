import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DataService } from '../../../../services/data.service';

const url = 'http://localhost:3000/api/new-verifications';

@Component({
  selector: 'app-new-verification-dialog',
  templateUrl: './new-verification-dialog.component.html',
  styleUrls: ['./new-verification-dialog.component.scss']
})
export class NewVerificationDialogComponent implements OnInit {
	step: number;

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

  send(): void {
    const testObj = {
      number: 12345,
      client: 'Vitalya',
      data: new Date()
    };

    this.dataSv.sendData(url, testObj).subscribe(() => {
      console.log('data sended');
    });
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
      coment: '',
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
      waterAbsent: '',
      note: ''
    });
  }
}
